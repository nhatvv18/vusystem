namespace VU.SeverSystem.Entities.DataEntities
{
    public class Users
    {
        public int Id { get; set; }
        public int? InvestorId { get; set; }
        /// <summary>
        /// Tên đăng nhập
        /// </summary>
        public string Username { get; set; }

        /// <summary>
        /// Mật khẩu
        /// </summary>
        public string Password { get; set; }

        /// <summary>
        /// Email
        /// </summary>
        public string Email { get; set; }

        /// <summary>
        /// Số điện thoại
        /// </summary>
        public string Phone { get; set; }

        /// <summary>
        /// Tên đầy đủ
        /// </summary>
        public string FullName { get; set; }

        /// <summary>
        /// Ngày sinh
        /// </summary>
        public DateTime? BirthDay { get; set; }

        /// <summary>
        /// Giới tính
        /// </summary>
        public string Sex { get; set; }

        /// <summary>
        /// Căn cước công dân
        /// </summary>
        public string CCCD { get; set; }

        /// <summary>
        /// Avatar
        /// </summary>
        public string Avatar { get; set; }

        /// <summary>
        /// Địa chỉ
        /// </summary>
        public string Address { get; set; }

        /// <summary>
        /// Mô tả về bản thân
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        /// Mã định danh (tự sinh)
        /// </summary>
        public string IdentifierCode { get; set; }

        /// <summary>
        /// Đã định danh hay chưa? (Y/N)
        /// </summary>
        public string IsIdentifier { get; set; }

        /// <summary>
        /// Trạng thái tài khoản (A: hoạt động, D: đang khóa)
        /// </summary>
        public string Status { get; set; }
        /// <summary>
        /// Loai tài khoản (I: nha dau tu, V: nhatvv)
        /// </summary>
        public string UserType { get; set; }

        public string CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string ModifiedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public string Deleted { get; set; }
    }
}
