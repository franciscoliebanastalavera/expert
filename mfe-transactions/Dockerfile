FROM node:20-alpine AS build
WORKDIR /app

COPY shared-ui/package*.json ./shared-ui/
COPY mfe-transactions/package*.json ./mfe-transactions/

RUN cd shared-ui && npm ci --legacy-peer-deps
RUN cd mfe-transactions && npm ci

COPY shared-ui ./shared-ui
COPY mfe-transactions ./mfe-transactions

WORKDIR /app/mfe-transactions
RUN npm run build

FROM nginx:alpine AS serve
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/mfe-transactions/dist/mfe-transactions /usr/share/nginx/html
COPY mfe-transactions/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
