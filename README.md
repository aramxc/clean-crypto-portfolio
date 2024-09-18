# Clean Crypto Portfolio

## [View App on Github Pages Here](https://aramxc.github.io/clean-crypto-portfolio/)

Project goal: Design and implement a fully functional React application that pulls data from Coin Market Cap's free tier API service ([see documentation here](https://coinmarketcap.com/api/documentation/v1/)). Users will input their crypto holdings and be able to see in real time their total portfolio value along with 1H, 24H, and 7D changes for each symbol.

Currently rewriting backend in Go to make it more efficient and scalable.

## Prerequisites

- Go 1.23 or later
- Node.js 14 or later
- npm 6 or later

## Running the Backend

1. Clone the repository:
   ```
   git clone https://github.com/aramxc/clean-crypto-portfolio.git
   cd clean-crypto-portfolio
   ```

2. Navigate to the backend directory:
   ```
   cd api
   ```

3. Install Go dependencies:
   ```
   go mod tidy
   ```

4. Run the backend server:
   ```
   go run cmd/main.go
   ```

The backend server will start running on `http://localhost:8080`.

## Running the Frontend

1. Open a new terminal window and navigate to the frontend directory from the project root:
   ```
   cd frontend
   ```

2. Install npm dependencies:
   ```
   npm install
   ```

3. Start the React development server:
   ```
   npm start
   ```

The frontend application will be available at `http://localhost:3000`.

## API Endpoints

- GET `/api/ticker-list`: Retrieves the list of cryptocurrency tickers.

## Future Plans

- Add alerting functionality
- Implement additional features to enhance the user experience

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).