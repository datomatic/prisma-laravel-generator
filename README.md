# Prisma Laravel Generator
[Prisma](https://www.prisma.io) Generator for [Laravel](https://laravel.com)

---

# Initial configuration

In this section we're going to follow you in the setup of `prisma-laravel-generator` inside your Laravel project, which can be a brand-new project but also an already existing (and published) project.

**Please, follow the instructions carefully and make a backup of your code and your database before proceeding. We take no responsibility for any possible loss of data.**

## 1. Add dependencies

Install `prisma` and `prisma-laravel-generator` as Node dev-dependencies:

**With Laravel Sail:**
> sail npm install --save-dev prisma prisma-laravel-generator

**NPM:**
> npm install --save-dev prisma prisma-laravel-generator

**Yarn:**
> yarn add -D prisma prisma-laravel-generator

Add `laravel-prisma-bridge` package to your Composer dependencies:

**With Laravel Sail:**
> sail composer install laravel-prisma-bridge

**Without Laravel Sail:**
> composer install laravel-prisma-bridge

## 2. Set up a Shadow Database

To work, Prisma needs a [Shadow Database](https://www.prisma.io/docs/concepts/components/prisma-migrate/shadow-database), which is used internally as a temporary database. 

If you provide to Prisma a user with root privileges, Prisma will create the database by its own. 

Otherwise, you have to create a new database (eventually inside the same MySQL instance in which you're running your main database, but it can also be in an entirely different host). In terms of security, this second alternative is, obviously, more secure and preferable. 
Before proceeding, **create a new database** that will be used as the shadow database in the next steps. This is not covered by this readme since it's dependent on your environment, except if you're using Laravel Sail with the default mysql image.

### 2.1 With Laravel Sail and mysql/mysql-server:8.0
IMPORTANT: this section assumes that you're using `mysql/mysql-server:8.0` as an image, but you might use a different image and/or database. In that case, you have to manage the creation of the database by yourself.

MORE IMPORTANT: by following this section, you're going to delete your current database. All your data will be lost. Make a dump of your database before proceeding, and restore it when finished. 

If you're using Laravel Sail and its default MySQL image, in order to create a new database add to your `docker-compose.yml` this volume to your mysql image:
```yaml
    # ...
    <your_mysql_container_name>:
        image: 'mysql/mysql-server:8.0'
        # ...
        volumes:
            ...
            - './database/create-prisma-database.sh:/docker-entrypoint-initdb.d/11-create-prisma-database.sh'
        # ...
    # ...
```

Then stop, if it's running, your Sail instance (by executing `sail down` or CTRL+C if your in attached mode), and run:
> docker rm -v <your_mysql_container_name>

Replace <your_mysql_container_name> with your mysql container name (usually `mysql`).

In this way, we're deleting the previous volume (allocated disk space) in order to re-initialize it on the next start, executing the new script.

If the command fails because there isn't a volume with that specific name, execute `docker volume ls` and try to find the exact name of the volume of your container, and re-execute the command using the correct name.

Start docker again with `sail up`.

If you prefer, instead of doing this, you can add another container (using the same image of the main database container) that initializes another database, but this requires you to understand how Docker Compose works and how to set up the container, and it's not covered by this readme. 

## 3. Prisma Setup

When done, set the following variables to your Laravel `.env` file (follow the comments):
```bash
# You should already have these (otherwise add and set them properly):
DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=your_database
DB_USERNAME=username
DB_PASSWORD=*******

# Add and set these accordingly to your settings for the shadow database
DB_SHADOW_CONNECTION=mysql
DB_SHADOW_HOST=localhost
DB_SHADOW_PORT=3306
DB_SHADOW_DATABASE=your_shadow_database
DB_SHADOW_USERNAME=username
DB_SHADOW_PASSWORD=*******

# Add these:
DB_URL="${DB_CONNECTION}://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}"
DB_SHADOW_URL="${DB_SHADOW_CONNECTION}://${DB_SHADOW_USERNAME}:${DB_SHADOW_PASSWORD}@${DB_SHADOW_HOST}:${DB_SHADOW_PORT}/${DB_SHADOW_DATABASE}"
```

If you're using the same host and user for both your main database and your shadow database, you can skip some of the `DB_SHADOW_***` variables and use `DB_***` instead inside of `DB_SHADOW_URL`:
```bash
# You should already have these (otherwise add and set them properly):
DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=your_database
DB_USERNAME=username
DB_PASSWORD=*******

# Add and set this accordingly to your settings for the shadow database
DB_SHADOW_DATABASE=your_shadow_database

# Add these:
DB_URL="${DB_CONNECTION}://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}"
DB_SHADOW_URL="${DB_CONNECTION}://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_SHADOW_DATABASE}"
```

In fact, only the two variables `DB_URL` and `DB_SHADOW_URL` are going to be used, the other `DB_SHADOW_***` variables are used just to keep the configuration cleaner. 

Create a new `prisma` folder in the root of your Laravel project, create a `schema.prisma` file inside, and set the `generator` and `datasource` sections as following:
```prisma
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

You can change the generator settings as you prefer: see the [Generator Settings](#generator-settings) section to see all the available settings.

Set the provider of your datasource accordingly to your setup. See [Data Sources](https://www.prisma.io/docs/concepts/components/prisma-schema/data-sources) for more information about the datasource section.

## 4. Preparing your development database

It's important that you execute ALL of your Laravel migrations (also the ones that are executed for the initialization of the DB) after installing `laravel-prisma-bridge`.

So, you have to drop all the tables from your database: your database must be completely empty in order to execute all the migrations again.

But, before, you might like the idea to [make a dump of your data](#41-optional-dump-your-data).

### 4.1 (Optional) Dump your data
If your development database already has some data in it that you want to keep, make a dump of your data before dropping the tables. Otherwise, jump to the next section [Initial migration](#5-initial-migration-your-database-needs-to-be-completely-empty).

To make a dump of your data (without structure) in MySQL, you can execute the following command:

> mysqldump -u [user] -p [database-name] > dump.sql
 
If you're using a different type of database, you need to find how to make a dump of the data in your environment.

You're now ready to drop all the tables from your database.

### 4.2 Drop all tables

In MySQL the easiest way to drop all of your tables is to delete the database and recreate it:

```mysql
DROP DATABASE <database>;
CREATE DATABASE <database>;
```

Replace `<database>` with the name of your database.

If you're using a different database, you should find something similar appropriate for your environment.

## 5. Initial migration (your database needs to be completely EMPTY)

In order to execute all the initial Laravel migrations, execute the following command:

> php artisan migrate

Thanks to `laravel-prisma-bridge`, this command will now:
1. Create the migrations files compatible with Prisma inside your `prisma/migrations` folder;
2. Execute them via Prisma;
3. Log inside the Laravel `migrations` table the fact that the migration was applied;
4. Sync your `schema.prisma` with the new changes;
5. Generate updated Laravel models;

## 6. (Optional) Restore your database

If you previously created a dump of your database, you can now restore it.

In MySQL, you can use the command:
> mysql -u [user] -p [database] < dump.sql

Take attention that this operation **must not** delete the `_prisma_migrations` table that Prisma created in the previous step.

If you've manually performed some changes in your db in the past (outside of Laravel migrations), after restoring the dump you have to baseline your database. Otherwise, jump to the next section [Baselining your production environment](#7-optional-baselining-your-production-environment).

To baseline your database, execute the following commands in order to create a new migration and then ignore it (since your database is already aligned to that migration):

**With Laravel Sail:**
```bash
sail npx prisma db pull
sail npx prisma migrate dev --name initial_migration --create-only
sail npx prisma migrate resolve --applied ***_initial_migration
```

**Without Laravel Sail:**
```bash
npx prisma db pull
npx prisma migrate dev --name initial_migration --create-only
npx prisma migrate resolve --applied ***_initial_migration
```

Replace `***_initial_migration` with the name of the migration that Prisma creates (replace `***` with the timestamp).

For more information about what is happening, see [Baselining a database](https://www.prisma.io/docs/guides/database/developing-with-prisma-migrate/baselining).

## 7. (Optional) Baselining your production environment

If you already have a production environment, in order to avoid any data loss you have to set all the migrations that we've just created as already applied: we don't need to execute them, since we did not change (yet) the structure of the database from before.

Obviously, if your production database has some manual changes (outside of Laravel and Prisma migrations), you should first make some migrations in your development environment to align the structure of your development database as your production database before proceeding.

Then, assuming that your database has exactly the same structure of your development database, you have to bring the `prisma` folder with all its migrations to it (make a commit, or do whatever you're usually doing to bring updates to your production environment). 

You have then to execute the following command in the root of your Laravel project in order to resolve as applied all Prisma migrations:

**With Laravel Sail:**
> find prisma/migrations -maxdepth 1 -mindepth 1 -type d -print0 | xargs -0 basename -a | xargs -I {} bash -c 'vendor/bin/sail npx prisma migrate resolve --applied "{}"'

**Without Laravel Sail:**
> find prisma/migrations -maxdepth 1 -mindepth 1 -type d -print0 | xargs -0 basename -a | xargs -I {} bash -c 'npx prisma migrate resolve --applied "{}"'

In this way, we're telling Prisma that all the migrations found in `prisma/migrations` are already applied.

If the command (tested on macOS 12.2.1 with zsh 5.8) does not work in your environment, you should write your own command that takes every migration in your `prisma/migrations` folder and execute the following command:
> npx prisma migrate resolve --applied [migration-name]

(or you can do it manually instead of writing a command)

For more information about what is happening, see [Baselining a database](https://www.prisma.io/docs/guides/database/developing-with-prisma-migrate/baselining).

## 8. Done!
You can now play with your `schema.prisma` file and use Prisma as you would in a javascript project. See the [Usage](#usage) section for more details. 

# Usage

In this section we're going to see some common stuff regarding the integration of Prisma inside of Laravel. 

This readme don't cover how to use Prisma, we suggest you to read the [official documentation](https://www.prisma.io/docs/concepts).

## Make a Prisma migration

See Prisma documentation:
- [Prisma Migrate](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [Prototyping](https://www.prisma.io/docs/guides/database/prototyping-schema-db-push)

## Generate the models

Thanks to `prisma-laravel-generator`, Prisma will generate corresponding models to your tables. See [Schema Configuration](#schema-configuration) to see how to influence the generated models directly from your `schema.prisma`. 

The generated models are filled with PHPDoc, relation methods, casts, validation rules, etc., and are ready-to-use. 
By default, the models are generated inside your `./app/Models/Prisma` folder, and prefixed by `Prisma` in their name.
The models are stored as abstract classes, and in your `./app/Models` folder you'll find other models without `Prisma` prefix, that inherits from them.

You should never touch the models in your `./app/Models/Prisma` folder! Those files are recreated at every generation and any manual change will be lost. If you need to add some methods, properties, etc., change the model in your `./app/Models`, which will not be edited ever again by `prisma-laravel-generator`.

Differently, enums are **not** generated as "abstract", since in PHP there is no abstraction in enums and there is no inheritance either. Even if they don't have `Prisma*` prefix in their names, you should not make changes to the enums, since they're going to be re-generated entirely.

The folders in which the models are created, and how to manipulate the generated model, is further explained in the [Schema Configuration](#schema-configuration) section.

## Update the generated models

- After a `(php|sail) artisan migrate` command (Laravel migration), Prisma will update automatically your models;
- After a `(sail) npx prisma migrate dev` command, Prisma will update automatically your models (except if you're using `--skip-generate`);
- After a `(sail) npx prisma db push` command, Prisma will update automatically your models (except if you're using `--skip-generate`);

So, in general, you should never need to update manually your models. But, if you need it, you can execute:

**With Laravel Sail:**
> sail npx prisma generate

**Without Laravel Sail:**
> npx prisma generate

## Execute a Laravel migration

In order to execute Laravel migrations, execute the following command:

**With Laravel Sail:**
> sail artisan migrate

**Without Laravel Sail:**
> php artisan migrate

Thanks to `laravel-prisma-bridge`, this command will now:
1. Create the migrations files compatible with Prisma inside your `prisma/migrations` folder;
2. Execute them via Prisma;
3. Log inside the Laravel `migrations` table the fact that the migration was applied;
4. Sync your `schema.prisma` with the new changes;
5. Generate updated Laravel models;

You can also roll back a Laravel migration with:

**With Laravel Sail:**
> sail artisan migrate:rollback

**Without Laravel Sail:**
> php artisan migrate:rollback

In fact, all the `artisan migrate:*` commands are available and integrated with Prisma.

**BUT, there is a limit to it**: Laravel's migrations should be only used to alter the structure of the tables, NOT to alter the data. When generating the .sql files compatible with Prisma starting from a Laravel migration, just the structural changes are converted.  

If you need to alter the data (e.g., you were using Eloquent to do some changes in a migration), you have to find some alternative ways (create an artisan command to migrate the data, or [customize Prisma migration](https://www.prisma.io/docs/guides/database/developing-with-prisma-migrate/customizing-migrations) to add some manipulations using raw SQL, ...).

## Squashing migrations

It is sometimes useful to squash either some or all migration files into a single migration. See [Squashing migrations](https://www.prisma.io/docs/guides/database/developing-with-prisma-migrate/squashing-migrations) for more information.

# Schema configuration

In this section we're going to see how to affect the generated models and the available configurations for the generator. 

## Generator settings
| Req. | Name                 | Description                                                                                                                                                                                                                                                                                                                                                                    | Default                                              |
|------|----------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------|
| YES  | provider             | The generator path. Generally, you don't have to change that.                                                                                                                                                                                                                                                                                                                  | `"node node_modules/prisma-laravel-generator"`       |
| YES  | output               | The path to the root of your Laravel project. Can be relative (starting from the `prisma` folder in your project) or absolute. Generally, you don't have to change that.                                                                                                                                                                                                       | `"../"`                                              |
|      | prismaModelsPath     | Path of the generated `Prisma*` abstract models, starting from the root of your Laravel project. WARNING: This folder will be emptied when the generator runs, so you should set it as a dedicated folder for generated Models.                                                                                                                                                | `"./app/Models/Prisma"`                              |
|      | prismaModelsPrefix   | The prefix used for the generated abstract models                                                                                                                                                                                                                                                                                                                              | `"Prisma"`                                           |
|      | prismaEnumsPath      | Path of the generated `Prisma*` enums, starting from the root of your Laravel project. WARNING: This folder will be emptied when the generator runs, so you should set it as a dedicated folder for generated Enums.                                                                                                                                                           | `"./app/Enums/Prisma"`                               |
|      | modelsPath           | Path of the one-time generated models (the one that inherits from the generated `Prisma*` models which you should use and you are free to change), starting from the root of your Laravel project. If `false`, those models will not be generated.                                                                                                                             | `"./app/Models"`                                     |
|      | baseModel            | FQCN of the class that all the models inherit from                                                                                                                                                                                                                                                                                                                             | `"Illuminate\\Database\\Eloquent\\Model"`            |
|      | basePivotModel       | FQCN of the class that all the generated pivots inherit from                                                                                                                                                                                                                                                                                                                   | `"Illuminate\\Database\\Eloquent\\Relations\\Pivot"` |
|      | phpCsFixerBinPath    | Path of PHPCSFixer, starting from the root of your Laravel project (usually, `"./vendor/bin/php-cs-fixer"`). If provided, the generated models will be formatted by PHPCSFixer to align the code style of the generated models to the rest of your project. If not assigned, the models will be formatted using [Prettier PHP Plugin](https://github.com/prettier/plugin-php). | `undefined`                                          |
|      | phpCsFixerConfigPath | Path of PHPCSFixer config file, starting from the root of your Laravel project (usually, `"./.php-cs.dist.php"`). Used if a valid `phpCsFixerBinPath` is provided.                                                                                                                                                                                                             | `undefined`                                          |

## Annotations
There are several annotations that you can add in your schema file to fine tune the generated models and enums. Some annotations are related to an entire model or enum, while others are specific to a field.
In general, all the generator-specific annotations are defined starting by three slashes, i.e. `<target> \\\ annotation`. 

You can add set multiple annotations to the same target by separating them via comma, i.e., `<target> \\\ annotation, another, more`, or by separating them in different rows:
```
\\\ annotation
\\\ another
\\\ more
<target>
```

Annotations are case-insensitive. Some annotations are alias of some other attributes available in Prisma.

### Model annotations
In models, you can use the following annotations. In this list, we're also covering some of the most important Prisma attributes (the ones that start with `@`). To better understand how to manage models in Prisma and to check all the available attributes in Prisma, look at the [official documentation](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference#model).

#### Map: `@@map`
Define the name of the table in the database. The model will still use the name of the model.

```prisma
model Example {
  id Int @id
  
  @@map("example_table")
}
```

#### Unique: `@@unique`
If you need to set some unique rules that considers multiple columns, you can use this attribute.

```prisma
model Example {
  id        Int    @id @default(autoincrement())
  firstname String
  lastname  String

  @@unique([firstname, lastname])
}
```

#### Ignore: `@@ignore`
If you need to skip the generation of a model for a specific table, use this attribute

```prisma
model Example {
  id Int @id @default(autoincrement())
  
  @@ignore()
}
```

#### Mass assignable: `mass-assignable`
Set the model fields as mass-assignable.

```prisma
/// mass-assignable
model Example {
  id Int @id @default(autoincrement())
}
```

#### Traits: `trait:FQCN/ClassName`
Adds a specific trait to the model.

```prisma
/// trait:App/Traits/ModelTrait
model Example {
  id Int @id @default(autoincrement())
}
```

#### Extends: `extends:FQCN/ClassName`
Set which class should the model extends. Only one `extends:*` can be applied per model (no multiple inheritance is allowed in PHP).  

```prisma
/// extends:App/Models/CustomModel
model Example {
  id Int @id @default(autoincrement())
}
```

#### Implements: `implements:FQCN/ClassName`
Set which interfaces should the model implement.  

```prisma
/// implements:App/Contracts/CustomInterface
model Example {
  id Int @id @default(autoincrement())
}
```

#### Pivot: `pivot`
In explicit many-to-many relations, you should annotate the pivot model with `pivot`.

```prisma
/// pivot
model Example {
  id   Int  @id @default(autoincrement())
  A_id Int
  A    A    @relation(fields: [A_id], references: [id])
  B_id Int
  B    B    @relation(fields: [B_id], references: [id])
}
```

### Field annotations

There are several annotations available for fields. In this list, we're also covering some of the most important Prisma attributes (the ones that start with `@`). To better understand how to manage fields in Prisma and to check all the available attributes in Prisma, look at the [official documentation](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference#model-fields).

#### ID: `@id`
Use the field as primary key.

```prisma
model Example {
  id Int @id
}
```

#### Default value: `@default()`
Set the default value of the field. This will be set both as database default value but also in laravel `$attributes` property.

```prisma
model Example {
  id    Int     @id @default(autoincrement())
  age   Int     @default(18)
  uuid  String  @default(uuid())
  now   String  @default(now())
}
```

#### Unique: `@unique`
Use the field as unique. Appropriate validation rules will be created.

```prisma
model Example {
  email String @unique
}
```

#### Ignore: `@ignore`
If you need to ignore some attributes in the generated model, use this annotation.

```prisma
model Example {
  id      Int    @id @default(autoincrement())
  interal String @ignore
}
```

#### Map: `@map`
Currently, mapping a field name to a column with a different name is not allowed in Laravel, except for the primary key.

If you try to add `@map` to a field that is not the primary key of the model, the generator will throw an error.

```prisma
model Example {
  id Int  @id @default(autoincrement()) @map("primary_id")
}
```

#### Timestamps: `created_at` and `updated_at`
By default, if your field's name is `created_at` or `updated_at`, you don't need to add these annotations.

If you define a `created_at`, you have to define also an `updated_at` field (and vice-versa).

You might use `@updatedAt` instead of `/// updated_at`, if you prefer.

```prisma
model Example {
  id                Int      @id @default(autoincrement())
  created_timestamp DateTime /// created_at
  updated_timestamp DateTime /// updated_at
}
```

#### Soft delete: `deleted_at`
By default, if your field's name is exactly `deleted_at`, you don't need to add this annotation. 

When `deleted_at` is defined, the model will automatically implement the `SoftDelete` trait.

```prisma
model Example {
  id                Int      @id @default(autoincrement())
  deleted_timestamp DateTime /// deleted_at
}
```

#### Guarded: `guarded`
Add the field to the model's `$guarded` attribute. Can't be used together with `fillable`.

```prisma
model Example {
  id       Int     @id @default(autoincrement())
  email    String  /// guarded
}
```

#### Fillable: `fillable`
Add the field to the model's `$fillable` attribute. Can't be used together with `guarded`.

```prisma
model Example {
  id       Int     @id @default(autoincrement())
  name     String  /// fillable
}
```

#### Hidden: `hidden`
Add the field to the model's `$hidden` attribute. Can't be used together with `visible`.

```prisma
model Example {
  id          Int     @id @default(autoincrement())
  password    String  /// hidden
}
```

#### Visible: `visible`
Add the field to the model's `$visible` attribute. Can't be used together with `hidden`.

```prisma
model Example {
  id       Int     @id @default(autoincrement())
  email    String  /// visible
}
```

#### Read only: `read-only`
Set the field as read-only (via PHPDocs). If the field is a DateTime, instead of a `Carbon` instance, it will be casted to `CarbonImmutable`.

```prisma
model Example {
  id       Int     @id @default(autoincrement())
  email    String /// read-only
}
```

#### Eager-loaded: `eager-loaded`
Add the relation to the model's `$with` attribute, in order to perform eager-loading.

```prisma
model Example {
  id      Int         @id @default(autoincrement())
  related OtherModel? /// eager-loaded
}
```

#### Touching: `touch`
Add the relation to the model's `$touches` attribute, in order to update the timestamps of the related model on model changes.

```prisma
model Example {
  id      Int         @id @default(autoincrement())
  related OtherModel? /// touch
}
```

### Enum annotations
Both Backed and Pure enums are compatible. To better understand how to manage enums in Prisma, look at the [official documentation](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference#enum).

```prisma
enum Role {
  USER
  ADMIN
}

enum PostType {
  article  @map("1")
  release  @map("2")
  news     @map("3")
  event    @map("4")
}
```

#### Traits: `trait:FQCN/ClassName`
Adds a specific trait to the enum.

```prisma
/// trait:App/Traits/RoleEnumTrait
enum Enum {
  A
  B
}
```

### Relations
Here you can find some examples on how to define different type of relations. If you need more information about what is happening, look at the [official documentation](https://www.prisma.io/docs/concepts/components/prisma-schema/relations).

Polymorphic relations are not implemented yet. In the meanwhile, you can define the columns in your schema, and define the polymorphic relationship manually in the model.

#### One-To-One

```prisma
model A {
  id        Int  @id @default(autoincrement())
  related   B?
}

model B {
  id        Int  @id @default(autoincrement())
  relatedId Int  @unique
  related   A    @relation(fields: [relatedId], references: [id])
}
```

#### Self-relation
You need to define a relation name to avoid ambiguities. See the [official documentation](https://www.prisma.io/docs/concepts/components/prisma-schema/relations/self-relations) for more details. 
```prisma
model Example {
  id        Int      @id @default(autoincrement())
  relatedId Int      @unique
  parent    Example  @relation("relation_name", fields: [relatedId], references: [id])
  child     Example? @relation("relation_name")
}
```

#### One-To-Many

```prisma
model A {
  id            Int @id @default(autoincrement())
  related       B[]
}

model B {
  id            Int @id @default(autoincrement())
  relatedId     Int
  one_to_one_a2 A   @relation(fields: [relatedId], references: [id])
}
```

#### Many-To-Many

##### Implicit pivot

```prisma
model A {
  id      Int @id @default(autoincrement())
  related B[]
}

model B {
  id      Int @id @default(autoincrement())
  related A[]
}
```

##### Explicit pivot

```prisma
model A {
  id      Int     @id @default(autoincrement())
  related Pivot[]
}

/// pivot
model Pivot {
  id      Int     @id @default(autoincrement())
  A_id    Int
  A       A       @relation(fields: [A_id], references: [id])
  B_id    Int
  B       B       @relation(fields: [B_id], references: [id])
}

model B {
  id      Int     @id @default(autoincrement())
  related Pivot[]
}
```

# Not supported (yet?)
Some functionalities might not be supported: some are not supported by Prisma, others are not supported by Laravel, some are mis-understanding, and the remaining ones are going to be implemented in future versions! 

 * **Polymorphic relations: Not implemented yet! In the meanwhile, you can define the columns in your schema, and define the polymorphic relationship manually in the model**


 * Allow data alterations inside Laravel migrations: This is not possible. Laravel's migrations should be only used to alter the structure of the tables, NOT to alter the data. When generating the .sql files compatible with Prisma starting from a Laravel migration, just the structural changes are converted. If you need to alter the data (e.g., you were using Eloquent to do some changes in a migration), you have to find some alternative ways (create an artisan command to migrate the data, or [customize Prisma migration](https://www.prisma.io/docs/guides/database/developing-with-prisma-migrate/customizing-migrations) to add some manipulations using raw SQL, ...).
 * Composite primary keys: [Not supported by Laravel](https://laravel.com/docs/9.x/eloquent#composite-primary-keys)
 * created_at without updated_at (and vice-versa): [Not supported by Laravel](https://laravel.com/docs/9.x/eloquent#timestamps)
 * [cuid()](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference#cuid): Not supported natively by Laravel (you can use some external packages, but this is up to you)
 * Mapped fields (e.g., `firstName String @map("first_name")`): Laravel does not provide a way to map attributes to columns with different names
 * `fillable` and `guarded` fields at the same time: [Does not make sense in Laravel](https://laravel.com/docs/9.x/eloquent#mass-assignment)
 * `hidden` and `visible` fields at the same time: [Does not make sense in Laravel](https://laravel.com/docs/9.x/eloquent-serialization#hiding-attributes-from-json)
 * `mass-assignable` with `guarded` or `fillable` fields: `mass-assignable` annotation adds a `protected $guarded = [];` attribute to the model, so it does not make sense to define other fields as guarded or fillable.
 * Multiple data sources: [Not supported by Prisma](https://www.prisma.io/docs/concepts/components/prisma-schema/data-sources)
 
