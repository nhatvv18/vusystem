namespace VU.SeverSystem.Utils
{
    public class APIResponse
    {
        public dynamic Data { get; set; }
        public int Code { get; set; }
        public string Message { get; set; }
        public int Status { get; set; }

        public APIResponse(dynamic data, int code, string message, int status)
        {
            Data = data;
            Code = code;
            Message = message;
            Status = status;
        }
    }
}
