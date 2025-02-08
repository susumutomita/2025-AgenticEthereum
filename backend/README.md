# Backend Service

This repository contains a simple Express-based backend that communicates with the [Autonome API](https://autonome.alt.technology) using Basic Authentication. It also provides a Swagger UI for convenient API documentation and testing.

## Table of Contents

- [Backend Service](#backend-service)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Running the Server](#running-the-server)
  - [Usage](#usage)
    - [1. Sending a Message to Autonome](#1-sending-a-message-to-autonome)
      - [Request Body](#request-body)
      - [Successful Response](#successful-response)
      - [Error Response](#error-response)
  - [API Documentation](#api-documentation)
  - [Logging](#logging)
  - [Contributing](#contributing)
  - [License](#license)

---

## Features

- **Express.js** server for handling incoming JSON requests.
- **Basic Auth integration** with the Autonome API, using `axios`.
- **Swagger UI** for interactive API documentation at `/api-docs`.
- **Configurable** via `.env` file (or environment variables).
- **Logger** that outputs essential request/response information.

---

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

---

## Installation

1. **Clone** this repository:
   ```bash
   git clone <REPO_URL>
   cd <REPO_DIRECTORY>
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

---

## Configuration

Create a `.env` file in the root directory to manage environment variables. An example `.env` might look like:

```
PORT=3001
NODE_ENV=development
```

| Variable         | Description                                              | Default  |
|------------------|----------------------------------------------------------|----------|
| `PORT`           | Port on which the server will listen                     | `3001`   |
| `NODE_ENV`       | Sets Node environment mode (e.g. `development`, `production`) | `development` |

> **Note**: For Autonome credentials, see `backend/src/services/autonomeService.ts` (the `defaultConfig` object). You can override these via the `autonome` payload in API calls if needed.

---

## Running the Server

After installing dependencies and setting up your `.env`:

```bash
npm start
```

By default, the server will start on port `3001`. You can override this using the `PORT` environment variable.

---

## Usage

### 1. Sending a Message to Autonome

`POST /api/v1/message`

#### Request Body

```json
{
  "text": "Hello, Agent!"
}
```

- **`text`** (string): The message text to send. **Required**.

Optional overrides can be provided to specify custom Autonome credentials, for example:

```json
{
  "text": "Hello, Agent!",
  "autonome": {
    "baseUrl": "https://autonome.alt.technology",
    "instanceId": "your-instance-id",
    "username": "your-username",
    "password": "your-password"
  }
}
```

#### Successful Response

```json
{
  "success": true,
  "agentId": "b27054cb-8c55-0ec4-ad2f-005965bd4a7c",
  "messageResult": {
    // ... response data from Autonome
  }
}
```

#### Error Response

```json
{
  "error": "fail to send autonomy"
}
```

---

## API Documentation

Once the server is running, navigate to:

```
http://localhost:3001/api-docs
```

This opens the **Swagger UI**. You can try out the `POST /api/v1/message` endpoint directly through the web interface.

---

## Logging

All logs are sent through the custom `logger` (`backend/src/logger.ts`). Logs include:

- **Request details** (URL, headers, payload when sending to Autonome)
- **Response data** from Autonome
- **Errors** (HTTP status, response body, or setup issues)

You can adjust log levels by editing the logger configuration if needed.

---

## Contributing

Feel free to open issues or pull requests if you have improvements or find any bugs. When submitting a PR, please include a clear description of changes.

---

## License

This project is released under the [MIT License](LICENSE). Feel free to use it as you wish.
