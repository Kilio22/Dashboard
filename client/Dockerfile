FROM node:14 as angular-build-stage

WORKDIR /app

COPY package.json .
RUN npm install

COPY . .

RUN npm run build-prod

####################

FROM nginx:latest

COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=angular-build-stage /app/dist/client /usr/share/nginx/html
