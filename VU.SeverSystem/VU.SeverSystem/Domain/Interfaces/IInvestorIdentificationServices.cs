using VU.SeverSystem.Entities.DataEntities;
using VU.SeverSystem.Entities.Dtos.Investors;

namespace VU.SeverSystem.Domain.Interfaces
{
    public interface IInvestorIdentificationServices
    {
        InvestorIdentification FindByInvestorId(int id);
    }
}
