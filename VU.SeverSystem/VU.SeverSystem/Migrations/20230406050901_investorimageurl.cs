using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VU.SeverSystem.Migrations
{
    public partial class investorimageurl : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "IdFrontImageUrl",
                table: "InvestorIdentification",
                type: "VARCHAR(512)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "VARCHAR(50)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "IdBackImageUrl",
                table: "InvestorIdentification",
                type: "VARCHAR(512)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "VARCHAR(50)",
                oldNullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "IdFrontImageUrl",
                table: "InvestorIdentification",
                type: "VARCHAR(50)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "VARCHAR(512)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "IdBackImageUrl",
                table: "InvestorIdentification",
                type: "VARCHAR(50)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "VARCHAR(512)",
                oldNullable: true);
        }
    }
}
