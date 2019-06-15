using System;

namespace testeAPI.Models
{
    public class Consulta
    {
        public int Id { get; set; }
        public string NomePaciente { get; set; }
        public DateTime DataNascimento { get; set; }
        public DateTime DataInicialConsulta { get; set; }
        public DateTime DataFinalConsulta { get; set; }
        public int? CodMedicoAtendimento { get; set; }
        public string Observacoes { get; set; }
        public int CodMedico { get; set; }

    }

}
