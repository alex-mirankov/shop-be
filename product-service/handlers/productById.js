'use strict';

const {Database} = require("../database/database");
const {HEADERS} = require("../models/headers");

module.exports.productById = async (event) => {
    console.log('LAMBDA: productById (id)', event.pathParameters.id);
    const { id } = event.pathParameters;
    const dbService = new Database();
    const product = await dbService.get(process.env.PRODUCTS_TABLE, id);
    return {
        headers: HEADERS,
        statusCode: 200,
        body: JSON.stringify(product.Item),
    }
};
