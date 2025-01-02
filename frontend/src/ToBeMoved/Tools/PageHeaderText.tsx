import {useEffect, useState} from 'react';
import {useLocation} from 'react-router-dom';
import {Path as Path} from './Path';
import UserDataManager from '../CommonComponents/UserDataManager';
import useWindowWidth from '@hooks/useWindowWidth';

const PageHeaderText = () => {
  const [pageHeaderText, _setPageHeaderText] = useState<string | null>(null);
  const { userData, UserLoggedIn } = UserDataManager();
  const location = useLocation();
  const loggedIn = UserLoggedIn();
  const width = useWindowWidth();
  const setPageHeaderText = () => {
    let text = null;
    if (width >= 768) {
      switch (location.pathname) {
        case Path.Default:
          if (UserLoggedIn() && userData) {
            text = `Witaj, ${userData!.firstName}`;
          }
          break;
        default:
          break;
      }
    } else {
      switch (location.pathname) {
        case Path.Form:
          text = `Formularz ${location?.state?.formType}`;
          break;
        case Path.ManageUsers:
          text = 'Zarządzanie użytkownikami';
          break;
        case Path.CruiseApplications:
          text = 'Zgłoszenia';
          break;
        case Path.CruiseApplicationDetails:
          text = 'Szczegóły zgłoszenia';
          break;
        case Path.Cruises:
          text = 'Rejsy';
          break;
        case Path.CruiseForm:
          text = 'Rejs';
          break;
        case Path.AccountSettings:
          text = 'Ustawienia konta';
          break;
        case Path.MyPublications:
          text = 'Moje publikacje';
          break;
        case Path.CruiseEffects:
          text = 'Zrealizowane efekty';
          break;
        case Path.FormAForSupervisor:
          text = 'Formularz A';
          break;
        case Path.PriorityInformation:
          text = 'Zasady priorytetyzacji';
          break;
        case Path.HelpInformation:
          text = 'Pomoc';
          break;
      }
    }

    _setPageHeaderText(text);
  };

  useEffect(() => {
    setPageHeaderText();
  }, [location.pathname, loggedIn, 'load']);

  return { pageHeaderText };
};
export default PageHeaderText;
