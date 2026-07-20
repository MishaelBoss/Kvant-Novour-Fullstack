FROM node:26-alpine

WORKDIR /app

# RUN apk add --no-cache bash git build-base python3

COPY package.json package-lock.json* ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]