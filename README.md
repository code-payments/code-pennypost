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

To run Pennypost locally, you will need to have the following dependencies:

* [Docker](https://docs.docker.com/get-docker/)
* [Node.js](https://nodejs.org/en/download/)
* [Bun.js](https://bun.sh/)

Additionally, you will need a postgres database running somewhere. You can use
the following command to start a postgres database using docker:

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

To run Pennypost, use the following commands:

```bash
make install
make dev
```

## Deployment

To deploy Pennypost, you will need to compile the frontend assets and optionally
build a docker image containing everything. You can do all of this by running
the following command:

```bash
make build
```

Then you can run the docker image you've just created using the following
command:

```bash
make run-local
```

Additionally, you'll need your own `verifier key`. This is a private key value.
This key is used to sign the payment requests that are sent to the Code
services. It allows us to verify that you actually own the domain name from
where the request is coming from. 

This codebase ships with the `example-getcode.com` verifier key. You should
replace this key with your own key once you have a domain name and have the
ability to host a json file at
`https://example.com/.well-known/code-payments.json`. This codebase will
automatically do this for you. 

**Important:** The `https` is required for security reasons, so make sure you have
an SSL certificate installed on your server. Additionally, subdomains are not
supported.

You can generate a `verifier key` by running the following command:

```bash
make verifier-key
```

## Getting Help

If you have any questions or need help integrating Code into your website or
application, please reach out to us on [Discord](https://discord.gg/T8Tpj8DBFp)
or [Twitter](https://twitter.com/getcode).

##  Contributing

For now the best way to contribute is to share feedback on
[Discord](https://discord.gg/T8Tpj8DBFp). This will evolve as we continue to
build out the platform and open up more ways to contribute. 
