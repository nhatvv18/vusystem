namespace VU.SeverSystem.Entities.Dtos.Users
{
    public class LoginResultDto
    {
        public string Token { get; set; }
        public UsersDto UserData { get; set; }
    }
}
