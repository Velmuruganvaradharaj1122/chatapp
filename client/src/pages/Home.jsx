import { useState, useEffect, useContext } from 'react';
import { socket } from '../socket';
import { AuthContext } from '../context/AuthContext';

export default function Home() {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState('');

  useEffect(() => {
    socket.on('newMessage', (msg) => {
      setMessages(prev => [...prev, msg]);
    });
    socket.on('typing', (name) => {
      setTyping(`${name} is typing...`);
      setTimeout(() => setTyping(''), 2000);
    });
  }, []);

  const sendMessage = () => {
    if (input.trim()) {
      const msg = { sender: user.name, message: input, time: new Date() };
      socket.emit('sendMessage', msg);
      setInput('');
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/3 bg-green-700 text-white p-4">
        <h2 className="text-2xl font-bold">MyChat</h2>
        <p>Welcome, {user.name}!</p>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="bg-green-600 text-white p-4 text-xl">General Chat</div>
        <div className="flex-1 overflow-y-auto p-4">
          {messages.map((m, i) => (
            <div key={i} className={`mb-4 ${m.sender === user.name ? 'text-right' : ''}`}>
              <span className="text-xs text-gray-500">{m.sender}</span>
              <div className={`inline-block p-3 rounded-lg ${m.sender === user.name ? 'bg-green-500 text-white' : 'bg-white'}`}>
                {m.message}
              </div>
            </div>
          ))}
          {typing && <p className="italic text-gray-500">{typing}</p>}
        </div>
        <div className="p-4 bg-gray-200 flex">
          <input
            className="flex-1 p-3 rounded-lg"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              socket.emit('typing', user.name);
            }}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button onClick={sendMessage} className="ml-2 bg-green-600 text-white px-6 py-3 rounded-lg">Send</button>
        </div>
      </div>
    </div>
  );
}