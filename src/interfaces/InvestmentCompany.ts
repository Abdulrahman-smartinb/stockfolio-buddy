export interface InvestmentCompany {
  _id: string;
  fullLegalName?: string;
  tradeName?: string;
  legalStructure?: string;
  crn?: string;
  registeringAuthority?: string;
  dateIncorporation?: string;
  governorate?: string;
  registeredLegalAddress?: string;
  phone?: string;
  phoneNumber?: string;
  email?: string;
  website?: string;
  owners?: [Owner];
  boardMembers?: [BoardMember];
  haveInternalBylaws?: boolean;
  primaryBusinessObjective?: string;
  economicSector?: string;
  targetMarkets?: string;
  targetMarketCountries?: [string];
  reqInvestAmount?: { currency?: string; amount?: number };
  investmentType?: string;
  proposedEquityShare?: string;
  useOfProceeds?: string;
  investmentHorizon?: string;
  exitStrategy?: string;
  sharePrice?: number;
  initialShares?: number;
  availableShares?: number;
  minInvestAmount?: number;
  subscriptionStart?: string;
  subscriptionEnd?: string;
  legalDisclosures?: LegalDisclosures;
  legalRepName?: string;
  title?: string;
  idNumber?: string;
  commercialRegistration?: string;
  legalRepAuthority?: string;
  associationMemorandumIncorp?: [string];
  associationAndBylaws?: [string];
  financialStatements?: [string];
  approvedBy?: string;
  active?: boolean;
  minInvestShare?: number;
  maxInvestShare?: number;
  logo?: string;
}

export interface LegalDisclosures {
  havePendingLegalDisputes?: boolean;
  havePriorFinViolation?: boolean;
  description?: string;
  files?: string;
}

export interface Owner {
  fullName?: string;
  nationality?: string;
  nationalId?: string;
  isSelling?: boolean;
  sellingAmount?: number;
  startedSellingOn?: string;
  ownershipPercentage?: number;
}

export interface BoardMember {
  name?: string;
  position?: string;
}
