using System;
using System.Threading.Tasks;
using testeAPI.Data;
using testeAPI.Exceptions;
using testeAPI.Models;
using testeAPI.Models.DTO;

namespace testeAPI.Business
{
    public class ConsultaBusiness
    {
        public string ErrosPreenchidos { get; set; }
        public string ErrosNaoPreenchidos { get; set; }
        public string ErrosValidacao { get; set; }
        public ConsultaData _consultaData;

        public ConsultaBusiness(ConsultaData consultaData)
        {
            _consultaData = consultaData;
        }
        public RetornoPaginacao GetConsultasByFilter(ConsultasFilterDTO consultas, int pg, int itensPg, string sort, int sortOrder)
        {
            return _consultaData.GetConsultasByFilter(consultas, pg, itensPg, sort, sortOrder);
        }

        public async Task<Consulta> GetConsultaByIdAsync(int id)
        {
            return await _consultaData.FindConsultaById(id);
        }

        public async Task<int> AddConsulta(Consulta consulta)
        {
            try
            {
                if (ConsultaExists(consulta))
                {
                    ErrosValidacao = "O médico selecionado já possui um agendamento na data de consulta selecionada. Por favor, informe outro horário.";
                    throw new BusinessException(ErrosValidacao);
                }
                else if (VerificaDatas(consulta))
                {
                    ErrosValidacao = "A data final do agendamento não pode ser menor que a data inicial do agendamento.";
                    throw new BusinessException(ErrosValidacao);
                }
                else
                {
                    return await _consultaData.AddConsulta(consulta);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        private bool VerificaDatas(Consulta consulta)
        {
            if (consulta.DataFinalConsulta.Date >= consulta.DataInicialConsulta.Date)
            {
                return true;
            }
            return false;
        }

        private bool ConsultaExists(Consulta consulta)
        {
            return _consultaData.ConsultaExists(consulta);
        }

        public async Task<int> UpdateConsulta(Consulta consulta)
        {
            try
            {
                return await _consultaData.UpdateConsulta(consulta);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<int> DeleteConsulta(Consulta consulta)
        {
            try
            {
                return await _consultaData.DeleteConsulta(consulta);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
