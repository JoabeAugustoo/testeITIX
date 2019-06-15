using System;
using System.Threading.Tasks;
using testeAPI.Data;
using testeAPI.Exceptions;
using testeAPI.Models;
using testeAPI.Models.DTO;

namespace testeAPI.Business
{
    public class MedicoBusiness
    {
        public string ErrosPreenchidos { get; set; }
        public string ErrosNaoPreenchidos { get; set; }
        public string ErrosValidacao { get; set; }
        public MedicoData _medicoData;

        public MedicoBusiness(MedicoData medicoData)
        {
            _medicoData = medicoData;
        }

        public RetornoPaginacao GetMedicosByFilter(MedicosFilterDTO medicos, int pg, int itensPg, string sort, int sortOrder)
        {
            return _medicoData.GetMedicosByFilter(medicos, pg, itensPg, sort, sortOrder);
        }

        public async Task<Medico> GetMedicoById(int id)
        {
            return await _medicoData.FindMedicoById(id);
        }

        public async Task<int> AddMedico(Medico medico)
        {
            try
            {
                if (CRMExists(medico.CRM))
                {
                    ErrosValidacao = "O CRM informado já se encontra cadastrado para outro médico.";
                    throw new BusinessException(ErrosValidacao);
                }
                else
                {
                    return await _medicoData.AddMedico(medico);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public bool CRMExists(int crm)
        {
            return _medicoData.CRMExists(crm);
        }

        public bool MedicoExists(int id)
        {
            return _medicoData.MedicoExists(id);
        }

        public async Task<int> UpdateMedico(Medico medico)
        {
            try
            {
                return await _medicoData.UpdateMedico(medico);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<int> DeleteMedico(Medico medico)
        {
            return await _medicoData.DeleteMedico(medico);
        }
    }
}
