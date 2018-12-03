#FROM perchwell/e2e-travis-base:latest
#
#ENV WORKDIR=/tests
#ENV PATH=${WORKDIR}/node_modules/.bin:$PATH
#
#RUN mkdir ${WORKDIR}
#COPY . ${WORKDIR}
#WORKDIR ${WORKDIR}
#RUN mkdir allure-results
#RUN chmod -R a=rwx ${WORKDIR}
#
#USER node
#
#RUN npm install --no-optional --progress=false && \
#    npm cache clean --force && \
#    rm -rf ~/.node-gyp
#
#RUN env
#
#RUN webdriver-manager update --gecko=false --versions.chrome=${CHROME_DRIVER} --versions.standalone=3.4.0

FROM node:10

RUN mkdir -p /home/node/app/node_moduled && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./
RUN npm install
COPY . .
COPY --chown=node:node . .

USER node
EXPOSE 8080

CMD ["npm", "test"]