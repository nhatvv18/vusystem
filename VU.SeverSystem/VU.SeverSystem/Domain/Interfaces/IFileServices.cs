using VU.SeverSystem.Entities.Dtos.UploadFile;

namespace VU.SeverSystem.Domain.Interfaces
{
    public interface IFileServices
    {
        public string UploadImage(UploadFileModel input);
        public byte[] GetImage(string folder, string fileName);
        public string UploadFile(UploadFileModel input);
        public byte[] GetFile(string folder, string fileName);
        string UploadFileID(UploadFileModel input);
        /// <summary>
        /// Tạo file dạng FormFile từ file path lưu trong db
        /// </summary>
        /// <param name="file"></param>
        /// <returns></returns>
        public FormFile GenFileFromPath(string file);

        /// <summary>
        /// Xóa file
        /// </summary>
        /// <param name="folder"></param>
        /// <param name="fileName"></param>
        public void DeleteFile(string folder, string fileName);
        /// <summary>
        /// Xóa file bằng url
        /// </summary>
        /// <param name="url"></param>
        public void DeleteFile(string url);
    }
}
