import { UserContext } from "@contexts/UserContext";
import { Link, useNavigate } from "@tanstack/react-router";
import { useContext } from "react";
import UGLogoIcon from "../../assets/uglogo.svg?react";
import BroadcastIcon from "bootstrap-icons/icons/broadcast.svg?react";
import EnvelopeIcon from "bootstrap-icons/icons/envelope.svg?react";
import HouseIcon from "bootstrap-icons/icons/house.svg?react";
import LogoutIcon from "bootstrap-icons/icons/box-arrow-right.svg?react";

export function AppHeader() {
  const userContext = useContext(UserContext);
  const navigate = useNavigate();

  function openRadio() {
    window.open("https://player.mors.ug.edu.pl/sites/all/modules/jplayer/mors_popup.html", "newWin", "width=280,height=220");
  }
  
  function signOut() {
    userContext?.signOut();
    navigate({ to: "/" });
  }

  return (
    <header className="bg-blue-600 px-8 py-4 flex justify-between items-center">
			<div>
        <a href="https://ug.edu.pl/" target="_blank" title="Strona Główna" rel="home" className="block w-24 text-white">
          <UGLogoIcon />
        </a>
			</div>
			<div className="flex items-center space-x-4">
        <a href="#" onClick={openRadio} title="Radio MORS" className="block w-6 text-white">
          <BroadcastIcon />
        </a>
        <a href="https://outlook.com/ug.edu.pl" target="_blank" title="Poczta Uniwersytecka" className="block w-6 text-white">
          <EnvelopeIcon />
        </a>
				<Link to="/" title="Strona Domowa" className="block w-6 text-white">
					<HouseIcon />
				</Link>
				{userContext?.currentUser ? (
          <a href="#" onClick={signOut} title="Wyloguj" className="block w-6 text-white">
            <LogoutIcon />
          </a>
				) : null}
			</div>
		</header>
  )
}
