# 1.0.0 (2022-08-25)


### Bug Fixes

* add app folder on output location ([95f142e](https://github.com/datomatic/prisma-laravel-generator/commit/95f142ef00a93d2c8882c9c989dc9040ca212733))
* alias "as" case insensitive match ([0950fc5](https://github.com/datomatic/prisma-laravel-generator/commit/0950fc503eb35ab9c1a1b3b23f4c494fc20ab805))
* delete all files in prisma directory before generating new ones ([8e25cbe](https://github.com/datomatic/prisma-laravel-generator/commit/8e25cbe09a58a2403712addbcc74d1dcaf96a149))
* inverted nullable and required ([12095bf](https://github.com/datomatic/prisma-laravel-generator/commit/12095bf2b93b67751a5a49c160a10707eb685067))
* schema.prisma on example with corrected provider and phpcsfixer path ([be70528](https://github.com/datomatic/prisma-laravel-generator/commit/be7052846b9ec46585288a651c313546dca01df1))
* tests on windows ([7013776](https://github.com/datomatic/prisma-laravel-generator/commit/7013776cc544d734361752779438058b2dca4540))
* use always explicit column names and tables for relations (allows inheritance of models) ([2e7a716](https://github.com/datomatic/prisma-laravel-generator/commit/2e7a716b0e2bf039dfa7d271c2884062b4987db5))
* use backed enums also when mapping is not defined in the schema to match the db mapping ([f383a23](https://github.com/datomatic/prisma-laravel-generator/commit/f383a232181862dc9a253b1d4c130892a2739199))


### Features

* add "Prisma" prefix to generated models ([cc239f7](https://github.com/datomatic/prisma-laravel-generator/commit/cc239f70dff2f9b6efdf6a8f274ca5e8a19341ca))
* all settings available from schema ([ee628f2](https://github.com/datomatic/prisma-laravel-generator/commit/ee628f280b3dba49c9d7a8d15767fef627f895af))
* allow multiple separate comments for fields and models ([a60b76a](https://github.com/datomatic/prisma-laravel-generator/commit/a60b76ad441bd8847652f16d3f344f6577644624))
* carbonimmutable if datetime is readonly, implements and extends model annotations ([408d944](https://github.com/datomatic/prisma-laravel-generator/commit/408d9443e022de6d230a7e135ab248191dd28e4a))
* created_at, updated_at and deleted_at considered as read-only ([0383695](https://github.com/datomatic/prisma-laravel-generator/commit/0383695690083cde1a46ca64ff115cac26acd0eb))
* get attributes and comments from raw schema file ([c3fd8cc](https://github.com/datomatic/prisma-laravel-generator/commit/c3fd8cc4fc57522eb231131cf6b51cb311c424d9))
* id is read-only by default ([ff9fc67](https://github.com/datomatic/prisma-laravel-generator/commit/ff9fc677ad2d5f27875fcbd5e84275ae5eec4371))
* immutable_datetime only for read-only fields ([c650940](https://github.com/datomatic/prisma-laravel-generator/commit/c650940bdd5b89bf1b710d0b7b3224bad9f32ff2))
* inherited models generator ([28b13b1](https://github.com/datomatic/prisma-laravel-generator/commit/28b13b1549219b425cd42c6d84c5d470dffde0b0))
* model and enum export path annotation ([b818093](https://github.com/datomatic/prisma-laravel-generator/commit/b818093d3b83284c2b19b979ce685da4f81c9995))
* model generation (w/o relations), prettier before php-cs-fixer, raw schema analysis ([f5f9ea7](https://github.com/datomatic/prisma-laravel-generator/commit/f5f9ea72bb244f0baa38964fe0659c92a9c61d01))
* prisma 4 ([a4c16ef](https://github.com/datomatic/prisma-laravel-generator/commit/a4c16ef555187d62939fa3ffb2d4e33ac7c22a7a))
* prisma snake_cased models saved in singular ucwords format ([5d3df9b](https://github.com/datomatic/prisma-laravel-generator/commit/5d3df9b6c955464fa29215ca225be9834e89088d))
* project setup ([9d9b37e](https://github.com/datomatic/prisma-laravel-generator/commit/9d9b37e37e95c407623699d1e7e1f022ecc7d937))
* relations ([0015e2c](https://github.com/datomatic/prisma-laravel-generator/commit/0015e2c5a5da3a9556714695f8f1ef909bc59f7a))
* timestamps default by name ([445920d](https://github.com/datomatic/prisma-laravel-generator/commit/445920d3e2a021a43c9d4e97c5a4f39109a07dca))
* traits ([b6f3e93](https://github.com/datomatic/prisma-laravel-generator/commit/b6f3e9341a3b3db1bce6c157558842435448553e))
