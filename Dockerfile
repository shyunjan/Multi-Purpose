FROM mongo:5.0.9 AS mongodb-image
LABEL maintainer="shyunjan@naver.com" version=2
WORKDIR D:/Projects/Multi-Purpose
# RUN cp /etc/mongod.conf.orig /etc/mongod.conf && chown mongodb:mongodb /etc/mongod.conf && chmod 600 /etc/mongod.conf
RUN cp /etc/mongod.conf.orig /etc/mongodb.conf && \
    chown mongodb:mongodb /etc/mongodb.conf && \
    chmod 600 /etc/mongodb.conf
# 원본 config 파일(/etc/mongod.conf.orig)의 dbPath:가 /var/lib/mongodb로 되어있어서 해당 디렉토리를 생성하고...
# RUN mkdir /var/lib/mongodb
# 위 디렉토리의 소유자를 mongodb로 수정해서 그대로 사용하든지...
# RUN chown -R mongodb:mongodb /var/lib/mongodb 
# 아니면 아래와 같이 dbPath:를 MongoDB 디폴트 디렉토리(/data/db)로 수정한다.
RUN sed -i "s|/var/lib/mongodb|/data/db|g" /etc/mongodb.conf && \
    sed -i "/security:/a\security.authorization: enabled" /etc/mongodb.conf
RUN apt-get update && apt-get install -y redis-server && \
    sed -i -e 's/^\(bind \)/#\1/g' -e '/^#bind/a\bind 0.0.0.0' /etc/redis/redis.conf
EXPOSE 6379 27017
# CMD service redis-server start && bash
# ENTRYPOINT ["redis-server", "/etc/redis/redis.conf", "&&", "docker-entrypoint.sh", "mongod", "-f", "/etc/mongodb.conf", "&&","bash"]
# 참고로 아래 라인과 같이 원본 MongoDB 이미지(mongo:5.0.9)의 docker-entrypoint.sh 스크립트가 MongoDB 데몬
# (mongod)을 파라미터로 받아서 시작하도록 되어있다. 파라미터를 주지 않으면 그냥 "mongod --auth..."를 실행시킨다.
ENTRYPOINT redis-server /etc/redis/redis.conf && docker-entrypoint.sh mongod -f /etc/mongodb.conf

# 아래처럼 복잡한 두 개의 원본 이미지를 Merge하는 것은 거의 불가능하다. 빌드가 끝나면 두 번째 이미지(redis)가 첫
# 번째 이미지를 덮어씌우기 때문이다. 만약 첫 번째 이미지의 필수 파일들이 단순하다면 아래 명령을 이용하여 두 번째 
# 이미지로 필요한 파일들을 옮길 수 있을 것이다. 참고로 남겨둔다.
# COPY --from=mongodb-image ... 
# FROM redis
# WORKDIR /
# COPY --from=mongodb-image /etc/mongodb.conf /etc