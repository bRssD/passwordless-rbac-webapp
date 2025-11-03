using System.Security.Cryptography;

namespace YourProject.Helpers
{
    public static class RecoveryCodeGenerator
    {
        public static List<string> GenerateCodes(int count = 8)
        {
            var codes = new List<string>();
            var rng = RandomNumberGenerator.Create();

            for (int i = 0; i < count; i++)
            {
                byte[] bytes = new byte[4];
                rng.GetBytes(bytes);
                string code = BitConverter.ToUInt32(bytes, 0).ToString("X8");
                codes.Add(code);
            }

            return codes;
        }
    }
}
