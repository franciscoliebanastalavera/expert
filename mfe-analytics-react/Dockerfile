FROM node:20-alpine AS build
WORKDIR /app

COPY mfe-analytics-react/package*.json ./mfe-analytics-react/

RUN cd mfe-analytics-react && npm ci

COPY shared-ui ./shared-ui
COPY mfe-analytics-react ./mfe-analytics-react

WORKDIR /app/mfe-analytics-react
RUN npm run build

FROM nginx:alpine AS serve
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/mfe-analytics-react/dist /usr/share/nginx/html
COPY mfe-analytics-react/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
