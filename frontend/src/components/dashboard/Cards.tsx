import { Award as AwardFillIcon } from 'lucide-react';
import { BookOpen as BookIcon } from 'lucide-react';
import { CalendarCheck as CalendarCheckIcon } from 'lucide-react';
import { Settings as GearFillIcon } from 'lucide-react';
import { Info as InfoIcon } from 'lucide-react';
import { Info as InfoCircleIcon } from 'lucide-react';
import { Users as PeopleFillIcon } from 'lucide-react';
import { CirclePlus as PlusCircleFillIcon } from 'lucide-react';
import { Radio as UIRadiosIcon } from 'lucide-react';

import { GridCard } from './GridCard';

export function NewCruiseApplicationCard({ className }: { className?: string }) {
  return (
    <GridCard
      key="new_form"
      name="Nowe zgłoszenie"
      description="Zgłoś nowy rejs"
      href="/applications/new"
      Icon={PlusCircleFillIcon}
      className={className}
    />
  );
}

export function PriorityInformationCard({ className }: { className?: string }) {
  return (
    <GridCard
      key="prioritization_info"
      name="Informacje o priorytetyzacji"
      description="Dowiedz się więcej o zasadach priorytetyzacji"
      href="/priority-information"
      Icon={InfoIcon}
      className={className}
    />
  );
}

export function UserManagementCard({ className }: { className?: string }) {
  return (
    <GridCard
      key="user_management"
      name="Zarządzanie użytkownikami"
      description="Dodaj, edytuj lub usuń użytkowników"
      href="/user-management"
      Icon={PeopleFillIcon}
      className={className}
    />
  );
}

export function AccountSettingsCard({ className }: { className?: string }) {
  return (
    <GridCard
      key="settings"
      name="Ustawienia konta"
      description="Zmień ustawienia swojego konta"
      href="/account-settings"
      Icon={GearFillIcon}
      className={className}
    />
  );
}

export function ApplicationsCard({ className }: { className?: string }) {
  return (
    <GridCard
      key="applications"
      name="Zgłoszenia"
      description="Przeglądaj aktualne i historyczne zgłoszenia"
      href="/applications"
      Icon={UIRadiosIcon}
      className={className}
    />
  );
}

export function HelpCard({ className }: { className?: string }) {
  return (
    <GridCard
      key="help"
      name="Pomoc"
      description="Uzyskaj pomoc"
      href="/help"
      Icon={InfoCircleIcon}
      className={className}
    />
  );
}

export function CruisesCard({ className }: { className?: string }) {
  return (
    <GridCard
      key="cruises"
      name="Harmonogram rejsów"
      description="Przeglądaj oraz planuj rejsy"
      href="/cruises"
      Icon={CalendarCheckIcon}
      className={className}
    />
  );
}

export function PublicationsCard({ className }: { className?: string }) {
  return (
    <GridCard
      key="publications"
      name="Moje publikacje"
      description="Zarządzaj moimi publikacjami"
      href="/my-publications"
      Icon={BookIcon}
      className={className}
    />
  );
}

export function CruiseEffectsCard({ className }: { className?: string }) {
  return (
    <GridCard
      key="cruise_effects"
      name="Efekty rejsów"
      description="Przeglądaj efekty rejsów"
      href="/cruise-effects"
      Icon={AwardFillIcon}
      className={className}
    />
  );
}
