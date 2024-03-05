FROM ghcr.io/puppeteer/puppeteer:22.3.0

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /usr/src/app 

COPY packa*.json ./ 

RUN npm ci
COPY . .

CMD ["node", "server.js"]
