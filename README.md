# Yadegari

A simple Node.js app for sharing memos at the end of the year

## Run

### From Source

- Install [Node.js](https://nodejs.org/en/download) and [MongoDB](https://www.mongodb.com/try/download/community) on your machine
- Clone the repository

```bash
git clone https://github.com/alirezabaratian/yadegari.git
```

- Install dependencies with npm

```bash
npm install
```

- Copy `.env.example` as `.env`

```bash
cp .env.example .env
```

- Define your variables in `env`
- Run

```bash
npm start
```

### Docker

*Make sure you have Docker installed on your machine. You can use [the official script](https://github.com/docker/docker-install) to install Docker.*

*At the moment, you also need to have a MongoDB server running.*

- Clone the repository

```bash
git clone https://github.com/alirezabaratian/yadegari.git
```

- Copy `.env.example` as `.env`

```bash
cp .env.example .env
```

- Define your variables in `env`
- Run

```bash
docker run --name yadegari --network host --env-file .env alirbara/yadegari:latest
```
