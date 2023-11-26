docker pull yichiz5/searec

docker rm -f searec

docker network create network498

docker run -d \
    -p 80:80 \
    --name searec \
    --network network498 \
    yichiz5/searec

#optionally re-deploy database and delete all data

docker rm -f mongoDB

docker run -d \
    -p 21017:21017 \
    --name mongoDB \
    --network network498 \
    mongo