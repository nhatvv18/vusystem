namespace VU.SeverSystem.Entities.Dtos.Shared
{
    public class PageResultDto<T>
    {
        public T Items { get; set; }
        public int TotalItems { get; set; }
    }
}
