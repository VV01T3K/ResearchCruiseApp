import Page from "../../../ToBeMoved/Pages/Page"
import PageTitle from "../../../components/Page/PageTitle"
import { AccountPageContent } from "./AccountPageContent"

const AccountPage = () => (
  <Page className={"common-page"}>
    <PageTitle title={"Ustawienia konta"} />
    <AccountPageContent />
  </Page>
)

export default AccountPage
