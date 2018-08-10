<p align="center"> <img src='./config/img/saij.png' height='150' /></p>

-------

<p align="center">
<b>
:zap: A learning engine.
</b>
</p>

<p align="center">
  <a><img src="https://img.shields.io/badge/release-alpha-yellow.svg?style=flat-square" alt="Build Status"></a>
  <a><img src="https://img.shields.io/badge/coverage-100%25-green.svg?style=flat-square" alt="Build Status"></a>
  <a><img src="https://img.shields.io/travis-ci/skan-io/saij.svg?style=flat-square" alt="Build Status"></a>
  <a href="https://greenkeeper.io/"><img src="https://badges.greenkeeper.io/skan-io/saij.svg?style=flat-square"></a>
  <a><img src="https://img.shields.io/badge/linter-eslint-ff69b4.svg?style=flat-square" alt="code style: prettier"></a>
  <a><img src="https://img.shields.io/badge/docs-v1.0.0-blue.svg?style=flat-square"></a>
</p>

<p align="center">
A modular Javascript machine learning and artificial intelligence SDK.
</p>

<p> &nbsp; </p>

:hatched_chick: Current release: **Alpha 1.0.0**

:book: Read the [Quick Start Guide](https://skan.gitbook.com/saij)

:computer: [API Docs](https://skan-io.github.io/saij/)

:rocket: [Try it out](https://apps.saij.io/examples)

:tractor: **[Roadmap](https://github.com/skan-io/saij/wiki/Roadmap)**


## Table of Contents

-   [Background](#background)
-   [Install](#install)
-   [Usage & API](#usage-and-api)
-   [Code Style](#eslint-installation)
-   [Testing](#running-tests)
-   [Build & Package](#build-and-package)
-   [Documentation](#documentation)
-   [Maintainers](#maintainers)
-   [License](#license)

## Background

## Install

>Ensure the latest version of node is used:
>```bash
>nvm use 9
>```

```
npm install saij
```

## Usage & API

Basic `Engine` example:

```javascript
import Engine from 'saij/Engine';
import Interpreter from 'saij/Interpreter';
import Analyser from 'saij/Analyser';
import Reactor from 'saij/Reactor';

const engine = new Engine({...options});

engine.createPipeline(
  new Interpreter(),
  new Analyser(),
  new Reactor()
);
engine.setTarget('my-html-element');
engine.setInputTarget('my-input-html-element');
engine.start();
```

See __Saij__ in action at [https://apps.saij.io](https://apps.saij.io).

## Testing

To run all unit tests use:

```bash
npm test
```

To run a single test use:

```bash
npm run jest src/saij/file-to-test
```

All tests must pass 100% coverage (and all use cases) before a merge to master.

## Build & Package

To build the project use:

```bash
npm run build
```

Built files will be output to [`build/saij`](./build/saij).

Package will be automatically published to [NPM](https://www.npmjs.com/package/saij) once it has passed CI (Travis), semantic versioning and it must be successfully merged into master.

## Documentation

A GitBook guide and tutorial documentation can be found at [https://skan.gitbook.com/saij](https://skan.gitbook.com/saij), including examples and support.

API documentation can be found at [https://skan-io.github.io/saij/](https://skan-io.github.io/saij/)

API docs can also be accessed anytime locally using:

```bash
serve ./docs
```

Or you can rebuild the docs:

```bash
npm run docs
server ./docs
```

## Maintainers

[@nickmanks](https://github.com/nickmanks)

## Contribute

PRs accepted.

Commits must use Angular commit message standard.  Pull requests try to use the pull request template provided.

See [the contribute file](CONTRIBUTING.md)!

Small note: If editing the README, please conform to the [standard-readme](https://github.com/RichardLitt/standard-readme) specification.   <a href="https://github.com/RichardLitt/standard-readme"><img src="https://img.shields.io/badge/standard--readme-OK-green.svg?style=flat-square" alt="contributions welcome"></a>

## Attribute

Much of the core and structure of this project has been heavily inspired by [OpenLayers](http://openlayers.org/).  They're doing great work in GIS and mapping so thanks to all the contributors of that project, [go check it out!](https://github.com/openlayers/openlayers)

## License

BSD-3-Clause © 2018 Skan.io
