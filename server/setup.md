# Environment

Node.js version 16.14.2

npm version 8.5.0

# Set up

npm install -g ts-node

npm i

# Install husky

npm run prepare

# Start the server in the development environment

npm run dev

# Check if the server has started

curl --request GET \
 --url http://localhost:3001/api/v1

# Health-Check

curl --request GET \
 --url http://localhost:3001/healthcheck
