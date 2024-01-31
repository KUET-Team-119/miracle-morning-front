# 빌드 스테이지
FROM node:20-alpine as builder

WORKDIR /miracle-morning-front

COPY package.json .
RUN npm install

COPY . .
RUN npm run build

# 실행 스테이지
FROM nginx:latest

# 기본 nginx 설정 파일 삭제 (custom 설정과 충돌 방지)
RUN rm /etc/nginx/conf.d/default.conf
RUN rm -rf /etc/nginx/conf.d/*

# custom 설정 파일을 컨테이너 내부로 복사
COPY ./nginx.conf etc/nginx/conf.d/

# 빌드 스테이지에서 빌드된 애플리케이션 파일을 복사
COPY --from=builder /miracle-morning-front/build /usr/share/nginx/html

# 컨테이너 80 포트 개방
EXPOSE 80

# 백그라운드에서 nginx 실행 (Docker 컨테이너 시작 시 자동 실행)
CMD ["nginx", "-g", "daemon off;"]
