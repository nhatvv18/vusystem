
using Microsoft.EntityFrameworkCore;
using VU.SeverSystem.Entities.DataEntities;

namespace VU.SeverSystem.EntityFrameworkCore
{
    public class VUDbContext : DbContext
    {
        public DbSet<Users> Users { get; set; }
        public DbSet<Investors> Investors { get; set; }
        public DbSet<CoreBanks> CoreBanks { get; set; }
        public DbSet<InvestorIdentification> InvestorIdentification { get; set; }
        public DbSet<InvestorBanks> InvestorBanks { get; set; }
        public DbSet<InvestorContractAddress> InvestorContractAddress { get; set; }

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

                entity.Property(e => e.InvestorId)
                   .IsRequired(false);

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

                entity.Property(e => e.UserType)
                   .HasColumnType("VARCHAR(20)")
                   .HasDefaultValue("I")
                   .IsRequired(false);

                entity.Property(e => e.Status)
                    .HasColumnType("VARCHAR(20)")
                    .HasDefaultValue("A")
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

            modelBuilder.Entity<Investors>(entity =>
            {
                entity.ToTable("Investors");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id)
                    .ValueGeneratedOnAdd()
                    .IsRequired();

                entity.Property(e => e.TaxCode)
                   .HasColumnType("VARCHAR(50)")
                   .IsRequired(false);

                entity.Property(e => e.Email)
                    .IsRequired(false);

                entity.Property(e => e.Phone)
                    .HasColumnType("VARCHAR(50)")
                    .IsRequired(false);

                entity.Property(e => e.Avatar)
                    .HasColumnType("VARCHAR(1024)")
                    .IsRequired(false);

                entity.Property(e => e.Status)
                    .HasColumnType("VARCHAR(20)")
                    .HasDefaultValue("1")
                    .IsRequired(false);

                entity.Property(e => e.IsTemp)
                    .HasDefaultValue(1)
                   .IsRequired(false);
                entity.Property(e => e.TradingProviderId)
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
                    .HasDefaultValue("N")
                    .IsRequired(false);
            });
            
            modelBuilder.Entity<InvestorIdentification>(entity =>
            {
                entity.ToTable("InvestorIdentification");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id)
                    .ValueGeneratedOnAdd()
                    .IsRequired();

                entity.Property(e => e.InvestorId)
                    .IsRequired(false);

                entity.Property(e => e.IdType)
                    .HasColumnType("VARCHAR(50)")
                    .IsRequired(false);

                entity.Property(e => e.IdNo)
                    .HasColumnType("VARCHAR(50)")
                    .IsRequired(false);

                entity.Property(e => e.FullName)
                    .HasColumnType("NVARCHAR(50)")
                    .IsRequired(false);

                entity.Property(e => e.BirthDay)
                    .HasColumnType("DATETIME")
                    .IsRequired(false);

                entity.Property(e => e.CreatedBy)
                   .HasColumnType("VARCHAR(50)")
                   .IsRequired(false);
                entity.Property(e => e.Nationality)
                    .HasColumnType("NVARCHAR(50)")
                    .IsRequired(false);

                entity.Property(e => e.Sex)
                    .HasColumnType("NVARCHAR(50)")
                    .IsRequired(false);

                entity.Property(e => e.PlaceOfResidence)
                   .HasColumnType("VARCHAR(50)")
                   .IsRequired(false);

                entity.Property(e => e.IdFrontImageUrl)
                   .HasColumnType("VARCHAR(512)")
                   .IsRequired(false);

                entity.Property(e => e.IdBackImageUrl)
                   .HasColumnType("VARCHAR(512)")
                   .IsRequired(false);

                entity.Property(e => e.PlaceOfOrigin)
                   .HasColumnType("NVARCHAR(50)")
                   .IsRequired(false);

                entity.Property(e => e.IdIssuer)
                   .HasColumnType("NVARCHAR(50)")
                   .IsRequired(false);

                entity.Property(e => e.IdDate)
                   .HasColumnType("DATETIME")
                   .IsRequired(false);

                entity.Property(e => e.IdExpriredDate)
                   .HasColumnType("DATETIME")
                   .IsRequired(false);

                entity.Property(e => e.IsDefault)
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
                    .HasDefaultValue("N")
                    .IsRequired(false);
            });

            modelBuilder.Entity<InvestorBanks>(entity =>
            {
                entity.ToTable("InvestorBanks");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id)
                    .ValueGeneratedOnAdd()
                    .IsRequired();
                entity.Property(e => e.InvestorId)
                    .IsRequired(false);

                entity.Property(e => e.BankId)
                    .IsRequired(false);

                entity.Property(e => e.BankAccount)
                   .HasColumnType("VARCHAR(50)")
                   .IsRequired(false);

                entity.Property(e => e.OwnerAccount)
                    .IsRequired(false);

                entity.Property(e => e.IsDefault)
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
                    .HasDefaultValue("N")
                    .IsRequired(false);
            });

            modelBuilder.Entity<InvestorContractAddress>(entity =>
            {
                entity.ToTable("InvestorContractAddress");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id)
                    .ValueGeneratedOnAdd()
                    .IsRequired();
                entity.Property(e => e.InvestorId)
                    .IsRequired(false);

                entity.Property(e => e.WardCode)
                   .HasColumnType("VARCHAR(50)")
                   .IsRequired(false);

                entity.Property(e => e.DistrictCode)
                    .IsRequired(false);
                entity.Property(e => e.ProviceCode)
                    .IsRequired(false);
                entity.Property(e => e.DetailAddress)
                    .IsRequired(false);
                entity.Property(e => e.ContractAddress)
                    .IsRequired(false);

                entity.Property(e => e.IsDefault)
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
                    .HasDefaultValue("N")
                    .IsRequired(false);
            });

            modelBuilder.Entity<CoreBanks>(entity =>
            {
                entity.ToTable("CoreBanks");
                entity.HasKey(e => e.BankId);
                entity.Property(e => e.BankId)
                    .ValueGeneratedOnAdd()
                    .IsRequired();

                entity.Property(e => e.BankCode)
                   .HasColumnType("VARCHAR(50)")
                   .IsRequired(false);

                entity.Property(e => e.FullBankName)
                    .IsRequired(false);

                entity.Property(e => e.BankCode)
                    .HasColumnType("VARCHAR(50)")
                    .IsRequired(false);     
            });

        }
    }
}
