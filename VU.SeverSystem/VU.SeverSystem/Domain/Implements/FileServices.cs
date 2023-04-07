using AutoMapper;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using System.Runtime.InteropServices;
using System.ServiceModel;
using System.Web;
using VU.SeverSystem.Domain.Interfaces;
using VU.SeverSystem.Entities.DataEntities;
using VU.SeverSystem.Entities.Dtos.Shared;
using VU.SeverSystem.Entities.Dtos.UploadFile;
using VU.SeverSystem.Entities.Setting;
using VU.SeverSystem.EntityFrameworkCore;
using VU.SeverSystem.Utils;

namespace VU.SeverSystem.Domain.Implements
{
    public class FileServices : IFileServices
    {
        private readonly ImageConfig _imageConfig;
        private readonly FileConfig _fileConfig;
        private readonly IdFileConfig _idFileConfig;
        private readonly ILogger<FileServices> _logger;
        private readonly IConfiguration _configuration;
        private readonly IMapper _mapper;
        private readonly IWebHostEnvironment _hostEnvironment;
        private readonly IHttpContextAccessor _httpContext;
        private readonly VUDbContext _dbContext;
        //private readonly AuthOtpRepository _authOtpRepository;

        public FileServices(
            IOptions<ImageConfig> imageConfig,
            IOptions<FileConfig> fileConfig,
            IOptions<IdFileConfig> idFileConfig,
            IWebHostEnvironment hostEnvironment,
            ILogger<FileServices> logger, 
            IConfiguration configuration,
            IHttpContextAccessor httpContext,
            IMapper mapper,
            VUDbContext dbContext)
        {
            _imageConfig = imageConfig.Value;
            _fileConfig = fileConfig.Value;
            _idFileConfig = idFileConfig.Value;
            _hostEnvironment = hostEnvironment;
            _logger = logger;
            _configuration = configuration;
            _mapper = mapper;
            _httpContext = httpContext;
            _dbContext = dbContext;
            //_authOtpRepository = new AuthOtpRepository(_dbContext, _logger);
        }

        private string GetEndPoint(string endpoint, string folder, string fileName)
        {
            fileName = HttpUtility.UrlEncode(fileName);
            folder = HttpUtility.UrlEncode(folder);
            return $"api/{endpoint}?folder={folder}&file={fileName}";
        }

        private string GetImageNameToSave(string fileName)
        {
            string ext = Path.GetExtension(fileName);
            string fileNameWithoutExt = Path.GetFileNameWithoutExtension(fileName);

            return $"hidden-{Guid.NewGuid().ToString("N")}{ext}";
        }

        /// <summary>
        /// Đọc file ra dạng byte
        /// </summary>
        /// <param name="folder"></param>
        /// <param name="fileName"></param>
        /// <param name="config"></param>
        /// <returns></returns>
        /// <exception cref="FaultException"></exception>
        private byte[] GetFile(string folder, string fileName, FileConfig config)
        {
            string filePath = getFilePath(folder, fileName, config);
            if (!File.Exists(filePath))
            {
                throw new FaultException(new FaultReason($"File không tồn tại."), new FaultCode(((int)1008).ToString()), "");
            }

            var fileByte = File.ReadAllBytes(filePath);
            //Stream result = new MemoryStream(fileByte);
            return fileByte;
        }

        private string getFilePath(string folder, string fileName, FileConfig config)
        {
            var baseDir = "";

            if (RuntimeInformation.IsOSPlatform(OSPlatform.Windows))
            {
                baseDir = Directory.GetParent(Directory.GetParent(_hostEnvironment.ContentRootPath).FullName).FullName;
            }
            else if (RuntimeInformation.IsOSPlatform(OSPlatform.Linux))
            {
                baseDir = _hostEnvironment.ContentRootPath;
            }

            string filePath = Path.Combine(baseDir, config.Path ?? "", folder ?? "", fileName);

            return filePath;
        }

