import React, { useState } from "react";
import { Handle, Position } from "reactflow";

interface VoiceOverNodeProps {
  data: {
    label: string;
    sceneNumber?: number;
    nodeType?: string;
    duration?: string;
    voice?: string;
    style?: string;
    deleteNode?: (nodeId: string) => void;
  };
  id: string;
}

const VoiceOverNode: React.FC<VoiceOverNodeProps> = ({ data, id }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAudioUrl, setGeneratedAudioUrl] = useState("");

  const handleGenerate = async () => {
    setIsGenerating(true);
    // Simulate API call
    setTimeout(() => {
      setGeneratedAudioUrl("sample-audio.mp3");
      setIsGenerating(false);
    }, 2500);
  };

  return (
    <div className="px-4 py-3 shadow-md rounded-md bg-white border-2 border-blue-200 min-w-48">
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-blue-500"
      />

      <div className="flex flex-col">
        <div className="text-lg font-bold text-blue-800 mb-2 flex items-center justify-between">
          <div className="flex items-center">
            <span className="mr-2">🎙️</span>
            {data.label}
            {data.sceneNumber && (
              <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                Scene {data.sceneNumber}
              </span>
            )}
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
            <label className="block text-sm font-medium text-gray-700">
              Duration:
            </label>
            <input
              type="text"
              defaultValue={data.duration || "30s"}
              className="w-full p-2 border rounded text-sm"
              placeholder="e.g., 30s, 1m"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Voice:
            </label>
            <select
              className="w-full p-2 border rounded text-sm"
              defaultValue={data.voice || "professional"}
            >
              <option value="professional">Professional</option>
              <option value="casual">Casual</option>
              <option value="dramatic">Dramatic</option>
              <option value="cheerful">Cheerful</option>
              <option value="authoritative">Authoritative</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Style:
            </label>
            <select
              className="w-full p-2 border rounded text-sm"
              defaultValue={data.style || "narration"}
            >
              <option value="narration">Narration</option>
              <option value="dialogue">Dialogue</option>
              <option value="voiceover">Voice Over</option>
              <option value="announcement">Announcement</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Script/Prompt:
            </label>
            <textarea
              className="w-full p-2 border rounded text-sm"
              placeholder="Enter the script or prompt for voice generation..."
              rows={3}
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className={`w-full py-2 px-3 rounded text-sm font-medium transition-colors ${
              isGenerating
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {isGenerating ? "⏳ Generating..." : "🎙️ Generate Voice"}
          </button>

          {generatedAudioUrl && (
            <div className="mt-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preview:
              </label>
              <div className="w-full p-2 border rounded text-sm bg-gray-50 flex items-center justify-between">
                <span className="text-xs">🎵 Voice generated</span>
                <button className="text-blue-600 hover:text-blue-800 text-xs">
                  ▶ Play
                </button>
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

export default VoiceOverNode;
