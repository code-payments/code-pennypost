# Pennypost Backend

This package contains the glue between the database, the Code SDK, and the
frontend for the Pennypost project.

It is responsible for handling the business logic of the application, including
creating and managing posts, users, auth, and payments. It also interacts with
the Code SDK to handle payments and login.

## Getting Started

To get started, you will need to have a postgres database running locally. You
can use the following command to start a postgres database using docker:

```bash
docker run --name my-postgres -e POSTGRES_PASSWORD=mysecretpassword -p 5432:5432 -d postgres
```

Before you run the project, you will need to create a `.env` file. You can copy the
[example.env](https://github.com/code-payments/code-pennypost/blob/main/packages/backend/example.env)
file and fill in the necessary values.

```bash
cp example.env .env
```

To run the backend in development mode, run the following command:

```bash
cd ~/pennypost
make dev
```

You'll see something like the following:

```bash
Server running at:

  > Network: http://localhost:3000


Environment:

    prod: false
    hostname: example-getcode.com
    port: 3000
    base: /app/
    storeCurrency: usd
    storeVerifier: 5TSdPcPLe9CovF5ZK8gfv1kmSpHc9GuWkaDUK2sqC33X
    defaultCost: 0.25
    codeSequencerPublicKey: codeHy87wGD5oMRLG75qKqsSi1vWE3oxNyYmXo5F9YR

```

## Development

The backend is written in TypeScript and uses the [Express](https://expressjs.com/)
framework for handling HTTP requests. The entry point of the backend is the
`src/server.ts` file.

The backend interacts with the database using the [Prisma](https://www.prisma.io/)
ORM. The database schema is defined in the `../database/prisma/schema.prisma` file.

The frontend communicates with the backend using a binary network protocol defined
in the `../api/proto/network.proto` file. The protocol is compiled into TypeScript
source files using the `npm run gen` command in the `../api` package.

The API is both binary and typesafe. The API is defined in the `src/service.ts`
and routes are defined in the `src/routes` folder.

## Getting Help

If you have any questions or need help integrating Code into your website or
application, please reach out to us on [Discord](https://discord.gg/T8Tpj8DBFp)
or [Twitter](https://twitter.com/getcode).
