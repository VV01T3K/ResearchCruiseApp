import { createFileRoute } from '@tanstack/react-router';
import { DashboardGrid, DashboardGridCard } from 'src/features/dashboard/components/DashboardGrid';
import InfoIcon from 'bootstrap-icons/icons/info.svg?react';
import InfoCircleIcon from 'bootstrap-icons/icons/info-circle.svg?react';
import PlusCircleFillIcon from 'bootstrap-icons/icons/plus-circle.svg?react';
import PeopleFillIcon from 'bootstrap-icons/icons/people-fill.svg?react';
import GearFillIcon from 'bootstrap-icons/icons/gear-fill.svg?react';
import UIRadiosIcon from 'bootstrap-icons/icons/ui-radios.svg?react';
import CalendarCheckIcon from 'bootstrap-icons/icons/calendar-check.svg?react';
import BookIcon from 'bootstrap-icons/icons/book.svg?react';
import AwardFillIcon from 'bootstrap-icons/icons/award-fill.svg?react';
import { useContext } from 'react';
import { UserContext } from '@core/contexts/UserContext';
import { Role } from '@core/models';
import { allowOnly } from '@core/helpers';

export const Route = createFileRoute('/')({
  component: Index,
  beforeLoad: allowOnly.authenticated(),
});

function Index() {
  const userContext = useContext(UserContext)!;

  const commonBackground = <div className="w-full h-full absolute opacity-50"></div>;

  function NewFormCard({ className }: { className?: string }) {
    return (
      <DashboardGridCard
        key="new_form"
        name="Nowe zgłoszenie"
        description="Zgłoś nowy rejs"
        to="/newcruise"
        background={commonBackground}
        Icon={PlusCircleFillIcon}
        className={className}
      />
    );
  }

  function PrioritizationInfoCard({ className }: { className?: string }) {
    return (
      <DashboardGridCard
        key="prioritization_info"
        name="Informacje o priorytetyzacji"
        description="Dowiedz się więcej o zasadach priorytetyzacji"
        to="/priorityinformation"
        background={commonBackground}
        Icon={InfoIcon}
        className={className}
      />
    );
  }

  function UserManagementCard({ className }: { className?: string }) {
    return (
      <DashboardGridCard
        key="user_management"
        name="Zarządzanie użytkownikami"
        description="Dodaj, edytuj lub usuń użytkowników"
        to="/usermanagement"
        background={commonBackground}
        Icon={PeopleFillIcon}
        className={className}
      />
    );
  }

  function AccountSettingsCard({ className }: { className?: string }) {
    return (
      <DashboardGridCard
        key="settings"
        name="Ustawienia konta"
        description="Zmień ustawienia swojego konta"
        to="/accountsettings"
        background={commonBackground}
        Icon={GearFillIcon}
        className={className}
      />
    );
  }

  function ApplicationsCard({ className }: { className?: string }) {
    return (
      <DashboardGridCard
        key="applications"
        name="Zgłoszenia"
        description="Przeglądaj aktualne i historyczne zgłoszenia"
        to="/applications"
        background={commonBackground}
        Icon={UIRadiosIcon}
        className={className}
      />
    );
  }

  function HelpCard({ className }: { className?: string }) {
    return (
      <DashboardGridCard
        key="help"
        name="Pomoc"
        description="Uzyskaj pomoc"
        to="/help"
        background={commonBackground}
        Icon={InfoCircleIcon}
        className={className}
      />
    );
  }

  function CruisesCard({ className }: { className?: string }) {
    return (
      <DashboardGridCard
        key="cruises"
        name="Harmonogram rejsów"
        description="Przeglądaj oraz planuj rejsy"
        to="/cruises"
        background={commonBackground}
        Icon={CalendarCheckIcon}
        className={className}
      />
    );
  }

  function PublicationsCard({ className }: { className?: string }) {
    return (
      <DashboardGridCard
        key="publications"
        name="Moje publikacje"
        description="Zarządzaj moimi publikacjami"
        to="/mypublications"
        background={commonBackground}
        Icon={BookIcon}
        className={className}
      />
    );
  }

  function CruiseEffectsCard({ className }: { className?: string }) {
    return (
      <DashboardGridCard
        key="cruise_effects"
        name="Efekty rejsów"
        description="Przeglądaj efekty rejsów"
        to="/cruiseeffects"
        background={commonBackground}
        Icon={AwardFillIcon}
        className={className}
      />
    );
  }

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
    <p className="text-danger font-bold text-center">
      Brak dashboarda przypisanego do ról: {userContext.currentUser?.roles.join(', ')}. Zgłoś ten fakt administratorom
      strony.
    </p>
  );
}
