# KwpAngular

This project is initiated by AkigrafSoft.

## Requirements

Having last version of node and npm is usually better :

Run `npm install npm@latest -g` to get last npm version.

## Build

Run `npm install` once.

Run `npm run build` to build the project. The build artifacts will be stored in the `lib/` directory.

## Package

deprecated : Run `find ./lib -type f -name "*.ts" -exec sed -i 's#/// <reference types="core-js" />##g' {} +`

Run `npm pack`

npm run build;npm pack

It will create a tgz file like kwp-angular2-1.0.0.tgz

## Install it locally

`cd path/to/your/project/`

`npm install /path/to/kwp-angular-1.0.0.tgz`

## Running unit tests

TODO

## Running end-to-end tests

TODO

## Deploying to Github Pages

TODO

## Further help

TODO
