using Microsoft.EntityFrameworkCore;
using VU.SeverSystem.Entities.DataEntities;
using VU.SeverSystem.Utils.Base;
using VU.SeverSystem.Utils.ConstantVariables;
using VU.SeverSystem.Utils.Validations;

namespace VU.SeverSystem.Repositories
{
    public class InvestorIdentificationRepository : BaseEFRepository<InvestorIdentification>
    {
        public InvestorIdentificationRepository(DbContext dbContext, ILogger logger) : base(dbContext, logger)
        {
        }

        //public AuthOtp Add(int userId, string phone, int type)
        //{
        //    var otp = RandomNumberUtils.RandomNumber(4);
        //    var result = _dbSet.Add(new AuthOtp
        //    {
        //        UserId = userId,
        //        Created = DateTime.Now,
        //        Expried = DateTime.Now.AddMinutes(2),
        //        IsUsed = YesNo.NO,
        //        OtpCode = otp,
        //        Phone = phone,
        //        Type = type
        //    }).Entity;
        //    return result;
        //}
    }
}
