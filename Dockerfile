FROM mongo:latest

WORKDIR /api

COPY package.json ./
COPY yarn.lock ./

# use 'RUN' to execute commands in the container's bash terminal
# RUN apt-get update && apt-get upgrade -y && \
#     apt-get install -y nodejs \
#     apt-get install -y express \
#     npm      
RUN curl -o- -L https://yarnpkg.com/install.sh | bash -s -- --version 0.21.2
ENV PATH /root/.yarn/bin:$PATH

COPY . ./



# expose MongoDB's default port of 27017
EXPOSE 27017

CMD ["node", "./bin/www"]