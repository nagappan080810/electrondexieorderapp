"use strict";
exports.__esModule = true;
var dexie_1 = require("dexie");
var PRODUCTSDB = [
    { 'name': 'dell inspiron laptop', 'description': "its a refurbished laptop" },
    { 'name': 'kingston usb drive', 'description': "8gb flash memory" },
    { 'name': 'portable hdd', 'description': "portable hard disk" },
    { 'name': 'google nest', 'description': "home automation system" },
    { 'name': 'dslr camera', 'description': "18-55 lens canon camera" }
];
var DexieDBManager = /** @class */ (function () {
    function DexieDBManager() {
        this.init();
    }
    DexieDBManager.prototype.init = function () {
        this.orderdb = new dexie_1["default"]('orderdb', { autoOpen: true });
        // Create a collections
        this.orderdb.version(DexieDBManager.VERSION_1_O).stores({
            product: '++id, &name, description',
            customer: '&mobileno, name,  &mailid',
            order: '++id, date, totalqty, mobileno, name',
            orderdetail: '++id, orderid, productid'
        });
        console.log("database initialized");
    };
    DexieDBManager.prototype.loadProducts = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var table = _this.getTable("product");
            table.clear();
            table.bulkPut(PRODUCTSDB, { allKeys: true }).then(function (keys) {
                return resolve(table.bulkGet(keys));
            })["catch"](function (error) {
                console.log("error while loading the products " + error);
                reject("failed to load the products");
            });
        });
    };
    DexieDBManager.prototype.createorder = function (order) {
        var table = this.getTable("order");
        return new Promise(function (resolve, reject) {
            table.add(order).then(function (id) {
                return resolve(id);
            })["catch"](function (err) {
                console.log("error while creating the order " + err);
                reject("failed to create the order");
            });
        });
    };
    DexieDBManager.prototype.updateOrder = function (order, orderitems) {
        var orderTable = this.getTable("order");
        var orderDetailTable = this.getTable("orderdetail");
        return new Promise(function (resolve, reject) {
            orderTable.put(order).then(function (id) {
                orderDetailTable.bulkPut(orderitems).then(function (ids) { return resolve(true); })["catch"](function (err) {
                    console.log("error while creating the order items " + err);
                    reject("failed to create the order and order items");
                });
            });
        });
    };
    DexieDBManager.prototype.createcustomer = function (customer) {
        var table = this.getTable("customer");
        return new Promise(function (resolve, reject) {
            table.put(customer).then(function (custmobile) {
                return resolve(true);
            })["catch"](function (err) {
                console.log("error while creating the customer " + err);
                reject("failed to create the customer");
            });
        });
    };
    DexieDBManager.prototype.getCustomer = function (custmobile) {
        var table = this.getTable("customer");
        return new Promise(function (resolve, reject) {
            table.where({ mobileno: custmobile }).toArray().then(function (customers) {
                return resolve(customers[0]);
            })["catch"](function (err) {
                console.log("error while fetching customer by mobileno " + err + " for " + custmobile);
                reject("Failed to get the customer ");
            });
        });
    };
    DexieDBManager.prototype.getProduct = function (prdName) {
        var table = this.getTable("product");
        return new Promise(function (resolve, reject) {
            table.where({ name: prdName }).toArray().then(function (products) {
                return resolve(products[0].id);
            })["catch"](function (err) {
                console.log("error while getting the product  " + err + " for " + prdName);
                reject("failed to get the product");
            });
        });
    };
    DexieDBManager.prototype.getTable = function (schema) {
        return this.orderdb.table(schema);
    };
    DexieDBManager.VERSION_1_O = 1;
    return DexieDBManager;
}());
exports["default"] = new DexieDBManager();
//# sourceMappingURL=dexiedbmanager.js.map