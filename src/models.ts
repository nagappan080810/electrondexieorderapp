export interface Product {
    id?: number;
    name: string;
    description: string;
}

export interface Customer {
    mobileno: string;
    name?: string;
    mailid?: string;
}

export interface Order {
    id?: number;
    date: Date;
    totalqty?: number;
    totalprice?: number;
    mobileno: string;
    name: string;
}

export interface OrderDetail {
    id?: number;
    orderId: number;
    productId: number;
    qty: number;
    price: number;
}
