FROM node:20 as build

WORKDIR /app

COPY . .

RUN corepack enable
RUN pnpm i --frozen-lockfile
RUN pnpm build:image
RUN node --experimental-sea-config sea-config.json
RUN cp $(command -v node) wodaochu
RUN npx postject wodaochu NODE_SEA_BLOB wodaochu.blob \
--sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2

FROM ubuntu as runtime

COPY --from=build /app/wodaochu /app/wodaochu

ENTRYPOINT [ "/app/wodaochu" ]
