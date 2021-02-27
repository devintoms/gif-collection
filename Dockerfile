FROM node:alpine
WORKDIR /usr/local/app
COPY package.json .
RUN npm install
COPY . .
CMD ["node", "app.js"]