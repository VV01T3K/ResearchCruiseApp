using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Domain.Entities;
using ResearchCruiseApp.Infrastructure.Persistence;

namespace ResearchCruiseApp.Api.Applications.Shared;

internal class UniqueFormFieldResolver(ApplicationDbContext dbContext, ICompressor compressor)
{
    public async Task<Permission> GetUniquePermission(
        PermissionDto permissionDto,
        IEnumerable<Permission> permissionsInMemory,
        CancellationToken cancellationToken
    )
    {
        var newPermission = ApplicationMappings.ToPermission(permissionDto);
        if (permissionDto.Scan is not null)
        {
            newPermission.ScanName = permissionDto.Scan.Name;
            newPermission.ScanContent = await compressor.Compress(permissionDto.Scan.Content);
        }
        var oldPermission =
            Find(newPermission, permissionsInMemory)
            ?? await dbContext.Permissions.FirstOrDefaultAsync(
                Permission.EqualsByExpression(newPermission),
                cancellationToken
            );

        return oldPermission ?? newPermission;
    }

    public async Task<ResearchAreaDescription> GetUniqueResearchAreaDescription(
        ResearchAreaDescriptionDto researchAreaDescriptionDto,
        IEnumerable<ResearchAreaDescription> researchAreaDescriptionsInMemory,
        CancellationToken cancellationToken
    )
    {
        // If the research area description has a different name, we check if this name already exists in the researchAreasRepository
        if (
            researchAreaDescriptionDto.AreaId is null
            && !string.IsNullOrEmpty(researchAreaDescriptionDto.DifferentName)
        )
        {
            var researchArea = await dbContext.ResearchAreas.FirstOrDefaultAsync(
                researchArea => researchArea.Name == researchAreaDescriptionDto.DifferentName,
                cancellationToken
            );

            if (researchArea is not null)
            {
                researchAreaDescriptionDto = researchAreaDescriptionDto with
                {
                    AreaId = researchArea.Id,
                    DifferentName = null, // Clear the different name since we found a matching research area
                };
            }
        }

        var newResearchAreaDescription = ApplicationMappings.ToResearchAreaDescription(
            researchAreaDescriptionDto
        );
        var oldResearchAreaDescription =
            Find(newResearchAreaDescription, researchAreaDescriptionsInMemory)
            ?? await dbContext.ResearchAreaDescriptions.FirstOrDefaultAsync(
                ResearchAreaDescription.EqualsByExpression(newResearchAreaDescription),
                cancellationToken
            );

        return oldResearchAreaDescription ?? newResearchAreaDescription;
    }

    public async Task<ResearchTask> GetUniqueResearchTask(
        IResearchTaskDto researchTaskDto,
        IEnumerable<ResearchTask> researchTasksInMemory,
        CancellationToken cancellationToken
    )
    {
        var newResearchTask = ApplicationMappings.ToResearchTask(researchTaskDto);
        var oldResearchTask =
            Find(newResearchTask, researchTasksInMemory)
            ?? await dbContext.ResearchTasks.FirstOrDefaultAsync(
                ResearchTask.EqualsByExpression(newResearchTask),
                cancellationToken
            );

        return oldResearchTask ?? newResearchTask;
    }

    public async Task<Contract> GetUniqueContract(
        ContractDto contractDto,
        IEnumerable<Contract> contractsInMemory,
        CancellationToken cancellationToken
    )
    {
        var newContract = ApplicationMappings.ToContract(contractDto);
        foreach (var scan in contractDto.Scans)
        {
            if (!string.IsNullOrEmpty(scan.Name) && !string.IsNullOrEmpty(scan.Content))
            {
                newContract.Files.Add(
                    new ContractFile
                    {
                        FileName = scan.Name,
                        FileContent = await compressor.Compress(scan.Content),
                    }
                );
            }
        }
        var oldContract =
            Find(newContract, contractsInMemory)
            ?? await dbContext
                .Contracts.Include(contract => contract.Files)
                .FirstOrDefaultAsync(Contract.EqualsByExpression(newContract), cancellationToken);

        if (oldContract != null)
        {
            bool filesChanged = oldContract.Files.Count != newContract.Files.Count;

            if (!filesChanged)
            {
                var oldSortedFiles = oldContract.Files.OrderBy(f => f.FileName).ToList();
                var newSortedFiles = newContract.Files.OrderBy(f => f.FileName).ToList();

                for (int i = 0; i < oldSortedFiles.Count; i++)
                {
                    if (
                        oldSortedFiles[i].FileName != newSortedFiles[i].FileName
                        || !oldSortedFiles[i]
                            .FileContent?.SequenceEqual(newSortedFiles[i].FileContent ?? []) == true
                    )
                    {
                        filesChanged = true;
                        break;
                    }
                }
            }

            if (filesChanged)
            {
                return newContract;
            }

            return oldContract;
        }

        return newContract;
    }

