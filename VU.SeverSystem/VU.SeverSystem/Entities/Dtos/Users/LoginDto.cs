using System.ComponentModel.DataAnnotations;

namespace VU.SeverSystem.Entities.Dtos.Users
{
    public class LoginDto
    {
        private string _username;
        [Required(AllowEmptyStrings = false, ErrorMessage = "Tên đăng nhập không được bỏ trống")]
        public string Username
        {
            get => _username;
            set => _username = value?.Trim();
        }

        private string _password;
        [Required(AllowEmptyStrings = false, ErrorMessage = "Mật khẩu không được bỏ trống")]
        public string Password
        {
            get => _password;
            set => _password = value?.Trim();
        }
    }
}
