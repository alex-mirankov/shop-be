const AWS = require('aws-sdk');
const csv = require('csv-parser');
const {HEADERS} = require("../models/headers");
const BUCKET = 'my-import-service-bucket';

module.exports.importFileParser = async (event) => {
    console.log('LAMBDA: importFileParser (event)', event);
    try {
        const s3 = new AWS.S3({ region: 'us-east-1' });
        const {key} = event.Records[0].s3.object;
        const s3Stream = s3.getObject({Bucket: BUCKET, Key: key}).createReadStream();
        await new Promise((resolve, reject) => {
            s3Stream
                .pipe(csv())
                .on('data', (data) => {
                    console.log('parsed data:', data);
                })
                .on('end', () => {
                    console.log('uploaded successfully');
                })
                .on('error', (error) => {
                    console.log('error', error);
                    reject(error)
                })
        })


        return {
            statusCode: 200,
            headers: HEADERS,
            body: JSON.stringify({message: 'start processing for all files'}),
        }
    } catch (error) {
        console.log('error', error);
        return {
            statusCode: 500,
            headers: HEADERS,
            body: JSON.stringify({message: 'Internal Server Error'}),
        }
    }
}
