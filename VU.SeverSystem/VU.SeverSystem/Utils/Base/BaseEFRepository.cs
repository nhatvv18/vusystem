using Microsoft.EntityFrameworkCore;

namespace VU.SeverSystem.Utils.Base
{
    public class BaseEFRepository<TEntity> where TEntity : class
    {
        protected readonly DbContext _dbContext;
        protected readonly DbSet<TEntity> _dbSet;
        protected readonly string _seqName;
        protected readonly ILogger _logger;

        public BaseEFRepository(DbContext dbContext, string seqName = null)
        {
            _dbContext = dbContext;
            _dbSet = dbContext.Set<TEntity>();
            _seqName = seqName;
        }

        public BaseEFRepository(DbContext dbContext, ILogger logger)
        {
            _dbContext = dbContext;
            _dbSet = dbContext.Set<TEntity>();
            _logger = logger;
        }

        public DbSet<TEntity> Entity => _dbSet;
        public IQueryable<TEntity> EntityNoTracking => _dbSet.AsNoTracking<TEntity>();

    }
}
