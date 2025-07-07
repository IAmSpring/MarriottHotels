import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, User, Clock, ThumbsUp, ThumbsDown, Filter, Download, Search } from 'lucide-react';

interface Message {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  timestamp: string;
  rating?: 'positive' | 'negative';
}

interface Conversation {
  id: string;
  userId: string;
  userName: string;
  startTime: string;
  lastActive: string;
  messages: Message[];
  status: 'active' | 'completed';
  topic: string;
  assistantId: string;
}

// Mock conversation data - all conversations
const mockConversations: Conversation[] = [
  {
    id: 'conv_1',
    userId: 'user_123',
    userName: 'John Smith',
    startTime: '2024-03-27 10:15',
    lastActive: '2024-03-27 10:30',
    status: 'completed',
    topic: 'Room Service Inquiry',
    assistantId: 'asst_1',
    messages: [
      {
        id: 'msg_1',
        role: 'user',
        content: "I'd like to order room service for dinner tonight.",
        timestamp: '2024-03-27 10:15',
      },
      {
        id: 'msg_2',
        role: 'assistant',
        content: "I'd be happy to help you with room service. Our dinner menu is available from 6 PM to 11 PM. Would you like me to share the menu with you?",
        timestamp: '2024-03-27 10:15',
        rating: 'positive',
      },
      {
        id: 'msg_3',
        role: 'user',
        content: 'Yes, please show me the menu.',
        timestamp: '2024-03-27 10:16',
      },
      {
        id: 'msg_4',
        role: 'assistant',
        content: "Here's our dinner menu:\n\n🍽️ Main Courses:\n- Grilled Salmon ($32)\n- Filet Mignon ($45)\n- Vegetarian Pasta ($28)\n\n🥗 Starters:\n- Caesar Salad ($14)\n- Soup of the Day ($12)\n\nWould you like to place an order?",
        timestamp: '2024-03-27 10:16',
        rating: 'positive',
      },
    ],
  },
  {
    id: 'conv_2',
    userId: 'user_456',
    userName: 'Emma Wilson',
    startTime: '2024-03-27 11:00',
    lastActive: '2024-03-27 11:10',
    status: 'completed',
    topic: 'Spa Booking Request',
    assistantId: 'asst_1',
    messages: [
      {
        id: 'msg_5',
        role: 'user',
        content: "I'd like to book a spa treatment for tomorrow.",
        timestamp: '2024-03-27 11:00',
      },
      {
        id: 'msg_6',
        role: 'assistant',
        content: "I'll help you book a spa treatment. We offer various services including massages, facials, and body treatments. What type of treatment are you interested in?",
        timestamp: '2024-03-27 11:00',
        rating: 'positive',
      },
    ],
  },
  {
    id: 'conv_3',
    userId: 'user_789',
    userName: 'Michael Brown',
    startTime: '2024-03-27 14:30',
    lastActive: '2024-03-27 14:45',
    status: 'completed',
    topic: 'Hotel Booking Inquiry',
    assistantId: 'asst_1',
    messages: [
      {
        id: 'msg_7',
        role: 'user',
        content: "I need to book a room for next weekend in Miami Beach.",
        timestamp: '2024-03-27 14:30',
      },
      {
        id: 'msg_8',
        role: 'assistant',
        content: "I can help you find the perfect hotel in Miami Beach. What dates are you looking for and how many guests?",
        timestamp: '2024-03-27 14:30',
        rating: 'positive',
      },
      {
        id: 'msg_9',
        role: 'user',
        content: "August 1st to 5th, 2 adults.",
        timestamp: '2024-03-27 14:31',
      },
      {
        id: 'msg_10',
        role: 'assistant',
        content: "Perfect! I found several great options for you. The Ritz-Carlton Miami Beach has availability for those dates at $420/night. Would you like me to show you more details?",
        timestamp: '2024-03-27 14:32',
        rating: 'positive',
      },
    ],
  },
];

const ConversationList: React.FC<{ conversations: Conversation[], onSelect: (conv: Conversation) => void }> = ({ conversations, onSelect }) => (
  <div className="bg-white rounded-lg shadow">
    <div className="p-4 border-b">
      <div className="flex items-center gap-4 mb-4">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
        </div>
        <button className="p-2 text-gray-600 hover:text-[#8B1538] hover:bg-gray-100 rounded">
          <Filter className="w-5 h-5" />
        </button>
        <button className="p-2 text-gray-600 hover:text-[#8B1538] hover:bg-gray-100 rounded">
          <Download className="w-5 h-5" />
        </button>
      </div>
    </div>
    <div className="divide-y">
      {conversations.map((conv) => (
        <div
          key={conv.id}
          onClick={() => onSelect(conv)}
          className="p-4 hover:bg-gray-50 cursor-pointer"
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium">{conv.userName}</h3>
            <span className="text-sm text-gray-500">{conv.lastActive}</span>
          </div>
          <p className="text-sm text-gray-600 mb-2">{conv.topic}</p>
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-1" />
            <span>{conv.startTime}</span>
            <span className={`ml-3 px-2 py-0.5 rounded-full text-xs ${
              conv.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {conv.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const MessageThread: React.FC<{ conversation: Conversation }> = ({ conversation }) => (
  <div className="bg-white rounded-lg shadow h-full">
    <div className="p-4 border-b">
      <h2 className="text-xl font-semibold mb-1">{conversation.topic}</h2>
      <p className="text-sm text-gray-500">with {conversation.userName}</p>
    </div>
    <div className="p-4 space-y-6 max-h-[600px] overflow-y-auto">
      {conversation.messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
        >
          <div className={`flex max-w-[80%] ${message.role === 'assistant' ? 'flex-row' : 'flex-row-reverse'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              message.role === 'assistant' ? 'bg-[#8B1538] text-white mr-3' : 'bg-blue-100 text-blue-800 ml-3'
            }`}>
              {message.role === 'assistant' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
            </div>
            <div>
              <div className={`p-3 rounded-lg ${
                message.role === 'assistant' ? 'bg-gray-100' : 'bg-blue-100'
              }`}>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
              <div className={`mt-1 flex items-center text-xs text-gray-500 ${
                message.role === 'assistant' ? 'justify-start' : 'justify-end'
              }`}>
                <span>{message.timestamp}</span>
                {message.rating && (
                  <span className="ml-2">
                    {message.rating === 'positive' ? (
                      <ThumbsUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <ThumbsDown className="w-4 h-4 text-red-600" />
                    )}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ConversationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

  if (mockConversations.length === 0) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-semibold mb-4">No conversations found</h2>
        <p className="text-gray-600">No conversations have been recorded yet.</p>
        <button
          onClick={() => navigate('/admin/ai')}
          className="mt-4 px-4 py-2 bg-[#8B1538] text-white rounded-lg hover:bg-[#6d102c]"
        >
          Back to AI Dashboard
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Conversations</h1>
            <p className="text-gray-600">View and manage assistant conversations</p>
          </div>
          <button
            onClick={() => navigate('/admin/ai')}
            className="px-4 py-2 bg-[#8B1538] text-white rounded-lg hover:bg-[#6d102c]"
          >
            Back to AI Dashboard
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ConversationList
          conversations={mockConversations}
          onSelect={setSelectedConversation}
        />
        {selectedConversation ? (
          <MessageThread conversation={selectedConversation} />
        ) : (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <Bot className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
            <p className="text-gray-600">Choose a conversation from the list to view the message thread.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationsPage; 