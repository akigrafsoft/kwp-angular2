# KwpAngular2

This project is initiated by AkigrafSoft.

## Build

Run `npm install` once.

Run `npm run build` to build the project. The build artifacts will be stored in the `lib/` directory.

## Package

Run `find ./lib -type f -name "*.ts" -exec sed -i 's#/// <reference types="core-js" />##g' {} +`

Run `npm pack`

It will create a tgz file like kwp-angular2-1.0.0.tgz

## Install it locally

`cd path/to/your/project/`

`npm install /home/kmoyse/akgsworkspace/kwp-angular2/kwp-angular2-1.0.0.tgz`

## Running unit tests

TODO

## Running end-to-end tests

TODO

## Deploying to Github Pages

TODO

## Further help

TODO
