<!--
title: 'Serverless Framework Node Express API service backed by DynamoDB on AWS'
description: 'This template demonstrates how to develop and deploy a simple Node Express API service backed by DynamoDB running on AWS Lambda using the Serverless Framework.'
layout: Doc
framework: v4
platform: AWS
language: nodeJS
priority: 1
authorLink: 'https://github.com/serverless'
authorName: 'Serverless, Inc.'
authorAvatar: 'https://avatars1.githubusercontent.com/u/13742415?s=200&v=4'
-->

# Feature Flag Service built with Serverless Framework Node Express API on AWS

This template demonstrates how a REST API revolving around feature flags could be built using Node Express API service, backed by DynamoDB table, running on AWS Lambda using the Serverless Framework.

Additionally, it also handles provisioning of a DynamoDB database that is used for storing data about users. The Express.js application exposes 5 endpoints:

 - `POST /featureFlags` to create a new feature flag.
 - `GET /featureFlags/:featureFlagId` to get the feature flag details with id `featureFlagId`.
 - `GET /featureFlags` to get the list of all feature flags.
 - `PUT /featureFlags/:featureFlagId` to update the feature flag with id `featureFlagId`.
 - `DELETE /featureFlags/:featureFlagId` to delete the feature flag with id `featureFlagId`.

## Why Feature Flags?

Feature flags are a way to release a new feature unto a software platform. If the code is wrapped correctly, the flag manager should be able to switch the feature on and off from an admin view.

This is an aspect of software development that I fell in love with when I got my first job with well established software engineering processes. I believe any company should have some kind of implementation of this, either from a 3rd party provider or internally developed.

## Lambda functions

Each API endpoint is related to an AWS Lambda function. In the following image, you will see the listed Lambda functions in the AWS platform:

![image](https://github.com/user-attachments/assets/c1d6c01b-f6df-472f-8477-10ef7ec962fd)

## Try it out yourself!

IF you use Postman for your API tests, you can download the [PRD](https://github.com/tobiaGasparoni/feature-flag-service/blob/main/postman/Feature%20Flags%20Service%20(PRD).postman_collection.json) and [STG](https://github.com/tobiaGasparoni/feature-flag-service/blob/main/postman/Feature%20Flags%20Service%20(STG).postman_collection.json) json files and import them into your local program to try.

If you prefer to use curl, here are the suggested commands to verify the flow:

1. List all feature flags:

```
curl https://a23n1etrl6.execute-api.us-east-1.amazonaws.com/prd/featureFlags
```

2. Create a new feature flag:

```
curl -H 'Content-Type: application/json' \
      -d '{ "name": "<YOUR FF NAME HERE>" }' \
      -X POST \
      https://a23n1etrl6.execute-api.us-east-1.amazonaws.com/prd/featureFlags
```

3. List all feature flags to verify that it was created.

4. Get feature flag with the id provided in the step 2's response:

```
curl https://a23n1etrl6.execute-api.us-east-1.amazonaws.com/prd/featureFlags/<NEW FLAG ID HERE>
```

5. Update the isEnabled attribute:

```
curl -H 'Content-Type: application/json' \
      -d '{ "isEnabled": true }' \
      -X PUT \
      https://a23n1etrl6.execute-api.us-east-1.amazonaws.com/prd/featureFlags/<NEW FLAG ID HERE>
```

7. Again get the feature flag by id to verify the change.

8. Delete the flag:

```
curl -X DELETE https://a23n1etrl6.execute-api.us-east-1.amazonaws.com/prd/featureFlags/<NEW FLAG ID HERE>
```

10. Again list all feature flags to verify the correct deletion.

## CI/CD pipelines for the STG and PRD environments

To automate the testing and deployment steps, Github Actions was used. For every commit in the corresponding branches, the following processes are executed, in this exact order:

1. Unit testing
2. Serverless Framework deployment

In the following video, you will see how a modification in the code is pushed to the `stg` branch and therefore deployment in the STG functions. Then, by merging a Pull Request from the `stg` branch to the `main` branch, another pipeline will begin to deploy the PRD functions.

## Videos

### Code explanation

Click [here](https://www.youtube.com/watch?v=mpAxX74sotY) to view the video.

### Separate environments

Click [here](https://www.youtube.com/watch?v=1RwBB1iDvNE) to view the video.

### Git flow

Click [here](https://www.youtube.com/watch?v=6k9WepfQZ2A) to view the video.

## Future work

These are some aspects of the project I would have liked to add before delivering it. So their absence is due to lack of knowledge of the Serverless Framework or time. 

### More unit test converage

In the current state of the project, only the createFeatureFlag function is tested. Ideally, of course, all the functions are tested in an equally excruciating fashion. With more time, that would be the case. The objective of the challenge was, anyway, to prove that I could:
1. Create unit tests.
2. Include the tests as a step of deployment.

Such objectives was achieved.

### Integration tests

Apparently [there si a way](https://medium.com/@sassenthusiast/serverless-simplified-integrating-docker-containers-into-aws-lambda-via-serverless-yml-cdef9be1681e) to involve integration tests in the deployment pipeline. Their absence is due to personal time constraints. I would normally use Docker and internal scripts to simulate the DynamoDB and Lambda functions.
