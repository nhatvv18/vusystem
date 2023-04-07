namespace VU.SeverSystem.Entities.DataEntities
{
    public class InvestorBanks
    {
        public int? Id { get; set; }
        public int? InvestorId { get; set; }
        public int? BankId { get; set; }
        public string OwnerAccount { get; set; }
        public string BankAccount { get; set; }
        public string IsDefault { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string ModifiedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public string Deleted { get; set; }
    }
}
