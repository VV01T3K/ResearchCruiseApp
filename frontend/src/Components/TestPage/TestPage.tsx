import Page from "../Tools/Page";
import FormA0 from "../Forms/FormA0";
import Kwadrat from "./Square";

export const TestPage = () => {
    return (<Page className={"bg-white"}>
        <Kwadrat nazwa={"Coś"} kolor={"red"}>
            <div> </div>
        </Kwadrat>
        </Page>
    )
}