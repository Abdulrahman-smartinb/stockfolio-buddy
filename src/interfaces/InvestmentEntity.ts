export interface InvestmentEntity {
  _id: string;
  fullLegalName: string;
  nameAr: string;
  tradeName?: string;
  logo?: string;
  economicSector?: string;
  investmentType?: string;
  sharePrice: number;
  initialShares: number;
  minInvestShare: number;
  maxInvestShare: number;
  shareIssued: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  entityType: "ClientCompany" | "InvestmentFund";
  code?: string;
  fundInfoFile?: string;
  investingStepsFile?: string;
  investingRequestFile?: string;
  userAgreementFile?: string;
  treasuryShares?: number;
  allocationSummary?: {
    totalFundValue?: number;
    allocatedCompaniesAmount?: number;
    allocatedProjectsAmount?: number;
    totalAllocatedAmount?: number;
    remainingUnallocatedAmount?: number;
  };
  category?:
    | string
    | {
        _id?: string;
        name?: string;
        nameAr?: string;
      }
    | null;
  tags?:
    | Array<
        | string
        | {
            _id?: string;
            name?: string;
            nameAr?: string;
          }
      >
    | null;
  linkedCompanies?:
    | Array<{
        company?:
          | string
          | {
              _id?: string;
              fullLegalName?: string;
              tradeName?: string;
              nameAr?: string;
              logo?: string;
              economicSector?: string;
            }
          | null;
        allocatedAmount?: number;
      }>
    | null;
  linkedProjects?:
    | Array<{
        project?:
          | string
          | {
              _id?: string;
              name?: string;
              nameAr?: string;
              logo?: string;
              category?: string | { name?: string; nameAr?: string } | null;
              location?: string;
            }
          | null;
        allocatedAmount?: number;
      }>
    | null;
}
