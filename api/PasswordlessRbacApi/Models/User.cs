using System;
using System.ComponentModel.DataAnnotations;

namespace PasswordlessRbacApi.Models
{
    public class User
    {
        public int Id { get; set; }

        [Required]
        public string Email { get; set; } = default!;

        public string SecretKey { get; set; } = default!;

        // ✅ Display Name (opsiyonel)
        public string DisplayName { get; set; } = "";

        // ✅ Recovery Codes JSON
        public string? RecoveryCodesJson { get; set; } = "[]";

        // ✅ NOT USED ANYMORE BUT KEEP FOR FUTURE
        public string? AuthSecret { get; set; }

        public bool Is2FAEnabled { get; set; } = false;

        public string Role { get; set; } = "Viewer";

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
