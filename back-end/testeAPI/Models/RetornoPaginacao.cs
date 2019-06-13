using System;
using System.Collections.Generic;
using System.Linq;

namespace testeAPI.Models
{
  public class RetornoPaginacao
  {
    public RetornoPaginacao(int pagina, int itensPorPagina, IQueryable<object> resultado)
    {
      this.TotalItens = resultado.Count();
      if (pagina > 0)
      {
        this.Pagina = pagina;
        this.TotalPaginas = Convert.ToInt32(Math.Ceiling((decimal)TotalItens / itensPorPagina));
        this.Resultado = resultado
                        .Skip(itensPorPagina * (pagina - 1))
                        .Take(itensPorPagina)
                        .ToList();
      }
      else
      {
        this.Pagina = 1;
        this.TotalPaginas = 1;
        this.Resultado = resultado.ToList();
      }

    }

    public int TotalItens { get; }
    public int Pagina { get; }
    public int TotalPaginas { get; }
    public IEnumerable<object> Resultado { get; }
  }
}
