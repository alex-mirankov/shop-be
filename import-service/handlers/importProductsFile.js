const AWS = require("aws-sdk");
const BUCKET = "my-import-service-bucket";
const {HEADERS} = require("../models/headers");

module.exports.importProductsFile = async (event) => {
    console.log("importProductsFile event:", event);
    const { name } = event.queryStringParameters;
    const fileName = `uploaded/${name}`;
    const s3Params = {
        Bucket: BUCKET,
        Key: fileName,
        ContentType: "text/csv",
        Expires: 60,
    };
    const s3 = new AWS.S3({ region: "us-east-1" });
    try {
        const url = await s3.getSignedUrlPromise("putObject", s3Params);
        console.log("signedUrl:", url);

        return {
            statusCode: 200,
            headers: HEADERS,
            body: JSON.stringify(url),
        };
    } catch (error) {
        console.log("error:", error);
        return {
            statusCode: 500,
            headers: HEADERS,
            body: JSON.stringify(error),
        };
    }
}
