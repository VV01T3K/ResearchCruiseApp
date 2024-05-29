import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import FormTemplate from "../Wrappers/FormTemplate";
import PageTitleWithNavigation from "../../CommonComponents/PageTitleWithNavigation";
import FormUserSelect from "../Inputs/FormUserSelect";
import FormSection from "../Wrappers/FormSection";
import TextArea from "../Inputs/TextArea";
import FormRadio from "../Inputs/FormRadio";
import ClickableMap from "../Inputs/ClickableMap";
import TaskInput, {Task} from "../Inputs/TaskInput/TaskInput";
import GuestTeamsInput, {GuestsTeam} from "../Inputs/GuestTeamsInput/GuestTeamsInput";
import SpubTasksInput, {SpubTask} from "../Inputs/SpubTasksInput";
import {DummyTag} from "../../../Tools/DummyTag";
import FormWithSections from "../Wrappers/FormWithSections";
import ContractsInput, {Contract} from "../Inputs/ContractsInput/ContractsInput";
import UgTeamsInput, {UgTeam} from "../Inputs/UgTeamsInput/UgTeamsInput";
import {administrationUnits} from "../../../../resources/administrationUnits";
import useCustomEvent from "../../../Tools/useCustomEvent";
import api from "../../../Tools/Api";
import ThesisInput, {Thesis} from "../Inputs/ThesisInput/ThesisInput"
import PublicationsInput, {Publication} from "../Inputs/PublicationsInput/PublicationsInput";
import ErrorCode from "../../LoginPage/ErrorCode";
import ActionInput from "../Inputs/ActionInput/ActionInput";
import DetailedPlanInput from "../Inputs/DetailedPlanInput";
import EquipmentInput from "../Inputs/EquipmentInput";
import TechnicalElementsUsedInput from "../Inputs/TechnicalElementsUsedInput";
import RegistrationNumber from "../Inputs/RegistrationNumber";
import DurationInput from "../Inputs/DurationInput";
import SamplesInput from "../Inputs/SamplesInput";



export type FormCValues = {
    cruiseManagerId: string
    deputyManagerId: string
    year: string
    acceptedPeriod: number[]
    optimalPeriod: number[]
    cruiseDays: string
    cruiseHours: any
    periodNotes: string
    shipUsage: string
    permissions: string
    researchArea: string
    researchAreaInfo: string
    cruiseGoal: string
    cruiseGoalDescription: string
    researchTasks: Task[]
    contracts: Contract[]
    ugTeams: UgTeam[]
    guestTeams: GuestsTeam[]
    publications: Publication[]
    thesis: Thesis[]
    spubTasks: SpubTask[]
}

export type FormCValue =
    string |
    number[] |
    any |
    Task[] |
    Contract[] |
    UgTeam[] |
    GuestsTeam[] |
    Publication[] |
    Thesis[] |
    SpubTask []

type Props = {
    loadValues?: FormCValues,
    readonly: boolean
}


