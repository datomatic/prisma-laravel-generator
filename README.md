# Prisma Laravel Generator
> [Prisma](https://www.prisma.io) Generator for [Laravel](https://laravel.com) 

Install prisma and prisma-laravel-generator with the following commands:

```
sail npm install prisma --save-dev
sail npm install prisma-laravel-generator --save-dev
```

If you're using Sail, add to your `docker-compose.yml` this volume to your mysql image:
```
    mysql:
        image: 'mysql/mysql-server:8.0'
        ...
        volumes:
            ...
            - './database/create-prisma-database.sh:/docker-entrypoint-initdb.d/11-create-prisma-database.sh'
        ...
```

Then stop, if it's running, your sail instance (by executing `sail down` or CTRL+C if your in attached mode), and run: 
```
docker rm -v <your_mysql_container_name>
```
Start docker again with `sail up`.

If your database was already initialized, execute the following commands:
```
docker exec -it <your_mysql_container_name> /bin/bash
./docker-entrypoint-initdb.d/11-create-prisma-database.sh
```

If you're not using Sail, you have to manually create two databases, one for keeping track of laravel's migrations and one for Prisma (see [Shadow Database](https://www.prisma.io/docs/concepts/components/prisma-migrate/shadow-database)).

Set the following environment variables:
```
DB_SHADOW_DATABASE=prisma_shadow
DB_MIGRATIONS_DATABASE=migrations
DB_URL="${DB_CONNECTION}://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}"
DB_SHADOW_URL="${DB_CONNECTION}://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_SHADOW_DATABASE}"
```

If you're not using the default setup, remember to set the database connection accordingly to your setup.
The two variables `DB_URL` and `DB_SHADOW_URL` are going to be used in the `schema.prisma` file.

If you prefer to have more control over the connection, you can set additional environment variables or set all connection settings by yourself by changing the config: see `config\prisma.php` for reference.  

Create `prisma` folder, put `schema.prisma`, set `generator` and `datasource` sections as following:
```
generator laravel_generator {
  provider = "node node_modules/prisma-laravel-generator"
  output   = "../"
}

datasource db {
  provider          = "mysql"
  url               = env("DB_URL")
  shadowDatabaseUrl = env("DB_SHADOW_URL")
}
```

```
sail npx prisma db pull
sail npx prisma migrate dev --name initial_migration
```

Press `y` to reset the database.

If your application is already in production, you should execute the following command in your production environment in order to ignore the migration (since you should already have a pre-existing database aligned to that migration):
```
sail npx prisma migrate resolve --applied ****_initial_migration
```
see [Baselining @prisma.io](https://www.prisma.io/docs/guides/database/developing-with-prisma-migrate/baselining) for more details.

Finally, execute the following command to generate the models
```
sail npx prisma generate
```


# If you have to execute a laravel migration
Migrate from laravel as normal
```
sail artisan migrate
```
This will trigger also an update to your schema. 

If you want, you can still execute a prisma pull manually via the command:
```
prisma db pull
```


TODO:
carbon immutable? scegliere bene quando usarlo
created_at e updated_at di default come created e updated
enum permettere di settare trait 
composer 
