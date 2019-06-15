using Microsoft.EntityFrameworkCore;
using testeAPI.Models;

namespace Sedec.Api.Models.DataContext
{
    public class TesteITIXContext : DbContext
    {
        public TesteITIXContext(DbContextOptions<TesteITIXContext> options) : base(options)
        {

        }

        // public static readonly LoggerFactory MyLoggerFactory
        //  = new LoggerFactory(new[] { new ConsoleLoggerProvider((_, __) => true, true) });

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            // optionsBuilder.EnableSensitiveDataLogging();
            // optionsBuilder.UseLoggerFactory(MyLoggerFactory);
        }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
        }

        public DbSet<Consulta> Consulta { get; set; }
        public DbSet<Medico> Medico { get; set; }

    }
}
