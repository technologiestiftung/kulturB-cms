# Technologiestiftung kulturB CMS

A editor and viewer for data exposed by the [technologiestiftung/kulturB-api](https://github.com/technologiestiftung/kulturB-api). The frontend is build using [React](https://github.com/facebook/react), [Redux](https://redux.js.org/) and [ant.design](https://ant.design/).

## Requirements

- Node.js (recommended => v10)
- a running [technologiestiftung/kulturB-api](https://github.com/technologiestiftung/kulturB-api) instance.

## Installation

Clone the repository, enter the root project folder and then run the following:

```sh
$ npm install
```

## Development

Builds the application and starts a webserver with hot loading.
Runs on [localhost:8080](http://localhost:8080/)

```sh
$ npm run start
```

## Build

Bundles a minified version of the application in the build folder.

```sh
$ npm run build
```

## Data import/export

The data is served by [technologiestiftung/kulturB-api](https://github.com/technologiestiftung/kulturB-cms) and can be imported or exported using the appropriate endpoints or the UI provided in the settings view (under `/einstellungen`).

## See also

* [technologiestiftung/kulturB-karte](https://github.com/technologiestiftung/kulturB-karte) - an interactive visualisation of the data managed by this cms
* [technologiestiftung/kulturB-api](https://github.com/technologiestiftung/kulturB-api) - the api that drives the cms and map application