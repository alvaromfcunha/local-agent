# Local Agent

A local document-based context Question and Answer multi-agent manager powered by Ollama running llama3.1 on Nvidia CUDA.

## Requirements:

-   Node 20.x
-   Docker
-   Nvidia GPU (optional)

## How to Run:

-   Install deps:

```bash
npm i
```

-   Build application:

```bash
npm run build
```

-   Run docker compose services:

```bash
sudo docker compose up -d
```

-   Apply database migrations:

```bash
npm run migrations
```

_To run Ollama on Nvidia CUDA [follow this instructions](https://hub.docker.com/r/ollama/ollama)._

-   Pull llama3.1 on Ollama container:

```bash
sudo docker exec -it <ollama-container-id> /bin/bash
ollama pull llama3.1
```

-   Run application:

```bash
npm run start
```
