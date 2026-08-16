import { notFound } from 'next/navigation';
import { getClient, getAllClientIds } from '@/lib/clients/index';
import { CallInterface } from './CallInterface';

export async function generateStaticParams() {
  return getAllClientIds().map((clientId) => ({ clientId }));
}

export default async function CallPage({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const { clientId } = await params;
  const client = getClient(clientId);

  if (!client || !client.vapiAssistantId) notFound();

  return (
    <CallInterface
      clientId={clientId}
      clientName={client.name}
      hostName={client.hostName ?? 'AI Assistant'}
      accent={client.theme?.accent ?? '#4F8CFF'}
      accent2={client.theme?.accent2 ?? '#A855F7'}
      vapiAssistantId={client.vapiAssistantId}
    />
  );
}
