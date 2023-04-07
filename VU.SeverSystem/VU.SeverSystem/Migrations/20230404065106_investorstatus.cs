using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VU.SeverSystem.Migrations
{
    public partial class investorstatus : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "Investors",
                type: "VARCHAR(20)",
                nullable: true,
                defaultValue: "1",
                oldClrType: typeof(string),
                oldType: "VARCHAR(20)",
                oldNullable: true,
                oldDefaultValue: "A");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "Investors",
                type: "VARCHAR(20)",
                nullable: true,
                defaultValue: "A",
                oldClrType: typeof(string),
                oldType: "VARCHAR(20)",
                oldNullable: true,
                oldDefaultValue: "1");
        }
    }
}
