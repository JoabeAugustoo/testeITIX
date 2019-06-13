using System;
using System.Threading.Tasks;
using testeAPI.Models;
using testeAPI.Models.DTO;

namespace testeAPI.Data
{
  public class MedicoData
  {
    internal RetornoPaginacao GetMedicosByFilter(MedicosFilterDTO medicos, int pg, int itensPg, string sort, int sortOrder)
    {
      throw new NotImplementedException();
    }

    internal Task AddMedico(Medico medico)
    {
      throw new NotImplementedException();
    }

    internal bool CRMExists(int crm)
    {
      throw new NotImplementedException();
    }

    internal bool MedicoExists(int id)
    {
      throw new NotImplementedException();
    }
  }
}
