
export type User = {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
};

export type Product = {
  id: string;
  serialId: string;
  name: string;
  manufacturer: string;
  productOrigin: string;
  manufactureDate: string;
  expiryDate?: string;
  seller: string;
  blockchainVerified: boolean;
  transactionId?: string;
  image?: string;
  description?: string;
  category?: string;
};

export type Report = {
  id: string;
  productName: string;
  reporterId: string;
  reporterName: string;
  description: string;
  location: string;
  imageUrl?: string;
  status: 'pending' | 'reviewed' | 'resolved';
  createdAt: string;
};
