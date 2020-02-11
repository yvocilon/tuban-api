FROM node:10

WORKDIR /usr/src/app

COPY package*.json ./
COPY ./ ./

RUN npm install

RUN npm run build

COPY .env ./build

EXPOSE 3000

CMD [ "node", "./build/index.js" ]