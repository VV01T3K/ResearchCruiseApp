import { createFileRoute } from '@tanstack/react-router'

import { allowOnly } from '@/core/lib/guards'
import { ApplicationDetailsPage } from '@/cruise-applications/pages/ApplicationDetailsPage'

export const Route = createFileRoute('/applications/$applicationId/details')({
  component: ApplicationDetailsPage,
  beforeLoad: allowOnly.authenticated(),
})
