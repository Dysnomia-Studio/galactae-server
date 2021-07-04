FROM node:16
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

# Install dependencies
COPY . /app/
RUN npm install --only=production

ENTRYPOINT [ "node", "app" ]