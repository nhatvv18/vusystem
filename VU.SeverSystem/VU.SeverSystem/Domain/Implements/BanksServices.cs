using AutoMapper;
using VU.SeverSystem.Domain.Interfaces;
using VU.SeverSystem.Entities.DataEntities;
using VU.SeverSystem.Entities.Dtos.Investors;
using VU.SeverSystem.Entities.Dtos.Shared;
using VU.SeverSystem.EntityFrameworkCore;
using VU.SeverSystem.Utils;

namespace VU.SeverSystem.Domain.Implements
{
    public class BanksServices : IBanksServices
    {
        private readonly ILogger<BanksServices> _logger;
        private readonly IConfiguration _configuration;
        private readonly IMapper _mapper;

        private readonly IHttpContextAccessor _httpContext;
        private readonly VUDbContext _dbContext;
        //private readonly AuthOtpRepository _authOtpRepository;

        public BanksServices(ILogger<BanksServices> logger, IConfiguration configuration,
            IHttpContextAccessor httpContext,
            IMapper mapper,
            VUDbContext dbContext)
        {
            _logger = logger;
            _configuration = configuration;
            _mapper = mapper;
            _httpContext = httpContext;
            _dbContext = dbContext;
            //_authOtpRepository = new AuthOtpRepository(_dbContext, _logger);
        }

        public PageResultDto<List<CoreBanks>> GetAll()
        {
            var bankQuery = _dbContext.CoreBanks.AsQueryable().OrderByDescending(r => r.BankId);
            //.ToList();
            int totalItem = bankQuery.Count();
            return new PageResultDto<List<CoreBanks>>
            {
                TotalItems = totalItem,
                Items = bankQuery.ToList(),
            }; ;
        }

    }
}
