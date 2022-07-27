"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoSSLError = exports.mkcertText = void 0;
const paths_1 = require("../../config/paths");
exports.mkcertText = `
In order to run an https service from localhost you need locally-trusted development certificates.

mkcert (https://github.com/FiloSottile/mkcert) makes this pretty easy:

brew install mkcert
brew install nss  # for firefox

mkdir -p ${paths_1.paths.certificatesDir}
cd ${paths_1.paths.certificatesDir}

mkcert -install   # Created a new local CA at the location returned from mkcert -CAROOT
mkcert localhost  # Using the local CA at CAROOT, create a new certificate valid for the following names
      `;
class NoSSLError extends Error {
    constructor(message) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
exports.NoSSLError = NoSSLError;
//# sourceMappingURL=ssl-error.js.map