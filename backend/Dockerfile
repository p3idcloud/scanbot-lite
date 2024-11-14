FROM node:18

WORKDIR /usr/src/app
COPY . .
RUN apt-get update
RUN apt-get -y install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev
RUN npm install

EXPOSE 8000

CMD [ "npm", "run" , "start" ]
