import { Dispatch, SetStateAction } from "react"

export type ContextUseStateType<T> = [T, Dispatch<SetStateAction<T>>]
