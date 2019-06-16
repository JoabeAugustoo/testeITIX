using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using testeAPI.Business;
using testeAPI.Models;
using testeAPI.Models.DTO;

namespace testeAPI.Controllers
{

    [Produces("application/json")]
    [Route("api/Medico")]
    [ApiController]
    public class MedicoController : BaseController
    {

        public MedicoBusiness _medicoBusiness;
        public IConfiguration _configuration;

        public MedicoController(MedicoBusiness medicoBusiness, IConfiguration config)
        {
            _medicoBusiness = medicoBusiness;
            _configuration = config;
        }

        [HttpGet, Route("GetMedicosByFilter")]
        public IActionResult GetMedicosByFilter([FromQuery] MedicosFilterDTO medicos, [FromQuery] int pg, [FromQuery] int itensPg, [FromQuery] string sort, [FromQuery] int sortOrder)
        {
            try
            {
                return Ok(_medicoBusiness.GetMedicosByFilter(medicos, pg, itensPg, sort, sortOrder));
            }
            catch (Exception ex)
            {
                return TratarExcecao(ControllerContext, "Ocorreu um erro ao tentar listar os médicos!", ex);
            }
        }

        [HttpGet, Route("GetMedicoById/{id}")]
        public IActionResult GetMedicoById([FromRoute] int id)
        {
            try
            {
                return Ok(_medicoBusiness.GetMedicoById(id));
            }
            catch (Exception ex)
            {
                return TratarExcecao(ControllerContext, "Ocorreu um erro ao tentar buscar o médico!", ex);
            }
        }

        [HttpPost, Route("AddMedico")]
        public async Task<IActionResult> AddMedico()
        {
            var formData = await Request.ReadFormAsync();
            var medico = JsonConvert.DeserializeObject<Medico>(formData["Medico"][0]);

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                await _medicoBusiness.AddMedico(medico);

                return Ok(medico);
            }
            catch (Exception ex)
            {
                return TratarExcecao(ControllerContext, "Ocorreu um erro ao tentar incluir o médico.", ex);
            }
        }

        [HttpPut, Route("UpdateMedico/{id}")]
        public async Task<IActionResult> UpdateProcessoPendencia([FromRoute] int id)
        {
            var formData = await Request.ReadFormAsync();
            var medico = JsonConvert.DeserializeObject<Medico>(formData["Medico"][0]);

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                await _medicoBusiness.UpdateMedico(medico);

                return Ok(medico);
            }
            catch (Exception ex)
            {
                return TratarExcecao(ControllerContext, "Ocorreu um erro ao tentar alterar o cadastro do médico.", ex);
            }

        }

        [HttpDelete, Route("DeleteMedico/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var formData = await Request.ReadFormAsync();
            var medico = JsonConvert.DeserializeObject<Medico>(formData["Medico"][0]);

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                await _medicoBusiness.DeleteMedico(medico);

                return Ok(medico);
            }
            catch (Exception ex)
            {
                return TratarExcecao(ControllerContext, "Ocorreu um erro ao tentar excluir o cadastro do médico.", ex);
            }
        }

    }
}
