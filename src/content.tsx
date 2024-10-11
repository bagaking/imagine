import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { useMsgRecv, Message } from "./utils/messaging";
import "./styles.css";

type ShowMessagePayload = {
  message: string;
};

const MessagePopup: React.FC = () => {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");
  const receiveShowMessage = useMsgRecv<ShowMessagePayload>("SHOW_MESSAGE");

  useEffect(() => {
    const cleanup = receiveShowMessage((message) => {
      console.log("Received message:", message);
      setShow(true);
      setMessage(message.payload.message);
      // 返回一个 Promise 来解决类型错误
      return Promise.resolve({ received: true });
    });

    return cleanup;
  }, [receiveShowMessage]);

  if (!show) return null;

  return (
    <div
      className="fixed top-4 right-4 bg-white shadow-lg rounded-lg p-4 z-50 animate-fade-in-down"
      style={{ zIndex: 1000 }}
    >
      <p className="text-lg font-semibold">{message}</p>
    </div>
  );
};

const init = () => {
  console.log("Content script initializing");
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeContentScript);
  } else {
    initializeContentScript();
  }
  return "go";
};

const initializeContentScript = () => {
  console.log("Initializing content script");
  const observer = new MutationObserver((mutations, obs) => {
    const body = document.body;
    if (body) {
      console.log("Body found, creating root element");
      const root = document.createElement("div");
      root.id = "chrome-extension-root";
      body.appendChild(root);
      console.log("Content script rendering MessagePopup");
      createRoot(root).render(<MessagePopup />);
      obs.disconnect();
      console.log("Observer disconnected");
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
  console.log("Observer started");
};

console.log("load content script module", init());
