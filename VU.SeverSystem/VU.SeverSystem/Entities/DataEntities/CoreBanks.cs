namespace VU.SeverSystem.Entities.DataEntities
{
    public class CoreBanks
    {
        public int? BankId { get; set; }
        public string BankName { get; set; }

        /// <summary>
        /// Mật khẩu
        /// </summary>
        public string FullBankName { get; set; }

        /// <summary>
        /// Email
        /// </summary>
        public string BankCode { get; set; }
    }
}