        private void UploadFile(IFormFile file, FileConfig config, string folderPath, string fileName)
        {
            if (file == null)
            {
                _logger.LogError($"File được upload không có nội dung: FileName = {file.FileName}; FileConfig = {config.LimitUpload}; folderPath = {folderPath} ");
                throw new FaultException(new FaultReason($"File được upload không có nội dung."), new FaultCode(((int)1008).ToString()), "");
            }

            if (file.Length > config.LimitUpload)
            {
                _logger.LogError($"Kích thước file không được vượt quá {config.LimitUpload / (1024 * 1024)} MB: FileName = {file.FileName}; FileConfig = {config.LimitUpload}; folderPath = {folderPath} ");
                throw new FaultException(new FaultReason($"Kích thước file không được vượt quá {config.LimitUpload / (1024 * 1024)} MB."), new FaultCode(((int)1008).ToString()), "");
            }

            var fileExtension = Path.GetExtension(file.FileName);
            var allowExtensions = config.AllowExtension.Split(",");

            if (!allowExtensions.Contains(fileExtension?.ToLower()))
            {
                _logger.LogError($"Định dạng file không hợp lệ: FileName = {file.FileName}; FileConfig = {config.LimitUpload}; folderPath = {folderPath} ");
                throw new FaultException(new FaultReason($"Định dạng file không hợp lệ. ({config.AllowExtension})"), new FaultCode(((int)1008).ToString()), "");
            }

            string filePath = "";
            string prefixFilePath = "";

            if (RuntimeInformation.IsOSPlatform(OSPlatform.Windows))
            {
                var baseDir = Directory.GetParent(Directory.GetParent(_hostEnvironment.ContentRootPath).FullName).FullName;
                prefixFilePath = Path.Combine(baseDir, config.Path, folderPath ?? "");
            }
            else if (RuntimeInformation.IsOSPlatform(OSPlatform.Linux))
            {
                prefixFilePath = Path.Combine(_hostEnvironment.ContentRootPath, config.Path, folderPath ?? "");
            }

            Directory.CreateDirectory(prefixFilePath);
            filePath = Path.Combine(prefixFilePath, fileName);


            using (var filestream = new FileStream(filePath, FileMode.Create, FileAccess.Write, FileShare.None))
            {
                file.CopyTo(filestream);
            }
        }

        public byte[] GetImage(string folder, string fileName)
        {
            var fileByte = GetFile(folder, fileName, _imageConfig);
            //Stream result = new MemoryStream(fileByte);
            return fileByte;
        }

        public string UploadImage(UploadFileModel input)
        {
            string fileName = GetImageNameToSave(input?.File?.FileName ?? "");
            UploadFile(input.File, _imageConfig, input.Folder, fileName);
            string endpoint = GetEndPoint("file/get", input.Folder, fileName);

            return endpoint;
        }

        public byte[] GetFile(string folder, string fileName)
        {
            var fileByte = GetFile(folder, fileName, _imageConfig);
            //Stream result = new MemoryStream(fileByte);
            return fileByte;
        }

        /// <summary>
        /// Xóa file
        /// </summary>
        /// <param name="folder"></param>
        /// <param name="fileName"></param>
        /// <exception cref="FaultException"></exception>
        public void DeleteFile(string folder, string fileName)
        {
            var filePath = getFilePath(folder, fileName, _fileConfig);
            if (!File.Exists(filePath))
            {
                _logger.LogError($"File không tồn tại {filePath}");
                //throw new FaultException(new FaultReason($"File không tồn tại"), new FaultCode(((int)ErrorCode.FileNotFound).ToString()), "");
            }
            else
            {
                File.Delete(filePath);
            }
        }

        /// <summary>
        /// Xóa file bằng url
        /// </summary>
        /// <param name="url"></param>
        public void DeleteFile(string url)
        {
            if (url == null)
            {
                return;
            }
            Uri theRealURL = new Uri($"http://{url}");

            string folder = HttpUtility.ParseQueryString(theRealURL.Query).Get("folder");
            string file = HttpUtility.ParseQueryString(theRealURL.Query).Get("file");

            DeleteFile(folder, file);
        }

        public string UploadFile(UploadFileModel input)
        {
            _logger.LogInformation("Upload file");
            string fileName = GetImageNameToSave(input?.File?.FileName ?? "");
            UploadFile(input.File, _fileConfig, input.Folder, fileName);
            string endpoint = GetEndPoint("file/get", input.Folder, fileName);

            return endpoint;
        }

        public string UploadFileID(UploadFileModel input)
        {
            _logger.LogInformation("Upload file ID");
            string fileName = GetImageNameToSave(input?.File?.FileName ?? "");
            UploadFile(input.File, _idFileConfig, input.Folder, fileName);
            string endpoint = GetEndPoint("file/get", input.Folder, fileName);

            return endpoint;
        }

        /// <summary>
        /// Tạo file dạng FormFile từ file path lưu trong db
        /// </summary>
        /// <param name="file"></param>
        /// <returns></returns>
        public FormFile GenFileFromPath(string file)
        {
            var baseDir = _configuration["FilePath"];

            var frontImageInfo = FileUtils.GetFullPathFile(file, baseDir);
            if (!File.Exists(frontImageInfo.FullPath))
            {
                _logger.LogError($"Ảnh mặt trước không tồn tại.");
                throw new FaultException(new FaultReason($"Ảnh mặt trước không tồn tại."), new FaultCode(((int)1008).ToString()), "");
            }
            var bytes = File.ReadAllBytes(frontImageInfo.FullPath);
            MemoryStream memoryStream = new(bytes.ToArray());
            var formFile = new FormFile(memoryStream, 0, memoryStream.Length, frontImageInfo.FileName, frontImageInfo.FileName);

            return formFile;
        }
    }
}
