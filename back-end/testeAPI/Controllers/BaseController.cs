using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;


namespace testeAPI.Controllers
{
  public class BaseController : Controller
  {
    public BadRequestObjectResult BadRequest(string mensagemErro)
    {
      return base.BadRequest(new { Erro = mensagemErro });
    }

    public BadRequestObjectResult BadRequest(string mensagemErro, Exception ex)
    {
      return base.BadRequest(new { Erro = mensagemErro, Excecao = ex });
    }

    public NotFoundObjectResult NotFound(string mensagemErro)
    {
      return base.NotFound(new { Erro = mensagemErro });
    }

    public ObjectResult Conflict(string mensagemErro)
    {
      return StatusCode((int)HttpStatusCode.Conflict, new { Erro = mensagemErro });
    }

    public override BadRequestObjectResult BadRequest(ModelStateDictionary modelState)
    {
      var erros = new List<string>();

      foreach (var erro in modelState.Values.Select(ms => ms.Errors))
      {
        if (erro.Any(e => e.Exception != null))
        {
          return base.BadRequest(modelState);
        }
        erros.AddRange(erro.Select(e => "- " + e.ErrorMessage));
      }

      return base.BadRequest(new { Erro = string.Join("</br>", erros) });
    }

  }
}
