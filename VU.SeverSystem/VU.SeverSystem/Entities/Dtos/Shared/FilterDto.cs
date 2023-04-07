using Microsoft.AspNetCore.Mvc;
using System.Xml.Linq;

namespace VU.SeverSystem.Entities.Dtos.Shared
{
    public class FilterDto
    {
        [FromQuery(Name = "pageSize")]
        public int PageSize { get; set; }

        [FromQuery(Name = "pageNumber")]
        public int PageNumber { get; set; }

        private string _keyword;
        [FromQuery(Name = "keyword")]
        public string Keyword
        {
            get => _keyword;
            set => _keyword = value?.Trim();
        }
    }
}
