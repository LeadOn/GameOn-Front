FROM node:alpine AS yugames-front-build
WORKDIR /app
COPY . .
RUN npm ci --legacy-peer-deps && npm run build

FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=yugames-front-build /app/dist/yugames-front /usr/share/nginx/html

EXPOSE 80