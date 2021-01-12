// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process unless
// nodeIntegration is set to true in webPreferences.
// Use preload.js to selectively enable features
// needed in the renderer process.
import dexiedbmanager from './dexiedbmanager';
import { Product, OrderDetail, Order, Customer } from './models';

let QRCode = require('qrcode');
let canvas: HTMLElement = undefined;

const optionElements: HTMLOptionElement[] = [];

window.addEventListener("DOMContentLoaded", ()=>{
    canvas = document.getElementById('canvas');
    dexiedbmanager.loadProducts().then((products: Product[])=>{
        products.forEach(product => {
            const optionElement = document.createElement("option");
            optionElement.value =  product.id.toString();
            optionElement.textContent = product.name;
            optionElements.push(optionElement);
            
        })
    });
});

export function loadDropdown(evt: any) {
    if (evt.target.childElementCount <=  1) {
        optionElements.forEach(elem => {
            evt.target.add(elem);
        });
    }
}

export async function createOrder(evt: any) {
    console.log("onsave called");
    const custElem = document.getElementById("custname") as HTMLInputElement;
    const mobileElem = document.getElementById("mobileno") as HTMLInputElement;
    const name = custElem.value;
    const mobileno = mobileElem.value;
    dexiedbmanager.getCustomer(mobileno).then((customer) => {
        console.log(`get the customer name: ${customer.name}`);
        custElem.value = customer.name;
    });
    
    dexiedbmanager.createcustomer({
        name, 
        mobileno,
        mailid: "",
    });
    const selectedProducts = document.getElementsByClassName("prd");
    const quantities = document.getElementsByClassName("qty");
    const prices = document.getElementsByClassName("price");
    console.log(selectedProducts);
    const order: Order = {
        date: new Date(), mobileno, name
    }
const orderId: number = await dexiedbmanager.createorder(order);
let totalAmount = 0, totalQuantities = 0;
const orderItems: OrderDetail[] = []; 
for (let i=0; i< selectedProducts.length; i++) {
    const prdElem = selectedProducts.item(i) as HTMLSelectElement;
    const qtyElem = quantities.item(i) as HTMLInputElement;
    const priceElem = prices.item(i) as HTMLInputElement;
    const productId = parseInt(prdElem.value);
    const qty = parseInt(qtyElem.value);
    const price = parseInt(priceElem.value);
    totalQuantities += qty;
    totalAmount +=  qty * price;
    const orderItem: OrderDetail = {orderId, productId, qty, price};
    orderItems.push(orderItem);
}
order.totalprice = totalAmount;
order.totalqty = totalQuantities;
dexiedbmanager.updateOrder(order, orderItems).then(() => {
    console.log("order saved successfully");
    const result = document.getElementById("result") as HTMLDivElement;
    result.innerText = `Order Id - ${order.id} | Total Qty - ${order.totalqty} | Total Amt - ${order.totalprice}`;
    QRCode.toCanvas(canvas, result.innerText,  (error: any) => {
        if (error) console.error(`error happened ${error}`);
        console.log('success!');
      })

});
}

export function delItem(evt: any) {
    console.log("del item invoked");
    evt.target.parentElement.parentElement.remove();
}

export function addItem(evt: any) {
    console.log("add item invoked", evt.target.parent);
    const clonedNode = evt.target.parentElement.parentElement.cloneNode(true);
    document.getElementsByTagName("tbody")[0].appendChild(clonedNode);
}



