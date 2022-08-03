"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.webMessage = void 0;
const jsesc_1 = __importDefault(require("jsesc"));
const webMessage = ({ state, code, redirect_uri, nonce, }) => {
    let data = (0, jsesc_1.default)({
        redirect_uri,
    }, { json: true, isScriptContext: true });
    return `
  <!DOCTYPE html>
    <html lang="en">
      <head>
        <title>Authorization Response</title>
      </head>
      <body>
      <script ${nonce ? `nonce="${nonce}"` : ""} type="application/javascript">
        (function(window, document) {
          var data = ${data};
          var targetOrigin = data.redirect_uri;
          var webMessageRequest = {};
          
          var authorizationResponse = {
            type: "authorization_response",
            response: {
              "code":"${code}",
              "state":"${state}"}
            };
            
            var mainWin = (window.opener) ? window.opener : window.parent;
            
            if (webMessageRequest["web_message_uri"] && webMessageRequest["web_message_target"]) {
              window.addEventListener("message", function(evt) {
                if (evt.origin != targetOrigin) {
                  return;
                }
                
                switch (evt.data.type) {
                  case "relay_response":
                    var messageTargetWindow = evt.source.frames[webMessageRequest["web_message_target"]];
                    
                    if (messageTargetWindow) {
                      messageTargetWindow.postMessage(authorizationResponse, webMessageRequest["web_message_uri"]);
                      window.close();
                    }
                    break;
                  }
                }
              );
              
              mainWin.postMessage({
                type: "relay_request"
              }, targetOrigin);
            } else {
              mainWin.postMessage(authorizationResponse, targetOrigin);
            }
          })(this, this.document);
        </script>
      </body>
    </html>
  `;
};
exports.webMessage = webMessage;
//# sourceMappingURL=web-message.js.map