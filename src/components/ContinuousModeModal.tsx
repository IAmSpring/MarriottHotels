import React from 'react';
import { X } from 'lucide-react';

interface ContinuousModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

const ContinuousModeModal: React.FC<ContinuousModeModalProps> = ({ isOpen, onClose, onAccept }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
        
        <h2 className="text-2xl font-bold text-[#8B1538] mb-4">
          🎙️ Voice Assistant Mode
        </h2>
        
        <div className="space-y-4 text-gray-700">
          <p>
            Voice assistant mode enables hands-free interaction with your Marriott AI assistant using wake words, similar to popular voice assistants.
          </p>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">How it works:</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>Say any wake word to start:
                <ul className="list-none pl-6 pt-1 text-gray-600">
                  <li>• "Hey Bonvoy"</li>
                  <li>• "Hey Marriott"</li>
                  <li>• "Hey Concierge"</li>
                </ul>
              </li>
              <li>The assistant will start listening after hearing a wake word</li>
              <li>Automatically stops when you pause speaking</li>
              <li>Processes your request and responds via voice</li>
              <li>Returns to wake word detection, ready for your next request</li>
            </ul>
          </div>
          
          <p className="text-sm text-gray-500">
            You can toggle this mode on/off at any time using the 🔄 button. A blue indicator shows when it's listening for wake words, and red when recording your request.
          </p>
        </div>
        
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Maybe Later
          </button>
          <button
            onClick={() => {
              onAccept();
              onClose();
            }}
            className="px-4 py-2 bg-[#8B1538] text-white rounded-lg hover:bg-[#6d102c] transition-colors"
          >
            Enable Voice Assistant
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContinuousModeModal; 