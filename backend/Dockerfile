FROM golang:alpine as builder

ARG CGO_ENABLED=0
# Set destination for COPY
RUN apk add --no-cache ca-certificates openssl

ARG cert_location=/usr/local/share/ca-certificates
WORKDIR /app

# Download Go modules
COPY go.mod go.sum ./
RUN go mod download

# Copy the source code. Note the slash at the end, as explained in
# https://docs.docker.com/engine/reference/builder/#copy
COPY . .

# Build
RUN go build -o server

# Run
# CMD ["/irradiacao-api"]

FROM scratch
COPY --from=builder /app/server /server
COPY --from=builder /app/*.html /
COPY --from=builder /app/migrations/* /migrations/
COPY --from=builder /app/data.sql /
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
COPY --from=builder /usr/local/go/lib/time/zoneinfo.zip /
ENV ZONEINFO=/zoneinfo.zip
EXPOSE 8080
ENTRYPOINT ["/server"]