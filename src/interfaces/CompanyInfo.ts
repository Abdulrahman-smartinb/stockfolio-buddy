export interface CompanyInfo {
  companyName: string;
  companyAddress: string;
  companyTax: string;
  companyEmail: string;
  companyTel: string;
  companyLogo: string;
  bankQR: [BankQr];
  paymentMethods: [PaymentMethods];
}

export interface BankQr {
  name?: string;
  accountNumber?: string;
  qrCode?: string;
}

export interface PaymentMethods {
  _id: string;
  method: string;
  isActive: boolean;
  bank?: Bank;
  shamCash?: ShamCash;
  usdt?: Usdt;
  cash?: Cash;
}

export interface Bank {
  beneficiaryFullName?: string;
  beneficiaryAddress?: string;
  bankName?: string;
  accountNumber?: string;
  qrCode?: string;
}
export interface ShamCash {
  accountNumber?: string;
  qrCode?: string;
  beneficiaryName?: string;
  beneficiaryAddress?: string;
}
export interface Usdt {
  transferNetwork?: string;
  walletAddress?: string;
  walletQr?: string;
}
export interface Cash {
  locationName?: string;
  locationAddress?: string;
  city?: string;
  country?: string;
}
