'use strict'

const AWS = require('aws-sdk');
const {ERROR_MAP} = require("../models/error");
const {HEADERS} = require("../models/headers");
const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports.Database = class {
    scan = async (tableName) => {
        try {
            const params = { TableName: tableName };
            return await dynamodb.scan(params).promise();
        } catch (error) {
            return {
                headers: HEADERS,
                statusCode: error.statusCode,
                body: JSON.stringify({ error: ERROR_MAP[error.statusCode] }),
            };
        }
    }

    get = async (tableName, id) => {
        try {
            const params = { TableName: tableName, Key: { id } };
            return await dynamodb.get(params).promise();
        } catch (error) {
            console.log('get error', error);
            return {
                headers: HEADERS,
                statusCode: error.statusCode,
                body: JSON.stringify({ error: ERROR_MAP[error.statusCode] }),
            };
        }
    }

    put = async (tableName, item) => {
        try {
            const params = { TableName: tableName, Item: item };
            return await dynamodb.put(params).promise();
        } catch (error) {
            return {
                headers: HEADERS,
                statusCode: error.statusCode,
                body: JSON.stringify({ error: ERROR_MAP[error.statusCode] }),
            };
        }
    }
};
