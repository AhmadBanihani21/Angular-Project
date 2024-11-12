export class Order {
  id!: number;
  quantity!: number;
  customerDetails!: string;
  paymentMethod!: string;
  shippingAddress!: string;
  totalPrice!: number;
  orderStatus!: string;
  orderDate!: Date;
  productId!: number;
}
