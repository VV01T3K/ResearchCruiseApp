import { AppAlert } from '@/core/components/AppAlert';
import { Role } from '@/core/models/Role';
import {
  AccountSettingsCard,
  ApplicationsCard,
  CruiseEffectsCard,
  CruisesCard,
  HelpCard,
  NewFormCard,
  PrioritizationInfoCard,
  PublicationsCard,
  UserManagementCard,
} from '@/dashboard/components/DashboardCards';
import { DashboardGrid } from '@/dashboard/components/DashboardGrid';
import { useUserContext } from '@/user/hooks/UserContextHook';

export function DashboardPage() {
  const userContext = useUserContext();

  if (userContext.isInRole(Role.Administrator)) {
    return (
      <DashboardGrid>
        <NewFormCard className="col-span-2 row-span-2" />
        <PrioritizationInfoCard className="col-span-2" />
        <UserManagementCard />
        <AccountSettingsCard />
        <ApplicationsCard />
        <HelpCard />
        <CruisesCard className="col-span-2" />
        <PublicationsCard />
        <CruiseEffectsCard />
      </DashboardGrid>
    );
  }

  if (userContext.isInRole(Role.ShipOwner)) {
    return (
      <DashboardGrid>
        <CruisesCard className="col-span-2 row-span-2" />
        <ApplicationsCard className="row-span-2" />
        <UserManagementCard className="col-span-2" />
        <AccountSettingsCard className="row-span-2" />
        <NewFormCard />
        <HelpCard />
        <PrioritizationInfoCard className="col-span-2" />
        <PublicationsCard />
        <CruiseEffectsCard />
      </DashboardGrid>
    );
  }

  if (userContext.isInRole(Role.CruiseManager)) {
    return (
      <DashboardGrid>
        <NewFormCard className="col-span-2 row-span-2" />
        <ApplicationsCard className="col-span-2" />
        <PrioritizationInfoCard />
        <AccountSettingsCard className="row-span-2" />
        <CruisesCard className="col-span-2" />
        <HelpCard />
        <PublicationsCard />
        <CruiseEffectsCard />
      </DashboardGrid>
    );
  }

  if (userContext.isInRole(Role.Guest)) {
    return (
      <DashboardGrid>
        <CruisesCard className="col-span-2 row-span-2" />
        <ApplicationsCard className="row-span-2" />
        <PrioritizationInfoCard className="col-span-2" />
        <AccountSettingsCard className="row-span-2" />
        <HelpCard className="col-span-2" />
      </DashboardGrid>
    );
  }

  return (
    <AppAlert variant="danger">
      Brak dashboarda przypisanego do ról: {userContext.currentUser?.roles.join(', ')}. Zgłoś ten fakt administratorom
      strony.
    </AppAlert>
  );
}
