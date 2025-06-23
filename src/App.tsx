import React, { useCallback, useState } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type Edge,
  type NodeTypes,
  ConnectionMode,
  MarkerType,
} from "reactflow";

import "reactflow/dist/style.css";
import "./App.css";

// Custom node types
import TextGenerationNode from "./components/TextGenerationNode.tsx";
import ImageGenerationNode from "./components/ImageGenerationNode.tsx";
import VideoGenerationNode from "./components/VideoGenerationNode.tsx";
import SequenceNode from "./components/SequenceNode";
import ConditionalNode from "./components/ConditionalNode";
import OutputNode from "./components/OutputNode";
import VoiceOverNode from "./components/VoiceOverNode";
import EffectsNode from "./components/EffectsNode";
import SceneViewNode from "./components/SceneViewNode";
import GrayscaleNode from "./components/GrayscaleNode";
import BrightnessNode from "./components/BrightnessNode";
import RotationNode from "./components/RotationNode";
import PromptEnhanceNode from "./components/PromptEnhanceNode";
import ImagePreviewNode from "./components/ImagePreviewNode";
import PromptNode from "./components/PromptNode";
import ImageSettingsNode from "./components/ImageSettingsNode";

const nodeTypes: NodeTypes = {
  textGeneration: TextGenerationNode,
  imageGeneration: ImageGenerationNode,
  videoGeneration: VideoGenerationNode,
  sequence: SequenceNode,
  conditional: ConditionalNode,
  output: OutputNode,
  voiceOver: VoiceOverNode,
  effects: EffectsNode,
  sceneView: SceneViewNode,
  grayscale: GrayscaleNode,
  brightness: BrightnessNode,
  rotation: RotationNode,
  promptEnhance: PromptEnhanceNode,
  imagePreview: ImagePreviewNode,
  prompt: PromptNode,
  imageSettings: ImageSettingsNode,
};

const initialNodes: any[] = [];

const initialEdges: Edge[] = [];

