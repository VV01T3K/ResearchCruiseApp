import React, {Dispatch, useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import FormTemplate, {FormValues} from "../Wrappers/FormTemplate";
import FormUserSelect, {FormUser} from "../Inputs/FormUserSelect";
import FormSection from "../Wrappers/FormSection";
import TextArea from "../Inputs/TextArea";
import FormRadio from "../Inputs/FormRadio";
import ClickableMap from "../Inputs/ClickableMap";
import TaskInput, {Task, Time} from "../Inputs/TaskInput/TaskInput";
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
import ThesisInput, {Thesis} from "../Inputs/ThesisInput/ThesisInput"
import PublicationsInput, {Publication} from "../Inputs/PublicationsInput/PublicationsInput";
import ErrorCode from "../../CommonComponents/ErrorCode";
import {Cruise} from "../../CruisesPage/CruisesPage";
import {useLocation} from "react-router-dom";
import CruiseBasicInfo from "../../CruiseFormPage/CruiseFormSections/CruiseBasicInfo";
import CruiseDate from "../../CruiseFormPage/CruiseFormSections/CruiseDate";
import ActionInput from "../Inputs/ActionInput/ActionInput";
import DetailedPlanInput from "../Inputs/DetailedPlanInput";
import EquipmentInput from "../Inputs/EquipmentInput";
import TechnicalElementsUsedInput from "../Inputs/TechnicalElementsUsedInput";
import PageTitleWithNavigation from "../../CommonComponents/PageTitleWithNavigation";


export type ResearchArea = {
    name: string,
    x: number[],
    y: number[]
}

type FormBInitValues = {
    cruiseManagers: FormUser[],
    deputyManagers: FormUser[],
    years: number[],
    shipUsages: string[],
    researchAreas: ResearchArea[],
    cruiseGoals: string[],
    historicalTasks: Task[]
}

export type FormBValues = {
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

export type FormBValue =
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
    loadValues?: FormBValues,
    readonly: boolean
}

type CruiseManagersTeam = {
    mainCruiseManagerId: string,
    mainDeputyManagerId: string
}

export type EditCruiseFormValues = {
    date: Time,
    managersTeam: CruiseManagersTeam,
    applicationsIds: string[]
}

type CruiseFormPageLocationState = {
    cruise?: Cruise
}

function FormB(props: Props){
    const form = useForm({
        mode: 'onBlur',
        // defaultValues: defaultValues,
        shouldUnregister: false
    });

    const location = useLocation()
    const [locationState, _]: [CruiseFormPageLocationState, Dispatch<any>]
        = useState(location.state || { })


    const [sections, setSections] = useState({
        "Rejs":"Numer ewidencyjny rejsu",
        "Kierownik":"Kierownik zgłaszanego rejsu",
        "Czas":"Czas trwania zgłaszanego rejsu",
        "Pozwolenia": "Dodatkowe pozwolenia do planowanych podczas rejsu badań",
        "Rejon": "Rejon prowadzenia badań",
        "Cel": "Cel Rejsu",
        "Zadania": "Zadania do zrealizowania w trakcie rejsu",
        "Umowy": "Umowy regulujące współpracę, w ramach której miałyby być realizowane zadania badawcze",
        "Z. badawcze": "Zespoły badawcze, jakie miałyby uczestniczyć w rejsie",
        "Publikacje/prace": "Publikacje i prace",
        "SPUB": "Zadania SPUB, z którymi pokrywają się zadania planowane do realizacji na rejsie",
        "Szczegóły":"Szczegóły rejsu",
        "Plan": "Szczegółowy plan zadań do realizacji podczas rejsu",
        "Sprzęt": "Lista sprzętu i aparatury badawczej planowanej do użycia podczas rejsu",
        "E. techniczne": "Elementy techniczne statku wykorzystywane podczas rejsu"
    })





    const [formInitValues, setFormInitValues]
        = useState<FormBInitValues>()
    useEffect(() => {
        api
            .get('/Forms/A/InitData')
            .then(response => {
                setFormInitValues(response.data)
                console.log(response.data as FormBInitValues)
            })
            .catch(error => console.log(error))
    },[]);

    useEffect(() => {
        console.log(formInitValues)
    }, [formInitValues])

    const { dispatchEvent } = useCustomEvent('busy')

    const EMPTY_GUID: string = "00000000-0000-0000-0000-000000000000"

    const editCruiseFormDefaultValues: EditCruiseFormValues = {
        date:
            locationState.cruise?.date ??
            { start: "", end: "" },
        managersTeam: {
            mainCruiseManagerId:
                locationState.cruise?.mainCruiseManagerId ??
                EMPTY_GUID,
            mainDeputyManagerId:
                locationState.cruise?.mainDeputyManagerId ??
                EMPTY_GUID
        },
        applicationsIds:
            locationState.cruise?.applicationsShortInfo.map(app => app.id) ??
            []
    }

    const cruiseForm = useForm<EditCruiseFormValues>({
        defaultValues: editCruiseFormDefaultValues
    })

    return (
        <FormTemplate
            form={form}
            loadValues={props.loadValues}
            readonly={props.readonly}
            type='B'
        >
            <PageTitleWithNavigation
                sections={sections}
                title={"Formularz B"}
                showRequiredSections={true}
            />
            <FormWithSections sections={sections} form={form} readonly={props.readonly}>
                <FormSection title={sections.Rejs}>
                    <CruiseBasicInfo cruise={locationState.cruise} />

                </FormSection>
                <FormSection title={sections.Kierownik}>
                    <FormUserSelect
                        className="col-12 col-md-6 col-xl-4"
                        name="cruiseManagerId"
                        label="Kierownik rejsu"
                        values={formInitValues?.cruiseManagers}
                    />
                    <FormUserSelect
                        className="col-12 col-md-6 col-xl-4"
                        name="deputyManagerId"
                        label="Zastępca"
                        values={formInitValues?.deputyManagers}
                    />
                </FormSection>

                <FormSection title={sections.Czas}>
                    <CruiseDate editCruiseForm={cruiseForm} />
                    <FormRadio className="col-12 col-md-12 col-xl-6 p-3"
                               label="Statek na potrzeby badań będzie wykorzystywany:"
                               name="shipUsage"
                               values={formInitValues?.shipUsages}
                    />
                    {(() => {
                        if (formInitValues?.shipUsages?.length &&
                            form.watch("shipUsage") == formInitValues?.shipUsages?.length - 1
                        ) {
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
                    <ClickableMap
                        label="Obszar prowadzonych badań" name="researchArea"
                        // image={formInitValues?.researchAreasMap}
                        regions={formInitValues?.researchAreas}
                    />
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
                               values={formInitValues?.cruiseGoals}
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
                    <div required={false} className={`pb-0 p-4 ${props.readonly ? 'd-none':''}`}>
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
                        required={true}
                        className="col-12"
                        label="Publikacje"
                        name="publications"
                        historicalPublications={[
                            {
                                category: "subject",
                                DOI: "10.1016/j.marenvres.2023.106132",
                                authors: "Urszula Kwasigroch, Katarzyna Łukawska-Matuszewska, Agnieszka Jędruch, Olga Brocławik, Magdalena Bełdowska",
                                title: "Mobility and bioavailability of mercury in sediments of the southern Baltic sea in relation to the chemical fractions of iron: Spatial and temporal patterns",
                                magazine: "Marine Environmental Research",
                                year: "2023",
                                points: "0"

                            },
                            {
                                category: "subject",
                                DOI: "10.1016/j.csr.2018.08.008",
                                authors: "Aleksandra Brodecka-Goluch, Katarzyna Łukawska-Matuszewska",
                                title: "Porewater dissolved organic and inorganic carbon in relation to methane occurrence in sediments of the Gdańsk Basin (southern Baltic Sea)",
                                magazine: "Continental Shelf Research",
                                year: "2018",
                                points: "30"
                            },
                            {
                                category: "postscript",
                                DOI: "10.3390/biology12020147",
                                authors: "Natalia Miernik, Urszula Janas, Halina Kendzierska",
                                title: "Role of macrofaunal communities in the Vistula River plume, the Baltic Sea - bioturbation and bioirrigation potential",
                                magazine: "Biology",
                                year: "2023",
                                points: "100"
                            },
                            {
                                category: "postscript",
                                DOI: "10.1016/j.scitotenv.2020.140306",
                                authors: "Jakub Idczak, Aleksandra Brodecka-Goluch, Katarzyna Łukawska-Matuszewska, Bożena Graca, Natalia Gorska, Zygmunt Klusek, Patryk Pezacki, Jerzy Bolałek",
                                title: "A geophysical, geochemical and microbiological study of a newly discovered pockmark with active gas seepage and submarine groundwater discharge (MET1-BH, central Gulf of Gdańsk, southern Baltic Sea)",
                                magazine: "Science of the Total Environment",
                                year: "2020",
                                points: "200"
                            }
                        ]}
                    />
                    <div required={false} className={`pb-0 p-4 ${props.readonly ? 'd-none' : ''}`}>
                        <h5 className={"text-center"}>Prace dyplomowe/doktorskie zawierające dopisek</h5>
                        <p>Prace licencjackie, magisterskie oraz doktorskie zawierające informację w treści pracy
                            wskazujący jednoznacznie że <strong>badania w ramach niniejszej pracy były prowadzone z
                                pokładu jednostki RV Oceanograf.</strong></p>
                    </div>
                    <ThesisInput
                        required={true}
                        className="col-12"
                        label="Prace"
                        name="works"
                        historicalThesis={[
                            {
                                category: "doctor",
                                author: "Marian Domogolski",
                                title: "Analiza i badania wód głębinowych na terenie Morza Bałtyckiego ze szczególnym uwzględnieniem wód i wód głębinowych",
                                promoter: "Elżbieta Widłogrodzka",
                                year: "2020"

                            },
                            {
                                category: "master",
                                author: "Marian Domogolski",
                                title: "Analiza i badania wód głębinowych na terenie Morza Bałtyckiego ze szczególnym uwzględnieniem wód i wód głębinowych",
                                promoter: "Elżbieta Widłogrodzka",
                                year: "2020"
                            },
                            {
                                category: "bachelor",
                                author: "Marian Domogolski",
                                title: "Analiza i badania wód głębinowych na terenie Morza Bałtyckiego ze szczególnym uwzględnieniem wód i wód głębinowych",
                                promoter: "Elżbieta Widłogrodzka",
                                year: "2020"
                            }
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
                <FormSection title={sections["Szczegóły"]}>
                    <h5 required={false} className={`pb-0 p-4 col-12 text-center ${props.readonly ? 'd-none' : ''}`}>Czy w ramach rejsu planuje
                        się:</h5>
                    <FormRadio className={`col-12 col-md-12 ${form.watch("equipmentOutsideRequired") === 0 ? "col-xl-3": "col-xl-12 ps-5 pe-5"} p-3 `}
                               label="Wystawianie sprzętu
                        badawczego (boje, c-pody, sieci itp.) poza statek w ramach czasu trwania rejsu"
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
                               label="Pozostawianie sprzętu (boje,
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
                               label="Dodatkowe wchodzenie i wychodzenie z portu"
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
                    <DetailedPlanInput className={"col-12"} name={"plan"}/>
                </FormSection>
                <FormSection title={sections["Sprzęt"]}>
                    <EquipmentInput className={"col-12"} name={"equipment2"}/>
                </FormSection>
                <FormSection title={sections["E. techniczne"]}>
                    <TechnicalElementsUsedInput className={"col-12"} name={"technical"}/>
                </FormSection>

            </FormWithSections>
        </FormTemplate>
    )
}


export default FormB