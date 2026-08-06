import { notFound } from 'next/navigation';
import { getClient, getAllClientIds } from '@/lib/clients/index';
import { ChatInterface } from './ChatInterface';

export async function generateStaticParams() {
  return getAllClientIds().map((clientId) => ({ clientId }));
}

export default async function ChatPage({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const { clientId } = await params;
  const client = getClient(clientId);

  if (!client) notFound();

  return (
    <ChatInterface
      clientId={clientId}
      clientName={client.name}
      listings={client.listings}
      services={client.services}
      accent={client.theme?.accent}
      accent2={client.theme?.accent2}
      welcomeMessages={client.welcomeMessages}
      salonPhone={client.phone}
      phone={client.phone}
      clientType={client.clientType}
      vapiAssistantId={client.vapiAssistantId}
    />
  );
}
