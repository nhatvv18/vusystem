
using Microsoft.EntityFrameworkCore;
using VU.SeverSystem.Entities.DataEntities;

namespace VU.SeverSystem.EntityFrameworkCore
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
                    .HasColumnType("VARCHAR(50)")
                    .IsRequired(false);

                entity.Property(e => e.FullName)
                .HasColumnType("NVARCHAR(128)")
                .IsRequired(false);

                entity.Property(e => e.BirthDay)
                .IsRequired(false);

                entity.Property(e => e.Sex)
                    .HasColumnType("VARCHAR(5)")
                    .IsRequired(false);

                entity.Property(e => e.CCCD)
                    .HasColumnType("VARCHAR(50)")
                    .IsRequired(false);

                entity.Property(e => e.Avatar)
                    .HasColumnType("VARCHAR(1024)")
                    .IsRequired(false);

                entity.Property(e => e.Address)
                    .IsRequired(false);

                entity.Property(e => e.Description)
                    .HasColumnType("VARCHAR(1024)")
                    .IsRequired(false);

                entity.Property(e => e.IdentifierCode)
                    .HasColumnType("VARCHAR(20)")
                    .IsRequired(false);

                entity.Property(e => e.IsIdentifier)
                    .HasColumnType("VARCHAR(20)")
                    .HasDefaultValue("N")
                    .IsRequired(false);

                entity.Property(e => e.Status)
                    .HasColumnType("VARCHAR(20)")
                    .HasDefaultValue("N")
                    .IsRequired(false);

                entity.Property(e => e.CreatedBy)
                    .HasColumnType("VARCHAR(50)")
                    .IsRequired(false);

                entity.Property(e => e.CreatedDate)
                    .HasColumnType("DATETIME")
                    .HasDefaultValueSql("getdate()")
                    .IsRequired(false);

                entity.Property(e => e.ModifiedBy)
                    .HasColumnType("VARCHAR(20)")
                    .IsRequired(false);

                entity.Property(e => e.ModifiedDate)
                    .IsRequired(false);

                entity.Property(e => e.Deleted)
                    .HasColumnType("VARCHAR(20)")
                    .HasDefaultValue("N");
            });

        }
    }
}
