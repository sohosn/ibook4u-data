FROM node:10

# Set a working directory
WORKDIR /usr/src/app

COPY ./dist/* .

# Install Node.js dependencies
RUN ls
RUN npm install --production

RUN cp /usr/share/zoneinfo/Asia/Singapore /etc/localtime
RUN echo "Asia/Singapore" > /etc/timezone

CMD [ "node", "server.js" ]
