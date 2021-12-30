FROM archlinux:latest

RUN pacman -Sy nodejs npm git ffmpeg
RUN git clone https://github.com/D-cat1/Whatsapp_self_bot.git /WAselfbot
RUN git remote add origin https://github.com/D-cat1/Whatsapp_self_bot.git
WORKDIR /WAselfbot
ENV TZ=Asia/Jakarta

RUN npm install


CMD ["npm", "start"]
