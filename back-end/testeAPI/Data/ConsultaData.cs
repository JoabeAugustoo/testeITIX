using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Sedec.Api.Models.DataContext;
using testeAPI.Models;
using testeAPI.Models.DTO;

namespace testeAPI.Data
{
    public class ConsultaData
    {
        private readonly TesteITIXContext _bdTesteITIX;
        private IConfiguration _configuration;
        private int _itensPorPaginaPadrao;

        public ConsultaData(TesteITIXContext bdtesteITIX, IConfiguration config)
        {
            _bdTesteITIX = bdtesteITIX;
            _configuration = config;
            _itensPorPaginaPadrao = Convert.ToInt32(_configuration.GetSection("ItensPorPaginaPadrao"));
        }

        public async Task<int> UpdateConsulta(Consulta consulta)
        {
            try
            {
                _bdTesteITIX.Attach(consulta);

                _bdTesteITIX.Entry(consulta).Property(x => x.NomePaciente).IsModified = true;
                _bdTesteITIX.Entry(consulta).Property(x => x.Observacoes).IsModified = true;
                _bdTesteITIX.Entry(consulta).Property(x => x.MedicoId).IsModified = true;
                _bdTesteITIX.Entry(consulta).Property(x => x.DataInicialConsulta).IsModified = true;
                _bdTesteITIX.Entry(consulta).Property(x => x.DataFinalConsulta).IsModified = true;
                _bdTesteITIX.Entry(consulta).Property(x => x.DataNascimento).IsModified = true;

                var update = await _bdTesteITIX.SaveChangesAsync();

                return update;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public bool ConsultaExists(Consulta consulta)
        {
            var medicoEmAtendimento = _bdTesteITIX.Consulta.Where(c => c.MedicoId == consulta.MedicoId)
            .Where(c => c.DataInicialConsulta == consulta.DataInicialConsulta || c.DataFinalConsulta == consulta.DataFinalConsulta).Any();
            return medicoEmAtendimento;
        }

        public async Task<int> DeleteConsulta(Consulta consulta)
        {
            try
            {
                _bdTesteITIX.Remove(consulta);
                var removed = await _bdTesteITIX.SaveChangesAsync();
                return removed;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<int> AddConsulta(Consulta consulta)
        {
            try
            {
                _bdTesteITIX.Add(consulta);
                return await _bdTesteITIX.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public RetornoPaginacao GetConsultasByFilter(ConsultasFilterDTO consultas, int pg, int itensPg, string sort, int sortOrder)
        {
            IQueryable<RetornoConsultasDTO> resConsultas = (
              from c in _bdTesteITIX.Consulta
              where (
              (consultas.MedicoId != null ? c.MedicoId == consultas.MedicoId : true) &&
              (consultas.DataInicialConsulta != null ? c.DataInicialConsulta >= consultas.DataInicialConsulta : true) &&
              (consultas.DataFinalConsulta != null ? c.DataFinalConsulta <= consultas.DataFinalConsulta : true) &&
              (consultas.DataNascimento != null ? c.DataNascimento == consultas.DataNascimento : true) &&
              (consultas.NomePaciente != null ? c.Observacoes.Contains(consultas.NomePaciente) : true) &&
              (consultas.Observacoes != null ? c.Observacoes.Contains(consultas.Observacoes) : true)
              )
              select new RetornoConsultasDTO()
              {
                  Id = c.Id,
                  NomePaciente = c.NomePaciente,
                  Observacoes = c.Observacoes,
                  DataNascimento = c.DataNascimento,
                  DataInicialConsulta = c.DataInicialConsulta,
                  DataFinalConsulta = c.DataFinalConsulta,
                  MedicoId = c.MedicoId,
              }
          );

            if (sort != null)
            {
                switch (sort)
                {
                    case "nomePaciente":
                        resConsultas = (sortOrder == 1
                          ? resConsultas.OrderBy(a => a.NomePaciente).ThenBy(a => a.NomePaciente)
                          : resConsultas.OrderByDescending(a => a.NomePaciente).ThenByDescending(a => a.NomePaciente));
                        break;
                    case "observacoes":
                        resConsultas = (sortOrder == 1
                          ? resConsultas.OrderBy(a => a.Observacoes)
                          : resConsultas.OrderByDescending(a => a.Observacoes));
                        break;
                    case "dataNascimento":
                        resConsultas = (sortOrder == 1
                          ? resConsultas.OrderBy(a => a.DataNascimento.Value.Date)
                          : resConsultas.OrderByDescending(a => a.DataNascimento.Value.Date));
                        break;
                    case "dataInicialConsulta":
                        resConsultas = (sortOrder == 1
                          ? resConsultas.OrderBy(a => a.DataInicialConsulta.Value.Date)
                          : resConsultas.OrderByDescending(a => a.DataInicialConsulta.Value.Date));
                        break;
                    case "dataFinalConsulta":
                        resConsultas = (sortOrder == 1
                          ? resConsultas.OrderBy(a => a.DataFinalConsulta.Value.Date)
                          : resConsultas.OrderByDescending(a => a.DataFinalConsulta.Value.Date));
                        break;
                    case "medico":
                        resConsultas = (sortOrder == 1
                          ? resConsultas.OrderBy(a => a.MedicoId)
                          : resConsultas.OrderByDescending(a => a.MedicoId));
                        break;

                    default:
                        resConsultas = resConsultas.OrderBy(r => r.DataInicialConsulta.Value.Date).OrderByDescending(r => r.DataInicialConsulta.Value.Date);
                        break;
                }
            }
            else
            {
                resConsultas = resConsultas.OrderBy(r => r.DataInicialConsulta.Value.Date).OrderByDescending(r => r.DataInicialConsulta.Value.Date);
            }

            var retorno = new RetornoPaginacao(pg, itensPg > 0 ? itensPg : _itensPorPaginaPadrao, resConsultas);

            return retorno;
        }

        public async Task<Consulta> FindConsultaById(int id)
        {
            return await _bdTesteITIX.Consulta.FindAsync(id);
        }
    }
}
