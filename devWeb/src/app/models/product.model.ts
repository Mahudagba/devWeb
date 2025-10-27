
export interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  image: string;
  is_active: boolean;
  stock: number;
  description: string;
  categories: Category[];
}

export interface Category {
  id: number;
  name: string;
  description: string;

  // toString(): string {
  //   return this.name;
  // }


}