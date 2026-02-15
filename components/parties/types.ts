export type Party = {
  id: string;
  name: string;
  abbreviation: string;
  slug: string;
  color: string;
  logoUrl: string | null;
  website: string | null;
  programUrl: string | null;
  description: string | null;
  foundedYear: number | null;
  leaderName: string | null;
  ideology: string | null;
  coalition: string | null;
  previousSeats: number | null;
};

export type PartyProgram = {
  id: string;
  sectionTitle: string;
  content: string;
  orderIndex: number;
};

export type PolicyStanceSummary = {
  policyId: string;
  question: string;
  value: boolean | null;
};
