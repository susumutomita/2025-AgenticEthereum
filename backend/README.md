# Backend Service for CryptoDailyBrief

This TypeScript-based Express backend service manages communication with the Autonome API for AI-driven crypto insights, handles wallet data aggregation, and provides RESTful APIs for the frontend. The service includes comprehensive test coverage with Jest and Swagger documentation.

## Table of Contents

- [Backend Service for CryptoDailyBrief](#backend-service-for-cryptodailybrief)
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
  - [Testing](#testing)
  - [Logging](#logging)
  - [Contributing](#contributing)
  - [License](#license)

---

## Features

- **TypeScript & Express.js**: Fully typed REST API server with Express.
- **Autonome Integration**: Secure communication with Autonome API for AI analysis.
- **Jest Testing**: Comprehensive test coverage for all services.
- **Swagger UI**: Interactive API documentation at `/api-docs`.
- **Environment Configuration**: Flexible configuration via `.env` file.
- **Structured Logging**: Detailed request/response logging with Winston.

---

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)

---

## Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Build the TypeScript code**:
   ```bash
   npm run build
   ```

---

## Configuration

Create a `.env` file in the root directory using `.env.example` as a template:

```env
PORT=3001
NODE_ENV=development
AUTONOME_BASE_URL=https://autonome.alt.technology
AUTONOME_INSTANCE_ID=your-instance-id
AUTONOME_USERNAME=your-username
AUTONOME_PASSWORD=your-password
```

| Variable | Description | Default |
|----------|------------|----------|
| `PORT` | Server port | `3001` |
| `NODE_ENV` | Environment mode | `development` |
| `AUTONOME_BASE_URL` | Autonome API endpoint | `https://autonome.alt.technology` |
| `AUTONOME_INSTANCE_ID` | Your Autonome instance ID | Required |
| `AUTONOME_USERNAME` | Autonome API username | Required |
| `AUTONOME_PASSWORD` | Autonome API password | Required |

---

## Running the Server

For development with hot-reload:
```bash
npm run dev
```

For production:
```bash
npm run build
npm start
```

---

## Usage

### 1. Sending a Message to Autonome

`POST /api/v1/message`

#### Request Body

```json
{
  "message": "Analyze my portfolio and suggest rebalancing options",
  "walletAddress": "0x..."
}
```

Optional parameters:
```json
{
  "message": "Analyze my portfolio",
  "walletAddress": "0x...",
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
  "analysis": {
    "portfolio": {
      "totalValue": "10000 USD",
      "recommendations": [
        {
          "action": "REBALANCE",
          "details": "Consider reducing ETH exposure by 5%"
        }
      ]
    }
  }
}
```

#### Error Response

```json
{
  "error": "Failed to analyze portfolio",
  "code": "ANALYSIS_ERROR",
  "details": "..."
}
```

---

## API Documentation

Access the Swagger UI documentation at:
```
http://localhost:3001/api-docs
```

---

## Testing

Run the test suite:
```bash
npm test
```

Run tests with coverage:
```bash
npm run test:coverage
```

---

## Logging

The service uses Winston for structured logging with the following features:

- **Request Context**: Each request gets a unique ID for tracing
- **Performance Metrics**: Response times and API latencies
- **Error Details**: Stack traces and error contexts
- **Security Events**: Authentication and authorization logs

Logs are output to both console and files:
```
logs/
  ├── error.log
  ├── combined.log
  └── requests.log
```

---

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/my-new-feature`
5. Submit a pull request

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
