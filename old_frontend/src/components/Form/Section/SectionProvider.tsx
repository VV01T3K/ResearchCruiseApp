import React, { useState } from "react"

import { IsSectionCompletedContext } from "@contexts/IsSectionCompletedContext"
import { IsSectionActiveContext } from "@contexts/IsSectionActiveContext"
import { IndexAndTitleContext } from "@contexts/IndexAndTitleContext"

export const SectionProvider = (props: {
  children: React.ReactNode
  index?: number
  title?: string
}) => {
  const isActive = useState(true)
  const isCompleted = useState(false)
  return (
    <IndexAndTitleContext.Provider value={{ index: props.index, title: props.title }}>
      <IsSectionActiveContext.Provider value={isActive}>
        <IsSectionCompletedContext.Provider value={isCompleted}>
          {props.children}
        </IsSectionCompletedContext.Provider>
      </IsSectionActiveContext.Provider>
    </IndexAndTitleContext.Provider>
  )
}
