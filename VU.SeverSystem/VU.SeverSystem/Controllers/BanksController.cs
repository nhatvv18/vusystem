using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VU.SeverSystem.Domain.Implements;
using VU.SeverSystem.Domain.Interfaces;
using VU.SeverSystem.Entities.Dtos.Investors;
using VU.SeverSystem.Entities.Dtos.Shared;
using VU.SeverSystem.Utils;

namespace VU.SeverSystem.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/core-bank")]
    public class BanksController : BaseController
    {
        private readonly IBanksServices _banksServices;
        public BanksController(ILogger<BanksController> logger, IBanksServices banksServices) : base(logger)
        {
            _banksServices = banksServices;
        }



        [HttpGet("find-all")]
        public APIResponse GetAll()
        {
            try
            {
                var result = _banksServices.GetAll();
                return new APIResponse(result, 200, "Success", 1);
            }
            catch (Exception ex)
            {
                return OkException(ex);
            }
        }

    
    }
}
