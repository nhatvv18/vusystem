using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VU.SeverSystem.Domain.Implements;
using VU.SeverSystem.Domain.Interfaces;
using VU.SeverSystem.Entities.Dtos.Investors;
using VU.SeverSystem.Entities.Dtos.Shared;
using VU.SeverSystem.Entities.Dtos.Users;
using VU.SeverSystem.Utils;

namespace VU.SeverSystem.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/investor-temp")]
    public class InvestorsTempController : BaseController
    {
        private readonly IInvestorsServices _investorsServices;
        public InvestorsTempController(ILogger<InvestorsTempController> logger, IInvestorsServices investorsServices) : base(logger)
        {
            _investorsServices = investorsServices;
        }
        [HttpPost("add")]
        public APIResponse Add([FromBody] CreateInvestorDto input)
        {
            try
            {
                _investorsServices.Create(input);
                return new APIResponse(null, 200, "Success", 1);
            }
            catch (Exception ex)
            {
                return OkException(ex);
            }
        }

        [HttpGet("find-all")]
        public APIResponse GetAll([FromQuery] FilterDto input)
        {
            try
            {
                var result = _investorsServices.GetAll(input);
                return new APIResponse(result, 200, "Success",1);
            }
            catch (Exception ex)
            {
                return OkException(ex);
            }
        }
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
    }
}
