# frontend

## Project Setup

Instead of using `pnpm`, you can use `npm` to install dependencies (but it's
[not recommended](https://pnpm.io/pnpm-vs-npm)).

```bash
$ pnpm install      # Install dependencies
$ pnpm dev --open   # Run the development server and open the browser (skip --open to not open the browser)
```

## Docker Image

You can build a production image using the following command:

```bash
$ docker build -t <tag> --build-arg API_URL=<api_url> .  # Build the image (run this command in the frontend directory)
```

Replace `<tag>` with the desired tag for the image and `<api_url>` with the URL of the API server.

For example: `docker build -t frontend:latest --build-arg API_URL=http://localhost:3000 .`
