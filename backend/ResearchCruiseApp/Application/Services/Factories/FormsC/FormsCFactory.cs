using AutoMapper;
using ResearchCruiseApp.Application.Common.Extensions;
using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp.Application.Services.EffectsService;
using ResearchCruiseApp.Application.Services.Factories.Photos;
using ResearchCruiseApp.Application.Services.FormsFieldsService;
using ResearchCruiseApp.Domain.Common.Enums;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.Services.Factories.FormsC;

public class FormsCFactory(
    IMapper mapper,
    IResearchAreasRepository researchAreasRepository,
    IUgUnitsRepository ugUnitsRepository,
    IShipEquipmentsRepository shipEquipmentsRepository,
    IFormsFieldsService formsFieldsService,
    IEffectsService effectsService,
    IPhotosFactory photosFactory
) : IFormsCFactory
{
    public async Task<Result<FormC>> Create(FormCDto formCDto, CancellationToken cancellationToken)
    {
        var formC = mapper.Map<FormC>(formCDto);

        var result = await AddResearchArea(formC, formCDto, cancellationToken);
        if (!result.IsSuccess)
            return result.Error!;

        await AddPermissions(formC, formCDto, cancellationToken);
        await AddFormCUgUnits(formC, formCDto, cancellationToken);
        await AddFormCGuestUnits(formC, formCDto, cancellationToken);
        await effectsService.AddResearchTasksEffects(
            formC,
            formCDto.ResearchTasksEffects,
            cancellationToken
        );
        await AddContracts(formC, formCDto, cancellationToken);
        await AddFormCSpubTasks(formC, formCDto, cancellationToken);
        await AddFormCPorts(formC, formCDto, cancellationToken);
        await AddCruiseDaysDetails(formC, formCDto, cancellationToken);
        await AddShipEquipments(formC, formCDto, cancellationToken);
        await AddPhotos(formC, formCDto, cancellationToken);

        var alreadyAddedResearchEquipments = new HashSet<ResearchEquipment>();
        await AddFormCShortResearchEquipments(
            formC,
            formCDto,
            alreadyAddedResearchEquipments,
            cancellationToken
        );
        await AddFormCLongResearchEquipments(
            formC,
            formCDto,
            alreadyAddedResearchEquipments,
            cancellationToken
        );
        await AddFormCResearchEquipments(
            formC,
            formCDto,
            alreadyAddedResearchEquipments,
            cancellationToken
        );

        return formC;
    }

    private async Task AddPermissions(
        FormC formC,
        FormCDto formCDto,
        CancellationToken cancellationToken
    )
    {
        var alreadyAddedPermissions = new HashSet<Permission>();

        foreach (var permissionDto in formCDto.Permissions)
        {
            var permission = await formsFieldsService.GetUniquePermission(
                permissionDto,
                alreadyAddedPermissions,
                cancellationToken
            );
            alreadyAddedPermissions.Add(permission);

            formC.Permissions.Add(permission);
        }
    }

    private async Task<Result> AddResearchArea(
        FormC formC,
        FormCDto formCDto,
        CancellationToken cancellationToken
    )
    {
        var researchArea = await researchAreasRepository.GetById(
            formCDto.ResearchAreaId,
            cancellationToken
        );
        if (researchArea is null)
            return Error.InvalidArgument("Podany obszar badawczy nie istnieje.");

        formC.ResearchArea = researchArea;
        return Result.Empty;
    }

    private async Task AddFormCUgUnits(
        FormC formC,
        FormCDto formCDto,
        CancellationToken cancellationToken
    )
    {
        foreach (var ugTeamDto in formCDto.UgTeams)
        {
            var ugUnit = await ugUnitsRepository.GetById(ugTeamDto.UgUnitId, cancellationToken);
            if (ugUnit is null)
                continue;

            var formCUgUnit = new FormCUgUnit
            {
                UgUnit = ugUnit,
                NoOfEmployees = ugTeamDto.NoOfEmployees,
                NoOfStudents = ugTeamDto.NoOfStudents,
            };
            formC.FormCUgUnits.Add(formCUgUnit);
        }
    }

    private async Task AddFormCGuestUnits(
        FormC formC,
        FormCDto formCDto,
        CancellationToken cancellationToken
    )
    {
        var alreadyAddedGuestUnits = new HashSet<GuestUnit>();

        foreach (var guestTeamDto in formCDto.GuestTeams)
        {
            var guestUnit = await formsFieldsService.GetUniqueGuestUnit(
                guestTeamDto,
                alreadyAddedGuestUnits,
                cancellationToken
            );
            alreadyAddedGuestUnits.Add(guestUnit);

            var formCGuestUnit = new FormCGuestUnit
            {
                GuestUnit = guestUnit,
                NoOfPersons = guestTeamDto.NoOfPersons,
            };
            formC.FormCGuestUnits.Add(formCGuestUnit);
        }
    }

    private async Task AddContracts(
        FormC formC,
        FormCDto formCDto,
        CancellationToken cancellationToken
    )
    {
        var alreadyAddedContracts = new HashSet<Contract>();

        foreach (var contractDto in formCDto.Contracts)
        {
            var contract = await formsFieldsService.GetUniqueContract(
                contractDto,
                alreadyAddedContracts,
                cancellationToken
            );
            alreadyAddedContracts.Add(contract);

            formC.Contracts.Add(contract);
        }
    }

    private async Task AddFormCSpubTasks(
        FormC formC,
        FormCDto formCDto,
        CancellationToken cancellationToken
    )
    {
        var alreadyAddedSpubTasks = new HashSet<SpubTask>();

        foreach (var spubTaskDto in formCDto.SpubTasks)
        {
            var spubTask = await formsFieldsService.GetUniqueSpubTask(
                spubTaskDto,
                alreadyAddedSpubTasks,
                cancellationToken
            );
            alreadyAddedSpubTasks.Add(spubTask);

            formC.SpubTasks.Add(spubTask);
        }
    }

    private async Task AddFormCShortResearchEquipments(
        FormC formC,
        FormCDto formCDto,
        HashSet<ResearchEquipment> alreadyAddedResearchEquipments,
        CancellationToken cancellationToken
    )
    {
        foreach (var shortResearchEquipmentDto in formCDto.ShortResearchEquipments)
        {
            var researchEquipment = await formsFieldsService.GetUniqueResearchEquipment(
                shortResearchEquipmentDto,
                alreadyAddedResearchEquipments,
                cancellationToken
            );
            alreadyAddedResearchEquipments.Add(researchEquipment);

            var formCShortResearchEquipment = new FormCShortResearchEquipment
            {
                ResearchEquipment = researchEquipment,
                StartDate = shortResearchEquipmentDto.StartDate,
                EndDate = shortResearchEquipmentDto.EndDate,
            };
            formC.FormCShortResearchEquipments.Add(formCShortResearchEquipment);
        }
    }

    private async Task AddFormCLongResearchEquipments(
        FormC formC,
        FormCDto formCDto,
        HashSet<ResearchEquipment> alreadyAddedResearchEquipments,
        CancellationToken cancellationToken
    )
    {
        foreach (var longResearchEquipmentDto in formCDto.LongResearchEquipments)
        {
            var researchEquipment = await formsFieldsService.GetUniqueResearchEquipment(
                longResearchEquipmentDto,
                alreadyAddedResearchEquipments,
                cancellationToken
            );
            alreadyAddedResearchEquipments.Add(researchEquipment);

            var formCLongResearchEquipment = new FormCLongResearchEquipment
            {
                ResearchEquipment = researchEquipment,
                Action = longResearchEquipmentDto.Action.ToEnum<ResearchEquipmentAction>(),
                Duration = longResearchEquipmentDto.Duration,
            };
            formC.FormCLongResearchEquipments.Add(formCLongResearchEquipment);
        }
    }

    private async Task AddFormCPorts(
        FormC formC,
        FormCDto formCDto,
        CancellationToken cancellationToken
    )
    {
        var alreadyAddedPorts = new HashSet<Port>();

        foreach (var portDto in formCDto.Ports)
        {
            var port = await formsFieldsService.GetUniquePort(
                portDto,
                alreadyAddedPorts,
                cancellationToken
            );
            alreadyAddedPorts.Add(port);

            var formCPort = new FormCPort
            {
                Port = port,
                StartTime = portDto.StartTime,
                EndTime = portDto.EndTime,
            };
            formC.FormCPorts.Add(formCPort);
        }
    }

    private async Task AddCruiseDaysDetails(
        FormC formC,
        FormCDto formCDto,
        CancellationToken cancellationToken
    )
    {
        var alreadyAddedCruiseDaysDetails = new HashSet<CruiseDayDetails>();

        foreach (var cruiseDayDetailsDto in formCDto.CruiseDaysDetails)
        {
            var cruiseDayDetails = await formsFieldsService.GetUniqueCruiseDayDetails(
                cruiseDayDetailsDto,
                alreadyAddedCruiseDaysDetails,
                cancellationToken
            );
            alreadyAddedCruiseDaysDetails.Add(cruiseDayDetails);

            formC.CruiseDaysDetails.Add(cruiseDayDetails);
        }
    }

    private async Task AddFormCResearchEquipments(
        FormC formC,
        FormCDto formCDto,
        HashSet<ResearchEquipment> alreadyAddedResearchEquipments,
        CancellationToken cancellationToken
    )
    {
        foreach (var researchEquipmentDto in formCDto.ResearchEquipments)
        {
            var researchEquipment = await formsFieldsService.GetUniqueResearchEquipment(
                researchEquipmentDto,
                alreadyAddedResearchEquipments,
                cancellationToken
            );
            alreadyAddedResearchEquipments.Add(researchEquipment);

            var formCResearchEquipment = new FormCResearchEquipment
            {
                ResearchEquipment = researchEquipment,
                InsuranceStartDate = researchEquipmentDto.InsuranceStartDate,
                InsuranceEndDate = researchEquipmentDto.InsuranceEndDate,
                Permission = researchEquipmentDto.Permission,
            };
            formC.FormCResearchEquipments.Add(formCResearchEquipment);
        }
    }

    private async Task AddShipEquipments(
        FormC formC,
        FormCDto formCDto,
        CancellationToken cancellationToken
    )
    {
        foreach (var shipEquipmentId in formCDto.ShipEquipmentsIds)
        {
            var shipEquipment = await shipEquipmentsRepository.GetById(
                shipEquipmentId,
                cancellationToken
            );
            if (shipEquipment is null)
                continue;

            formC.ShipEquipments.Add(shipEquipment);
        }
    }

    private async Task AddPhotos(
        FormC formC,
        FormCDto formCDto,
        CancellationToken cancellationToken
    )
    {
        foreach (var photoDto in formCDto.Photos)
        {
            var photo = await photosFactory.Create(photoDto);

            formC.Photos.Add(photo);
        }
    }
}
