import {SectionWrapper} from "../../Wrappers/FormASections";
import React from "react";

export const cruiseDetailsSectionFieldNames = {


}

// TODO: Change this fields

// <h5 required={false} className={`pb-0 p-4 col-12 text-center ${props.readonly ? 'd-none' : ''}`}>Czy w ramach rejsu planuje
//     //                         się:</h5>
//                     <FormRadio className={`col-12 col-md-12 ${form.watch("equipmentOutsideRequired") === 0 ? "col-xl-3": "col-xl-12 ps-5 pe-5"} p-3 `}
//                                label="Wystawianie sprzętu
//                         badawczego (boje, c-pody, sieci itp.) poza statek w ramach czasu trwania rejsu"
//                                name="equipmentOutsideRequired"
//                                values={["tak", "nie"]}
//                                isVertical={false}
//                     />
//                     {(() => {
//                         // @ts-ignore
//                         if (form.watch("equipmentOutsideRequired") === 0) {
//                             return (
//                                 <ActionInput className="col-12 col-xl-9" name={"equipment"} actionName={"Sprzęt"}/>
//
//                             )
//                         } else {
//
//                             if (form.formState.errors["equipment"] != undefined) {
//                                 //     form.unregister("differentUsage")
//                                 form.clearErrors("equipment")
//                             }
//                             return <DummyTag required={false}/>
//                         }
//                     })()}
//
//                     <FormRadio className={`col-12 col-md-12 ${form.watch("equipmentLeaveRequired") === 0 ? "col-xl-3": "col-xl-12 ps-5 pe-5"} p-3 `}
//                                label="Pozostawianie sprzętu (boje,
//                         c-pody, sieci itp.) na dłuższy okres lub zbieranie pozostawionego podczas wcześniejszych rejsów
//                         sprzętu"
//                                name="equipmentLeaveRequired"
//                                values={["tak", "nie"]}
//                                isVertical={false}
//                     />
//                     {(() => {
//                         // @ts-ignore
//                         if (form.watch("equipmentLeaveRequired") === 0) {
//                             return (
//                                 <ActionInput className="col-12 col-xl-9" name={"equipmentLeave"} actionName={"Sprzęt"}/>
//
//                             )
//                         } else {
//
//                             if (form.formState.errors["equipmentLeave"] != undefined) {
//                                 //     form.unregister("differentUsage")
//                                 form.clearErrors("equipmentLeave")
//                             }
//                             return <DummyTag required={false}/>
//                         }
//                     })()}
//                     <FormRadio className={`col-12 col-md-12 ${form.watch("portLeaveRequired") === 0 ? "col-xl-3": "col-xl-12 ps-5 pe-5"} p-3 `}
//                                label="Dodatkowe wchodzenie i wychodzenie z portu"
//                                name="portLeaveRequired"
//                                values={["tak", "nie"]}
//                                isVertical={false}
//                     />
//                     {(() => {
//                         // @ts-ignore
//                         if (form.watch("portLeaveRequired") === 0) {
//                             return (
//                                 <ActionInput className="col-12 col-xl-9" name={"portLeave"} actionName={"Port"}/>
//
//                             )
//                         } else {
//
//                             if (form.formState.errors["portLeave"] != undefined) {
//                                 //     form.unregister("differentUsage")
//                                 form.clearErrors("portLeave")
//                             }
//                             return <DummyTag required={false}/>
//                         }
//                     })()}

export const CruiseDetailsSection = () => SectionWrapper(
    {
        shortTitle: "Szczegóły",
        longTitle: "Szczegóły rejsu",
        sectionFieldNames:cruiseDetailsSectionFieldNames,
        children: <></>
    }
)