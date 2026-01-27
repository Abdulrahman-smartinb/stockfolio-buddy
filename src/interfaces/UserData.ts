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
