import React, { useRef } from 'react';
import { IoIosArrowUp } from "react-icons/io";

const ChatForm = ({ chatHistory, setChatHistory, generateResponse }) => {
    const inputRef = useRef();

    const handleSubmit = (e) => {
        e.preventDefault();
        const userMessage = inputRef.current.value.trim();
        if (!userMessage) return;

        inputRef.current.value = '';
        setChatHistory(prev => [...prev, { role: 'user', text: userMessage }]);

        // Add "Thinking..." message immediately
        setChatHistory(prev => [...prev, { role: 'model', text: 'Thinking...' }]);

        // Call the API with the updated history
        generateResponse([...chatHistory, {
            role: 'user', text:
                `Using the detailed provided above, please address this query:
             ${userMessage}`
        }]);
    };

    return (
        <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-gray-200 p-4 bg-white">
            <input
                type="text"
                placeholder="Type your message..."
                required
                ref={inputRef}
                className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            />
            <button 
                type="submit" 
                className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
                <IoIosArrowUp className="w-5 h-5" />
            </button>
        </form>
    );
};

export default ChatForm;