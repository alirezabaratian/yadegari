# Yadegari
A simple full-stack Node.js app for writing memos

# Demo
There is a live demo [here](https://yadegari.alirezabaratian.ir)
## Run

### From Source
- Install Node.js, npm and MongoDB on your machine
- Clone the repo
- Install dependencies with npm
- Define you own environment variables
- Run

### Docker
- You should have MongoDB installed and running on your host.
- Install Docker
- Run

```shell

sudo docker run -d --name yadegari --network=host -e PORT=<port> -e WEB_ADDRESS=<http://yourdomain> alirezabar/yadegari:latest

```
