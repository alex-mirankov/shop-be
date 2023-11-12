module.exports.basicAuthorizer = async (event, ctx, cb) => {
    const authorizationHeader = event.headers.authorization;
    console.log('authorizationHeader', authorizationHeader);
    if (!authorizationHeader) {
        cb('Unauthorized');
    }
    try {
        const encodedCredentials = authorizationHeader.split(' ')[1];

        const credentialsBuffer = Buffer.from(encodedCredentials, 'base64');
        const credentials = credentialsBuffer.toString('utf-8').split(':');

        const [username, password] = credentials;

        const expectedPassword = process.env[username];
        const isAllowed = username && password === expectedPassword;
        console.log('isAllowed', isAllowed, expectedPassword, credentials);
        console.log(event);
        const policy = generatePolicy('user', isAllowed ? 'Allow' : 'Deny', event.routeArn);
        console.log('policy', policy, policy.policyDocument.Statement[0]);
        cb(null, policy);
    } catch (err) {
        cb(`Unauthorized: ${err.message}`);
    }
};

function generatePolicy(principalId, effect, resource) {
    return {
        principalId: principalId,
        policyDocument: {
            Version: '2012-10-17',
            Statement: [
                {
                    Action: 'execute-api:Invoke',
                    Effect: effect,
                    Resource: resource,
                },
            ],
        },
        context: {
            'Access-Control-Allow-Origin': '*',
        },
    };
}
