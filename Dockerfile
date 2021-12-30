FROM ubuntu:latest

ENV DEBIAN_FRONTEND=noninteractive
RUN apt update && apt upgrade -y
RUN apt install curl ffmpeg git -y
RUN curl -sL https://deb.nodesource.com/setup_17.x | bash -
RUN apt install nodejs -y
RUN git clone -b master https://github.com/D-cat1/Whatsapp_self_bot.git /WAselfbot
WORKDIR /WAselfbot
ENV TZ=Asia/Jakarta

RUN npm install


CMD ["npm", "start"]
