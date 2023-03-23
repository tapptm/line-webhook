FROM node:19-alpine

WORKDIR /app

COPY package*.json /app/

RUN npm install

COPY . .

RUN npm run build

COPY . .

EXPOSE 19160

CMD [ "node", "dist/index.js" ]