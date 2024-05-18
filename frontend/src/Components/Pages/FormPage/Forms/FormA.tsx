import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import FormTemplate from "../Wrappers/FormTemplate";
import FormTitle from "../CommonComponents/FormTitle";
import FormUserSelect from "../Inputs/FormUserSelect";
import FormSection from "../Wrappers/FormSection";
import MonthSlider from "../Inputs/MonthSlider";
import NumberInput from "../Inputs/NumberInput";
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
import FormYearSelect from "../Inputs/FormYearSelect";
import ThesisInput from "../Inputs/ThesisInput/ThesisInput"
import PublicationsInput from "../Inputs/PublicationsInput/PublicationsInput";



export type FormAValues = {
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
    spubTasks: SpubTask[]
}

export type FormAValue =
    string |
    number[] |
    any |
    Task[] |
    Contract[] |
    UgTeam[] |
    GuestsTeam[] |
    SpubTask []

type Props = {
    loadValues?: FormAValues,
    readonly: boolean
}


function FormA(props: Props){
    const form = useForm({
        mode: 'onBlur',
        // defaultValues: defaultValues,
        shouldUnregister: false
    });


    const [sections, setSections] = useState({
        "Kierownik":"Kierownik zgłaszanego rejsu",
        "Czas":"Czas trwania zgłaszanego rejsu",
        "Pozwolenia": "Dodatkowe pozwolenia do planowanych podczas rejsu badań",
        "Rejon": "Rejon prowadzenia badań",
        "Cel": "Cel Rejsu",
        "Zadania": "Zadania do zrealizowania w trakcie rejsu",
        "Umowy": "Umowy regulujące współpracę, w ramach której miałyby być realizowane zadania badawcze",
        "Z. badawcze": "Zespoły badawcze, jakie miałyby uczestniczyć w rejsie",
        "Publikacje/prace": "Publikacje i prace",
        "SPUB": "Zadania SPUB, z którymi pokrywają się zadania planowane do realizacji na rejsie"
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
        <FormTemplate form={form} loadValues={props.loadValues} readonly={props.readonly} type='A'>
            <FormTitle sections={sections} title={"Formularz A"} />
            <FormWithSections sections={sections} form={form} readonly={props.readonly}>
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
                    <FormYearSelect className="col-12 col-md-6 col-xl-4"
                                name="year"
                                label="Rok rejsu"
                                values={formInitValues["Years"]}
                    />
                </FormSection>

                <FormSection title={sections.Czas}>
                    <MonthSlider className="col-12 col-md-12 col-xl-6 p-4 pb-0 pt-2"
                                 name="acceptablePeriod"
                                 connectedName="optimalPeriod"
                                 label="Dopuszczalny okres, w którym miałby się odbywać rejs:"
                    />
                    <MonthSlider className="col-12 col-md-12 col-xl-6 p-4 pb-0 pt-2"
                                 name="optimalPeriod"
                                 range={form.getValues("acceptablePeriod")}
                                 label="Optymalny okres, w którym miałby się odbywać rejs"
                    />
                    <NumberInput className="col-12 col-md-12 col-xl-6"
                                 name="cruiseDays"
                                 label="Liczba planowanych dób rejsowych"
                                 connectedName="cruiseHours"
                                 notZero
                                 newVal={(e) => 24*e}
                                 maxVal={99}
                    />
                    <NumberInput className="col-12 col-md-12 col-xl-6"
                                 notZero
                                 name="cruiseHours"
                                 label="Liczba planowanych godzin rejsowych"
                                 connectedName="cruiseDays"
                                 newVal={(e) => Number((e/24).toFixed(2))}
                                 maxVal={99}
                    />
                    <TextArea className="col-12 p-3"
                              required={false}
                              label="Uwagi dotyczące teminu"
                              name="periodNotes"
                              resize="none"
                    />
                    <FormRadio className="col-12 col-md-12 col-xl-6 p-3"
                               label="Statek na potrzeby badań będzie wykorzystywany:"
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
                               label="Czy do badań prowadzonych podczas rejsu są potrzebne dodatkowe pozwolenia?"
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
                        historicalGuestsInstitutions={[
                            "A. Temat", "B. Dopisek", "Instytucja 3"
                        ]}
                    />
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
                            historicalGuestsInstitutions={[
                                "Instytucja 1", "Instytucja 2", "Instytucja 3"
                            ]}
                        />
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
                </FormSection>

            </FormWithSections>
        </FormTemplate>
    )
}


export default FormA