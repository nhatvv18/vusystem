using AutoMapper;
using VU.SeverSystem.Domain.Interfaces;
using VU.SeverSystem.Entities.DataEntities;
using VU.SeverSystem.Entities.Dtos.Investors;
using VU.SeverSystem.Entities.Dtos.Shared;
using VU.SeverSystem.Entities.Dtos.Users;
using VU.SeverSystem.EntityFrameworkCore;
using VU.SeverSystem.Utils;
using VU.SeverSystem.Utils.ConstantVariables;

namespace VU.SeverSystem.Domain.Implements
{
    public class InvestorsServices : IInvestorsServices
    {
        private readonly ILogger<InvestorsServices> _logger;
        private readonly IConfiguration _configuration;
        private readonly IMapper _mapper;

        private readonly IHttpContextAccessor _httpContext;
        private readonly VUDbContext _dbContext;
        private readonly IInvestorIdentificationServices _investorIdentificationServices;
        //private readonly AuthOtpRepository _authOtpRepository;

        public InvestorsServices(ILogger<InvestorsServices> logger, IConfiguration configuration,
            IHttpContextAccessor httpContext,
            IInvestorIdentificationServices investorIdentificationServices,
            IMapper mapper,
            VUDbContext dbContext)
        {
            _logger = logger;
            _configuration = configuration;
            _mapper = mapper;
            _httpContext = httpContext;
            _dbContext = dbContext;
            _investorIdentificationServices = investorIdentificationServices;
            //_authOtpRepository = new AuthOtpRepository(_dbContext, _logger);
        }

        //public List<Investors> GetAll()
        //{
        //    var investorQuery = _dbContext.Investors.AsQueryable().Where(t => t.IsTemp == 1 && t.Deleted == YesNo.NO).OrderByDescending(r => r.CreatedDate).ToList();
        //    return investorQuery;
        //}

        public PageResultDto<List<InvestorDto>> GetAll(FilterDto input)
        {
            var investorQuery = _dbContext.Investors.AsQueryable().ToList();
            if (input.Keyword != null)
            {
                //investorQuery = investorQuery.Where(s => (s.Name != null && s.Name.ToLower().Contains(input.Keyword)) ||
                //    (s.Identification != null && s.Identification.ToLower().Contains(input.Keyword)));
            }
                       //investorQuery = investorQuery.Where(s => s.Deleted == YesNo.NO && s.IsTemp == 1).OrderByDescending(r => r.CreatedDate).Skip(input.PageSize * (input.PageNumber - 1)).Take(input.PageSize);
            int totalItem = investorQuery.Count();
            List<InvestorDto> result = new();

            foreach (var item in investorQuery)
            {
                var identifiQuery = _investorIdentificationServices.FindByInvestorId(item.Id);

                result.Add(new InvestorDto()
                {
                    Id = item.Id,
                    TaxCode = item.TaxCode ?? "",
                    Email = item.Email,
                    Phone = item.Phone,
                    Avatar = item.Avatar ?? "",
                    Status = item.Status,
                    IsTemp = item.IsTemp,
                    CreatedBy = item.CreatedBy,
                    CreatedDate = item.CreatedDate,
                    DefaultIdentification = _mapper.Map<InvestorIdentification>(identifiQuery)
                });
            }
                return new PageResultDto<List<InvestorDto>>
                {
                    TotalItems = totalItem,
                    Items = result,
                };
        }


        public void Create(CreateInvestorDto input)
        {
            var username = CommonUtils.GetCurrentUsername(_httpContext);
            //var check = _dbContext.Users.Any(u => u.CCCD == input.CCCD);
            //if (check)
            //{
            //    throw new Exception($"Nhà đầu tư đã tồi tại");
            //}
            var userInsert = _dbContext.Investors.Add(new Investors
            {
                Email = input.Email,
                Phone = input.Phone,
                TaxCode = input.TaxCode,
                Avatar = input.Avatar,
                CreatedBy = username,
                CreatedDate = DateTime.Now,
            }).Entity;
            _dbContext.SaveChanges();

            var indentifiInsert = _dbContext.InvestorIdentification.Add(new InvestorIdentification
            {
                InvestorId = userInsert.Id,
                IdType = input.IdType,
                IdNo = input.IdNo,
                FullName = input.FullName,
                BirthDay = input.BirthDay,
                Nationality = input.Nationality,
                Sex = input.Sex,
                PlaceOfResidence = input.PlaceOfResidence,
                IdFrontImageUrl = input.IdFrontImageUrl,
                IdBackImageUrl = input.IdBackImageUrl,
                PlaceOfOrigin = input.PlaceOfOrigin,
                IdIssuer = input.IdIssuer,
                IdDate = input.IdDate,
                IdExpriredDate = input.IdExpriredDate,
                IsDefault = YesNo.YES,
                CreatedBy = username,
                CreatedDate = DateTime.Now,
            });
            _dbContext.SaveChanges();

            var banktInsert = _dbContext.InvestorBanks.Add(new InvestorBanks
            {
                InvestorId = userInsert.Id,
                BankId = input.BankId,
                OwnerAccount = input.OwnerAccount,
                BankAccount = input.BankAccount,
                IsDefault = YesNo.YES,
                CreatedBy = username,
                CreatedDate = DateTime.Now,
            });
            _dbContext.SaveChanges();
        }
    }
}
