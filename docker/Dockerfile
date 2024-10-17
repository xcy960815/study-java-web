FROM nginx

LABEL maintainer=作者名

ARG PROJECT_DIR="vue3-lazyly-admin"

COPY --chown=nginx:nginx ${PROJECT_DIR} /usr/share/nginx/html
COPY /docker/default.conf /etc/nginx/conf.d/

WORKDIR /usr/share/nginx/html
