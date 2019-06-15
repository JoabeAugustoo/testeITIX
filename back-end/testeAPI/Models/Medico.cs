using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace testeAPI.Models
{
    [Table("Medico")]
    public class Medico
    {
        [Key]
        [Column("codMedico")]

        public int Id { get; set; }

        [Column("nome")]
        public string Nome { get; set; }

        [Column("crm")]
        public int CRM { get; set; }

        [Column("especialidade")]
        public string Especialidade { get; set; }
    }
}
