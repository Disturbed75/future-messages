FROM node:18-alpine3.18

ARG TAG_VERSION
ENV TAG_VERSION=$TAG_VERSION

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY ./ ./

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
