import React from "react";
import { Handle, Position } from "reactflow";

interface ImagePreviewNodeProps {
  data: {
    label: string;
    deleteNode?: (nodeId: string) => void;
    uploadedImage?: string | null;
    showImage?: boolean;
    brightness?: number;
    contrast?: number;
    grayscale?: number;
    saturation?: number;
    rotation?: number;
    blur?: number;
    scale?: number;
  };
  id: string;
}

const ImagePreviewNode: React.FC<ImagePreviewNodeProps> = ({ data, id }) => {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-purple-200 min-w-80">
      <Handle
        type="target"
        position={Position.Left}
        id="a"
        className="w-3 h-3 bg-purple-500"
      />
      <div className="flex flex-col">
        <div className="text-lg font-bold text-purple-800 mb-2 flex items-center justify-between">
          <span>{data.label}</span>
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

        <div className="w-full h-64 border-2 border-dashed border-gray-300 rounded flex items-center justify-center bg-gray-50">
          {data.uploadedImage && data.showImage ? (
            <img
              src={data.uploadedImage}
              alt="Live Preview"
              className="max-w-full max-h-full object-contain"
              style={{
                filter: `brightness(${data.brightness || 100}%) contrast(${
                  data.contrast || 100
                }%) grayscale(${data.grayscale || 0}%) saturate(${
                  data.saturation || 100
                }%) blur(${data.blur || 0}px)`,
                transform: `rotate(${data.rotation || 0}deg) scale(${
                  (data.scale || 100) / 100
                })`,
              }}
            />
          ) : (
            <span className="text-gray-400 text-sm">
              {data.uploadedImage
                ? "Click Generate to see preview"
                : "Upload an image to see preview"}
            </span>
          )}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        id="b"
        className="w-3 h-3 bg-purple-500"
      />
    </div>
  );
};

export default ImagePreviewNode;
