import { FormSectionProps } from "Form/Section/FormSectionProps"
import { SectionContent } from "./SectionContent"
import { SectionLabel } from "./SectionLabel"
import { SectionProvider } from "./SectionProvider"
import { SectionScrollReference } from "./SectionScrollReference"

export const Section = (props: FormSectionProps) => (
  <SectionProvider index={props.index} title={props.title}>
    <SectionScrollReference id={props.id} />
    <div className="form-section">
      <SectionLabel />
      <SectionContent>{props.children}</SectionContent>
    </div>
  </SectionProvider>
)
export default Section
