'use strict';

const {MOCK_PRODUCT_LIST} = require("./mock");

module.exports.productsList = async (event) => {
  return {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    statusCode: 200,
    body: JSON.stringify(MOCK_PRODUCT_LIST),
  };
};
