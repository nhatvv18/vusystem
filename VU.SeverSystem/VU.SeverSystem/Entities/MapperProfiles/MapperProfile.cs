using AutoMapper;
using VU.SeverSystem.Entities.DataEntities;
using VU.SeverSystem.Entities.Dtos.Investors;
using VU.SeverSystem.Entities.Dtos.Users;

namespace VU.SeverSystem.Entities.MapperProfiles
{
    public class MapperProfile : Profile
    {
        public MapperProfile()
        {
            CreateMap<Users, CreateUsersDto>().ReverseMap();
            CreateMap<Users, UsersDto>().ReverseMap();
            CreateMap<InvestorIdentification, InvestorDto>().ReverseMap();
            CreateMap<Investors, InvestorDto>().ReverseMap();
        }
    }
}
