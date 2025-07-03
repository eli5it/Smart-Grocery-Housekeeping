import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/groceries')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/grocery"!</div>
}
