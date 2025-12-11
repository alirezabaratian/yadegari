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
- Download the .env.sample file and rename it to .env
- Run the command bellow:

```bash
docker run -d --name yadegari --restart always --network host --env-file .env alirezabtn/yadegari:latest
```