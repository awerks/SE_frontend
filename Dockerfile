FROM nginx:alpine
WORKDIR /usr/src/app
COPY public/ public/
COPY default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]