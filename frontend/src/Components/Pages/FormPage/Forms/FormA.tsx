import React, {useContext, useEffect, useState} from "react";
import {useForm, useFormContext} from "react-hook-form";
import FormTemplate, {FormContext, FormValues} from "../Wrappers/FormTemplate";
import FormTitleWithNavigation from "../../CommonComponents/FormTitleWithNavigation";
import UserSelect, {FormUser} from "../Inputs/UserSelect";
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
import api from "../../../Tools/Api";
import FormYearSelect from "../Inputs/FormYearSelect";
import ThesesInput, {Thesis} from "../Inputs/ThesesInput/ThesesInput"
import PublicationsInput, {Publication} from "../Inputs/PublicationsInput/PublicationsInput";
import {ResearchArea} from "../Inputs/ClickableMap";
import FormASections, {FormSectionType} from "../Wrappers/FormASections";
import {FormAFields, FormAInitValues} from "../FormTypes";



type Props = {
    loadValues?: FormAFields,
    readonly: boolean
}


function FormA(props: Props){
    const form = useContext(FormContext)
    // const [sections, setSections] = useState({
    //     "Kierownik":"Kierownik zgłaszanego rejsu",
    //     "Czas":"Czas trwania zgłaszanego rejsu",
    //     "Pozwolenia": "Dodatkowe pozwolenia do planowanych podczas rejsu badań",
    //     "Rejon": "Rejon prowadzenia badań",
    //     "Cel": "Cel Rejsu",
    //     "Zadania": "Zadania do zrealizowania w trakcie rejsu",
    //     "Umowy": "Umowy regulujące współpracę, w ramach której miałyby być realizowane zadania badawcze",
    //     "Z. badawcze": "Zespoły badawcze, jakie miałyby uczestniczyć w rejsie",
    //     "Publikacje/prace": "Publikacje i prace",
    //     "SPUB": "Zadania SPUB, z którymi pokrywają się zadania planowane do realizacji na rejsie"
    // })

    const [formInitValues, setFormInitValues]
        = useState<FormAInitValues>()
    useEffect(() => {
        api
            .get('/Forms/A/InitData')
            .then(response => {
                    setFormInitValues(response.data)
            })
    },[]);





    const sections:FormSectionType[] = FormASections()
    return (
        <>
        <FormTemplate loadValues={props.loadValues} initValues={formInitValues} sections={sections} readOnly={props.readonly}
            type='A'>
            {sections.map((section:FormSectionType, index) =>
                <section.Content key={index} index={index + 1}/>)}
        </FormTemplate>
                {/*<FormSection title={sections.Pozwolenia}>*/}
                {/*    <FormRadio className="col-12 col-md-12 col-xl-6 p-3"*/}
                {/*               label="Czy do badań prowadzonych podczas rejsu są potrzebne dodatkowe pozwolenia?"*/}
                {/*               name="permissionsRequired"*/}
                {/*               values={["tak", "nie"]}*/}
                {/*    />*/}
                {/*    {(() => {*/}
                {/*        // @ts-ignore*/}
                {/*        if (form.watch("permissionsRequired") === 0 ) {*/}
                {/*            return (*/}
                {/*                <TextArea className="col-12 col-md-12 col-xl-6 p-3"*/}
                {/*                          label="Jakie?"*/}
                {/*                          name="permissions"*/}
                {/*                          required="Podaj jakie"*/}
                {/*                          resize="none"*/}
                {/*                />*/}
                {/*            )*/}
                {/*        }*/}
                {/*        else{*/}

                {/*            if(form.formState.errors["permissions"] != undefined) {*/}
                {/*                //     form.unregister("differentUsage")*/}
                {/*                form.clearErrors("permissions")*/}
                {/*            }*/}
                {/*        return <DummyTag required={false} />}                    })()}*/}
                {/*</FormSection>*/}

                {/*<FormSection title={sections.Rejon}>*/}
                {/*    <ClickableMap*/}
                {/*        label="Obszar prowadzonych badań"*/}
                {/*        name="researchArea"*/}
                {/*        // image={formInitValues?.researchAreasMap}*/}
                {/*        regions={formInitValues?.researchAreas}*/}
                {/*    />*/}
                {/*    <TextArea className="col-12 col-md-12 col-xl-6 p-3"*/}
                {/*              required={false}*/}
                {/*              label="Opis"*/}
                {/*              name="researchAreaInfo"*/}
                {/*              resize="none"*/}
                {/*    />*/}
                {/*</FormSection>*/}

                {/*<FormSection title={sections.Cel}>*/}
                {/*    <FormRadio className="col-12 col-md-12 col-xl-6 p-3"*/}
                {/*               label="Cel rejsu"*/}
                {/*               name="cruiseGoal"*/}
                {/*               values={formInitValues?.cruiseGoals}*/}
                {/*    />*/}
                {/*    <TextArea className="col-12 col-md-12 col-xl-6 p-3"*/}
                {/*              label="Opis"*/}
                {/*              name="cruiseGoalDescription"*/}
                {/*              required="Opisz cel"*/}
                {/*              resize="none"*/}
                {/*    />*/}
                {/*</FormSection>*/}

                {/*<FormSection title={sections.Zadania}>*/}
                {/*    <TaskInput*/}
                {/*        name={"researchTasks"}*/}
                {/*        historicalTasks={[*/}
                {/*            {*/}
                {/*                "type": 5,*/}
                {/*                "values": {*/}
                {/*                    "title": "3re",*/}
                {/*                    "time": {*/}
                {/*                        "start": "Mon Jan 01 2024 00:00:00 GMT+0100 (czas środkowoeuropejski standardowy)",*/}
                {/*                        "end": "Sun Dec 01 2024 00:00:00 GMT+0100 (czas środkowoeuropejski standardowy)"*/}
                {/*                    },*/}
                {/*                    "financingAmount": "0.00"*/}
                {/*                }*/}
                {/*            },*/}
                {/*            {*/}
                {/*                "type": 5,*/}
                {/*                "values": {*/}
                {/*                    "title": "3re",*/}
                {/*                    "time": {*/}
                {/*                        "start": "Wed May 01 2024 00:00:00 GMT+0200 (czas środkowoeuropejski letni)",*/}
                {/*                        "end": "Wed May 01 2024 00:00:00 GMT+0200 (czas środkowoeuropejski letni)"*/}
                {/*                    },*/}
                {/*                    "financingAmount": "0.00"*/}
                {/*                }*/}
                {/*            },*/}
                {/*            {*/}
                {/*                "type": 11,*/}
                {/*                "values": {*/}
                {/*                    "description": "rtetretret"*/}
                {/*                }*/}
                {/*            },*/}
                {/*            {*/}
                {/*                "type": 3,*/}
                {/*                "values": {*/}
                {/*                    "title": "fsdfds",*/}
                {/*                    "institution": "ffsdff",*/}
                {/*                    "date": "Fri Mar 15 2024 00:00:00 GMT+0100 (czas środkowoeuropejski standardowy)"*/}
                {/*                }*/}
                {/*            },*/}
                {/*            {*/}
                {/*                "type": 0,*/}
                {/*                "values": {*/}
                {/*                    "author": "sdfdsf",*/}
                {/*                    "title": "dsfdfsd"*/}
                {/*                }*/}
                {/*            }*/}
                {/*        ]}*/}
                {/*        className="col-12"*/}
                {/*        label="ss"*/}
                {/*    />*/}
                {/*</FormSection>*/}

                {/*<FormSection title={sections.Umowy}>*/}
                {/*    <ContractsInput*/}
                {/*        className="col-12"*/}
                {/*        name="contracts"*/}
                {/*        historicalContracts={[*/}
                {/*            {*/}
                {/*                category: "international",*/}
                {/*                institution: {*/}
                {/*                    name: "Instytucja 1",*/}
                {/*                    unit: "Jednostka 1",*/}
                {/*                    localization: "Lokalizacja 1"*/}
                {/*                },*/}
                {/*                description: "Opis 1",*/}
                {/*                scan: {*/}
                {/*                    name: "Skan 1",*/}
                {/*                    content: "1111111111"*/}
                {/*                }*/}
                {/*            },*/}
                {/*            {*/}
                {/*                category: "international",*/}
                {/*                institution: {*/}
                {/*                    name: "Instytucja 2",*/}
                {/*                    unit: "Jednostka 2",*/}
                {/*                    localization: "Lokalizacja 2"*/}
                {/*                },*/}
                {/*                description: "Opis 2",*/}
                {/*                scan: {*/}
                {/*                    name: "Skan 2",*/}
                {/*                    content: "222222222"*/}
                {/*                }*/}
                {/*            },*/}
                {/*            {*/}
                {/*                category: "domestic",*/}
                {/*                institution: {*/}
                {/*                    name: "Instytucja 3",*/}
                {/*                    unit: "Jednostka 3",*/}
                {/*                    localization: "Lokalizacja 3"*/}
                {/*                },*/}
                {/*                description: "Opis 3",*/}
                {/*                scan: {*/}
                {/*                    name: "Skan 3",*/}
                {/*                    content: "3333333333"*/}
                {/*                }*/}
                {/*            },*/}
                {/*            {*/}
                {/*                category: "domestic",*/}
                {/*                institution: {*/}
                {/*                    name: "Instytucja 4",*/}
                {/*                    unit: "Jednostka 4",*/}
                {/*                    localization: "Lokalizacja 4"*/}
                {/*                },*/}
                {/*                description: "Opis 4",*/}
                {/*                scan: {*/}
                {/*                    name: "Skan 4",*/}
                {/*                    content: "444444444"*/}
                {/*                }*/}
                {/*            }*/}
                {/*        ]}*/}
                {/*        required={false}*/}
                {/*    />*/}
                {/*</FormSection>*/}

                {/*<FormSection title={sections["Z. badawcze"]}>*/}
                {/*    <UgTeamsInput*/}
                {/*        className="col-12 col-xl-6"*/}
                {/*        label="Uczestnictwo osób z jednostek organizacyjnych UG"*/}
                {/*        name="ugTeams"*/}
                {/*        values={administrationUnits}*/}
                {/*    />*/}
                {/*    <GuestTeamsInput*/}
                {/*        required={false}*/}
                {/*        className="col-12 col-xl-6"*/}
                {/*        label="Uczestnictwo gości spoza UG"*/}
                {/*        name="guestTeams"*/}
                {/*        historicalGuestsInstitutions={[*/}
                {/*            "Instytucja 1", "Instytucja 2", "Instytucja 3"*/}
                {/*        ]}*/}
                {/*    />*/}
                {/*</FormSection>*/}

                {/*<FormSection title={sections["Publikacje/prace"]}>*/}
                {/*    /!*<div required={false} className={`pb-0 p-4 ${props.readonly ? 'd-none':''}`}>*!/*/}
                {/*    /!*    <h5 className={"text-center"}>Publikacje związane tematycznie</h5>*!/*/}
                {/*    /!*    <p>Publikacje z ubiegłych 5-lat, związane <strong>bezpośrednio </strong>tematycznie z zadaniami*!/*/}
                {/*    /!*        do realizacji na planowanym rejsie, <strong>opublikowane przez zespół zaangażowany w*!/*/}
                {/*    /!*            realizację rejsu, z afiliacją UG.</strong></p>*!/*/}
                {/*    /!*    <h5 className={"text-center"}>Publikacje zawierające dopisek</h5>*!/*/}
                {/*    /!*    <p>Publikacje autorstwa zespołu zaangażowanego w realizację rejsu, ALE zawierające dopisek w*!/*/}
                {/*    /!*        treści publikacji (w wersji angielskiej lub w innym języku): <strong>„…the research/study*!/*/}
                {/*    /!*            was conducted onboard r/v Oceanograf (the research vessel owned by the University of*!/*/}
                {/*    /!*            Gdańsk)…” lub „… samples for the present study were collected during a research cruise*!/*/}
                {/*    /!*            onboard r/v Oceanograf…” </strong>lub podobny, ale wskazujący jednoznacznie że badania w*!/*/}
                {/*    /!*        ramach niniejszej publikacji były prowadzone z pokładu jednostki RV Oceanograf.</p>*!/*/}
                {/*    /!*</div>*!/*/}
                {/*    <PublicationsInput*/}
                {/*        required={true}*/}
                {/*        className="col-12"*/}
                {/*        label="Publikacje"*/}
                {/*        name="publications"*/}
                {/*        historicalPublications={[*/}
                {/*            {*/}
                {/*                category: "subject",*/}
                {/*                doi: "10.1016/j.marenvres.2023.106132",*/}
                {/*                authors: "Urszula Kwasigroch, Katarzyna Łukawska-Matuszewska, Agnieszka Jędruch, Olga Brocławik, Magdalena Bełdowska",*/}
                {/*                title: "Mobility and bioavailability of mercury in sediments of the southern Baltic sea in relation to the chemical fractions of iron: Spatial and temporal patterns",*/}
                {/*                magazine: "Marine Environmental Research",*/}
                {/*                year: 2023,*/}
                {/*                ministerialPoints: 0*/}

                {/*            },*/}
                {/*            {*/}
                {/*                category: "subject",*/}
                {/*                doi: "10.1016/j.csr.2018.08.008",*/}
                {/*                authors: "Aleksandra Brodecka-Goluch, Katarzyna Łukawska-Matuszewska",*/}
                {/*                title: "Porewater dissolved organic and inorganic carbon in relation to methane occurrence in sediments of the Gdańsk Basin (southern Baltic Sea)",*/}
                {/*                magazine: "Continental Shelf Research",*/}
                {/*                year: 2018,*/}
                {/*                ministerialPoints: 30*/}
                {/*            },*/}
                {/*            {*/}
                {/*                category: "postscript",*/}
                {/*                doi: "10.3390/biology12020147",*/}
                {/*                authors: "Natalia Miernik, Urszula Janas, Halina Kendzierska",*/}
                {/*                title: "Role of macrofaunal communities in the Vistula River plume, the Baltic Sea - bioturbation and bioirrigation potential",*/}
                {/*                magazine: "Biology",*/}
                {/*                year: 2023,*/}
                {/*                ministerialPoints: 100*/}
                {/*            },*/}
                {/*            {*/}
                {/*                category: "postscript",*/}
                {/*                doi: "10.1016/j.scitotenv.2020.140306",*/}
                {/*                authors: "Jakub Idczak, Aleksandra Brodecka-Goluch, Katarzyna Łukawska-Matuszewska, Bożena Graca, Natalia Gorska, Zygmunt Klusek, Patryk Pezacki, Jerzy Bolałek",*/}
                {/*                title: "A geophysical, geochemical and microbiological study of a newly discovered pockmark with active gas seepage and submarine groundwater discharge (MET1-BH, central Gulf of Gdańsk, southern Baltic Sea)",*/}
                {/*                magazine: "Science of the Total Environment",*/}
                {/*                year: 2020,*/}
                {/*                ministerialPoints: 200*/}
                {/*            }*/}
                {/*        ]}*/}
                {/*    />*/}
                {/*    <div required={false} className={`pb-0 p-4 ${props.readonly ? 'd-none' : ''}`}>*/}
                {/*        <h5 className={"text-center"}>Prace dyplomowe/doktorskie zawierające dopisek</h5>*/}
                {/*        <p>Prace licencjackie, magisterskie oraz doktorskie zawierające informację w treści pracy*/}
                {/*            wskazujący jednoznacznie że <strong>badania w ramach niniejszej pracy były prowadzone z*/}
                {/*                pokładu jednostki RV Oceanograf.</strong></p>*/}
                {/*    </div>*/}
                {/*        <ThesesInput*/}
                {/*            required={true}*/}
                {/*            className="col-12"*/}
                {/*            label="Prace"*/}
                {/*            name="theses"*/}
                {/*            historicalTheses={[*/}
                {/*                {*/}
                {/*                    category: "doctor",*/}
                {/*                    author: "Marian Domogolski",*/}
                {/*                    title: "Analiza i badania wód głębinowych na terenie Morza Bałtyckiego ze szczególnym uwzględnieniem wód i wód głębinowych",*/}
                {/*                    promoter: "Elżbieta Widłogrodzka",*/}
                {/*                    year: 2020*/}

                {/*                },*/}
                {/*                {*/}
                {/*                    category: "master",*/}
                {/*                    author: "Marian Domogolski",*/}
                {/*                    title: "Analiza i badania wód głębinowych na terenie Morza Bałtyckiego ze szczególnym uwzględnieniem wód i wód głębinowych",*/}
                {/*                    promoter: "Elżbieta Widłogrodzka",*/}
                {/*                    year: 2020*/}
                {/*                },*/}
                {/*                {*/}
                {/*                    category: "bachelor",*/}
                {/*                    author: "Marian Domogolski",*/}
                {/*                    title: "Analiza i badania wód głębinowych na terenie Morza Bałtyckiego ze szczególnym uwzględnieniem wód i wód głębinowych",*/}
                {/*                    promoter: "Elżbieta Widłogrodzka",*/}
                {/*                    year: 2020*/}
                {/*                }*/}
                {/*            ]}*/}
                {/*        />*/}
                {/*</FormSection>*/}

                {/*<FormSection title={sections.SPUB}>*/}
                {/*    <SpubTasksInput*/}
                {/*        className="col-12"*/}
                {/*        name="spubTasks"*/}
                {/*        historicalSpubTasks={[*/}
                {/*            {*/}
                {/*                yearFrom: 2020,*/}
                {/*                yearTo: 2030,*/}
                {/*                name: "Badanie nowych właściwości wodno-tlenowych Morza Bałtyckiego w obszarze Zatoki Gdańskiej"*/}
                {/*            },*/}
                {/*            {*/}
                {/*                yearFrom: 2021,*/}
                {/*                yearTo: 2026,*/}
                {/*                name: "Badanie właściwości azotowych Morza Bałtyckiego w obszarze Zatoki Puckiej"*/}
                {/*            },*/}
                {/*            {*/}
                {/*                yearFrom: 2022,*/}
                {/*                yearTo: 2024,*/}
                {/*                name: "Bałtycki pobór zasobów mineralnych na obszarze Polskiej WSE"*/}
                {/*            },*/}
                {/*        ]}*/}
                {/*        required={false}*/}
                {/*    />*/}
                {/*</FormSection>*/}
            {/*</FormWithSections>*/}
            </>
    )
}


export default FormA