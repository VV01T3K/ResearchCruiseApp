// import React, {Dispatch, useEffect, useState} from "react";
// import {useForm} from "react-hook-form";
// import FormTemplate, {FormValues} from "../Wrappers/FormTemplate";
// import FormUserSelect, {FormUser} from "../Inputs/FormUserSelect";
// import Section from "../Wrappers/Section";
// import MonthSlider from "../Inputs/MonthSlider";
// import NumberInput from "../Inputs/NumberInput";
// import TextArea from "../Inputs/TextArea";
// import FormRadio from "../Inputs/FormRadio";
// import ClickableMap from "../Inputs/ClickableMap";
// import TaskInput, {Task, Time} from "../Inputs/TaskInput/TaskInput";
// import GuestTeamsInput, {GuestsTeam} from "../Inputs/GuestTeamsInput/GuestTeamsInput";
// import SpubTasksInput, {SpubTask} from "../Inputs/SpubTasksInput";
// import {DummyTag} from "../../../Tools/DummyTag";
// import FormWithSections from "../Wrappers/FormWithSections";
// import ContractsInput, {Contract} from "../Inputs/ContractsInput/ContractsInput";
// import UgTeamsInput, {UgTeam} from "../Inputs/UgTeamsInput/UgTeamsInput";
// import {administrationUnits} from "../../../../resources/administrationUnits";
// import useCustomEvent from "../../../Tools/useCustomEvent";
// import api from "../../../Tools/Api";
// import FormYearSelect from "../Inputs/FormYearSelect";
// import ThesesInput, {Thesis} from "../Inputs/ThesesInput/ThesesInput"
// import PublicationsInput, {Publication} from "../Inputs/PublicationsInput/PublicationsInput";
// import ErrorCode from "../../CommonComponents/ErrorCode";
// import {Cruise} from "../../CruisesPage/CruisesPage";
// import {useLocation} from "react-router-dom";
// import CruiseBasicInfo from "../../CruiseFormPage/CruiseFormSections/CruiseBasicInfo";
// import CruiseDate from "../../CruiseFormPage/CruiseFormSections/CruiseDate";
// import ActionInput from "../Inputs/ActionInput/ActionInput";
// import DetailedPlanInput from "../Inputs/DetailedPlanInput";
// import EquipmentInput from "../Inputs/EquipmentInput";
// import TechnicalElementsUsedInput from "../Inputs/TechnicalElementsUsedInput";
// import SamplesInput from "../Inputs/SamplesInput";
// import PageTitleWithNavigation from "../../CommonComponents/PageTitleWithNavigation";
// import PermissionsInput from "../Inputs/PermissionsInput/PermissionsInput";
// import CrewInput from "../Inputs/CrewInput";
//
//
// export type ResearchArea = {
//     name: string,
//     x: number[],
//     y: number[]
// }
//
// type FormCInitValues = {
//     cruiseManagers: FormUser[],
//     deputyManagers: FormUser[],
//     years: number[],
//     shipUsages: string[],
//     researchAreas: ResearchArea[],
//     cruiseGoals: string[],
//     historicalTasks: Task[]
// }
//
// export type FormCValues = {
//     cruiseManagerId: string
//     deputyManagerId: string
//     year: string
//     acceptedPeriod: number[]
//     optimalPeriod: number[]
//     cruiseDays: string
//     cruiseHours: any
//     periodNotes: string
//     shipUsage: string
//     permissions: string
//     researchArea: string
//     researchAreaInfo: string
//     cruiseGoal: string
//     cruiseGoalDescription: string
//     researchTasks: Task[]
//     contracts: Contract[]
//     ugTeams: UgTeam[]
//     guestTeams: GuestsTeam[]
//     publications: Publication[]
//     thesis: Thesis[]
//     spubTasks: SpubTask[]
// }
//
// export type FormCValue =
//     string |
//     number[] |
//     any |
//     Task[] |
//     Contract[] |
//     UgTeam[] |
//     GuestsTeam[] |
//     Publication[] |
//     Thesis[] |
//     SpubTask []
//
// type Props = {
//     loadValues?: FormCValues,
//     readonly: boolean
// }
//
// type CruiseManagersTeam = {
//     mainCruiseManagerId: string,
//     mainDeputyManagerId: string
// }
//
// export type EditCruiseFormValues = {
//     date: Time,
//     managersTeam: CruiseManagersTeam,
//     cruiseApplicationsIds: string[]
// }
//
// type CruiseFormPageLocationState = {
//     cruise?: Cruise
// }
//
// function FormC(props: Props){
//     const form = useForm({
//         mode: 'onBlur',
//         // defaultValues: defaultValues,
//         shouldUnregister: false
//     });
//
//     const location = useLocation()
//     const [locationState, _]: [CruiseFormPageLocationState, Dispatch<any>]
//         = useState(location.state || { })
//
//
//     const [sections, setSections] = useState({
//         "Rejs":"Rejs",
//         "Kierownik":"Kierownik odbytego rejsu",
//         "Czas":"Czas trwania odbytego rejsu",
//         "Pozwolenia": "Dodatkowe pozwolenia do badań podczas rejsu",
//         "Rejon": "Rejon prowadzenia badań",
//         "Cel": "Cel Rejsu",
//         "Efekty": "Efekty rejsu",
//         "Umowy": "Umowy regulujące współpracę, w ramach której zrealizowano zadania badawcze",
//         "Z. badawcze": "Zespoły badawcze, jakie uczestniczyły w rejsie",
//         "Publikacje/prace": "Publikacje i prace",
//         "SPUB": "Zadania SPUB, z którymi pokrywają się zadania zrealizowane na rejsie",
//         "Szczegóły":"Szczegóły rejsu",
//         "Plan": "Szczegółowy plan zadań zrealizowany podczas rejsu",
//         "Sprzęt": "Lista sprzętu i aparatury badawczej użytej podczas rejsu",
//         "E. techniczne": "Elementy techniczne statku wykorzystywane podczas rejsu",
//         "Próbki": "Rodzaj danych, próbek, materiału badawczego zebranego podczas rejsu",
//         "Podsumowanie": "Podsumowanie"
//     })
//
//     const [formInitValues, setFormInitValues]
//         = useState<FormCInitValues>()
//     useEffect(() => {
//         api
//             .get('/Forms/InitValues/A')
//             .then(response => {
//                 setFormInitValues(response.data)
//                 console.log(response.data as FormCInitValues)
//             })
//             .catch(error => console.log(error))
//     },[]);
//
//     useEffect(() => {
//         console.log(formInitValues)
//     }, [formInitValues])
//
//     const { dispatchEvent } = useCustomEvent('busy')
//
//     const EMPTY_GUID: string = "00000000-0000-0000-0000-000000000000"
//
//     const editCruiseFormDefaultValues: EditCruiseFormValues = {
//         date:
//             locationState.cruise?.date ??
//             { start: "", end: "" },
//         managersTeam: {
//             mainCruiseManagerId:
//                 locationState.cruise?.mainCruiseManagerId ??
//                 EMPTY_GUID,
//             mainDeputyManagerId:
//                 locationState.cruise?.mainDeputyManagerId ??
//                 EMPTY_GUID
//         },
//         cruiseApplicationsIds:
//             locationState.cruise?.cruiseApplicationsShortInfo.map(app => app.id) ??
//             []
//     }
//
//     const cruiseForm = useForm<EditCruiseFormValues>({
//         defaultValues: editCruiseFormDefaultValues
//     })
//
//     return (
//         <FormTemplate
//             form={form}
//             loadValues={props.loadValues}
//             readonly={props.readonly}
//             type='C'
//         >
//             <PageTitleWithNavigation
//                 sections={sections}
//                 title={"Formularz C"}
//                 showRequiredSections={true}
//             />
//             <FormWithSections sections={sections} form={form} readonly={props.readonly}>
//                 <Section title={sections.Rejs}>
//                     <CruiseBasicInfo cruise={locationState.cruise} />
//
//                 </Section>
//                 <Section title={sections.Kierownik}>
//                     <FormUserSelect
//                         className="col-12 col-md-6 col-xl-4"
//                         name="cruiseManagerId"
//                         label="Kierownik rejsu"
//                         values={formInitValues?.cruiseManagers}
//                     />
//                     <FormUserSelect
//                         className="col-12 col-md-6 col-xl-4"
//                         name="deputyManagerId"
//                         label="Zastępca"
//                         values={formInitValues?.deputyManagers}
//                     />
//                 </Section>
//
//                 <Section title={sections.Czas}>
//                     <CruiseDate editCruiseForm={cruiseForm} />
//                     <FormRadio className="col-12 col-md-12 col-xl-6 p-3"
//                                label="Statek na potrzeby badań był wykorzystywany:"
//                                name="shipUsage"
//                                values={formInitValues?.shipUsages}
//                     />
//                     {(() => {
//                         if (formInitValues?.shipUsages?.length &&
//                             form.watch("shipUsage") == formInitValues?.shipUsages?.length - 1
//                         ) {
//                             return (
//                                 <TextArea className="col-12 col-md-12 col-xl-6 p-3"
//                                           label="Inny sposób użycia"
//                                           name="differentUsage"
//                                           required="Podaj sposób użycia"
//                                           resize="none"
//                                 />
//                             )
//                         }
//                         else{
//                             return <DummyTag required={false} />}
//                     })()}
//                 </Section>
//
//                 <Section title={sections.Pozwolenia}>
//                     <FormRadio className="col-12 col-md-12 col-xl-6 p-3"
//                                label="Czy do badań prowadzonych podczas rejsu były potrzebne dodatkowe pozwolenia?"
//                                name="permissionsRequired"
//                                values={["tak", "nie"]}
//                     />
//                     {(() => {
//                         // @ts-ignore
//                         if (form.watch("permissionsRequired") === 0 ) {
//                             return (
//                                 <PermissionsInput className="col-12 col-md-12 col-xl-6 p-3"
//                                                   label="Jakie?"
//                                                   name="permissions"
//                                                   required="Podaj jakie"
//                                                   resize="none"
//                                 />
//                             )
//                         }
//                         else{
//
//                             if(form.formState.errors["permissions"] != undefined) {
//                                 //     form.unregister("differentUsage")
//                                 form.clearErrors("permissions")
//                             }
//                             return <DummyTag required={false} />}                    })()}
//                 </Section>
//
//                 <Section title={sections.Rejon}>
//                     <ClickableMap
//                         label="Obszar przeprowadzonych badań" name="researchArea"
//                         // image={formInitValues?.researchAreasMap}
//                         regions={formInitValues?.researchAreas}
//                     />
//                     <TextArea className="col-12 col-md-12 col-xl-6 p-3"
//                               required={false}
//                               label="Opis"
//                               name="researchAreaInfo"
//                               resize="none"
//                     />
//                 </Section>
//
//                 <Section title={sections.Cel}>
//                     <FormRadio className="col-12 col-md-12 col-xl-6 p-3"
//                                label="Cel rejsu"
//                                name="cruiseGoal"
//                                values={formInitValues?.cruiseGoals}
//                     />
//                     <TextArea className="col-12 col-md-12 col-xl-6 p-3"
//                               label="Opis"
//                               name="cruiseGoalDescription"
//                               required="Opisz cel"
//                               resize="none"
//                     />
//                 </Section>
//
//                 <Section title={sections.Efekty}>
//                     <TaskInput
//                         name={"researchTasks"}
//                         historicalTasks={[
//                             {
//                                 "type": 5,
//                                 "values": {
//                                     "title": "3re",
//                                     "time": {
//                                         "startDate": "Mon Jan 01 2024 00:00:00 GMT+0100 (czas środkowoeuropejski standardowy)",
//                                         "endDate": "Sun Dec 01 2024 00:00:00 GMT+0100 (czas środkowoeuropejski standardowy)"
//                                     },
//                                     "financingAmount": "0.00"
//                                 }
//                             },
//                             {
//                                 "type": 5,
//                                 "values": {
//                                     "title": "3re",
//                                     "time": {
//                                         "startDate": "Wed May 01 2024 00:00:00 GMT+0200 (czas środkowoeuropejski letni)",
//                                         "endDate": "Wed May 01 2024 00:00:00 GMT+0200 (czas środkowoeuropejski letni)"
//                                     },
//                                     "financingAmount": "0.00"
//                                 }
//                             },
//                             {
//                                 "type": 11,
//                                 "values": {
//                                     "description": "rtetretret"
//                                 }
//                             },
//                             {
//                                 "type": 3,
//                                 "values": {
//                                     "title": "fsdfds",
//                                     "institution": "ffsdff",
//                                     "date": "Fri Mar 15 2024 00:00:00 GMT+0100 (czas środkowoeuropejski standardowy)"
//                                 }
//                             },
//                             {
//                                 "type": 0,
//                                 "values": {
//                                     "author": "sdfdsf",
//                                     "title": "dsfdfsd"
//                                 }
//                             }
//                         ]}
//                         className="col-12"
//                         label="ss"
//                     />
//                 </Section>
//
//                 <Section title={sections.Umowy}>
//                     <ContractsInput
//                         className="col-12"
//                         name="contracts"
//                         historicalContracts={[
//                             {
//                                 category: "international",
//                                 institution: {
//                                     name: "Instytucja 1",
//                                     unit: "Jednostka 1",
//                                     localization: "Lokalizacja 1"
//                                 },
//                                 description: "Opis 1",
//                                 scan: {
//                                     name: "Skan 1",
//                                     content: "1111111111"
//                                 }
//                             },
//                             {
//                                 category: "international",
//                                 institution: {
//                                     name: "Instytucja 2",
//                                     unit: "Jednostka 2",
//                                     localization: "Lokalizacja 2"
//                                 },
//                                 description: "Opis 2",
//                                 scan: {
//                                     name: "Skan 2",
//                                     content: "222222222"
//                                 }
//                             },
//                             {
//                                 category: "domestic",
//                                 institution: {
//                                     name: "Instytucja 3",
//                                     unit: "Jednostka 3",
//                                     localization: "Lokalizacja 3"
//                                 },
//                                 description: "Opis 3",
//                                 scan: {
//                                     name: "Skan 3",
//                                     content: "3333333333"
//                                 }
//                             },
//                             {
//                                 category: "domestic",
//                                 institution: {
//                                     name: "Instytucja 4",
//                                     unit: "Jednostka 4",
//                                     localization: "Lokalizacja 4"
//                                 },
//                                 description: "Opis 4",
//                                 scan: {
//                                     name: "Skan 4",
//                                     content: "444444444"
//                                 }
//                             }
//                         ]}
//                         required={false}
//                     />
//                 </Section>
//
//                 <Section title={sections["Z. badawcze"]}>
//                     <UgTeamsInput
//                         className="col-12 col-xl-6"
//                         label="Uczestnictwo osób z jednostek organizacyjnych UG"
//                         name="ugTeams"
//                         values={administrationUnits}
//                     />
//                     <GuestTeamsInput
//                         required={false}
//                         className="col-12 col-xl-6"
//                         label="Uczestnictwo gości spoza UG"
//                         name="guestTeams"
//                         historicalGuestsInstitutions={[
//                             "Instytucja 1", "Instytucja 2", "Instytucja 3"
//                         ]}
//                     />
//                     <CrewInput className="col-12"
//                                label="Lista uczestników rejsu"
//                                name="crew"
//                                historicalCrew={[
//                                    {names: "Maksymilian",
//                                        surname: "Panicz" ,
//                                        ID: "184510",
//                                        title: "",
//                                        birthDate: "",
//                                        birthPlace: "",
//                                        expiryDate: "",
//                                        institution: ""
//                                    },
//                                    {names: "Mateusz",
//                                        surname: "Kowalczyk" ,
//                                        ID: "123456",
//                                        title: "",
//                                        birthDate: "",
//                                        birthPlace: "",
//                                        expiryDate: "",
//                                        institution: ""
//                                    },
//                                    {names: "Mateusz",
//                                        surname: "Nowak" ,
//                                        ID: "654321",
//                                        title: "",
//                                        birthDate: "",
//                                        birthPlace: "",
//                                        expiryDate: "",
//                                        institution: ""
//                                    },
//                                    {names: "Michał",
//                                        surname: "Tarnacki" ,
//                                        ID: "987654",
//                                        title: "",
//                                        birthDate: "",
//                                        birthPlace: "",
//                                        expiryDate: "",
//                                        institution: ""
//                                    }
//
//
//
//                                ]}/>
//                 </Section>
//
//                 <Section title={sections["Publikacje/prace"]}>
//                     <PublicationsInput
//                         required={true}
//                         className="col-12"
//                         label="Publikacje"
//                         name="publications"
//                         historicalPublications={[
//                             {
//                                 category: "subject",
//                                 doi: "10.1016/j.marenvres.2023.106132",
//                                 authors: "Urszula Kwasigroch, Katarzyna Łukawska-Matuszewska, Agnieszka Jędruch, Olga Brocławik, Magdalena Bełdowska",
//                                 title: "Mobility and bioavailability of mercury in sediments of the southern Baltic sea in relation to the chemical fractions of iron: Spatial and temporal patterns",
//                                 magazine: "Marine Environmental Research",
//                                 year: 2023,
//                                 ministerialPoints: 0
//
//                             },
//                             {
//                                 category: "subject",
//                                 doi: "10.1016/j.csr.2018.08.008",
//                                 authors: "Aleksandra Brodecka-Goluch, Katarzyna Łukawska-Matuszewska",
//                                 title: "Porewater dissolved organic and inorganic carbon in relation to methane occurrence in sediments of the Gdańsk Basin (southern Baltic Sea)",
//                                 magazine: "Continental Shelf Research",
//                                 year: 2018,
//                                 ministerialPoints: 30
//                             },
//                             {
//                                 category: "postscript",
//                                 doi: "10.3390/biology12020147",
//                                 authors: "Natalia Miernik, Urszula Janas, Halina Kendzierska",
//                                 title: "Role of macrofaunal communities in the Vistula River plume, the Baltic Sea - bioturbation and bioirrigation potential",
//                                 magazine: "Biology",
//                                 year: 2023,
//                                 ministerialPoints: 100
//                             },
//                             {
//                                 category: "postscript",
//                                 doi: "10.1016/j.scitotenv.2020.140306",
//                                 authors: "Jakub Idczak, Aleksandra Brodecka-Goluch, Katarzyna Łukawska-Matuszewska, Bożena Graca, Natalia Gorska, Zygmunt Klusek, Patryk Pezacki, Jerzy Bolałek",
//                                 title: "A geophysical, geochemical and microbiological study of a newly discovered pockmark with active gas seepage and submarine groundwater discharge (MET1-BH, central Gulf of Gdańsk, southern Baltic Sea)",
//                                 magazine: "Science of the Total Environment",
//                                 year: 2020,
//                                 ministerialPoints: 200
//                             }
//                         ]}
//                     />
//                     <ThesesInput
//                         className="col-12"
//                         label="Prace"
//                         name="theses"
//                         historicalTheses={[
//                             {
//                                 category: "doctor",
//                                 author: "Marian Domogolski",
//                                 title: "Analiza i badania wód głębinowych na terenie Morza Bałtyckiego ze szczególnym uwzględnieniem wód i wód głębinowych",
//                                 promoter: "Elżbieta Widłogrodzka",
//                                 year: 2020
//
//                             },
//                             {
//                                 category: "master",
//                                 author: "Marian Domogolski",
//                                 title: "Analiza i badania wód głębinowych na terenie Morza Bałtyckiego ze szczególnym uwzględnieniem wód i wód głębinowych",
//                                 promoter: "Elżbieta Widłogrodzka",
//                                 year: 2020
//                             },
//                             {
//                                 category: "bachelor",
//                                 author: "Marian Domogolski",
//                                 title: "Analiza i badania wód głębinowych na terenie Morza Bałtyckiego ze szczególnym uwzględnieniem wód i wód głębinowych",
//                                 promoter: "Elżbieta Widłogrodzka",
//                                 year: 2020
//                             }
//                         ]}
//                     />
//                 </Section>
//
//                 <Section title={sections.SPUB}>
//                     <SpubTasksInput
//                         className="col-12"
//                         name="spubTasks"
//                         historicalSpubTasks={[
//                             {
//                                 yearFrom: 2020,
//                                 yearTo: 2030,
//                                 name: "Badanie nowych właściwości wodno-tlenowych Morza Bałtyckiego w obszarze Zatoki Gdańskiej"
//                             },
//                             {
//                                 yearFrom: 2021,
//                                 yearTo: 2026,
//                                 name: "Badanie właściwości azotowych Morza Bałtyckiego w obszarze Zatoki Puckiej"
//                             },
//                             {
//                                 yearFrom: 2022,
//                                 yearTo: 2024,
//                                 name: "Bałtycki pobór zasobów mineralnych na obszarze Polskiej WSE"
//                             },
//                         ]}
//                         required={false}
//                     />
//                 </Section>
//                 <Section title={sections["Szczegóły"]}>
//                     <h5 required={false} className={`pb-0 p-4 col-12 text-center ${props.readonly ? 'd-none' : ''}`}>Czy w ramach rejsu:</h5>
//                     <FormRadio className={`col-12 col-md-12 ${form.watch("equipmentOutsideRequired") === 0 ? "col-xl-3": "col-xl-12 ps-5 pe-5"} p-3 `}
//                                label="Wystawiono sprzęt
//                         badawczy (boje, c-pody, sieci itp.) poza statek w ramach czasu trwania rejsu"
//                                name="equipmentOutsideRequired"
//                                values={["tak", "nie"]}
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
//                                label="Pozostawiono sprzęt (boje,
//                         c-pody, sieci itp.) na dłuższy okres lub zebrano pozostawiony podczas wcześniejszych rejsów
//                         sprzętu"
//                                name="equipmentLeaveRequired"
//                                values={["tak", "nie"]}
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
//                                label="Dodatkowo wchodzło i wychodziło się z portu"
//                                name="portLeaveRequired"
//                                values={["tak", "nie"]}
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
//                 </Section>
//                 <Section title={sections["Plan"]}>
//                     <DetailedPlanInput className={"col-12"} name={"plan"}/>
//                 </Section>
//                 <Section title={sections["Sprzęt"]}>
//                     <EquipmentInput className={"col-12"} name={"equipment2"}/>
//                 </Section>
//                 <Section title={sections["E. techniczne"]}>
//                     <TechnicalElementsUsedInput className={"col-12"} name={"technical"}/>
//                 </Section>
//                 <Section title={sections["Próbki"]}>
//                     <SamplesInput className={"col-12"} name={"fffff"}/>
//
//
//
//
//                 </Section>
//
//                 <Section title={sections["Podsumowanie"]}>
//                     <TextArea className="col-12 col-md-12 p-3"
//                               required={true}
//                               label="Krótki opis podsumowujący dany rejs "
//                               name="researchAreaInfo"
//                               resize="none"
//                     />
//                 </Section>
//
//             </FormWithSections>
//         </FormTemplate>
//     )
// }
//
//
// export default FormC

export {};