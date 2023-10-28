'use strict';

const {Database} = require("../database/database");
const {HEADERS} = require("../models/headers");

module.exports.productsList = async (event) => {
  console.log('LAMBDA: productsList (event)', event);
  const dbService = new Database();
  const [products, stock] = await Promise.all([
    dbService.scan(process.env.PRODUCTS_TABLE),
    dbService.scan(process.env.STOCKS_TABLE),
  ]);

  const results = {
    products: products.Items,
    stock: stock.Items,
  }

  return {
    headers: HEADERS,
    statusCode: 200,
    body: JSON.stringify(results),
  };
};
