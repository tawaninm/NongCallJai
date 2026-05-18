import { useEffect } from "react";

declare global {
  interface Window {
    BN?: {
      init: (options: { version: string }) => void;
    };
  }
}

export function BotnoiChat() {
  useEffect(() => {
    if (document.getElementById("bn-jssdk")) return;

    let root = document.getElementById("bn-root");
    if (!root) {
      root = document.createElement("div");
      root.id = "bn-root";
      document.body.appendChild(root);
    }

    let chatDiv = document.querySelector(".bn-customerchat");
    if (!chatDiv) {
      chatDiv = document.createElement("div");
      chatDiv.className = "bn-customerchat";
      chatDiv.setAttribute("bot_id", "69fd5d09fb3079f007911739");
      chatDiv.setAttribute("bot_name", "VoiceMed AI Companion");
      chatDiv.setAttribute("theme_color", "#4FA66A");
      chatDiv.setAttribute("locale", "th");
      chatDiv.setAttribute(
        "logged_in_greeting",
        "สวัสดีค่ะ ยินดีต้อนรับสู่ VoiceMed ผู้ช่วยดูแลด้วยเสียงสำหรับครอบครัว",
      );
      chatDiv.setAttribute(
        "greeting_message",
        "สวัสดีค่ะ อยากให้ VoiceMed ช่วยดูแลคุณตาคุณยายเรื่องไหนคะ?",
      );
      chatDiv.setAttribute("default_open", "false");
      document.body.appendChild(chatDiv);
    }

    const script = document.createElement("script");
    script.id = "bn-jssdk";
    script.src = "https://console.botnoi.ai/customerchat/index.js";
    document.body.appendChild(script);

    script.onload = () => {
      window.BN?.init({ version: "1.0" });
    };
  }, []);

  return null;
}
