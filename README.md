# Pennypost
![license][license-image]
![version][version-image]

[version-image]: https://img.shields.io/badge/version-0.1.0-blue.svg?style=flat
[license-image]: https://img.shields.io/badge/license-MIT-blue.svg?style=flat

This repository contains the starter code for running your own version of Pennypost — a simple writing tool that empowers any writer to add a $0.25 paywall to their content using the Code SDK and app.

Pennypost is intentionally simple. There were a lot of features we decided to leave out in order to make it easier to use as a foundation. We hope that this project will inspire the community to build new ways for content creators to monetize their work.

##  What is Code?

[Code](https://getcode.com) is a mobile app that leverages self custodial 
blockchain technology to deliver a seamless payments experience that is instant, 
global, and private. 

## Development
The codebase is split into the following packages:

* [api](https://github.com/code-payments/code-pennypost/tree/main/packages/api) - The binary network protocol between the frontend and backend
* [database](https://github.com/code-payments/code-pennypost/tree/main/packages/database) - The database schema, models, and queries
* [backend](https://github.com/code-payments/code-pennypost/tree/main/packages/backend) - The glue between the database, the Code SDK, and the frontend
* [frontend](https://github.com/code-payments/code-pennypost/tree/main/packages/frontend) - The UI/UX components live here

The project itself is designed so that you can replace any of
the packages with your own implementation and language if you'd like.

## Quick Start

You will need a postgres database running locally. You can use the following
command to start a postgres database using docker:

```bash
docker run --name my-postgres -e POSTGRES_PASSWORD=mysecretpassword -p 5432:5432 -d postgres
```

Before you run the project, you will need to create a `.env` file in the
`backend` directory. You can copy the
[example.env](https://github.com/code-payments/code-pennypost/blob/main/packages/backend/example.env)
file and fill in the necessary values.

```bash
cp backend/example.env backend/.env
```

To run Pennypost, use the following command:

```bash
make install
make dev
```

## Getting Help

If you have any questions or need help integrating Code into your website or
application, please reach out to us on [Discord](https://discord.gg/T8Tpj8DBFp)
or [Twitter](https://twitter.com/getcode).

##  Contributing

For now the best way to contribute is to share feedback on
[Discord](https://discord.gg/T8Tpj8DBFp). This will evolve as we continue to
build out the platform and open up more ways to contribute. 
