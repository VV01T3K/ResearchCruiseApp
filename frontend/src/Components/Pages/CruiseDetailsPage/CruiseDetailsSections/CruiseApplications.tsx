import ApplicationsList from "../../ApplicationsPage/ApplicationsList";
import {Application} from "../../ApplicationsPage/ApplicationsPage";
import {Dispatch, SetStateAction, useState} from "react";

type Props = {
    applications: Application[],
    addingMode: boolean,
    setAddingMode: Dispatch<SetStateAction<boolean>>
}


export default function CruiseApplications(props: Props) {
    const [applications, setApplications] = useState(props.applications)

    const updateApplications = (applications: Application[]) => {
        setApplications(applications)
        props.setAddingMode(false)
    }

    return (
        <div className="p-2">
            <ApplicationsList
                boundedApplications={applications}
                setBoundedApplications={setApplications}
                deletionMode={true}
            />
            <div className="d-flex w-100 justify-content-center mt-3">
                {!props.addingMode &&
                    <a
                        className="btn btn-info col-12"
                        style={{ font: "inherit" }}
                        onClick={() => props.setAddingMode(true)}
                    >
                        Dołącz zgłoszenie
                    </a>
                }
                {props.addingMode &&
                    <a
                        className="btn btn-outline-dark col-12"
                        style={{ font: "inherit" }}
                        onClick={() => props.setAddingMode(false)}
                    >
                        Anuluj dołączanie zgłoszenia
                    </a>
                }
            </div>
            {props.addingMode &&
                <div className="mt-3">
                    <ApplicationsList
                        addingMode={true}
                        boundedApplications={applications}
                        setBoundedApplications={updateApplications}
                    />
                </div>
            }
        </div>
    )
}