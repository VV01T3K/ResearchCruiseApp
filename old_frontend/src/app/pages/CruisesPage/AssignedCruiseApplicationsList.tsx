import { LinkWithStateProps } from "@components/Navigation/LinkWithState"
// import ReadOnlyTextInput from '../../CommonComponents/ReadOnlyTextInput';
import ReadOnlyTextInput from "../../../ToBeMoved/CommonComponents/ReadOnlyTextInput"
import { useNavigate } from "react-router-dom"
import userDataManager from "../../../ToBeMoved/CommonComponents/UserDataManager"
import { Path } from "../../../ToBeMoved/Tools/Path"
import { CruiseApplicationShortInfo } from "CruiseApplicationShortInfo"
import { Buffer } from "buffer"
import userBasedAccess from "../../../route/UserBasedAccess"
import { getCruiseApplication } from "@api/requests"

type Props = {
  cruiseApplicationsShortInfo: CruiseApplicationShortInfo[]
}

type LinkWithStateDownloadApplicationProps = LinkWithStateProps & {
  cruiseApplicationId: string
}

export function LinkWithStateDownloadApplication(props: LinkWithStateDownloadApplicationProps) {
  const navigate = useNavigate()

  return (
    <a
      className={!props.disabled ? "link-with-state" : "link-with-state-disabled"}
      onClick={() => {
        getCruiseApplication(props.cruiseApplicationId).then((response) => {
          props.state.cruiseApplication = response?.data
          if (!props.disabled) {
            if (props.useWindow) {
              const param = Buffer.from(JSON.stringify(props.state)).toString("base64")
              // temporary
              const params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,
                            width=900,height=1200,left=-1000,top=-1000`
              window.open(props.to + "?data=" + param, "_blank", params)
            } else {
              navigate(props.to, {
                state: props.state,
              })
            }
          }
        })
      }}
    >
      {props.label}
    </a>
  )
}

export const CanCurrentUserAccessCruiseApplication = () => {
  const { userData } = userDataManager()
  const { UserHasAdminAccess, UserHasShipownerAccess, UserHasGuestAccess } = userBasedAccess()
  return (cruiseApplication: CruiseApplicationShortInfo) =>
    UserHasGuestAccess() ||
    UserHasAdminAccess() ||
    UserHasShipownerAccess() ||
    cruiseApplication.cruiseManagerId == userData?.id ||
    cruiseApplication.deputyManagerId == userData?.id
}

export default function AssignedCruiseApplicationsList(props: Props) {
  const canCurrentUserAccessCruiseApplication = CanCurrentUserAccessCruiseApplication()
  return (
    <>
      {props.cruiseApplicationsShortInfo.length == 0 && <div>Brak zgłoszeń</div>}
      {props.cruiseApplicationsShortInfo.map((cruiseApplication, index: number) => (
        <div
          key={index}
          className={`d-flex col-12 ${index < props.cruiseApplicationsShortInfo.length - 1 && "mb-2"}`}
        >
          <div className="d-flex flex-wrap align-content-center justify-content-center col-6">
            <div className="d-flex justify-content-center w-100">Numer:</div>
            {canCurrentUserAccessCruiseApplication(cruiseApplication) && (
              <LinkWithStateDownloadApplication
                className="text-center w-100"
                to={Path.CruiseApplicationDetails}
                label={cruiseApplication.number}
                state={{ readOnly: true }}
                cruiseApplicationId={cruiseApplication.id}
              />
            )}
            {!canCurrentUserAccessCruiseApplication(cruiseApplication) && (
              <div className={"justify-content-center"}>{cruiseApplication.number}</div>
            )}
          </div>
          <div className="d-flex flex-wrap align-content-center col-6 mb-2">
            <div className="d-flex justify-content-center w-100">Punkty:</div>
            <ReadOnlyTextInput
              value={cruiseApplication.points.toString()}
              className="d-flex w-100"
            />
          </div>
        </div>
      ))}
    </>
  )
}
