using VU.SeverSystem.Entities.DataEntities;
using VU.SeverSystem.Entities.Dtos.Investors;
using VU.SeverSystem.Entities.Dtos.Shared;
using VU.SeverSystem.Entities.Dtos.Users;

namespace VU.SeverSystem.Domain.Interfaces
{
    public interface IInvestorsServices
    {
        void Create(CreateInvestorDto input);
        //List<Investors> GetAll();
        PageResultDto<List<InvestorDto>> GetAll(FilterDto input);
        InvestorDto GetById(int id);
    }
}
