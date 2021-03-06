FROM node:alpine
WORKDIR /usr/local/app
COPY package.json .
RUN npm install
COPY . .
HEALTHCHECK --retries=3 --interval=10s \ 
	CMD curl -f http://localhost:3000 || exit 1 
CMD ["node", "app.js"]