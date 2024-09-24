import { LAR } from "../framework";
import { sendMessage } from '../websocket.js';

const Chat = (prop) => {  
    const [currentMessage, setCurrentMessage] = LAR.useState(""); 

    // Handle sending messages
    const sendChatMessage = (event) => {
        event.preventDefault(); 
        if (currentMessage.trim() === "") return; 

        const message = {
            type: "chat_message", 
            content: currentMessage // current message input by the user
        };
        sendMessage(JSON.stringify(message));
        setCurrentMessage("");
        scrollToBottom()
    };

    const scrollToBottom = () => {
        const chatMessagesContainer = document.querySelector('.chat-messages');
        if (chatMessagesContainer) { 
            chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight; // Scroll to the bottom
        }
    };

    LAR.useEffect(() => {
        scrollToBottom(); 
    }, [prop.messages]);

    return (
        <div className="chat-container" style={prop.style || {}}>
            <div className="chat-messages" style={prop.messagesStyle || {}}>
                {prop.messages.map((msg, index) => (
                    <div key={index} className="messages">
                        <strong style={{ color: msg.player?.color || 'black' }}>
                        {msg.player?.username || "Unknown"}
                        </strong>: 
                        <div className="message"> 
                            {msg.content}
                        </div>
                    </div>
                ))}
            </div>

            <div className="input-container">
                <textarea  
                    value={currentMessage}
                    onInput={(e) => setCurrentMessage(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            sendChatMessage(e);
                        }
                    }}
                    placeholder="Type a message..."
                    rows="2"
                    className="chat-textarea"
                />
                <button 
                    onClick={sendChatMessage}
                    type="submit"
                    className="send-button bomb-icon"
                >
                </button>
            </div>    
        </div>
    );
};

export default Chat;
