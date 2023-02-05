export class Exception {
  #statusCode;
  #message;

  constructor(statusCode, message) {
    this.#statusCode = statusCode;
    this.#message = message;
  }

  send(res) {
    res.writeHead(this.#statusCode).end(JSON.stringify({
      error: {
        message: this.#message,
      }
    }))
  }
}