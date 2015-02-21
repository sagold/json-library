# json library

A range of utility modules and functions to work with json or js objects

currently includes

- [json **pointer**]("https://github.com/sagold/json-library/tree/master/lib/pointer") implementation `pointer.get` and `pointer.set`, which creates objects on its path
- [json **query**]("https://github.com/sagold/json-library/tree/master/lib/query") a json pointer supporting glob-pattern `#/usr/**/*/passphrase`, filters
`#/input/*?valid:true` and simple regular expressions `#/input/{name-.*}/id`
- [json **relation**]("https://github.com/sagold/json-library/tree/master/lib/relation"), a relationship definition and utilities to setup and deconstruct relationships
between objects


For an up-to-date documentation refer to the [unit tests here]("https://github.com/sagold/json-library/tree/master/test/unit").
