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
    [Route("api/Consulta")]
    [ApiController]
    public class ConsultaController : BaseController
    {

        public ConsultaBusiness _consultaBusiness;
        public IConfiguration _configuration;

        public ConsultaController(ConsultaBusiness consultaBusiness, IConfiguration config)
        {
            _consultaBusiness = consultaBusiness;
            _configuration = config;
        }

        [HttpGet, Route("GetConsultasByFilter")]
        public IActionResult GetConsultasByFilter([FromQuery] ConsultasFilterDTO consultas, [FromQuery] int pg, [FromQuery] int itensPg, [FromQuery] string sort, [FromQuery] int sortOrder)
        {
            try
            {
                return Ok(_consultaBusiness.GetConsultasByFilter(consultas, pg, itensPg, sort, sortOrder));
            }
            catch (Exception ex)
            {
                return BadRequest("Ocorreu um erro ao tentar listar as consultas!", ex);
            }
        }

        [HttpGet, Route("GetConsultaById/{id}")]
        public IActionResult GetConsultaById([FromRoute] int id)
        {
            try
            {
                return Ok(_consultaBusiness.GetConsultaByIdAsync(id));
            }
            catch (Exception ex)
            {
                return BadRequest("Ocorreu um erro ao tentar buscar a consulta!", ex);
            }
        }

        [HttpPost, Route("AddConsulta")]
        public async Task<IActionResult> AddConsulta()
        {
            var formData = await Request.ReadFormAsync();
            var consulta = JsonConvert.DeserializeObject<Consulta>(formData["Consulta"][0]);

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                await _consultaBusiness.AddConsulta(consulta);

                return Ok(consulta);
            }
            catch (Exception ex)
            {
                return BadRequest("Ocorreu um erro ao tentar incluir a consulta.", ex);
            }
        }

        [HttpPut, Route("UpdateConsulta/{id}")]
        public async Task<IActionResult> UpdateConsulta([FromRoute] int id)
        {
            var formData = await Request.ReadFormAsync();
            var consulta = JsonConvert.DeserializeObject<Consulta>(formData["Consulta"][0]);

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                await _consultaBusiness.UpdateConsulta(consulta);

                return Ok(consulta);
            }
            catch (Exception ex)
            {
                return BadRequest("Ocorreu um erro ao tentar alterar o cadastro da consulta.", ex);
            }

        }

        [HttpDelete, Route("DeleteConsulta/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var formData = await Request.ReadFormAsync();
            var consulta = JsonConvert.DeserializeObject<Consulta>(formData["Consulta"][0]);

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                await _consultaBusiness.DeleteConsulta(consulta);

                return Ok(consulta);
            }
            catch (Exception ex)
            {
                return BadRequest("Ocorreu um erro ao tentar excluir o cadastro do médico.", ex);
            }
        }

    }
}
