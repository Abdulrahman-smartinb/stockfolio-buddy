export interface CompanyInfo {
  companyName: string;
  companyAddress: string;
  companyTax: string;
  companyEmail: string;
  companyTel: string;
  companyLogo: string;
  bankQR: [BankQr];
}

export interface BankQr {
  name?: string;
  accountNumber?: string;
  qrCode?: string;
}
