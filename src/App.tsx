import React, { useCallback, useState, useEffect } from "react";
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
import BlurNode from "./components/BlurNode";
import SaturationNode from "./components/SaturationNode";
import ResizeNode from "./components/ResizeNode";

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
  blur: BlurNode,
  saturation: SaturationNode,
  resize: ResizeNode,
};

const initialNodes: any[] = [];
const initialEdges: Edge[] = [];

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
  const [nodeId, setNodeId] = useState(1);

  // Scene Builder state
  const [sceneStyle, setSceneStyle] = useState<SceneStyle>("movie");
  const [scenes, setScenes] = useState<any[]>([]);
  const [activeNodeTab, setActiveNodeTab] = useState<
    "generation" | "processing" | "logic"
  >("generation");

  // Image processing state
  const [sceneImages, setSceneImages] = useState<Record<number, string | null>>(
    {}
  );
  const [sceneImageStates, setSceneImageStates] = useState<
    Record<number, boolean>
  >({});

  // Scene-specific filter states
  const [sceneFilters, setSceneFilters] = useState<
    Record<
      number,
      {
        brightness: number;
        grayscale: number;
        rotation: number;
        blur: number;
        saturation: number;
        contrast: number;
        scale: number;
      }
    >
  >({});

  // Sequence generation state
  const [isGeneratingSequence, setIsGeneratingSequence] = useState(false);
  const [sequenceProgress, setSequenceProgress] = useState(0);
  const [generatedSequenceUrl, setGeneratedSequenceUrl] = useState<
    string | null
  >(null);

  // Helper functions to manage scene-specific filters
  const getSceneFilter = (
    sceneId: number,
    filterName: keyof (typeof sceneFilters)[number]
  ) => {
    return (
      sceneFilters[sceneId]?.[filterName] ??
      (filterName === "brightness" ||
      filterName === "contrast" ||
      filterName === "saturation" ||
      filterName === "scale"
        ? 100
        : 0)
    );
  };

  const setSceneFilter = (
    sceneId: number,
    filterName: keyof (typeof sceneFilters)[number],
    value: number
  ) => {
    setSceneFilters((prev) => ({
      ...prev,
      [sceneId]: {
        ...prev[sceneId],
        [filterName]: value,
      },
    }));
  };

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

  // Handle image upload
  const handleImageUpload = (imageUrl: string, sceneId?: number) => {
    setSceneImages((prev) => ({ ...prev, [sceneId || 0]: imageUrl }));
    if (sceneId) {
      setSceneImageStates((prev) => ({ ...prev, [sceneId]: false }));
    }
  };

  // Handle generate button click
  const handleGenerate = (sceneId?: number) => {
    if (sceneId) {
      setSceneImageStates((prev) => ({ ...prev, [sceneId]: true }));
    }
  };

  // Apply filters using CSS and Canvas (updated for scene-specific filters)
  const applyFilters = (sceneId: number) => {
    const sceneImage = sceneImages[sceneId];
    if (!sceneImage) {
      alert("Please upload an image first!");
      return;
    }

    const sceneFilter = sceneFilters[sceneId] || {
      brightness: 100,
      contrast: 100,
      grayscale: 0,
      saturation: 100,
      rotation: 0,
      blur: 0,
      scale: 100,
    };

    // Create canvas for processing
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      alert("Canvas context not available!");
      return;
    }

    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      // Apply rotation
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((sceneFilter.rotation * Math.PI) / 180);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);
      ctx.restore();

      // Get image data for pixel manipulation
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Apply brightness, contrast, grayscale, and saturation
      for (let i = 0; i < data.length; i += 4) {
        let r = data[i];
        let g = data[i + 1];
        let b = data[i + 2];

        // Apply brightness
        r = Math.min(255, Math.max(0, r * (sceneFilter.brightness / 100)));
        g = Math.min(255, Math.max(0, g * (sceneFilter.brightness / 100)));
        b = Math.min(255, Math.max(0, b * (sceneFilter.brightness / 100)));

        // Apply contrast
        const contrastFactor = sceneFilter.contrast / 100;
        r = Math.min(255, Math.max(0, (r - 128) * contrastFactor + 128));
        g = Math.min(255, Math.max(0, (g - 128) * contrastFactor + 128));
        b = Math.min(255, Math.max(0, (b - 128) * contrastFactor + 128));

        // Apply grayscale
        if (sceneFilter.grayscale > 0) {
          const gray = 0.299 * r + 0.587 * g + 0.114 * b;
          const grayFactor = sceneFilter.grayscale / 100;
          r = r * (1 - grayFactor) + gray * grayFactor;
          g = g * (1 - grayFactor) + gray * grayFactor;
          b = b * (1 - grayFactor) + gray * grayFactor;
        }

        // Apply saturation
        const saturationFactor = sceneFilter.saturation / 100;
        const avg = (r + g + b) / 3;
        r = avg + (r - avg) * saturationFactor;
        g = avg + (g - avg) * saturationFactor;
        b = avg + (b - avg) * saturationFactor;

        data[i] = Math.min(255, Math.max(0, r));
        data[i + 1] = Math.min(255, Math.max(0, g));
        data[i + 2] = Math.min(255, Math.max(0, b));
      }

      ctx.putImageData(imageData, 0, 0);

      // Convert to data URL
      const processedImageUrl = canvas.toDataURL("image/png");
      setSceneImages((prev) => ({ ...prev, [sceneId]: processedImageUrl }));
    };

    img.src = sceneImage;
  };

  // Reset all filters for a specific scene
  const resetFilters = (sceneId: number) => {
    setSceneFilters((prev) => ({
      ...prev,
      [sceneId]: {
        brightness: 100,
        grayscale: 0,
        rotation: 0,
        blur: 0,
        saturation: 100,
        contrast: 100,
        scale: 100,
      },
    }));
  };

  // Generate sequence from all scenes
  const generateSequence = async () => {
    if (scenes.length === 0) {
      alert("No scenes to generate sequence from!");
      return;
    }

    // Check if all scenes have images
    const scenesWithImages = scenes.filter(
      (scene) => sceneImages[scene.id] && sceneImageStates[scene.id]
    );

    if (scenesWithImages.length === 0) {
      alert("Please upload and generate images for at least one scene!");
      return;
    }

    setIsGeneratingSequence(true);
    setSequenceProgress(0);
    setGeneratedSequenceUrl(null);

    try {
      // Create canvas for sequence generation
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("Canvas context not available!");
      }

      // Set canvas size (you can adjust this)
      canvas.width = 1920;
      canvas.height = 1080;

      const imageUrls = scenesWithImages
        .map((scene) => sceneImages[scene.id])
        .filter(Boolean) as string[];

      // Create a simple image sequence (you can enhance this to create actual video)
      const sequenceCanvas = document.createElement("canvas");
      const sequenceCtx = sequenceCanvas.getContext("2d");

      if (!sequenceCtx) {
        throw new Error("Sequence canvas context not available!");
      }

      sequenceCanvas.width = canvas.width;
      sequenceCanvas.height = canvas.height * imageUrls.length;

      // Process each image
      for (let i = 0; i < imageUrls.length; i++) {
        const imageUrl = imageUrls[i];
        const sceneId = scenesWithImages[i].id;
        const filters = sceneFilters[sceneId] || {
          brightness: 100,
          contrast: 100,
          grayscale: 0,
          saturation: 100,
          rotation: 0,
          blur: 0,
          scale: 100,
        };

        // Load and process image
        await new Promise<void>((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
            try {
              // Clear canvas
              sequenceCtx.clearRect(0, 0, canvas.width, canvas.height);

              // Apply rotation
              sequenceCtx.save();
              sequenceCtx.translate(canvas.width / 2, canvas.height / 2);
              sequenceCtx.rotate((filters.rotation * Math.PI) / 180);

              // Calculate scaled dimensions
              const scale = filters.scale / 100;
              const scaledWidth = img.width * scale;
              const scaledHeight = img.height * scale;

              sequenceCtx.drawImage(
                img,
                -scaledWidth / 2,
                -scaledHeight / 2,
                scaledWidth,
                scaledHeight
              );
              sequenceCtx.restore();

              // Get image data for pixel manipulation
              const imageData = sequenceCtx.getImageData(
                0,
                0,
                canvas.width,
                canvas.height
              );
              const data = imageData.data;

              // Apply filters
              for (let j = 0; j < data.length; j += 4) {
                let r = data[j];
                let g = data[j + 1];
                let b = data[j + 2];

                // Apply brightness
                r = Math.min(255, Math.max(0, r * (filters.brightness / 100)));
                g = Math.min(255, Math.max(0, g * (filters.brightness / 100)));
                b = Math.min(255, Math.max(0, b * (filters.brightness / 100)));

                // Apply contrast
                const contrastFactor = filters.contrast / 100;
                r = Math.min(
                  255,
                  Math.max(0, (r - 128) * contrastFactor + 128)
                );
                g = Math.min(
                  255,
                  Math.max(0, (g - 128) * contrastFactor + 128)
                );
                b = Math.min(
                  255,
                  Math.max(0, (b - 128) * contrastFactor + 128)
                );

                // Apply grayscale
                if (filters.grayscale > 0) {
                  const gray = 0.299 * r + 0.587 * g + 0.114 * b;
                  const grayFactor = filters.grayscale / 100;
                  r = r * (1 - grayFactor) + gray * grayFactor;
                  g = g * (1 - grayFactor) + gray * grayFactor;
                  b = b * (1 - grayFactor) + gray * grayFactor;
                }

                // Apply saturation
                const saturationFactor = filters.saturation / 100;
                const avg = (r + g + b) / 3;
                r = avg + (r - avg) * saturationFactor;
                g = avg + (g - avg) * saturationFactor;
                b = avg + (b - avg) * saturationFactor;

                data[j] = Math.min(255, Math.max(0, r));
                data[j + 1] = Math.min(255, Math.max(0, g));
                data[j + 2] = Math.min(255, Math.max(0, b));
              }

              sequenceCtx.putImageData(imageData, 0, 0);

              // Copy to sequence canvas at the right position
              sequenceCtx.drawImage(canvas, 0, i * canvas.height);

              setSequenceProgress(((i + 1) / imageUrls.length) * 100);
              resolve();
            } catch (error) {
              reject(error);
            }
          };
          img.onerror = () =>
            reject(new Error(`Failed to load image ${i + 1}`));
          img.src = imageUrl;
        });

        // Add delay between frames for better UX
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      // Convert sequence to data URL
      const sequenceUrl = sequenceCanvas.toDataURL("image/png");
      setGeneratedSequenceUrl(sequenceUrl);
    } catch (error) {
      console.error("Error generating sequence:", error);
      alert("Failed to generate sequence. Please try again.");
    } finally {
      setIsGeneratingSequence(false);
    }
  };

  // Function to get current filter values from nodes
  const getFilterValues = () => {
    const filterValues = {
      brightness: 100,
      contrast: 100,
      grayscale: 0,
      saturation: 100,
      rotation: 0,
      blur: 0,
    };

    nodes.forEach((node) => {
      if (node.type === "brightness" && node.data.brightness !== undefined) {
        filterValues.brightness = node.data.brightness;
        filterValues.contrast = node.data.contrast || 100;
      }
      if (node.type === "grayscale" && node.data.intensity !== undefined) {
        filterValues.grayscale = node.data.intensity;
      }
      if (node.type === "saturation" && node.data.saturation !== undefined) {
        filterValues.saturation = node.data.saturation;
      }
      if (node.type === "rotation" && node.data.rotation !== undefined) {
        filterValues.rotation = node.data.rotation;
      }
      if (node.type === "blur" && node.data.blur !== undefined) {
        filterValues.blur = node.data.blur;
      }
    });

    return filterValues;
  };

  // Update PromptNode with current filter values whenever they change
  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.type === "prompt" || node.type === "imagePreview") {
          const sceneNumber = node.data.sceneNumber;
          const sceneImage = sceneImages[sceneNumber] || null;
          const filters = sceneFilters[sceneNumber] || {
            brightness: 100,
            contrast: 100,
            grayscale: 0,
            saturation: 100,
            rotation: 0,
            blur: 0,
            scale: 100,
          };
          return {
            ...node,
            data: {
              ...node.data,
              ...(node.type === "prompt" && {
                onGenerateClick: sceneNumber
                  ? () => handleGenerate(sceneNumber)
                  : undefined,
              }),
              uploadedImage: sceneImage,
              showImage:
                node.type === "imagePreview"
                  ? sceneNumber
                    ? sceneImageStates[sceneNumber] || false
                    : false
                  : undefined,
              brightness: filters.brightness,
              contrast: filters.contrast,
              grayscale: filters.grayscale,
              saturation: filters.saturation,
              rotation: filters.rotation,
              blur: filters.blur,
              scale: filters.scale,
            },
          };
        }
        return node;
      })
    );
  }, [sceneImages, sceneImageStates, sceneFilters, setNodes]);

  const addNode = (nodeType: string) => {
    const position = {
      x: Math.random() * 500 + 300,
      y: Math.random() * 400 + 200,
    };

    const newNode = {
      id: nodeId.toString(),
      type: nodeType,
      position,
      data: {
        label: nodeType === "textGeneration" ? "Text Generator" : "Node",
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

  const clearCanvas = () => {
    setNodes([]);
    setEdges([]);
    setNodeId(1);
    setSceneImages({});
    setSceneImageStates({});
    setSceneFilters({});
    setGeneratedSequenceUrl(null);
    setIsGeneratingSequence(false);
    setSequenceProgress(0);
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
        label: "Filter",
        deleteNode,
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

    setNodes((nds) =>
      nds.filter((node) => !sceneToDelete.nodes.includes(node.id))
    );

    setEdges((eds) =>
      eds.filter(
        (edge) =>
          !sceneToDelete.nodes.includes(edge.source) &&
          !sceneToDelete.nodes.includes(edge.target)
      )
    );

    setScenes((prev) => prev.filter((scene) => scene.id !== sceneId));
    setSceneImageStates((prev) => ({ ...prev, [sceneId]: false }));
  };

  const addScene = () => {
    const sceneNumber = scenes.length + 1;
    const baseY = 150 + scenes.length * 600;
    let currentId = nodeId;

    const filters = sceneFilters[sceneNumber] || {
      brightness: 100,
      contrast: 100,
      grayscale: 0,
      saturation: 100,
      rotation: 0,
      blur: 0,
      scale: 100,
    };

    const voiceId = `voice-${currentId++}`;
    const promptId = `prompt-${currentId++}`;
    const settingsId = `settings-${currentId++}`;
    const grayscaleId = `grayscale-${currentId++}`;
    const brightnessId = `brightness-${currentId++}`;
    const rotationId = `rotation-${currentId++}`;
    const blurId = `blur-${currentId++}`;
    const saturationId = `saturation-${currentId++}`;
    const resizeId = `resize-${currentId++}`;
    const previewId = `preview-${currentId++}`;
    const effectsId = `effects-${currentId++}`;
    const sceneViewId = `scene-view-${currentId++}`;

    // Scene-specific handlers
    const handleSceneImageUpload = (imageUrl: string) =>
      handleImageUpload(imageUrl, sceneNumber);
    const handleSceneGenerate = () => handleGenerate(sceneNumber);
    const handleSceneFilter = (filter: keyof typeof filters, value: number) =>
      setSceneFilter(sceneNumber, filter, value);

    const newNodes = [
      {
        id: voiceId,
        type: "voiceOver",
        position: { x: 100, y: baseY },
        data: { label: "Voice Over", sceneNumber, deleteNode },
      },
      {
        id: promptId,
        type: "prompt",
        position: { x: 400, y: baseY },
        data: {
          label: "Image Prompt",
          deleteNode,
          sceneNumber,
          onImageUpload: handleSceneImageUpload,
          onGenerateClick: handleSceneGenerate,
          uploadedImage: sceneImages[sceneNumber] || null,
          ...filters,
        },
      },
      {
        id: settingsId,
        type: "imageSettings",
        position: { x: 700, y: baseY },
        data: { label: "Image Settings", deleteNode },
      },
      {
        id: grayscaleId,
        type: "grayscale",
        position: { x: 1000, y: baseY },
        data: {
          label: "Grayscale Filter",
          deleteNode,
          sceneNumber,
          grayscale: filters.grayscale,
          onGrayscaleChange: (value: number) =>
            handleSceneFilter("grayscale", value),
        },
      },
      {
        id: blurId,
        type: "blur",
        position: { x: 1300, y: baseY },
        data: {
          label: "Blur",
          deleteNode,
          sceneNumber,
          blur: filters.blur,
          onBlurChange: (value: number) => handleSceneFilter("blur", value),
        },
      },
      {
        id: brightnessId,
        type: "brightness",
        position: { x: 1000, y: baseY + 200 },
        data: {
          label: "Brightness & Contrast",
          deleteNode,
          sceneNumber,
          brightness: filters.brightness,
          contrast: filters.contrast,
          onBrightnessChange: (value: number) =>
            handleSceneFilter("brightness", value),
          onContrastChange: (value: number) =>
            handleSceneFilter("contrast", value),
        },
      },
      {
        id: saturationId,
        type: "saturation",
        position: { x: 1300, y: baseY + 200 },
        data: {
          label: "Saturation",
          deleteNode,
          sceneNumber,
          saturation: filters.saturation,
          onSaturationChange: (value: number) =>
            handleSceneFilter("saturation", value),
        },
      },
      {
        id: rotationId,
        type: "rotation",
        position: { x: 1000, y: baseY + 400 },
        data: {
          label: "Rotation",
          deleteNode,
          sceneNumber,
          rotation: filters.rotation,
          onRotationChange: (value: number) =>
            handleSceneFilter("rotation", value),
        },
      },
      {
        id: resizeId,
        type: "resize",
        position: { x: 1300, y: baseY + 400 },
        data: {
          label: "Resize",
          deleteNode,
          sceneNumber,
          scale: filters.scale,
          onScaleChange: (value: number) => handleSceneFilter("scale", value),
        },
      },
      {
        id: previewId,
        type: "imagePreview",
        position: { x: 1600, y: baseY + 100 },
        data: {
          label: "Image Preview",
          deleteNode,
          sceneNumber,
          uploadedImage: sceneImages[sceneNumber] || null,
          showImage: sceneImageStates[sceneNumber] || false,
          ...filters,
        },
      },
      {
        id: effectsId,
        type: "effects",
        position: { x: 100, y: baseY + 400 },
        data: { label: "Effects", sceneNumber, deleteNode },
      },
      {
        id: sceneViewId,
        type: "sceneView",
        position: { x: 1900, y: baseY + 100 },
        data: { label: `Scene ${sceneNumber} View` },
      },
    ];

    const newEdges = [
      {
        id: `e-${promptId}-${settingsId}`,
        source: promptId,
        target: settingsId,
        type: "smoothstep",
        animated: true,
      },
      {
        id: `e-${settingsId}-${grayscaleId}`,
        source: settingsId,
        target: grayscaleId,
        type: "smoothstep",
        animated: true,
      },
      {
        id: `e-${grayscaleId}-${brightnessId}`,
        source: grayscaleId,
        target: brightnessId,
        type: "smoothstep",
        animated: true,
      },
      {
        id: `e-${brightnessId}-${rotationId}`,
        source: brightnessId,
        target: rotationId,
        type: "smoothstep",
        animated: true,
      },
      {
        id: `e-${rotationId}-${blurId}`,
        source: rotationId,
        target: blurId,
        type: "smoothstep",
        animated: true,
      },
      {
        id: `e-${blurId}-${saturationId}`,
        source: blurId,
        target: saturationId,
        type: "smoothstep",
        animated: true,
      },
      {
        id: `e-${saturationId}-${resizeId}`,
        source: saturationId,
        target: resizeId,
        type: "smoothstep",
        animated: true,
      },
      {
        id: `e-${resizeId}-${previewId}`,
        source: resizeId,
        target: previewId,
        type: "smoothstep",
        animated: true,
      },
      {
        id: `e-${previewId}-${sceneViewId}`,
        source: previewId,
        target: sceneViewId,
        type: "smoothstep",
        animated: true,
      },
      {
        id: `e-${voiceId}-${sceneViewId}`,
        source: voiceId,
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
        <div className="space-y-4">
          <h2 className="text-white text-lg font-semibold">Scene Builder</h2>

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
                ☀️ Brightness & Contrast
              </button>
              <button
                onClick={() => addNode("rotation")}
                className="w-full p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-left transition-colors"
              >
                🔄 Rotation
              </button>
              <button
                onClick={() => addNode("blur")}
                className="w-full p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-left transition-colors"
              >
                🌫️ Blur
              </button>
              <button
                onClick={() => addNode("saturation")}
                className="w-full p-3 bg-pink-600 hover:bg-pink-700 text-white rounded-lg text-left transition-colors"
              >
                🎨 Saturation
              </button>
              <button
                onClick={() => addNode("resize")}
                className="w-full p-3 bg-green-600 hover:bg-green-700 text-white rounded-lg text-left transition-colors"
              >
                📏 Resize
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
                onClick={generateSequence}
                disabled={isGeneratingSequence}
                className="w-full p-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg font-medium transition-colors"
              >
                {isGeneratingSequence
                  ? `Generating... ${Math.round(sequenceProgress)}%`
                  : "🚀 Generate Sequence"}
              </button>
            )}

            {isGeneratingSequence && (
              <div className="w-full bg-gray-700 rounded-lg p-3">
                <div className="w-full bg-gray-600 rounded-full h-2 mb-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${sequenceProgress}%` }}
                  ></div>
                </div>
                <div className="text-sm text-gray-300 text-center">
                  Processing {Math.round(sequenceProgress)}% complete
                </div>
              </div>
            )}

            {generatedSequenceUrl && (
              <div className="w-full bg-gray-700 rounded-lg p-3">
                <h4 className="text-white text-sm font-medium mb-2">
                  Generated Sequence
                </h4>
                <img
                  src={generatedSequenceUrl}
                  alt="Generated Sequence"
                  className="w-full h-32 object-cover rounded border"
                />
                <div className="flex space-x-2 mt-2">
                  <button
                    onClick={() => {
                      const link = document.createElement("a");
                      link.href = generatedSequenceUrl;
                      link.download = "sequence.png";
                      link.click();
                    }}
                    className="flex-1 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
                  >
                    Download
                  </button>
                  <button
                    onClick={() => setGeneratedSequenceUrl(null)}
                    className="flex-1 p-2 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm transition-colors"
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={clearCanvas}
              className="w-full p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors"
            >
              🗑️ Clear Canvas
            </button>
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
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-white text-xl font-bold">🎬 Scene Builder</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-300 text-sm">Nodes: {nodes.length}</span>
            <span className="text-gray-300 text-sm">
              Connections: {edges.length}
            </span>
            <span className="text-gray-300 text-sm">
              Scenes: {scenes.length}
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
