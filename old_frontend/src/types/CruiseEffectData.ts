export type CruiseEffectData = {
  userId: string
  points: string
  effect: ResearchTask
  cruiseApplicationId: string
}

export type ResearchTask = {
  type: string
  title?: string
  magazine?: string
  author?: string
  institution?: string
  date?: string
  name?: string
  startDate?: string
  endDate?: string
  financingApproved?: string
  financingAmount?: string
  description?: string
  securedAmount?: string
  ministerialPoints?: string
}

export const taskTypes = [
  "Praca licencjacka",
  "Praca magisterska",
  "Praca doktorska",
  "Przygotowanie projektu naukowego",
  "Realizacja projektu krajowego (NCN, NCBiR, itp.)",
  "Realizacja projektu zagranicznego (ERC, Programy ramowe UE, fundusze norweskie, itp)",
  "Realizacja projektu wewnętrznego UG",
  "Realizacja innego projektu naukowego",
  "Realizacja projektu komercyjnego",
  "Dydaktyka",
  "Realizacja własnego zadania badawczego",
  "Inne zadanie",
]
