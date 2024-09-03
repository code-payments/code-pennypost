# Pennypost Database

This package contains the database schema, models, and queries for the Pennypost
project. 

We use [Prisma](https://www.prisma.io/) to interact with the database. Prisma is
an open-source database toolkit that makes it easy to access databases with type
safety and auto-completion.

## Getting Started

To get started, you will need to have a postgres database running locally. You
can use the following command to start a postgres database using docker:

```bash
docker run --name my-postgres -e POSTGRES_PASSWORD=mysecretpassword -p 5432:5432 -d postgres
```

Before you run the project, you will need to create a `.env` file in the
`backend` directory. You can copy the
[example.env](https://github.com/code-payments/code-pennypost/blob/main/packages/backend/example.env)
file and fill in the necessary values.

```bash
cd ~/pennypost/packages/backend
cp example.env .env
```

## Development

You can change the database schema by editing the `schema.prisma` file in the
`prisma` directory. After making changes to the schema, you can run the
following command to generate the Prisma client:

```bash
npm run db:format
npm run db:init
```

This will generate the Prisma client in the `node_modules/.prisma/client`
directory. You can use the Prisma client to interact with the database in your
code. 

Once you're ready to apply the changes to the database, you can run the
following command to create a migration file:

```bash
npm run db:create_migration
```

You can then apply the migration to the database by running:

```bash
npm run db:migrate
```

You can also view the current state of the database by running:

```bash
npm run db:studio
```

For more information on how to use Prisma, you can refer to the [Prisma
documentation](https://www.prisma.io/docs/).

## Getting Help

If you have any questions or need help integrating Code into your website or
application, please reach out to us on [Discord](https://discord.gg/T8Tpj8DBFp)
or [Twitter](https://twitter.com/getcode).