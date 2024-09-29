import FormTemplate from "../Wrappers/FormTemplate";
import React from "react";
import {CruiseInfoSection} from "./FormBSections/CruiseInfoSection";
import {useLocation} from "react-router-dom";
import {CruiseApplicationContext} from "../../CruiseApplicationDetailsPage/CruiseApplicationDetailsPage";
import {CruiseManagersSection} from "./FormBSections/CruiseManagersSection";
import {PermissionsSection} from "./FormA/FormASections/PermissionsSection";
import {ResearchAreaSection} from "./FormA/FormASections/ResearchAreaSection";
import {CruiseUsageSection} from "./FormBSections/CruiseUsageSection";
import {SpubTasksSection} from "./FormA/FormASections/SpubTasksSection";
import {GoalSection} from "./FormBSections/GoalSection";
import {TasksSection} from "./FormA/FormASections/TasksSection";
import {ContractSection} from "./FormA/FormASections/ContractSection";
import {ResearchTeamsSection} from "./FormBSections/ResearchTeamsSection";
import {CruiseDetailsSection} from "./FormBSections/CruiseDetailsSection";
import {PublicationsSection} from "./FormA/FormASections/PublicationsSection";
import {CruisePlanSection} from "./FormBSections/CruisePlanSection";
import {EquipementSection} from "./FormBSections/EquipmentSection";
import TechnicalElementsUsedInput from "../Inputs/TechnicalElementsUsedInput";
import {TechnicalElementsSection} from "./FormBSections/TechnicalElementsSection";
import {extendedUseLocation} from "../FormPage";

const FormBSections = () => [
    CruiseInfoSection(),
    CruiseManagersSection(),
    CruiseUsageSection(),
    PermissionsSection(),
    ResearchAreaSection(),
    GoalSection(),
    TasksSection(),
    ContractSection(),
    ResearchTeamsSection(),
    PublicationsSection(),
    SpubTasksSection(),
    CruiseDetailsSection(),
    CruisePlanSection(),
    EquipementSection(),
    TechnicalElementsSection()
]

//     const [sections, setSections] = useState({
//         "Szczegóły":"Szczegóły rejsu",
//     })

function FormB(){
    const sections = FormBSections()
    const location = extendedUseLocation()
    return (
        <CruiseApplicationContext.Provider value={location.state.cruiseApplication}>
            <FormTemplate sections={sections} type='B'/>
        </CruiseApplicationContext.Provider>
    )
}


export default FormB

// type FormBInitValues = {
//     cruiseManagers: FormUser[],
//     deputyManagers: FormUser[],
//     years: number[],
//     shipUsages: string[],
//     researchAreas: ResearchArea[],
//     cruiseGoals: string[],
//     historicalTasks: Task[]
// }
//
// export type FormBValues = {
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
//     permissionsScan: {
//         name: string,
//         content: string
//     }
//     researchArea: string
//     researchAreaInfo: string
//     cruiseGoal: string
//     cruiseGoalDescription: string
//     researchTasks: Task[]
//     contracts: Contract[]
//     ugTeams: UgTeam[]
//     guestTeams: GuestsTeam[]
//     crew: Crew[]
//     publications: Publication[]
//     thesis: Thesis[]
//     spubTasks: SpubTask[]
// }
//
// export type FormBValue =
//     string |
//     number[] |
//     any |
//     Task[] |
//     Contract[] |
//     UgTeam[] |
//     GuestsTeam[] |
//     Crew[] |
//     Publication[] |
//     Thesis[] |
//     SpubTask []
//
// type Props = {
//     loadValues?: FormBValues,
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
// function FormB(props: Props){
//     const form = useForm({
//         mode: 'onBlur',
//         // defaultValues: defaultValues,
//         shouldUnregister: false
//     });
//
//     const location = useLocation()
//     const [locationStateKierownik zgłaszanego rejsu, _]: [CruiseFormPageLocationState, Dispatch<any>]
//         = useState(location.state || { })
//
//

//
//
//
//
//
//     const [formInitValues, setFormInitValues]
//         = useState<FormBInitValues>()
//     useEffect(() => {
//         api
//             .get('/Forms/InitValues/A')
//             .then(response => {
//                 setFormInitValues(response.data)
//                 console.log(response.data as FormBInitValues)
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

//             </FormWithSections>
//         </FormTemplate>
//     )
// }
//
//
// export default FormB