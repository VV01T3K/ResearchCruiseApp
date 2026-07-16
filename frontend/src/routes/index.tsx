import { createFileRoute } from '@tanstack/react-router';
import { allowOnly } from '@/lib/guards';
import { AppAlert } from '@/components/shared/AppAlert';
import { Role } from '@/api/client/user';
import {
  AccountSettingsCard,
  ApplicationsCard,
  CruiseEffectsCard,
  CruisesCard,
  HelpCard,
  NewCruiseApplicationCard,
  PriorityInformationCard,
  PublicationsCard,
  UserManagementCard,
} from '@/components/dashboard/Cards';
import { Grid } from '@/components/dashboard/Grid';
import { isInRole, useCurrentUser } from '@/integrations/tanstack/query/auth';

export const Route = createFileRoute('/')({
  component: DashboardPage,
  beforeLoad: allowOnly.authenticated(),
});

function DashboardPage() {
  const currentUser = useCurrentUser();

  if (isInRole(currentUser, Role.Administrator)) {
    return (
      <Grid>
        <NewCruiseApplicationCard className="col-span-2 row-span-2" />
        <PriorityInformationCard className="col-span-2" />
        <UserManagementCard />
        <AccountSettingsCard />
        <ApplicationsCard />
        <HelpCard />
        <CruisesCard className="col-span-2" />
        <PublicationsCard />
        <CruiseEffectsCard />
      </Grid>
    );
  }

  if (isInRole(currentUser, Role.ShipOwner)) {
    return (
      <Grid>
        <CruisesCard className="col-span-2 row-span-2" />
        <ApplicationsCard className="row-span-2" />
        <UserManagementCard className="col-span-2" />
        <AccountSettingsCard className="row-span-2" />
        <NewCruiseApplicationCard />
        <HelpCard />
        <PriorityInformationCard className="col-span-2" />
        <PublicationsCard />
        <CruiseEffectsCard />
      </Grid>
    );
  }

  if (isInRole(currentUser, Role.CruiseManager)) {
    return (
      <Grid>
        <NewCruiseApplicationCard className="col-span-2 row-span-2" />
        <ApplicationsCard className="col-span-2" />
        <PriorityInformationCard />
        <AccountSettingsCard className="row-span-2" />
        <CruisesCard className="col-span-2" />
        <HelpCard />
        <PublicationsCard />
        <CruiseEffectsCard />
      </Grid>
    );
  }

  if (isInRole(currentUser, Role.Guest)) {
    return (
      <Grid>
        <CruisesCard className="col-span-2 row-span-2" />
        <ApplicationsCard className="row-span-2" />
        <PriorityInformationCard className="col-span-2" />
        <AccountSettingsCard className="row-span-2" />
        <HelpCard className="col-span-2" />
      </Grid>
    );
  }

  if (isInRole(currentUser, Role.ShipCrew)) {
    return (
      <Grid>
        <CruisesCard className="col-span-2 row-span-2" />
        <ApplicationsCard className="col-span-2 row-span-2" />
        <PriorityInformationCard />
        <AccountSettingsCard />
        <HelpCard className="col-span-2" />
      </Grid>
    );
  }

  return (
    <AppAlert variant="danger">
      Brak dashboarda przypisanego do ról: {currentUser?.roles.join(', ')}. Zgłoś ten fakt administratorom strony.
    </AppAlert>
  );
}
