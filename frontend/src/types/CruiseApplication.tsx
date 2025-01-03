import { CruiseApplicationStatus } from "CruiseApplicationStatus"

export type CruiseApplication = {
  id: string
  number: string
  date: string
  year: string
  cruiseManagerId: string
  cruiseManagerEmail: string
  cruiseManagerFirstName: string
  cruiseManagerLastName: string
  deputyManagerId: string
  deputyManagerEmail: string
  deputyManagerFirstName: string
  deputyManagerLastName: string
  hasFormA: boolean
  hasFormB: boolean
  hasFormC: boolean
  status: CruiseApplicationStatus
  points: string
  effectsDoneRate: string
  note?: string
}
