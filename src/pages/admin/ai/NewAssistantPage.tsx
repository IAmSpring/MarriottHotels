import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, X, Plus, Trash2, Save, ArrowLeft } from 'lucide-react';

interface Tool {
  type: string;
  description: string;
}

interface AssistantFormData {
  name: string;
  model: string;
  description: string;
  instructions: string;
  tools: Tool[];
}

const availableModels = [
  { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', description: 'Most capable model, best for complex tasks' },
  { id: 'gpt-4', name: 'GPT-4', description: 'Balanced performance and cost' },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: 'Fast and cost-effective' },
];

const availableTools = [
  { type: 'code_interpreter', description: 'Execute code and analyze data' },
  { type: 'retrieval', description: 'Access and search knowledge base' },
  { type: 'function', description: 'Call external APIs and services' },
];

const NewAssistantPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<AssistantFormData>({
    name: '',
    model: 'gpt-4-turbo',
    description: '',
    instructions: '',
    tools: [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically make an API call to create the assistant
    console.log('Creating assistant:', formData);
    navigate('/admin/ai/assistants');
  };

  const toggleTool = (tool: Tool) => {
    setFormData(prev => ({
      ...prev,
      tools: prev.tools.some(t => t.type === tool.type)
        ? prev.tools.filter(t => t.type !== tool.type)
        : [...prev.tools, tool],
    }));
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <button
          onClick={() => navigate('/admin/ai/assistants')}
          className="flex items-center text-gray-600 hover:text-[#8B1538]"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Assistants
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <div>
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-2xl font-semibold mb-6">Create New Assistant</h1>
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
                    placeholder="e.g., Concierge Assistant"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Model
                  </label>
                  <select
                    value={formData.model}
                    onChange={e => setFormData(prev => ({ ...prev, model: e.target.value }))}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
                  >
                    {availableModels.map(model => (
                      <option key={model.id} value={model.id}>
                        {model.name} - {model.description}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
                    placeholder="Brief description of the assistant's purpose"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instructions
                  </label>
                  <textarea
                    value={formData.instructions}
                    onChange={e => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent h-32"
                    placeholder="Detailed instructions for the assistant..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tools
                  </label>
                  <div className="space-y-2">
                    {availableTools.map(tool => (
                      <div
                        key={tool.type}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          formData.tools.some(t => t.type === tool.type)
                            ? 'border-[#8B1538] bg-[#8B1538] bg-opacity-5'
                            : 'border-gray-200 hover:border-[#8B1538]'
                        }`}
                        onClick={() => toggleTool(tool)}
                      >
                        <div className="flex items-center">
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                            formData.tools.some(t => t.type === tool.type)
                              ? 'border-[#8B1538] text-[#8B1538]'
                              : 'border-gray-400'
                          }`}>
                            {formData.tools.some(t => t.type === tool.type) && (
                              <Plus className="w-4 h-4" />
                            )}
                          </div>
                          <div className="ml-3">
                            <h3 className="font-medium">{tool.type}</h3>
                            <p className="text-sm text-gray-600">{tool.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => navigate('/admin/ai/assistants')}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#8B1538] text-white rounded-lg hover:bg-[#6d102c]"
                  >
                    Create Assistant
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Preview */}
        <div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Preview</h2>
            <div className="border rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-[#8B1538] text-white flex items-center justify-center mr-3">
                    <Bot className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      {formData.name || 'Assistant Name'}
                    </h3>
                    <p className="text-sm text-gray-600">{formData.model}</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                  Draft
                </span>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-1">Description</h4>
                <p className="text-sm text-gray-600">
                  {formData.description || 'No description provided'}
                </p>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-1">Instructions</h4>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">
                  {formData.instructions || 'No instructions provided'}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Tools</h4>
                <div className="flex flex-wrap gap-2">
                  {formData.tools.length > 0 ? (
                    formData.tools.map(tool => (
                      <span
                        key={tool.type}
                        className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700"
                      >
                        {tool.type}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No tools selected</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewAssistantPage; 