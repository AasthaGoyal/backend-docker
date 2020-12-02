FROM mongo:latest

WORKDIR /api

COPY package*.json /api/

# use 'RUN' to execute commands in the container's bash terminal
RUN apt-get update && apt-get upgrade -y && \
    apt-get install -y nodejs \
    npm      

COPY . /api/



# expose MongoDB's default port of 27017
EXPOSE 27017

CMD ["node", "/bin/www"]