# AnonChat

AnonChat is a simple chat application that allows users to communicate anonymously over a secure WebSocket connection with AES end-to-end encryption.

## Key Files

- [cryptojs-aes.min.js](app/cryptojs-aes.min.js): This file contains the implementation of the AES encryption algorithm used for secure communication.
- [cryptojs-aes-format.js](app/cryptojs-aes-format.js): This file provides a specific format for the AES encryption.
- [dhke.js](app/dhke.js): This file implements the Diffie-Hellman Key Exchange algorithm, which is used to securely share encryption keys over a public channel.
- [script.js](app/script.js): This is the main script file for the chat application.
- [index.html](app/index.html): This is the main HTML file for the chat application.
- [style.css](app/style.css): This file contains the CSS styles for the chat application.
- [index.js](index.js): This is the main server-side script file for the chat application.
- [package.json](package.json): This file contains the list of project dependencies and scripts.

## How to Run

1. Install the project dependencies by running `npm install` in the project root directory.
2. Start the server by running `node index.js`.
3. Open `app/index.html` in your web browser to start the chat application.
