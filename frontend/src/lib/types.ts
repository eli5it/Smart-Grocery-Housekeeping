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
