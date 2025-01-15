export const ExpansionMark = (props: { isSectionCompleted: boolean; isSectionActive: boolean }) => (
  <div
    className={
      props.isSectionCompleted
        ? "form-section-expansion-mark-default"
        : "form-section-expansion-mark-error"
    }
  >
    {props.isSectionActive ? "▼" : "▲"}
  </div>
)
