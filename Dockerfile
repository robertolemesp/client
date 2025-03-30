
FROM node:22-alpine

LABEL maintainer="Roberto L Padilha"

WORKDIR /next-server

COPY yarn.lock package.json ./

RUN yarn install

COPY . .

EXPOSE 3000

CMD ["yarn", "dev"]
