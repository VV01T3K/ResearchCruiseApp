import {
  BookOpenIcon,
  CalendarCheckIcon,
  GearIcon,
  LifebuoyIcon,
  ListBulletsIcon,
  MedalIcon,
  PlusCircleIcon,
  RankingIcon,
  UsersIcon,
} from '@phosphor-icons/react';

import { GridCard } from './GridCard';

export function NewCruiseApplicationCard({ className }: { className?: string }) {
  return (
    <GridCard
      key="new_form"
      name="Nowe zgłoszenie"
      description="Zgłoś nowy rejs"
      href="/applications/new"
      Icon={PlusCircleIcon}
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
      Icon={RankingIcon}
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
      Icon={UsersIcon}
      iconWeight="fill"
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
      Icon={GearIcon}
      iconWeight="fill"
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
      Icon={ListBulletsIcon}
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
      Icon={LifebuoyIcon}
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
      Icon={BookOpenIcon}
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
      Icon={MedalIcon}
      iconWeight="fill"
      className={className}
    />
  );
}
