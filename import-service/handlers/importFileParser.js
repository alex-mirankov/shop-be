const AWS = require('aws-sdk');
const csv = require('csv-parser');
const {HEADERS} = require("../models/headers");
const BUCKET = 'my-import-service-bucket';

const sqs = new AWS.SQS();

module.exports.importFileParser = async (event) => {
    try {
        const s3 = new AWS.S3({ region: 'us-east-1' });
        const {key} = event.Records[0].s3.object;
        const s3Stream = s3.getObject({Bucket: BUCKET, Key: key}).createReadStream();
        const queueUrl = 'https://sqs.us-east-1.amazonaws.com/243868715591/catalogItemsQueue';
        await new Promise((resolve, reject) => {
            s3Stream
                .pipe(csv())
                .on('data', async (record) => {
                    await sendToSqs(record, queueUrl)
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
            body: JSON.stringify({message: 'CVS records sent to SQS'}),
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

async function sendToSqs(csvRecord, queueUrl) {
    const params = {
        MessageBody: JSON.stringify(csvRecord),
        QueueUrl: queueUrl,
    };

    try {
        const result = await sqs.sendMessage(params).promise();
        console.log(`Sent message to SQS: ${result.MessageId}`);
    } catch (error) {
        console.log(`Error sending message to SQS: ${error.message}`);
        throw error;
    }
}
