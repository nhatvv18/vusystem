﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using VU.System.EntityFrameworkCore;

#nullable disable

namespace VU.System.Migrations
{
    [DbContext(typeof(VUDbContext))]
    partial class VUDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "6.0.8")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder, 1L, 1);

            modelBuilder.Entity("VU.System.Entities.DataEntities.Users", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"), 1L, 1);

                    b.Property<string>("Address")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Avatar")
                        .IsRequired()
                        .HasColumnType("VARCHAR(1024)");

                    b.Property<DateTime?>("BirthDay")
                        .HasColumnType("datetime2");

                    b.Property<string>("CCCD")
                        .IsRequired()
                        .HasColumnType("VARCHAR(50)");

                    b.Property<string>("CreatedBy")
                        .IsRequired()
                        .HasColumnType("VARCHAR(50)");

                    b.Property<DateTime?>("CreatedDate")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("DATETIME")
                        .HasDefaultValueSql("getdate()");

                    b.Property<string>("Deleted")
                        .IsRequired()
                        .ValueGeneratedOnAdd()
                        .HasColumnType("VARCHAR(20)")
                        .HasDefaultValue("N");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("VARCHAR(1024)");

                    b.Property<string>("Email")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("FullName")
                        .IsRequired()
                        .HasColumnType("NVARCHAR(128)");

                    b.Property<string>("IdentifierCode")
                        .IsRequired()
                        .HasColumnType("VARCHAR(20)");

                    b.Property<string>("IsIdentifier")
                        .IsRequired()
                        .ValueGeneratedOnAdd()
                        .HasColumnType("VARCHAR(20)")
                        .HasDefaultValue("N");

                    b.Property<string>("ModifiedBy")
                        .IsRequired()
                        .HasColumnType("VARCHAR(20)");

                    b.Property<DateTime?>("ModifiedDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasMaxLength(100)
                        .IsUnicode(true)
                        .HasColumnType("nvarchar(100)");

                    b.Property<string>("Phone")
                        .IsRequired()
                        .HasColumnType("VARCHAR(50)");

                    b.Property<string>("Sex")
                        .IsRequired()
                        .HasColumnType("VARCHAR(5)");

                    b.Property<string>("Status")
                        .IsRequired()
                        .ValueGeneratedOnAdd()
                        .HasColumnType("VARCHAR(20)")
                        .HasDefaultValue("N");

                    b.Property<string>("Username")
                        .IsRequired()
                        .HasMaxLength(50)
                        .IsUnicode(false)
                        .HasColumnType("varchar(50)");

                    b.HasKey("Id");

                    b.ToTable("User", (string)null);
                });
#pragma warning restore 612, 618
        }
    }
}