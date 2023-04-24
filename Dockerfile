FROM node:20
WORKDIR /app

# Install dependencies
COPY . /app/
RUN npm install --only=production

ENTRYPOINT [ "node", "app" ]