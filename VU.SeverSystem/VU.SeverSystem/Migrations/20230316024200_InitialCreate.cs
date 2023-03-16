using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VU.SeverSystem.Migrations
{
    public partial class InitialCreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "User",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Username = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    Password = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Phone = table.Column<string>(type: "VARCHAR(50)", nullable: false),
                    FullName = table.Column<string>(type: "NVARCHAR(128)", nullable: false),
                    BirthDay = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Sex = table.Column<string>(type: "VARCHAR(5)", nullable: false),
                    CCCD = table.Column<string>(type: "VARCHAR(50)", nullable: false),
                    Avatar = table.Column<string>(type: "VARCHAR(1024)", nullable: false),
                    Address = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Description = table.Column<string>(type: "VARCHAR(1024)", nullable: false),
                    IdentifierCode = table.Column<string>(type: "VARCHAR(20)", nullable: false),
                    IsIdentifier = table.Column<string>(type: "VARCHAR(20)", nullable: false, defaultValue: "N"),
                    Status = table.Column<string>(type: "VARCHAR(20)", nullable: false, defaultValue: "N"),
                    CreatedBy = table.Column<string>(type: "VARCHAR(50)", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "DATETIME", nullable: true, defaultValueSql: "getdate()"),
                    ModifiedBy = table.Column<string>(type: "VARCHAR(20)", nullable: false),
                    ModifiedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Deleted = table.Column<string>(type: "VARCHAR(20)", nullable: false, defaultValue: "N")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_User", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "User");
        }
    }
}
