export type Invoice = {
  customerName: string;
  items: { name: string; quantity: number | string; price: number | string }[];
  date: string | Date;
  total: number | string;
};
