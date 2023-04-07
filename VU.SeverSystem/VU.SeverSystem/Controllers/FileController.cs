using Microsoft.AspNetCore.Mvc;
using VU.SeverSystem.Domain.Interfaces;
using VU.SeverSystem.Entities.Dtos.UploadFile;
using VU.SeverSystem.Utils;

namespace VU.SeverSystem.Controllers
{
    [Route("api/file")]
    [ApiController]
    public class FileController : BaseController
    {
        private readonly IFileServices _imageServices;
        public FileController(ILogger<FileController> logger, IFileServices imageServices) : base(logger)
        {
            _imageServices = imageServices;
        }
        /// <summary>
        /// Get File
        /// </summary>
        /// <returns></returns>
        [Route("get")]
        [HttpGet]
        public IActionResult GetFile([FromQuery] string folder, [FromQuery] string file, [FromQuery] bool download)
        {
            try
            {
                var result = _imageServices.GetFile(folder, file);

                if (download)
                {
                    return File(result, MimeTypeNames.ApplicationOctetStream, file);
                }
                return FileByFormat(result, file);
            }
            catch (Exception ex)
            {
                return Ok(OkException(ex));
            }
        }

        /// <summary>
        /// Upload File
        /// </summary>
        /// <returns></returns>
        [Route("upload")]
        [DisableRequestSizeLimit]
        [HttpPost]
        //[Authorize]
        public APIResponse UploadFile(IFormFile file, [FromQuery] string folder)
        {
            try
            {
                var result = _imageServices.UploadFile(new UploadFileModel
                {
                    File = file,
                    Folder = folder,
                });
                return new APIResponse(result, 200, "Ok",1);
            }
            catch (Exception ex)
            {
                return OkException(ex);
            }
        }
    }
}
