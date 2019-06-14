using System;

namespace testeAPI.Models.DTO
{
  public class AgendamentoConsultaDTO
  {

    public string NomePaciente { get; set; }
    public DateTime DataNascimento { get; set; }
    public DateTime DataInicialConsulta { get; set; }
    public DateTime DataFinalConsulta { get; set; }
    public int? CodMedicoAtendimento { get; set; }
    public string Observacoes { get; set; }


  }

}
