import { Link } from "react-router-dom"
import UserDataManager from "../../CommonComponents/UserDataManager"
import Logo from "../../../resources/logo.svg"
import BroadcastIcon from "bootstrap-icons/icons/broadcast.svg?react"
import EnvelopeIcon from "bootstrap-icons/icons/envelope.svg?react"
import HouseIcon from "bootstrap-icons/icons/house.svg?react"
import LogoutIcon from "bootstrap-icons/icons/box-arrow-right.svg?react"

type Props = {
  className?: string
}
export const RadioMorsLink = (props: Props) => {
  const OpenRadio = () =>
    window.open(
      "https://player.mors.ug.edu.pl/sites/all/modules/jplayer/mors_popup.html",
      "newWin",
      "width=280,height=220"
    )
  return (
    <Link
      className={props.className}
      id="radiomors"
      to=""
      onClick={OpenRadio}
      title="Słucha Radia MORS"
    >
      <BroadcastIcon className={"bi-header-common"} />
    </Link>
  )
}
export const OutlookLink = (props: Props) => {
  return (
    <Link
      className={props.className}
      to="https://outlook.com/ug.edu.pl"
      id="webmail"
      title="Poczta uniwersytecka"
    >
      <EnvelopeIcon className={"bi-header-common"} />
    </Link>
  )
}

export const HomeLink = (props: Props) => {
  return (
    <Link className={props.className} to="/" id="home" title="Strona domowa">
      <HouseIcon className={"bi-header-common"} />
    </Link>
  )
}

export const LogoutLink = (props: Props) => {
  const { Logout } = UserDataManager()

  return (
    <Link className={props.className} onClick={Logout} to="/" title="Wyloguj się">
      <LogoutIcon className={"bi-header-common"} />
    </Link>
  )
}

export const UgPageLink = (props: Props) => {
  return (
    <a
      className={props.className + " navbar-brand pe-3 h-100 border-end"}
      href="https://ug.edu.pl/"
      title="Strona główna"
      rel="home"
    >
      <img src={Logo} alt="Strona główna" className="d-inline align-top h-100" />
    </a>
  )
}
