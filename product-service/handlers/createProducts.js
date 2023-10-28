'use strict';

const {Database} = require("../database/database");
const {Product} = require("../models/product.model");
const {HEADERS} = require("../models/headers");

module.exports.createProducts = async (event) => {
    console.log('LAMBDA: createProducts (incoming body)', event.body);
    const dbService = new Database();
    const body = JSON.parse(event.body);
    const product = new Product(body);
    console.log(product);
    await dbService.put(process.env.PRODUCTS_TABLE, product);

    return {
        headers: HEADERS,
        statusCode: 200,
        body: JSON.stringify(product),
    }
}
