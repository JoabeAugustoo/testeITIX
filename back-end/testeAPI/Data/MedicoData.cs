using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Sedec.Api.Models.DataContext;
using testeAPI.Models;
using testeAPI.Models.DTO;

namespace testeAPI.Data
{
    public class MedicoData
    {
        private readonly TesteITIXContext _bdTesteITIX;
        private IConfiguration _configuration;
        private int _itensPorPaginaPadrao;

        public MedicoData(TesteITIXContext bdtesteITIX, IConfiguration config)
        {
            _bdTesteITIX = bdtesteITIX;
            _configuration = config;
            _itensPorPaginaPadrao = Convert.ToInt32(_configuration.GetSection("ItensPorPaginaPadrao"));
        }

        public RetornoPaginacao GetMedicosByFilter(MedicosFilterDTO medicos, int pg, int itensPg, string sort, int sortOrder)
        {

            IQueryable<RetornoPesquisarMedicosDTO> resMedico =
            (
                from m in _bdTesteITIX.Medico
                where (
                (medicos.Nome != null ? m.Nome.Contains(medicos.Nome) : true) &&
                (medicos.CRM != null ? m.CRM == medicos.CRM : true) &&
                (medicos.Especialidade != null ? m.Especialidade.Contains(m.Especialidade) : true)
                )
                select new RetornoPesquisarMedicosDTO()
                {
                    Id = m.Id,
                    Nome = m.Nome,
                    CRM = m.CRM,
                    Especialidade = m.Especialidade
                }
            );

            if (sort != null)
            {
                switch (sort)
                {
                    case "nome":
                        resMedico = (sortOrder == 1
                          ? resMedico.OrderBy(a => a.Nome).ThenBy(a => a.Nome)
                          : resMedico.OrderByDescending(a => a.Nome).ThenByDescending(a => a.Nome));
                        break;
                    case "crm":
                        resMedico = (sortOrder == 1
                          ? resMedico.OrderBy(a => a.CRM)
                          : resMedico.OrderByDescending(a => a.CRM));
                        break;
                    case "especialidade":
                        resMedico = (sortOrder == 1
                          ? resMedico.OrderBy(a => a.Especialidade)
                          : resMedico.OrderByDescending(a => a.Especialidade));
                        break;
                    default:
                        resMedico = resMedico.OrderBy(r => r.CRM).OrderByDescending(r => r.CRM);
                        break;
                }
            }
            else
            {
                resMedico = resMedico.OrderBy(r => r.CRM).OrderByDescending(r => r.CRM);
            }

            var retorno = new RetornoPaginacao(pg, itensPg > 0 ? itensPg : _itensPorPaginaPadrao, resMedico);

            return retorno;
        }

        public async Task<int> AddMedico(Medico medico)
        {
            try
            {
                _bdTesteITIX.Add(medico);
                return await _bdTesteITIX.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public bool CRMExists(int crm)
        {
            return _bdTesteITIX.Medico.Any(m => m.CRM == crm);
        }

        public async Task<Medico> FindMedicoById(int id)
        {
            return await _bdTesteITIX.Medico.FindAsync(id);
        }

        public async Task<int> UpdateMedico(Medico medico)
        {
            try
            {
                _bdTesteITIX.Attach(medico);

                _bdTesteITIX.Entry(medico).Property(x => x.Nome).IsModified = true;
                _bdTesteITIX.Entry(medico).Property(x => x.CRM).IsModified = true;
                _bdTesteITIX.Entry(medico).Property(x => x.Especialidade).IsModified = true;

                var update = await _bdTesteITIX.SaveChangesAsync();

                return update;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<int> DeleteMedico(Medico medico)
        {
            try
            {
                _bdTesteITIX.Remove(medico);
                var removed = await _bdTesteITIX.SaveChangesAsync();
                return removed;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
