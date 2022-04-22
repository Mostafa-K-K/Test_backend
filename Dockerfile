FROM node:16.6.1
WORKDIR /app
COPY package.json .
RUN  npm install
COPY . ./
ENV PORT 8000
EXPOSE $PORT
CMD ["npm", "run", "dev"]