const AWS = require('aws-sdk');

module.exports.catalogBatchProcess = async (event) => {
    const sns = new AWS.SNS();
    const products = event.Records.map(({ body }) => JSON.parse(body));

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
