import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { useMsgSend, MessageTarget } from "./utils/messaging";
import "./styles.css";

type ShowMessagePayload = {
  message: string;
};

const Popup: React.FC = () => {
  const [status, setStatus] = useState<string>("");
  const sendShowMessage = useMsgSend<ShowMessagePayload>(
    MessageTarget.CONTENT,
    "SHOW_MESSAGE"
  );

  const handleClick = async () => {
    try {
      const response = await sendShowMessage({ message: "Hello from popup!" });

      if (response && response.received) {
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
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        Chrome 扩展弹出窗口
      </h1>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
        onClick={handleClick}
      >
        显示消息
      </button>
      {status && <p className="mt-4 text-sm text-gray-600">{status}</p>}
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);
root.render(<Popup />);
