using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VU.SeverSystem.Domain.Interfaces;
using VU.SeverSystem.Entities.Dtos.Users;
using VU.SeverSystem.Utils;

namespace VU.SeverSystem.Controllers
{
    [ApiController]
    [Route("api/users")]
    // [EnableCors("MyCors")]
    public class UsersController : BaseController
    {
        private readonly IUsersServices _usersServices;

        public UsersController(ILogger<UsersController> logger, IUsersServices usersServices) : base(logger)
        {
            _usersServices = usersServices;
        }

        /// <summary>
        /// Tìm kiếm thông tin tài khoản theo username
        /// </summary>
        /// <param name="username"></param>
        /// <returns></returns>
        //[Authorize]
        //[HttpGet("find-by-username")]
        //public IActionResult FindByUsername(string username)
        //{
        //    try
        //    {
        //        var result = _usersServices.FindByUsername(username);
        //        return Ok(result);
        //    }
        //    catch (Exception ex)
        //    {
        //        return ReturnException(ex);
        //    }
        //}

        //[Authorize]
        //[HttpGet("my-info")]
        //public APIResponse MyInfo()
        //{
        //    try
        //    {
        //        var result = _usersServices.FindMyInfo();
        //        return new APIResponse(result, 200, "");
        //    }
        //    catch (Exception ex)
        //    {
        //        return OkException(ex);
        //    }
        //}

        //[Authorize]
        //[HttpPut("auth-phone")]
        //public APIResponse AuthOtpPhone(string otp)
        //{
        //    try
        //    {
        //        _usersServices.AuthOtpPhone(otp);
        //        return new APIResponse(null, 200, "");
        //    }
        //    catch (Exception ex)
        //    {
        //        return OkException(ex);
        //    }
        //}

        [HttpPost("add")]
        public IActionResult Add([FromBody] CreateUsersDto input)
        {
            try
            {
                _usersServices.Create(input);
                return Ok();
            }
            catch (Exception ex)
            {
                return ReturnException(ex);
            }
        }

        //[HttpGet("auth-otp/{type}")]
        //public APIResponse AuthOtp(int type)
        //{
        //    try
        //    {
        //        var result = _usersServices.AddOtp(type);
        //        return new APIResponse(result, 200, "ok");
        //    }
        //    catch (Exception ex)
        //    {
        //        return OkException(ex);
        //    }
        //}

        //[Authorize]
        //[HttpPost("add-info")]
        //public APIResponse AddUserInfo([FromBody] CreateUserInfoDto input)
        //{
        //    try
        //    {
        //        _usersServices.CreateInfoUser(input);
        //        return new APIResponse(null, 200, "");
        //    }
        //    catch (Exception ex)
        //    {
        //        return OkException(ex);
        //    }
        //}

        [HttpPost("login")]
        public APIResponse Login([FromBody] LoginDto input)
        {
            try
            {
                var result = _usersServices.Login(input);
                return new APIResponse(result, 200, "");
            }
            catch (Exception ex)
            {
                return OkException(ex);
            }
        }

        //[HttpPut("update-avatar")]
        //public APIResponse UpdateAvatar([FromBody] UpdateAvatarDto input)
        //{
        //    try
        //    {
        //        var result = _usersServices.UpdateAvatar(input);
        //        return new APIResponse(result, 200, "");
        //    }
        //    catch (Exception ex)
        //    {
        //        return OkException(ex);
        //    }
        //}
    }
}
