FROM node:16.6.1
WORKDIR /app
COPY package.json .
RUN  npm install
COPY . ./
EXPOSE 8000
CMD ["npm", "run", "dev"]