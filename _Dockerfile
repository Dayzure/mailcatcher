FROM node:alpine
COPY server/ /server
RUN cd /server \
    && npm install
EXPOSE 25
CMD ["node", "/server/server.js"]