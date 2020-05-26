# serverless-apigateway-access-logs-plugin
serverless-apigateway-access-logs-plugin

Plugin to update api gateway access logs. This plugin takes the requried params defined under provider. Based on the given input (account, logGroup), it constructs the arn "arn:aws:logs:<region>:<account>:log-group:<logGroup>".

### Using this pluging
```
npm install serverless-apigateway-access-logs-plugin
```

### serverless.yml
```
provider:
    name: XXX
    apiGatewayAccessLogs:
        account: "yyy"
        logGroup: "xxxxx"
        format: "{"patchOperations":[{"op":"replace","path":"/*/*/metrics/enabled","value":"false"},{"op":"replace","path":"/*/*/logging/loglevel","value":"OFF"},{"op":"replace","path":"/*/*/logging/dataTrace","value":"false"},{"op":"replace","path":"/tracingEnabled","value":"false"},{"op":"replace","path":"/accessLogSettings/destinationArn","value":"arn:aws:logs:us-east-2:294749062442:log-group:/aws/apigateway/access/dynaoDbtuning"},{"op":"replace","path":"/accessLogSettings/format","value":"{ \"requestId\":\"$context.requestId\", \"ip\": \"$context.identity.sourceIp\", \"caller\":\"$context.identity.caller\", \"user\":\"$context.identity.user\",\"requestTime\":\"$context.requestTime\", \"httpMethod\":\"$context.httpMethod\",\"resourcePath\":\"$context.resourcePath\", \"status\":\"$context.status\",\"protocol\":\"$context.protocol\", \"responseLength\":\"$context.responseLength\" }"}]}"

plugins:
  - serverless-apigateway-access-logs-plugin
```

```
custom:
    apiGatewayAccessLogs:
        account: "yyy"
        logGroup: "xxxxx"
        format: "{"patchOperations":[{"op":"replace","path":"/*/*/metrics/enabled","value":"false"},{"op":"replace","path":"/*/*/logging/loglevel","value":"OFF"},{"op":"replace","path":"/*/*/logging/dataTrace","value":"false"},{"op":"replace","path":"/tracingEnabled","value":"false"},{"op":"replace","path":"/accessLogSettings/destinationArn","value":"arn:aws:logs:us-east-2:294749062442:log-group:/aws/apigateway/access/dynaoDbtuning"},{"op":"replace","path":"/accessLogSettings/format","value":"{ \"requestId\":\"$context.requestId\", \"ip\": \"$context.identity.sourceIp\", \"caller\":\"$context.identity.caller\", \"user\":\"$context.identity.user\",\"requestTime\":\"$context.requestTime\", \"httpMethod\":\"$context.httpMethod\",\"resourcePath\":\"$context.resourcePath\", \"status\":\"$context.status\",\"protocol\":\"$context.protocol\", \"responseLength\":\"$context.responseLength\" }"}]}"

plugins:
  - serverless-apigateway-access-logs-plugin
```