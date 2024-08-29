FROM node:22-alpine AS front-builder
WORKDIR /app

COPY front-web/package.json .
COPY front-web/package-lock.json .

RUN npm install

COPY front-web .

RUN npm run build

FROM golang:1.23-alpine AS builder

COPY go.mod go.sum ./
RUN go mod download

COPY ./ ./

COPY --from=front-builder /app/out .

RUN CGO_ENABLED=0 GOOS=linux go build -o /bons-fluidos

FROM scratch AS final

ENV PORT=3000
ENV DATABASE_PATH=/app/bons-fluidos.db

COPY --from=builder bons-fluidos .
CMD ["/bons-fluidos"]
