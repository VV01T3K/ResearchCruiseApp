import { createContext, Dispatch, SetStateAction, useState } from 'react';
import { UserData } from 'User/UserData';
import { useLocation, useNavigate } from 'react-router-dom';
import { Interceptors } from '@api/Api';
import BusyEvent from './CommonComponents/BusyEvent';
import PageBackground from '../components/Page/Background/PageBackground';
import PageHeader from './Pages/PageHeader/PageHeader';
import RoleBasedRouting from './RoleBasedRouting';
import WaitingPage from '../app/pages/WaitingPage';

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
    const navigate = useNavigate();

    const { SetInterceptors } = Interceptors();
    const { DisplayIfBuisy, DisplayIfNotBuisy } = BusyEvent();
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
        <div className="vh-100">
            <PageBackground />
            {!openedWithLocation && <PageHeader />}
            <div className={DisplayIfNotBuisy() + ' h-100'}>
                <RoleBasedRouting />
            </div>
            <div className={DisplayIfBuisy() + ' w-100'}>
                <WaitingPage />
            </div>
        </div>
    );
};

function App() {
    const [userData, setUserData] = useState<UserData | null>(null);

    return (
        <UserContext.Provider value={{ userData, setUserData }}>
            <AppContent />
        </UserContext.Provider>
    );
}

export default App;
