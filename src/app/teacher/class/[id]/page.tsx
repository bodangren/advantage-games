import ClassDetailClient from './ClassDetailClient';

export function generateStaticParams() {
  return [{ id: 'placeholder' }];
}

export default function ClassDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return <ClassDetailClient params={params} />;
}
