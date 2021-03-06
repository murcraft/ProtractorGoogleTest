FROM perch1234/e2e-chrome-base:latest
#perch1234/e2e-chrome-builder:latest

ENV WORKDIR=/tests
ENV PATH=${WORKDIR}/node_modules/.bin:$PATH

RUN mkdir ${WORKDIR}
COPY . ${WORKDIR}
WORKDIR ${WORKDIR}
RUN mkdir allure-results
RUN chmod -R a=rwx ${WORKDIR}

USER node

RUN npm install --no-optional --progress=false && \
    npm cache clean --force && \
    rm -rf ~/.node-gyp

RUN env

RUN webdriver-manager update --gecko=false --versions.chrome=${CHROME_DRIVER} --versions.standalone=3.4.0