using PasswordlessRbacApi.Dtos;
using Microsoft.AspNetCore.Mvc;
using PasswordlessRbacApi.Services;
using PasswordlessRbacApi.Models;
using QRCoder;
using OtpNet;
using Microsoft.EntityFrameworkCore;
using PasswordlessRbacApi.Data;
using System.Text.Json;

namespace PasswordlessRbacApi.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly AuthService _authService;

        public AuthController(AppDbContext context, AuthService authService)
        {
            _context = context;
            _authService = authService;
        }

        // ✅ Kullanıcı kayıt (ilk MFA setup)
        [HttpPost("enroll")]
        public async Task<IActionResult> Enroll([FromBody] EnrollDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Email))
                return BadRequest("Email is required.");

            var user = await _context.Users.FirstOrDefaultAsync(x => x.Email == dto.Email);

            if (user == null)
            {
                var secretKey = KeyGeneration.GenerateRandomKey(20);
                var base32Secret = Base32Encoding.ToString(secretKey);
                var codes = _authService.GenerateRecoveryCodes();

                // ✅ Sistemde kullanıcı yoksa ilk kullanıcı admin olur
                var isFirstUser = !await _context.Users.AnyAsync();

                // Kullanıcı isim girdiyse onu al, yoksa email @ öncesi kısmı kullan
                var displayName = string.IsNullOrWhiteSpace(dto.DisplayName)
                    ? dto.Email.Split('@')[0]
                    : dto.DisplayName.Trim();

                user = new User
                {
                    Email = dto.Email.Trim(),
                    DisplayName = displayName,
                    SecretKey = base32Secret,
                    IsActive = true,
                    Role = isFirstUser ? "Admin" : "Viewer", // ✅ Yeni logic
                    CreatedAt = DateTime.UtcNow,
                    RecoveryCodesJson = JsonSerializer.Serialize(codes)
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();
            }

            string otpUrl = $"otpauth://totp/PasswordlessApp:{user.Email}?secret={user.SecretKey}&issuer=PasswordlessApp";

            var qrGen = new QRCodeGenerator();
            var qrData = qrGen.CreateQrCode(otpUrl, QRCodeGenerator.ECCLevel.Q);
            string qrBase64 = $"data:image/png;base64,{Convert.ToBase64String(new PngByteQRCode(qrData).GetGraphic(10))}";

            return Ok(new { qrCode = qrBase64, secret = user.SecretKey });
        }

        public class VerifyDto
        {
            public string email { get; set; } = "";
            public string code { get; set; } = "";
        }

        // ✅ MFA Verification (TOTP veya Recovery Code)
        [HttpPost("verify")]
        public async Task<IActionResult> Verify([FromBody] VerifyDto body)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x => x.Email == body.email);
            if (user == null) return Unauthorized("User not found");

            // ✅ TOTP doğrulama
            if (_authService.ValidateTotp(user.SecretKey, body.code))
                return Ok(new { token = _authService.GenerateJwt(user) });

            // ✅ Recovery Code doğrulama
            var codes = string.IsNullOrEmpty(user.RecoveryCodesJson)
                ? new List<string>()
                : JsonSerializer.Deserialize<List<string>>(user.RecoveryCodesJson) ?? new List<string>();

            if (codes.Contains(body.code))
            {
                var remaining = codes.Where(c => c != body.code).ToList();
                user.RecoveryCodesJson = JsonSerializer.Serialize(remaining);
                await _context.SaveChangesAsync();

                return Ok(new { token = _authService.GenerateJwt(user), usedRecovery = true });
            }

            return Unauthorized("Invalid code");
        }
    }
}
