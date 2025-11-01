FROM node:20.15 as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ARG CONFIG="test"
RUN npm run build --configuration $CONFIG

FROM nginx:alpine
COPY --from=build /app/dist/stmapp/browser /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/sites-enabled/stm-app.conf
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
RUN nginx -t

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
