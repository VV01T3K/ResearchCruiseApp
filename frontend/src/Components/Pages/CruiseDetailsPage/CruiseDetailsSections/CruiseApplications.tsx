import ApplicationsList from "../../ApplicationsPage/ApplicationsList";
import {Application} from "../../ApplicationsPage/ApplicationsPage";
import {Dispatch, SetStateAction, useState} from "react";
import {UseFormReturn} from "react-hook-form";
import {EditCruiseFormValues} from "../CruiseDetailsPage";

type Props = {
    editCruiseForm: UseFormReturn<EditCruiseFormValues>,
    applications: Application[],
    setApplications: (applications: Application[]) => void,
    addingMode: boolean,
    setAddingMode: Dispatch<SetStateAction<boolean>>
}


export default function CruiseApplications(props: Props) {
    const updateApplications = (applications: Application[]) => {
        props.setApplications(applications)
        props.editCruiseForm.setValue(
            "applicationsIds",
            applications.map(app => app.id)
        )

        if (props.addingMode)
            props.setAddingMode(false)
    }

    return (
        <div className="p-2 w-100">
            <ApplicationsList
                boundApplications={props.applications}
                setBoundApplications={updateApplications}
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
                        boundApplications={props.applications}
                        setBoundApplications={updateApplications}
                    />
                </div>
            }
        </div>
    )
}