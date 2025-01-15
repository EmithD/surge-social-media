FROM node:22

WORKDIR /backend/app

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT=8080
ENV MONGO_URI=mongodb+srv://admin:zOtsESlmD46zvstW@backenddb.wulqw.mongodb.net/Node-API?retryWrites=true&w=majority&appName=BackendDB
ENV JWT_SECRET=d837!@f8C%6M47fdjsE@1kf0d9sY#rO9VzcJ3L90Qps2k^N

EXPOSE 8080

CMD [ "npm", "start" ]