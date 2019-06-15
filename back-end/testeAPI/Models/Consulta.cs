using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace testeAPI.Models
{
    [Table("Consulta")]
    public class Consulta
    {
        [Key]
        [Column("codConsulta")]
        public int Id { get; set; }

        [Column("nomePaciente")]
        public string NomePaciente { get; set; }

        [Column("dataNascimento")]
        public DateTime DataNascimento { get; set; }

        [Column("dataInicialConsulta")]
        public DateTime DataInicialConsulta { get; set; }

        [Column("dataFinalConsulta")]
        public DateTime DataFinalConsulta { get; set; }

        [Column("observacoes")]
        public string Observacoes { get; set; }

        [Column("codMedico")]
        public int MedicoId { get; set; }

    }

}
