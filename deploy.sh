#!/bin/bash

# Set the S3 bucket name and CloudFront distribution ID
BUCKET_NAME=$1
DISTRIBUTION_ID=$2
IDENTITY_POOL_ID=$3
USER_POOL_ID=$4
USER_POOL_CLIENT_ID=$5

echo "BUCKET_NAME: $BUCKET_NAME"
echo "DISTRIBUTION_ID: $DISTRIBUTION_ID"
echo "IDENTITY_POOL_ID: $IDENTITY_POOL_ID"
echo "USER_POOL_ID: $USER_POOL_ID"
echo "USER_POOL_CLIENT_ID: $USER_POOL_CLIENT_ID"


# Save the Cognito configuration in a JSON file
echo "Saving Cognito configuration..."
cat > ./src/amplifyconfiguration.json << EOF
{
    "aws_project_region": "us-east-1",
    "aws_cognito_identity_pool_id": "$IDENTITY_POOL_ID",
    "aws_cognito_region": "us-east-1",
    "aws_user_pools_id": "$USER_POOL_ID",
    "aws_user_pools_web_client_id": "$USER_POOL_CLIENT_ID",
    "usernameAttributes": "email"
}
EOF

# Build your React application
echo "Building the React app..."
npm run build 

# Deploy the build to the S3 bucket
echo "Deploying to S3 bucket..."
# Delete current files in the bucket
aws s3 rm s3://$BUCKET_NAME/ --recursive
# Copy the new build to the bucket
aws s3 cp build/ s3://$BUCKET_NAME/ --recursive

# Invalidate the CloudFront cache to ensure fresh content is served
echo "Invalidating CloudFront cache..."
aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*"

# Retrieve and print the CloudFront Distribution URL
CLOUDFRONT_URL=$(aws cloudfront get-distribution --id $DISTRIBUTION_ID --query "Distribution.DomainName" --output text)
echo "Your CloudFront web address is: https://$CLOUDFRONT_URL"

# Instal jq
