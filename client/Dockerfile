FROM node:22 AS builder

WORKDIR /frontend/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

#lightweight
FROM node:22-alpine

WORKDIR /frontend/app

COPY --from=builder /frontend/app/.next ./.next
COPY --from=builder /frontend/app/package*.json ./

RUN npm install --production

EXPOSE 3000

CMD ["npm", "start"]
