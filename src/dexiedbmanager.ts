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

    loadProducts(): Promise<Product[]> {
      return new Promise((resolve, reject) => {
        const table: Dexie.Table<Product, number> = this.getTable("product");
        table.clear();
        table.bulkPut(PRODUCTSDB, {allKeys: true}).then(keys => {
          return resolve(table.bulkGet(keys));
        }).catch(error => {
          console.log(`error while loading the products ${error}`);
          reject("failed to load the products");
        });
      });
    }

    createorder(order: Order): Promise<number> {
      const table: Table<Order, number> = this.getTable("order");
      return new Promise((resolve, reject) => {
        table.add(order).then((id) => {
          return resolve(id);
        })
        .catch(err => {
          console.log(`error while creating the order ${err}`);
          reject("failed to create the order");
        });
      });
    }

    updateOrder(order: Order, orderitems: OrderDetail[]): Promise<boolean> {
      const orderTable: Table<Order, number> = this.getTable("order");
      const orderDetailTable: Table<OrderDetail, number> = this.getTable("orderdetail");
      return new Promise((resolve, reject) => {
        orderTable.put(order).then((id) => {
          orderDetailTable.bulkPut(orderitems).then(ids => {return resolve(true);}).catch(err => {
            console.log(`error while creating the order items ${err}`);
            reject("failed to create the order and order items");
          })
        })
      }); 
    }

    createcustomer(customer: Customer): Promise<boolean> {
      const table: Table<Customer, string> = this.getTable("customer");
      return new Promise((resolve, reject) => {
        table.put(customer).then((custmobile: string) => {
          return resolve(true);
        }).catch(err => {
          console.log(`error while creating the customer ${err}`);
            reject("failed to create the customer");
        });
      });
    }

    getCustomer(custmobile: string): Promise<Customer> {
      const table: Table<Customer, string> = this.getTable("customer");
      return new Promise((resolve, reject) => {
        table.where({mobileno: custmobile}).toArray().then((customers: Customer[]) => {
          return resolve(customers[0]);
        }).catch(err => {
          console.log(`error while fetching customer by mobileno ${err} for ${custmobile}`);
          reject("Failed to get the customer ")
        });
      });
    }

    getProduct(prdName: string): Promise<number> {
      const table: Table<Product, number> = this.getTable("product");
      return new Promise((resolve, reject) => {
        table.where({name: prdName}).toArray().then((products: Product[]) => {
          return resolve(products[0].id);
        }).catch(err => {
          console.log(`error while getting the product  ${err} for ${prdName}`);
            reject("failed to get the product");
        });
      });
    }

    getTable<T, IndexableType>(schema: string): Table<T, IndexableType> {
      return this.orderdb.table(schema);
    }
  
}

export default new DexieDBManager();