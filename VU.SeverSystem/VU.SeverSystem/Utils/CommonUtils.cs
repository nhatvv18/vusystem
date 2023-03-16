using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using ClaimTypes = VU.SeverSystem.Utils.ConstantVariables.ClaimTypes;

namespace VU.SeverSystem.Utils
{
    public class CommonUtils
    {
        private static Random random = new Random();

        public static string CreateMD5(string input)
        {
            // Use input string to calculate MD5 hash
            MD5 md5 = MD5.Create();
            byte[] inputBytes = Encoding.UTF8.GetBytes(input);
            byte[] hashBytes = md5.ComputeHash(inputBytes);
            return Convert.ToHexString(hashBytes);
        }

        public static string RandomString(int length)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            return new string(Enumerable.Repeat(chars, length).Select(s => s[random.Next(s.Length)]).ToArray());
        }

        public static string GetCurrentRemoteIpAddress(IHttpContextAccessor httpContext)
        {
            string senderIpv4 = null;
            try
            {
                senderIpv4 = httpContext.HttpContext.Connection.RemoteIpAddress.MapToIPv4().ToString();
                if (httpContext.HttpContext.Request.Headers.TryGetValue("X-Forwarded-For", out var forwardedIps))
                {
                    senderIpv4 = forwardedIps.ToString();
                }
            }
            catch
            {

            }
            return senderIpv4;
        }

        public static string GetCurrentUsername(IHttpContextAccessor httpContextAccessor)
        {
            var usr = httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.Username);
            return usr != null ? usr.Value : "";
        }

        public static string GetCurrentPhone(IHttpContextAccessor httpContextAccessor)
        {
            var usr = httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.Phone);
            return usr != null ? usr.Value : "";
        }

        public static int GetCurrentUserId(IHttpContextAccessor httpContextAccessor)
        {
            var claims = httpContextAccessor.HttpContext?.User?.Identity as ClaimsIdentity;
            var claim = claims?.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (claim == null)
            {
                /*  throw new FaultException(new FaultReason($"Tài khoản không chứa claim \"{System.Security.Claims.ClaimTypes.NameIdentifier}\""),
                      new FaultCode(((int)ErrorCode.NotHaveClaim).ToString()), "");*/
            }
            return int.Parse(claim.Value);
        }
    }
}
