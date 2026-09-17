export type Area = "ENTENDER" | "CUIDAR" | "PROTEGER" | "EDUCACAO" | "COMO_AJUDAR";
export type ContentStatus = "RASCUNHO" | "PUBLICADO" | "ARQUIVADO";
export type StoryStatus = "PENDENTE" | "APROVADO" | "REJEITADO";

export interface Category {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  area: Area;
  icon?: string | null;
  order: number;
}

export interface Content {
  id: string;
  slug: string;
  title: string;
  summary: string;
  body: string;
  area: Area;
  status: ContentStatus;
  coverImageUrl?: string | null;
  readTimeMin: number;
  tags: string[];
  publishedAt?: string | null;
  categoryId: string;
  category?: Category;
  related?: Content[];
}

export interface Story {
  id: string;
  authorName: string;
  title: string;
  excerpt: string;
  body: string;
  theme: string;
  status: StoryStatus;
  featured: boolean;
  createdAt: string;
}

export interface ServiceCategory {
  id: string;
  slug: string;
  name: string;
  icon?: string | null;
}

export interface Service {
  id: string;
  name: string;
  description?: string | null;
  categoryId: string;
  category?: ServiceCategory;
  address: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  phone?: string | null;
  website?: string | null;
  hours?: string | null;
  is24h: boolean;
  verified: boolean;
}

export interface Statistic {
  id: string;
  indicator: string;
  category: string;
  region: string;
  period: string;
  value: number;
  unit: string;
  isDemo: boolean;
  description: string;
  source?: { name: string; url?: string | null } | null;
}

export interface Quiz {
  id: string;
  slug: string;
  title: string;
  description: string;
  questions?: Question[];
}

export interface Question {
  id: string;
  prompt: string;
  order: number;
  answers: Answer[];
}

export interface Answer {
  id: string;
  text: string;
  explanation: string;
  isSignal: boolean;
  order: number;
}

export interface EducationalMaterial {
  id: string;
  title: string;
  description: string;
  type: string;
  audience: string;
  fileUrl?: string | null;
}

export interface Admin {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface SearchResults {
  query: string;
  contents: Pick<Content, "id" | "slug" | "title" | "summary" | "area">[];
  stories: Pick<Story, "id" | "title" | "excerpt" | "theme">[];
  services: Pick<Service, "id" | "name" | "city" | "state">[];
  materials: Pick<EducationalMaterial, "id" | "title" | "type" | "audience">[];
}

export interface NinaMessage {
  role: "user" | "assistant";
  content: string;
}

export interface AdminOverview {
  totalContents: number;
  publishedContents: number;
  totalStories: number;
  pendingStories: number;
  totalServices: number;
  pendingReports: number;
}

export const AREA_LABELS: Record<Area, string> = {
  ENTENDER: "Entender",
  CUIDAR: "Cuidar",
  PROTEGER: "Proteger",
  EDUCACAO: "Educação",
  COMO_AJUDAR: "Como posso ajudar",
};
