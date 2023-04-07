using VU.SeverSystem.Entities.DataEntities;
using VU.SeverSystem.Entities.Dtos.Shared;

namespace VU.SeverSystem.Domain.Interfaces
{
    public interface IBanksServices
    {
        PageResultDto<List<CoreBanks>> GetAll();
    }
}
