"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.addItem = exports.delItem = exports.createOrder = exports.loadDropdown = void 0;
// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process unless
// nodeIntegration is set to true in webPreferences.
// Use preload.js to selectively enable features
// needed in the renderer process.
var dexiedbmanager_1 = require("./dexiedbmanager");
var optionElements = [];
window.addEventListener("DOMContentLoaded", function () {
    dexiedbmanager_1["default"].loadProducts().then(function (products) {
        products.forEach(function (product) {
            var optionElement = document.createElement("option");
            optionElement.value = product.id.toString();
            optionElement.textContent = product.name;
            optionElements.push(optionElement);
        });
    });
});
function loadDropdown(evt) {
    if (evt.target.childElementCount <= 1) {
        optionElements.forEach(function (elem) {
            evt.target.add(elem);
        });
    }
}
exports.loadDropdown = loadDropdown;
function createOrder(evt) {
    return __awaiter(this, void 0, void 0, function () {
        var custElem, mobileElem, name, mobileno, selectedProducts, quantities, prices, order, orderId, totalAmount, totalQuantities, orderItems, i, prdElem, qtyElem, priceElem, productId, qty, price, orderItem;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("onsave called");
                    custElem = document.getElementById("custname");
                    mobileElem = document.getElementById("mobileno");
                    name = custElem.value;
                    mobileno = mobileElem.value;
                    dexiedbmanager_1["default"].getCustomer(mobileno).then(function (customer) {
                        console.log("get the customer name: " + customer.name);
                        custElem.value = customer.name;
                    });
                    dexiedbmanager_1["default"].createcustomer({
                        name: name,
                        mobileno: mobileno,
                        mailid: ""
                    });
                    selectedProducts = document.getElementsByClassName("prd");
                    quantities = document.getElementsByClassName("qty");
                    prices = document.getElementsByClassName("price");
                    console.log(selectedProducts);
                    order = {
                        date: new Date(),
                        mobileno: mobileno, name: name
                    };
                    return [4 /*yield*/, dexiedbmanager_1["default"].createorder(order)];
                case 1:
                    orderId = _a.sent();
                    totalAmount = 0, totalQuantities = 0;
                    orderItems = [];
                    for (i = 0; i < selectedProducts.length; i++) {
                        prdElem = selectedProducts.item(i);
                        console.log(prdElem.value);
                        qtyElem = quantities.item(i);
                        console.log(qtyElem.value);
                        priceElem = prices.item(i);
                        console.log(priceElem.value);
                        productId = parseInt(prdElem.value);
                        qty = parseInt(qtyElem.value);
                        price = parseInt(priceElem.value);
                        totalQuantities += qty;
                        totalAmount += qty * price;
                        orderItem = { orderId: orderId, productId: productId, qty: qty, price: price };
                        orderItems.push(orderItem);
                    }
                    order.totalprice = totalAmount;
                    order.totalqty = totalQuantities;
                    dexiedbmanager_1["default"].updateOrder(order, orderItems).then(function () {
                        console.log("order saved successfully");
                        var result = document.getElementById("result");
                        result.innerText = JSON.stringify(order) + " --> " + JSON.stringify(orderItems);
                    });
                    return [2 /*return*/];
            }
        });
    });
}
exports.createOrder = createOrder;
function delItem(evt) {
    console.log("del item invoked");
    evt.target.parentElement.parentElement.remove();
}
exports.delItem = delItem;
function addItem(evt) {
    console.log("add item invoked", evt.target.parent);
    var clonedNode = evt.target.parentElement.parentElement.cloneNode(true);
    document.getElementsByTagName("tbody")[0].appendChild(clonedNode);
}
exports.addItem = addItem;
//# sourceMappingURL=renderer.js.map