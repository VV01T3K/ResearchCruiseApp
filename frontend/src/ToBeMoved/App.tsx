import {createContext, Dispatch, SetStateAction, useState} from 'react';
import {UserData} from 'User/UserData';
import {BrowserRouter, useLocation} from 'react-router-dom';
import {Interceptors} from '@api/Api';
import BusyEvent from './CommonComponents/BusyEvent';
import PageBackground from '../components/Page/Background/PageBackground';
import PageHeader from './Pages/PageHeader/PageHeader';
import RoleBasedRouting from '../route/RoleBasedRouting';
import {BusyContext} from '@contexts/BusyContext';
import {VersionInfo} from '@components/VersionInfo';
import './App.css';

export const UserContext = createContext<null | {
  userData: UserData | null;
  setUserData: Dispatch<SetStateAction<UserData | null>>;
}>(null);

export const OpenedWithLocation = () => {
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  return searchParams.get('data') != null;
};

const AppContent = () => {
  BusyEvent();
  const { SetInterceptors } = Interceptors();
  const OnAppStart = () => {
    const [isLoaded, setIsLoaded] = useState(false);
    if (!isLoaded) {
      setIsLoaded(true);
      SetInterceptors();
    }
  };

  OnAppStart();

  const openedWithLocation = OpenedWithLocation();
  return (
    <div className='vh-100'>
      <PageBackground />
      {!openedWithLocation && <PageHeader />}
      {/*<div className={isBusy ? 'visually-hidden' : ' h-100'}>*/}
      <RoleBasedRouting />
      {/*</div>*/}
      {/*{isBusy && <></>*/}
      {/*// <WaitingPage />*/}
      {/*}*/}
    </div>
  );
};

function App() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const busyMessage = useState<string | null>(null);
  const [isBusy, _] = busyMessage;
  return (
    <BusyContext.Provider value={busyMessage}>
      <div style={{ cursor: isBusy ? 'progress' : 'default' }}>
        <UserContext.Provider value={{ userData, setUserData }}>
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
          <VersionInfo />
        </UserContext.Provider>
      </div>
    </BusyContext.Provider>
  );
}

export default App;
