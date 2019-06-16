using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using testeAPI;

namespace Sedec.Api
{
  public class Program
  {
    public static void Main(string[] args)
    {
      BuildWebHost(args).Run();
    }

    public static IWebHost BuildWebHost(string[] args) =>
        WebHost.CreateDefaultBuilder(args)
            .UseStartup<Startup>()
            .UseUrls("http://0.0.0.0:5000")
            .Build();
  }
}
