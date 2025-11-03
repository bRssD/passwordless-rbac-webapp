namespace PasswordlessRbacApi.Dtos
{
    // Authenticator'dan gelen 6 haneli kodu doğrulamak için
    public class VerifyDto
    {
        public string Email { get; set; } = default!;
        public string Code  { get; set; } = default!; // 6 haneli TOTP
    }
}
