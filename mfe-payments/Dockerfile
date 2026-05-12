FROM node:20-alpine AS build
WORKDIR /app

COPY shared-ui/package*.json ./shared-ui/
COPY mfe-payments/package*.json ./mfe-payments/

RUN cd shared-ui && npm ci --legacy-peer-deps
RUN cd mfe-payments && npm ci

COPY shared-ui ./shared-ui
COPY mfe-payments ./mfe-payments

RUN cd shared-ui && npm run build

WORKDIR /app/mfe-payments
RUN npm run build

FROM nginx:alpine AS serve
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/mfe-payments/dist/mfe-payments /usr/share/nginx/html
COPY mfe-payments/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
