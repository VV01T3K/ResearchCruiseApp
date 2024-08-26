import React from "react";
import DatePicker from "react-datepicker";
import {Controller, set, UseFormReturn, useWatch} from "react-hook-form";
import ErrorMessageIfPresent from "../../CommonComponents/ErrorMessageIfPresent";
import {EditCruiseFormValues} from "../CruiseFormPage";
import {Time} from "../../FormPage/Inputs/TaskTable/TaskTable";
import UserSelect, {FormUser} from "../../FormPage/Inputs/UserSelect";
import {Application} from "../../ApplicationsPage/ApplicationsPage";
import {Time} from "../../FormPage/Inputs/TaskInput/TaskInput";
import FormUserSelect, {FormUser} from "../../FormPage/Inputs/FormUserSelect";
import {CruiseApplication} from "../../CruiseApplicationsPage/CruiseApplicationsPage";

type Props = {
    cruiseApplications: CruiseApplication[]
    editCruiseForm: UseFormReturn<EditCruiseFormValues>
}


export default function CruiseManagers(props: Props) {
    const getUsersFromCruiseApplications = (): FormUser[] => {
        const usersPairs = props.cruiseApplications
            .map(cruiseApplication => {
                const cruiseManager: FormUser = {
                    id: cruiseApplication.cruiseManagerId,
                    email: cruiseApplication.cruiseManagerEmail,
                    firstName: cruiseApplication.cruiseManagerFirstName,
                    lastName: cruiseApplication.cruiseManagerLastName
                }
                const deputyManager: FormUser = {
                    id: cruiseApplication.deputyManagerId,
                    email: cruiseApplication.deputyManagerEmail,
                    firstName: cruiseApplication.deputyManagerFirstName,
                    lastName: cruiseApplication.deputyManagerLastName
                }
                return [cruiseManager, deputyManager]
            })

        return usersPairs
            .flat()
            .filter((value, index, array) =>
                // leave only unique values
                array
                    .map(user => user.id) // look at the id only to determine the uniqueness,
                    .indexOf(value.id)
                === index // leave only the first occurrence of the given user
            )
    }

    return (
        <div className="d-flex flex-wrap flex-row justify-content-center col-12 h-100">
            {/*<Controller*/}
            {/*    name="managersTeam"*/}
            {/*    control={props.editCruiseForm.control}*/}
            {/*    rules={{*/}
            {/*        validate: {*/}
            {/*            differentUsers: (value) => {*/}
            {/*                console.log(value.mainCruiseManagerId)*/}
            {/*                console.log(value.mainDeputyManagerId)*/}
            {/*                if (value.mainCruiseManagerId == value.mainDeputyManagerId) {*/}
            {/*                    return "Kierownik i jego zastępca muszą być innymi osobami"*/}
            {/*                }*/}
            {/*            }*/}
            {/*        }*/}
            {/*    }}*/}
            {/*    render={(field) => (*/}
                    <>
                        <div className="d-flex flex-wrap col-12 col-xl-6 justify-content-center h-100 py-2">
                            <UserSelect
                                className="col-12"
                                name="managersTeam.mainCruiseManagerId"
                                label="Kierownik główny"
                                values={getUsersFromCruiseApplications()}
                                form={props.editCruiseForm}
                            />
                        </div>
                        <div className="d-flex flex-wrap col-12 col-xl-6 justify-content-center h-100 py-2">
                            <UserSelect
                                className="col-12"
                                name="managersTeam.mainDeputyManagerId"
                                label="Zastępca kierownika głównego"
                                values={getUsersFromCruiseApplications()}
                                form={props.editCruiseForm}
                            />
                        </div>
                    </>
            {/*    )}*/}
            {/*/>*/}
            {/*{props.editCruiseForm?.formState.errors.managersTeam &&*/}
            {/*    <ErrorCode code={props.editCruiseForm?.formState.errors.managersTeam.message} />*/}
            {/*}*/}
        </div>
    )
}