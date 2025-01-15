import React from "react"
import Page from "../../../ToBeMoved/Pages/Page"

type Props = {
  children: React.ReactElement<any, string | React.JSXElementConstructor<any>>
}

const HomePage = (props: Props) => <Page className={"h-100"}>{props.children}</Page>

export default HomePage
