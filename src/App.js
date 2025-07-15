import React, { useState } from 'react';
import axios from 'axios';

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
　　　for (let i=0; i < res.data.length; i++) {
	str = str + String(i+1);
	str = str + " " + res.data[i].name + ":" ;
	str = str + " " + res.data[i].feature  + "" ;
	str = str + " " + res.data[i].url  + "\r\n" ;
      }
      setMessages([...newMessages, { role: "bot", text: str }]);
    } catch (err) {
      setMessages([...newMessages, { role: "bot", text: "エラーが発生しました。" }]);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>おもてなしプランナーチャット</h2>
      <div style={{ minHeight: 300, border: '1px solid gray', padding: 10 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ margin: 5 }}>
            <strong>{m.role === "user" ? "あなた" : (m.role === "system" ? "システム" : "プランナー")}:</strong> {m.text}
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