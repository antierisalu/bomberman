import { LAR } from "../framework";
import { StartClientWebsocket, ws } from '../websocket.js'

const Chat = () => {
    const [messages, setMessages] = LAR.useState([]);  
    const [currentMessage, setCurrentMessage] = LAR.useState(""); 

    // Handle sending messages
    const sendMessage = (event) => {
        event.preventDefault(); // Prevent form reload

        console.log('WebSocket readyState:', ws.readyState);
        console.log('Current Message:', currentMessage);

        if (ws && ws.readyState === 1 && currentMessage) {
        const message = {
            type: "chat_message", 
            content: currentMessage // current message input by the user
        };
        ws.send(JSON.stringify(message)); // Send message over WebSocket
        console.log('message sent:',message)

        setCurrentMessage(""); // Clear input after sending
        }else {
            console.log('websoket katki või sõnum tühi')
        }   
    };

    if (ws) {
        //gets triggered whenever a message is received from websocket server
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            // Handle chat messages from the server
            if (data.type === "chat_message") {
                console.log('receiced chat_message', data)
                setMessages((prevMessages) => [...prevMessages, data]); // Update chat messages
            }
        };
    }

    return (
        <div style="padding: 10px; border: 1px solid black; width: 300px;">
            <div style="height: 300px; width: overflow-y: scroll; background-color: #f0f0f0; padding: 10px; border: 1px solid #ccc;"> 
                {messages.map((msg, index) => (
                    <div key={index} style="padding: 5px; border-bottom: 1px solid #ddd;">
                        {msg.content}
                    </div>
                ))}
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