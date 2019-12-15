FROM node:12
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy files
COPY . .

CMD [ "npm", "start" ]