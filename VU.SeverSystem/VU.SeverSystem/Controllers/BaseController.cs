using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.ServiceModel;
using System.Text.Json;
using VU.SeverSystem.Entities.Dtos.Exceptions;
using VU.SeverSystem.Utils;
using VU.SeverSystem.Utils.Exceptions;

namespace VU.SeverSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BaseController : ControllerBase
    {
        protected ILogger _logger;

        public BaseController(ILogger logger)
        {
            _logger = logger;
        }

        protected IActionResult ReturnException(Exception ex)
        {
            if (ex is UserFriendlyException) // exception có phải là UserFriendlyException 
            {
                var userEx = ex as UserFriendlyException; // ép kiểu sang
                return StatusCode(StatusCodes.Status400BadRequest, new ExceptionBody
                {
                    Message = userEx.Message
                });
            }
            _logger.LogError(ex, ex.Message);
            return StatusCode(StatusCodes.Status500InternalServerError, new ExceptionBody
            {
                Message = ex.Message
            });
        }

        [NonAction]
        public APIResponse OkException(Exception ex)
        {
            var request = Request;
            string errStr = $"Path = {request.Path}, Query = {JsonSerializer.Serialize(request.Query)}, ";
            var claims = HttpContext.User.Identity != null ? HttpContext.User.Identity as ClaimsIdentity : null;

            var fex = ex as FaultException;
            if (fex != null)
            {
                if (int.Parse(fex.Code.Name) <= 1000)
                {
                    try
                    {
                        //if (claims != null)
                        //{
                        //    errStr += $"claims = {JsonSerializer.Serialize(claims.Claims.ToList())}";
                        //}
                    }
                    catch (Exception exClaim)
                    {
                        _logger?.LogError(exClaim, $"Lỗi HttpContext.User.Identity as ClaimsIdentity, {exClaim.GetType()}: Message = {exClaim.Message}");
                    }

                    _logger?.LogError(ex, $"{ex.GetType()}: {errStr}, Message = {ex.Message}");
                }
                else
                {
                    _logger?.LogInformation(ex, $"{ex.GetType()}: {errStr}, Message = {ex.Message}");
                }
                return new APIResponse(null, int.Parse(fex.Code.Name), fex.Message);
            }

            var httpRequestEx = ex as HttpRequestException;
            if (httpRequestEx != null)
            {
                _logger?.LogInformation(ex, $"{ex.GetType()}: {errStr}, Message = {ex.Message}");
                return new APIResponse(null, (int)ErrorCode.HttpRequestException, httpRequestEx.Message);
            }

            _logger?.LogInformation(ex, $"{ex.GetType()}: {errStr}, Message = {ex.Message}");
            return new APIResponse(null, (int)ErrorCode.InternalServerError, ex.Message);
        }
    }
}
