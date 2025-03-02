import AwardFillIcon from 'bootstrap-icons/icons/award-fill.svg?react';
import BookIcon from 'bootstrap-icons/icons/book.svg?react';
import CalendarCheckIcon from 'bootstrap-icons/icons/calendar-check.svg?react';
import GearFillIcon from 'bootstrap-icons/icons/gear-fill.svg?react';
import InfoIcon from 'bootstrap-icons/icons/info.svg?react';
import InfoCircleIcon from 'bootstrap-icons/icons/info-circle.svg?react';
import PeopleFillIcon from 'bootstrap-icons/icons/people-fill.svg?react';
import PlusCircleFillIcon from 'bootstrap-icons/icons/plus-circle.svg?react';
import UIRadiosIcon from 'bootstrap-icons/icons/ui-radios.svg?react';

import { DashboardGridCard } from '@/dashboard/components/DashboardGridCard';

const commonBackground = <div className="w-full h-full absolute opacity-50"></div>;

export function NewFormCard({ className }: { className?: string }) {
  return (
    <DashboardGridCard
      key="new_form"
      name="Nowe zgłoszenie"
      description="Zgłoś nowy rejs"
      href="/newcruise"
      background={commonBackground}
      Icon={PlusCircleFillIcon}
      className={className}
    />
  );
}

export function PrioritizationInfoCard({ className }: { className?: string }) {
  return (
    <DashboardGridCard
      key="prioritization_info"
      name="Informacje o priorytetyzacji"
      description="Dowiedz się więcej o zasadach priorytetyzacji"
      href="/priorityinformation"
      background={commonBackground}
      Icon={InfoIcon}
      className={className}
    />
  );
}

export function UserManagementCard({ className }: { className?: string }) {
  return (
    <DashboardGridCard
      key="user_management"
      name="Zarządzanie użytkownikami"
      description="Dodaj, edytuj lub usuń użytkowników"
      href="/usermanagement"
      background={commonBackground}
      Icon={PeopleFillIcon}
      className={className}
    />
  );
}

export function AccountSettingsCard({ className }: { className?: string }) {
  return (
    <DashboardGridCard
      key="settings"
      name="Ustawienia konta"
      description="Zmień ustawienia swojego konta"
      href="/accountsettings"
      background={commonBackground}
      Icon={GearFillIcon}
      className={className}
    />
  );
}

export function ApplicationsCard({ className }: { className?: string }) {
  return (
    <DashboardGridCard
      key="applications"
      name="Zgłoszenia"
      description="Przeglądaj aktualne i historyczne zgłoszenia"
      href="/applications"
      background={commonBackground}
      Icon={UIRadiosIcon}
      className={className}
    />
  );
}

export function HelpCard({ className }: { className?: string }) {
  return (
    <DashboardGridCard
      key="help"
      name="Pomoc"
      description="Uzyskaj pomoc"
      href="/help"
      background={commonBackground}
      Icon={InfoCircleIcon}
      className={className}
    />
  );
}

export function CruisesCard({ className }: { className?: string }) {
  return (
    <DashboardGridCard
      key="cruises"
      name="Harmonogram rejsów"
      description="Przeglądaj oraz planuj rejsy"
      href="/cruises"
      background={commonBackground}
      Icon={CalendarCheckIcon}
      className={className}
    />
  );
}

export function PublicationsCard({ className }: { className?: string }) {
  return (
    <DashboardGridCard
      key="publications"
      name="Moje publikacje"
      description="Zarządzaj moimi publikacjami"
      href="/mypublications"
      background={commonBackground}
      Icon={BookIcon}
      className={className}
    />
  );
}

export function CruiseEffectsCard({ className }: { className?: string }) {
  return (
    <DashboardGridCard
      key="cruise_effects"
      name="Efekty rejsów"
      description="Przeglądaj efekty rejsów"
      href="/cruiseeffects"
      background={commonBackground}
      Icon={AwardFillIcon}
      className={className}
    />
  );
}
