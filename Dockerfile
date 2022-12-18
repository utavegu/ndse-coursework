FROM node:19.1-alpine

WORKDIR /app

ARG NODE_ENV=production

COPY package*.json ./
COPY src/ ./src

RUN npm i

EXPOSE 3001

CMD [ "npm", "run", "start" ]
