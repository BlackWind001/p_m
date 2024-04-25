
ARG NODE_VERSION=20.12.2
ARG APP_BASE_PATH=/usr/src/app

FROM node:${NODE_VERSION}-alpine

RUN apk update
RUN apk add git

WORKDIR ${APP_BASE_PATH}
COPY . .

ARG PASSWORD_FOLDER_PATH=/usr/pass

RUN npm install
RUN npm run tsc
RUN node build/index.js -i ${PASSWORD_FOLDER_PATH}
