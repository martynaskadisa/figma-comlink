
import type { Endpoint } from "comlink";

export const uiEndpoint = (): Endpoint => {
  const listeners = new WeakMap();

  return {
    postMessage(message, _tranfer) {
      figma.ui.postMessage(message);
    },
    addEventListener(_type, listener, _options) {
      const l: MessageEventHandler = (pluginMessage, _props) => {
        if ("handleEvent" in listener) {
          listener.handleEvent({ data: pluginMessage } as any);
        } else {
          listener({ data: pluginMessage } as any);
        }
      };

      figma.ui.on("message", l);
      listeners.set(listener, l);
    },
    removeEventListener(_type, listener, _options) {
      const l = listeners.get(listener);
      if (!l) {
        return;
      }

      figma.ui.off("message", l);
    },
  };
};
