using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Reflection.Emit;
using VU.System.Entities.DataEntities;

namespace VU.System.EntityFrameworkCore
{
    public class VUDbContext : DbContext
    {
        public DbSet<Users> Users { get; set; }

        public VUDbContext(DbContextOptions<VUDbContext> options) : base(options)
        {
        }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) { }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Users>(entity =>
            {
                entity.ToTable("User");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id)
                    .ValueGeneratedOnAdd()
                    .IsRequired();

                entity.Property(e => e.Username)
                    .IsUnicode(false)
                    .HasMaxLength(50)
                    .IsRequired();

                entity.Property(e => e.Password)
                    .IsUnicode()
                    .HasMaxLength(100)
                    .IsRequired();

                entity.Property(e => e.Email)
                    .IsRequired(false);

                entity.Property(e => e.Phone)
                    .HasColumnType("VARCHAR(50)");

                entity.Property(e => e.FullName)
                .HasColumnType("NVARCHAR(128)");

                entity.Property(e => e.BirthDay);

                entity.Property(e => e.Sex)
                    .HasColumnType("VARCHAR(5)");

                entity.Property(e => e.CCCD)
                    .HasColumnType("VARCHAR(50)");

                entity.Property(e => e.Avatar)
                    .HasColumnType("VARCHAR(1024)");

                entity.Property(e => e.Address)
                    .IsRequired(false);

                entity.Property(e => e.Description)
                    .HasColumnType("VARCHAR(1024)");

                entity.Property(e => e.IdentifierCode)
                    .HasColumnType("VARCHAR(20)");

                entity.Property(e => e.IsIdentifier)
                    .HasColumnType("VARCHAR(20)")
                    .HasDefaultValue("N");

                entity.Property(e => e.Status)
                    .HasColumnType("VARCHAR(20)")
                    .HasDefaultValue("N");

                entity.Property(e => e.CreatedBy)
                    .HasColumnType("VARCHAR(50)");

                entity.Property(e => e.CreatedDate)
                    .HasColumnType("DATETIME")
                    .HasDefaultValueSql("getdate()");

                entity.Property(e => e.ModifiedBy)
                    .HasColumnType("VARCHAR(20)");

                entity.Property(e => e.ModifiedDate);

                entity.Property(e => e.Deleted)
                    .HasColumnType("VARCHAR(20)")
                    .HasDefaultValue("N");
            });

        }
    }
}
