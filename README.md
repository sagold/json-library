# json library

A range of utility modules and functions to work with json or js objects

currently includes

- [json **pointer**](./lib/object) implementation `pointer.get` and `pointer.set`, which creates objects on its path
- [json **query**](./lib/query) a json pointer supporting glob-pattern `#/usr/**/*/passphrase` and filters
`#/input/*?valid:true`
- [json **relation**](./lib/relation), a relationship definition and utilities to setup and deconstruct relationships
between objects


For an up-to-date documentation refer to the [unit tests here](./test/unit).
