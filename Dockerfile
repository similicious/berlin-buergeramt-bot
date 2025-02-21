FROM node:22-alpine
LABEL maintainer="similicious"
LABEL description="Berlin Buergeramt Bot"

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --production

COPY . .

# Create a non-root user
RUN addgroup -S botuser && adduser -S -G botuser botuser

# Set proper ownership
RUN chown -R botuser:botuser /usr/src/app

# Use the non-root user
USER botuser

# Set NODE_ENV
ENV NODE_ENV production

# Start the app
CMD [ "node", "src/index.js" ]
