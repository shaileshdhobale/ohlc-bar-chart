# OHLC bar chart for trading data

## Overview
* Reads the Trades data input (line by line from JSON), and sends
the packet to the FSM (Finite-State-Machine) for computation.
* (FSM) computes OHLC packets based on 15 seconds (interval)
and constructs 'BAR' chart data.
* Client can subscribe share to view the OHLC bar chart.



Refer `Release notes` or `package.json` for the specific versions of the component packages included.

- [Release notes](./RELEASENOTES.md)
- [package.json](./package.json)

---

## Prerequisites

Ensure local installation of following software/tools:

- Git (2.9.0 or higher) - For cloning project from repository
- Node.js (v14.15.0)
- npm (v6.14.8)
- GitHubCli (apt install gitsome)

---

## Local Installation

The following sections provide instructions on locally building the project:

- [Project installation](./README.md#project-installation)

### Project Installation

* You can download a copy of the package from the Git repository (and branch) in GitHub (or) download the zip folder

#### Clone from a git repository

```sh
# Clone project from gitHub to required project-folder
# Download zip folder and extract

cd ohlc-bar-chart-master
 
```

#### Install dependencies

```sh
# Run install to pull in all dependencies specified in package.json

npm install

# To start the express server

npm start

# To start the webSocket client server

npm run startClient

```