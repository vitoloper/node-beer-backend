# node-beer-backend

A demo Node.js REST API backend using Express, Mongoose, Passport and Redis session storage.
Based on [node-express-mongoose](https://github.com/madhums/node-express-mongoose) boilerplate by madhums.

## Prerequisites

Before starting the project, make sure both MongoDB and Redis are up and running.

## Installation

Clone the repository and install the required modules:

```sh
$ git clone https://github.com/vitoloper/node-beer-backend.git node-beer-backend
$ cd node-beer-backend
$ npm install
```
## Setup

You can find the configuration files in the config/env directory.
There are three files: production.js, development.js and test.js.
The environment variable NODE_ENV controls which configuration file will be used (in package.json you can see NODE_ENV is set on 'npm start' and on 'npm test').

## Run

Use npm to start the application:

```sh
$ npm start
```

## Test

Use npm to run the tests:

```sh
$ npm test
```

## Version

1.0

License
----

MIT
