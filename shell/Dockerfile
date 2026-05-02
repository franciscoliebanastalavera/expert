FROM node:20-alpine AS build
WORKDIR /app

COPY shared-ui/package*.json ./shared-ui/
COPY shell/package*.json ./shell/

RUN cd shared-ui && npm ci --legacy-peer-deps
RUN cd shell && npm ci

COPY shared-ui ./shared-ui
COPY shell ./shell

WORKDIR /app/shell
RUN npx ng build --configuration production

FROM nginx:stable-alpine
COPY --from=build /app/shell/dist/shell /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY shell/nginx.conf /etc/nginx/conf.d

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
