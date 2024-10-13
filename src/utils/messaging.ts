import { v4 as uuidv4 } from "uuid";

export enum MessageTarget {
  CONTENT = "CONTENT",
  POPUP = "POPUP",
  BACKGROUND = "BACKGROUND",
}

export type Message<T = any> = {
  _imagineMsg: {
    id: string;
    extensionId: string;
  };
  cmd: string;
  payload: T;
};

type MessageHandler<T = any> = (
  message: Message<T>,
  sender: chrome.runtime.MessageSender
) => void | Promise<any>;

export type SendMessageFunction<T = any, R = any> = (payload: T) => Promise<R>;

export type ReceiveMessageFunction<T = any> = (
  handler: MessageHandler<T>
) => () => void;

const sendMessageToActiveTab = async <T>(message: Message<T>): Promise<any> => {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (activeTab?.id) {
        chrome.tabs.sendMessage(activeTab.id, message, (response) => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
          } else {
            resolve(response);
          }
        });
      } else {
        reject(new Error("无法获取当前标签页"));
      }
    });
  });
};

const sendMessage = <T>(message: Message<T>): Promise<any> => {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, (response) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      } else {
        resolve(response);
      }
    });
  });
};

export const useMsgSend = <T = any, R = any>(
  target: MessageTarget,
  cmd: string
): SendMessageFunction<T, R> => {
  return async (payload: T) => {
    const message: Message<T> = {
      _imagineMsg: {
        id: uuidv4(),
        extensionId: chrome.runtime.id,
      },
      cmd,
      payload,
    };

    switch (target) {
      case MessageTarget.CONTENT:
        return sendMessageToActiveTab(message) as Promise<R>;
      case MessageTarget.POPUP:
      case MessageTarget.BACKGROUND:
        return sendMessage(message) as Promise<R>;
      default:
        throw new Error(`未知的消息目标: ${target}`);
    }
  };
};

export const useMsgRecv = <T = any>(cmd: string): ReceiveMessageFunction<T> => {
  return (handler: MessageHandler<T>) => {
    const listener = (
      message: Message<T>,
      sender: chrome.runtime.MessageSender,
      sendResponse: (response?: any) => void
    ) => {
      if (
        message._imagineMsg &&
        message._imagineMsg.extensionId === chrome.runtime.id &&
        message.cmd === cmd
      ) {
        const result = handler(message, sender);
        if (result instanceof Promise) {
          result.then(sendResponse);
          return true; // 保持消息通道开放以进行异步响应
        } else {
          sendResponse(result);
        }
      }
    };

    chrome.runtime.onMessage.addListener(listener);

    return () => {
      chrome.runtime.onMessage.removeListener(listener);
    };
  };
};
