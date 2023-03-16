using VU.SeverSystem.Entities.Dtos.Users;

namespace VU.SeverSystem.Domain.Interfaces
{
    public interface IUsersServices
    {
        //AuthOtpDto AddOtp(int type);
        //void AuthOtpPhone(string otp);
        void Create(CreateUsersDto input);
        //void CreateInfoUser(CreateUserInfoDto input);
        //UsersDto FindByUsername(string username);
        //UsersDto FindMyInfo();
        LoginResultDto Login(LoginDto input);
        //UsersDto UpdateAvatar(UpdateAvatarDto input);
    }
}
