FROM node:alpine AS gameon-front-build
WORKDIR /app
COPY . .
RUN npm ci && npm run build

FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=gameon-front-build /app/dist/gameon-front/browser /usr/share/nginx/html

EXPOSE 80