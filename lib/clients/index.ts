import { koduKinnisvara } from './kodu-kinnisvara';
import { glamourSalon } from './glamour-salon';
import { bellaCucina } from './bella-cucina';

export type Listing = {
  id: string;
  title: string;
  titleI18n?: Record<string, string>;
  price: string;
  priceI18n?: Record<string, string>;
  area: string;
  areaI18n?: Record<string, string>;
  imageUrl: string;
  status: 'available' | 'reserved' | 'rented';
  tags: string[];
  tagsI18n?: Record<string, string[]>;
};

export type ServiceDetail = {
  label: string;
  labelI18n?: Record<string, string>;
  value: string;
  valueI18n?: Record<string, string>;
};

export type Service = {
  id: string;
  name: string;
  nameI18n?: Record<string, string>;
  price: string;
  priceI18n?: Record<string, string>;
  duration: string;
  durationI18n?: Record<string, string>;
  category: string;
  categoryI18n?: Record<string, string>;
  imageUrl: string;
  available: boolean;
  details?: ServiceDetail[];
};

export type ThemeOverride = {
  accent?: string;
  accent2?: string;
};

export type ClientConfig = {
  name: string;
  systemPrompt: string;
  listings: Listing[];
  services?: Service[];
  theme?: ThemeOverride;
  welcomeMessages?: Record<string, string>;
  phone?: string;
  clientType?: 'restaurant' | 'default';
  vapiAssistantId?: string;
  hostName?: string;
};

const clients: Record<string, ClientConfig> = {
  'kodu-kinnisvara': koduKinnisvara,
  'glamour-salon': glamourSalon,
  'bella-cucina': bellaCucina,
};

export function getClient(clientId: string): ClientConfig | null {
  return clients[clientId] ?? null;
}

export function getAllClientIds(): string[] {
  return Object.keys(clients);
}
