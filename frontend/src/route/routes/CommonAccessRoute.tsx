import { Route } from 'react-router-dom';
import { Path } from '../../ToBeMoved/Tools/Path';
import AccountPage from '@app/pages/Account/AccountPage';
import PriorityInformationPage from '@app/pages/PriorityInformationPage/PriorityInformationPage';
import HelpInformationPage from '@app/pages/HelpInformationPage/HelpInformationPage';
import LoginPage from '@app/pages/NotLoggedInPage/LoginPage/LoginPage';
import MyPublicationsPage from '@app/pages/MyPublications/MyPublicationsPage';
import CruiseEffectsPage from '@app/pages/CruiseEffects/CruiseEffectsPage';

export const CommonAccessRoute = () => {
  return (
    <>
      <Route path={Path.AccountSettings} element={<AccountPage />} />
      <Route
        path={Path.PriorityInformation}
        element={<PriorityInformationPage />}
      />
      <Route path={Path.HelpInformation} element={<HelpInformationPage />} />
    </>
  );
};
