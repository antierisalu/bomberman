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
        <div className= "chat-container">
            <div className="chat-messages">
                {prop.messages.map((msg, index) => (
                    <div key={index} className="messages">
                        {msg.content}
                    </div>
                ))}
            </div>

            <div className="input-container">
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


/* import { LAR } from "../framework";
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
                        width: '30px',
                        height: '30px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        backgroundImage: 'url("../../assets/bomb.png")', 
                        backgroundSize: 'cover',
                        backgroundPosition: 'center', 
                        backgroundRepeat: 'no-repeat',
                    }}
                >
                </button>
            </div>    
        </div>
    );
};

export default Chat; */