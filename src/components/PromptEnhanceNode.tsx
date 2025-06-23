import React, { useState, useRef } from "react";
import { Handle, Position } from "reactflow";

interface PromptEnhanceNodeProps {
  data: {
    label: string;
    deleteNode?: (nodeId: string) => void;
  };
  id: string;
}

const PromptEnhanceNode: React.FC<PromptEnhanceNodeProps> = ({ data, id }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedImage, setUploadedImage] = useState("");
  const [prompt, setPrompt] = useState("");
  const [enhancedPrompt, setEnhancedPrompt] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const enhancePrompt = () => {
    if (!prompt.trim()) return;

    setIsProcessing(true);

    // Simulate AI prompt enhancement
    setTimeout(() => {
      const enhancements = [
        "highly detailed",
        "8K resolution",
        "professional photography",
        "dramatic lighting",
        "vibrant colors",
        "cinematic composition",
      ];

      const randomEnhancements = enhancements
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .join(", ");

      setEnhancedPrompt(`${prompt}, ${randomEnhancements}`);
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <div className="px-4 py-3 shadow-md rounded-md bg-white border-2 border-blue-400 min-w-48">
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-blue-500"
      />

      <div className="flex flex-col">
        <div className="text-lg font-bold text-blue-800 mb-2 flex items-center justify-between">
          <div className="flex items-center">
            <span className="mr-2">✨</span>
            {data.label}
          </div>
          {data.deleteNode && (
            <button
              onClick={() => data.deleteNode!(id)}
              className="ml-2 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
              title="Delete node"
            >
              ✕
            </button>
          )}
        </div>

        <div className="space-y-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Reference Image:
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full p-2 border-2 border-dashed border-gray-300 rounded text-sm hover:border-blue-400 transition-colors"
            >
              {uploadedImage ? "✅ Image uploaded" : "📁 Choose image"}
            </button>

            {uploadedImage && (
              <img
                src={uploadedImage}
                alt="Reference"
                className="w-full h-16 object-cover rounded border mt-1"
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Base Prompt:
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full p-2 border rounded text-sm"
              placeholder="Enter your base prompt..."
              rows={2}
            />
          </div>

          <button
            onClick={enhancePrompt}
            disabled={isProcessing || !prompt.trim()}
            className={`w-full py-2 px-3 rounded text-sm font-medium transition-colors ${
              isProcessing || !prompt.trim()
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {isProcessing ? "⏳ Enhancing..." : "✨ Enhance Prompt"}
          </button>

          {enhancedPrompt && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Enhanced Prompt:
              </label>
              <div className="w-full p-2 border rounded text-sm bg-green-50 text-green-800">
                {enhancedPrompt}
              </div>
            </div>
          )}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-blue-500"
      />
    </div>
  );
};

export default PromptEnhanceNode;
