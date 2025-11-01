FROM node:25
WORKDIR /app

# Install dependencies
COPY . /app/
RUN npm install --only=production

ENTRYPOINT [ "node", "app" ]