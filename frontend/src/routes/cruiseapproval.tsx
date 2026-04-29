import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

import { FormAForSupervisorPage } from '@/routes/-cruiseapproval/FormAForSupervisorPage';

export const Route = createFileRoute('/cruiseapproval')({
  component: FormAForSupervisorPage,
  validateSearch: z
    .object({
      cruiseApplicationId: z.guid(),
      supervisorCode: z.string(),
    })
    .catch({
      cruiseApplicationId: '',
      supervisorCode: '',
    }),
});
