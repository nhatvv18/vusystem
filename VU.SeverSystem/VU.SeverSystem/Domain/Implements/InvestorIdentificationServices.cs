using AutoMapper;
using VU.SeverSystem.Domain.Interfaces;
using VU.SeverSystem.Entities.DataEntities;
using VU.SeverSystem.Entities.Dtos.Shared;
using VU.SeverSystem.EntityFrameworkCore;
using VU.SeverSystem.Utils.ConstantVariables;

namespace VU.SeverSystem.Domain.Implements
{
    public class InvestorIdentificationServices : IInvestorIdentificationServices
    {
        private readonly ILogger<InvestorIdentificationServices> _logger;
        private readonly IConfiguration _configuration;
        private readonly IMapper _mapper;

        private readonly IHttpContextAccessor _httpContext;
        private readonly VUDbContext _dbContext;
        //private readonly AuthOtpRepository _authOtpRepository;

        public InvestorIdentificationServices(ILogger<InvestorIdentificationServices> logger, IConfiguration configuration,
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

        public InvestorIdentification FindByInvestorId(int id)
        {
            var investorIdentificationQuery = _dbContext.InvestorIdentification.FirstOrDefault(u => u.InvestorId == id && u.Deleted == YesNo.NO);
            if(investorIdentificationQuery == null)
            {
                throw new Exception();
            } 
            //var investorIdentificationQuery = _dbContext.InvestorIdentification.AsQueryable().Where(u => u.InvestorId == id && u.Deleted == YesNo.NO).ToList();
            var result = _mapper.Map<InvestorIdentification>(investorIdentificationQuery);
            return result;
        }

    }
}
