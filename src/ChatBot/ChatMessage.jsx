import { TbMessageChatbotFilled } from "react-icons/tb"

// import "./ChatBot.css"
const ChatMessage = ({ chat }) => {
    return (
        !chat.hideInChat && (
            <div className={`flex items-start gap-2 p-4 ${
                chat.role === 'model' 
                    ? 'bg-blue-50 rounded-tl-2xl rounded-tr-2xl rounded-br-2xl' 
                    : 'bg-gray-100 rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl ml-auto'
            }`}>
                {chat.role === 'model' && (
                    <div className="flex-shrink-0">
                        <TbMessageChatbotFilled className="w-6 h-6 text-blue-500" />
                    </div>
                )}
                <p className={`text-sm md:text-base ${
                    chat.role === 'model' ? 'text-gray-800' : 'text-gray-700'
                }`}>
                    {chat.text}
                </p>
            </div>
        )
    )
}

export default ChatMessage