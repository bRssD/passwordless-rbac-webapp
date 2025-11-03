namespace PasswordlessRbacApi.Dtos
{
    public class EnrollDto
    {
        public string Email { get; set; } = "";
        public string? DisplayName { get; set; }   // optional; UI'dan gelebilir
    }
}