function FormC(props: Props){
    const form = useForm({
        mode: 'onBlur',
        // defaultValues: defaultValues,
        shouldUnregister: false
    });


    const [sections, setSections] = useState({
        "Rejs":"Rejs",
        "Kierownik":"Kierownik odbytego rejsu",
        "Czas":"Czas trwania odbytego rejsu",
        "Pozwolenia": "Dodatkowe pozwolenia do badań podczas rejsu",
        "Rejon": "Rejon prowadzenia badań",
        "Cel": "Cel Rejsu",
        "Zadania": "Zadania zaplanowane w trakcie rejsu",
        "Umowy": "Umowy regulujące współpracę, w ramach której zrealizowano zadania badawcze",
        "Z. badawcze": "Zespoły badawcze, jakie uczestniczyły w rejsie",
        "Publikacje/prace": "Publikacje i prace",
        "SPUB": "Zadania SPUB, z którymi pokrywają się zadania zrealizowane na rejsie",
        "Szczegóły":"Szczegóły rejsu",
        "Plan": "Szczegółowy plan zadań zrealizowany podczas rejsu",
        "Sprzęt": "Lista sprzętu i aparatury badawczej użytej podczas rejsu",
        "E. techniczne": "Elementy techniczne statku wykorzystywane podczas rejsu",
        "Próbki": "Rodzaj danych, próbek, materiału badawczego zebranego podczas rejsu",
        "Podsumowanie": "Podsumowanie"
    })

    const [formInitValues, setFormInitValues] = useState([])
    const { dispatchEvent } = useCustomEvent('busy')
    useEffect(() => {
        api.get('/forms/GetData').then(response => setFormInitValues(response.data)).catch(error => console.log(error))
        console.log(formInitValues)

    },[]);

    useEffect(() => {
        console.log(formInitValues)

    }, );

    return (
        <FormTemplate form={form} loadValues={props.loadValues} readonly={props.readonly} type='B'>
            <PageTitleWithNavigation
                sections={sections}
                title={"Formularz C"}
                showRequiredSections={true}
            />
            <FormWithSections sections={sections} form={form} readonly={props.readonly}>
                <FormSection title={sections.Rejs}>
                    <RegistrationNumber className="col-12 col-md-12 col-xl-6 p-3"
                                        required={false}
                                        label="Numer ewidencyjny rejsu (nadawany przez Biuro Armatora): "
                                        name="NumberC"
                                        resize="none"
                    />
                </FormSection>
                <FormSection title={sections.Kierownik}>
                    <FormUserSelect className="col-12 col-md-6 col-xl-4"
                                    name="cruiseManagerId"
                                    label="Kierownik rejsu"
                                    values={formInitValues["CruiseManagers"]
                                    }
                                    defaultValue={formInitValues["CruiseManagers"]}
                    />
                    <FormUserSelect className="col-12 col-md-6 col-xl-4"
                                    name="deputyManagerId"
                                    label="Zastępca"
                                    values={formInitValues["DeputyManagers"]}
                    />
                </FormSection>

                <FormSection title={sections.Czas}>
                    <DurationInput className="col-12 col-xl-9" name={"diffC"} actionName={"Port"}/>

                    <FormRadio className="col-12 col-md-12 col-xl-6 p-3"
                               label="Statek na potrzeby badań był wykorzystywany:"
                               name="shipUsage"
                               values={formInitValues["ShipUsages"]}
                    />
                    {(() => {
                        if (form.watch("shipUsage") == formInitValues["ShipUsages"]?.length-1 ) {
                            return (
                                <TextArea className="col-12 col-md-12 col-xl-6 p-3"
                                          label="Inny sposób użycia"
                                          name="differentUsage"
                                          required="Podaj sposób użycia"
                                          resize="none"
                                />
                            )
                        }
                        else{
                            return <DummyTag required={false} />}
                    })()}
                </FormSection>

                <FormSection title={sections.Pozwolenia}>
                    <FormRadio className="col-12 col-md-12 col-xl-6 p-3"
                               label="Czy do badań prowadzonych podczas rejsu były potrzebne dodatkowe pozwolenia?"
                               name="permissionsRequired"
                               values={["tak", "nie"]}
                    />
                    {(() => {
                        // @ts-ignore
                        if (form.watch("permissionsRequired") === 0 ) {
                            return (
                                <TextArea className="col-12 col-md-12 col-xl-6 p-3"
                                          label="Jakie?"
                                          name="permissions"
                                          required="Podaj jakie"
                                          resize="none"
                                />
                            )
                        }
                        else{

                            if(form.formState.errors["permissions"] != undefined) {
                                //     form.unregister("differentUsage")
                                form.clearErrors("permissions")
                            }
                            return <DummyTag required={false} />}                    })()}
                    {/*<ErrorCode code={"załączyć kopię"}/>*/}
                </FormSection>

                <FormSection title={sections.Rejon}>
                    <ClickableMap label="Obszar prowadzonych badań" name="researchArea"
                                  image={formInitValues["ResearchAreasMap"]}
                                  regions={formInitValues["ResearchAreas"]} />
                    <TextArea className="col-12 col-md-12 col-xl-6 p-3"
                              required={false}
                              label="Opis"
                              name="researchAreaInfo"
                              resize="none"
                    />
                </FormSection>

                <FormSection title={sections.Cel}>
                    <FormRadio className="col-12 col-md-12 col-xl-6 p-3"
                               label="Cel rejsu"
                               name="cruiseGoal"
                               values={formInitValues["CruiseGoals"]}
                    />
                    <TextArea className="col-12 col-md-12 col-xl-6 p-3"
                              label="Opis"
                              name="cruiseGoalDescription"
                              required="Opisz cel"
                              resize="none"
                    />
                </FormSection>

                <FormSection title={sections.Zadania}>
                    <TaskInput
                        name={"researchTasks"}
                        historicalTasks={[
                            {
                                "type": 5,
                                "values": {
                                    "title": "3re",
                                    "time": {
                                        "startDate": "Mon Jan 01 2024 00:00:00 GMT+0100 (czas środkowoeuropejski standardowy)",
                                        "endDate": "Sun Dec 01 2024 00:00:00 GMT+0100 (czas środkowoeuropejski standardowy)"
                                    },
                                    "financingAmount": "0.00"
                                }
                            },
                            {
                                "type": 5,
                                "values": {
                                    "title": "3re",
                                    "time": {
                                        "startDate": "Wed May 01 2024 00:00:00 GMT+0200 (czas środkowoeuropejski letni)",
                                        "endDate": "Wed May 01 2024 00:00:00 GMT+0200 (czas środkowoeuropejski letni)"
                                    },
                                    "financingAmount": "0.00"
                                }
                            },
                            {
                                "type": 11,
                                "values": {
                                    "description": "rtetretret"
                                }
                            },
                            {
                                "type": 3,
                                "values": {
                                    "title": "fsdfds",
                                    "institution": "ffsdff",
                                    "date": "Fri Mar 15 2024 00:00:00 GMT+0100 (czas środkowoeuropejski standardowy)"
                                }
                            },
                            {
                                "type": 0,
                                "values": {
                                    "author": "sdfdsf",
                                    "title": "dsfdfsd"
                                }
                            }
                        ]}
                        className="col-12"
                        label="ss"
                    />
                </FormSection>

                <FormSection title={sections.Umowy}>
                    <ContractsInput
                        className="col-12"
                        name="contracts"
                        historicalContracts={[
                            {
                                category: "international",
                                institution: {
                                    name: "Instytucja 1",
                                    unit: "Jednostka 1",
                                    localization: "Lokalizacja 1"
                                },
                                description: "Opis 1",
                                scan: {
                                    name: "Skan 1",
                                    content: "1111111111"
                                }
                            },
                            {
                                category: "international",
                                institution: {
                                    name: "Instytucja 2",
                                    unit: "Jednostka 2",
                                    localization: "Lokalizacja 2"
                                },
                                description: "Opis 2",
                                scan: {
                                    name: "Skan 2",
                                    content: "222222222"
                                }
                            },
                            {
                                category: "domestic",
                                institution: {
                                    name: "Instytucja 3",
                                    unit: "Jednostka 3",
                                    localization: "Lokalizacja 3"
                                },
                                description: "Opis 3",
                                scan: {
                                    name: "Skan 3",
                                    content: "3333333333"
                                }
                            },
                            {
                                category: "domestic",
                                institution: {
                                    name: "Instytucja 4",
                                    unit: "Jednostka 4",
                                    localization: "Lokalizacja 4"
                                },
                                description: "Opis 4",
                                scan: {
                                    name: "Skan 4",
                                    content: "444444444"
                                }
                            }
                        ]}
                        required={false}
                    />
                </FormSection>

                <FormSection title={sections["Z. badawcze"]}>
                    <UgTeamsInput
                        className="col-12 col-xl-6"
                        label="Uczestnictwo osób z jednostek organizacyjnych UG"
                        name="ugTeams"
                        values={administrationUnits}
                    />
                    <GuestTeamsInput
                        required={false}
                        className="col-12 col-xl-6"
                        label="Uczestnictwo gości spoza UG"
                        name="guestTeams"
                        historicalGuestsInstitutions={[
                            "Instytucja 1", "Instytucja 2", "Instytucja 3"
                        ]}
                    />
                    <ErrorCode code={"Uwaga: Na tym etapie należy załączyć szczegółową listę załogi naukowej (tzw. crew list), mającej uczestniczyć w rejsie, w oparciu o załącznik „Crew List”.\n"}/>
                </FormSection>

                <FormSection title={sections["Publikacje/prace"]}>
                    <div className={`pb-0 p-4 ${props.readonly ? 'd-none':''}`}>
                        <h5 className={"text-center"}>Publikacje związane tematycznie</h5>
                        <p>Publikacje z ubiegłych 5-lat, związane <strong>bezpośrednio </strong>tematycznie z zadaniami
                            do realizacji na planowanym rejsie, <strong>opublikowane przez zespół zaangażowany w
                                realizację rejsu, z afiliacją UG.</strong></p>
                        <h5 className={"text-center"}>Publikacje zawierające dopisek</h5>
                        <p>Publikacje autorstwa zespołu zaangażowanego w realizację rejsu, ALE zawierające dopisek w
                            treści publikacji (w wersji angielskiej lub w innym języku): <strong>„…the research/study
                                was conducted onboard r/v Oceanograf (the research vessel owned by the University of
                                Gdańsk)…” lub „… samples for the present study were collected during a research cruise
                                onboard r/v Oceanograf…” </strong>lub podobny, ale wskazujący jednoznacznie że badania w
                            ramach niniejszej publikacji były prowadzone z pokładu jednostki RV Oceanograf.</p>
                    </div>
                    <PublicationsInput
                        required={false}
                        className="col-12"
                        label="Publikacje"
                        name="publications"
                        historicalPublications={[
                            "A. Temat", "B. Dopisek", "Instytucja 3"
                        ]}/>
                    <div className={`pb-0 p-4 ${props.readonly ? 'd-none' : ''}`}>
                        <h5 className={"text-center"}>Prace dyplomowe/doktorskie zawierające dopisek</h5>
                        <p>Prace licencjackie, magisterskie oraz doktorskie zawierające informację w treści pracy
                            wskazujący jednoznacznie że <strong>badania w ramach niniejszej pracy były prowadzone z
                                pokładu jednostki RV Oceanograf.</strong></p>
                    </div>
                    <ThesisInput
                        required={false}
                        className="col-12"
                        label="Prace"
                        name="works"
                        historicalThesis={[
                            "Instytucja 1", "Instytucja 2", "Instytucja 3"
                        ]}/>
                </FormSection>

                <FormSection title={sections.SPUB}>
                    <SpubTasksInput
                        className="col-12"
                        name="spubTasks"
                        historicalSpubTasks={[
                            {
                                yearFrom: "2020",
                                yearTo: "2030",
                                name: "Badanie nowych właściwości wodno-tlenowych Morza Bałtyckiego w obszarze Zatoki Gdańskiej"
                            },
                            {
                                yearFrom: "2021",
                                yearTo: "2026",
                                name: "Badanie właściwości azotowych Morza Bałtyckiego w obszarze Zatoki Puckiej"
                            },
                            {
                                yearFrom: "2022",
                                yearTo: "2024",
                                name: "Bałtycki pobór zasobów mineralnych na obszarze Polskiej WSE"
                            },
                        ]}
                        required={false}
                    />

                    <TextArea className="col-12 col-md-12 p-3"
                              required={false}
                              label="Dodatkowe dane do raportu SPUB"
                              name="researchAreaInfo"
                              resize="none"
                    />
                </FormSection>
                <FormSection title={sections["Szczegóły"]}>
                    <h5 required={false} className={`pb-0 p-4 col-12 text-center ${props.readonly ? 'd-none' : ''}`}>Czy w ramach rejsu
                        </h5>
                    <FormRadio className={`col-12 col-md-12 ${form.watch("equipmentOutsideRequired") === 0 ? "col-xl-3": "col-xl-12 ps-5 pe-5"} p-3 `}
                               label="Wystawiano sprzęt
                        badawczy (boje, c-pody, sieci itp.) poza statek w ramach czasu trwania rejsu"
                               name="equipmentOutsideRequired"
                               values={["tak", "nie"]}
                    />
                    {(() => {
                        // @ts-ignore
                        if (form.watch("equipmentOutsideRequired") === 0) {
                            return (
                                <ActionInput className="col-12 col-xl-9" name={"equipment"} actionName={"Sprzęt"}/>

                            )
                        } else {

                            if (form.formState.errors["equipment"] != undefined) {
                                //     form.unregister("differentUsage")
                                form.clearErrors("equipment")
                            }
                            return <DummyTag required={false}/>
                        }
                    })()}

                    <FormRadio className={`col-12 col-md-12 ${form.watch("equipmentLeaveRequired") === 0 ? "col-xl-3": "col-xl-12 ps-5 pe-5"} p-3 `}
                               label="Pozostawiano sprzęt (boje,
                        c-pody, sieci itp.) na dłuższy okres lub zbieranie pozostawionego podczas wcześniejszych rejsów
                        sprzętu"
                               name="equipmentLeaveRequired"
                               values={["tak", "nie"]}
                    />
                    {(() => {
                        // @ts-ignore
                        if (form.watch("equipmentLeaveRequired") === 0) {
                            return (
                                <ActionInput className="col-12 col-xl-9" name={"equipmentLeave"} actionName={"Sprzęt"}/>

                            )
                        } else {

                            if (form.formState.errors["equipmentLeave"] != undefined) {
                                //     form.unregister("differentUsage")
                                form.clearErrors("equipmentLeave")
                            }
                            return <DummyTag required={false}/>
                        }
                    })()}
                    <FormRadio className={`col-12 col-md-12 ${form.watch("portLeaveRequired") === 0 ? "col-xl-3": "col-xl-12 ps-5 pe-5"} p-3 `}
                               label="Odbywało się dodatkowo wchodzenie i wychodzenie z portu"
                               name="portLeaveRequired"
                               values={["tak", "nie"]}
                    />
                    {(() => {
                        // @ts-ignore
                        if (form.watch("portLeaveRequired") === 0) {
                            return (
                                <ActionInput className="col-12 col-xl-9" name={"portLeave"} actionName={"Port"}/>

                            )
                        } else {

                            if (form.formState.errors["portLeave"] != undefined) {
                                //     form.unregister("differentUsage")
                                form.clearErrors("portLeave")
                            }
                            return <DummyTag required={false}/>
                        }
                    })()}
                </FormSection>
                <FormSection title={sections["Plan"]}>
                    <DetailedPlanInput className={"col-12"} name={"planC"}/>
                </FormSection>
                <FormSection title={sections["Sprzęt"]}>
                    <EquipmentInput className={"col-12"} name={"equipment2C"}/>
                </FormSection>
                <FormSection title={sections["E. techniczne"]}>
                    <TechnicalElementsUsedInput className={"col-12"} name={"technicalC"}/>
                </FormSection>
                <FormSection title={sections["Próbki"]}>
                    <SamplesInput className={"col-12"} name={"fffff"}/>




                </FormSection>

                <FormSection title={sections["Podsumowanie"]}>
                    <TextArea className="col-12 col-md-12 p-3"
                              required={false}
                              label="Krótki opis podsumowujący dany rejs "
                              name="researchAreaInfo"
                              resize="none"
                    />
                </FormSection>

            </FormWithSections>
        </FormTemplate>
    )
}


export default FormC