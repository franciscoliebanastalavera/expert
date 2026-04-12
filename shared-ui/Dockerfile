FROM node:20-alpine AS build
WORKDIR /app
ENV CI=true
ENV STORYBOOK_DISABLE_TELEMETRY=1

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build-storybook

FROM nginx:stable-alpine
COPY --from=build /app/storybook-static /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
