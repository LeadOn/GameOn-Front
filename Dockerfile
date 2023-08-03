FROM node:alpine AS yufoot-front-build
WORKDIR /app
COPY . .
RUN npm ci && npm run build

FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=yufoot-front-build /app/dist/yufoot-front /usr/share/nginx/html

EXPOSE 80