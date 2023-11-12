const AWS = require('aws-sdk');
const {Database} = require("../database/database");
const {Product} = require("../models/product.model");

module.exports.catalogBatchProcess = async (event) => {
    const sns = new AWS.SNS();
    const dbService = new Database();

    const products = event.Records.map(({ body }) => {
        const productFromCSV = JSON.parse(body);
        const keys = [...Object.keys(productFromCSV).join('').split(';')];
        const values = [...Object.values(productFromCSV).join('').split(';')];
        const parsedProduct = {};
        keys.forEach((key, index) => {
            parsedProduct[key] = values[index];
        });
        parsedProduct['price'] = Number(parsedProduct['price']);
        return parsedProduct;
    });

    products.forEach(async (product) => {
        await dbService.put(process.env.PRODUCTS_TABLE, new Product(product));
    });

    try {
        const params = {
            Subject: 'Hooray! The product has been created!',
            Message: `Product with the following parameters has been created: ${JSON.stringify(products)}`,
            TopicArn: process.env.SNS_ARN,
        };
        await sns.publish(params).promise();
        console.log('Message published to SNS topic.');
    } catch (error) {
        console.error('Error publishing message to SNS:', error);
    }
}
