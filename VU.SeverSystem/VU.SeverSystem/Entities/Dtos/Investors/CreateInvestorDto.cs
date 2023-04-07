namespace VU.SeverSystem.Entities.Dtos.Investors
{
    public class CreateInvestorDto
    {
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
        public string TaxCode { get; set; }

        /// <summary>
        /// Avatar
        /// </summary>
        public string IdFrontImageUrl { get; set; }
        public string IdBackImageUrl { get; set; }

        /// <summary>
        /// Địa chỉ
        /// </summary>
        public string Address { get; set; }
        public string Avatar { get; set; }
        public int? BankId { get; set; }
        public string OwnerAccount { get; set; }
        public string BankAccount { get; set; }
        public string IdType { get; set; }
        public string IdNo { get; set; }
        public string Nationality { get; set; }
        public string PlaceOfResidence { get; set; }
        public string PlaceOfOrigin { get; set; }
        public string IdIssuer { get; set; }
        public DateTime? IdDate { get; set; }
        public DateTime? IdExpriredDate { get; set; }


    }
}
