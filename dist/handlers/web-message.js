"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWebMessageHandler = void 0;
const assert_ts_1 = require("assert-ts");
const base64_url_1 = require("base64-url");
const web_message_1 = require("../views/web-message");
const createWebMessageHandler = () => function* (req, res) {
    (0, assert_ts_1.assert)(!!req.session, "no session");
    let username = req.session.username;
    (0, assert_ts_1.assert)(!!username, `no username in authorise`);
    let { redirect_uri, state, nonce } = req.query;
    res.set("Content-Type", "text/html");
    let message = (0, web_message_1.webMessage)({
        code: (0, base64_url_1.encode)(`${nonce}:${username}`),
        state,
        redirect_uri,
        nonce,
    });
    res.status(200).send(Buffer.from(message));
};
exports.createWebMessageHandler = createWebMessageHandler;
//# sourceMappingURL=web-message.js.map