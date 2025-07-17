import React, { useState } from 'react';
import axios from 'axios';

// URLを<a>タグに変換する関数
function linkify(text) {
  const urlRegex = /https?:\/\/[^\s]+/g;
  const parts = text.split(urlRegex);
  const urls = text.match(urlRegex);

  if (!urls) return [text];

  const result = [];
  for (let i = 0; i < parts.length; i++) {
    result.push(parts[i]);
    if (urls[i]) {
      result.push(
        <a key={i} href={urls[i]} target="_blank" rel="noopener noreferrer">
          {urls[i]}
        </a>
      );
    }
  }
  return result;
}

function App() {
  const [messages, setMessages] = useState([{ role: "system", text: "こんにちは！接待相手や好みを教えてください。" }]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input) return;
    const newMessages = [...messages, { role: "user", text: input }];
    setMessages(newMessages);
    setInput("");

    try {
      const res = await axios.post('https://ryiyef9o3h.execute-api.ap-northeast-1.amazonaws.com/prod/recommend', {
        message: input
      });
      let str = "以下のお店はいかがですか？条件に合致したお店です。" + "\r\n"
      res.data.forEach((item, index) => {
        str += `${index + 1}. ${item.name}: \n ${item.feature}\n ${item.url}\n `;
        // str = str + String(i+1);
        // str = str + " " + res.data[i].name + ":" ;
        // str = str + " " + res.data[i].feature  + "" ;
        // str = str + " " + res.data[i].url  + "\r\n" ;
      });
      setMessages([...newMessages, { role: "bot", text: str }]);
    } catch (err) {
      setMessages([...newMessages, { role: "bot", text: "エラーが発生しました。" }]);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>おもてなしプランナーチャット</h2>
      <div style={{ minHeight: 300, border: '1px solid gray', padding: 10, whiteSpace: 'pre-wrap' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ margin: 5 }}>
            <strong>{m.role === "user" ? "あなた" : (m.role === "system" ? "システム" : "プランナー")}:</strong> {linkify(m.text)}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        style={{ width: '80%' }}
      />
      <button onClick={sendMessage}>送信</button>
    </div>
  );
}

export default App;