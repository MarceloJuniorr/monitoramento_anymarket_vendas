FROM --platform=linux/amd64 node:18.14.0
WORKDIR /app
COPY package*.json ./
RUN yarn install
COPY . .
EXPOSE 3004
CMD [ "yarn", "start" ]