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
        <div style="position: absolute; left: 750px; top: -9px; padding: 10px; width: 200px;">
            <div style="height: 585px; width: overflow-y: scroll; background-color: #888; padding: 10px; border: 2px solid black;"> 
                {prop.messages.map((msg, index) => (
                    <div key={index} style="padding: 5px; border-bottom: 1px solid #ddd;">
                        {msg.content}
                    </div>
                ))}
            </div>

            <div style="display: flex; align-items: center; margin-top: 10px;">  
                <textarea  
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
                    rows="2"
                    style= {{
                        width: '100%', 
                        padding: '10px', 
                        border: '1px solid #ccc', 
                        resize: 'none', // Prevent manual resizing
                        overflow: 'hidden',
                        borderRadius: '4px',
                        marginRight: '100px', // Space between textarea and button
                        boxSizing: 'border-box'
                    }}
                />
                <button 
                onClick={sendChatMessage} 
                type="submit" 
                style={{
                    padding: '8px 16px', 
                    backgroundColor: '#888', 
                    color: 'white', 
                    border: 'none', 
                    cursor: 'pointer',
                    borderRadius: '4px'
                    }}
                >                    
                    Send
                </button>
            </div>    
        </div>
    );
};

export default Chat;