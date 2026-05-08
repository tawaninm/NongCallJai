import { useEffect } from 'react';

/**
 * Botnoi Chatbot widget component.
 * Loads the Botnoi customer chat SDK and renders the chat bubble.
 */
export function BotnoiChat() {
  useEffect(() => {
    // Skip if already loaded
    if (document.getElementById('bn-jssdk')) return;

    // Create root div
    let root = document.getElementById('bn-root');
    if (!root) {
      root = document.createElement('div');
      root.id = 'bn-root';
      document.body.appendChild(root);
    }

    // Create customerchat div
    let chatDiv = document.querySelector('.bn-customerchat');
    if (!chatDiv) {
      chatDiv = document.createElement('div');
      chatDiv.className = 'bn-customerchat';
      chatDiv.setAttribute('bot_id', '69fd5d09fb3079f007911739');
      chatDiv.setAttribute('bot_name', 'CareGo AI Assistant');
      chatDiv.setAttribute('theme_color', '#00897B');
      chatDiv.setAttribute('locale', 'th');
      chatDiv.setAttribute('logged_in_greeting', 'สวัสดีค่ะ ยินดีต้อนรับเข้าสู่ CareGo Hospital Platform');
      chatDiv.setAttribute('greeting_message', 'สวัสดีค่ะ มีอะไรให้ช่วยไหมคะ?');
      chatDiv.setAttribute('default_open', 'false');
      document.body.appendChild(chatDiv);
    }

    // Load SDK script
    const js = document.createElement('script');
    js.id = 'bn-jssdk';
    js.src = 'https://console.botnoi.ai/customerchat/index.js';
    document.body.appendChild(js);

    // Init BN after script loads
    js.onload = () => {
      if ((window as any).BN) {
        (window as any).BN.init({ version: '1.0' });
      }
    };

    return () => {
      // Cleanup on unmount (optional)
    };
  }, []);

  return null;
}
