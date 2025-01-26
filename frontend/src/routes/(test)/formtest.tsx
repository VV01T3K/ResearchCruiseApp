import { AppPage, AppButton } from '@core/components'
import { useForm } from '@tanstack/react-form'
import { createFileRoute } from '@tanstack/react-router'
import { AppInput, AppNumberInput } from 'src/features/form/compontents'
import { AppSelectInput } from 'src/features/form/compontents/AppSelectInput'
import { z } from 'zod'

export const Route = createFileRoute('/(test)/formtest')({
  component: RouteComponent,
})

function RouteComponent() {
  const form = useForm({
    defaultValues: {
      testInput: '',
      testNumber: 0,
      testSelect: '',
    },
    onSubmit: async ({ value }) => {
      console.log(value)
    },
    validators: {
      onBlur: z.object({
        testInput: z.string().min(3, 'Co najmniej 3 znaki'),
        testNumber: z.number().min(1, 'Co najmniej 1'),
        testSelect: z.enum(['Role1', 'Role2', 'Role3'], {
          message: 'Oczekiwana wartość: Role1, Role2 lub Role3',
        }),
      }),
    },
  })
  return (
    <AppPage title="Form Test">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        <div className="grid gap-6 md:grid-cols-2">
          <form.Field
            name="testInput"
            children={(field) => (
              <AppInput
                name={field.name}
                value={field.state.value}
                label={field.name}
                placeholder={field.name}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                error={field.state.meta.errors.join(', ')}
                helper="Helper text"
              />
            )}
          />

          <form.Field
            name="testNumber"
            children={(field) => (
              <AppNumberInput
                name={field.name}
                value={field.state.value}
                label={field.name}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(+e.target.value)}
                onIncrement={() => {
                  field.handleChange(field.state.value + 1)
                }}
                onDecrement={() => field.handleChange(field.state.value - 1)}
                error={field.state.meta.errors.join(', ')}
                helper="Helper text"
              />
            )}
          />

          <form.Field
            name="testSelect"
            children={(field) => (
              <AppSelectInput
                name={field.name}
                value={field.state.value}
                possibleValues={[
                  { label: 'Role1' },
                  { label: 'Role2' },
                  { label: 'Role3' },
                ]}
                label={field.name}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                error={field.state.meta.errors.join(', ')}
                helper="Helper text"
              />
            )}
          />
        </div>

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <AppButton
              type="submit"
              className="w-full mt-4"
              disabled={!canSubmit || isSubmitting}
            >
              Potwierdź
            </AppButton>
          )}
        />
      </form>
    </AppPage>
  )
}
