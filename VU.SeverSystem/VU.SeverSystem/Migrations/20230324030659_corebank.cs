using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VU.SeverSystem.Migrations
{
    public partial class corebank : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Deleted",
                table: "User",
                type: "VARCHAR(20)",
                nullable: true,
                defaultValue: "N",
                oldClrType: typeof(string),
                oldType: "VARCHAR(20)",
                oldDefaultValue: "N");

            migrationBuilder.CreateTable(
                name: "CoreBanks",
                columns: table => new
                {
                    BankId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BankName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FullBankName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BankCode = table.Column<string>(type: "VARCHAR(50)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CoreBanks", x => x.BankId);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CoreBanks");

            migrationBuilder.AlterColumn<string>(
                name: "Deleted",
                table: "User",
                type: "VARCHAR(20)",
                nullable: false,
                defaultValue: "N",
                oldClrType: typeof(string),
                oldType: "VARCHAR(20)",
                oldNullable: true,
                oldDefaultValue: "N");
        }
    }
}
