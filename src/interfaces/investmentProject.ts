export interface InvestmentProjectImage {
  url: string;
  alt?: string;
  isCover?: boolean;
}

export interface InvestmentProjectAttachment {
  title?: string;
  fileUrl: string;
  fileType?: string;
}

export interface InvestmentProjectInvestmentData {
  expectedProjectCost?: number;
  returnProfitMargin?: number;
  profitabilityIndex?: number;
  expectedIRR?: number;
  expectedROI?: number;
  paybackPeriodYears?: number;
  exitPlan?: string;
  notes?: string;
  projectStage?: "idea" | "planned" | "in_progress" | "operating" | "completed";
  riskLevel?: "low" | "medium" | "high";
}

export interface InvestmentProjectCategory {
  _id: string;
  name: string;
  nameAr?: string;
}

export interface InvestmentProjectTag {
  _id: string;
  name: string;
  nameAr?: string;
}

export interface InvestmentProject {
  _id: string;
  name: string;
  slug?: string;
  logo?: string | null;
  brief?: string;
  briefAr?: string;
  fullDescription?: string;
  fullDescriptionAr?: string;
  location?: string;
  currency?: string;
  status: "draft" | "published" | "archived";
  category?: InvestmentProjectCategory | string | null;
  tags?: InvestmentProjectTag[] | string[];
  investmentData?: InvestmentProjectInvestmentData;
  images?: InvestmentProjectImage[];
  attachments?: InvestmentProjectAttachment[];
  highlights?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface GetInvestmentProjectsParams {
  keyword?: string;
  page?: number;
  limit?: number;
  sort?: string;
  category?: string;
  status?: "draft" | "published" | "archived" | "";
  tags?: string[];
}

export interface InvestmentProjectListResponse {
  status: string;
  results: number;
  total: number;
  page: number;
  totalPages: number;
  data: InvestmentProject[];
}

export interface SingleInvestmentProjectResponse {
  status: string;
  data: InvestmentProject;
}
