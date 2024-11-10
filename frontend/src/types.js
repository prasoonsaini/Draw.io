export const Shapes = {
    pan: "pan",
    selection: "select",
    rectangle: "rec",
    ellipse: "ellipse",
    arrow: "line",
    pencil: "hand",
    text: "text",
  };
  
  // SelectedElementType and ExtendedElementType are not strictly necessary in JavaScript
  // since they just describe the structure of objects, so we simply use plain object literals.
  
  export const ElementType = {
    id: null,
    x1: null,
    y1: null,
    x2: null,
    y2: null,
    type: null, // This would be one of the values from ToolsType
    roughElement: null,
    offsetX: null,
    offsetY: null,
    position: null,
    points: [],
    text: null,
  };
  
  // ActionsType in JavaScript would be handled via string literals or constants.
  export const ActionsType = [
    "writing",
    "drawing",
    "moving",
    "panning",
    "resizing",
    "none",
  ];
  
  // ToolsType is derived dynamically from Tools in JavaScript
  export const ToolsType = Object.values(Shapes);
  
  // PointType can just be represented as a plain object in JavaScript
  export const PointType = { x: 0, y: 0 };
  