using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Text.Json;

namespace VU.SeverSystem.Utils
{
    public class BaseController : ControllerBase
    {
        protected ILogger _logger;

        /// <summary>
        /// Get ra GetType() của Exception để bắt Message của Exception chuẩn nhất để xem
        /// </summary>
        /// <param name="ex"></param>
        /// <returns></returns>
        [NonAction]
        public APIResponse OkException(Exception ex)
        {
            var request = Request;
            string errStr = $"Path = {request.Path}, Query = {JsonSerializer.Serialize(request.Query)}, ";
            var claims = HttpContext.User.Identity != null ? HttpContext.User.Identity as ClaimsIdentity : null;
            if (claims != null)
            {
                var userId = claims.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                errStr += $"userId = {userId}, ";
            }

            var httpRequestEx = ex as HttpRequestException;
            if (httpRequestEx != null)
            {
                _logger?.LogInformation(ex, $"{ex.GetType()}: {errStr}, Message = {ex.Message}");
                return new APIResponse(httpRequestEx.Message, (int)ErrorCode.HttpRequestException, httpRequestEx.Message, 1);
            }

            _logger?.LogError(ex, $"{ex.GetType()}: {errStr}, Message = {ex.Message}");
            return new APIResponse(null, (int)ErrorCode.InternalServerError, ex.Message, 1);
        }
    }
}
