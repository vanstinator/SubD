FROM node:16-alpline

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig.json ./

RUN yarn
RUN yarn build

COPY . .

EXPOSE 8080
CMD ['node', 'index.js']