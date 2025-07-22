#!/bin/bash

# Apollo GraphQL Cloud Schema Publishing Script
# This script publishes the Marriott Hotels GraphQL schema to Apollo GraphQL Cloud

echo "🚀 Publishing Marriott Hotels GraphQL Schema to Apollo GraphQL Cloud..."

# Set Apollo GraphQL Cloud credentials
export APOLLO_KEY="service:marriott:ZsY_h2BlOZ_JD48VsC-EGg"

# Check if schema file exists
if [ ! -f "products-schema.graphql" ]; then
    echo "❌ Error: products-schema.graphql not found!"
    exit 1
fi

# Check if rover is installed
if ! command -v rover &> /dev/null; then
    echo "❌ Error: Apollo Rover CLI not found!"
    echo "Please install it with: curl -sSL https://rover.apollo.dev/nix/latest | sh"
    exit 1
fi

echo "📋 Schema file found: products-schema.graphql"
echo "🔑 Using Apollo Key: $APOLLO_KEY"

# Publish the schema
echo "📤 Publishing schema to Apollo GraphQL Cloud..."
rover subgraph publish marriott@current \
  --schema ./products-schema.graphql \
  --name marriott-hotels \
  --routing-url http://localhost:4000/graphql

if [ $? -eq 0 ]; then
    echo "✅ Schema published successfully!"
    echo "🌐 Check your Apollo GraphQL Cloud dashboard for the updated schema."
else
    echo "❌ Failed to publish schema. Please check your Apollo GraphQL Cloud configuration."
    exit 1
fi 