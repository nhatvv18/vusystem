namespace VU.SeverSystem.Entities.Dtos.Users
{
    public class UsersDto
    {
        public string Username { get; set; }

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

        public string IdentifierCode { get; set; }

        /// <summary>
        /// Đã định danh hay chưa? (Y/N)
        /// </summary>
        public string IsIdentifier { get; set; }

        #region Tham số được lấy từ nơi khác

        /// <summary>
        /// Số tền đầu tư từ ví
        /// </summary>
        public decimal AmountMoney { get; set; }

        /// <summary>
        /// Lô go của ví
        /// </summary>
        public string Logo { get; set; }
        #endregion
    }
}
