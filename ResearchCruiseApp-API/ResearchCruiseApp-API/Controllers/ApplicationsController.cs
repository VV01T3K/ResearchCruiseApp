using System.Runtime.Serialization;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Build.Framework;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp_API.Data;
using ResearchCruiseApp_API.Models;
using ResearchCruiseApp_API.Tools;
using ResearchCruiseApp_API.Types;
using ResearchCruiseApp_API.Controllers;
using Microsoft.EntityFrameworkCore.Query;
using ResearchCruiseApp_API.Services;
using Contract = ResearchCruiseApp_API.Models.DataTypes.Contract;
using GuestTeam = ResearchCruiseApp_API.Models.DataTypes.GuestTeam;
using UGTeam = ResearchCruiseApp_API.Models.DataTypes.UGTeam;

namespace ResearchCruiseApp_API.Controllers
{
    [Authorize(Roles = $"{RoleName.Administrator}, {RoleName.Shipowner}")]
    [Route("api/[controller]")]
    [ApiController]
    public class ApplicationsController(IApplicationsService applicationsService) : ControllerBase
    {
        [HttpGet]
        public async Task<IActionResult> GetAllApplications()
        {
            var result = await applicationsService.GetAllApplications();
            
            if (result.Error is not null)
                return StatusCode(result.Error.StatusCode, result.Error.ErrorMessage);
            
            return Ok(result.Value);
        }
        
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetApplicationById(Guid id)
        {
            var result = await applicationsService.GetApplicationById(id);
            
            if (result.Error is not null)
                return StatusCode(result.Error.StatusCode, result.Error.ErrorMessage);
            
            return Ok(result.Value);
        }

        // [HttpGet("{applicationId:guid}/points")]
        // public async Task<IActionResult> CalculatePoints([FromRoute] Guid applicationId)
        // {
        //     return default;
        // }
    }
}
