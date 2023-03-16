using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VU.SeverSystem.Migrations
{
    public partial class InitialCreate1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "User",
                type: "VARCHAR(20)",
                nullable: true,
                defaultValue: "N",
                oldClrType: typeof(string),
                oldType: "VARCHAR(20)",
                oldDefaultValue: "N");

            migrationBuilder.AlterColumn<string>(
                name: "Sex",
                table: "User",
                type: "VARCHAR(5)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "VARCHAR(5)");

            migrationBuilder.AlterColumn<string>(
                name: "Phone",
                table: "User",
                type: "VARCHAR(50)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "VARCHAR(50)");

            migrationBuilder.AlterColumn<string>(
                name: "ModifiedBy",
                table: "User",
                type: "VARCHAR(20)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "VARCHAR(20)");

            migrationBuilder.AlterColumn<string>(
                name: "IsIdentifier",
                table: "User",
                type: "VARCHAR(20)",
                nullable: true,
                defaultValue: "N",
                oldClrType: typeof(string),
                oldType: "VARCHAR(20)",
                oldDefaultValue: "N");

            migrationBuilder.AlterColumn<string>(
                name: "IdentifierCode",
                table: "User",
                type: "VARCHAR(20)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "VARCHAR(20)");

            migrationBuilder.AlterColumn<string>(
                name: "FullName",
                table: "User",
                type: "NVARCHAR(128)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "NVARCHAR(128)");

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "User",
                type: "VARCHAR(1024)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "VARCHAR(1024)");

            migrationBuilder.AlterColumn<string>(
                name: "CreatedBy",
                table: "User",
                type: "VARCHAR(50)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "VARCHAR(50)");

            migrationBuilder.AlterColumn<string>(
                name: "CCCD",
                table: "User",
                type: "VARCHAR(50)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "VARCHAR(50)");

            migrationBuilder.AlterColumn<string>(
                name: "Avatar",
                table: "User",
                type: "VARCHAR(1024)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "VARCHAR(1024)");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "User",
                type: "VARCHAR(20)",
                nullable: false,
                defaultValue: "N",
                oldClrType: typeof(string),
                oldType: "VARCHAR(20)",
                oldNullable: true,
                oldDefaultValue: "N");

            migrationBuilder.AlterColumn<string>(
                name: "Sex",
                table: "User",
                type: "VARCHAR(5)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "VARCHAR(5)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Phone",
                table: "User",
                type: "VARCHAR(50)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "VARCHAR(50)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "ModifiedBy",
                table: "User",
                type: "VARCHAR(20)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "VARCHAR(20)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "IsIdentifier",
                table: "User",
                type: "VARCHAR(20)",
                nullable: false,
                defaultValue: "N",
                oldClrType: typeof(string),
                oldType: "VARCHAR(20)",
                oldNullable: true,
                oldDefaultValue: "N");

            migrationBuilder.AlterColumn<string>(
                name: "IdentifierCode",
                table: "User",
                type: "VARCHAR(20)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "VARCHAR(20)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "FullName",
                table: "User",
                type: "NVARCHAR(128)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "NVARCHAR(128)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "User",
                type: "VARCHAR(1024)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "VARCHAR(1024)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "CreatedBy",
                table: "User",
                type: "VARCHAR(50)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "VARCHAR(50)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "CCCD",
                table: "User",
                type: "VARCHAR(50)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "VARCHAR(50)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Avatar",
                table: "User",
                type: "VARCHAR(1024)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "VARCHAR(1024)",
                oldNullable: true);
        }
    }
}
