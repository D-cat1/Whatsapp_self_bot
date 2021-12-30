FROM ubuntu:latest

RUN apt update && apt upgrade -y
RUN apt install curl ffmpeg git -y
RUN curl -sL https://deb.nodesource.com/setup_15.x | sudo -E bash -
RUN git clone https://github.com/D-cat1/Whatsapp_self_bot.git /WAselfbot
RUN git remote add origin https://github.com/D-cat1/Whatsapp_self_bot.git
WORKDIR /WAselfbot
ENV TZ=Asia/Jakarta

RUN npm install


CMD ["npm", "start"]
