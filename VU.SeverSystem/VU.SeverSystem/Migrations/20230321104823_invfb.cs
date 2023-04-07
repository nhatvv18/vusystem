using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VU.SeverSystem.Migrations
{
    public partial class invfb : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Deleted",
                table: "Investors",
                type: "VARCHAR(20)",
                nullable: true,
                defaultValue: "N",
                oldClrType: typeof(string),
                oldType: "VARCHAR(20)",
                oldDefaultValue: "N");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Deleted",
                table: "Investors",
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
