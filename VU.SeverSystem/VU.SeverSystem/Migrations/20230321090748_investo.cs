using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VU.SeverSystem.Migrations
{
    public partial class investo : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "User",
                type: "VARCHAR(20)",
                nullable: true,
                defaultValue: "A",
                oldClrType: typeof(string),
                oldType: "VARCHAR(20)",
                oldNullable: true,
                oldDefaultValue: "N");

            migrationBuilder.AddColumn<int>(
                name: "InvestorId",
                table: "User",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "UserType",
                table: "User",
                type: "VARCHAR(20)",
                nullable: true,
                defaultValue: "I");

            migrationBuilder.CreateTable(
                name: "Investors",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TaxCode = table.Column<string>(type: "VARCHAR(50)", nullable: true),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Phone = table.Column<string>(type: "VARCHAR(50)", nullable: true),
                    FullName = table.Column<string>(type: "NVARCHAR(128)", nullable: true),
                    BirthDay = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Sex = table.Column<string>(type: "VARCHAR(5)", nullable: true),
                    CCCD = table.Column<string>(type: "VARCHAR(50)", nullable: true),
                    Avatar = table.Column<string>(type: "VARCHAR(1024)", nullable: true),
                    Address = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Status = table.Column<string>(type: "VARCHAR(20)", nullable: true, defaultValue: "A"),
                    IsTemp = table.Column<int>(type: "int", nullable: false, defaultValue: 1),
                    TradingProviderId = table.Column<int>(type: "int", nullable: false),
                    CreatedBy = table.Column<string>(type: "VARCHAR(50)", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "DATETIME", nullable: true, defaultValueSql: "getdate()"),
                    ModifiedBy = table.Column<string>(type: "VARCHAR(20)", nullable: true),
                    ModifiedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Deleted = table.Column<string>(type: "VARCHAR(20)", nullable: false, defaultValue: "N")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Investors", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Investors");

            migrationBuilder.DropColumn(
                name: "InvestorId",
                table: "User");

            migrationBuilder.DropColumn(
                name: "UserType",
                table: "User");

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "User",
                type: "VARCHAR(20)",
                nullable: true,
                defaultValue: "N",
                oldClrType: typeof(string),
                oldType: "VARCHAR(20)",
                oldNullable: true,
                oldDefaultValue: "A");
        }
    }
}
