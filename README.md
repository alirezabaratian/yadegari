# Yadegari

A simple full-stack Node.js app for writing memos

## Run

### From Source

- Install Node.js, npm and MongoDB on your machine
- Clone the repo
- Install dependencies with npm
- Define you own environment variables
- Run

### Docker

- You will still need MongoDB installed
- Download the .env.sample file and rename it to .env (provide your own values)
- Run the command bellow:

```bash
docker run -d --name yadegari --restart always --network host --env-file .env alirezabtn/yadegari:latest
```

### Docker Compose

- Download the .env.sample file and rename it to .env (provide correct values)
- Run this command:
```bash
docker compose up -d && docker compose logs -f app
```


## Issues

- Web address should be removed entirely and replaced with a solid mechanism
