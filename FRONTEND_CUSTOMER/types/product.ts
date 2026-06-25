export interface Product {
  id: string;
  name: string;
  unit: string;
  price: number;
  imageUrl: string;
  category: string;
  daysUntilExpiry?: number;
  oldPrice?: number;
  showOldPrice?: boolean;
  description?: string;
  protein?: string;
  carbs?: string;
  calories?: string;
}