type Mode = "workflow" | "sceneBuilder";
type SceneType = "image";
type SceneStyle =
  | "comic_book"
  | "movie"
  | "documentary"
  | "anime"
  | "realistic";

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [nodeId, setNodeId] = useState(3);
  const [mode, setMode] = useState<Mode>("workflow");

  // Scene Builder state
  const [sceneStyle, setSceneStyle] = useState<SceneStyle>("movie");
  const [scenes, setScenes] = useState<any[]>([]);
  const [activeNodeTab, setActiveNodeTab] = useState<
    "generation" | "processing" | "logic"
  >("generation");

  const onConnect = useCallback(
    (params: Edge | Connection) => {
      const newEdge = {
        ...params,
        type: "smoothstep",
        animated: true,
        style: {
          stroke: "#666",
          strokeWidth: 2,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: "#666",
        },
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges]
  );

  const addNode = (nodeType: string) => {
    // Special handling for image generation - create a 3-node workflow
    if (nodeType === "imageGeneration") {
      const basePosition = {
        x: Math.random() * 500 + 300,
        y: Math.random() * 400 + 200,
      };

      let currentId = nodeId;
      const promptId = currentId.toString();
      const settingsId = (currentId + 1).toString();
      const previewId = (currentId + 2).toString();

      const newNodes = [
        {
          id: promptId,
          type: "prompt",
          position: basePosition,
          data: { label: "Image Prompt", deleteNode },
        },
        {
          id: settingsId,
          type: "imageSettings",
          position: { x: basePosition.x + 300, y: basePosition.y },
          data: { label: "Image Settings", deleteNode },
        },
        {
          id: previewId,
          type: "imagePreview",
          position: { x: basePosition.x + 600, y: basePosition.y },
          data: { label: "Image Preview", addConnectedNode, deleteNode },
        },
      ];

      const newEdges = [
        {
          id: `e-${promptId}-${settingsId}`,
          source: promptId,
          target: settingsId,
          type: "smoothstep",
          animated: true,
          style: {
            stroke: "#666",
            strokeWidth: 2,
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: "#666",
          },
        },
        {
          id: `e-${settingsId}-${previewId}`,
          source: settingsId,
          target: previewId,
          type: "smoothstep",
          animated: true,
          style: {
            stroke: "#666",
            strokeWidth: 2,
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: "#666",
          },
        },
      ];

      setNodes((nds) => nds.concat(newNodes));
      setEdges((eds) => eds.concat(newEdges));
      setNodeId(currentId + 3);
      return;
    }

    // Regular single node handling for all other node types
    const position = {
      x: Math.random() * 500 + 300,
      y: Math.random() * 400 + 200,
    };

    const newNode = {
      id: nodeId.toString(),
      type: nodeType,
      position,
      data: {
        label:
          nodeType === "textGeneration"
            ? "Text Generator"
            : nodeType === "videoGeneration"
            ? "Video Generator"
            : nodeType === "sequence"
            ? "Sequence Controller"
            : nodeType === "conditional"
            ? "Conditional Logic"
            : nodeType === "grayscale"
            ? "Grayscale Filter"
            : nodeType === "brightness"
            ? "Brightness Adjust"
            : nodeType === "rotation"
            ? "Rotation"
            : nodeType === "promptEnhance"
            ? "Prompt Enhance"
            : nodeType === "imagePreview"
            ? "Image Preview"
            : "Output Node",
        nodeId: nodeId.toString(),
        addConnectedNode,
        deleteNode,
      },
    };

    setNodes((nds) => nds.concat(newNode));
    setNodeId((id) => id + 1);
  };

  const deleteNode = useCallback(
    (nodeIdToDelete: string) => {
      setNodes((nds) => nds.filter((node) => node.id !== nodeIdToDelete));
      setEdges((eds) =>
        eds.filter(
          (edge) =>
            edge.source !== nodeIdToDelete && edge.target !== nodeIdToDelete
        )
      );
    },
    [setNodes, setEdges]
  );

  const clearWorkflow = () => {
    setNodes([]);
    setEdges([]);
    setNodeId(1);
  };

  const createSceneBuilder = () => {
    setMode("sceneBuilder");
    // Don't clear scenes when switching to scene builder
    if (mode === "workflow") {
      clearWorkflow();
    }
  };

  const backToWorkflow = () => {
    setMode("workflow");
    clearWorkflow();
    setNodeId(1);
    // Clear scenes when going back to workflow
    setScenes([]);
  };

  const addConnectedNode = (
    edgeIdToRemove: string,
    sourceNodeId: string,
    targetNodeId: string,
    nodeType: string
  ) => {
    const sourceNode = nodes.find((n) => n.id === sourceNodeId);
    if (!sourceNode) return;

    const newNodeId = nodeId.toString();
    const newNode = {
      id: newNodeId,
      type: nodeType,
      position: {
        x: sourceNode.position.x + 300,
        y: sourceNode.position.y + 75,
      },
      data: {
        label:
          nodeType === "grayscale"
            ? "Grayscale"
            : nodeType === "brightness"
            ? "Brightness"
            : nodeType === "rotation"
            ? "Rotation"
            : "Filter",
      },
    };

    const edgeToNewNode = {
      id: `e-${sourceNodeId}-${newNodeId}`,
      source: sourceNodeId,
      target: newNodeId,
      type: "smoothstep",
      animated: true,
    };

    const edgeFromNewNode = {
      id: `e-${newNodeId}-${targetNodeId}`,
      source: newNodeId,
      target: targetNodeId,
      type: "smoothstep",
      animated: true,
    };

    setNodes((nds) => nds.concat(newNode));
    setEdges((eds) => {
      const filteredEdges = eds.filter((e) => e.id !== edgeIdToRemove);
      return [...filteredEdges, edgeToNewNode, edgeFromNewNode];
    });
    setNodeId((id) => id + 1);
  };

  const deleteScene = (sceneId: number) => {
    const sceneToDelete = scenes.find((scene) => scene.id === sceneId);
    if (!sceneToDelete) return;

    // Remove all nodes associated with this scene
    setNodes((nds) =>
      nds.filter((node) => !sceneToDelete.nodes.includes(node.id))
    );

    // Remove all edges connected to those nodes
    setEdges((eds) =>
      eds.filter(
        (edge) =>
          !sceneToDelete.nodes.includes(edge.source) &&
          !sceneToDelete.nodes.includes(edge.target)
      )
    );

    // Remove the scene from the scenes array
    setScenes((prev) => prev.filter((scene) => scene.id !== sceneId));
  };

  const addScene = () => {
    const sceneNumber = scenes.length + 1;
    const baseY = 150 + scenes.length * 400;
    let currentId = nodeId;

    // Node IDs
    const voiceId = `voice-${currentId++}`;
    const promptId = `prompt-${currentId++}`;
    const settingsId = `settings-${currentId++}`;
    const previewId = `preview-${currentId++}`;
    const effectsId = `effects-${currentId++}`;
    const sceneViewId = `scene-view-${currentId++}`;

    const newNodes = [
      // Voice Over Track
      {
        id: voiceId,
        type: "voiceOver",
        position: { x: 100, y: baseY },
        data: { label: "Voice Over", sceneNumber, deleteNode },
      },
      // Image Generation Track
      {
        id: promptId,
        type: "prompt",
        position: { x: 100, y: baseY + 150 },
        data: { label: "Image Prompt", deleteNode },
      },
      {
        id: settingsId,
        type: "imageSettings",
        position: { x: 400, y: baseY + 150 },
        data: { label: "Image Settings", deleteNode },
      },
      {
        id: previewId,
        type: "imagePreview",
        position: { x: 750, y: baseY + 100 },
        data: { label: `Image Preview`, addConnectedNode, deleteNode },
      },
      // Effects Track
      {
        id: effectsId,
        type: "effects",
        position: { x: 400, y: baseY + 300 },
        data: { label: "Effects", sceneNumber, deleteNode },
      },
      // Final Scene View
      {
        id: sceneViewId,
        type: "sceneView",
        position: { x: 1100, y: baseY + 100 },
        data: { label: `Scene ${sceneNumber} View` },
      },
    ];

    const newEdges = [
      // Image pipeline edges
      {
        id: `e-${promptId}-${settingsId}`,
        source: promptId,
        target: settingsId,
        type: "smoothstep",
        animated: true,
      },
      {
        id: `e-${settingsId}-${previewId}`,
        source: settingsId,
        target: previewId,
        targetHandle: "a",
        type: "smoothstep",
        animated: true,
      },
      // Connections to final Scene View
      {
        id: `e-${voiceId}-${sceneViewId}`,
        source: voiceId,
        target: sceneViewId,
        type: "smoothstep",
        animated: true,
      },
      {
        id: `e-${previewId}-${sceneViewId}`,
        source: previewId,
        sourceHandle: "b",
        target: sceneViewId,
        type: "smoothstep",
        animated: true,
      },
      {
        id: `e-${effectsId}-${sceneViewId}`,
        source: effectsId,
        target: sceneViewId,
        type: "smoothstep",
        animated: true,
      },
    ];

    setNodes((nds) => nds.concat(newNodes));
    setEdges((eds) => eds.concat(newEdges));
    setNodeId(currentId);

    setScenes((prev) => [
      ...prev,
      {
        id: sceneNumber,
        type: "image",
        style: sceneStyle,
        nodes: newNodes.map((n) => n.id),
      },
    ]);
  };

  return (
    <div className="flex h-screen w-full bg-gray-900">
      {/* Sidebar */}
      <div className="w-72 bg-gray-800 border-r border-gray-700 p-4 overflow-y-auto">
        {/* Mode Toggle */}
        <div className="mb-6">
          <div className="flex bg-gray-700 rounded-lg p-1">
            <button
              onClick={backToWorkflow}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                mode === "workflow"
                  ? "bg-gray-600 text-white shadow-sm"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Workflow
            </button>
            <button
              onClick={createSceneBuilder}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                mode === "sceneBuilder"
                  ? "bg-gray-600 text-white shadow-sm"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Scene Builder
            </button>
          </div>
        </div>

        {mode === "workflow" ? (
          /* Workflow Mode */
          <div className="space-y-4">
            <h2 className="text-white text-lg font-semibold">Node Library</h2>

            {/* Node Tabs */}
            <div className="flex bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setActiveNodeTab("generation")}
                className={`flex-1 py-1 px-2 rounded text-xs font-medium transition-colors ${
                  activeNodeTab === "generation"
                    ? "bg-gray-600 text-white"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                Generation
              </button>
              <button
                onClick={() => setActiveNodeTab("processing")}
                className={`flex-1 py-1 px-2 rounded text-xs font-medium transition-colors ${
                  activeNodeTab === "processing"
                    ? "bg-gray-600 text-white"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                Processing
              </button>
              <button
                onClick={() => setActiveNodeTab("logic")}
                className={`flex-1 py-1 px-2 rounded text-xs font-medium transition-colors ${
                  activeNodeTab === "logic"
                    ? "bg-gray-600 text-white"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                Logic
              </button>
            </div>

            {/* Node Content */}
            {activeNodeTab === "generation" && (
              <div className="space-y-2">
                <button
                  onClick={() => addNode("textGeneration")}
                  className="w-full p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-left transition-colors"
                >
                  📝 Text Generation
                </button>
                <button
                  onClick={() => addNode("imageGeneration")}
                  className="w-full p-3 bg-green-600 hover:bg-green-700 text-white rounded-lg text-left transition-colors"
                >
                  🎨 Image Generation
                </button>
                <button
                  onClick={() => addNode("videoGeneration")}
                  className="w-full p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-left transition-colors"
                >
                  🎬 Video Generation
                </button>
                <button
                  onClick={() => addNode("promptEnhance")}
                  className="w-full p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-left transition-colors"
                >
                  ✨ Prompt Enhance
                </button>
              </div>
            )}

            {activeNodeTab === "processing" && (
              <div className="space-y-2">
                <button
                  onClick={() => addNode("grayscale")}
                  className="w-full p-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-left transition-colors"
                >
                  ⚫ Grayscale Filter
                </button>
                <button
                  onClick={() => addNode("brightness")}
                  className="w-full p-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-left transition-colors"
                >
                  ☀️ Brightness
                </button>
                <button
                  onClick={() => addNode("rotation")}
                  className="w-full p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-left transition-colors"
                >
                  🔄 Rotation
                </button>
                <button
                  onClick={() => addNode("imagePreview")}
                  className="w-full p-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-left transition-colors"
                >
                  👁️ Image Preview
                </button>
              </div>
            )}

            {activeNodeTab === "logic" && (
              <div className="space-y-2">
                <button
                  onClick={() => addNode("sequence")}
                  className="w-full p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-left transition-colors"
                >
                  🔄 Sequence Controller
                </button>
                <button
                  onClick={() => addNode("conditional")}
                  className="w-full p-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-left transition-colors"
                >
                  ⚡ Conditional Logic
                </button>
                <button
                  onClick={() => addNode("output")}
                  className="w-full p-3 bg-red-600 hover:bg-red-700 text-white rounded-lg text-left transition-colors"
                >
                  📤 Output Node
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Scene Builder Mode */
          <div className="space-y-4">
            <h2 className="text-white text-lg font-semibold">Scene Builder</h2>

            {/* Node Tabs for Scene Builder */}
            <div className="flex bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setActiveNodeTab("generation")}
                className={`flex-1 py-1 px-2 rounded text-xs font-medium transition-colors ${
                  activeNodeTab === "generation"
                    ? "bg-gray-600 text-white"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                Generation
              </button>
              <button
                onClick={() => setActiveNodeTab("processing")}
                className={`flex-1 py-1 px-2 rounded text-xs font-medium transition-colors ${
                  activeNodeTab === "processing"
                    ? "bg-gray-600 text-white"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                Processing
              </button>
            </div>

            {/* Quick Add Nodes for Scene Builder */}
            {activeNodeTab === "generation" && (
              <div className="space-y-2">
                <h3 className="text-gray-300 text-xs font-medium">
                  Quick Add:
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => addNode("imageGeneration")}
                    className="p-2 bg-green-600 hover:bg-green-700 text-white rounded text-xs transition-colors"
                  >
                    🎨 Image
                  </button>
                  <button
                    onClick={() => addNode("promptEnhance")}
                    className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs transition-colors"
                  >
                    ✨ Prompt
                  </button>
                </div>
              </div>
            )}

            {activeNodeTab === "processing" && (
              <div className="space-y-2">
                <h3 className="text-gray-300 text-xs font-medium">
                  Processing:
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => addNode("grayscale")}
                    className="p-2 bg-gray-600 hover:bg-gray-700 text-white rounded text-xs transition-colors"
                  >
                    ⚫ Gray
                  </button>
                  <button
                    onClick={() => addNode("brightness")}
                    className="p-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded text-xs transition-colors"
                  >
                    ☀️ Bright
                  </button>
                  <button
                    onClick={() => addNode("rotation")}
                    className="p-2 bg-purple-600 hover:bg-purple-700 text-white rounded text-xs transition-colors"
                  >
                    🔄 Rotate
                  </button>
                  <button
                    onClick={() => addNode("imagePreview")}
                    className="p-2 bg-orange-600 hover:bg-orange-700 text-white rounded text-xs transition-colors"
                  >
                    👁️ View
                  </button>
                </div>
              </div>
            )}

            <div className="border-t border-gray-600 pt-3 space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Sequence Style
                </label>
                <select
                  value={sceneStyle}
                  onChange={(e) => setSceneStyle(e.target.value as SceneStyle)}
                  className="w-full p-2 border border-gray-600 bg-gray-700 text-white rounded-md text-sm"
                >
                  <option value="movie">Movie</option>
                  <option value="comic_book">Comic Book</option>
                  <option value="documentary">Documentary</option>
                  <option value="anime">Anime</option>
                  <option value="realistic">Realistic</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Output Format
                </label>
                <select className="w-full p-2 border border-gray-600 bg-gray-700 text-white rounded-md text-sm">
                  <option value="mp4">MP4 Video</option>
                  <option value="gif">GIF Animation</option>
                  <option value="webm">WebM Video</option>
                  <option value="images">Image Sequence</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Total Duration
                </label>
                <input
                  type="text"
                  defaultValue="Auto"
                  className="w-full p-2 border border-gray-600 bg-gray-700 text-white rounded-md text-sm"
                  placeholder="e.g., 2m, 30s, Auto"
                />
              </div>

              <button
                onClick={() => addScene()}
                className="w-full p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                ➕ Add Image Scene
              </button>

              {scenes.length > 0 && (
                <button
                  onClick={() => {
                    /* TODO: Generate sequence */
                  }}
                  className="w-full p-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                >
                  🚀 Generate Sequence
                </button>
              )}
            </div>

            {scenes.length > 0 && (
              <div className="border-t border-gray-600 pt-4">
                <h3 className="text-gray-300 text-sm font-medium mb-2">
                  Scenes ({scenes.length})
                </h3>
                <div className="space-y-2">
                  {scenes.map((scene) => (
                    <div
                      key={scene.id}
                      className="bg-gray-700 p-2 rounded text-sm"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-white">
                            Scene {scene.id}
                          </div>
                          <div className="text-gray-300">
                            Image • {sceneStyle}
                          </div>
                        </div>
                        <button
                          onClick={() => deleteScene(scene.id)}
                          className="p-1 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded transition-colors"
                          title="Delete scene"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-white text-xl font-bold">
              {mode === "workflow" ? "🔧 Workflow Editor" : "🎬 Scene Builder"}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-300 text-sm">Nodes: {nodes.length}</span>
            <span className="text-gray-300 text-sm">
              Connections: {edges.length}
            </span>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            connectionMode={ConnectionMode.Loose}
            className="bg-gray-900"
            fitView
            defaultViewport={{ x: 0, y: 0, zoom: 0.5 }}
          >
            <Controls className="!bg-gray-800 !border-gray-700" />
            <MiniMap
              className="!bg-gray-800 !border-gray-700"
              nodeColor="#374151"
              maskColor="rgba(0, 0, 0, 0.2)"
            />
            <Background color="#374151" gap={20} size={2} />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}

export default App;
