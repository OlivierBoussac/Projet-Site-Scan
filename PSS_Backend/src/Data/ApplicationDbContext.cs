using Microsoft.EntityFrameworkCore;
using PSS_Backend.src.Models;

namespace PSS_Backend.src.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) 
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Sub> Subs { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            // Configuration de la relation User -> Sub (1 à plusieurs)
            modelBuilder.Entity<Sub>()
                .HasOne(s => s.User)
                .WithMany(u => u.Subs)
                .HasForeignKey(s => s.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Index unique sur l'email
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();
        }
    }
}
