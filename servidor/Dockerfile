FROM node:16.15.1

WORKDIR /usr/app

COPY package*.json ./
RUN npm i

COPY . .

EXPOSE 8000

CMD ["npm", "run", "dev"]