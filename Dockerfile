FROM node:11.3.0
WORKDIR /app
COPY package*.json /app
RUN npm install
COPY . /app
CMD ["npm", "test"]
EXPOSE 8080