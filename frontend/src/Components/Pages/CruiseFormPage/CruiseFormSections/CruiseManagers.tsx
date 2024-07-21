import React from "react";
import DatePicker from "react-datepicker";
import {Controller, set, UseFormReturn, useWatch} from "react-hook-form";
import ErrorCode from "../../CommonComponents/ErrorCode";
import {EditCruiseFormValues} from "../CruiseFormPage";
import {Time} from "../../FormPage/Inputs/TaskInput/TaskInput";
import FormUserSelect, {FormUser} from "../../FormPage/Inputs/FormUserSelect";
import {Application} from "../../ApplicationsPage/ApplicationsPage";

type Props = {
    applications: Application[]
    editCruiseForm: UseFormReturn<EditCruiseFormValues>
}


export default function CruiseManagers(props: Props) {
    const getUsersFromApplications = (): FormUser[] => {
        const usersPairs = props.applications
            .map(application => {
                const cruiseManager: FormUser = {
                    id: application.cruiseManagerId,
                    email: application.cruiseManagerEmail,
                    firstName: application.cruiseManagerFirstName,
                    lastName: application.cruiseManagerLastName
                }
                const deputyManager: FormUser = {
                    id: application.deputyManagerId,
                    email: application.deputyManagerEmail,
                    firstName: application.deputyManagerFirstName,
                    lastName: application.deputyManagerLastName
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
                            <FormUserSelect
                                className="col-12"
                                name="managersTeam.mainCruiseManagerId"
                                label="Kierownik główny"
                                values={getUsersFromApplications()}
                                form={props.editCruiseForm}
                            />
                        </div>
                        <div className="d-flex flex-wrap col-12 col-xl-6 justify-content-center h-100 py-2">
                            <FormUserSelect
                                className="col-12"
                                name="managersTeam.mainDeputyManagerId"
                                label="Zastępca kierownika głównego"
                                values={getUsersFromApplications()}
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