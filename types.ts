
export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  woodType: string;
  stock: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export enum Section {
  HERO = 'hero',
  COLLECTIONS = 'collections',
  ABOUT = 'about',
  CONTACT = 'contact'
}
