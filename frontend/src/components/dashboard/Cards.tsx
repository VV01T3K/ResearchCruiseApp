import { Award } from 'lucide-react';
import { BookOpen } from 'lucide-react';
import { CalendarCheck } from 'lucide-react';
import { Settings } from 'lucide-react';
import { Info } from 'lucide-react';
import { Users } from 'lucide-react';
import { CirclePlus } from 'lucide-react';
import { ListChecks } from 'lucide-react';

import { GridCard } from './GridCard';

export function NewCruiseApplicationCard({ className }: { className?: string }) {
  return (
    <GridCard
      key="new_form"
      name="Nowe zgłoszenie"
      description="Zgłoś nowy rejs"
      href="/applications/new"
      Icon={CirclePlus}
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
      Icon={Info}
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
      Icon={Users}
      iconClassName="fill-current"
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
      Icon={Settings}
      iconClassName="fill-current [&>circle]:fill-white"
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
      Icon={ListChecks}
      className={className}
    />
  );
}

export function HelpCard({ className }: { className?: string }) {
  return (
    <GridCard key="help" name="Pomoc" description="Uzyskaj pomoc" href="/help" Icon={Info} className={className} />
  );
}

export function CruisesCard({ className }: { className?: string }) {
  return (
    <GridCard
      key="cruises"
      name="Harmonogram rejsów"
      description="Przeglądaj oraz planuj rejsy"
      href="/cruises"
      Icon={CalendarCheck}
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
      Icon={BookOpen}
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
      Icon={Award}
      iconClassName="fill-current"
      className={className}
    />
  );
}
