export type ToastDetails = {
  title: string;
  description: string;
};

export type PantryItem = {
  barcode?: string;
  product_name: string;
  ingredient_name: string;
  image_url?: string;
};

export type PantryListItem = {
  product_name: string;
  ingredient_name: string;
  expiration_date: string;
};

export type Ingredient = {
  id: number;
  name: string;
};

export type PantryEntry = {
  id: number;
  date_added: string;
  expiration_date: string;
  ingredient_id: number;
  product_name: string;
  status: "in_stock" | "out_of_stock";
  user_id: number;
  ingredient: Ingredient;
};

export type PantryEntryByProductName = Record<string, PantryEntry[]>;

export type Recipe = {
  canonical_ingredients: Ingredient[];
  ingredients: string[];
  instructions: string[];
  name: string;
  id: number;
};

export type PantryStats = {
  total: number;
  expiring: number;
  expired: number;
};
