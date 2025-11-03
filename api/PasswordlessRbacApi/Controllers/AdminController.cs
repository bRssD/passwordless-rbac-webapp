using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PasswordlessRbacApi.Data;
using PasswordlessRbacApi.Services;
using OtpNet;
using QRCoder;
using System.Text.Json;

namespace PasswordlessRbacApi.Controllers
{
    [ApiController]
    [Route("api/admin")]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly AuthService _authService;

        public AdminController(AppDbContext context, AuthService authService)
        {
            _context = context;
            _authService = authService;
        }

        // ✅ Kullanıcıları listele
        [HttpGet("users")]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _context.Users
                .OrderByDescending(u => u.CreatedAt)
                .Select(u => new { u.Id, u.Email, u.DisplayName, u.Role, u.IsActive, u.CreatedAt })
                .ToListAsync();

            return Ok(users);
        }

        // ✅ Aktif/pasif yap
        [HttpPost("toggle-active/{id}")]
        public async Task<IActionResult> ToggleActive(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();

            user.IsActive = !user.IsActive;
            await _context.SaveChangesAsync();
            return Ok(new { active = user.IsActive });
        }

        // ✅ Admin yap
        [HttpPost("make-admin/{id}")]
        public async Task<IActionResult> MakeAdmin(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();

            user.Role = "Admin";
            await _context.SaveChangesAsync();
            return Ok();
        }

        // ✅ Viewer yap
        [HttpPost("make-viewer/{id}")]
        public async Task<IActionResult> MakeViewer(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();

            user.Role = "Viewer";
            await _context.SaveChangesAsync();
            return Ok();
        }

        // ✅ Kullanıcı sil
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound("User not found");

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return Ok("User deleted");
        }

        // ✅ Recovery codes getir
        [HttpGet("recovery-codes/{id}")]
        public async Task<IActionResult> GetRecoveryCodes(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();

            var codes = string.IsNullOrWhiteSpace(user.RecoveryCodesJson)
                ? new List<string>()
                : JsonSerializer.Deserialize<List<string>>(user.RecoveryCodesJson) ?? new List<string>();

            return Ok(codes);
        }

        // ✅ Yeni recovery codes üret
        [HttpPost("recovery-codes/{id}/generate")]
        public async Task<IActionResult> GenerateRecoveryCodes(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();

            var codes = _authService.GenerateRecoveryCodes();
            user.RecoveryCodesJson = JsonSerializer.Serialize(codes);
            await _context.SaveChangesAsync();

            return Ok(codes);
        }

        // ✅ MFA sıfırla (yeni secret + QR + recovery codes)
        [HttpPost("reset-mfa/{id}")]
        public async Task<IActionResult> ResetMfa(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();

            var newSecret = Base32Encoding.ToString(KeyGeneration.GenerateRandomKey(20));
            user.SecretKey = newSecret;

            var newCodes = _authService.GenerateRecoveryCodes();
            user.RecoveryCodesJson = JsonSerializer.Serialize(newCodes);

            await _context.SaveChangesAsync();

            string otpUrl = $"otpauth://totp/PasswordlessApp:{user.Email}?secret={newSecret}&issuer=PasswordlessApp";
            var qrGen = new QRCodeGenerator();
            var qrData = qrGen.CreateQrCode(otpUrl, QRCodeGenerator.ECCLevel.Q);
            string qrBase64 = $"data:image/png;base64,{Convert.ToBase64String(new PngByteQRCode(qrData).GetGraphic(10))}";

            return Ok(new { secret = newSecret, qrCode = qrBase64, codes = newCodes });
        }
    }
}
