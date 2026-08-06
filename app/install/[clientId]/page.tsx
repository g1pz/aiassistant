import { notFound } from 'next/navigation';
import { getClient, getAllClientIds } from '@/lib/clients/index';
import { InstallGuide } from './InstallGuide';

export async function generateStaticParams() {
  return getAllClientIds().map((clientId) => ({ clientId }));
}

export default async function InstallPage({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const { clientId } = await params;
  const client = getClient(clientId);

  if (!client) notFound();

  return <InstallGuide clientId={clientId} clientName={client.name} />;
}
