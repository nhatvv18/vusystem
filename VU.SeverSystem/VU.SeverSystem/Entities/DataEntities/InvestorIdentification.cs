namespace VU.SeverSystem.Entities.DataEntities
{
    public class InvestorIdentification
    {
        public int? Id { get; set; }
        public int? InvestorId { get; set; }
        public string IdType { get; set; }
        public string IdNo { get; set; }
        public string FullName { get; set; } 
        public DateTime? BirthDay { get; set; }
        public string Nationality { get; set; }
        public string Sex { get; set; }
        /// <summary>
        /// Địa chỉ thường trú
        /// </summary>
        public string PlaceOfResidence { get; set; }
        public string IdFrontImageUrl { get; set; }
        public string IdBackImageUrl { get; set; }
        /// <summary>
        /// Quê quán
        /// </summary>
        public string PlaceOfOrigin { get; set; }
        /// <summary>
        /// Nơi cấp
        /// </summary>
        public string IdIssuer { get; set; }
        /// <summary>
        /// Ngày cấp
        /// </summary>
        public DateTime? IdDate { get; set; }
        /// <summary>
        /// Ngày hết hạn
        /// </summary>
        public DateTime? IdExpriredDate { get; set; }
        public string IsDefault { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string ModifiedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public string Deleted { get; set; }
    }
}

