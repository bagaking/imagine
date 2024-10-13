import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { useMsgSend, MessageTarget } from "./utils/messaging";
import "./styles.css";

type ShowMessagePayload = {
  message: string;
};

type ShowMessageResponse = {
  received: boolean;
};

const Popup: React.FC = () => {
  const [status, setStatus] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const sendShowMessage = useMsgSend<ShowMessagePayload, ShowMessageResponse>(
    MessageTarget.CONTENT,
    "SHOW_MESSAGE"
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await sendShowMessage({ message });
      if (response.received) {
        console.log("消息已成功发送并接收");
        setStatus("消息发送成功");
      } else {
        console.error("未收到预期的响应");
        setStatus("未收到预期的响应");
      }
    } catch (error) {
      console.error("发送消息时出错:", error);
      setStatus(`发送消息失败: ${error.message}`);
    }
  };

  return (
    <div className="w-80 p-4 bg-gray-100 font-sans">
      <h1 className="text-xl font-bold mb-3 text-indigo-600">IMAGINE</h1>
      <h2 className="text-lg font-semibold mb-2">消息发送器</h2>
      <p className="text-sm mb-4 text-gray-600">
        在下面输入您想要发送的消息，然后点击发送按钮。
      </p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="输入消息"
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          发送消息
        </button>
      </form>
      {status && (
        <p
          className={`mt-3 text-sm ${
            status.includes("成功") ? "text-green-600" : "text-red-600"
          }`}
        >
          {status}
        </p>
      )}
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);
root.render(<Popup />);
