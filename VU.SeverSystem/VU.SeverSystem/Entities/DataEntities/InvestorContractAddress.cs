namespace VU.SeverSystem.Entities.DataEntities
{
    public class InvestorContractAddress
    {
        public int? Id { get; set; }
        public int? InvestorId { get; set; }
        /// <summary>
        /// Mã phường xã
        /// </summary>
        public string WardCode { get; set; }
        /// <summary>
        /// Mã quận huyện
        /// </summary>
        public string DistrictCode { get; set; }
        /// <summary>
        /// Mã tỉnh thành phố
        /// </summary>
        public string ProviceCode { get; set; }
        /// <summary>
        /// Địa chỉ chi tiết
        /// </summary>
        public string DetailAddress { get; set; }
        /// <summary>
        /// Địa chỉ liên hệ
        /// </summary>
        public string ContractAddress { get; set; }
        public string IsDefault { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string ModifiedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public string Deleted { get; set; }
    }
}
