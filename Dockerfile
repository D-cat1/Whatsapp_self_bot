FROM ubuntu:latest

ENV DEBIAN_FRONTEND=noninteractive
ENV YOUTUBE_DL_SKIP_DOWNLOAD=true
RUN apt update && apt upgrade -y
RUN apt install curl ffmpeg wget build-essential libssl-dev libffi-dev python python3-pip git -y
RUN curl -sL https://deb.nodesource.com/setup_17.x | bash -
RUN apt install nodejs -y
RUN git clone -b master https://github.com/D-cat1/Whatsapp_self_bot.git /WAselfbot
WORKDIR /WAselfbot
RUN wget https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp && chmod +x yt-dlp
ENV TZ=Asia/Jakarta

RUN npm install


CMD ["npm", "start"]
