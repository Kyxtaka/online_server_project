FROM node:20.15 as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --configuration stmapp

FROM nginx:alpine
COPY --from=build /app/dist/stmapp/browser /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/sites-enabled/stm-app.conf 
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
RUN nginx -t
# RUN systemctl reaload nginx

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
