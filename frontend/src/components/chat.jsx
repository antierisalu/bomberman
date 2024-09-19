import { LAR } from "../framework";
import { sendMessage } from '../websocket.js'

const Chat = (prop) => {  
    const [currentMessage, setCurrentMessage] = LAR.useState(""); 

    // Handle sending messages
    const sendChatMessage = (event) => {
        const message = {
            type: "chat_message", 
            content: currentMessage // current message input by the user
        }
        sendMessage(JSON.stringify(message)); // Send message over WebSocket
        setCurrentMessage(""); // Clear input after sending
        
    };

    return (
        <div style="padding: 10px; border: 1px solid black; width: 300px;">
            <div style="height: 300px; width: overflow-y: scroll; background-color: #f0f0f0; padding: 10px; border: 1px solid #ccc;"> 
                {prop.messages.map((msg, index) => (
                    <div key={index} style="padding: 5px; border-bottom: 1px solid #ddd;">
                        {msg.content}
                    </div>
                ))}
            </div>
                <input 
                    type="text" 
                    value={currentMessage}
                    onInput={(e) =>  {
                        setCurrentMessage(e.target.value)}
                    }   
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            sendChatMessage(e)
                        }
                    }}
                    placeholder="Type a message..."
                    style="width: 283px; padding: 8px; border: 1px solid #ccc; margin-bottom: 5px;"
                />
                <button onClick={sendChatMessage} type="submit" style="padding: 8px 16px; background-color: #007bff; color: white; border: none; cursor: pointer;">
                    Send
                </button>
        </div>

    );
};

export default Chat;