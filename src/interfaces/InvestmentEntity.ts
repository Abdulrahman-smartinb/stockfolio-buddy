export interface InvestmentEntity {
  _id: string;
  fullLegalName: string;
  sharePrice: number;
  initialShares: number;
  minInvestShare: number;
  maxInvestShare: number;
  shareIssued: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  entityType: "ClientCompany" | "InvestmentFund";
}
