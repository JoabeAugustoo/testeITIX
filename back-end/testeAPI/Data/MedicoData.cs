using System;
using System.Threading.Tasks;
using testeAPI.Models;
using testeAPI.Models.DTO;

namespace testeAPI.Data
{
    public class MedicoData
    {
        public RetornoPaginacao GetMedicosByFilter(MedicosFilterDTO medicos, int pg, int itensPg, string sort, int sortOrder)
        {
            throw new NotImplementedException();
        }

        public Task<int> AddMedico(Medico medico)
        {
            throw new NotImplementedException();
        }

        public bool CRMExists(int crm)
        {
            throw new NotImplementedException();
        }

        public bool MedicoExists(int id)
        {
            throw new NotImplementedException();
        }

        public Task<Medico> FindMedicoById(int id)
        {
            throw new NotImplementedException();
        }

        public Task<int> UpdateMedico(Medico medico)
        {
            throw new NotImplementedException();
        }

        public Task<int> DeleteMedico(Medico medico)
        {
            throw new NotImplementedException();
        }
    }
}
