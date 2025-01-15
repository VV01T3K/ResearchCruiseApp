import { guardAgainstUnauthenticated } from '@core/guards';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: Index,
  beforeLoad: guardAgainstUnauthenticated
});

function Index() {
  return <div>Hello "/"!</div>;
}
