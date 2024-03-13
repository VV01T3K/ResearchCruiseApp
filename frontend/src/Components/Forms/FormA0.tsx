import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import FormTemplate from "./Tools/FormTemplate";
import FormTitle from "./Tools/FormTitle";
import FormSelect from "./Inputs/FormSelect";
import FormCreatableSelect from "./Inputs/FormCreatableSelect";
import FormSection from "./Tools/FormSection";
import MonthSlider from "./Inputs/MonthSlider";
import NumberInput from "./Inputs/NumberInput";
import TextArea from "./Inputs/TextArea";
import FormRadio from "./Inputs/FormRadio";
import ClickableMap from "./Inputs/ClickableMap";
import IntInput from "./Inputs/IntInput";
import TaskInput from "./Inputs/TaskInput/TaskInput";
import BlockList from "./Inputs/BlockList/BlockList";
import BlockListInput from "./Inputs/BlockListInput/BlockListInput";
import {Simulate} from "react-dom/test-utils";
import submit = Simulate.submit;
import SpubTaskInput from "./Inputs/SpubTaskInput";
import Api from "../Tools/Api";
import {DummyTag} from "../Tools/DummyTag";
import FormWithSections from "./Tools/FormWithSections";


function FormA0(){
    const [userData, setUserData] = useState(null)

    useEffect(
        () => {
            Api.get('/formA')
                .then(response => setUserData(response.data))
                .catch(()=> {})
            console.log(userData)
            return () => {};
        },
        []
    );

    const defaultValues = {
        // managers: null,
        // supplyManagers: null,
        // years: null,
        // acceptedPeriod: [0,24],
        // optimalPeriod: [0,24],
        // cruiseDays: 0,
        // cruiseTime: 0,
        // notes: null,
        // shipUsage: null,
        // diffrentUsage: null,
    }

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
        "L. osób": "Przewidywana liczba osób załogi naukowej",
        "Zadania": "Zadania do zrealizowania w trakcie rejsu",
        "Umowy": "Lista umów współpracy",
        "Z. badawcze": "Zespoły badawcze, jakie miałyby uczestniczyć w rejsie",
        "Publikacje/prace": "Publikacje i prace",
        "Efekty": "Efekty rejsu",
        "SPUB": "Zadania SPUB, z którymi pokrywają się zadania planowane do realizacji na rejsie"
    })

    // @ts-ignore
    return (
        <FormTemplate>
            <FormTitle sections={sections} title={"Formularz A"} />
            <FormWithSections sections={sections} form={form} onSubmit={()=>{}}
                              onChange={()=>console.log(form.getValues())}>
                <FormSection title={sections.Kierownik}>
                    <FormCreatableSelect className="col-12 col-md-6 col-xl-3"
                                         name="managers"
                                         label="Kierownik rejsu"
                                         values={["sss"]}
                    />
                    <FormSelect className="col-12 col-md-6 col-xl-3"
                                name="supplyManagers"
                                label="Zastępca"
                                values={["sss"]}
                    />
                    <FormSelect className="col-12 col-md-6 col-xl-3"
                                name="years"
                                label="Rok rejsu"
                                values={["sss"]}
                    />
                </FormSection>

                <FormSection title={sections.Czas}>
                    <MonthSlider className="col-12 col-md-12 col-xl-6 p-5"
                                 name="acceptedPeriod"
                                 label="Dopuszczalny okres, w którym miałby się odbywać rejs:"
                    />
                    <MonthSlider className="col-12 col-md-12 col-xl-6 p-5"
                                 name="optimalPeriod"
                                 label="Optymalny okres, w którym miałby się odbywać rejs"
                                 watch={form.watch("acceptedPeriod")}
                    />
                    <NumberInput className="col-12 col-md-12 col-xl-6"
                                 name="cruiseDays"
                                 label="Liczba planowanych dób rejsowych"
                                 connectedName="cruiseTime"
                                 notZero
                                 newVal={(e) => 24*e}
                                 maxVal={99}
                    />
                    <NumberInput className="col-12 col-md-12 col-xl-6"
                                 notZero
                                 name="cruiseTime"
                                 label="Liczba planowanych godzin rejsowych"
                                 connectedName="cruiseDays"
                                 newVal={(e) => Number((e/24).toFixed(2))}
                                 maxVal={99}
                    />
                    <TextArea className="col-12 p-3"
                              required={false}
                              label="Uwagi dotyczące teminu"
                              name="notes"
                    />
                    <FormRadio className="col-12 col-md-12 col-xl-6 p-3"
                               label="Statek na potrzeby badań będzie wykorzystywany:"
                               name="shipUsage"
                               values={[
                                   "całą dobę",
                                   "jedynie w ciągu dnia (maks. 8–12 h)",
                                   "jedynie w nocy (maks. 8–12 h)",
                                   "8–12 h w ciągu doby rejsowej, ale bez znaczenia o jakiej porze albo z założenia" +
                                       "o różnych porach",
                                   "w inny sposób"
                               ]}
                    />
                    {(() => {
                        if (form.watch("shipUsage") == "w inny sposób" ) {
                            return (
                                <TextArea className="col-12 col-md-12 col-xl-6 p-3"
                                          label="Inny sposób użycia"
                                          name="diffrentUsage"
                                          required="Podaj sposób użycia"
                                />
                            )
                        }
                        else
                            return <DummyTag required={false} />
                    })()}
                </FormSection>

                <FormSection title={sections.Pozwolenia}>
                    <FormRadio className="col-12 col-md-12 col-xl-6 p-3"
                               label="Czy do badań prowadzonych podczas rejsu są potrzebne dodatkowe pozwolenia?"
                               name="permissions"
                               values={["tak", "nie"]}
                    />
                    {(() => {
                        // @ts-ignore
                        if (form.watch("permissions") == "tak" ) {
                            return (
                                <TextArea className="col-12 col-md-12 col-xl-6 p-3"
                                          label="Jakie?"
                                          name="additionalPermissions"
                                          required="Podaj jakie"
                                />
                            )
                        }
                        else
                            return <DummyTag required={false} />
                    })()}
                </FormSection>

                <FormSection title={sections.Rejon}>
                    <ClickableMap label="Obszar prowadzonych badań" name="area" />
                    <TextArea className="col-12 col-md-12 col-xl-6 p-3"
                              required={false}
                              label="Opis"
                              name="areaInfo"
                    />
                </FormSection>

                <FormSection title={sections.Cel}>
                    <FormRadio className="col-12 col-md-12 col-xl-6 p-3"
                               label="Cel rejsu"
                               name="goal"
                               values={["Naukowy", "Komercyjny", "Dydaktyczny"]}
                    />
                    <TextArea className="col-12 col-md-12 col-xl-6 p-3"
                              label="Opis"
                              name="goalaInfo"
                              required="Opisz cel"
                    />
                </FormSection>

                <FormSection  title={sections["L. osób"]}>
                    <NumberInput className="col-12 col-md-12 col-xl-6 p-3"
                                 label="Pracownicy UG"
                                 name="ugEmployees"
                                 maxVal={20}
                    />
                    <NumberInput className="col-12 col-md-12 col-xl-6 p-3"
                                 label="Studenci I, II st. i doktoranci"
                                 name="students"
                                 maxVal={20}
                    />
                    <NumberInput className="col-12 col-md-12 col-xl-6 p-3"
                                 label="Goście / osoby spoza UG"
                                 name="guests"
                                 maxVal={20}
                    />
                </FormSection>

                <FormSection title={sections.Zadania}>
                    <TaskInput name={"wejscie"} className={"col-12"} label={"ss"}/>
                </FormSection>

                <FormSection title={sections.Umowy}>
                    <NumberInput className="col-12 col-md-12 col-xl-6 p-3"
                                 label="Goście / osoby spoza UG"
                                 name="gusestss"
                                 maxVal={20}
                    />
                </FormSection>

                <FormSection title={sections["Z. badawcze"]}>
                    <BlockListInput className={"col-12 col-xl-4 "} label={"Uczestnictwo naukowców spoza UG"} name={"bl"} required={false}/>
                {/*    /!*<BlockListInput className={"col-12 col-xl-4 "} label={"Uczestnictwo naukowców z jednostek organizacyjnych UG spoza WOiG"} name={"blockListInput"}/>*!/*/}
                    <BlockList className={"col-12 col-xl-4"} label={"Uczestnictwo osób z jednostek organizacyjnych UG"} name={"blockList"}/>

                </FormSection>
            {/*    <FormSection completed={completedSections[9]} id={"9"} title={sections["Publikacje/Prace"]}>*/}
            {/*      </FormSection>*/}
            {/*    <FormSection completed={completedSections[10]} id={"10"} title={sections.Efekty}>*/}
            {/*        <TaskInput name={"wejscie2"} form={form} className={"col-12"} label={""}/>*/}

            {/*    </FormSection>*/}
                <FormSection title={sections.SPUB}>
                    <SpubTaskInput
                        className="col-12 col-xl-10"
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
                    />
                </FormSection>
            {/*    <button type={"submit"}/>*/}
            </FormWithSections>
        </FormTemplate>
    )
}


export default FormA0