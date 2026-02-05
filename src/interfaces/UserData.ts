export interface UserData {
  _id: string;
  authUserId: string;
  fullName: string;
  phone: string;
  email?: string;
  ownedShares?: [OwnedShares];
  active: boolean;
  profileImage?: string;
  birthDate?: string;
  reviewStatus?: string;
  rejectionMessage?: string;
  createdAt?: string;
  role?: string;
}

export interface AuthUser {
  phone: string;
  password: string;
  active: boolean;
}

export interface OwnedShares {
  amount: number;
  company: string;
  isFounder: boolean;
}

export interface Attachment {
  key: string;
  fileUrl: string;
}

export interface BankTranfer {
  beneficiaryFullName: string;
  beneficiaryAddress: string;
  bankName: string;
  accountNumber: string;
  transferReason?: string;
  amount?: number;
}

export interface ShamCash {
  accountNumber: string;
  qrCode?: File;
  beneficiaryName: string;
  beneficiaryAddress?: string;
}

export interface Usdt {
  transferNetwork: string;
  otherNetwork?: string;
  walletAddress: string;
  walletQr?: File;
}
