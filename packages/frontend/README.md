# Pennypost Frontend

This package contains the UI/UX components for the Pennypost project. We use
Vue.js as the frontend framework and Tailwind CSS for styling. The project is
also setup for Server Side Rendering (SSR) without relying on frameworks.

We use the [Vite](https://vitejs.dev/) build tool to build the frontend. 

## Getting Started

To get started, you can run the following commands:

```bash
cd ~/pennypost/
make install
make dev
```

This will install the dependencies and start the development server. You can
then access the frontend at `http://localhost:3000`.

You will likely need to adjust the `src/config.ts` file.

## Development

The frontend is initially rendered on the server and then rehydrated on the
client. This allows for faster load times and better SEO.

The entry point from the server is the `renderer.ts` file. The client side entry
is in the `src/main.ts` file.

## Production Build

To build the frontend for production, you can run the following command:

```bash
cd ~/pennypost/
make gen-frontend
```

Additionally, you can run the following command to start the production server:

```bash
cd ~/pennypost/
make run-local
```

This will start the server on `http://localhost:8080` behind a nginx reverse
proxy. The server itself will be running on port `3000` but will not be
accessible from the outside.

## Getting Help

If you have any questions or need help integrating Code into your website or
application, please reach out to us on [Discord](https://discord.gg/T8Tpj8DBFp)
or [Twitter](https://twitter.com/getcode).
