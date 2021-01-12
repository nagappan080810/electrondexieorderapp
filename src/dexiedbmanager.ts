import Dexie, { IndexableType, Table } from 'dexie';
import { Product, Order, OrderDetail, Customer } from './models';
const PRODUCTSDB = [
  {'name': 'dell inspiron laptop', 'description': "its a refurbished laptop"},
  {'name': 'kingston usb drive', 'description': "8gb flash memory"},
  {'name': 'portable hdd', 'description': "portable hard disk"},
  {'name': 'google nest', 'description': "home automation system"},
  {'name': 'dslr camera', 'description': "18-55 lens canon camera"}
];

class DexieDBManager {
    private orderdb!: Dexie;

    private static VERSION_1_O = 1;
  
    constructor() {
      this.init();
    }
  
    init() {
      this.orderdb = new Dexie('orderdb', { autoOpen: true });
  
      // Create a collections
      this.orderdb.version(DexieDBManager.VERSION_1_O).stores({
        product: '++id, &name, description',
        customer: '&mobileno, name,  &mailid',
        order: '++id, date, totalqty, mobileno, name',
        orderdetail: '++id, orderid, productid',
      });
      console.log("database initialized");
    }

    async loadProducts(): Promise<Product[]> {
      const table: Dexie.Table<Product, number> = this.getTable("product");
      return table.clear().then(() => {
        return table.bulkPut(PRODUCTSDB, {allKeys: true}).then(keys => {
          return table.bulkGet(keys).then((products: Product[])=>{
            return products;
          });
        }).catch(error => {
          console.log(`error while loading the products ${error}`);
          throw new Error("failed to load the products");
        });
      });
    }

    createorder(order: Order): Promise<number> {
      const table: Table<Order, number> = this.getTable("order");
        return table.add(order).then(id => {
          return id;
        })
        .catch(err => {
          console.log(`error while creating the order ${err}`);
          throw new Error("failed to create the order");
        });
    }

    updateOrder(order: Order, orderitems: OrderDetail[]): Promise<boolean> {
      const orderTable: Table<Order, number> = this.getTable("order");
      const orderDetailTable: Table<OrderDetail, number> = this.getTable("orderdetail");
      return orderTable.put(order).then((id) => {
          return orderDetailTable.bulkPut(orderitems).then(ids => {return true;}).catch(err => {
            console.log(`error while creating the order items ${err}`);
            throw new Error("failed to create the order and order items");
          });
        });
    }

    createcustomer(customer: Customer): Promise<boolean> {
      const table: Table<Customer, string> = this.getTable("customer");
      return table.put(customer).then((custmobile: string) => {
          return true;
        }).catch(err => {
          console.log(`error while creating the customer ${err}`);
          throw new Error("failed to create the customer");
        });
    }

    getCustomer(custmobile: string): Promise<Customer> {
      const table: Table<Customer, string> = this.getTable("customer");
        return table.where({mobileno: custmobile}).toArray().then((customers: Customer[]) => {
          return customers[0];
        }).catch(err => {
          console.log(`error while fetching customer by mobileno ${err} for ${custmobile}`);
          throw new Error("Failed to get the customer ")
        });
    }

    getProduct(prdName: string): Promise<number> {
      const table: Table<Product, number> = this.getTable("product");
        return table.where({name: prdName}).toArray().then((products: Product[]) => {
          return products[0].id;
        }).catch(err => {
          console.log(`error while getting the product  ${err} for ${prdName}`);
            throw new Error("failed to get the product");
        });
    }

    getTable<T, IndexableType>(schema: string): Table<T, IndexableType> {
      return this.orderdb.table(schema);
    }
  
}

export default new DexieDBManager();