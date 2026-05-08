import NewAssignmentClient from './NewAssignmentClient';

export function generateStaticParams() {
  return [{ id: 'placeholder' }];
}

export default function NewAssignmentPage({ params }: { params: Promise<{ id: string }> }) {
  return <NewAssignmentClient params={params} />;
}
