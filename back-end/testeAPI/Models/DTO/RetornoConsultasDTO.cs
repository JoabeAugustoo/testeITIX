using System;

namespace testeAPI.Models.DTO
{
    public class RetornoConsultasDTO
    {

        public int Id { get; set; }

        public string NomePaciente { get; set; }

        public DateTime? DataNascimento { get; set; }

        public DateTime? DataInicialConsulta { get; set; }

        public DateTime? DataFinalConsulta { get; set; }

        public string Observacoes { get; set; }

        public int? MedicoId { get; set; }
    }
}