import { UserContextType } from "@contexts/UserContext"
import { ParsedLocation, redirect } from "@tanstack/react-router"

type BeforeLoadType = {
  context: {
    userContext?: UserContextType | undefined
  },
  location: ParsedLocation<object>
}

export async function guardAgainstUnauthenticated({ context, location }: BeforeLoadType) {
  if (!context.userContext?.currentUser) {
    throw redirect({
      to: '/login',
      search: {
        redirect: location.href
      }
    })
  }
}
