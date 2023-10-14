'use strict';

const {MOCK_PRODUCT_LIST} = require("./mock");

module.exports.productById = async (event) => {
    const { id } = event.pathParameters;
    const product = MOCK_PRODUCT_LIST.find((el) => el.id === id);

  return {
      headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
      },
    statusCode: 200,
    body: JSON.stringify(product),
  };
};
