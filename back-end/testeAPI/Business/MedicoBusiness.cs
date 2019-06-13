using System;
using System.Threading.Tasks;
using testeAPI.Models;
using testeAPI.Models.DTO;

namespace testeAPI.Business
{
  public class MedicoBusiness
  {
    internal object GetMedicosByFilter(MedicosFilterDTO medicos, int pg, int itensPg, string sort, int sortOrder)
    {
      throw new NotImplementedException();
    }

    internal object GetMedicoById(int id)
    {
      throw new NotImplementedException();
    }

    internal Task AddMedico(Medico medico)
    {
      throw new NotImplementedException();
    }

    internal bool MedicoExists(int id)
    {
      throw new NotImplementedException();
    }

    internal Task UpdateMedico(Medico medico)
    {
      throw new NotImplementedException();
    }

    internal Task DeleteMedico(Medico medico)
    {
      throw new NotImplementedException();
    }
  }
}
