
import { createContext, useContext, useState, ReactNode } from 'react';
import { Product, Report } from '@/types';

interface ProductContextType {
  products: Product[];
  reports: Report[];
  addProduct: (product: Omit<Product, 'id' | 'blockchainVerified' | 'transactionId'>) => Promise<Product>;
  getProduct: (serialId: string) => Product | undefined;
  updateProduct: (id: string, product: Partial<Product>) => Promise<Product | undefined>;
  deleteProduct: (id: string) => Promise<boolean>;
  submitReport: (report: Omit<Report, 'id' | 'status' | 'createdAt'>) => Promise<boolean>;
  updateReportStatus: (id: string, status: Report['status']) => Promise<boolean>;
}

// Mock data
const mockProducts: Product[] = [
  {
    id: '1',
    serialId: 'PROD-001-2023',
    name: 'Premium Headphones',
    manufacturer: 'SoundWave Technologies',
    productOrigin: 'Japan',
    manufactureDate: '2023-01-15',
    expiryDate: '2028-01-15',
    seller: 'ElectroHub Retail',
    blockchainVerified: true,
    transactionId: '7UYXZ5WCFN2BV6A8D94RG3HJ1KLMT0PQEIOS',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
    description: 'High-end noise cancelling headphones with premium sound quality',
    category: 'Electronics',
  },
  {
    id: '2',
    serialId: 'PROD-002-2023',
    name: 'Luxury Watch',
    manufacturer: 'Precision Timepieces',
    productOrigin: 'Switzerland',
    manufactureDate: '2023-02-20',
    seller: 'LuxuryGoods Retail',
    blockchainVerified: true,
    transactionId: '2NM3BD7FCGXZ9AQ8V1P5R6HJ4KTWSLEO0YIU',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
    description: 'Handcrafted luxury watch with genuine leather strap',
    category: 'Fashion',
  },
  {
    id: '3',
    serialId: 'FAKE-001-2023',
    name: 'Designer Handbag',
    manufacturer: 'Luxury Fashion House',
    productOrigin: 'Italy',
    manufactureDate: '2023-03-10',
    seller: 'Fashion Outlet',
    blockchainVerified: false,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa',
    description: 'Designer handbag made with premium materials',
    category: 'Fashion',
  }
];

const mockReports: Report[] = [
  {
    id: '1',
    productName: 'Counterfeit Sneakers',
    reporterId: '2',
    reporterName: 'Regular User',
    description: 'Found these sneakers with poor quality stitching and incorrect logo placement',
    location: 'Downtown Market, New York',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
    status: 'pending',
    createdAt: '2023-04-15T14:30:00Z',
  }
];

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [reports, setReports] = useState<Report[]>(mockReports);

  const addProduct = async (product: Omit<Product, 'id' | 'blockchainVerified' | 'transactionId'>): Promise<Product> => {
    // In a real app, this would be an API call to add a product and register it on blockchain
    const newProduct: Product = {
      ...product,
      id: String(products.length + 1),
      blockchainVerified: true,
      transactionId: Math.random().toString(36).substring(2, 15).toUpperCase() +
                     Math.random().toString(36).substring(2, 15).toUpperCase(),
    };
    
    setProducts([...products, newProduct]);
    return newProduct;
  };

  const getProduct = (serialId: string): Product | undefined => {
    return products.find(p => p.serialId === serialId);
  };

  const updateProduct = async (id: string, productUpdate: Partial<Product>): Promise<Product | undefined> => {
    const index = products.findIndex(p => p.id === id);
    
    if (index !== -1) {
      const updatedProducts = [...products];
      updatedProducts[index] = { ...updatedProducts[index], ...productUpdate };
      setProducts(updatedProducts);
      return updatedProducts[index];
    }
    
    return undefined;
  };

  const deleteProduct = async (id: string): Promise<boolean> => {
    setProducts(products.filter(p => p.id !== id));
    return true;
  };

  const submitReport = async (report: Omit<Report, 'id' | 'status' | 'createdAt'>): Promise<boolean> => {
    const newReport: Report = {
      ...report,
      id: String(reports.length + 1),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    
    setReports([...reports, newReport]);
    return true;
  };

  const updateReportStatus = async (id: string, status: Report['status']): Promise<boolean> => {
    const index = reports.findIndex(r => r.id === id);
    
    if (index !== -1) {
      const updatedReports = [...reports];
      updatedReports[index] = { ...updatedReports[index], status };
      setReports(updatedReports);
      return true;
    }
    
    return false;
  };

  return (
    <ProductContext.Provider 
      value={{ 
        products, 
        reports, 
        addProduct, 
        getProduct, 
        updateProduct, 
        deleteProduct, 
        submitReport, 
        updateReportStatus 
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProduct must be used within a ProductProvider');
  }
  return context;
};
