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

        public IActionResult TratarExcecao(ControllerContext context, string mensagem, Exception ex, int? idEntidade = null)
        {
            const string ERRO_SQL = "Ocorreu um erro ao tentar executar um comando no banco de dados. Código do erro: {0}.";
            var isSqlException = false;
            int? sqlError = null;
            var mensagemEx = string.Empty;
            var stackTrace = ex.StackTrace;

            do
            {
                mensagemEx += ex.Message + Environment.NewLine;
                if (ex.GetType() == typeof(SqlException))
                {
                    sqlError = ((SqlException)ex).Number;
                    isSqlException = true;
                }
                ex = ex.InnerException;
            } while (ex != null);


            if (isSqlException)
                return BadRequest(string.Format(ERRO_SQL, sqlError));

            return BadRequest(mensagem);
        }
    }
}
