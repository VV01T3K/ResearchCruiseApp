import { useContext } from "react"
import { IndexAndTitleContext } from "@contexts/IndexAndTitleContext"

export const SectionTitle = () => {
  const { index, title } = useContext(IndexAndTitleContext)!
  return (
    <div className={"form-section-title"}>
      {index && index + ". "}
      {title}
    </div>
  )
}
