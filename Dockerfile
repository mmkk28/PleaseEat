FROM node:20-alpine

WORKDIR /app

COPY package.json tsconfig.json ./

RUN npm install

COPY src ./src

# tsc only compiles .ts files — copy static views manually
RUN npm run build && cp -r src/views dist/views

CMD ["npm", "start"]
