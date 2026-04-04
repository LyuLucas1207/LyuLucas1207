# syntax=docker/dockerfile:1
# 静态站点 + 同源 /api 反代。vite build --mode prod.local 读取 .env.prod.local（须随 COPY 进上下文；勿被 .dockerignore 排除）；覆盖见 --build-arg
# 运行：docker run --rm -p 10006:80 lsr-web:prod-local

FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM deps AS build
ARG VITE_API_URL
ARG VITE_WS_URL
ENV DOCKER_BUILD=1
COPY . .
RUN VITE_API_URL="${VITE_API_URL:-}" VITE_WS_URL="${VITE_WS_URL:-}" npm run build:prod-local

FROM nginx:1.27-alpine AS runner
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
