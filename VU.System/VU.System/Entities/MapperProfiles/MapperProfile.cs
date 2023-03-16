using AutoMapper;
using VU.System.Entities;
using VU.System.Entities.DataEntities;
using VU.System.Entities.Users;

namespace VU.System.Entities.MapperProfiles
{
    public class MapperProfile : Profile
    {
        public MapperProfile()
        {
            CreateMap<Entities.DataEntities.Users, CreateUsersDto>().ReverseMap();
            CreateMap<Entities.DataEntities.Users, UsersDto>();
        }
    }
}
