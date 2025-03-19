import { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";

const Chat = ({ userId, partnerId }) => {
    const socket = useSocket(userId);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        if (!socket) return;

        // Lắng nghe sự kiện nhận tin nhắn mới
        socket.on("newMessage", (data) => {
            setMessages((prev) => [...prev, data.message]);
        });

        // Lắng nghe sự kiện tin nhắn được delivered
        socket.on("messagesDelivered", (data) => {
            console.log("Messages delivered:", data.messages);
        });

        // Lắng nghe sự kiện tin nhắn được đọc
        socket.on("messagesSeen", (data) => {
            console.log("Messages seen:", data.messages);
        });

        return () => {
            socket.off("newMessage");
            socket.off("messagesDelivered");
            socket.off("messagesSeen");
        };
    }, [socket]);

    // Gửi tin nhắn
    const sendMessage = (text) => {
        if (!socket || !text) return;
        
        socket.emit("sendMessage", { senderId: userId, receiverId: partnerId, text });
    };

    return (
        <div>
            <h2>Chat với {partnerId}</h2>
            <div>
                {messages.map((msg, index) => (
                    <div key={index}>
                        <strong>{msg.sender.firstName}:</strong> {msg.text}
                    </div>
                ))}
            </div>
            <button onClick={() => sendMessage("Hello!")}>Gửi tin nhắn</button>
        </div>
    );
};

export default Chat;
