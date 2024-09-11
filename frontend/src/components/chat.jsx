import { LAR } from "../framework";
import { StartClientWebsocket, ws } from '../websocket.js'

const Chat = () => {
    console.log("türakott")
    const [messages, setMessages] = LAR.useState([]);  
    // const [currentMessage, setCurrentMessage] = LAR.useState(""); 


/*     ws.onmessage = (event) => {
        console.log("Received message:", event.data);
        try{
        const messageData = JSON.parse(event.data);
        console.log('loll',messageData)
        // Update messages array with the new message
        setMessages((prevMessages) => [...prevMessages, messageData]);
        } catch (e) {
            console.error("Error parsing message data:", e)
        }
    }; */

    // Handle sending messages
    const sendMessage = (event) => {
        event.preventDefault(); // Prevent form reload
        const message = {
            type: "chat_message", 
            content: currentMessage // current message input by the user
        };
        ws.send(JSON.stringify(message)); // Send message over WebSocket

        setCurrentMessage(""); // Clear input after sending
    };

    return (
        <div style="padding: 10px; border: 1px solid black; width: 300px;">
            <div style="height: 300px; width: overflow-y: scroll; background-color: #f0f0f0; padding: 10px; border: 1px solid #ccc;"> 
                {messages.map((msg, index) => (
                    <div key={index} style="padding: 5px; border-bottom: 1px solid #ddd;">
                        {msg.content}
                    </div>
                ))} {/* Render chat messages */}
            </div>
            <form onSubmit={sendMessage} style="margin-top: 10px;">
                <input 
                    type="text" 
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    placeholder="Type a message..."
                    style="width: 283px; padding: 8px; border: 1px solid #ccc; margin-bottom: 5px;"
                />
                <button type="submit" style="padding: 8px 16px; background-color: #007bff; color: white; border: none; cursor: pointer;">
                    Send
                </button>
            </form>
        </div>
    );
};
export default Chat;