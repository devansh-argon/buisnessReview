interface CompanyConfig {
  logoUrl: string;
  companyDescription: string;
  keywords: string[];
  googleMapsUrl: string;
}

type CompanyConfigWithId = CompanyConfig & { id: string };

export type { CompanyConfig, CompanyConfigWithId };
