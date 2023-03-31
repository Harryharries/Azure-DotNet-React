using Microsoft.EntityFrameworkCore;
using Types.Model;

namespace DataAccessLayer.data
{
    public class DataContext : DbContext
    {
        public DataContext()
        {
        }
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
    }
}