    public async Task<Publication> GetUniquePublication(
        PublicationDto publicationDto,
        IEnumerable<Publication> publicationInMemory,
        CancellationToken cancellationToken
    )
    {
        var newPublication = ApplicationMappings.ToPublication(publicationDto);
        var oldPublication =
            Find(newPublication, publicationInMemory)
            ?? await dbContext.Publications.FirstOrDefaultAsync(
                Publication.EqualsByExpression(newPublication),
                cancellationToken
            );

        return oldPublication ?? newPublication;
    }

    public async Task<SpubTask> GetUniqueSpubTask(
        SpubTaskDto spubTaskDto,
        IEnumerable<SpubTask> spubTasksInMemory,
        CancellationToken cancellationToken
    )
    {
        var newSpubTask = ApplicationMappings.ToSpubTask(spubTaskDto);
        var oldSpubTask =
            Find(newSpubTask, spubTasksInMemory)
            ?? await dbContext.SpubTasks.FirstOrDefaultAsync(
                SpubTask.EqualsByExpression(newSpubTask),
                cancellationToken
            );

        return oldSpubTask ?? newSpubTask;
    }

    public async Task<GuestUnit> GetUniqueGuestUnit(
        GuestTeamDto guestTeamDto,
        IEnumerable<GuestUnit> guestUnitsInMemory,
        CancellationToken cancellationToken
    )
    {
        var newGuestUnit = ApplicationMappings.ToGuestUnit(guestTeamDto);
        var oldGuestUnit =
            Find(newGuestUnit, guestUnitsInMemory)
            ?? await dbContext.GuestUnits.FirstOrDefaultAsync(
                GuestUnit.EqualsByExpression(newGuestUnit),
                cancellationToken
            );

        return oldGuestUnit ?? newGuestUnit;
    }

    public async Task<CrewMember> GetUniqueCrewMember(
        CrewMemberDto crewMemberDto,
        IEnumerable<CrewMember> crewMembersInMemory,
        CancellationToken cancellationToken
    )
    {
        var newCrewMember = ApplicationMappings.ToCrewMember(crewMemberDto);
        var oldCrewMember =
            Find(newCrewMember, crewMembersInMemory)
            ?? await dbContext.CrewMembers.FirstOrDefaultAsync(
                CrewMember.EqualsByExpression(newCrewMember),
                cancellationToken
            );

        return oldCrewMember ?? newCrewMember;
    }

    public async Task<ResearchEquipment> GetUniqueResearchEquipment(
        IResearchEquipmentDto researchEquipmentDto,
        IEnumerable<ResearchEquipment> researchEquipmentsInMemory,
        CancellationToken cancellationToken
    )
    {
        var newResearchEquipment = ApplicationMappings.ToResearchEquipment(researchEquipmentDto);
        var oldResearchEquipment =
            Find(newResearchEquipment, researchEquipmentsInMemory)
            ?? await dbContext.ResearchEquipments.FirstOrDefaultAsync(
                ResearchEquipment.EqualsByExpression(newResearchEquipment),
                cancellationToken
            );

        return oldResearchEquipment ?? newResearchEquipment;
    }

    public async Task<Port> GetUniquePort(
        PortDto portDto,
        IEnumerable<Port> portsInMemory,
        CancellationToken cancellationToken
    )
    {
        var newPort = ApplicationMappings.ToPort(portDto);
        var oldPort =
            Find(newPort, portsInMemory)
            ?? await dbContext.Ports.FirstOrDefaultAsync(
                Port.EqualsByExpression(newPort),
                cancellationToken
            );

        return oldPort ?? newPort;
    }

    public async Task<CruiseDayDetails> GetUniqueCruiseDayDetails(
        CruiseDayDetailsDto cruiseDayDetailsDto,
        IEnumerable<CruiseDayDetails> cruiseDaysDetailsInMemory,
        CancellationToken cancellationToken
    )
    {
        var newCruiseDayDetails = ApplicationMappings.ToCruiseDayDetails(cruiseDayDetailsDto);
        var oldCruiseDayDetails =
            Find(newCruiseDayDetails, cruiseDaysDetailsInMemory)
            ?? await dbContext.CruiseDaysDetails.FirstOrDefaultAsync(
                CruiseDayDetails.EqualsByExpression(newCruiseDayDetails),
                cancellationToken
            );

        return oldCruiseDayDetails ?? newCruiseDayDetails;
    }

    private static T? Find<T>(T searchedObject, IEnumerable<T> collection)
        where T : Entity, IEquatable<T>
    {
        return collection.FirstOrDefault(element => element.Equals(searchedObject));
    }
}
