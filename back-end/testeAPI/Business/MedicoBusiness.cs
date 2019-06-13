using System;
using System.Threading.Tasks;
using testeAPI.Data;
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

    public object GetMedicoById(int id)
    {
      throw new NotImplementedException();
    }

    public async Task AddMedico(Medico medico)
    {
      try
      {
        if (!CRMExists(medico.CRM))
        {
          return await _medicoData.AddMedico(medico);
        }
        else
        {

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

    public Task UpdateMedico(Medico medico)
    {
      throw new NotImplementedException();
    }

    public Task DeleteMedico(Medico medico)
    {
      throw new NotImplementedException();
    }
  }
}
