import React from "react";


const messages = [
  {
    id: 1,
    sender: "adventureshecraves",
    message: "Hey! Does 5pm work?",
    time: "3:45 PM",
  },
  {
    id: 2,
    sender: "jacksgap",
    message: "I'll come by the coffee shop around 3pm",
    time: "3:46 PM",
  },
  {
    id: 3,
    sender: "macbarbie07",
    message: "Yes please, I can cover the shipping cost!",
    time: "3:48 PM",
  },
];

function Inbox() {
  return (
    <div className="aim-inbox">
      <h1 className="aim-header">💬 AIM Inbox</h1>
      <div className="aim-message-list">
        {messages.map((msg) => (
          <div key={msg.id} className="aim-message-item">
            <div className="aim-message-sender">{msg.sender}</div>
            <div className="aim-message-text">{msg.message}</div>
            <div className="aim-message-time">{msg.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Inbox;
