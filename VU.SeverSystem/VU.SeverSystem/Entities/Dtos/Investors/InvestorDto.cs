using VU.SeverSystem.Entities.DataEntities;

namespace VU.SeverSystem.Entities.Dtos.Investors
{
    public class InvestorDto
    {
        public int Id { get; set; }

        /// <summary>
        /// Mã số thuế
        /// </summary>
        public string TaxCode { get; set; }

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
        //public string FullName { get; set; }

        ///// <summary>
        ///// Ngày sinh
        ///// </summary>
        //public DateTime? BirthDay { get; set; }

        ///// <summary>
        ///// Giới tính
        ///// </summary>
        //public string Sex { get; set; }

        ///// <summary>
        ///// Căn cước công dân
        ///// </summary>
        //public string CCCD { get; set; }

        /// <summary>
        /// Avatar
        /// </summary>
        public string Avatar { get; set; }
        ///// <summary>
        ///// Địa chỉ
        ///// </summary>
        //public string Address { get; set; }
        /// <summary>
        /// Trạng thái tài khoản (A: hoạt động, D: đang khóa)
        /// </summary>
        public string Status { get; set; }
        /// <summary>
        /// Loai tài khoản (I: nha dau tu, V: nhatvv)
        /// </summary>
        /// 
        public int? IsTemp { get; set; }
        public int? TradingProviderId { get; set; }
        //public string IdFrontImageUrl { get; set; }
        //public string IdBackImageUrl { get; set; }

        public string CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string ModifiedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public string Deleted { get; set; }

        public InvestorIdentification DefaultIdentification { get; set; }

        public List<InvestorBanks> Banks { get; set; }

    }
}
