using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using OtpNet;
using PasswordlessRbacApi.Data;
using PasswordlessRbacApi.Models;

namespace PasswordlessRbacApi.Services
{
    public class AuthService
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;

        public AuthService(AppDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        // ✅ JWT üret
        public string GenerateJwt(User user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddDays(7),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        // ✅ Recovery Codes üret (5 tane) — ARRAY döner
        public List<string> GenerateRecoveryCodes()
        {
            var list = new List<string>();
            for (int i = 0; i < 5; i++)
                list.Add(Guid.NewGuid().ToString("N").Substring(0, 10).ToUpper());

            return list;
        }

        // ✅ TOTP doğrulama
        public bool ValidateTotp(string secretBase32, string? codeRaw)
        {
            var code = (codeRaw ?? "").Trim();
            if (code.Length != 6) return false;

            var secretBytes = Base32Encoding.ToBytes(secretBase32);
            var totp = new Totp(secretBytes, step: 30, mode: OtpHashMode.Sha1, totpSize: 6);

            return totp.VerifyTotp(code, out _, new VerificationWindow(previous: 1, future: 1));
        }
    }
}
