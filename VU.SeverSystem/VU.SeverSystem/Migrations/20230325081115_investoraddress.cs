using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VU.SeverSystem.Migrations
{
    public partial class investoraddress : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Address",
                table: "Investors");

            migrationBuilder.DropColumn(
                name: "BirthDay",
                table: "Investors");

            migrationBuilder.DropColumn(
                name: "CCCD",
                table: "Investors");

            migrationBuilder.DropColumn(
                name: "FullName",
                table: "Investors");

            migrationBuilder.DropColumn(
                name: "IdBackImageUrl",
                table: "Investors");

            migrationBuilder.DropColumn(
                name: "IdFrontImageUrl",
                table: "Investors");

            migrationBuilder.DropColumn(
                name: "Sex",
                table: "Investors");

            migrationBuilder.CreateTable(
                name: "InvestorBanks",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    InvestorId = table.Column<int>(type: "int", nullable: true),
                    BankId = table.Column<int>(type: "int", nullable: true),
                    OwnerAccount = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BankAccount = table.Column<string>(type: "VARCHAR(50)", nullable: true),
                    IsDefault = table.Column<string>(type: "VARCHAR(50)", nullable: true),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "DATETIME", nullable: true, defaultValueSql: "getdate()"),
                    ModifiedBy = table.Column<string>(type: "VARCHAR(20)", nullable: true),
                    ModifiedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Deleted = table.Column<string>(type: "VARCHAR(20)", nullable: true, defaultValue: "N")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InvestorBanks", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "InvestorContractAddress",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    InvestorId = table.Column<int>(type: "int", nullable: true),
                    WardCode = table.Column<string>(type: "VARCHAR(50)", nullable: true),
                    DistrictCode = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ProviceCode = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DetailAddress = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ContractAddress = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsDefault = table.Column<string>(type: "VARCHAR(50)", nullable: true),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "DATETIME", nullable: true, defaultValueSql: "getdate()"),
                    ModifiedBy = table.Column<string>(type: "VARCHAR(20)", nullable: true),
                    ModifiedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Deleted = table.Column<string>(type: "VARCHAR(20)", nullable: true, defaultValue: "N")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InvestorContractAddress", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "InvestorIdentification",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    InvestorId = table.Column<int>(type: "int", nullable: true),
                    IdType = table.Column<string>(type: "VARCHAR(50)", nullable: true),
                    IdNo = table.Column<string>(type: "VARCHAR(50)", nullable: true),
                    FullName = table.Column<string>(type: "VARCHAR(50)", nullable: true),
                    BirthDay = table.Column<DateTime>(type: "DATETIME", nullable: true),
                    Nationality = table.Column<string>(type: "VARCHAR(50)", nullable: true),
                    Sex = table.Column<string>(type: "VARCHAR(50)", nullable: true),
                    PlaceOfResidence = table.Column<string>(type: "VARCHAR(50)", nullable: true),
                    IdFrontImageUrl = table.Column<string>(type: "VARCHAR(50)", nullable: true),
                    IdBackImageUrl = table.Column<string>(type: "VARCHAR(50)", nullable: true),
                    PlaceOfOrigin = table.Column<string>(type: "VARCHAR(50)", nullable: true),
                    IdIssuer = table.Column<string>(type: "VARCHAR(50)", nullable: true),
                    IdDate = table.Column<DateTime>(type: "DATETIME", nullable: true),
                    IdExpriredDate = table.Column<DateTime>(type: "DATETIME", nullable: true),
                    IsDefault = table.Column<string>(type: "VARCHAR(50)", nullable: true),
                    CreatedBy = table.Column<string>(type: "VARCHAR(50)", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "DATETIME", nullable: true, defaultValueSql: "getdate()"),
                    ModifiedBy = table.Column<string>(type: "VARCHAR(20)", nullable: true),
                    ModifiedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Deleted = table.Column<string>(type: "VARCHAR(20)", nullable: true, defaultValue: "N")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InvestorIdentification", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "InvestorBanks");

            migrationBuilder.DropTable(
                name: "InvestorContractAddress");

            migrationBuilder.DropTable(
                name: "InvestorIdentification");

            migrationBuilder.AddColumn<string>(
                name: "Address",
                table: "Investors",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "BirthDay",
                table: "Investors",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CCCD",
                table: "Investors",
                type: "VARCHAR(50)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FullName",
                table: "Investors",
                type: "NVARCHAR(128)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "IdBackImageUrl",
                table: "Investors",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "IdFrontImageUrl",
                table: "Investors",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Sex",
                table: "Investors",
                type: "VARCHAR(5)",
                nullable: true);
        }
    }
}
