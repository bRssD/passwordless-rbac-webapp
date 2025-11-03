using Microsoft.EntityFrameworkCore;
using PasswordlessRbacApi.Models;

namespace PasswordlessRbacApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        public DbSet<User> Users => Set<User>();
    }
}
