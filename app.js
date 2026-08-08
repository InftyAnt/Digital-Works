const GRID = 24;
const PIN_VISUAL_CELLS = 1.6;
const MIN_STANDARD_ZOOM = 0.35;
const DEFAULT_ZOOM = MIN_STANDARD_ZOOM;
const MIN_ZOOM = MIN_STANDARD_ZOOM / 5;
const MAX_ZOOM = 2.5;
const CIRCUIT_STROKE = 3;
const WIRE_POINT_CAP_RADIUS = CIRCUIT_STROKE / 2;
const DEFAULT_HOT_COLOR = "#d54d3f";
const DEFAULT_COLD_COLOR = "#CCCCCC";
const DEFAULT_X_COLOR = "#d08a00";
const DEFAULT_Z_COLOR = "#0b73b7";
const DEFAULT_DATA_ARROW_COLOR = "#0b73b7";
const SETTINGS_STORAGE_KEY = "digitalWorksPrototype.settings.v1";
const DESIGN_FILE_PICKER_ID = "digital-works-design";
const TEMPLATE_VIEW_W = 144;
const TEMPLATE_VIEW_H = 96;
const TEMPLATE_MIN_ZOOM = MIN_ZOOM;
const TEMPLATE_MAX_ZOOM = 4;
const GRID_BOUNDARY_PX = {
  minX: -32000,
  minY: -32000,
  maxX: 32000,
  maxY: 32000,
};

// Every component is placed on the logical grid, not raw pixels.
// Width and height are measured in grid cells so zoom/pan never changes the circuit model.
const NODE_SIZES = {
  INPUT: { w: 2, h: 2 },
  MULTI_INPUT: { w: 8, h: 5 },
  CABLE_SWITCH: { w: 6, h: 6 },
  CABLE_TEST_SWITCH: { w: 6, h: 6 },
  CABLE_OUTPUT: { w: 6, h: 6 },
  CABLE_TO_BUS: { w: 6, h: 8 },
  BUS_TO_CABLE: { w: 6, h: 8 },
  CABLE_MERGER: { w: 6, h: 6 },
  CABLE_DIVIDER: { w: 6, h: 6 },
  TEST_INPUT: { w: 2, h: 2 },
  MULTI_TEST_INPUT: { w: 8, h: 5 },
  MULTI_OUTPUT: { w: 8, h: 2 },
  MULTI_PIN: { w: 8, h: 4 },
  BUS: { w: 8, h: 2 },
  OUTPUT: { w: 2, h: 2 },
  VCC: { w: 4, h: 4 },
  GND: { w: 4, h: 4 },
  X_SRC: { w: 4, h: 4 },
  Z_SRC: { w: 4, h: 4 },
  CLOCK: { w: 4, h: 4 },
  PULSE: { w: 6, h: 4 },
  PIN: { w: PIN_VISUAL_CELLS, h: PIN_VISUAL_CELLS },
  CABLE_PIN: { w: 2, h: 4 },
  TEXT: { w: 4, h: 1 },
  JUNCTION: { w: 1, h: 1 },
  NOT: { w: 10, h: 3 },
  BUFFER: { w: 10, h: 3 },
  TRISTATE: { w: 10, h: 5 },
  SR_LATCH: { w: 16, h: 16 },
  D_LATCH: { w: 16, h: 16 },
  SR_FF: { w: 16, h: 16 },
  D_FF: { w: 16, h: 16 },
  JK_FF: { w: 16, h: 16 },
  T_FF: { w: 16, h: 16 },
  AND: { w: 12, h: 6 },
  OR: { w: 12, h: 6 },
  XOR: { w: 12, h: 6 },
  NAND: { w: 12, h: 6 },
  NOR: { w: 12, h: 6 },
  XNOR: { w: 12, h: 6 },
  CHIP: { w: 6, h: 5 },
};

// Gate metadata is the single source of truth for labels and port names.
// Rendering, wiring, and simulation all read from this table.
const GATE_META = {
  INPUT: { label: "IN", inputs: [], outputs: ["out"] },
  MULTI_INPUT: { label: "MULTI IN", inputs: [], outputs: [] },
  CABLE_SWITCH: { label: "CABLE SW", inputs: [], outputs: ["out"] },
  CABLE_TEST_SWITCH: { label: "CABLE TEST", inputs: [], outputs: ["out"] },
  CABLE_OUTPUT: { label: "CABLE OUT", inputs: ["in"], outputs: [] },
  CABLE_TO_BUS: { label: "CABLE BUS", inputs: ["in"], outputs: [] },
  BUS_TO_CABLE: { label: "BUS CABLE", inputs: [], outputs: ["out"] },
  CABLE_MERGER: { label: "CABLE MERGE", inputs: [], outputs: ["out"] },
  CABLE_DIVIDER: { label: "CABLE DIVIDE", inputs: ["in"], outputs: [] },
  TEST_INPUT: { label: "TEST", inputs: [], outputs: ["out"] },
  MULTI_TEST_INPUT: { label: "MULTI TEST", inputs: [], outputs: [] },
  MULTI_OUTPUT: { label: "MULTI LED", inputs: [], outputs: [] },
  BUS: { label: "BUS", inputs: [], outputs: [] },
  OUTPUT: { label: "LED", inputs: ["in"], outputs: [] },
  VCC: { label: "VCC", inputs: [], outputs: ["out"] },
  GND: { label: "GND", inputs: [], outputs: ["out"] },
  X_SRC: { label: "X", inputs: [], outputs: ["out"] },
  Z_SRC: { label: "Z", inputs: [], outputs: ["out"] },
  CLOCK: { label: "CLK", inputs: [], outputs: ["out"] },
  PULSE: { label: "PULSE", inputs: [], outputs: ["out"] },
  PIN: { label: "PIN", inputs: ["in"], outputs: ["out"] },
  CABLE_PIN: { label: "CABLE PIN", inputs: ["in"], outputs: ["out"] },
  MULTI_PIN: { label: "MULTI PIN", inputs: [], outputs: [] },
  TEXT: { label: "TEXT", inputs: [], outputs: [] },
  JUNCTION: { label: "JUNCTION", inputs: ["in"], outputs: ["out"] },
  NOT: { label: "NOT", inputs: ["in"], outputs: ["out"] },
  BUFFER: { label: "BUF", inputs: ["in"], outputs: ["out"] },
  TRISTATE: { label: "TRI", inputs: ["in", "en"], outputs: ["out"] },
  SR_LATCH: { label: "SR", inputs: ["s", "r", "en"], outputs: ["q", "qbar"] },
  D_LATCH: { label: "D", inputs: ["d", "en"], outputs: ["q", "qbar"] },
  SR_FF: { label: "SR", inputs: ["s", "r", "clk"], outputs: ["q", "qbar"] },
  D_FF: { label: "D", inputs: ["d", "clk"], outputs: ["q", "qbar"] },
  JK_FF: { label: "JK", inputs: ["j", "k", "clk"], outputs: ["q", "qbar"] },
  T_FF: { label: "T", inputs: ["t", "clk"], outputs: ["q", "qbar"] },
  AND: { label: "AND", inputs: ["a", "b"], outputs: ["out"] },
  OR: { label: "OR", inputs: ["a", "b"], outputs: ["out"] },
  XOR: { label: "XOR", inputs: ["a", "b"], outputs: ["out"] },
  NAND: { label: "NAND", inputs: ["a", "b"], outputs: ["out"] },
  NOR: { label: "NOR", inputs: ["a", "b"], outputs: ["out"] },
  XNOR: { label: "XNOR", inputs: ["a", "b"], outputs: ["out"] },
  CHIP: { label: "HALF ADDER", inputs: ["a", "b"], outputs: ["sum", "carry"] },
};

const FAN_IN_PORTS = ["a", "b", "c", "d"];
const FAN_IN_TYPES = new Set(["AND", "NAND", "OR", "NOR", "XOR", "XNOR"]);
const LATCH_TYPES = new Set(["SR_LATCH", "D_LATCH"]);
const FLIP_FLOP_TYPES = new Set(["SR_FF", "D_FF", "JK_FF", "T_FF"]);
const SEQUENTIAL_TYPES = new Set([...LATCH_TYPES, ...FLIP_FLOP_TYPES]);
const SIGNAL = Object.freeze({
  ZERO: "0",
  ONE: "1",
  UNKNOWN: "X",
  HIGH_Z: "Z",
});
const DEFAULT_TEXT_SETTINGS = {
  text: "Text",
  w: NODE_SIZES.TEXT.w,
  h: NODE_SIZES.TEXT.h,
  align: "center",
  verticalAlign: "middle",
  fontSize: 48,
  fontFamily: "Segoe UI, system-ui, sans-serif",
  color: "#20231f",
};
const DEFAULT_SETTINGS = {
  wireHotColor: DEFAULT_HOT_COLOR,
  wireColdColor: DEFAULT_COLD_COLOR,
  inputHotColor: DEFAULT_HOT_COLOR,
  outputHotColor: DEFAULT_HOT_COLOR,
  xSignalColor: DEFAULT_X_COLOR,
  zSignalColor: DEFAULT_Z_COLOR,
  orderArrowColor: DEFAULT_HOT_COLOR,
  dataArrowColor: DEFAULT_DATA_ARROW_COLOR,
  orderArrowDirection: "lsb-to-msb",
  dataArrowDirection: "left-to-right",
  arrowScale: 1,
  textDefaults: { ...DEFAULT_TEXT_SETTINGS },
};

function normalizeSettings(settings = {}) {
  const arrowScale = Math.min(2, Math.max(0.5, Number(settings.arrowScale ?? DEFAULT_SETTINGS.arrowScale)));
  return {
    ...DEFAULT_SETTINGS,
    ...settings,
    xSignalColor: typeof settings.xSignalColor === "string" && settings.xSignalColor.startsWith("#") ? settings.xSignalColor : DEFAULT_SETTINGS.xSignalColor,
    zSignalColor: typeof settings.zSignalColor === "string" && settings.zSignalColor.startsWith("#") ? settings.zSignalColor : DEFAULT_SETTINGS.zSignalColor,
    orderArrowColor: typeof settings.orderArrowColor === "string" && settings.orderArrowColor.startsWith("#") ? settings.orderArrowColor : DEFAULT_SETTINGS.orderArrowColor,
    dataArrowColor: typeof settings.dataArrowColor === "string" && settings.dataArrowColor.startsWith("#") ? settings.dataArrowColor : DEFAULT_SETTINGS.dataArrowColor,
    orderArrowDirection: settings.orderArrowDirection === "msb-to-lsb" ? "msb-to-lsb" : DEFAULT_SETTINGS.orderArrowDirection,
    dataArrowDirection: settings.dataArrowDirection === "right-to-left" ? "right-to-left" : DEFAULT_SETTINGS.dataArrowDirection,
    arrowScale,
    textDefaults: {
      ...DEFAULT_TEXT_SETTINGS,
      ...(settings.textDefaults || {}),
    },
  };
}

function loadStoredSettings() {
  try {
    return normalizeSettings(JSON.parse(localStorage.getItem(SETTINGS_STORAGE_KEY) || "{}"));
  } catch (error) {
    return normalizeSettings();
  }
}

// App-wide state. Circuit data stays in grid coordinates; view data stores only pan/zoom.
const state = {
  designName: "Untitled Design",
  nodes: [],
  wires: [],
  values: new Map(),
  circuitIssues: [],
  statusNotice: "",
  selectedNodeId: null,
  selectedWireId: null,
  selectedNodeIds: [],
  selectedWireIds: [],
  selectionRotationCenter: null,
  clipboard: null,
  fileHandle: null,
  fileName: "",
  savedPayloadText: "",
  skipUnloadWarning: false,
  undoStack: [],
  redoStack: [],
  pendingPart: null,
  pendingPartOptions: null,
  scaleKeyDown: false,
  macros: [],
  template: {
    polygon: [],
    draft: [],
    pins: [],
    texts: [],
    tool: "select",
    pendingOptions: {},
    sourcePinId: null,
    selected: null,
    pointer: null,
    clipboard: null,
    undoStack: [],
    redoStack: [],
    drag: null,
    rotateKeyDown: false,
    view: { x: 0, y: 0, zoom: 1 },
  },
  settings: loadStoredSettings(),
  tool: "move",
  pan: { x: 520, y: 300 },
  zoom: DEFAULT_ZOOM,
  drag: null,
  wireStart: null,
  wireStartSnapshot: null,
  wirePoints: [],
  busStart: null,
  pointerGrid: { x: 0, y: 0 },
  attachCandidate: null,
  spaceDown: false,
  rotateKeyDown: false,
  simulationRunning: false,
  simulationCache: null,
  macroViewer: {
    stack: [],
  },
};

// Cached DOM/SVG layers. The viewport group is transformed, while child shapes stay grid-based.
const canvas = document.getElementById("canvas");
const viewport = document.getElementById("viewport");
const nodesLayer = document.getElementById("nodes");
const wiresLayer = document.getElementById("wires");
const junctionOverlayLayer = document.getElementById("junction-overlay");
const wirePreviewLayer = document.getElementById("wire-preview");
const selectionOverlayLayer = document.getElementById("selection-overlay");
const statusEl = document.getElementById("status");
const simulationRunToggle = document.getElementById("simulation-run-toggle");
const attachLabel = document.getElementById("attach-label");
const selectionPanel = document.getElementById("selection-panel");
const settingsModal = document.getElementById("settings-modal");
const wireHotColorInput = document.getElementById("wire-hot-color");
const wireColdColorInput = document.getElementById("wire-cold-color");
const inputHotColorInput = document.getElementById("input-hot-color");
const outputHotColorInput = document.getElementById("output-hot-color");
const xSignalColorInput = document.getElementById("x-signal-color");
const zSignalColorInput = document.getElementById("z-signal-color");
const orderArrowColorInput = document.getElementById("order-arrow-color");
const dataArrowColorInput = document.getElementById("data-arrow-color");
const orderArrowDirectionInput = document.getElementById("order-arrow-direction");
const dataArrowDirectionInput = document.getElementById("data-arrow-direction");
const arrowScaleInput = document.getElementById("arrow-scale");
const textDefaultContentInput = document.getElementById("text-default-content");
const textDefaultSizeInput = document.getElementById("text-default-size");
const textDefaultColorInput = document.getElementById("text-default-color");
const textDefaultFontInput = document.getElementById("text-default-font");
const textDefaultWidthInput = document.getElementById("text-default-width");
const textDefaultHeightInput = document.getElementById("text-default-height");
const textDefaultHorizontalInput = document.getElementById("text-default-horizontal");
const textDefaultVerticalInput = document.getElementById("text-default-vertical");
const macroParts = document.getElementById("macro-parts");
const macroDropZone = document.getElementById("macro-drop-zone");
const templateModal = document.getElementById("template-modal");
const templateCanvas = document.getElementById("template-canvas");
const templateStatus = document.getElementById("template-status");
const macroViewModal = document.getElementById("macro-view-modal");
const macroViewCanvas = document.getElementById("macro-view-canvas");
const macroViewStatus = document.getElementById("macro-view-status");
const textModal = document.getElementById("text-modal");
const textForm = document.getElementById("text-form");
const textModalTitle = document.getElementById("text-modal-title");
const textModalInput = document.getElementById("text-modal-input");
const textModalCancel = document.getElementById("text-modal-cancel");
const dimensionModal = document.getElementById("dimension-modal");
const dimensionForm = document.getElementById("dimension-form");
const dimensionModalTitle = document.getElementById("dimension-modal-title");
const dimensionWidthInput = document.getElementById("dimension-width");
const dimensionHeightInput = document.getElementById("dimension-height");
const dimensionCancel = document.getElementById("dimension-cancel");
const cableSwitchModal = document.getElementById("cable-switch-modal");
const cableSwitchForm = document.getElementById("cable-switch-form");
const cableSwitchBitsInput = document.getElementById("cable-switch-bits");
const cableSwitchDataInput = document.getElementById("cable-switch-data");
const cableSwitchCancel = document.getElementById("cable-switch-cancel");
let settingsDraft = normalizeSettings();
let physicalZoomModifierDown = false;
const fanInMenu = document.createElement("div");
fanInMenu.className = "fan-in-menu";
fanInMenu.hidden = true;
document.body.appendChild(fanInMenu);

function uid(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

// Convert between logical grid positions and screen pixels.
function gridToScreen(point) {
  return {
    x: state.pan.x + point.x * GRID * state.zoom,
    y: state.pan.y + point.y * GRID * state.zoom,
  };
}

function screenToGrid(clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  const x = (clientX - rect.left - state.pan.x) / (GRID * state.zoom);
  const y = (clientY - rect.top - state.pan.y) / (GRID * state.zoom);
  return { x: Math.round(x), y: Math.round(y) };
}

function screenToGridRaw(clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (clientX - rect.left - state.pan.x) / (GRID * state.zoom),
    y: (clientY - rect.top - state.pan.y) / (GRID * state.zoom),
  };
}

function clampAxisPan(currentPan, viewportSize, minWorld, maxWorld, zoom) {
  const minPan = viewportSize - maxWorld * zoom;
  const maxPan = -minWorld * zoom;
  if (minPan > maxPan) return (minPan + maxPan) / 2;
  return Math.min(maxPan, Math.max(minPan, currentPan));
}

function clampPanToGridBoundary() {
  const rect = canvas.getBoundingClientRect();
  if (!rect.width || !rect.height) return;
  state.pan.x = clampAxisPan(state.pan.x, rect.width, GRID_BOUNDARY_PX.minX, GRID_BOUNDARY_PX.maxX, state.zoom);
  state.pan.y = clampAxisPan(state.pan.y, rect.height, GRID_BOUNDARY_PX.minY, GRID_BOUNDARY_PX.maxY, state.zoom);
}

function setViewportTransform() {
  clampPanToGridBoundary();
  viewport.setAttribute("transform", `translate(${state.pan.x} ${state.pan.y}) scale(${state.zoom})`);
  canvas.classList.toggle("hide-minor-grid", state.zoom < MIN_STANDARD_ZOOM);
}

function gateFanIn(node) {
  return Math.min(4, Math.max(2, Number(node.fanIn ?? 2)));
}

function multiBitCount(node) {
  return Math.min(32, Math.max(1, Math.round(Number(node.bits ?? 4))));
}

function multiBitPorts(node) {
  return Array.from({ length: multiBitCount(node) }, (_, index) => `bit${index}`);
}

function cableSegments(node) {
  const raw = Array.isArray(node?.segments) && node.segments.length ? node.segments : [4, 4];
  return raw
    .map((value) => Math.round(Number(value)))
    .filter((value) => Number.isFinite(value) && value > 0)
    .map((value) => Math.min(32, value));
}

function cableSegmentTotalBits(node) {
  return cableSegments(node).reduce((sum, bits) => sum + bits, 0);
}

function cableSegmentPorts(node) {
  return cableSegments(node).map((_, index) => `part${index}`);
}

function cableMergeSplitSpacing() {
  return 4;
}

function cableMergeSplitHeight(node) {
  return Math.max(4, (cableSegments(node).length - 1) * cableMergeSplitSpacing() + 2);
}

function cableSegmentLocalY(node, index) {
  const size = nodeSize(node);
  const segments = cableSegments(node);
  return size.h / 2 - ((segments.length - 1) * cableMergeSplitSpacing()) / 2 + index * cableMergeSplitSpacing();
}

function isCableMergeSplitType(type) {
  return type === "CABLE_MERGER" || type === "CABLE_DIVIDER";
}

function arrowScale() {
  return Math.min(2, Math.max(0.5, Number(state.settings.arrowScale ?? DEFAULT_SETTINGS.arrowScale)));
}

function orderArrowColor() {
  return normalizeSettings(state.settings).orderArrowColor;
}

function dataArrowColor() {
  return normalizeSettings(state.settings).dataArrowColor;
}

function busInputs(node) {
  return Array.from({ length: multiBitCount(node) }, (_, index) => `in${index}`);
}

function busOutputs(node) {
  return Array.from({ length: multiBitCount(node) }, (_, index) => `out${index}`);
}

function multiBitValues(node) {
  const bits = multiBitCount(node);
  const values = Array.isArray(node.values) ? node.values.slice(0, bits) : [];
  while (values.length < bits) values.push(false);
  return values.map(Boolean);
}

function setMultiBitValue(node, index, value) {
  const values = multiBitValues(node);
  values[index] = Boolean(value);
  node.values = values;
}

function isCableSourceType(type) {
  return type === "CABLE_SWITCH" || type === "CABLE_TEST_SWITCH";
}

function isCableSourceNode(node) {
  return Boolean(node && isCableSourceType(node.type));
}

function isLogicSourceType(type) {
  return type === "INPUT" || type === "TEST_INPUT" || type === "VCC" || type === "GND" || type === "X_SRC" || type === "Z_SRC" || type === "CLOCK" || type === "PULSE";
}

function isSinglePortIndicatorType(type) {
  return isLogicSourceType(type) || type === "OUTPUT";
}

function clockFrequency(node) {
  const hz = Number(node?.clockHz ?? 1);
  return [1, 2, 5, 10].includes(hz) ? hz : 1;
}

function pulseFrequency(node) {
  const hz = Number(node?.pulseHz ?? node?.clockHz ?? 1);
  return [1, 2, 5, 10].includes(hz) ? hz : 1;
}

function normalizePulsePattern(value) {
  const pattern = String(value ?? "10").toUpperCase().replace(/[^01XZ]/g, "");
  return pattern || "10";
}

function pulseSignal(node) {
  const pattern = normalizePulsePattern(node?.pulsePattern);
  const index = Math.max(0, Math.trunc(Number(node?.pulseIndex || 0))) % pattern.length;
  return signalValue(pattern[index]);
}

function cableDataValue(node) {
  const value = Math.trunc(Number(node.data ?? 0));
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

function clampCableValueToBits(value, bits) {
  const width = Math.min(32, Math.max(0, bits));
  const modulo = 2 ** width;
  if (!modulo) return 0;
  return Math.max(0, Math.trunc(Number(value || 0))) % modulo;
}

function cableMergerValue(node, cableInputs = {}) {
  let value = 0;
  for (const [index, bits] of cableSegments(node).entries()) {
    const partValue = clampCableValueToBits(cableInputs[`part${index}`], bits);
    value = value * 2 ** bits + partValue;
  }
  return value;
}

function cableDividerValue(node, index, cableInputs = {}) {
  const segments = cableSegments(node);
  const inputValue = clampCableValueToBits(cableInputs.in, cableSegmentTotalBits(node));
  const lowerBits = segments.slice(index + 1).reduce((sum, bits) => sum + bits, 0);
  return clampCableValueToBits(Math.floor(inputValue / 2 ** lowerBits), segments[index] || 1);
}

function normalizedPositiveBitLength(value, fallback = 1) {
  const bits = Math.round(Number(value));
  return Number.isFinite(bits) && bits >= 1 ? Math.min(32, bits) : fallback;
}

function directJunctionBitLength(node) {
  return normalizedPositiveBitLength(node?.bitLength ?? node?.bits, 0);
}

function endpointNodeId(endpoint) {
  return endpoint?.kind === "port" ? endpoint.nodeId : endpoint?.nodeId || null;
}

function endpointRawBitLength(endpoint) {
  return normalizedPositiveBitLength(endpoint?.bitLength, 0);
}

function inferJunctionBitLength(node) {
  const storedBits = directJunctionBitLength(node);
  let inferredBits = 0;
  for (const wire of state.wires) {
    if (endpointNodeId(wire.from) !== node.id && endpointNodeId(wire.to) !== node.id) continue;
    inferredBits = Math.max(
      inferredBits,
      normalizedPositiveBitLength(wire.bitLength, 0),
      endpointRawBitLength(wire.from),
      endpointRawBitLength(wire.to),
    );
  }
  if (storedBits && !(storedBits === 1 && inferredBits > 1)) return storedBits;
  return inferredBits || 1;
}

function portBitLength(node, port) {
  if (!node) return 1;
  if (isCableSourceNode(node) && port === "out") return multiBitCount(node);
  if (node.type === "CABLE_OUTPUT" && port === "in") return multiBitCount(node);
  if (node.type === "CABLE_TO_BUS" && port === "in") return multiBitCount(node);
  if (node.type === "BUS_TO_CABLE" && port === "out") return multiBitCount(node);
  if (node.type === "CABLE_MERGER") {
    if (port === "out") return cableSegmentTotalBits(node);
    const index = Math.max(0, Number(String(port).replace("part", "")) || 0);
    return cableSegments(node)[index] || 1;
  }
  if (node.type === "CABLE_DIVIDER") {
    if (port === "in") return cableSegmentTotalBits(node);
    const index = Math.max(0, Number(String(port).replace("part", "")) || 0);
    return cableSegments(node)[index] || 1;
  }
  if (node.type === "CABLE_PIN" && (port === "in" || port === "out")) return multiBitCount(node);
  if (node.type === "JUNCTION" && (port === "in" || port === "out")) return inferJunctionBitLength(node);
  if (node.type === "MACRO") {
    const macro = findMacroForViewer(node.macroId);
    const pin = (macro?.pins || []).find((item) => item.id === port);
    return Math.max(1, Math.round(Number(pin?.bitLength || 1)));
  }
  return 1;
}

function normalizeRotationOption(value) {
  return ((Math.round(Number(value || 0)) % 4) + 4) % 4;
}

function isFanInType(type) {
  return FAN_IN_TYPES.has(type);
}

function isFanInGate(node) {
  return Boolean(node && isFanInType(node.type));
}

function isMacroPart(type) {
  return String(type).startsWith("MACRO:");
}

function macroIdFromPart(type) {
  return String(type).slice("MACRO:".length);
}

function findMacro(id) {
  return state.macros.find((macro) => macro.id === id);
}

function mergeMacroDefinitions(primary, secondary) {
  const byId = new Map();
  for (const macro of secondary || []) byId.set(macro.id, macro);
  for (const macro of primary || []) byId.set(macro.id, macro);
  return [...byId.values()];
}

function macroDependencyIds(macro) {
  const ids = new Set();
  for (const node of macro?.circuit?.nodes || []) {
    if (node.type === "MACRO" && node.macroId) ids.add(node.macroId);
  }
  for (const dependency of macro?.circuit?.macros || []) {
    if (dependency.id) ids.add(dependency.id);
  }
  return ids;
}

function macroDependencyGraph(macros) {
  const graph = new Map();
  for (const macro of macros || []) graph.set(macro.id, macroDependencyIds(macro));
  return graph;
}

function macroHasDependencyPath(graph, fromId, toId, seen = new Set()) {
  if (!fromId || !toId || seen.has(fromId)) return false;
  seen.add(fromId);
  const nextIds = graph.get(fromId) || new Set();
  if (nextIds.has(toId)) return true;
  for (const nextId of nextIds) {
    if (macroHasDependencyPath(graph, nextId, toId, seen)) return true;
  }
  return false;
}

function findMacroDependencyCycle(macros) {
  const graph = macroDependencyGraph(macros);
  for (const macro of macros || []) {
    if (macroHasDependencyPath(graph, macro.id, macro.id)) return macro.id;
  }
  return "";
}

function flattenMacroDefinitions(macros, seen = new Map()) {
  for (const macro of macros || []) {
    if (!macro?.id || seen.has(macro.id)) continue;
    seen.set(macro.id, macro);
    flattenMacroDefinitions(macro.circuit?.macros || [], seen);
  }
  return [...seen.values()];
}

function rootHiddenMacro(macros = state.macros) {
  const hiddenMacros = (macros || []).filter((macro) => (
    !macro.paletteVisible
    && !macro.loadedAsPaletteMacro
    && !macro.instanceSnapshot
    && !macro.displayName
  ));
  if (!hiddenMacros.length) return null;
  const hiddenIds = new Set(hiddenMacros.map((macro) => macro.id));
  const referencedIds = new Set();
  for (const macro of hiddenMacros) {
    for (const id of macroDependencyIds(macro)) {
      if (hiddenIds.has(id)) referencedIds.add(id);
    }
  }
  const roots = hiddenMacros.filter((macro) => !referencedIds.has(macro.id));
  return roots[roots.length - 1] || hiddenMacros[hiddenMacros.length - 1] || null;
}

function macroPorts(node, direction) {
  const macro = findMacroForViewer(node.macroId);
  return (macro?.pins || []).filter((pin) => pin.direction === direction);
}

function macroPinPosition(pin, size) {
  if (typeof pin.x === "number" && typeof pin.y === "number") return { x: pin.x, y: pin.y };
  return {
    x: pin.direction === "output" ? size.w : 0,
    y: typeof pin.index === "number" ? pin.index + 1 : size.h / 2,
  };
}

function templatePinsForAssignmentState() {
  const pins = state.template.polygon.length >= 3 ? [...(state.template.pins || [])] : [];
  const macro = rootHiddenMacro();
  if (macro?.template?.pins?.length) pins.push(...macro.template.pins);
  else if (macro?.pins?.length) {
    pins.push(...macro.pins.map((pin) => ({
      sourcePinId: pin.internalNodeId || null,
      sourcePort: pin.internalPort || "",
    })));
  }
  return pins;
}

function circuitPinAssigned(node) {
  if (!node || (node.type !== "PIN" && node.type !== "MULTI_PIN" && node.type !== "CABLE_PIN")) return false;
  return templatePinsForAssignmentState().some((pin) => pin.sourcePinId === node.id);
}

function positionedMacroPins(rawPins, size) {
  if (rawPins.every((pin) => typeof pin.x === "number" && typeof pin.y === "number")) {
    return rawPins.map((pin) => ({ ...pin, direction: pin.direction === "output" ? "output" : "input" }));
  }
  const byDirection = {
    input: rawPins.filter((pin) => pin.direction !== "output"),
    output: rawPins.filter((pin) => pin.direction === "output"),
  };
  return rawPins.map((pin) => {
    const direction = pin.direction === "output" ? "output" : "input";
    const group = byDirection[direction];
    const index = group.indexOf(pin);
    const y = group.length ? ((index + 1) * size.h) / (group.length + 1) : size.h / 2;
    return {
      ...pin,
      direction,
      x: direction === "output" ? size.w : 0,
      y,
    };
  });
}

function normalizeMacroPinDirections(pins, size) {
  return pins.map((pin) => ({
    ...pin,
    direction: pin.direction === "input" || pin.direction === "output"
      ? pin.direction
      : pin.x >= size.w / 2 ? "output" : "input",
  }));
}

function rotationQuarter(node) {
  return ((Math.round(Number(node.rotation || 0)) % 4) + 4) % 4;
}

function mirrorFlags(node) {
  return {
    x: Boolean(node.mirrorX),
    y: Boolean(node.mirrorY),
  };
}

function rotatePointCounterClockwise(point, center) {
  return {
    x: center.x + (point.y - center.y),
    y: center.y - (point.x - center.x),
  };
}

function rotatePointByQuarters(point, center, quarters) {
  let next = { ...point };
  const normalized = ((Math.round(quarters) % 4) + 4) % 4;
  for (let i = 0; i < normalized; i += 1) next = rotatePointCounterClockwise(next, center);
  return next;
}

function localRotationCenter(node, size = nodeSize(node)) {
  if (node?.type === "MULTI_INPUT" || node?.type === "MULTI_TEST_INPUT" || node?.type === "MULTI_OUTPUT" || node?.type === "MULTI_PIN") {
    return { x: size.w / 2, y: 2 };
  }
  return { x: size.w / 2, y: size.h / 2 };
}

function rotateLocalPoint(point, node, size, quarters) {
  return rotatePointByQuarters(point, localRotationCenter(node, size), quarters);
}

function transformLocalPoint(point, node, size = nodeSize(node)) {
  const mirror = mirrorFlags(node);
  const center = localRotationCenter(node, size);
  const rotated = rotateLocalPoint(point, node, size, rotationQuarter(node));
  return {
    x: center.x + (mirror.x ? -(rotated.x - center.x) : rotated.x - center.x),
    y: center.y + (mirror.y ? -(rotated.y - center.y) : rotated.y - center.y),
  };
}

function nodeSize(node) {
  if (node.type === "MACRO") return node.size || { w: 6, h: 4 };
  if (node.type === "MULTI_INPUT" || node.type === "MULTI_TEST_INPUT") return { w: multiBitCount(node) * 2, h: 5 };
  if (node.type === "CABLE_TO_BUS" || node.type === "BUS_TO_CABLE") return { w: 6, h: multiBitCount(node) * 2 };
  if (isCableMergeSplitType(node.type)) return { w: 6, h: cableMergeSplitHeight(node) };
  if (node.type === "MULTI_OUTPUT") return { w: multiBitCount(node) * 2, h: 3 };
  if (node.type === "MULTI_PIN") return { w: multiBitCount(node) * 2, h: 4 };
  if (node.type === "BUS") {
    const bits = multiBitCount(node);
    return node.busDiagonal ? { w: bits * 2, h: bits * 2 } : { w: bits * 2, h: 2 };
  }
  if (node.type === "TEXT") return textBoxSize(node);
  return NODE_SIZES[node.type];
}

function nodeInputs(node) {
  if (isFanInGate(node)) return FAN_IN_PORTS.slice(0, gateFanIn(node));
  if (node.type === "CABLE_TO_BUS") return ["in"];
  if (node.type === "BUS_TO_CABLE") return multiBitPorts(node);
  if (node.type === "CABLE_MERGER") return cableSegmentPorts(node);
  if (node.type === "CABLE_DIVIDER") return ["in"];
  if (node.type === "CABLE_OUTPUT") return ["in"];
  if (node.type === "MULTI_OUTPUT") return multiBitPorts(node);
  if (node.type === "MULTI_PIN") return multiBitPorts(node).map((port) => `${port}in`);
  if (node.type === "CABLE_PIN") return ["in"];
  if (node.type === "BUS") return busInputs(node);
  if (node.type === "MACRO") return macroPorts(node, "input").map((pin) => pin.id);
  return GATE_META[node.type].inputs;
}

function nodeOutputs(node) {
  if (node.type === "MULTI_INPUT" || node.type === "MULTI_TEST_INPUT") return multiBitPorts(node);
  if (node.type === "CABLE_TO_BUS") return multiBitPorts(node);
  if (node.type === "BUS_TO_CABLE") return ["out"];
  if (node.type === "CABLE_MERGER") return ["out"];
  if (node.type === "CABLE_DIVIDER") return cableSegmentPorts(node);
  if (node.type === "MULTI_PIN") return multiBitPorts(node).map((port) => `${port}out`);
  if (node.type === "CABLE_PIN") return ["out"];
  if (node.type === "BUS") return busOutputs(node);
  if (node.type === "MACRO") return macroPorts(node, "output").map((pin) => pin.id);
  return GATE_META[node.type].outputs;
}

function nodeLabel(node) {
  if (isFanInGate(node)) return `${node.type} (${gateFanIn(node)} inputs)`;
  if (node.type === "MACRO") return findMacro(node.macroId)?.name || "Macro";
  return GATE_META[node.type].label;
}

function createMacroInstanceDefinition(macro) {
  if (!macro) return null;
  return {
    ...cloneData(macro),
    id: uid("macrodef"),
    name: macro.displayName || macro.name || "Macro",
    sourceMacroId: macro.sourceMacroId || macro.id,
    instanceSnapshot: true,
    paletteVisible: false,
    loadedAsPaletteMacro: false,
    displayName: "",
  };
}

function hideFanInMenu() {
  busToolMenuDraft = null;
  fanInMenu.hidden = true;
  fanInMenu.replaceChildren();
}

function setGateFanIn(node, fanIn) {
  recordUndo();
  node.fanIn = fanIn;
  const allowedInputs = new Set(nodeInputs(node));
  state.wires = state.wires.filter((wire) => {
    const to = normalizeEndpoint(wire.to, "input");
    return !(to.kind === "port" && to.nodeId === node.id && !allowedInputs.has(to.port));
  });
  hideFanInMenu();
  render();
}

function selectNode(id) {
  state.selectedNodeId = id;
  state.selectedWireId = null;
  state.selectedNodeIds = [id];
  state.selectedWireIds = [];
  updateSelectionRotationCenter();
}

function selectWire(id) {
  state.selectedWireId = id;
  state.selectedNodeId = null;
  state.selectedWireIds = [id];
  state.selectedNodeIds = [];
  updateSelectionRotationCenter();
}

function selectMany(nodeIds, wireIds) {
  state.selectedNodeIds = [...nodeIds];
  state.selectedWireIds = [...wireIds];
  state.selectedNodeId = state.selectedNodeIds.length === 1 && !state.selectedWireIds.length ? state.selectedNodeIds[0] : null;
  state.selectedWireId = state.selectedWireIds.length === 1 && !state.selectedNodeIds.length ? state.selectedWireIds[0] : null;
  updateSelectionRotationCenter();
}

function isNodeSelected(id) {
  return state.selectedNodeIds.includes(id);
}

function isWireSelected(id) {
  return state.selectedWireIds.includes(id);
}

function selectedCount() {
  return state.selectedNodeIds.length + state.selectedWireIds.length;
}

function clearSelection() {
  state.selectedNodeId = null;
  state.selectedWireId = null;
  state.selectedNodeIds = [];
  state.selectedWireIds = [];
  state.selectionRotationCenter = null;
}


function showFanInMenu(node, clientX, clientY) {
  fanInMenu.replaceChildren();
  appendFanInControls(node);
  positionContextMenu(clientX, clientY);
}

function appendFanInControls(node) {
  for (const fanIn of [2, 3, 4]) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = `${fanIn} inputs`;
    button.classList.toggle("active", gateFanIn(node) === fanIn);
    button.addEventListener("click", () => setGateFanIn(node, fanIn));
    fanInMenu.appendChild(button);
  }
}

function appendOnColorControl(node) {
  const label = document.createElement("label");
  label.className = "menu-field";
  label.textContent = "On color";
  const input = document.createElement("input");
  input.type = "color";
  input.value = node.onColor || DEFAULT_HOT_COLOR;
  input.addEventListener("input", () => {
    recordUndoForColorInput(input);
    node.onColor = input.value;
    render();
  });
  input.addEventListener("change", () => {
    input.dataset.editing = "false";
  });
  label.appendChild(input);
  fanInMenu.appendChild(label);
}

function textStyle(text) {
  return [
    `font-size: ${Number(text.fontSize || 48)}px`,
    `font-family: ${text.fontFamily || "Segoe UI, system-ui, sans-serif"}`,
    `fill: ${text.color || "var(--fg)"}`,
  ].join("; ");
}

function textBoxSize(text) {
  return {
    w: Math.max(1, Math.round(Number(text?.w || NODE_SIZES.TEXT.w))),
    h: Math.max(1, Math.round(Number(text?.h || NODE_SIZES.TEXT.h))),
  };
}

function textBoxHorizontalAlign(text) {
  return ["left", "center", "right"].includes(text?.align) ? text.align : "left";
}

function textBoxVerticalAlign(text) {
  return ["top", "middle", "bottom"].includes(text?.verticalAlign) ? text.verticalAlign : "middle";
}

function textAnchor(text) {
  const align = textBoxHorizontalAlign(text);
  if (align === "left") return "start";
  if (align === "right") return "end";
  return "middle";
}

function textBaseline(text) {
  const align = textBoxVerticalAlign(text);
  if (align === "top") return "hanging";
  if (align === "bottom") return "text-after-edge";
  return "middle";
}

function textBaselineOffset(text) {
  return textBoxVerticalAlign(text) === "middle" ? "0.12em" : "0";
}

function textPositionInBox(text, px, py, w, h) {
  const padding = Math.min(GRID * 0.25, w / 4, h / 4);
  const horizontal = textBoxHorizontalAlign(text);
  const vertical = textBoxVerticalAlign(text);
  const x = horizontal === "left" ? px + padding : horizontal === "right" ? px + w - padding : px + w / 2;
  const y = vertical === "top" ? py + padding : vertical === "bottom" ? py + h - padding : py + h / 2;
  return { x, y };
}

function textPixelBounds(text, offsetX = 0, offsetY = 0) {
  const size = textBoxSize(text);
  const minX = offsetX + text.x * GRID;
  const minY = offsetY + text.y * GRID;
  return {
    minX,
    minY,
    maxX: minX + size.w * GRID,
    maxY: minY + size.h * GRID,
  };
}

function applyTextDefaults(target, textValue = state.settings.textDefaults.text) {
  const defaults = normalizeSettings(state.settings).textDefaults;
  target.text = textValue || defaults.text || "Text";
  target.w = Math.max(1, Math.round(Number(defaults.w || NODE_SIZES.TEXT.w)));
  target.h = Math.max(1, Math.round(Number(defaults.h || NODE_SIZES.TEXT.h)));
  target.align = textBoxHorizontalAlign(defaults);
  target.verticalAlign = textBoxVerticalAlign(defaults);
  target.fontSize = Math.max(8, Number(defaults.fontSize || 48));
  target.fontFamily = defaults.fontFamily || "Segoe UI, system-ui, sans-serif";
  target.color = defaults.color || "#20231f";
}

let pendingTextRequest = null;
let pendingTextValidator = null;
let pendingDimensionRequest = null;
let pendingCableSwitchRequest = null;
let busToolMenuDraft = null;
let modalZIndex = 100;

function bringModalToFront(modal) {
  modalZIndex += 1;
  modal.style.zIndex = String(modalZIndex);
}

function registerStackedModal(modal) {
  modal.addEventListener("pointerdown", () => bringModalToFront(modal), { capture: true });
}

function openModals() {
  return [settingsModal, templateModal, macroViewModal, textModal, dimensionModal, cableSwitchModal]
    .filter((modal) => modal && !modal.hidden);
}

function topOpenModal() {
  return openModals()
    .sort((a, b) => Number(b.style.zIndex || 100) - Number(a.style.zIndex || 100))[0] || null;
}

function requestTextValue({ title = "Text", value = "Text", inputType = "text", min = "", max = "", step = "", validate = null } = {}) {
  if (pendingTextRequest) pendingTextRequest(null);
  pendingTextValidator = validate;
  textModalTitle.textContent = title;
  textModalInput.type = inputType;
  textModalInput.min = min;
  textModalInput.max = max;
  textModalInput.step = step;
  textModalInput.setCustomValidity("");
  textModalInput.value = value || "";
  bringModalToFront(textModal);
  textModal.hidden = false;
  textModalInput.focus();
  textModalInput.select();
  return new Promise((resolve) => {
    pendingTextRequest = resolve;
  });
}

function finishTextRequest(value) {
  if (!pendingTextRequest) return;
  const resolve = pendingTextRequest;
  pendingTextRequest = null;
  pendingTextValidator = null;
  textModal.hidden = true;
  resolve(value);
}

function parsePositiveGridLength(value) {
  const length = Math.round(Number(value));
  return Number.isFinite(length) && length > 0 ? length : null;
}

function requestDimensionValue({ title = "Size", width = 8, height = 6 } = {}) {
  if (pendingDimensionRequest) pendingDimensionRequest(null);
  dimensionModalTitle.textContent = title;
  dimensionWidthInput.value = String(width);
  dimensionHeightInput.value = String(height);
  bringModalToFront(dimensionModal);
  dimensionModal.hidden = false;
  dimensionWidthInput.focus();
  dimensionWidthInput.select();
  return new Promise((resolve) => {
    pendingDimensionRequest = resolve;
  });
}

function finishDimensionRequest(value) {
  if (!pendingDimensionRequest) return;
  const resolve = pendingDimensionRequest;
  pendingDimensionRequest = null;
  dimensionModal.hidden = true;
  resolve(value);
}

function requestCableSwitchConfig({ bits = 4, data = 0 } = {}) {
  if (pendingCableSwitchRequest) pendingCableSwitchRequest(null);
  cableSwitchBitsInput.value = String(bits);
  cableSwitchDataInput.value = String(data);
  cableSwitchBitsInput.setCustomValidity("");
  cableSwitchDataInput.setCustomValidity("");
  bringModalToFront(cableSwitchModal);
  cableSwitchModal.hidden = false;
  cableSwitchBitsInput.focus();
  cableSwitchBitsInput.select();
  return new Promise((resolve) => {
    pendingCableSwitchRequest = resolve;
  });
}

function finishCableSwitchRequest(value) {
  if (!pendingCableSwitchRequest) return;
  const resolve = pendingCableSwitchRequest;
  pendingCableSwitchRequest = null;
  cableSwitchModal.hidden = true;
  resolve(value);
}

function parseCableSwitchConfig() {
  cableSwitchBitsInput.setCustomValidity("");
  cableSwitchDataInput.setCustomValidity("");
  const bits = Math.round(Number(cableSwitchBitsInput.value));
  const data = Math.trunc(Number(cableSwitchDataInput.value));
  if (!Number.isFinite(bits) || bits < 1 || bits > 32) {
    cableSwitchBitsInput.setCustomValidity("Bits must be an integer from 1 to 32.");
    cableSwitchBitsInput.reportValidity();
    return null;
  }
  const maxData = 2 ** bits - 1;
  if (!Number.isFinite(data) || data < 0 || data > maxData) {
    cableSwitchDataInput.setCustomValidity(`Data must satisfy 0 <= data <= ${maxData}.`);
    cableSwitchDataInput.reportValidity();
    return null;
  }
  return { bits, data };
}

function appendTextControls(text, onChange) {
  const editButton = document.createElement("button");
  editButton.type = "button";
  editButton.textContent = "Edit text";
  editButton.addEventListener("click", async () => {
    hideFanInMenu();
    const next = await requestTextValue({ title: "Edit text", value: text.text || "Text" });
    if (next === null) return;
    onChange((target) => {
      target.text = next || "Text";
    });
  });
  fanInMenu.appendChild(editButton);

  const sizeLabel = document.createElement("label");
  sizeLabel.className = "menu-field";
  sizeLabel.textContent = "Size";
  const sizeInput = document.createElement("input");
  sizeInput.type = "number";
  sizeInput.min = "8";
  sizeInput.max = "160";
  sizeInput.step = "1";
  sizeInput.value = Number(text.fontSize || 48);
  sizeInput.addEventListener("change", () => {
    onChange((target) => {
      target.fontSize = Math.max(8, Number(sizeInput.value || 48));
    });
  });
  sizeLabel.appendChild(sizeInput);
  fanInMenu.appendChild(sizeLabel);

  const boxWidthLabel = document.createElement("label");
  boxWidthLabel.className = "menu-field";
  boxWidthLabel.textContent = "Box width";
  const boxWidthInput = document.createElement("input");
  boxWidthInput.type = "number";
  boxWidthInput.min = "1";
  boxWidthInput.step = "1";
  boxWidthInput.value = textBoxSize(text).w;
  boxWidthInput.addEventListener("change", () => {
    onChange((target) => {
      target.w = Math.max(1, Math.round(Number(boxWidthInput.value || NODE_SIZES.TEXT.w)));
    });
  });
  boxWidthLabel.appendChild(boxWidthInput);
  fanInMenu.appendChild(boxWidthLabel);

  const boxHeightLabel = document.createElement("label");
  boxHeightLabel.className = "menu-field";
  boxHeightLabel.textContent = "Box height";
  const boxHeightInput = document.createElement("input");
  boxHeightInput.type = "number";
  boxHeightInput.min = "1";
  boxHeightInput.step = "1";
  boxHeightInput.value = textBoxSize(text).h;
  boxHeightInput.addEventListener("change", () => {
    onChange((target) => {
      target.h = Math.max(1, Math.round(Number(boxHeightInput.value || NODE_SIZES.TEXT.h)));
    });
  });
  boxHeightLabel.appendChild(boxHeightInput);
  fanInMenu.appendChild(boxHeightLabel);

  const horizontalLabel = document.createElement("label");
  horizontalLabel.className = "menu-field";
  horizontalLabel.textContent = "Horizontal";
  const horizontalSelect = document.createElement("select");
  for (const value of ["left", "center", "right"]) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    option.selected = textBoxHorizontalAlign(text) === value;
    horizontalSelect.appendChild(option);
  }
  horizontalSelect.addEventListener("change", () => {
    onChange((target) => {
      target.align = horizontalSelect.value;
    });
  });
  horizontalLabel.appendChild(horizontalSelect);
  fanInMenu.appendChild(horizontalLabel);

  const verticalLabel = document.createElement("label");
  verticalLabel.className = "menu-field";
  verticalLabel.textContent = "Vertical";
  const verticalSelect = document.createElement("select");
  for (const value of ["top", "middle", "bottom"]) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    option.selected = textBoxVerticalAlign(text) === value;
    verticalSelect.appendChild(option);
  }
  verticalSelect.addEventListener("change", () => {
    onChange((target) => {
      target.verticalAlign = verticalSelect.value;
    });
  });
  verticalLabel.appendChild(verticalSelect);
  fanInMenu.appendChild(verticalLabel);

  const colorLabel = document.createElement("label");
  colorLabel.className = "menu-field";
  colorLabel.textContent = "Color";
  const colorInput = document.createElement("input");
  colorInput.type = "color";
  colorInput.value = text.color && text.color.startsWith("#") ? text.color : "#20231f";
  colorInput.addEventListener("input", () => {
    onChange((target) => {
      target.color = colorInput.value;
    });
  });
  colorLabel.appendChild(colorInput);
  fanInMenu.appendChild(colorLabel);

  const fontLabel = document.createElement("label");
  fontLabel.className = "menu-field";
  fontLabel.textContent = "Font";
  const fontSelect = document.createElement("select");
  const fonts = [
    ["Segoe UI", "Segoe UI, system-ui, sans-serif"],
    ["Arial", "Arial, sans-serif"],
    ["Consolas", "Consolas, monospace"],
    ["Times", "Times New Roman, serif"],
  ];
  for (const [label, value] of fonts) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    option.selected = (text.fontFamily || "Segoe UI, system-ui, sans-serif") === value;
    fontSelect.appendChild(option);
  }
  fontSelect.addEventListener("change", () => {
    onChange((target) => {
      target.fontFamily = fontSelect.value;
    });
  });
  fontLabel.appendChild(fontSelect);
  fanInMenu.appendChild(fontLabel);
}

function appendPinMacroControls(node) {
  const editorButton = document.createElement("button");
  editorButton.type = "button";
  editorButton.textContent = "Template Editor...";
  editorButton.addEventListener("click", () => {
    hideFanInMenu();
    openTemplateEditor(node.id);
  });
  fanInMenu.appendChild(editorButton);
}

function appendCircuitTextControls(node) {
  appendTextControls(node, (mutate) => {
    recordUndo();
    mutate(node);
    render();
  });
}

function appendMultiBitControls(node) {
  const label = document.createElement("label");
  label.className = "menu-field";
  label.textContent = "Bits";
  const input = document.createElement("input");
  input.type = "number";
  input.min = "1";
  input.max = "32";
  input.step = "1";
  input.value = multiBitCount(node);
  input.addEventListener("change", () => {
    recordUndo();
    node.bits = Math.min(32, Math.max(1, Math.round(Number(input.value || 4))));
    if (node.type === "MULTI_INPUT" || node.type === "MULTI_TEST_INPUT") node.values = multiBitValues(node);
    hideFanInMenu();
    render();
  });
  label.appendChild(input);
  fanInMenu.appendChild(label);
}

function appendCableSwitchControls(node) {
  const label = document.createElement("label");
  label.className = "menu-field";
  label.textContent = "Data";
  const input = document.createElement("input");
  input.type = "number";
  input.min = "0";
  input.max = String(2 ** multiBitCount(node) - 1);
  input.step = "1";
  input.value = cableDataValue(node);
  input.addEventListener("change", () => {
    const data = Math.trunc(Number(input.value));
    const maxData = 2 ** multiBitCount(node) - 1;
    if (!Number.isFinite(data) || data < 0 || data > maxData) {
      input.setCustomValidity(`Data must satisfy 0 <= data <= ${maxData}.`);
      input.reportValidity();
      return;
    }
    input.setCustomValidity("");
    recordUndo();
    node.data = data;
    hideFanInMenu();
    render();
  });
  label.appendChild(input);
  fanInMenu.appendChild(label);
}

function appendClockFrequencyControls(node) {
  const label = document.createElement("div");
  label.className = "menu-field";
  label.textContent = "Frequency";
  const options = document.createElement("div");
  options.className = "frequency-options";
  for (const hz of [1, 2, 5, 10]) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = `${hz}Hz`;
    button.classList.toggle("active", clockFrequency(node) === hz);
    button.addEventListener("click", () => {
      recordUndo();
      node.clockHz = hz;
      node.lastClockTick = performance.now();
      hideFanInMenu();
      render();
    });
    options.appendChild(button);
  }
  label.appendChild(options);
  fanInMenu.appendChild(label);
}

function appendPulseControls(node) {
  const patternLabel = document.createElement("label");
  patternLabel.className = "menu-field";
  patternLabel.textContent = "Pattern";
  const patternInput = document.createElement("input");
  patternInput.type = "text";
  patternInput.value = normalizePulsePattern(node.pulsePattern);
  patternInput.placeholder = "0, 1, X, Z";
  patternInput.addEventListener("change", () => {
    const pattern = normalizePulsePattern(patternInput.value);
    recordUndo();
    node.pulsePattern = pattern;
    node.pulseIndex = 0;
    node.lastPulseTick = performance.now();
    hideFanInMenu();
    render();
  });
  patternLabel.appendChild(patternInput);
  fanInMenu.appendChild(patternLabel);

  const frequencyLabel = document.createElement("div");
  frequencyLabel.className = "menu-field";
  frequencyLabel.textContent = "Frequency";
  const options = document.createElement("div");
  options.className = "frequency-options";
  for (const hz of [1, 2, 5, 10]) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = `${hz}Hz`;
    button.classList.toggle("active", pulseFrequency(node) === hz);
    button.addEventListener("click", () => {
      recordUndo();
      node.pulseHz = hz;
      node.lastPulseTick = performance.now();
      hideFanInMenu();
      render();
    });
    options.appendChild(button);
  }
  frequencyLabel.appendChild(options);
  fanInMenu.appendChild(frequencyLabel);
}

function appendSignalChoiceControls({ title, value, onSelect }) {
  const label = document.createElement("div");
  label.className = "menu-field signal-choice-field";
  label.textContent = title;
  const options = document.createElement("div");
  options.className = "signal-choice-options";
  for (const signal of [SIGNAL.ZERO, SIGNAL.ONE, SIGNAL.UNKNOWN]) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = signal;
    button.classList.toggle("active", signalValue(value) === signal);
    button.addEventListener("click", () => onSelect(signal));
    options.appendChild(button);
  }
  label.appendChild(options);
  fanInMenu.appendChild(label);
}

function appendSequentialStateControls(node) {
  appendSignalChoiceControls({
    title: "Current Q",
    value: storedQ(node),
    onSelect: (signal) => {
      recordUndo();
      setSequentialQ(node, signal);
      if (FLIP_FLOP_TYPES.has(node.type)) node.lastClock = SIGNAL.ZERO;
      hideFanInMenu();
      render();
    },
  });
}

function positionContextMenu(clientX, clientY) {
  const margin = 8;
  fanInMenu.style.zIndex = String(modalZIndex + 1);
  fanInMenu.hidden = false;
  fanInMenu.style.visibility = "hidden";
  fanInMenu.style.left = "0px";
  fanInMenu.style.top = "0px";
  const rect = fanInMenu.getBoundingClientRect();
  const maxLeft = Math.max(margin, window.innerWidth - rect.width - margin);
  const maxTop = Math.max(margin, window.innerHeight - rect.height - margin);
  const left = Math.min(maxLeft, Math.max(margin, clientX));
  const top = Math.min(maxTop, Math.max(margin, clientY));
  fanInMenu.style.left = `${left}px`;
  fanInMenu.style.top = `${top}px`;
  fanInMenu.style.visibility = "";
}

function showNodeContextMenu(node, clientX, clientY) {
  fanInMenu.replaceChildren();
  if (isFanInGate(node)) appendFanInControls(node);
  if (isCableSourceNode(node)) appendCableSwitchControls(node);
  if (node?.type === "CLOCK") appendClockFrequencyControls(node);
  if (node?.type === "PULSE") appendPulseControls(node);
  if (SEQUENTIAL_TYPES.has(node?.type)) appendSequentialStateControls(node);
  if (node?.type === "MULTI_INPUT" || node?.type === "MULTI_TEST_INPUT" || node?.type === "BUS") appendMultiBitControls(node);
  if (node?.type === "MULTI_OUTPUT" || node?.type === "MULTI_PIN") appendMultiBitControls(node);
  if (node?.type === "INPUT" || node?.type === "MULTI_INPUT" || isCableSourceNode(node) || node?.type === "TEST_INPUT" || node?.type === "MULTI_TEST_INPUT" || node?.type === "OUTPUT" || node?.type === "MULTI_OUTPUT") appendOnColorControl(node);
  if (node?.type === "PIN" || node?.type === "MULTI_PIN" || node?.type === "CABLE_PIN") appendPinMacroControls(node);
  if (node?.type === "TEXT") appendCircuitTextControls(node);
  if (!fanInMenu.childElementCount) {
    hideFanInMenu();
    return;
  }
  positionContextMenu(clientX, clientY);
}

function updateBusToolOptions(mutator) {
  const baseOptions = state.pendingPartOptions || state.busStart?.options || {};
  const options = { ...baseOptions };
  mutator(options);
  options.busA = busToolA(options);
  options.busB = busToolB(options);
  options.busVectorIndex = busToolVectorIndex(options);
  state.pendingPartOptions = options;
  if (state.busStart) state.busStart.options = options;
  render();
}

function busDirectionLabel(index, options = state.pendingPartOptions || state.busStart?.options || {}) {
  const signs = busVectorSignsFromIndex(index);
  const x = signs.x * busToolA(options);
  const y = signs.y * busToolB(options);
  return `(${x}, ${y})`;
}

function showBusToolContextMenu(clientX, clientY) {
  const options = state.pendingPartOptions || state.busStart?.options || {};
  busToolMenuDraft = {
    busA: busToolA(options),
    busB: busToolB(options),
    busVectorIndex: busToolVectorIndex(options),
  };
  fanInMenu.replaceChildren();

  const horizontalLabel = document.createElement("label");
  horizontalLabel.className = "menu-field";
  horizontalLabel.textContent = "Horizontal a";
  const horizontalInput = document.createElement("input");
  horizontalInput.type = "number";
  horizontalInput.min = "1";
  horizontalInput.max = "32";
  horizontalInput.step = "1";
  horizontalInput.value = String(busToolA(options));
  let refreshDirectionButtons = () => {};
  horizontalInput.addEventListener("input", () => {
    if (!busToolMenuDraft) return;
    busToolMenuDraft.busA = Math.min(32, Math.max(1, Math.round(Number(horizontalInput.value || 2))));
    refreshDirectionButtons();
  });
  horizontalLabel.appendChild(horizontalInput);
  fanInMenu.appendChild(horizontalLabel);

  const verticalLabel = document.createElement("label");
  verticalLabel.className = "menu-field";
  verticalLabel.textContent = "Vertical b";
  const verticalInput = document.createElement("input");
  verticalInput.type = "number";
  verticalInput.min = "1";
  verticalInput.max = "32";
  verticalInput.step = "1";
  verticalInput.value = String(busToolB(options));
  verticalInput.addEventListener("input", () => {
    if (!busToolMenuDraft) return;
    busToolMenuDraft.busB = Math.min(32, Math.max(1, Math.round(Number(verticalInput.value || 2))));
    refreshDirectionButtons();
  });
  verticalLabel.appendChild(verticalInput);
  fanInMenu.appendChild(verticalLabel);

  const directionLabel = document.createElement("div");
  directionLabel.className = "menu-field bus-direction-field";
  directionLabel.textContent = "Direction";
  const directionGrid = document.createElement("div");
  directionGrid.className = "bus-direction-grid";
  const directionCells = [
    { index: 3, label: "\u2196" },
    { index: 2, label: "\u2191" },
    { index: 1, label: "\u2197" },
    { index: 4, label: "\u2190" },
    null,
    { index: 0, label: "\u2192" },
    { index: 5, label: "\u2199" },
    { index: 6, label: "\u2193" },
    { index: 7, label: "\u2198" },
  ];
  const directionButtons = [];
  for (const cell of directionCells) {
    if (!cell) {
      const spacer = document.createElement("span");
      spacer.className = "bus-direction-spacer";
      directionGrid.appendChild(spacer);
      continue;
    }
    const button = document.createElement("button");
    button.type = "button";
    button.className = "bus-direction-button";
    button.textContent = cell.label;
    button.dataset.index = String(cell.index);
    button.addEventListener("click", () => {
      if (!busToolMenuDraft) return;
      busToolMenuDraft.busVectorIndex = cell.index;
      refreshDirectionButtons();
    });
    directionButtons.push(button);
    directionGrid.appendChild(button);
  }
  refreshDirectionButtons = () => {
    for (const button of directionButtons) {
      const index = Number(button.dataset.index || 0);
      const isActive = busToolVectorIndex(busToolMenuDraft || options) === index;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
      button.title = busDirectionLabel(index, busToolMenuDraft || options);
    }
  };
  refreshDirectionButtons();
  directionLabel.appendChild(directionGrid);
  fanInMenu.appendChild(directionLabel);

  const actions = document.createElement("div");
  actions.className = "dialog-actions";
  const okButton = document.createElement("button");
  okButton.type = "button";
  okButton.textContent = "OK";
  okButton.addEventListener("click", () => {
    if (!busToolMenuDraft) return;
    updateBusToolOptions((next) => {
      next.busA = busToolMenuDraft.busA;
      next.busB = busToolMenuDraft.busB;
      next.busVectorIndex = busToolMenuDraft.busVectorIndex;
    });
    hideFanInMenu();
  });
  const cancelButton = document.createElement("button");
  cancelButton.type = "button";
  cancelButton.textContent = "Cancel";
  cancelButton.addEventListener("click", hideFanInMenu);
  actions.append(okButton, cancelButton);
  fanInMenu.appendChild(actions);

  positionContextMenu(clientX, clientY);
}

function showCanvasContextMenu(clientX, clientY) {
  fanInMenu.replaceChildren();
  const editorButton = document.createElement("button");
  editorButton.type = "button";
  editorButton.textContent = "Template Editor...";
  editorButton.addEventListener("click", () => {
    hideFanInMenu();
    openTemplateEditor(null);
  });
  fanInMenu.appendChild(editorButton);
  positionContextMenu(clientX, clientY);
}

let suppressPortRotation = false;

function localPortPosition(node, portName, direction) {
  const size = nodeSize(node);
  if (isSinglePortIndicatorType(node.type)) {
    return { x: size.w / 2, y: size.h / 2 };
  }
  if (isCableSourceNode(node)) {
    return { x: size.w / 2, y: size.h };
  }
  if (node.type === "CABLE_OUTPUT") {
    return { x: size.w / 2, y: size.h };
  }
  if (node.type === "CABLE_TO_BUS") {
    if (direction === "input") return { x: 0, y: size.h / 2 };
    const index = Math.max(0, Number(String(portName).replace("bit", "")) || 0);
    return { x: size.w, y: 1 + index * 2 };
  }
  if (node.type === "BUS_TO_CABLE") {
    if (direction === "output") return { x: size.w, y: size.h / 2 };
    const index = Math.max(0, Number(String(portName).replace("bit", "")) || 0);
    return { x: 0, y: 1 + index * 2 };
  }
  if (node.type === "CABLE_MERGER") {
    if (direction === "output") return { x: size.w, y: size.h / 2 };
    const index = Math.max(0, Number(String(portName).replace("part", "")) || 0);
    return { x: 0, y: cableSegmentLocalY(node, index) };
  }
  if (node.type === "CABLE_DIVIDER") {
    if (direction === "input") return { x: 0, y: size.h / 2 };
    const index = Math.max(0, Number(String(portName).replace("part", "")) || 0);
    return { x: size.w, y: cableSegmentLocalY(node, index) };
  }
  if (node.type === "MULTI_INPUT" || node.type === "MULTI_TEST_INPUT") {
    const index = Math.max(0, Number(String(portName).replace("bit", "")) || 0);
    return { x: 1 + index * 2, y: 4 };
  }
  if (node.type === "MULTI_OUTPUT") {
    const index = Math.max(0, Number(String(portName).replace("bit", "")) || 0);
    return { x: 1 + index * 2, y: 2 };
  }
  if (node.type === "MULTI_PIN") {
    const index = Math.max(0, Number(String(portName).replace(/^bit/, "").replace(/(in|out)$/, "")) || 0);
    return { x: 1 + index * 2, y: 2 };
  }
  if (node.type === "BUS") {
    const index = Math.max(0, Number(String(portName).replace(/^(in|out)/, "")) || 0);
    if (node.busDiagonal) {
      return direction === "input"
        ? { x: 1 + index * 2, y: 0 }
        : { x: 1 + index * 2, y: 2 + index * 2 };
    }
    return direction === "input"
      ? { x: 1 + index * 2, y: 0 }
      : { x: 1 + index * 2, y: 2 };
  }
  if (node.type === "PIN" || node.type === "CABLE_PIN" || node.type === "JUNCTION") {
    return { x: size.w / 2, y: size.h / 2 };
  }
  if (node.type === "MACRO") {
    const ports = macroPorts(node, direction);
    const pin = ports.find((item) => item.id === portName) || ports[0];
    return pin ? macroPinPosition(pin, size) : { x: direction === "input" ? 0 : size.w, y: size.h / 2 };
  }
  if (SEQUENTIAL_TYPES.has(node.type)) {
    if (direction === "output") return { x: size.w + 4, y: portName === "qbar" ? 12 : 4 };
    if (portName === "clk" || portName === "en") return { x: size.w / 2, y: size.h + 4 };
    if (portName === "r" || portName === "k") return { x: -4, y: 12 };
    return { x: -4, y: 4 };
  }
  if (node.type === "TRISTATE") {
    if (direction === "input" && portName === "en") return { x: size.w / 2, y: size.h / 2 + 2 };
    return { x: direction === "input" ? 0 : size.w, y: size.h / 2 };
  }
  if (node.type === "NOT" || node.type === "BUFFER") {
    return { x: direction === "input" ? 0 : size.w, y: size.h / 2 };
  }
  if (direction === "input") {
    const inputs = nodeInputs(node);
    if (isFanInGate(node)) {
      const ySlots = {
        2: [1, 5],
        3: [1, 3, 5],
        4: [0, 2, 4, 6],
      };
      const index = inputs.indexOf(portName);
      return { x: 0, y: ySlots[gateFanIn(node)][index] };
    }
    const index = inputs.indexOf(portName);
    const spacing = size.h / (inputs.length + 1);
    return { x: 0, y: Math.round((index + 1) * spacing) };
  }
  const outputs = nodeOutputs(node);
  const index = outputs.indexOf(portName);
  const spacing = size.h / (outputs.length + 1);
  return { x: size.w, y: Math.round((index + 1) * spacing) };
}

// Ports are derived from node position, node size, rotation, and gate metadata.
function portPosition(node, portName, direction) {
  const size = nodeSize(node);
  const local = localPortPosition(node, portName, direction);
  const rotated = suppressPortRotation ? local : transformLocalPoint(local, node, size);
  return { x: node.x + rotated.x, y: node.y + rotated.y };
}

function findNode(id) {
  return state.nodes.find((node) => node.id === id);
}

function findWire(id) {
  return state.wires.find((wire) => wire.id === id);
}

function normalizeEndpoint(endpoint, direction) {
  if (endpoint.kind === "wire") return endpoint;
  if (endpoint.kind === "pending-junction") return endpoint;
  return {
    kind: "port",
    nodeId: endpoint.nodeId,
    port: endpoint.port,
    direction: endpoint.direction || direction,
    ...(endpoint.bitLength ? { bitLength: endpoint.bitLength } : {}),
  };
}

function endpointPosition(endpoint, direction) {
  const normalized = normalizeEndpoint(endpoint, direction);
  if (normalized.kind === "wire") return normalized.point;
  if (normalized.kind === "pending-junction") return normalized.point;
  const node = findNode(normalized.nodeId);
  if (!node) return null;
  return portPosition(node, normalized.port, normalized.direction);
}

function wirePathPoints(wire) {
  const start = endpointPosition(wire.from, "output");
  const end = endpointPosition(wire.to, "input");
  if (!start || !end) return [];
  return [start, ...(wire.points || []), end];
}

function wireBitLength(wire) {
  return Math.max(
    1,
    Math.round(Number(wire.bitLength || endpointBitLength(wire.from, "output") || endpointBitLength(wire.to, "input") || 1)),
  );
}

// Insert corner points whenever two consecutive points would form a diagonal segment.
function orthogonalizePoints(points) {
  if (points.length < 2) return points;
  const result = [points[0]];
  for (let index = 1; index < points.length; index += 1) {
    const previous = result[result.length - 1];
    const current = points[index];
    if (previous.x !== current.x && previous.y !== current.y) {
      result.push({ x: current.x, y: previous.y });
    }
    result.push(current);
  }
  return result;
}

// SVG paths are drawn in unzoomed grid pixels; the viewport transform handles pan/zoom.
function pointsToSvgPath(points) {
  if (!points.length) return "";
  return points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x * GRID} ${point.y * GRID}`).join(" ");
}

function samePoint(a, b) {
  return a.x === b.x && a.y === b.y;
}

function pointOnSegment(point, a, b, tolerance = 0) {
  const cross = (point.x - a.x) * (b.y - a.y) - (point.y - a.y) * (b.x - a.x);
  const length = Math.hypot(b.x - a.x, b.y - a.y);
  if (length === 0) return samePoint(point, a);
  if (Math.abs(cross) / length > tolerance) return false;
  return point.x >= Math.min(a.x, b.x)
    && point.x <= Math.max(a.x, b.x)
    && point.y >= Math.min(a.y, b.y)
    && point.y <= Math.max(a.y, b.y);
}

function findWireAtGridPoint(point, excludedWireId = null, tolerance = 0) {
  for (const wire of state.wires) {
    if (wire.id === excludedWireId) continue;
    const points = wirePathPoints(wire);
    for (let index = 1; index < points.length; index += 1) {
      if (pointOnSegment(point, points[index - 1], points[index], tolerance)) return wire;
    }
  }
  return null;
}

function findJunctionAtPoint(point) {
  return state.nodes.find((node) => node.type === "JUNCTION" && samePoint(portPosition(node, "out", "output"), point));
}

function syncJunctionBitLengthsFromWires() {
  for (const node of state.nodes) {
    if (node.type !== "JUNCTION") continue;
    const storedBits = directJunctionBitLength(node);
    const inferredBits = inferJunctionBitLength({ ...node, bitLength: undefined, bits: undefined });
    if (!storedBits || storedBits === 1 && inferredBits > 1) {
      node.bitLength = inferredBits;
    }
  }
}

function splitWirePointsAtPoint(wire, point) {
  const points = wirePathPoints(wire);
  for (let index = 1; index < points.length; index += 1) {
    const a = points[index - 1];
    const b = points[index];
    if (!pointOnSegment(point, a, b, 0.0001)) continue;
    const before = points.slice(1, index).filter((item) => !samePoint(item, point)).map((item) => ({ ...item }));
    const after = points.slice(index, -1).filter((item) => !samePoint(item, point)).map((item) => ({ ...item }));
    return { before, after };
  }
  return { before: [], after: [] };
}

function ensureJunctionAtWirePoint(wire, point) {
  let junction = findJunctionAtPoint(point);
  const bitLength = wireBitLength(wire);
  const from = normalizeEndpoint(wire.from, "output");
  const to = normalizeEndpoint(wire.to, "input");
  if (junction && (
    (from.kind === "port" && from.nodeId === junction.id)
    || (to.kind === "port" && to.nodeId === junction.id)
  )) {
    const storedBits = directJunctionBitLength(junction);
    if (!storedBits || storedBits === 1 && bitLength > 1) junction.bitLength = bitLength;
    return junction;
  }
  if (!junction) {
    junction = {
      id: uid("junction"),
      type: "JUNCTION",
      x: point.x - 0.5,
      y: point.y - 0.5,
      bitLength,
    };
    state.nodes.push(junction);
  } else if (!directJunctionBitLength(junction) || directJunctionBitLength(junction) === 1 && bitLength > 1) {
    junction.bitLength = bitLength;
  }
  const split = splitWirePointsAtPoint(wire, point);
  const firstWire = {
    ...wire,
    to: { kind: "port", nodeId: junction.id, port: "in", direction: "input" },
    points: split.before,
    bitLength,
  };
  const secondWire = {
    id: uid("wire"),
    from: { kind: "port", nodeId: junction.id, port: "out", direction: "output" },
    to: { ...wire.to },
    points: split.after,
    bitLength,
  };
  state.wires = state.wires.filter((item) => item.id !== wire.id);
  state.wires.push(firstWire, secondWire);
  return junction;
}

function junctionEndpointForWirePoint(wire, point, direction) {
  const junction = ensureJunctionAtWirePoint(wire, point);
  return {
    kind: "port",
    nodeId: junction.id,
    port: direction === "input" ? "in" : "out",
    direction,
    bitLength: wireBitLength(wire),
  };
}

function wireBounds(wire) {
  const points = wirePathPoints(wire);
  if (!points.length) return null;
  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);
  return {
    minX: Math.min(...xs),
    minY: Math.min(...ys),
    maxX: Math.max(...xs),
    maxY: Math.max(...ys),
  };
}

function nodeBounds(node) {
  const size = nodeSize(node);
  const corners = [
    { x: 0, y: 0 },
    { x: size.w, y: 0 },
    { x: 0, y: size.h },
    { x: size.w, y: size.h },
  ].map((point) => transformLocalPoint(point, node, size))
    .map((point) => ({ x: node.x + point.x, y: node.y + point.y }));
  return {
    minX: Math.min(...corners.map((point) => point.x)),
    minY: Math.min(...corners.map((point) => point.y)),
    maxX: Math.max(...corners.map((point) => point.x)),
    maxY: Math.max(...corners.map((point) => point.y)),
  };
}

function normalizedBounds(a, b) {
  return {
    minX: Math.min(a.x, b.x),
    minY: Math.min(a.y, b.y),
    maxX: Math.max(a.x, b.x),
    maxY: Math.max(a.y, b.y),
  };
}

function boundsIntersect(a, b) {
  return a.minX <= b.maxX && a.maxX >= b.minX && a.minY <= b.maxY && a.maxY >= b.minY;
}

function boundsContains(container, item) {
  return item.minX >= container.minX
    && item.maxX <= container.maxX
    && item.minY >= container.minY
    && item.maxY <= container.maxY;
}

function selectInBounds(bounds) {
  const nodeIds = state.nodes.filter((node) => boundsContains(bounds, nodeBounds(node))).map((node) => node.id);
  const wireIds = state.wires.filter((wire) => {
    const boundsForWire = wireBounds(wire);
    return boundsForWire && boundsContains(bounds, boundsForWire);
  }).map((wire) => wire.id);
  selectMany(nodeIds, wireIds);
}

function getOutputValue(nodeId, port) {
  return signalIsOne(state.values.get(`${nodeId}.${port}`));
}

function inputValuesForNode(node, values = state.values) {
  const inputs = {};
  for (const port of nodeInputs(node)) inputs[port] = signalValue(values.get(`${node.id}.${port}`));
  return inputs;
}

function endpointKey(endpoint, direction) {
  const normalized = normalizeEndpoint(endpoint, direction);
  if (normalized.kind === "wire") return `wire:${normalized.wireId}`;
  return `port:${normalized.nodeId}.${normalized.port}`;
}

function portKey(nodeId, port) {
  return `port:${nodeId}.${port}`;
}

function endpointBitLength(endpoint, direction) {
  const normalized = normalizeEndpoint(endpoint, direction);
  if (normalized.kind !== "port") return normalized.bitLength || 1;
  if (normalized.bitLength) return Math.max(1, Math.round(Number(normalized.bitLength || 1)));
  const node = findNode(normalized.nodeId);
  return portBitLength(node, normalized.port);
}

function createUnionFind() {
  const parents = new Map();

  function find(key) {
    if (!parents.has(key)) parents.set(key, key);
    const parent = parents.get(key);
    if (parent === key) return key;
    const root = find(parent);
    parents.set(key, root);
    return root;
  }

  function union(a, b) {
    const rootA = find(a);
    const rootB = find(b);
    if (rootA !== rootB) parents.set(rootB, rootA);
  }

  return { find, union };
}

function buildConnectivity() {
  const graph = createUnionFind();
  for (const wire of state.wires) {
    const wireKey = `wire:${wire.id}`;
    graph.union(wireKey, endpointKey(wire.from, "output"));
    graph.union(wireKey, endpointKey(wire.to, "input"));
  }
  for (const node of state.nodes) {
  if (node.type === "PIN" || node.type === "JUNCTION") {
    graph.union(portKey(node.id, "in"), portKey(node.id, "out"));
  }
  if (node.type === "CABLE_PIN") {
    graph.union(portKey(node.id, "in"), portKey(node.id, "out"));
  }
    if (node.type === "MULTI_PIN") {
      for (const port of multiBitPorts(node)) {
        graph.union(portKey(node.id, `${port}in`), portKey(node.id, `${port}out`));
      }
    }
  }
  return graph;
}

function groupHotValues(values, graph) {
  const driven = new Map();
  for (const node of state.nodes) {
    for (const port of driverPortsForNode(node)) {
      const key = portKey(node.id, port);
      const root = graph.find(key);
      if (!driven.has(root)) driven.set(root, []);
      driven.get(root).push(signalValue(values.get(`${node.id}.${port}`)));
    }
  }
  const hot = new Map();
  for (const [root, signals] of driven) hot.set(root, resolveSignals(signals));
  return hot;
}

function groupCableValues(values, graph) {
  const cableValues = new Map();
  for (const node of state.nodes) {
    for (const port of driverPortsForNode(node)) {
      const key = `${node.id}.${port}.__cable`;
      if (!values.has(key)) continue;
      const root = graph.find(portKey(node.id, port));
      cableValues.set(root, Math.max(0, Math.trunc(Number(values.get(key) || 0))));
    }
  }
  return cableValues;
}

function readInputValue(nodeId, port, hot, graph) {
  const root = graph.find(portKey(nodeId, port));
  return signalValue(hot.get(root));
}

function readCableInputValue(nodeId, port, cableValues, graph) {
  return Math.max(0, Math.trunc(Number(cableValues.get(graph.find(portKey(nodeId, port))) || 0)));
}

function readCableCompatibleInputValue(node, port, hot, cableValues, graph) {
  const cableValue = readCableInputValue(node.id, port, cableValues, graph);
  if (cableValue) return cableValue;
  return portBitLength(node, port) === 1 && signalIsOne(readInputValue(node.id, port, hot, graph)) ? 1 : 0;
}

function setSimValue(values, key, value) {
  if (values.get(key) === value) return false;
  values.set(key, value);
  return true;
}

function reusableSimValues(previousValues = state.values) {
  const values = new Map();
  for (const node of state.nodes) {
    for (const port of driverPortsForNode(node)) {
      const key = `${node.id}.${port}`;
      if (previousValues.has(key)) values.set(key, previousValues.get(key));
      const cableKey = `${key}.__cable`;
      if (previousValues.has(cableKey)) values.set(cableKey, previousValues.get(cableKey));
    }
  }
  return values;
}

function driverPortsForNode(node) {
  if (["OUTPUT", "CABLE_OUTPUT", "PIN", "MULTI_PIN", "CABLE_PIN", "JUNCTION", "TEXT"].includes(node.type)) return [];
  return nodeOutputs(node);
}

function isLogicConsumer(node) {
  if (SEQUENTIAL_TYPES.has(node.type)) return false;
  return !["INPUT", "TEST_INPUT", "VCC", "GND", "X_SRC", "Z_SRC", "CLOCK", "PULSE", "OUTPUT", "CABLE_OUTPUT", "PIN", "MULTI_PIN", "CABLE_PIN", "JUNCTION", "TEXT"].includes(node.type);
}

function analyzeCircuitIssues() {
  const graph = buildConnectivity();
  const driversByRoot = new Map();
  const driverNodesByRoot = new Map();

  for (const node of state.nodes) {
    for (const port of driverPortsForNode(node)) {
      const root = graph.find(portKey(node.id, port));
      const driver = { node, port };
      if (!driversByRoot.has(root)) driversByRoot.set(root, []);
      driversByRoot.get(root).push(driver);
      if (!driverNodesByRoot.has(root)) driverNodesByRoot.set(root, new Set());
      driverNodesByRoot.get(root).add(node.id);
    }
  }

  const issues = [];
  for (const drivers of driversByRoot.values()) {
    if (drivers.length > 1) {
      issues.push({
        type: "multi-driver",
        message: `Multiple outputs are connected: ${drivers.map((driver) => `${nodeLabel(driver.node)}.${driver.port}`).join(", ")}`,
      });
    }
  }

  const edges = new Map();
  for (const node of state.nodes) {
    if (!isLogicConsumer(node)) continue;
    for (const input of nodeInputs(node)) {
      const root = graph.find(portKey(node.id, input));
      for (const driverId of driverNodesByRoot.get(root) || []) {
        if (!edges.has(driverId)) edges.set(driverId, new Set());
        edges.get(driverId).add(node.id);
      }
    }
  }

  const visiting = new Set();
  const visited = new Set();
  function visit(nodeId) {
    if (visiting.has(nodeId)) return true;
    if (visited.has(nodeId)) return false;
    visiting.add(nodeId);
    for (const next of edges.get(nodeId) || []) {
      if (visit(next)) return true;
    }
    visiting.delete(nodeId);
    visited.add(nodeId);
    return false;
  }

  for (const node of state.nodes) {
    if (isLogicConsumer(node) && visit(node.id)) {
      issues.push({ type: "feedback-loop", message: "Combinational feedback loop detected." });
      break;
    }
  }

  return issues;
}

function isBlockingCircuitIssue(issue) {
  return issue?.type === "feedback-loop";
}

function firstBlockingCircuitIssue(issues = analyzeCircuitIssues()) {
  return issues.find(isBlockingCircuitIssue) || null;
}

function signalValue(value) {
  if (value === SIGNAL.ZERO || value === SIGNAL.ONE || value === SIGNAL.UNKNOWN || value === SIGNAL.HIGH_Z) return value;
  if (value === true || value === 1 || value === "true") return SIGNAL.ONE;
  if (value === false || value === 0 || value === "false") return SIGNAL.ZERO;
  return SIGNAL.HIGH_Z;
}

function signalIsOne(value) {
  return signalValue(value) === SIGNAL.ONE;
}

function signalIsZero(value) {
  return signalValue(value) === SIGNAL.ZERO;
}

function signalForLogicInput(value) {
  const signal = signalValue(value);
  return signal === SIGNAL.HIGH_Z ? SIGNAL.UNKNOWN : signal;
}

function signalFromBoolean(value) {
  return value ? SIGNAL.ONE : SIGNAL.ZERO;
}

function resolveSignals(signals) {
  let hasZero = false;
  let hasOne = false;
  for (const value of signals) {
    const signal = signalValue(value);
    if (signal === SIGNAL.UNKNOWN) return SIGNAL.UNKNOWN;
    if (signal === SIGNAL.ZERO) hasZero = true;
    if (signal === SIGNAL.ONE) hasOne = true;
    if (hasZero && hasOne) return SIGNAL.UNKNOWN;
  }
  if (hasOne) return SIGNAL.ONE;
  if (hasZero) return SIGNAL.ZERO;
  return SIGNAL.HIGH_Z;
}

function signalNot(value) {
  const signal = signalForLogicInput(value);
  if (signal === SIGNAL.ZERO) return SIGNAL.ONE;
  if (signal === SIGNAL.ONE) return SIGNAL.ZERO;
  return SIGNAL.UNKNOWN;
}

function signalAnd(values) {
  let unknown = false;
  for (const value of values) {
    const signal = signalForLogicInput(value);
    if (signal === SIGNAL.ZERO) return SIGNAL.ZERO;
    if (signal !== SIGNAL.ONE) unknown = true;
  }
  return unknown ? SIGNAL.UNKNOWN : SIGNAL.ONE;
}

function signalOr(values) {
  let unknown = false;
  for (const value of values) {
    const signal = signalForLogicInput(value);
    if (signal === SIGNAL.ONE) return SIGNAL.ONE;
    if (signal !== SIGNAL.ZERO) unknown = true;
  }
  return unknown ? SIGNAL.UNKNOWN : SIGNAL.ZERO;
}

function signalXor(values) {
  let ones = 0;
  for (const value of values) {
    const signal = signalForLogicInput(value);
    if (signal === SIGNAL.ONE) ones += 1;
    else if (signal !== SIGNAL.ZERO) return SIGNAL.UNKNOWN;
  }
  return ones % 2 === 1 ? SIGNAL.ONE : SIGNAL.ZERO;
}

function storedQ(node) {
  return signalValue(node.q ?? SIGNAL.ZERO);
}

function qOutputs(value) {
  const q = signalValue(value);
  return { q, qbar: signalNot(q) };
}

function setSequentialQ(node, value) {
  const next = signalValue(value);
  const changed = signalValue(node.q) !== next;
  node.q = next;
  return changed;
}

function evaluateSrNext(current, sValue, rValue) {
  const s = signalForLogicInput(sValue);
  const r = signalForLogicInput(rValue);
  if (s === SIGNAL.ONE && r === SIGNAL.ONE) return SIGNAL.UNKNOWN;
  if (s === SIGNAL.ONE && r === SIGNAL.ZERO) return SIGNAL.ONE;
  if (s === SIGNAL.ZERO && r === SIGNAL.ONE) return SIGNAL.ZERO;
  if (s === SIGNAL.ZERO && r === SIGNAL.ZERO) return signalValue(current);
  return SIGNAL.UNKNOWN;
}

function evaluateDNext(dValue) {
  const d = signalForLogicInput(dValue);
  return d === SIGNAL.ZERO || d === SIGNAL.ONE ? d : SIGNAL.UNKNOWN;
}

function evaluateJkNext(current, jValue, kValue) {
  const q = signalValue(current);
  const j = signalForLogicInput(jValue);
  const k = signalForLogicInput(kValue);
  if (j === SIGNAL.ZERO && k === SIGNAL.ZERO) return q;
  if (j === SIGNAL.ONE && k === SIGNAL.ZERO) return SIGNAL.ONE;
  if (j === SIGNAL.ZERO && k === SIGNAL.ONE) return SIGNAL.ZERO;
  if (j === SIGNAL.ONE && k === SIGNAL.ONE) return q === SIGNAL.UNKNOWN ? SIGNAL.UNKNOWN : signalNot(q);
  return SIGNAL.UNKNOWN;
}

function evaluateTNext(current, tValue) {
  const q = signalValue(current);
  const t = signalForLogicInput(tValue);
  if (t === SIGNAL.ZERO) return q;
  if (t === SIGNAL.ONE) return q === SIGNAL.UNKNOWN ? SIGNAL.UNKNOWN : signalNot(q);
  return SIGNAL.UNKNOWN;
}

function signalColor(value, hotColor = state.settings.wireHotColor, coldColor = state.settings.wireColdColor) {
  const settings = normalizeSettings(state.settings);
  const signal = signalValue(value);
  if (signal === SIGNAL.ONE) return hotColor || DEFAULT_HOT_COLOR;
  if (signal === SIGNAL.ZERO) return coldColor || DEFAULT_COLD_COLOR;
  if (signal === SIGNAL.UNKNOWN) return settings.xSignalColor;
  return settings.zSignalColor;
}

function signalClass(value) {
  const signal = signalValue(value);
  if (signal === SIGNAL.ONE) return "hot";
  if (signal === SIGNAL.ZERO) return "cold";
  if (signal === SIGNAL.UNKNOWN) return "unknown";
  return "high-z";
}

function evaluateGate(type, inputs, node, cableInputs = {}) {
  if (type === "INPUT") return { out: signalFromBoolean(node.value) };
  if (type === "MULTI_INPUT" || type === "MULTI_TEST_INPUT") {
    const values = multiBitValues(node);
    return Object.fromEntries(values.map((value, index) => [`bit${index}`, signalFromBoolean(value)]));
  }
  if (isCableSourceType(type)) {
    return { out: signalFromBoolean(cableDataValue(node) !== 0) };
  }
  if (type === "CABLE_TO_BUS") {
    const cableValue = Math.max(0, Math.trunc(Number(cableInputs.in || 0)));
    const bitString = cableValue.toString(2).padStart(multiBitCount(node), "0").slice(-multiBitCount(node));
    return Object.fromEntries([...bitString].map((bit, index) => [`bit${index}`, bit === "1" ? SIGNAL.ONE : SIGNAL.ZERO]));
  }
  if (type === "BUS_TO_CABLE") {
    const values = multiBitPorts(node).map((port) => inputs[port]);
    if (values.some((value) => signalForLogicInput(value) === SIGNAL.UNKNOWN)) return { out: SIGNAL.UNKNOWN };
    return { out: values.some(signalIsOne) ? SIGNAL.ONE : SIGNAL.ZERO };
  }
  if (type === "CABLE_MERGER") {
    return { out: signalFromBoolean(cableMergerValue(node, cableInputs) !== 0) };
  }
  if (type === "CABLE_DIVIDER") {
    return Object.fromEntries(cableSegmentPorts(node).map((port, index) => [port, signalFromBoolean(cableDividerValue(node, index, cableInputs) !== 0)]));
  }
  if (type === "BUS") {
    return Object.fromEntries(busOutputs(node).map((port, index) => [port, signalValue(inputs[`in${index}`])]));
  }
  if (type === "MULTI_PIN") {
    return Object.fromEntries(multiBitPorts(node).map((port) => [`${port}out`, signalValue(inputs[`${port}in`])]));
  }
  if (type === "TEST_INPUT") return { out: signalFromBoolean(node.value) };
  if (type === "VCC") return { out: SIGNAL.ONE };
  if (type === "GND") return { out: SIGNAL.ZERO };
  if (type === "X_SRC") return { out: SIGNAL.UNKNOWN };
  if (type === "Z_SRC") return { out: SIGNAL.HIGH_Z };
  if (type === "CLOCK") return { out: signalFromBoolean(node.value) };
  if (type === "PULSE") return { out: pulseSignal(node) };
  if (type === "OUTPUT") return {};
  if (type === "CABLE_OUTPUT") return {};
  if (type === "TEXT") return {};
  if (type === "PIN") return { out: signalValue(inputs.in) };
  if (type === "CABLE_PIN") return { out: signalFromBoolean(Math.max(0, Math.trunc(Number(cableInputs.in || 0))) !== 0) };
  if (type === "JUNCTION") return { out: signalValue(inputs.in) };
  if (type === "AND") return { out: signalAnd(nodeInputs(node).map((input) => inputs[input])) };
  if (type === "OR") return { out: signalOr(nodeInputs(node).map((input) => inputs[input])) };
  if (type === "XOR") return { out: signalXor(nodeInputs(node).map((input) => inputs[input])) };
  if (type === "NAND") return { out: signalNot(signalAnd(nodeInputs(node).map((input) => inputs[input]))) };
  if (type === "NOR") return { out: signalNot(signalOr(nodeInputs(node).map((input) => inputs[input]))) };
  if (type === "XNOR") return { out: signalNot(signalXor(nodeInputs(node).map((input) => inputs[input]))) };
  const a = signalValue(inputs.a ?? inputs.in);
  const b = signalValue(inputs.b);
  if (type === "NOT") return { out: signalNot(a) };
  if (type === "BUFFER") return { out: signalForLogicInput(a) };
  if (type === "TRISTATE") {
    const en = signalForLogicInput(inputs.en);
    if (en === SIGNAL.ONE) return { out: signalValue(inputs.in) };
    if (en === SIGNAL.ZERO) return { out: SIGNAL.HIGH_Z };
    return { out: SIGNAL.UNKNOWN };
  }
  if (type === "SR_LATCH") {
    const en = signalForLogicInput(inputs.en);
    if (en === SIGNAL.ONE) setSequentialQ(node, evaluateSrNext(storedQ(node), inputs.s, inputs.r));
    else if (en === SIGNAL.UNKNOWN) setSequentialQ(node, SIGNAL.UNKNOWN);
    return qOutputs(storedQ(node));
  }
  if (type === "D_LATCH") {
    const en = signalForLogicInput(inputs.en);
    if (en === SIGNAL.ONE) setSequentialQ(node, evaluateDNext(inputs.d));
    else if (en === SIGNAL.UNKNOWN) setSequentialQ(node, SIGNAL.UNKNOWN);
    return qOutputs(storedQ(node));
  }
  if (FLIP_FLOP_TYPES.has(type)) return qOutputs(storedQ(node));
  if (type === "MACRO") return evaluateMacroNode(node, inputs, cableInputs);
  if (type === "CHIP") {
    if ([a, b].some((value) => signalForLogicInput(value) === SIGNAL.UNKNOWN)) return { sum: SIGNAL.UNKNOWN, carry: SIGNAL.UNKNOWN };
    return { sum: a !== b ? SIGNAL.ONE : SIGNAL.ZERO, carry: signalIsOne(a) && signalIsOne(b) ? SIGNAL.ONE : SIGNAL.ZERO };
  }
  return {};
}

function evaluateMacroNode(node, inputs, cableInputs = {}) {
  const macro = findMacroForViewer(node.macroId);
  return simulateMacroCircuit(macro, inputs, cableInputs).outputs;
}

function macroInputCacheKey(macro, inputs, cableInputs = {}) {
  const entries = Object.entries(inputs || {}).sort(([a], [b]) => a.localeCompare(b));
  const cableEntries = Object.entries(cableInputs || {}).sort(([a], [b]) => a.localeCompare(b));
  return `${macro?.id || ""}:${JSON.stringify(entries)}:${JSON.stringify(cableEntries)}`;
}

function cachedMacroOutputs(macro, inputs, cableInputs = {}) {
  if (!macro || !state.simulationCache) return simulateMacroCircuit(macro, inputs, cableInputs).outputs;
  const key = macroInputCacheKey(macro, inputs, cableInputs);
  if (state.simulationCache.has(key)) return state.simulationCache.get(key);
  const outputs = simulateMacroCircuit(macro, inputs, cableInputs).outputs;
  state.simulationCache.set(key, outputs);
  return outputs;
}

function macroInputValueForPin(pinNode, external, inputs) {
  return signalValue(inputs[external?.id] ?? inputs[pinNode.macroPinName] ?? inputs[pinNode.id]);
}

function macroInputCableValueForPin(pinNode, external, cableInputs = {}) {
  return Math.max(0, Math.trunc(Number(cableInputs[external?.id] ?? cableInputs[pinNode.macroPinName] ?? cableInputs[pinNode.id] ?? 0)));
}

function macroInternalPinPorts(pinNode, external) {
  if (pinNode?.type === "MULTI_PIN" && external?.internalPort) {
    return [`${external.internalPort}in`, `${external.internalPort}out`];
  }
  return ["in", "out"];
}

function applyMacroInputHotValues(hot, graph, pinNodes, macroPins, inputs) {
  for (const external of macroPins || []) {
    const pin = pinNodes.find((item) => item.id === external.internalNodeId || item.id === external.id);
    if (!external || external.direction === "output") continue;
    if (!pin) continue;
      const value = macroInputValueForPin(pin, external, inputs);
      for (const port of macroInternalPinPorts(pin, external)) {
        const root = graph.find(portKey(pin.id, port));
        hot.set(root, resolveSignals([hot.get(root), value]));
      }
    }
  }

function applyMacroInputCableValues(cableValues, graph, pinNodes, macroPins, cableInputs = {}) {
  for (const external of macroPins || []) {
    const pin = pinNodes.find((item) => item.id === external.internalNodeId || item.id === external.id);
    if (!external || external.direction === "output") continue;
    if (!pin || pin.type !== "CABLE_PIN") continue;
    const value = macroInputCableValueForPin(pin, external, cableInputs);
    for (const port of macroInternalPinPorts(pin, external)) {
      cableValues.set(graph.find(portKey(pin.id, port)), value);
    }
  }
}

function simulateMacroCircuit(macro, inputs = {}, cableInputs = {}) {
  if (!macro?.circuit) return { nodes: [], wires: [], values: new Map(), outputs: {} };
  const internalNodes = (macro.circuit.nodes || []).map((item) => ({ ...item }));
  const internalWires = (macro.circuit.wires || []).map((item) => ({
    ...item,
    from: JSON.parse(JSON.stringify(item.from)),
    to: JSON.parse(JSON.stringify(item.to)),
    points: (item.points || []).map((point) => ({ ...point })),
  }));
  const pinNodes = internalNodes.filter((item) => item.type === "PIN" || item.type === "MULTI_PIN" || item.type === "CABLE_PIN");
  const pinByExternal = new Map((macro.pins || []).map((pin) => [pin.id, pin]));
  const pinByInternalId = new Map();
  for (const pin of macro.pins || []) {
    if (pin.internalNodeId) pinByInternalId.set(pin.internalNodeId, pin);
    if (pin.id) pinByInternalId.set(pin.id, pin);
  }
  const previous = { nodes: state.nodes, wires: state.wires, values: state.values, macros: state.macros };

  state.nodes = internalNodes;
  state.wires = internalWires;
  state.macros = mergeMacroDefinitions(state.macros, macro.circuit.macros || []);
  const values = new Map();
  for (const external of pinByExternal.values()) {
    const pin = pinNodes.find((item) => item.id === external.internalNodeId || item.id === external.id);
    if (!pin) continue;
    if (external?.direction !== "output") {
      const inputValue = macroInputValueForPin(pin, external, inputs);
      for (const port of macroInternalPinPorts(pin, external)) values.set(`${pin.id}.${port}`, inputValue);
      if (pin.type === "CABLE_PIN") {
        const cableValue = macroInputCableValueForPin(pin, external, cableInputs);
        for (const port of macroInternalPinPorts(pin, external)) values.set(`${pin.id}.${port}.__cable`, cableValue);
      }
    }
  }

  for (let pass = 0; pass < internalNodes.length + 4; pass += 1) {
    const graph = buildConnectivity();
    const hot = groupHotValues(values, graph);
    const cableValues = groupCableValues(values, graph);
    applyMacroInputHotValues(hot, graph, pinNodes, macro.pins || [], inputs);
    applyMacroInputCableValues(cableValues, graph, pinNodes, macro.pins || [], cableInputs);
    let changed = false;
    for (const item of internalNodes) {
      if (item.type === "TEST_INPUT" || item.type === "MULTI_TEST_INPUT") continue;
      if (item.type === "INPUT") values.set(`${item.id}.out`, signalFromBoolean(item.value));
      if (item.type === "MULTI_INPUT") {
        multiBitValues(item).forEach((value, index) => values.set(`${item.id}.bit${index}`, signalFromBoolean(value)));
      }
      if (isCableSourceNode(item)) {
        values.set(`${item.id}.out`, signalFromBoolean(cableDataValue(item) !== 0));
        values.set(`${item.id}.out.__cable`, cableDataValue(item));
      }
      if (item.type === "VCC") values.set(`${item.id}.out`, SIGNAL.ONE);
      if (item.type === "GND") values.set(`${item.id}.out`, SIGNAL.ZERO);
      if (item.type === "X_SRC") values.set(`${item.id}.out`, SIGNAL.UNKNOWN);
      if (item.type === "Z_SRC") values.set(`${item.id}.out`, SIGNAL.HIGH_Z);
      if (item.type === "CLOCK") values.set(`${item.id}.out`, signalFromBoolean(item.value));
      if (item.type === "PULSE") values.set(`${item.id}.out`, pulseSignal(item));
      const itemInputs = {};
      const itemCableInputs = {};
      for (const input of nodeInputs(item)) {
        itemInputs[input] = readInputValue(item.id, input, hot, graph);
        values.set(`${item.id}.${input}`, itemInputs[input]);
        itemCableInputs[input] = readCableCompatibleInputValue(item, input, hot, cableValues, graph);
      }
      if (item.type === "PIN" || item.type === "MULTI_PIN" || item.type === "CABLE_PIN") {
        const external = [...pinByExternal.values()].find((pin) => pin.internalNodeId === item.id || pin.id === item.macroPinName);
        if (external?.direction !== "output") continue;
      }
      const outputs = evaluateGate(item.type, itemInputs, item, itemCableInputs);
      if (item.type === "BUS_TO_CABLE") {
        const bitSignals = multiBitPorts(item).map((port) => signalValue(itemInputs[port]));
        const hasUnknownBit = bitSignals.some((signal) => signal !== SIGNAL.ZERO && signal !== SIGNAL.ONE);
        const bitString = bitSignals.map((signal) => (signal === SIGNAL.ONE ? "1" : "0")).join("");
        if (setSimValue(values, `${item.id}.out.__cable`, hasUnknownBit ? null : parseInt(bitString || "0", 2))) changed = true;
      }
      if (item.type === "CABLE_MERGER") {
        if (setSimValue(values, `${item.id}.out.__cable`, cableMergerValue(item, itemCableInputs))) changed = true;
      }
      if (item.type === "CABLE_DIVIDER") {
        for (const [index, port] of cableSegmentPorts(item).entries()) {
          if (setSimValue(values, `${item.id}.${port}.__cable`, cableDividerValue(item, index, itemCableInputs))) changed = true;
        }
      }
      if (item.type === "CABLE_PIN") {
        if (setSimValue(values, `${item.id}.out.__cable`, Math.max(0, Math.trunc(Number(itemCableInputs.in || 0))))) changed = true;
      }
      if (item.type === "CABLE_OUTPUT") {
        values.set(`${item.id}.in.__cable`, clampCableValueToBits(itemCableInputs.in, multiBitCount(item)));
      }
      for (const [port, value] of Object.entries(outputs)) {
        const key = `${item.id}.${port}`;
        if (values.get(key) !== value) {
          values.set(key, value);
          changed = true;
        }
      }
    }
    if (!changed) break;
  }

  const graph = buildConnectivity();
  const hot = groupHotValues(values, graph);
  const cableValues = groupCableValues(values, graph);
  applyMacroInputHotValues(hot, graph, pinNodes, macro.pins || [], inputs);
  applyMacroInputCableValues(cableValues, graph, pinNodes, macro.pins || [], cableInputs);
  for (const item of internalNodes) {
    for (const input of nodeInputs(item)) {
      values.set(`${item.id}.${input}`, readInputValue(item.id, input, hot, graph));
      values.set(`${item.id}.${input}.__cable`, readCableCompatibleInputValue(item, input, hot, cableValues, graph));
    }
  }
  const outputs = {};
  for (const pin of macro.pins || []) {
    if (pin.direction !== "output") continue;
    const internal = pinNodes.find((item) => item.id === pin.internalNodeId || item.macroPinName === pin.id);
    if (internal) {
      const ports = macroInternalPinPorts(internal, pin);
      outputs[pin.id] = resolveSignals([
        hot.get(graph.find(portKey(internal.id, ports[0]))),
        hot.get(graph.find(portKey(internal.id, ports[1]))),
      ]);
      if (internal.type === "CABLE_PIN") {
        outputs[`${pin.id}.__cable`] = Math.max(0, Math.trunc(Number(
          cableValues.get(graph.find(portKey(internal.id, ports[0])))
          || cableValues.get(graph.find(portKey(internal.id, ports[1])))
          || 0,
        )));
      }
    }
  }
  for (const wire of internalWires) {
    const wireRoot = graph.find(`wire:${wire.id}`);
    values.set(`${wire.id}.__wire`, signalValue(hot.get(wireRoot)));
  }

  state.nodes = previous.nodes;
  state.wires = previous.wires;
  state.values = previous.values;
  state.macros = previous.macros;
  return { nodes: internalNodes, wires: internalWires, values, outputs };
}

function setSequentialOutputs(values, node) {
  if (!SEQUENTIAL_TYPES.has(node.type)) return false;
  const outputs = qOutputs(storedQ(node));
  return Object.entries(outputs).reduce((changed, [port, value]) => (
    setSimValue(values, `${node.id}.${port}`, value) || changed
  ), false);
}

function updateFlipFlopStates(values) {
  const graph = buildConnectivity();
  const hot = groupHotValues(values, graph);
  let changed = false;
  for (const node of state.nodes) {
    if (!FLIP_FLOP_TYPES.has(node.type)) continue;
    const clk = readInputValue(node.id, "clk", hot, graph);
    const previousClock = signalValue(node.lastClock ?? SIGNAL.ZERO);
    if (clk === SIGNAL.UNKNOWN) {
      changed = setSequentialQ(node, SIGNAL.UNKNOWN) || changed;
    } else if (previousClock !== SIGNAL.ONE && clk === SIGNAL.ONE) {
      if (node.type === "SR_FF") changed = setSequentialQ(node, evaluateSrNext(storedQ(node), readInputValue(node.id, "s", hot, graph), readInputValue(node.id, "r", hot, graph))) || changed;
      if (node.type === "D_FF") changed = setSequentialQ(node, evaluateDNext(readInputValue(node.id, "d", hot, graph))) || changed;
      if (node.type === "JK_FF") changed = setSequentialQ(node, evaluateJkNext(storedQ(node), readInputValue(node.id, "j", hot, graph), readInputValue(node.id, "k", hot, graph))) || changed;
      if (node.type === "T_FF") changed = setSequentialQ(node, evaluateTNext(storedQ(node), readInputValue(node.id, "t", hot, graph))) || changed;
    }
    node.lastClock = clk;
    changed = setSequentialOutputs(values, node) || changed;
  }
  return changed;
}

function settleCircuitValues(values) {
  for (let pass = 0; pass < state.nodes.length + 4; pass += 1) {
    const graph = buildConnectivity();
    const hot = groupHotValues(values, graph);
    const cableValues = groupCableValues(values, graph);
    let changed = false;
    for (const node of state.nodes) {
      if (isLogicSourceType(node.type)) continue;
      const inputs = {};
      const cableInputs = {};
      for (const input of nodeInputs(node)) {
        inputs[input] = readInputValue(node.id, input, hot, graph);
        values.set(`${node.id}.${input}`, inputs[input]);
        cableInputs[input] = readCableCompatibleInputValue(node, input, hot, cableValues, graph);
      }
      const outputs = evaluateGate(node.type, inputs, node, cableInputs);
      if (node.type === "BUS_TO_CABLE") {
        const bitSignals = multiBitPorts(node).map((port) => signalValue(inputs[port]));
        const hasUnknownBit = bitSignals.some((signal) => signal !== SIGNAL.ZERO && signal !== SIGNAL.ONE);
        const bitString = bitSignals.map((signal) => (signal === SIGNAL.ONE ? "1" : "0")).join("");
        if (setSimValue(values, `${node.id}.out.__cable`, hasUnknownBit ? null : parseInt(bitString || "0", 2))) changed = true;
      }
      if (node.type === "CABLE_MERGER") {
        if (setSimValue(values, `${node.id}.out.__cable`, cableMergerValue(node, cableInputs))) changed = true;
      }
      if (node.type === "CABLE_DIVIDER") {
        for (const [index, port] of cableSegmentPorts(node).entries()) {
          if (setSimValue(values, `${node.id}.${port}.__cable`, cableDividerValue(node, index, cableInputs))) changed = true;
        }
      }
      if (node.type === "CABLE_PIN") {
        if (setSimValue(values, `${node.id}.out.__cable`, Math.max(0, Math.trunc(Number(cableInputs.in || 0))))) changed = true;
      }
      if (node.type === "CABLE_OUTPUT") {
        values.set(`${node.id}.in.__cable`, clampCableValueToBits(cableInputs.in, multiBitCount(node)));
      }
      for (const [port, value] of Object.entries(outputs)) {
        const key = `${node.id}.${port}`;
        if (values.get(key) !== value) {
          values.set(key, value);
          changed = true;
        }
      }
      if (node.type === "OUTPUT") {
        values.set(`${node.id}.in`, readInputValue(node.id, "in", hot, graph));
      }
    }
    if (!changed) break;
  }
}

function simulate() {
  const previousSimulationCache = state.simulationCache;
  state.simulationCache = new Map();
  const values = new Map();
  for (const node of state.nodes) {
    if (node.type === "INPUT" || node.type === "TEST_INPUT") values.set(`${node.id}.out`, signalFromBoolean(node.value));
    if (node.type === "MULTI_INPUT" || node.type === "MULTI_TEST_INPUT") {
      multiBitValues(node).forEach((value, index) => values.set(`${node.id}.bit${index}`, signalFromBoolean(value)));
    }
    if (isCableSourceNode(node)) {
      values.set(`${node.id}.out`, signalFromBoolean(cableDataValue(node) !== 0));
      values.set(`${node.id}.out.__cable`, cableDataValue(node));
    }
    if (node.type === "VCC") values.set(`${node.id}.out`, SIGNAL.ONE);
    if (node.type === "GND") values.set(`${node.id}.out`, SIGNAL.ZERO);
    if (node.type === "X_SRC") values.set(`${node.id}.out`, SIGNAL.UNKNOWN);
    if (node.type === "Z_SRC") values.set(`${node.id}.out`, SIGNAL.HIGH_Z);
    if (node.type === "CLOCK") values.set(`${node.id}.out`, signalFromBoolean(node.value));
    if (node.type === "PULSE") values.set(`${node.id}.out`, pulseSignal(node));
    setSequentialOutputs(values, node);
  }
  state.circuitIssues = analyzeCircuitIssues();
  if (firstBlockingCircuitIssue(state.circuitIssues)) {
    state.values = values;
    state.simulationCache = previousSimulationCache;
    return;
  }

  // Time-based sources are sampled into `values` before this point. Settle all
  // combinational/data paths first so a simultaneous data+clock change is seen
  // by flip-flops as "data arrived before the clock edge".
  settleCircuitValues(values);
  const edgePassLimit = state.nodes.length + 4;
  for (let pass = 0; pass < edgePassLimit; pass += 1) {
    if (!updateFlipFlopStates(values)) break;
    settleCircuitValues(values);
  }

  const graph = buildConnectivity();
  const hot = groupHotValues(values, graph);
  const cableValues = groupCableValues(values, graph);
  for (const node of state.nodes) {
    for (const input of nodeInputs(node)) {
      values.set(`${node.id}.${input}`, readInputValue(node.id, input, hot, graph));
      values.set(`${node.id}.${input}.__cable`, readCableCompatibleInputValue(node, input, hot, cableValues, graph));
    }
  }
  for (const wire of state.wires) {
    const wireRoot = graph.find(`wire:${wire.id}`);
    values.set(`${wire.id}.__wire`, signalValue(hot.get(wireRoot)));
  }
  state.values = values;
  state.simulationCache = previousSimulationCache;
}

function createSvg(tag, attrs = {}) {
  const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (const [key, value] of Object.entries(attrs)) el.setAttribute(key, value);
  return el;
}

function templateViewBox() {
  const rect = templateCanvas.getBoundingClientRect();
  clampTemplateView(rect);
  const width = (rect.width || TEMPLATE_VIEW_W * GRID) / state.template.view.zoom;
  const height = (rect.height || TEMPLATE_VIEW_H * GRID) / state.template.view.zoom;
  return {
    x: state.template.view.x,
    y: state.template.view.y,
    width,
    height,
  };
}

function templateMinimumZoom(rect = templateCanvas.getBoundingClientRect()) {
  const width = rect.width || TEMPLATE_VIEW_W * GRID;
  const height = rect.height || TEMPLATE_VIEW_H * GRID;
  return Math.max(
    TEMPLATE_MIN_ZOOM,
    width / (TEMPLATE_VIEW_W * GRID),
    height / (TEMPLATE_VIEW_H * GRID),
  );
}

function clampTemplateView(rect = templateCanvas.getBoundingClientRect()) {
  state.template.view.zoom = Math.max(templateMinimumZoom(rect), Math.min(TEMPLATE_MAX_ZOOM, state.template.view.zoom));
  const width = (rect.width || TEMPLATE_VIEW_W * GRID) / state.template.view.zoom;
  const height = (rect.height || TEMPLATE_VIEW_H * GRID) / state.template.view.zoom;
  const maxX = TEMPLATE_VIEW_W * GRID;
  const maxY = TEMPLATE_VIEW_H * GRID;
  state.template.view.x = Math.min(Math.max(0, maxX - width), Math.max(0, state.template.view.x));
  state.template.view.y = Math.min(Math.max(0, maxY - height), Math.max(0, state.template.view.y));
}

function updateTemplateViewBox() {
  const box = templateViewBox();
  templateCanvas.setAttribute("viewBox", `${box.x} ${box.y} ${box.width} ${box.height}`);
}

function appendTemplateGrid() {
  const defs = createSvg("defs");
  const minorPattern = createSvg("pattern", {
    id: "template-minor-grid",
    width: GRID,
    height: GRID,
    patternUnits: "userSpaceOnUse",
  });
  minorPattern.appendChild(createSvg("path", {
    class: "template-grid-minor",
    d: `M ${GRID} 0 L 0 0 0 ${GRID}`,
  }));

  const majorPattern = createSvg("pattern", {
    id: "template-major-grid",
    width: GRID * 4,
    height: GRID * 4,
    patternUnits: "userSpaceOnUse",
  });
  majorPattern.appendChild(createSvg("rect", {
    width: GRID * 4,
    height: GRID * 4,
    fill: "url(#template-minor-grid)",
  }));
  majorPattern.appendChild(createSvg("path", {
    class: "template-grid-major",
    d: `M ${GRID * 4} 0 L 0 0 0 ${GRID * 4}`,
  }));

  defs.append(minorPattern, majorPattern);
  templateCanvas.appendChild(defs);
  templateCanvas.appendChild(createSvg("rect", {
    class: "template-grid-bg",
    x: 0,
    y: 0,
    width: TEMPLATE_VIEW_W * GRID,
    height: TEMPLATE_VIEW_H * GRID,
    fill: "url(#template-major-grid)",
  }));
}

function gateBodyBox(node, px, py, w, h) {
  if (node.type === "AND" || node.type === "NAND") {
    return {
      x: px + GRID * 3,
      y: py,
      w: GRID * 6,
      h,
    };
  }

  if (node.type === "OR" || node.type === "NOR" || node.type === "XOR" || node.type === "XNOR") {
    return {
      x: px + GRID * 2,
      y: py,
      w: GRID * 7,
      h,
    };
  }

  if (node.type === "NOT") {
    return {
      x: px + GRID * 2,
      y: py,
      w: GRID * 6,
      h,
    };
  }

  if (node.type === "BUFFER") {
    return {
      x: px + GRID * 3,
      y: py,
      w: GRID * 4,
      h: GRID * 3,
    };
  }

  if (node.type === "TRISTATE") {
    return {
      x: px + GRID * 3,
      y: py + GRID,
      w: GRID * 4,
      h: GRID * 3,
    };
  }

  const meta = GATE_META[node.type];
  const centerY = meta.outputs.length
    ? portPosition(node, meta.outputs[0], "output").y * GRID
    : py + h / 2;
  const bodyHeight = GRID * 2;

  return {
    x: px + GRID,
    y: centerY - bodyHeight / 2,
    w: w - GRID * 2,
    h: bodyHeight,
  };
}

function orCurveXAtScreenY(screenY, body) {
  const mathY = 3 - (screenY - body.y) / GRID;
  return body.x + (-8 + Math.sqrt(25 - mathY * mathY) + 4) * GRID;
}

function xorInputCurveXAtScreenY(screenY, body) {
  return orCurveXAtScreenY(screenY, body) - GRID;
}

// Build schematic gate outlines directly as SVG paths instead of using text-only boxes.
function gateSymbolPath(type, x, y, w, h) {
  if (type === "AND" || type === "NAND") {
    const midX = x + w / 2;
    const radius = h / 2;
    return [
      `M ${x} ${y}`,
      `L ${midX} ${y}`,
      `A ${radius} ${radius} 0 0 1 ${midX} ${y + h}`,
      `L ${x} ${y + h}`,
      "Z",
    ].join(" ");
  }

  if (type === "OR" || type === "NOR" || type === "XOR" || type === "XNOR") {
    const topLeft = { x, y };
    const bottomLeft = { x, y: y + GRID * 6 };
    const output = { x: x + GRID * 7, y: y + GRID * 3 };
    const topRadius = GRID * (29 / 3);
    const leftRadius = GRID * 5;
    return [
      `M ${topLeft.x} ${topLeft.y}`,
      `A ${topRadius} ${topRadius} 0 0 1 ${output.x} ${output.y}`,
      `A ${topRadius} ${topRadius} 0 0 1 ${bottomLeft.x} ${bottomLeft.y}`,
      `A ${leftRadius} ${leftRadius} 0 0 0 ${topLeft.x} ${topLeft.y}`,
      "Z",
    ].join(" ");
  }

  if (type === "NOT" || type === "BUFFER" || type === "TRISTATE") {
    return [
      `M ${x} ${y}`,
      `L ${x} ${y + h}`,
      `L ${x + w * 0.78} ${y + h / 2}`,
      "Z",
    ].join(" ");
  }

  return "";
}

function appendGateSymbol(group, node, px, py, w, h) {
  const body = gateBodyBox(node, px, py, w, h);

  if (node.type === "NOT" || node.type === "BUFFER" || node.type === "TRISTATE") {
    const midY = body.y + body.h / 2;
    const input = portPosition(node, "in", "input");
    const output = portPosition(node, "out", "output");
    const apexX = node.type === "NOT" ? px + GRID * 6 : px + GRID * 7;
    const bubbleRadius = GRID;

    group.appendChild(createSvg("line", {
      class: "gate-pin",
      x1: input.x * GRID,
      y1: midY,
      x2: body.x,
      y2: midY,
    }));
    group.appendChild(createSvg("path", {
      class: "gate-body gate-symbol",
      d: [
        `M ${body.x} ${body.y}`,
        `L ${body.x} ${body.y + body.h}`,
        `L ${apexX} ${midY}`,
        "Z",
      ].join(" "),
    }));
    if (node.type === "NOT") {
      group.appendChild(createSvg("circle", {
        class: "gate-body inversion-bubble",
        cx: apexX + bubbleRadius,
        cy: midY,
        r: bubbleRadius,
      }));
    }
    if (node.type === "TRISTATE") {
      const en = portPosition(node, "en", "input");
      const enTargetY = midY + GRID * 0.75;
      group.appendChild(createSvg("line", {
        class: "gate-pin",
        x1: en.x * GRID,
        y1: en.y * GRID,
        x2: en.x * GRID,
        y2: enTargetY,
      }));
    }
    group.appendChild(createSvg("line", {
      class: "gate-pin",
      x1: node.type === "NOT" ? apexX + bubbleRadius * 2 : apexX,
      y1: midY,
      x2: output.x * GRID,
      y2: midY,
    }));
    return;
  }

  const gatePath = gateSymbolPath(node.type, body.x, body.y, body.w, body.h);
  if (!gatePath) return;
  const hasOutputBubble = node.type === "NAND" || node.type === "NOR" || node.type === "XNOR";
  const bubbleRadius = GRID;
  const bodyOutputX = hasOutputBubble ? body.x + body.w + bubbleRadius * 2 : body.x + body.w;

  for (const port of nodeInputs(node)) {
    const point = portPosition(node, port, "input");
    const pinEndX = node.type === "OR" || node.type === "NOR"
      ? orCurveXAtScreenY(point.y * GRID, body)
      : node.type === "XOR" || node.type === "XNOR"
        ? xorInputCurveXAtScreenY(point.y * GRID, body)
        : body.x;
    group.appendChild(createSvg("line", {
      class: "gate-pin",
      x1: point.x * GRID,
      y1: point.y * GRID,
      x2: pinEndX,
      y2: point.y * GRID,
    }));
  }

  for (const port of nodeOutputs(node)) {
    const point = portPosition(node, port, "output");
    group.appendChild(createSvg("line", {
      class: "gate-pin",
      x1: bodyOutputX,
      y1: point.y * GRID,
      x2: point.x * GRID,
      y2: point.y * GRID,
    }));
  }

  group.appendChild(createSvg("path", { class: "gate-body gate-symbol", d: gatePath }));

  if (node.type === "XOR" || node.type === "XNOR") {
    const leftRadius = GRID * 5;
    group.appendChild(createSvg("path", {
      class: "gate-body xor-extra",
      d: [
        `M ${body.x - GRID} ${body.y}`,
        `A ${leftRadius} ${leftRadius} 0 0 1 ${body.x - GRID} ${body.y + GRID * 6}`,
      ].join(" "),
    }));
  }

  if (hasOutputBubble) {
    group.appendChild(createSvg("circle", {
      class: "gate-body inversion-bubble",
      cx: body.x + body.w + bubbleRadius,
      cy: body.y + body.h / 2,
      r: bubbleRadius,
    }));
  }
}

function appendWirePointCaps(parent, points, color, radius, extraAttrs = {}) {
  const seen = new Set();
  for (const point of points) {
    const key = `${point.x},${point.y}`;
    if (seen.has(key)) continue;
    seen.add(key);
    parent.appendChild(createSvg("circle", {
      class: "wire-point-cap",
      cx: point.x * GRID,
      cy: point.y * GRID,
      r: radius,
      style: `fill: ${color}`,
      ...extraAttrs,
    }));
  }
}

// The wires layer sits above nodes in the SVG so wires and cables are never hidden by component bodies.
function renderWires() {
  wiresLayer.replaceChildren();
  for (const wire of state.wires) {
    const signal = signalValue(state.values.get(`${wire.id}.__wire`));
    const bitLength = wireBitLength(wire);
    const isCable = bitLength > 1;
    const selected = isWireSelected(wire.id);
    const points = wirePathPoints(wire);
    const color = signalColor(signal);
    const path = createSvg("path", {
      class: `wire ${isCable ? "cable" : ""} ${signalClass(signal)} ${selected ? "selected" : ""}`,
      d: pointsToSvgPath(points),
      style: isCable
        ? `stroke: ${color}; stroke-width: ${GRID}`
        : `stroke: ${color}`,
      "data-wire-id": wire.id,
    });
    wiresLayer.appendChild(path);
    appendWirePointCaps(wiresLayer, points, color, isCable ? GRID / 2 : WIRE_POINT_CAP_RADIUS, {
      "data-wire-id": wire.id,
    });
  }
}

function renderJunctionOverlay() {
  junctionOverlayLayer.replaceChildren();
  for (const node of state.nodes) {
    if (node.type !== "JUNCTION") continue;
    const point = portPosition(node, "out", "output");
    junctionOverlayLayer.appendChild(createSvg("circle", {
      class: "node junction-body junction-overlay-body",
      cx: point.x * GRID,
      cy: point.y * GRID,
      r: GRID / 2,
      "data-node-id": node.id,
    }));
  }
}

function appendMultiBitSwitchShape(group, node, px, py) {
  const bits = multiBitCount(node);
  const values = multiBitValues(node);
  const bodyHeight = GRID * 2;
  const bodyWidth = bits * GRID * 2;
  const arrowY = py;
  const bodyY = py + GRID;
  if (node.type === "MULTI_TEST_INPUT") {
    group.appendChild(createSvg("polygon", {
      class: "gate-body multibit-switch-body",
      points: [
        `${px},${bodyY + bodyHeight / 2}`,
        `${px + GRID},${bodyY}`,
        `${px + bodyWidth - GRID},${bodyY}`,
        `${px + bodyWidth},${bodyY + bodyHeight / 2}`,
        `${px + bodyWidth - GRID},${bodyY + bodyHeight}`,
        `${px + GRID},${bodyY + bodyHeight}`,
      ].join(" "),
    }));
  } else {
    group.appendChild(createSvg("rect", {
      class: "gate-body multibit-switch-body",
      x: px,
      y: bodyY,
      width: bodyWidth,
      height: bodyHeight,
    }));
  }
  appendLeftOrderArrow(group, px, arrowY, bodyWidth);
  for (let index = 0; index < bits; index += 1) {
    const cx = px + GRID * (1 + index * 2);
    const cy = bodyY + GRID;
    const port = portPosition(node, `bit${index}`, "output");
    group.appendChild(createSvg("line", {
      class: "gate-pin multibit-pin-leg",
      x1: cx,
      y1: bodyY + bodyHeight,
      x2: port.x * GRID,
      y2: port.y * GRID,
    }));
    group.appendChild(createSvg("circle", {
      class: `switch-dot multibit-dot ${values[index] ? "on" : "off"}`,
      cx,
      cy,
      r: GRID * 0.46,
      style: values[index]
        ? `fill: ${node.onColor || DEFAULT_HOT_COLOR}; stroke: ${node.onColor || DEFAULT_HOT_COLOR}`
        : "fill: #ffffff; stroke: var(--part-stroke)",
      "data-bit-index": index,
    }));
  }
}

function appendCableSwitchShape(group, node, px, py) {
  const size = nodeSize(node);
  const bodyWidth = size.w * GRID;
  const bodyHeight = GRID * 4;
  const cableWidth = GRID;
  const cableHeight = GRID * 2;
  const cableX = px + bodyWidth / 2 - cableWidth / 2;
  const cableY = py + bodyHeight;
  if (node.type === "CABLE_TEST_SWITCH") {
    group.appendChild(createSvg("polygon", {
      class: "gate-body cable-switch-body cable-test-switch-body",
      points: [
        `${px},${py + bodyHeight / 2}`,
        `${px + GRID},${py}`,
        `${px + bodyWidth - GRID},${py}`,
        `${px + bodyWidth},${py + bodyHeight / 2}`,
        `${px + bodyWidth - GRID},${py + bodyHeight}`,
        `${px + GRID},${py + bodyHeight}`,
      ].join(" "),
    }));
  } else {
    group.appendChild(createSvg("rect", {
      class: "gate-body cable-switch-body",
      x: px,
      y: py,
      width: bodyWidth,
      height: bodyHeight,
    }));
  }
  group.appendChild(createSvg("rect", {
    class: "cable-switch-cable",
    x: cableX,
    y: cableY,
    width: cableWidth,
    height: cableHeight,
  }));
}

function cableOutputValue(node) {
  const signal = signalValue(state.values.get(`${node.id}.in`));
  if (signal !== SIGNAL.ZERO && signal !== SIGNAL.ONE) return SIGNAL.UNKNOWN;
  return clampCableValueToBits(state.values.get(`${node.id}.in.__cable`) || 0, multiBitCount(node));
}

function appendCableOutputShape(group, node, px, py) {
  const size = nodeSize(node);
  const bodyWidth = size.w * GRID;
  const bodyHeight = GRID * 4;
  const cableWidth = GRID;
  const cableHeight = GRID * 2;
  const cableX = px + bodyWidth / 2 - cableWidth / 2;
  const cableY = py + bodyHeight;
  const radius = bodyHeight / 2;
  group.appendChild(createSvg("path", {
    class: "gate-body cable-output-body",
    d: [
      `M ${px + radius} ${py}`,
      `H ${px + bodyWidth - radius}`,
      `A ${radius} ${radius} 0 0 1 ${px + bodyWidth - radius} ${py + bodyHeight}`,
      `H ${px + radius}`,
      `A ${radius} ${radius} 0 0 1 ${px + radius} ${py}`,
      "Z",
    ].join(" "),
  }));
  group.appendChild(createSvg("rect", {
    class: "cable-switch-cable",
    x: cableX,
    y: cableY,
    width: cableWidth,
    height: cableHeight,
  }));
  const label = createSvg("text", {
    class: "cable-output-data",
    x: px + bodyWidth / 2,
    y: py + bodyHeight / 2,
    "text-anchor": "middle",
    "dominant-baseline": "middle",
    dy: "0.12em",
  });
  label.textContent = String(cableOutputValue(node));
  group.appendChild(label);
}

function appendCableToBusShape(group, node, px, py) {
  const bits = multiBitCount(node);
  const size = nodeSize(node);
  const input = portPosition(node, "in", "input");
  const bodyX = px + GRID * 2;
  const bodyW = GRID * 2;
  const bodyH = size.h * GRID;
  const inputY = input.y * GRID;
  group.appendChild(createSvg("rect", {
    class: "cable-to-bus-body",
    x: bodyX,
    y: py,
    width: bodyW,
    height: bodyH,
  }));
  group.appendChild(createSvg("rect", {
    class: "cable-to-bus-cable",
    x: px,
    y: inputY - GRID / 2,
    width: bodyX - px,
    height: GRID,
  }));
  for (let index = 0; index < bits; index += 1) {
    const output = portPosition(node, `bit${index}`, "output");
    const y = output.y * GRID;
    group.appendChild(createSvg("line", {
      class: "cable-to-bus-bit",
      x1: bodyX + bodyW,
      y1: y,
      x2: output.x * GRID,
      y2: y,
    }));
  }
  appendCableConverterArrows(group, node, px, py);
}

function appendBusToCableShape(group, node, px, py) {
  const bits = multiBitCount(node);
  const size = nodeSize(node);
  const output = portPosition(node, "out", "output");
  const bodyX = px + GRID * 2;
  const bodyW = GRID * 2;
  const bodyH = size.h * GRID;
  const outputY = output.y * GRID;
  group.appendChild(createSvg("rect", {
    class: "cable-to-bus-body",
    x: bodyX,
    y: py,
    width: bodyW,
    height: bodyH,
  }));
  group.appendChild(createSvg("rect", {
    class: "cable-to-bus-cable",
    x: bodyX + bodyW,
    y: outputY - GRID / 2,
    width: px + size.w * GRID - (bodyX + bodyW),
    height: GRID,
  }));
  for (let index = 0; index < bits; index += 1) {
    const input = portPosition(node, `bit${index}`, "input");
    const y = input.y * GRID;
    group.appendChild(createSvg("line", {
      class: "cable-to-bus-bit",
      x1: input.x * GRID,
      y1: y,
      x2: bodyX,
      y2: y,
    }));
  }
  appendCableConverterArrows(group, node, px, py);
}

function appendCableMergeSplitShape(group, node, px, py) {
  const size = nodeSize(node);
  const bodyX = px + GRID * 2;
  const bodyW = GRID * 2;
  const bodyH = size.h * GRID;
  group.appendChild(createSvg("rect", {
    class: "cable-to-bus-body",
    x: bodyX,
    y: py,
    width: bodyW,
    height: bodyH,
  }));

  if (node.type === "CABLE_MERGER") {
    for (const port of cableSegmentPorts(node)) {
      const input = portPosition(node, port, "input");
      const y = input.y * GRID;
      group.appendChild(createSvg("rect", {
        class: "cable-to-bus-cable",
        x: px,
        y: y - GRID / 2,
        width: bodyX - px,
        height: GRID,
      }));
    }
    const output = portPosition(node, "out", "output");
    const y = output.y * GRID;
    group.appendChild(createSvg("rect", {
      class: "cable-to-bus-cable",
      x: bodyX + bodyW,
      y: y - GRID / 2,
      width: px + size.w * GRID - (bodyX + bodyW),
      height: GRID,
    }));
    appendCableConverterArrows(group, node, px, py);
    return;
  }

  const input = portPosition(node, "in", "input");
  const inputY = input.y * GRID;
  group.appendChild(createSvg("rect", {
    class: "cable-to-bus-cable",
    x: px,
    y: inputY - GRID / 2,
    width: bodyX - px,
    height: GRID,
  }));
  for (const port of cableSegmentPorts(node)) {
    const output = portPosition(node, port, "output");
    const y = output.y * GRID;
    group.appendChild(createSvg("rect", {
      class: "cable-to-bus-cable",
      x: bodyX + bodyW,
      y: y - GRID / 2,
      width: px + size.w * GRID - (bodyX + bodyW),
      height: GRID,
    }));
  }
  appendCableConverterArrows(group, node, px, py);
}

function appendArrow(group, x1, y1, x2, y2, className, color) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.hypot(dx, dy);
  if (length < 1) return;
  const ux = dx / length;
  const uy = dy / length;
  const scale = arrowScale();
  const head = GRID * scale;
  const half = GRID * 0.5 * scale;
  const baseX = x2 - ux * head;
  const baseY = y2 - uy * head;
  const pxn = -uy;
  const pyn = ux;
  group.appendChild(createSvg("line", {
    class: `${className} line`,
    x1,
    y1,
    x2: baseX,
    y2: baseY,
    style: `stroke: ${color}; stroke-width: ${2 * scale}`,
  }));
  group.appendChild(createSvg("polygon", {
    class: `${className} head`,
    points: [
      `${x2},${y2}`,
      `${baseX + pxn * half},${baseY + pyn * half}`,
      `${baseX - pxn * half},${baseY - pyn * half}`,
    ].join(" "),
    style: `fill: ${color}; stroke: none`,
  }));
}

function appendCableConverterArrows(group, node, px, py) {
  const size = nodeSize(node);
  const bodyX = px + GRID * 2;
  const bodyW = GRID * 2;
  const bodyH = size.h * GRID;
  const orderX = bodyX + bodyW / 2;
  const red = orderArrowColor();
  const blue = dataArrowColor();
  const orderedItems = isCableMergeSplitType(node.type) ? cableSegments(node).length : multiBitCount(node);
  if (orderedItems > 1) {
    const orderStartY = state.settings.orderArrowDirection === "msb-to-lsb"
      ? py
      : py + bodyH;
    const orderEndY = state.settings.orderArrowDirection === "msb-to-lsb"
      ? py + bodyH
      : py;
    appendArrow(
      group,
      orderX,
      orderStartY,
      orderX,
      orderEndY,
      "cable-converter-order-arrow",
      red,
    );
  }
  const dataY = py - GRID;
  const dataStartX = state.settings.dataArrowDirection === "right-to-left"
    ? bodyX + bodyW
    : bodyX;
  const dataEndX = state.settings.dataArrowDirection === "right-to-left"
    ? bodyX
    : bodyX + bodyW;
  appendArrow(
    group,
    dataStartX,
    dataY,
    dataEndX,
    dataY,
    "cable-converter-data-arrow",
    blue,
  );
}

function cableTextAnchorFromBox(boxDirection) {
  if (!boxDirection) return "middle";
  if (boxDirection.x < 0) return "end";
  if (boxDirection.x > 0) return "start";
  return "middle";
}

function cableTextPointFromBox(contactPoint, boxDirection = { x: 0, y: 0 }) {
  return {
    x: contactPoint.x + (boxDirection.x || 0) * 0.35,
    y: contactPoint.y + (boxDirection.y || 0),
  };
}

function cablePinVisualInset() {
  return 0.2;
}

function appendUprightCableText(parent, node, className, localPoint, text, options = {}) {
  const size = nodeSize(node);
  const point = transformLocalPoint(localPoint, node, size);
  let anchor = options.anchor || "middle";
  if (options.boxDirection) {
    const directionPoint = transformLocalPoint({
      x: localPoint.x + options.boxDirection.x,
      y: localPoint.y + options.boxDirection.y,
    }, node, size);
    anchor = cableTextAnchorFromBox({
      x: directionPoint.x - point.x,
      y: directionPoint.y - point.y,
    });
  }
  const label = createSvg("text", {
    class: className,
    x: (node.x + point.x) * GRID,
    y: (node.y + point.y) * GRID,
    "text-anchor": anchor,
    "dominant-baseline": "middle",
    dy: "0.12em",
  });
  label.textContent = text;
  parent.appendChild(label);
}

function transformedLocalVector(node, localPoint, vector) {
  const size = nodeSize(node);
  const start = transformLocalPoint(localPoint, node, size);
  const end = transformLocalPoint({ x: localPoint.x + vector.x, y: localPoint.y + vector.y }, node, size);
  return { x: end.x - start.x, y: end.y - start.y };
}

function cableLengthTextAnchor(direction) {
  if (direction.x < -0.5) return "end";
  if (direction.x > 0.5) return "start";
  return "middle";
}

function cableLengthTextBaseline(direction) {
  if (direction.y > 0.5) return "hanging";
  if (direction.y < -0.5) return "text-after-edge";
  return "middle";
}

function appendCablePortLengthLabel(parent, node, pivotPoint, boxDirection, text) {
  const size = nodeSize(node);
  const point = transformLocalPoint(pivotPoint, node, size);
  const direction = transformedLocalVector(node, pivotPoint, boxDirection);
  const baseline = cableLengthTextBaseline(direction);
  const padding = {
    x: direction.x > 0.5 ? 0.18 : direction.x < -0.5 ? -0.18 : 0,
    y: direction.y > 0.5 ? 0.12 : direction.y < -0.5 ? -0.12 : 0,
  };
  const label = createSvg("text", {
    class: "cable-port-length",
    x: (node.x + point.x + padding.x) * GRID,
    y: (node.y + point.y + padding.y) * GRID,
    "text-anchor": cableLengthTextAnchor(direction),
    "dominant-baseline": baseline,
    dy: baseline === "middle" ? "0.12em" : "0",
  });
  label.textContent = text;
  parent.appendChild(label);
}

function appendCableTextLabels(parent, node) {
  const size = nodeSize(node);
  if (isCableSourceNode(node)) {
    const contact = { x: size.w / 2 - 0.5, y: 4 };
    appendCablePortLengthLabel(parent, node, contact, { x: -1, y: 1 }, String(multiBitCount(node)));
    appendUprightCableText(parent, node, "cable-switch-data", { x: size.w / 2, y: 2 }, String(cableDataValue(node)));
  }
  if (node.type === "CABLE_OUTPUT") {
    const contact = { x: size.w / 2 - 0.5, y: 4 };
    appendCablePortLengthLabel(parent, node, contact, { x: -1, y: 1 }, String(multiBitCount(node)));
  }
  if (node.type === "CABLE_TO_BUS") {
    const contact = { x: 2, y: size.h / 2 - 0.5 };
    appendCablePortLengthLabel(parent, node, contact, { x: -1, y: -1 }, String(multiBitCount(node)));
  }
  if (node.type === "BUS_TO_CABLE") {
    const contact = { x: size.w - 2, y: size.h / 2 - 0.5 };
    appendCablePortLengthLabel(parent, node, contact, { x: 1, y: -1 }, String(multiBitCount(node)));
  }
  if (node.type === "CABLE_MERGER") {
    const segments = cableSegments(node);
    for (const [index, bits] of segments.entries()) {
      const y = cableSegmentLocalY(node, index) - 0.5;
      appendCablePortLengthLabel(parent, node, { x: 2, y }, { x: -1, y: -1 }, String(bits));
    }
    appendCablePortLengthLabel(parent, node, { x: size.w - 2, y: size.h / 2 - 0.5 }, { x: 1, y: -1 }, String(cableSegmentTotalBits(node)));
  }
  if (node.type === "CABLE_DIVIDER") {
    appendCablePortLengthLabel(parent, node, { x: 2, y: size.h / 2 - 0.5 }, { x: -1, y: -1 }, String(cableSegmentTotalBits(node)));
    const segments = cableSegments(node);
    for (const [index, bits] of segments.entries()) {
      const y = cableSegmentLocalY(node, index) - 0.5;
      appendCablePortLengthLabel(parent, node, { x: size.w - 2, y }, { x: 1, y: -1 }, String(bits));
    }
  }
  if (node.type === "CABLE_PIN") {
    const inset = cablePinVisualInset();
    const contact = { x: inset, y: inset };
    appendCablePortLengthLabel(parent, node, contact, { x: -1, y: -1 }, String(multiBitCount(node)));
  }
}

function appendLeftOrderArrow(group, px, y, width, color = orderArrowColor()) {
  const pointsLeft = state.settings.orderArrowDirection !== "msb-to-lsb";
  const left = px;
  const right = px + width;
  appendArrow(
    group,
    pointsLeft ? right : left,
    y,
    pointsLeft ? left : right,
    y,
    "multibit-order-arrow",
    color,
  );
}

function appendBusShape(group, node, px, py) {
  const bits = multiBitCount(node);
  const color = state.settings.wireHotColor || DEFAULT_HOT_COLOR;
  if (node.busDiagonal) {
    for (let index = 0; index < bits; index += 1) {
      const x = px + index * GRID * 2;
      const y = py + index * GRID * 2;
      group.appendChild(createSvg("rect", {
        class: "gate-body bus-body",
        x,
        y,
        width: GRID * 2,
        height: GRID * 2,
      }));
      const input = portPosition(node, `in${index}`, "input");
      const output = portPosition(node, `out${index}`, "output");
      group.appendChild(createSvg("line", {
        class: "bus-lane",
        x1: input.x * GRID,
        y1: input.y * GRID,
        x2: output.x * GRID,
        y2: output.y * GRID,
        style: `stroke: ${color}`,
      }));
    }
    return;
  }

  const width = bits * GRID * 2;
  group.appendChild(createSvg("rect", {
    class: "gate-body bus-body",
    x: px,
    y: py,
    width,
    height: GRID * 2,
  }));
  for (let index = 0; index < bits; index += 1) {
    const input = portPosition(node, `in${index}`, "input");
    const output = portPosition(node, `out${index}`, "output");
    group.appendChild(createSvg("line", {
      class: "bus-lane",
      x1: input.x * GRID,
      y1: input.y * GRID,
      x2: output.x * GRID,
      y2: output.y * GRID,
      style: `stroke: ${color}`,
    }));
  }
}

function appendMultiBitOutputShape(group, node, px, py) {
  const bits = multiBitCount(node);
  const width = bits * GRID * 2;
  appendLeftOrderArrow(group, px, py, width);
  for (let index = 0; index < bits; index += 1) {
    const signal = signalValue(state.values.get(`${node.id}.bit${index}`));
    const cx = px + GRID * (1 + index * 2);
    const cy = py + GRID * 2;
    group.appendChild(createSvg("circle", {
      class: `output-led multibit-output-led ${signalClass(signal)}`,
      cx,
      cy,
      r: GRID,
      style: signal !== SIGNAL.ZERO
        ? `fill: ${signalColor(signal, node.onColor || DEFAULT_HOT_COLOR, "#ffffff")}; stroke: var(--part-stroke); stroke-width: var(--circuit-stroke)`
        : "fill: #ffffff; stroke: var(--part-stroke); stroke-width: var(--circuit-stroke)",
    }));
  }
}

function appendMultiBitPinShape(group, node, px, py) {
  const bits = multiBitCount(node);
  const width = bits * GRID * 2;
  const assigned = circuitPinAssigned(node);
  appendLeftOrderArrow(group, px, py, width);
  for (let index = 0; index < bits; index += 1) {
    const cx = px + GRID * (1 + index * 2);
    const cy = py + GRID * 2;
    const markerSize = GRID * PIN_VISUAL_CELLS;
    group.appendChild(createSvg("rect", {
      class: `gate-body multibit-pin-marker ${assigned ? "assigned-pin" : ""}`,
      x: cx - markerSize / 2,
      y: cy - markerSize / 2,
      width: markerSize,
      height: markerSize,
    }));
  }
}

function sequentialDisplayName(node) {
  if (node.type === "SR_LATCH") return "SR L";
  if (node.type === "D_LATCH") return "D L";
  if (node.type === "SR_FF") return "SR FF";
  if (node.type === "D_FF") return "D FF";
  if (node.type === "JK_FF") return "JK FF";
  if (node.type === "T_FF") return "T FF";
  return nodeLabel(node);
}

function appendSequentialLabel(group, text, x, y, anchor = "middle") {
  group.appendChild(createSvg("text", {
    class: "node-sub sequential-pin-label",
    x,
    y,
    style: `text-anchor: ${anchor}`,
  }));
  group.lastChild.textContent = text;
}

function appendSequentialShape(group, node, px, py, w, h) {
  for (const port of nodeInputs(node)) {
    const point = portPosition(node, port, "input");
    const x = point.x * GRID;
    const y = point.y * GRID;
    if (port === "clk" || port === "en") {
      group.appendChild(createSvg("line", {
        class: "gate-pin",
        x1: x,
        y1: y,
        x2: x,
        y2: py + h,
      }));
    } else {
      group.appendChild(createSvg("line", {
        class: "gate-pin",
        x1: x,
        y1: y,
        x2: px,
        y2: y,
      }));
    }
  }
  for (const port of nodeOutputs(node)) {
    const point = portPosition(node, port, "output");
    const x = point.x * GRID;
    const y = point.y * GRID;
    group.appendChild(createSvg("line", {
      class: "gate-pin",
      x1: px + w,
      y1: y,
      x2: x,
      y2: y,
    }));
  }
  group.appendChild(createSvg("rect", {
    class: "gate-body sequential-body",
    x: px,
    y: py,
    width: w,
    height: h,
    rx: 0,
  }));
  group.appendChild(createSvg("text", {
    class: "macro-symbol-text sequential-title",
    x: px + w / 2,
    y: py + h / 2,
    "text-anchor": "middle",
    "dominant-baseline": "middle",
  }));
  group.lastChild.textContent = sequentialDisplayName(node);

  for (const port of nodeInputs(node)) {
    if (port === "clk" || port === "en") continue;
    const point = portPosition(node, port, "input");
    appendSequentialLabel(group, port.toUpperCase(), px + GRID * 0.7, point.y * GRID, "start");
  }
  for (const port of nodeOutputs(node)) {
    const point = portPosition(node, port, "output");
    appendSequentialLabel(group, port === "qbar" ? "Q'" : "Q", px + w - GRID * 0.7, point.y * GRID, "end");
  }
  if (FLIP_FLOP_TYPES.has(node.type)) {
    const clk = portPosition(node, "clk", "input");
    const cx = clk.x * GRID;
    const cy = py + h;
    group.appendChild(createSvg("path", {
      class: "sequential-clock-mark",
      d: [
        `M ${cx - GRID * 1.4} ${cy}`,
        `L ${cx} ${cy - GRID * 1.8}`,
        `L ${cx + GRID * 1.4} ${cy}`,
      ].join(" "),
    }));
  }
  if (LATCH_TYPES.has(node.type)) {
    appendSequentialLabel(group, "EN", px + w / 2, py + h - GRID * 2.1);
  }
}

// Render the visible body of each component type.
function renderNodeShape(group, node) {
  const size = nodeSize(node);
  const px = node.x * GRID;
  const py = node.y * GRID;
  const w = size.w * GRID;
  const h = size.h * GRID;

  if (node.type === "INPUT") {
    group.appendChild(createSvg("rect", { class: "gate-body", x: px, y: py, width: w, height: h, rx: 8 }));
    group.appendChild(createSvg("circle", {
      class: `switch-dot ${node.value ? "on" : "off"}`,
      cx: px + w / 2,
      cy: py + h / 2,
      r: GRID * 0.46,
      style: node.value
        ? `fill: ${node.onColor || DEFAULT_HOT_COLOR}; stroke: ${node.onColor || DEFAULT_HOT_COLOR}`
        : "fill: #ffffff; stroke: var(--part-stroke)",
    }));
  } else if (node.type === "MULTI_INPUT" || node.type === "MULTI_TEST_INPUT") {
    appendMultiBitSwitchShape(group, node, px, py);
  } else if (isCableSourceNode(node)) {
    appendCableSwitchShape(group, node, px, py);
  } else if (node.type === "CABLE_OUTPUT") {
    appendCableOutputShape(group, node, px, py);
  } else if (node.type === "CABLE_TO_BUS") {
    appendCableToBusShape(group, node, px, py);
  } else if (node.type === "BUS_TO_CABLE") {
    appendBusToCableShape(group, node, px, py);
  } else if (isCableMergeSplitType(node.type)) {
    appendCableMergeSplitShape(group, node, px, py);
  } else if (node.type === "BUS") {
    appendBusShape(group, node, px, py);
  } else if (node.type === "MULTI_OUTPUT") {
    appendMultiBitOutputShape(group, node, px, py);
  } else if (node.type === "MULTI_PIN") {
    appendMultiBitPinShape(group, node, px, py);
  } else if (node.type === "TEST_INPUT") {
    const cx = px + w / 2;
    const cy = py + h / 2;
    const diamond = [
      `${cx},${py}`,
      `${px + w},${cy}`,
      `${cx},${py + h}`,
      `${px},${cy}`,
    ].join(" ");
    group.appendChild(createSvg("polygon", { class: "gate-body test-switch-body", points: diamond }));
    group.appendChild(createSvg("circle", {
      class: `switch-dot ${node.value ? "on" : "off"}`,
      cx,
      cy,
      r: GRID * 0.46,
      style: node.value
        ? `fill: ${node.onColor || DEFAULT_HOT_COLOR}; stroke: ${node.onColor || DEFAULT_HOT_COLOR}`
        : "fill: #ffffff; stroke: var(--part-stroke)",
    }));
  } else if (node.type === "OUTPUT") {
    const signal = signalValue(state.values.get(`${node.id}.in`));
    const isOn = signalIsOne(signal);
    group.appendChild(createSvg("circle", {
      class: `led ${signalClass(signal)} ${isOn ? "on" : ""}`,
      cx: px + w / 2,
      cy: py + h / 2,
      r: GRID,
      style: `fill: ${signal === SIGNAL.ZERO ? "#ffffff" : signalColor(signal, node.onColor || DEFAULT_HOT_COLOR, "#ffffff")}; stroke: var(--part-stroke)`,
    }));
  } else if (node.type === "VCC" || node.type === "GND" || node.type === "X_SRC" || node.type === "Z_SRC" || node.type === "CLOCK" || node.type === "PULSE") {
    const centerX = px + w / 2;
    const centerY = py + h / 2;
    group.appendChild(createSvg("rect", {
      class: "supply-hitbox",
      x: px,
      y: py,
      width: w,
      height: h,
    }));
    if (node.type === "PULSE") {
      const signal = pulseSignal(node);
      const color = signalColor(signal);
      group.appendChild(createSvg("rect", {
        class: "gate-body pulse-source-body",
        x: px,
        y: py,
        width: w,
        height: h,
        rx: 0,
        style: `stroke: ${color}`,
      }));
      group.appendChild(createSvg("text", {
        class: "pulse-source-pattern",
        x: centerX,
        y: centerY - GRID * 0.35,
        style: `fill: ${color}`,
      }));
      group.lastChild.textContent = normalizePulsePattern(node.pulsePattern);
      group.appendChild(createSvg("text", {
        class: "pulse-source-label",
        x: centerX,
        y: centerY + GRID * 0.85,
        style: `fill: ${color}`,
      }));
      group.lastChild.textContent = `${pulseFrequency(node)}Hz`;
    } else if (node.type === "CLOCK") {
      const signal = signalFromBoolean(node.value);
      const color = signalColor(signal);
      group.appendChild(createSvg("circle", {
        class: `supply-state-ring ${signalClass(signal)}`,
        cx: centerX,
        cy: centerY,
        r: GRID * 2,
        style: `stroke: ${color}; fill: #ffffff`,
      }));
      group.appendChild(createSvg("path", {
        class: "clock-source-wave",
        d: [
          `M ${centerX - GRID * 1.25} ${centerY - GRID * 0.1}`,
          `H ${centerX - GRID * 0.45}`,
          `V ${centerY - GRID * 0.9}`,
          `H ${centerX + GRID * 0.45}`,
          `V ${centerY - GRID * 0.1}`,
          `H ${centerX + GRID * 1.25}`,
        ].join(" "),
        style: `stroke: ${color}`,
      }));
      group.appendChild(createSvg("text", {
        class: "clock-source-label",
        x: centerX,
        y: centerY + GRID * 0.95,
        style: `fill: ${color}`,
      }));
      group.lastChild.textContent = `${clockFrequency(node)}Hz`;
    } else if (node.type === "VCC") {
      group.appendChild(createSvg("line", { class: "supply-symbol", x1: centerX, y1: centerY, x2: centerX, y2: centerY - GRID }));
      group.appendChild(createSvg("line", { class: "supply-symbol", x1: centerX - GRID, y1: centerY - GRID, x2: centerX + GRID, y2: centerY - GRID }));
    } else if (node.type === "GND") {
      group.appendChild(createSvg("line", { class: "supply-symbol", x1: centerX, y1: centerY, x2: centerX, y2: centerY + GRID }));
      group.appendChild(createSvg("line", { class: "supply-symbol", x1: centerX - GRID, y1: centerY + GRID, x2: centerX + GRID, y2: centerY + GRID }));
      group.appendChild(createSvg("line", { class: "supply-symbol", x1: centerX - GRID * 0.75, y1: centerY + GRID * 1.25, x2: centerX + GRID * 0.75, y2: centerY + GRID * 1.25 }));
      group.appendChild(createSvg("line", { class: "supply-symbol", x1: centerX - GRID * 0.5, y1: centerY + GRID * 1.5, x2: centerX + GRID * 0.5, y2: centerY + GRID * 1.5 }));
    } else {
      const signal = node.type === "X_SRC" ? SIGNAL.UNKNOWN : SIGNAL.HIGH_Z;
      group.appendChild(createSvg("circle", {
        class: `supply-state-ring ${signalClass(signal)}`,
        cx: centerX,
        cy: centerY,
        r: GRID * 1.05,
        style: `stroke: ${signalColor(signal)}; fill: #ffffff`,
      }));
      const mark = GRID * 0.38;
      const markStyle = `stroke: ${signalColor(signal)}; fill: none`;
      if (node.type === "X_SRC") {
        group.appendChild(createSvg("line", {
          class: "supply-state-mark",
          x1: centerX - mark,
          y1: centerY - mark,
          x2: centerX + mark,
          y2: centerY + mark,
          style: markStyle,
        }));
        group.appendChild(createSvg("line", {
          class: "supply-state-mark",
          x1: centerX + mark,
          y1: centerY - mark,
          x2: centerX - mark,
          y2: centerY + mark,
          style: markStyle,
        }));
      } else {
        group.appendChild(createSvg("path", {
          class: "supply-state-mark",
          d: [
            `M ${centerX - mark} ${centerY - mark}`,
            `H ${centerX + mark}`,
            `L ${centerX - mark} ${centerY + mark}`,
            `H ${centerX + mark}`,
          ].join(" "),
          style: markStyle,
        }));
      }
    }
  } else if (node.type === "PIN") {
    group.appendChild(createSvg("rect", {
      class: `gate-body pin-body ${circuitPinAssigned(node) ? "assigned-pin" : ""}`,
      x: px,
      y: py,
      width: w,
      height: h,
    }));
  } else if (node.type === "CABLE_PIN") {
    const inset = cablePinVisualInset() * GRID;
    group.appendChild(createSvg("rect", {
      class: "supply-hitbox",
      x: px,
      y: py,
      width: w,
      height: h,
    }));
    group.appendChild(createSvg("rect", {
      class: `gate-body pin-body cable-pin-body ${circuitPinAssigned(node) ? "assigned-pin" : ""}`,
      x: px + inset,
      y: py + inset,
      width: w - inset * 2,
      height: h - inset * 2,
    }));
    group.appendChild(createSvg("circle", {
      class: "cable-pin-mark",
      cx: px + w / 2,
      cy: py + h / 2,
      r: GRID / 2,
    }));
  } else if (node.type === "JUNCTION") {
    group.appendChild(createSvg("circle", {
      class: "junction-body",
      cx: px + w / 2,
      cy: py + h / 2,
      r: GRID / 2,
    }));
  } else if (node.type === "TEXT") {
    const textPosition = textPositionInBox(node, px, py, w, h);
    group.appendChild(createSvg("rect", {
      class: "text-box-hitbox",
      x: px,
      y: py,
      width: w,
      height: h,
      "data-node-id": node.id,
    }));
    group.appendChild(createSvg("text", {
      class: "circuit-text",
      x: textPosition.x,
      y: textPosition.y,
      style: textStyle(node),
      "text-anchor": textAnchor(node),
      "dominant-baseline": textBaseline(node),
      dy: textBaselineOffset(node),
    }));
    group.lastChild.textContent = node.text || "Text";
  } else if (node.type === "MACRO") {
    const macro = findMacro(node.macroId);
    const polygon = macro?.polygon?.length
      ? macro.polygon.map((point) => `${px + point.x * GRID},${py + point.y * GRID}`).join(" ")
      : `${px},${py} ${px + w},${py} ${px + w},${py + h} ${px},${py + h}`;
    group.appendChild(createSvg("polygon", {
      class: "gate-body macro-body",
      points: polygon,
    }));
    for (const text of macro?.texts || []) {
      const bounds = textPixelBounds(text, px, py);
      const textPosition = textPositionInBox(text, bounds.minX, bounds.minY, bounds.maxX - bounds.minX, bounds.maxY - bounds.minY);
      group.appendChild(createSvg("text", {
        class: "macro-symbol-text",
        x: textPosition.x,
        y: textPosition.y,
        style: textStyle(text),
        "text-anchor": textAnchor(text),
        "dominant-baseline": textBaseline(text),
        dy: textBaselineOffset(text),
      }));
      group.lastChild.textContent = text.text || "";
    }
    for (const pin of macro?.pins || []) {
      const position = macroPinPosition(pin, nodeSize(node));
      const pinX = px + position.x * GRID;
      const pinY = py + position.y * GRID;
      const labelX = pin.direction === "output" ? pinX - GRID * 0.35 : pinX + GRID * 0.35;
      const pinMarkerSize = GRID * PIN_VISUAL_CELLS;
      if (Math.max(1, Math.round(Number(pin.bitLength || 1))) > 1) {
        appendCablePinGlyph(group, pinX, pinY, "macro-pin-marker");
      } else {
        group.appendChild(createSvg("rect", {
          class: "macro-pin-marker",
          x: pinX - pinMarkerSize / 2,
          y: pinY - pinMarkerSize / 2,
          width: pinMarkerSize,
          height: pinMarkerSize,
        }));
      }
      if (pin.label) {
        group.appendChild(createSvg("text", {
          class: "node-sub macro-pin-label",
          x: labelX,
          y: pinY,
          style: `text-anchor: ${pin.direction === "output" ? "end" : "start"}`,
        }));
        group.lastChild.textContent = pin.label;
      }
    }
  } else if (SEQUENTIAL_TYPES.has(node.type)) {
    appendSequentialShape(group, node, px, py, w, h);
  } else if (node.type === "CHIP") {
    group.appendChild(createSvg("rect", { class: "gate-body chip-body", x: px, y: py, width: w, height: h, rx: 6 }));
    group.appendChild(createSvg("line", { class: "chip-divider", x1: px + 14, y1: py + 20, x2: px + w - 14, y2: py + 20 }));
    group.appendChild(createSvg("text", { class: "node-label chip-label", x: px + w / 2, y: py + 12 }));
    group.lastChild.textContent = "HALF ADDER";
    group.appendChild(createSvg("text", { class: "node-sub pin-label input-a", x: px + 16, y: py + GRID }));
    group.lastChild.textContent = "A";
    group.appendChild(createSvg("text", { class: "node-sub pin-label input-b", x: px + 16, y: py + GRID * 3 }));
    group.lastChild.textContent = "B";
    group.appendChild(createSvg("text", { class: "node-sub pin-label output-sum", x: px + w - 18, y: py + GRID * 1.65 }));
    group.lastChild.textContent = "S";
    group.appendChild(createSvg("text", { class: "node-sub pin-label output-carry", x: px + w - 18, y: py + GRID * 3.35 }));
    group.lastChild.textContent = "C";
  } else {
    appendGateSymbol(group, node, px, py, w, h);
  }
}

// Ports carry data attributes so pointer events can start or finish a wire.
function renderPorts(group, node) {
  for (const port of nodeInputs(node)) {
    const point = portPosition(node, port, "input");
    const signal = signalValue(state.values.get(`${node.id}.${port}`));
    const bitLength = portBitLength(node, port);
    const circle = createSvg("circle", {
      class: `port input ${bitLength > 1 ? "cable-port" : ""} ${signalClass(signal)}`,
      cx: point.x * GRID,
      cy: point.y * GRID,
      r: bitLength > 1 ? GRID / 2 : 6,
      "data-node-id": node.id,
      "data-port": port,
      "data-direction": "input",
      "data-bit-length": bitLength,
    });
    group.appendChild(circle);
  }
  for (const port of nodeOutputs(node)) {
    const point = portPosition(node, port, "output");
    const signal = signalValue(state.values.get(`${node.id}.${port}`));
    const bitLength = portBitLength(node, port);
    const circle = createSvg("circle", {
      class: `port output ${bitLength > 1 ? "cable-port" : ""} ${signalClass(signal)}`,
      cx: point.x * GRID,
      cy: point.y * GRID,
      r: bitLength > 1 ? GRID / 2 : 6,
      "data-node-id": node.id,
      "data-port": port,
      "data-direction": "output",
      "data-bit-length": bitLength,
    });
    group.appendChild(circle);
  }
}

function appendSelectionCornerHandles(parent, bounds, className = "selection-handle") {
  if (!bounds) return;
  const handle = GRID;
  const corners = [
    { x: bounds.minX, y: bounds.minY },
    { x: bounds.maxX, y: bounds.minY },
    { x: bounds.minX, y: bounds.maxY },
    { x: bounds.maxX, y: bounds.maxY },
  ];
  for (const corner of corners) {
    parent.appendChild(createSvg("rect", {
      class: className,
      x: corner.x - handle / 2,
      y: corner.y - handle / 2,
      width: handle,
      height: handle,
    }));
  }
}

function renderSelectionHandles(node) {
  const bounds = nodeBounds(node);
  appendSelectionCornerHandles(selectionOverlayLayer, {
    minX: bounds.minX * GRID,
    minY: bounds.minY * GRID,
    maxX: bounds.maxX * GRID,
    maxY: bounds.maxY * GRID,
  });
}

function renderWireSelection(wire) {
  if (!wire) return;
  const bounds = wireBounds(wire);
  if (!bounds) return;
  const handle = GRID;
  appendSelectionCornerHandles(selectionOverlayLayer, {
    minX: bounds.minX * GRID,
    minY: bounds.minY * GRID,
    maxX: bounds.maxX * GRID,
    maxY: bounds.maxY * GRID,
  });

  wire.points.forEach((point, index) => {
    selectionOverlayLayer.appendChild(createSvg("rect", {
      class: "wire-bend-handle",
      x: point.x * GRID - handle / 2,
      y: point.y * GRID - handle / 2,
      width: handle,
      height: handle,
      "data-wire-id": wire.id,
      "data-point-index": index,
    }));
  });
}

function renderCombinedSelectionHandles() {
  const bounds = selectedRotationBounds();
  if (!bounds) return;
  const pixelBounds = {
    minX: bounds.minX * GRID,
    minY: bounds.minY * GRID,
    maxX: bounds.maxX * GRID,
    maxY: bounds.maxY * GRID,
  };
  selectionOverlayLayer.appendChild(createSvg("rect", {
    class: "selection-box selection-bounds-box",
    x: pixelBounds.minX,
    y: pixelBounds.minY,
    width: pixelBounds.maxX - pixelBounds.minX,
    height: pixelBounds.maxY - pixelBounds.minY,
  }));
  appendSelectionCornerHandles(selectionOverlayLayer, pixelBounds);
}

function applyNodeShapeTransform(shapeGroup, node) {
  const rotation = rotationQuarter(node);
  const mirror = mirrorFlags(node);
  if (!rotation && !mirror.x && !mirror.y) return;
  const size = nodeSize(node);
  const center = localRotationCenter(node, size);
  const cx = (node.x + center.x) * GRID;
  const cy = (node.y + center.y) * GRID;
  const transforms = [
    `translate(${cx} ${cy})`,
    mirror.x || mirror.y ? `scale(${mirror.x ? -1 : 1} ${mirror.y ? -1 : 1})` : "",
    rotation ? `rotate(${-90 * rotation})` : "",
    `translate(${-cx} ${-cy})`,
  ].filter(Boolean);
  shapeGroup.setAttribute("transform", transforms.join(" "));
}

function renderNodes() {
  nodesLayer.replaceChildren();
  for (const node of state.nodes) {
    const group = createSvg("g", {
      class: `node ${isNodeSelected(node.id) ? "selected" : ""}`,
      "data-node-id": node.id,
    });
    const shapeGroup = createSvg("g");
    applyNodeShapeTransform(shapeGroup, node);
    suppressPortRotation = true;
    renderNodeShape(shapeGroup, node);
    suppressPortRotation = false;
    group.appendChild(shapeGroup);
    appendCableTextLabels(group, node);
    renderPorts(group, node);
    nodesLayer.appendChild(group);
  }
}

// Side panel reflects the current selection and its latest simulated output values.
function renderSelection() {
  if (selectedCount() > 1) {
    selectionPanel.innerHTML = `
      <strong>Selection</strong><br>
      components: ${state.selectedNodeIds.length}<br>
      wires: ${state.selectedWireIds.length}
    `;
    return;
  }
  const node = findNode(state.selectedNodeIds[0] || state.selectedNodeId);
  const wire = findWire(state.selectedWireIds[0] || state.selectedWireId);
  if (wire) {
    selectionPanel.innerHTML = `
      <strong>Wire</strong><br>
      id: ${wire.id}<br>
      bend points: ${wire.points.length}
    `;
    return;
  }
  if (!node) {
    selectionPanel.textContent = "No component selected";
    return;
  }
  const outputs = nodeOutputs(node).map((port) => `${port}: ${getOutputValue(node.id, port) ? 1 : 0}`).join(", ");
  selectionPanel.innerHTML = `
    <strong>${nodeLabel(node)}</strong><br>
    id: ${node.id}<br>
    grid: (${node.x}, ${node.y})<br>
    ${outputs || "no output ports"}
  `;
}

function appendBusToolPreview(parent, center, options = state.pendingPartOptions || {}) {
  const bits = busToolBits(options);
  const group = createSvg("g", { class: "bus-tool-preview" });
  const dots = busToolDotWorldPoints(center, options);
  for (const dot of dots) {
    group.appendChild(createSvg("circle", {
      class: "bus-tool-dot",
      cx: dot.x * GRID,
      cy: dot.y * GRID,
      r: GRID * 0.33,
    }));
  }
  const arrow = busToolArrowGeometry(center, options);
  const color = orderArrowColor();
  const scale = arrowScale();
  group.appendChild(createSvg("line", {
    class: "bus-tool-arrow",
    x1: arrow.tail.x * GRID,
    y1: arrow.tail.y * GRID,
    x2: arrow.back.x * GRID,
    y2: arrow.back.y * GRID,
    style: `stroke: ${color}; stroke-width: ${2 * scale}`,
  }));
  group.appendChild(createSvg("polygon", {
    class: "bus-tool-arrow-head",
    points: [
      `${arrow.head.x * GRID},${arrow.head.y * GRID}`,
      `${arrow.wingA.x * GRID},${arrow.wingA.y * GRID}`,
      `${arrow.wingB.x * GRID},${arrow.wingB.y * GRID}`,
    ].join(" "),
    style: `fill: ${color}; stroke: ${color}`,
  }));
  parent.appendChild(group);
  const attachPoints = endpointsUnderBusTool(center, options);
  for (const endpoint of attachPoints) {
    parent.appendChild(createSvg("circle", {
      class: `bus-tool-attach ${attachPoints.length === bits ? "ok" : "warn"}`,
      cx: endpoint.point.x * GRID,
      cy: endpoint.point.y * GRID,
      r: GRID * 0.22,
    }));
  }
}

// Temporary wire shown while the user is choosing an input port.
function renderPreview() {
  wirePreviewLayer.replaceChildren();
  if (state.wireStart) {
    const start = endpointPosition(state.wireStart, "output");
    if (start) {
      const previewEnd = state.attachCandidate
        ? endpointPosition(state.attachCandidate, "input") || state.pointerGrid
        : state.pointerGrid;
      const bitLength = endpointBitLength(state.wireStart, "output");
      const points = [start, ...state.wirePoints, previewEnd];
      const path = createSvg("path", {
        class: `wire-preview ${bitLength > 1 ? "cable" : ""}`,
        d: pointsToSvgPath(points),
        ...(bitLength > 1 ? { style: `stroke: #000000; stroke-width: ${GRID}` } : {}),
      });
      wirePreviewLayer.appendChild(path);
      appendWirePointCaps(
        wirePreviewLayer,
        points,
        bitLength > 1 ? "#000000" : "var(--part-stroke)",
        bitLength > 1 ? GRID / 2 : WIRE_POINT_CAP_RADIUS,
      );
    }
  }
  if (state.drag?.kind === "box-select") {
    const bounds = normalizedBounds(state.drag.startGrid, state.pointerGrid);
    wirePreviewLayer.appendChild(createSvg("rect", {
      class: "selection-box",
      x: bounds.minX * GRID,
      y: bounds.minY * GRID,
      width: (bounds.maxX - bounds.minX) * GRID,
      height: (bounds.maxY - bounds.minY) * GRID,
    }));
  }
  if (state.pendingPart && state.tool === "move") {
    if (state.pendingPart === "BUS") {
      appendBusToolPreview(wirePreviewLayer, state.pointerGrid, state.pendingPartOptions || {});
      if (state.busStart) {
        const currentOptions = state.pendingPartOptions || state.busStart.options || {};
        const targets = endpointsUnderBusTool(state.pointerGrid, currentOptions);
        const currentDots = busToolDotWorldPoints(state.pointerGrid, currentOptions);
        const targetReady = targets.length === state.busStart.endpoints.length;
        for (let index = 0; index < state.busStart.endpoints.length; index += 1) {
          const points = [
            state.busStart.endpoints[index].point,
            ...(state.busStart.bends || []).map((bend) => bend[index]).filter(Boolean),
            currentDots[index],
          ];
          if (targetReady) points.push(targets[index].point);
          wirePreviewLayer.appendChild(createSvg("path", {
            class: "wire-preview",
            d: pointsToSvgPath(points),
          }));
          appendWirePointCaps(wirePreviewLayer, points, "var(--part-stroke)", WIRE_POINT_CAP_RADIUS);
        }
      }
      return;
    }
    const compositePreview = compositePreviewParts(state.pendingPart, state.pointerGrid, state.pendingPartOptions || {});
    if (compositePreview) {
      const group = createSvg("g", { class: "pending-part-preview" });
      for (const wire of compositePreview.wires) {
        const isCable = wireBitLength(wire) > 1;
        const points = wire.previewPoints || wirePathPoints(wire);
        group.appendChild(createSvg("path", {
          class: `wire-preview ${isCable ? "cable" : ""}`,
          d: pointsToSvgPath(points),
          ...(isCable ? { style: `stroke: #000000; stroke-width: ${GRID}` } : {}),
        }));
        appendWirePointCaps(
          group,
          points,
          isCable ? "#000000" : "var(--part-stroke)",
          isCable ? GRID / 2 : WIRE_POINT_CAP_RADIUS,
        );
      }
      for (const node of compositePreview.nodes) {
        const shapeGroup = createSvg("g");
        applyNodeShapeTransform(shapeGroup, node);
        suppressPortRotation = true;
        renderNodeShape(shapeGroup, node);
        suppressPortRotation = false;
        group.appendChild(shapeGroup);
        appendCableTextLabels(group, node);
      }
      wirePreviewLayer.appendChild(group);
      return;
    }
    const previewNode = pendingPreviewNode(state.pendingPart, state.pointerGrid, state.pendingPartOptions || {});
    if (previewNode) {
      const group = createSvg("g", { class: "pending-part-preview" });
      const shapeGroup = createSvg("g");
      applyNodeShapeTransform(shapeGroup, previewNode);
      suppressPortRotation = true;
      renderNodeShape(shapeGroup, previewNode);
      suppressPortRotation = false;
      group.appendChild(shapeGroup);
      appendCableTextLabels(group, previewNode);
      wirePreviewLayer.appendChild(group);
    }
  }
}

function renderSelectionOverlay() {
  selectionOverlayLayer.replaceChildren();
  if (selectedCount() > 1) {
    renderCombinedSelectionHandles();
    return;
  }
  for (const id of state.selectedNodeIds) {
    const node = findNode(id);
    if (node) renderSelectionHandles(node);
  }
  if (state.drag?.kind === "selection" || state.drag?.kind === "box-select") return;
  for (const id of state.selectedWireIds) {
    renderWireSelection(findWire(id));
  }
}

function renderStatus() {
  const part = state.pendingPart ? ` | Part ${partLabel(state.pendingPart)}` : "";
  const simState = state.simulationRunning ? "Run" : "Stop";
  const blockingIssue = firstBlockingCircuitIssue(state.circuitIssues);
  const warningIssue = state.circuitIssues.find((issue) => !isBlockingCircuitIssue(issue));
  statusEl.textContent = blockingIssue
    ? `Error: ${blockingIssue.message}`
    : warningIssue
      ? `Warning: ${warningIssue.message}`
    : state.statusNotice || `Sim ${simState} | Mode ${modeLabel()}${part} | Zoom ${zoomPercent()}% | Grid (${state.pointerGrid.x}, ${state.pointerGrid.y})`;
}

function renderViewportOnly() {
  setViewportTransform();
  renderStatus();
}

function renderInteractionLayers() {
  renderPreview();
  renderSelectionOverlay();
  renderSelection();
  renderStatus();
}

function renderScene({ simulateLogic = true } = {}) {
  setViewportTransform();
  if (simulateLogic) simulate();
  renderWires();
  renderNodes();
  renderJunctionOverlay();
  renderInteractionLayers();
}

// Central render pass: recompute logic values, then redraw every circuit layer.
function render() {
  renderScene({ simulateLogic: true });
}

function tickClocks() {
  if (!state.simulationRunning) return;
  const now = performance.now();
  let changed = false;
  for (const node of state.nodes) {
    if (node.type === "CLOCK") {
      const hz = clockFrequency(node);
      const halfPeriodMs = 500 / hz;
      const previousTick = Number(node.lastClockTick);
      if (!Number.isFinite(previousTick)) {
        node.lastClockTick = now;
        continue;
      }
      const elapsed = now - previousTick;
      if (elapsed < halfPeriodMs) continue;
      const steps = Math.floor(elapsed / halfPeriodMs);
      node.lastClockTick = previousTick + steps * halfPeriodMs;
      if (steps % 2 === 1) {
        node.value = !Boolean(node.value);
        changed = true;
      }
      continue;
    }
    if (node.type === "PULSE") {
      const hz = pulseFrequency(node);
      const periodMs = 1000 / hz;
      const previousTick = Number(node.lastPulseTick);
      if (!Number.isFinite(previousTick)) {
        node.lastPulseTick = now;
        continue;
      }
      const elapsed = now - previousTick;
      if (elapsed < periodMs) continue;
      const steps = Math.floor(elapsed / periodMs);
      const pattern = normalizePulsePattern(node.pulsePattern);
      node.lastPulseTick = previousTick + steps * periodMs;
      node.pulseIndex = (Math.max(0, Math.trunc(Number(node.pulseIndex || 0))) + steps) % pattern.length;
      changed = true;
    }
  }
  if (changed) render();
}

function resetClockTickBaselines() {
  const now = performance.now();
  for (const node of state.nodes) {
    if (node.type === "CLOCK") {
      node.clockHz = clockFrequency(node);
      node.lastClockTick = now;
    }
    if (node.type === "PULSE") {
      node.pulseHz = pulseFrequency(node);
      node.pulsePattern = normalizePulsePattern(node.pulsePattern);
      node.lastPulseTick = now;
    }
  }
}

function updateSimulationRunButton() {
  if (!simulationRunToggle) return;
  simulationRunToggle.classList.toggle("active", state.simulationRunning);
  simulationRunToggle.setAttribute("aria-pressed", state.simulationRunning ? "true" : "false");
  simulationRunToggle.setAttribute("aria-label", state.simulationRunning ? "Stop Simulation" : "Run Simulation");
  simulationRunToggle.title = state.simulationRunning ? "Stop Simulation" : "Run Simulation";
  const label = simulationRunToggle.querySelector(".sr-only");
  if (label) label.textContent = state.simulationRunning ? "Stop Simulation" : "Run Simulation";
}

function setSimulationRunning(running) {
  state.simulationRunning = Boolean(running);
  resetClockTickBaselines();
  updateSimulationRunButton();
  renderStatus();
}

function toggleSimulationRunning() {
  setSimulationRunning(!state.simulationRunning);
}

function resetSimulation() {
  setSimulationRunning(false);
  resetClockTickBaselines();
  render();
}

function appendGridToSvg(svg, prefix, bounds) {
  const defs = createSvg("defs");
  const minorId = `${prefix}-minor-grid`;
  const majorId = `${prefix}-major-grid`;
  const minorPattern = createSvg("pattern", {
    id: minorId,
    width: GRID,
    height: GRID,
    patternUnits: "userSpaceOnUse",
  });
  minorPattern.appendChild(createSvg("path", {
    class: "template-grid-minor",
    d: `M ${GRID} 0 L 0 0 0 ${GRID}`,
  }));
  const majorPattern = createSvg("pattern", {
    id: majorId,
    width: GRID * 4,
    height: GRID * 4,
    patternUnits: "userSpaceOnUse",
  });
  majorPattern.appendChild(createSvg("rect", {
    width: GRID * 4,
    height: GRID * 4,
    fill: `url(#${minorId})`,
  }));
  majorPattern.appendChild(createSvg("path", {
    class: "template-grid-major",
    d: `M ${GRID * 4} 0 L 0 0 0 ${GRID * 4}`,
  }));
  defs.append(minorPattern, majorPattern);
  svg.appendChild(defs);
  svg.appendChild(createSvg("rect", {
    class: "template-grid-bg",
    x: bounds.x,
    y: bounds.y,
    width: bounds.width,
    height: bounds.height,
    fill: `url(#${majorId})`,
  }));
}

function circuitContentBounds(nodes, wires) {
  const bounds = [];
  for (const node of nodes) bounds.push(nodeBounds(node));
  for (const wire of wires) {
    const item = wireBounds(wire);
    if (item) bounds.push(item);
  }
  if (!bounds.length) return { minX: 0, minY: 0, maxX: 16, maxY: 10 };
  return bounds.reduce((acc, item) => ({
    minX: Math.min(acc.minX, item.minX),
    minY: Math.min(acc.minY, item.minY),
    maxX: Math.max(acc.maxX, item.maxX),
    maxY: Math.max(acc.maxY, item.maxY),
  }));
}

function openMacroViewerForNode(node) {
  const macro = findMacro(node.macroId);
  if (!macro) return;
  state.macroViewer.stack = [{
    macro,
    inputs: inputValuesForNode(node),
    title: macro.name || "Macro",
  }];
  bringModalToFront(macroViewModal);
  macroViewModal.hidden = false;
  renderMacroViewer();
}

function renderMacroViewer() {
  const frame = state.macroViewer.stack[state.macroViewer.stack.length - 1];
  if (!frame) return;
  const result = simulateMacroCircuit(frame.macro, frame.inputs);
  state.macroViewer.currentResult = result;
  const previous = { nodes: state.nodes, wires: state.wires, values: state.values, macros: state.macros };
  state.nodes = result.nodes;
  state.wires = result.wires;
  state.values = result.values;
  state.macros = mergeMacroDefinitions(state.macros, frame.macro.circuit?.macros || []);

  const bounds = circuitContentBounds(state.nodes, state.wires);
  const pad = GRID * 4;
  const viewBox = {
    x: bounds.minX * GRID - pad,
    y: bounds.minY * GRID - pad,
    width: Math.max((bounds.maxX - bounds.minX) * GRID + pad * 2, GRID * 16),
    height: Math.max((bounds.maxY - bounds.minY) * GRID + pad * 2, GRID * 10),
  };
  macroViewCanvas.replaceChildren();
  macroViewCanvas.setAttribute("viewBox", `${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`);
  appendGridToSvg(macroViewCanvas, "macro-view", viewBox);
  const wiresGroup = createSvg("g");
  const nodesGroup = createSvg("g");
  for (const wire of state.wires) {
    const signal = signalValue(state.values.get(`${wire.id}.__wire`));
    const bitLength = wireBitLength(wire);
    const isCable = bitLength > 1;
    const points = wirePathPoints(wire);
    const color = signalColor(signal);
    wiresGroup.appendChild(createSvg("path", {
      class: `wire ${isCable ? "cable" : ""} ${signalClass(signal)}`,
      d: pointsToSvgPath(points),
      style: isCable
        ? `stroke: ${color}; stroke-width: ${GRID}`
        : `stroke: ${color}`,
    }));
    appendWirePointCaps(wiresGroup, points, color, isCable ? GRID / 2 : WIRE_POINT_CAP_RADIUS);
  }
  for (const node of state.nodes) {
    const group = createSvg("g", {
      class: "node macro-view-node",
      "data-view-node-id": node.id,
    });
    renderNodeShape(group, node);
    appendCableTextLabels(group, node);
    renderPorts(group, node);
    nodesGroup.appendChild(group);
  }
  macroViewCanvas.append(nodesGroup, wiresGroup);
  const inputText = Object.entries(frame.inputs).map(([key, value]) => `${key}=${signalValue(value)}`).join(", ");
  const outputText = Object.entries(result.outputs).map(([key, value]) => `${key}=${signalValue(value)}`).join(", ");
  macroViewStatus.textContent = `${frame.title} | Inputs: ${inputText || "none"} | Outputs: ${outputText || "none"}`;
  document.getElementById("macro-view-title").textContent = frame.title;
  document.getElementById("macro-view-back").disabled = state.macroViewer.stack.length <= 1;

  state.nodes = previous.nodes;
  state.wires = previous.wires;
  state.values = previous.values;
  state.macros = previous.macros;
}

function findMacroForViewer(id) {
  const frame = state.macroViewer.stack[state.macroViewer.stack.length - 1];
  return mergeMacroDefinitions(state.macros, frame?.macro?.circuit?.macros || []).find((macro) => macro.id === id);
}

function partLabel(type) {
  if (isMacroPart(type)) return findMacro(macroIdFromPart(type))?.name || "Macro";
  return GATE_META[type]?.label ?? type;
}

function createNodeAt(type, center, options = {}) {
  if (isMacroPart(type)) {
    const macro = findMacro(macroIdFromPart(type));
    const size = macro?.size || { w: 6, h: 4 };
    const instanceMacro = createMacroInstanceDefinition(macro);
    if (instanceMacro) state.macros.push(instanceMacro);
    return {
      id: uid("macro"),
      type: "MACRO",
      macroId: instanceMacro?.id || macro?.id,
      sourceMacroId: macro?.id,
      size,
      x: center.x - size.w / 2,
      y: center.y - size.h / 2,
      rotation: normalizeRotationOption(options.rotation),
      mirrorX: Boolean(options.mirrorX),
      mirrorY: Boolean(options.mirrorY),
    };
  }
  const seedBusBits = Math.max(1, Math.round(Number(options.bits ?? 4)));
  const seedSize = type === "BUS"
    ? { w: seedBusBits * 2, h: options.busDiagonal ? seedBusBits * 2 : 2 }
    : type === "CABLE_TO_BUS" || type === "BUS_TO_CABLE"
      ? { w: 6, h: Math.min(32, Math.max(1, Math.round(Number(options.bits ?? 4)))) * 2 }
    : isCableMergeSplitType(type)
      ? { w: 6, h: cableMergeSplitHeight({ segments: options.segments }) }
    : type === "MULTI_INPUT" || type === "MULTI_TEST_INPUT"
      ? { w: Math.max(1, Math.round(Number(options.bits ?? 4))) * 2, h: 5 }
      : type === "MULTI_OUTPUT"
        ? { w: Math.max(1, Math.round(Number(options.bits ?? 4))) * 2, h: 3 }
      : type === "MULTI_PIN"
        ? { w: Math.max(1, Math.round(Number(options.bits ?? 4))) * 2, h: 4 }
        : NODE_SIZES[type];
  const node = {
    id: uid(type.toLowerCase()),
    type,
    x: center.x - seedSize.w / 2,
    y: center.y - seedSize.h / 2,
  };
  if (type === "MULTI_INPUT" || type === "MULTI_TEST_INPUT") {
    node.x = Math.round(node.x);
    node.y = Math.round(center.y - 2);
  }
  if (isCableSourceType(type) || type === "CABLE_OUTPUT") {
    node.x = Math.round(center.x - seedSize.w / 2);
    node.y = Math.round(center.y - 3);
  }
  if (type === "CABLE_TO_BUS" || type === "BUS_TO_CABLE" || isCableMergeSplitType(type)) {
    node.x = Math.round(node.x);
    node.y = Math.round(node.y);
  }
  if (type === "MULTI_OUTPUT" || type === "MULTI_PIN") {
    node.x = Math.round(node.x);
    node.y = Math.round(center.y - 2);
  }
  if (type === "INPUT" || type === "TEST_INPUT") {
    node.value = false;
    node.onColor = state.settings.inputHotColor;
  }
  if (type === "CLOCK") {
    node.value = false;
    node.clockHz = clockFrequency(node);
    node.lastClockTick = performance.now();
  }
  if (type === "PULSE") {
    node.pulsePattern = normalizePulsePattern(options.pulsePattern);
    node.pulseHz = pulseFrequency(node);
    node.pulseIndex = 0;
    node.lastPulseTick = performance.now();
  }
  if (type === "MULTI_INPUT" || type === "MULTI_TEST_INPUT") {
    node.bits = Math.min(32, Math.max(1, Math.round(Number(options.bits ?? 4))));
    node.values = multiBitValues(node);
    node.onColor = state.settings.inputHotColor;
  }
  if (isCableSourceType(type)) {
    node.bits = Math.min(32, Math.max(1, Math.round(Number(options.bits ?? 4))));
    node.data = Math.max(0, Math.trunc(Number(options.data ?? 0)));
    node.onColor = state.settings.inputHotColor;
  }
  if (type === "CABLE_TO_BUS" || type === "BUS_TO_CABLE") {
    node.bits = Math.min(32, Math.max(1, Math.round(Number(options.bits ?? 4))));
  }
  if (isCableMergeSplitType(type)) {
    node.segments = cableSegments({ segments: options.segments });
  }
  if (SEQUENTIAL_TYPES.has(type)) {
    node.q = signalValue(options.q ?? SIGNAL.ZERO);
    if (FLIP_FLOP_TYPES.has(type)) node.lastClock = SIGNAL.ZERO;
  }
  if (type === "BUS") {
    node.bits = Math.min(32, Math.max(1, Math.round(Number(options.bits ?? 4))));
    node.busDiagonal = Boolean(options.busDiagonal);
  }
  if (type === "MULTI_OUTPUT" || type === "MULTI_PIN" || type === "CABLE_PIN" || type === "CABLE_OUTPUT") {
    node.bits = Math.min(32, Math.max(1, Math.round(Number(options.bits ?? 4))));
    if (type === "MULTI_OUTPUT") node.onColor = state.settings.outputHotColor;
  }
  node.rotation = normalizeRotationOption(options.rotation);
  node.mirrorX = Boolean(options.mirrorX);
  node.mirrorY = Boolean(options.mirrorY);
  if (type === "OUTPUT") node.onColor = state.settings.outputHotColor;
  if (type === "TEXT") {
    applyTextDefaults(node);
  }
  if (isFanInType(type)) node.fanIn = 2;
  if (type !== "TEXT") snapNodePortsToGrid(node);
  return node;
}

function createWireBetween(fromNode, fromPort, toNode, toPort, points = []) {
  return {
    id: uid("wire"),
    from: { kind: "port", nodeId: fromNode.id, port: fromPort, direction: "output" },
    to: { kind: "port", nodeId: toNode.id, port: toPort, direction: "input" },
    points: points.map((point) => ({ ...point })),
    bitLength: Math.max(1, portBitLength(fromNode, fromPort), portBitLength(toNode, toPort)),
  };
}

function templatePinForSource(source, position, sourcePort = "") {
  const isCable = source?.type === "CABLE_PIN";
  return {
    id: uid("template-pin"),
    label: "",
    direction: "input",
    kind: isCable ? "cable" : "pin",
    bitLength: isCable ? multiBitCount(source) : 1,
    x: position.x,
    y: position.y,
    sourcePinId: source.id,
    sourcePort,
  };
}

function templatePinKind(pin) {
  return pin?.kind === "cable" || Number(pin?.bitLength || 1) > 1 ? "cable" : "pin";
}

function templatePinBitLength(pin) {
  return Math.max(1, Math.round(Number(pin?.bitLength || 1)));
}

function normalizeTemplatePin(pin) {
  const bitLength = templatePinBitLength(pin);
  return {
    ...pin,
    kind: pin?.kind === "cable" || bitLength > 1 ? "cable" : "pin",
    bitLength,
  };
}

function templatePinCompatibleWithSource(pin, source) {
  if (!pin || !source) return false;
  const wantsCable = templatePinKind(pin) === "cable";
  return wantsCable ? source.type === "CABLE_PIN" : source.type !== "CABLE_PIN";
}

function transformTemplatePendingPoint(point, center, options = {}) {
  const mirrored = {
    x: options.mirrorX ? center.x * 2 - point.x : point.x,
    y: options.mirrorY ? center.y * 2 - point.y : point.y,
  };
  return snapPointToGrid(rotatePointByQuarters(mirrored, center, normalizeRotationOption(options.rotation || 0)));
}

function rotateVectorByQuarters(vector, quarters) {
  return rotatePointByQuarters(vector, { x: 0, y: 0 }, quarters);
}

function mirrorVector(vector, axis) {
  return axis === "vertical"
    ? { x: -vector.x, y: vector.y }
    : { x: vector.x, y: -vector.y };
}

function templateMultiPinArrowOffset(options = {}) {
  const mirrored = {
    x: options.mirrorX ? -0 : 0,
    y: options.mirrorY ? 2 : -2,
  };
  return rotateVectorByQuarters(mirrored, normalizeRotationOption(options.rotation || 0));
}

function templateMultiPinPoints(center, bits, options = {}) {
  const groupCenter = { x: center.x, y: center.y + 2 };
  const startX = center.x - (bits - 1);
  return Array.from({ length: bits }, (_, index) => transformTemplatePendingPoint(
    { x: startX + index * 2, y: center.y + 2 },
    groupCenter,
    options,
  ));
}

function addTemplateMultiPin(center, bits, source = null, options = {}) {
  const groupId = uid("template-multipin");
  const positions = templateMultiPinPoints(center, bits, options);
  const arrowOffset = templateMultiPinArrowOffset(options);
  const pins = [];
  for (let index = 0; index < bits; index += 1) {
    const position = positions[index];
    pins.push({
      ...templatePinForSource(source || { id: null }, position, source ? `bit${index}` : ""),
      sourcePinId: source?.id || null,
      sourcePort: source ? `bit${index}` : "",
      multiPinGroup: groupId,
      multiPinIndex: index,
      multiPinBits: bits,
      multiPinArrowOffset: { ...arrowOffset },
    });
  }
  state.template.pins.push(...pins);
  state.template.selected = {
    type: "multi",
    items: pins.map((pin) => ({ type: "pin", id: pin.id })),
  };
}

function busToolBits(options = state.pendingPartOptions || {}) {
  return Math.min(32, Math.max(1, Math.round(Number(options.bits ?? 4))));
}

function busToolA(options = state.pendingPartOptions || {}) {
  return Math.min(32, Math.max(1, Math.round(Number(options.busA ?? 2))));
}

function busToolB(options = state.pendingPartOptions || {}) {
  return Math.min(32, Math.max(1, Math.round(Number(options.busB ?? 2))));
}

function busToolVectorIndex(options = state.pendingPartOptions || {}) {
  return ((Math.round(Number(options.busVectorIndex ?? 4)) % 8) + 8) % 8;
}

function busVectorSignsFromIndex(index) {
  return [
    { x: 1, y: 0 },
    { x: 1, y: -1 },
    { x: 0, y: -1 },
    { x: -1, y: -1 },
    { x: -1, y: 0 },
    { x: -1, y: 1 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
  ][((Math.round(Number(index || 0)) % 8) + 8) % 8];
}

function busVectorIndexFromSigns(signs) {
  const key = `${Math.sign(signs.x || 0)},${Math.sign(signs.y || 0)}`;
  return new Map([
    ["1,0", 0],
    ["1,-1", 1],
    ["0,-1", 2],
    ["-1,-1", 3],
    ["-1,0", 4],
    ["-1,1", 5],
    ["0,1", 6],
    ["1,1", 7],
  ]).get(key);
}

function busToolVector(options = state.pendingPartOptions || {}) {
  const a = busToolA(options);
  const b = busToolB(options);
  const signs = busVectorSignsFromIndex(busToolVectorIndex(options));
  return {
    x: signs.x * a,
    y: signs.y * b,
  };
}

function busToolSize(options = state.pendingPartOptions || {}) {
  const bits = busToolBits(options);
  const vector = busToolVector(options);
  return {
    w: Math.max(2, Math.abs(vector.x) * Math.max(1, bits - 1) + 2),
    h: Math.max(2, Math.abs(vector.y) * Math.max(1, bits - 1) + 2),
  };
}

function rotatePointSvgDegrees(point, center, degrees) {
  const radians = (degrees * Math.PI) / 180;
  const dx = point.x - center.x;
  const dy = point.y - center.y;
  return {
    x: center.x + dx * Math.cos(radians) - dy * Math.sin(radians),
    y: center.y + dx * Math.sin(radians) + dy * Math.cos(radians),
  };
}

function rotateVectorSvgDegrees(vector, degrees) {
  const radians = (degrees * Math.PI) / 180;
  return {
    x: vector.x * Math.cos(radians) - vector.y * Math.sin(radians),
    y: vector.x * Math.sin(radians) + vector.y * Math.cos(radians),
  };
}

function busToolDotLocalPoints(options = state.pendingPartOptions || {}) {
  const bits = busToolBits(options);
  const vector = busToolVector(options);
  return Array.from({ length: bits }, (_, index) => ({
    x: index * vector.x,
    y: index * vector.y,
  }));
}

function busToolDotWorldPoints(center, options = state.pendingPartOptions || {}) {
  return busToolDotLocalPoints(options).map((local) => ({
    x: center.x + local.x,
    y: center.y + local.y,
  }));
}

function arrowGeometry(head, tail) {
  const scale = arrowScale();
  const dx = tail.x - head.x;
  const dy = tail.y - head.y;
  const length = Math.hypot(dx, dy) || 1;
  const ux = dx / length;
  const uy = dy / length;
  const nx = -uy;
  const ny = ux;
  const back = { x: head.x + ux * scale, y: head.y + uy * scale };
  return {
    head,
    tail,
    back,
    wingA: { x: back.x + nx * 0.5 * scale, y: back.y + ny * 0.5 * scale },
    wingB: { x: back.x - nx * 0.5 * scale, y: back.y - ny * 0.5 * scale },
  };
}

function orderArrowGeometry(head, tail) {
  return state.settings.orderArrowDirection === "msb-to-lsb"
    ? arrowGeometry(tail, head)
    : arrowGeometry(head, tail);
}

function busOrderArrowGeometry(lsb, msb) {
  return state.settings.orderArrowDirection === "msb-to-lsb"
    ? arrowGeometry(lsb, msb)
    : arrowGeometry(msb, lsb);
}

function busToolArrowGeometry(center, options = state.pendingPartOptions || {}) {
  const dots = busToolDotWorldPoints(center, options);
  const vector = busToolVector(options);
  const length = Math.hypot(vector.x, vector.y) || 1;
  const offset = { x: (-vector.y / length) * 1.5, y: (vector.x / length) * 1.5 };
  return busOrderArrowGeometry(
    { x: dots[0].x + offset.x, y: dots[0].y + offset.y },
    { x: dots[dots.length - 1].x + offset.x, y: dots[dots.length - 1].y + offset.y },
  );
}

function busLocalPoint(point, center, options = state.pendingPartOptions || {}) {
  return {
    x: point.x - center.x,
    y: point.y - center.y,
  };
}

function pointInBusTool(point, center, options = state.pendingPartOptions || {}) {
  return busToolDotWorldPoints(center, options).some((dot) => (
    Math.abs(point.x - dot.x) <= 0.55 && Math.abs(point.y - dot.y) <= 0.55
  ));
}

function busEndpointSortValue(endpoint, center, options = state.pendingPartOptions || {}) {
  const dots = busToolDotWorldPoints(center, options);
  let bestIndex = 0;
  let bestDistance = Infinity;
  dots.forEach((dot, index) => {
    const distance = Math.hypot(endpoint.point.x - dot.x, endpoint.point.y - dot.y);
    if (distance < bestDistance) {
      bestIndex = index;
      bestDistance = distance;
    }
  });
  return bestIndex;
}

function endpointsUnderBusTool(center, options = state.pendingPartOptions || {}) {
  const endpoints = [];
  const byNodePoint = new Map();
  const addEndpoint = (endpoint) => {
    const key = `dot:${busEndpointSortValue(endpoint, center, options)}`;
    const existingIndex = byNodePoint.get(key);
    if (existingIndex === undefined) {
      byNodePoint.set(key, endpoints.length);
      endpoints.push(endpoint);
      return;
    }
    const existing = endpoints[existingIndex];
    if (existing.kind === "pending-junction" && endpoint.kind === "port") {
      endpoints[existingIndex] = endpoint;
      return;
    }
    if (existing.direction === "output" && endpoint.direction === "input") endpoints[existingIndex] = endpoint;
  };
  for (const node of state.nodes) {
    for (const port of nodeInputs(node)) {
      const point = portPosition(node, port, "input");
      if (pointInBusTool(point, center, options)) {
        addEndpoint({ kind: "port", nodeId: node.id, port, direction: "input", point });
      }
    }
    for (const port of nodeOutputs(node)) {
      const point = portPosition(node, port, "output");
      if (pointInBusTool(point, center, options)) {
        addEndpoint({ kind: "port", nodeId: node.id, port, direction: "output", point });
      }
    }
  }
  for (const dot of busToolDotWorldPoints(center, options)) {
    const wire = findWireAtGridPoint(dot, null, 0.35);
    if (wire) addEndpoint({ kind: "pending-junction", wireId: wire.id, point: { ...dot }, bitLength: wireBitLength(wire) });
  }
  endpoints.sort((a, b) => busEndpointSortValue(a, center, options) - busEndpointSortValue(b, center, options));
  return endpoints;
}

function wireEndpointsForBusPair(a, b) {
  if (a.direction === "output" && b.direction === "input") return { from: a, to: b };
  if (b.direction === "output" && a.direction === "input") return { from: b, to: a };
  if (a.direction === "input" && !b.direction) return { from: b, to: a };
  if (b.direction === "input" && !a.direction) return { from: a, to: b };
  if (a.direction === "output" && !b.direction) return { from: a, to: b };
  if (b.direction === "output" && !a.direction) return { from: b, to: a };
  return { from: a, to: b };
}

function removeExistingInputWire(wires, endpoint) {
  if (endpoint.kind !== "port" || endpoint.direction !== "input") return wires;
  const node = findNode(endpoint.nodeId);
  if (node?.type === "JUNCTION") return wires;
  return wires.filter((wire) => {
    const to = normalizeEndpoint(wire.to, "input");
    return !(to.kind === "port" && to.nodeId === endpoint.nodeId && to.port === endpoint.port);
  });
}

function materializePendingJunctionEndpoint(endpoint, direction) {
  if (endpoint?.kind !== "pending-junction") return endpoint;
  const wire = findWire(endpoint.wireId) || findWireAtGridPoint(endpoint.point, null, 0.0001);
  if (!wire) return endpoint;
  return junctionEndpointForWirePoint(wire, endpoint.point, direction);
}

function cloneEndpointForWire(endpoint) {
  return endpoint?.kind === "port"
    ? { kind: "port", nodeId: endpoint.nodeId, port: endpoint.port, direction: endpoint.direction, ...(endpoint.bitLength ? { bitLength: endpoint.bitLength } : {}) }
    : { ...endpoint };
}

function finishBusWire(center) {
  if (!state.busStart) return;
  const options = state.pendingPartOptions || state.busStart.options || {};
  const bits = busToolBits(options);
  const endEndpoints = endpointsUnderBusTool(center, options);

  const undoSnapshot = editorSnapshot();
  const previousNodes = cloneData(state.nodes);
  const previousWires = cloneData(state.wires);
  const startEndpoints = [];
  const materializedEndEndpoints = [];
  for (let index = 0; index < bits; index += 1) {
    startEndpoints[index] = materializePendingJunctionEndpoint(state.busStart.endpoints[index], "output");
    materializedEndEndpoints[index] = materializePendingJunctionEndpoint(endEndpoints[index], "input");
  }

  let candidateWires = state.wires;
  const nextWires = [];
  const endDots = busToolDotWorldPoints(center, options);
  for (let index = 0; index < bits; index += 1) {
    const startEndpoint = startEndpoints[index];
    const endEndpoint = materializedEndEndpoints[index];
    if (!startEndpoint || !endEndpoint) continue;
    if (startEndpoint.kind !== "port" || endEndpoint.kind !== "port") continue;
    const pair = wireEndpointsForBusPair(startEndpoint, endEndpoint);
    const start = endpointPosition(pair.from, "output");
    const end = endpointPosition(pair.to, "input");
    if (!start || !end || samePoint(start, end)) continue;
    const bendDots = (state.busStart.bends || []).map((bend) => bend[index]).filter(Boolean);
    const fromStartSide = pair.from === startEndpoint;
    const routeDots = fromStartSide
      ? [state.busStart.dots[index], ...bendDots, endDots[index]]
      : [endDots[index], ...bendDots.reverse(), state.busStart.dots[index]];
    const points = routeDots
      .filter(Boolean)
      .filter((point, pointIndex, all) => (
        !samePoint(point, start)
        && !samePoint(point, end)
        && all.findIndex((item) => samePoint(item, point)) === pointIndex
      ));
    candidateWires = removeExistingInputWire(candidateWires, pair.to);
    nextWires.push({
      id: uid("wire"),
      from: cloneEndpointForWire(pair.from),
      to: cloneEndpointForWire(pair.to),
      points,
    });
  }
  state.wires = [...candidateWires, ...nextWires];
  const issues = analyzeCircuitIssues();
  const blockingIssue = firstBlockingCircuitIssue(issues);
  if (blockingIssue) {
    state.nodes = previousNodes;
    state.wires = previousWires;
    state.statusNotice = `Bus rejected: ${blockingIssue.message}`;
    state.busStart = null;
    render();
    return;
  }
  state.undoStack.push(undoSnapshot);
  if (state.undoStack.length > 100) state.undoStack.shift();
  state.redoStack = [];
  state.wires = [...candidateWires, ...nextWires];
  state.statusNotice = "";
  state.busStart = null;
  render();
}

function addBusBend(center) {
  if (!state.busStart) return;
  const dots = busToolDotWorldPoints(center, state.pendingPartOptions || state.busStart.options || {});
  state.busStart.bends = [...(state.busStart.bends || []), dots];
  state.statusNotice = "Bus bend added. Attach all bus dots to finish.";
  render();
}

function startBusWire(center) {
  const options = cloneData(state.pendingPartOptions || {});
  const bits = busToolBits(options);
  const endpoints = endpointsUnderBusTool(center, options);
  if (endpoints.length !== bits) {
    state.statusNotice = `Bus start needs exactly ${bits} attach points; found ${endpoints.length}.`;
    render();
    return;
  }
  state.busStart = { endpoints, center: { ...center }, options, dots: busToolDotWorldPoints(center, options), bends: [] };
  state.statusNotice = `Bus start captured ${bits} attach points. Click empty grid points to bend, or attach ${bits} points to finish.`;
  render();
}

function handleBusToolClick(center) {
  if (!state.busStart) {
    startBusWire(center);
    return;
  }
  const endpoints = endpointsUnderBusTool(center, state.pendingPartOptions || state.busStart.options || {});
  if (endpoints.length === busToolBits(state.pendingPartOptions || state.busStart.options || {})) finishBusWire(center);
  else addBusBend(center);
}

function rotateBusToolBySteps(steps) {
  const baseOptions = state.pendingPartOptions || state.busStart?.options || {};
  const options = {
    ...baseOptions,
    busVectorIndex: busToolVectorIndex(baseOptions) + steps,
  };
  state.pendingPartOptions = options;
  if (state.busStart) state.busStart.options = options;
  render();
}

function scaleBusTool(axis, delta) {
  const baseOptions = state.pendingPartOptions || state.busStart?.options || {};
  const signs = busVectorSignsFromIndex(busToolVectorIndex(baseOptions));
  const key = axis === "x" ? "busA" : "busB";
  const magnitude = axis === "x" ? busToolA(baseOptions) : busToolB(baseOptions);
  const signedValue = (axis === "x" ? signs.x : signs.y) * magnitude;
  const nextSignedValue = Math.min(32, Math.max(-32, signedValue + delta));
  const nextSigns = { ...signs, [axis]: Math.sign(nextSignedValue) };
  const nextIndex = busVectorIndexFromSigns(nextSigns);
  if (nextIndex === undefined) return;
  const nextMagnitude = nextSignedValue === 0 ? magnitude : Math.abs(nextSignedValue);
  const options = {
    ...baseOptions,
    busVectorIndex: nextIndex,
    [key]: Math.min(32, Math.max(1, nextMagnitude)),
  };
  state.pendingPartOptions = options;
  if (state.busStart) state.busStart.options = options;
  render();
}

function mirrorPendingPart(axis) {
  if (!state.pendingPart) return false;
  state.pendingPartOptions = {
    ...(state.pendingPartOptions || {}),
    [axis === "vertical" ? "mirrorX" : "mirrorY"]: !Boolean(state.pendingPartOptions?.[axis === "vertical" ? "mirrorX" : "mirrorY"]),
  };
  render();
  return true;
}

function rotatePendingPartByQuarters(quarters) {
  if (!state.pendingPart) return false;
  state.pendingPartOptions = {
    ...(state.pendingPartOptions || {}),
    rotation: normalizeRotationOption((state.pendingPartOptions?.rotation || 0) + quarters),
  };
  render();
  return true;
}

function placeCompositePart(type, center) {
  const isLogicStub = type === "TEST_INPUT_STUB" || type === "TEST_OUTPUT_STUB";
  const isCableStub = type === "CABLE_TEST_INPUT_STUB" || type === "CABLE_OUTPUT_STUB";
  if (!isLogicStub && !isCableStub) return false;
  recordUndo();
  if (isCableStub) {
    const bits = Math.min(32, Math.max(1, Math.round(Number(state.pendingPartOptions?.bits ?? 4))));
    const sourceOnLeft = type === "CABLE_TEST_INPUT_STUB";
    const pinCenter = sourceOnLeft
      ? { x: center.x - 5, y: center.y }
      : { x: center.x + 5, y: center.y };
    const partnerCenter = { x: center.x, y: center.y - 6 };
    const pin = createNodeAt("CABLE_PIN", pinCenter, { bits });
    const partner = createNodeAt(sourceOnLeft ? "CABLE_TEST_SWITCH" : "CABLE_OUTPUT", partnerCenter, {
      bits,
      data: 0,
    });
    const bend = sourceOnLeft
      ? { x: portPosition(partner, "out", "output").x, y: portPosition(pin, "in", "input").y }
      : { x: portPosition(partner, "in", "input").x, y: portPosition(pin, "out", "output").y };
    const wire = sourceOnLeft
      ? createWireBetween(partner, "out", pin, "in", [bend])
      : createWireBetween(pin, "out", partner, "in", [bend]);
    state.nodes.push(partner, pin);
    state.wires.push(wire);
    selectMany([partner.id, pin.id], [wire.id]);
    render();
    return true;
  }
  const partnerType = type === "TEST_INPUT_STUB" ? "TEST_INPUT" : "OUTPUT";
  const bend = { ...center };
  const pinCenter = type === "TEST_INPUT_STUB"
    ? { x: center.x - 2, y: center.y }
    : { x: center.x + 2, y: center.y };
  const partnerCenter = { x: center.x, y: center.y - 2 };
  const pin = createNodeAt("PIN", pinCenter);
  const partner = createNodeAt(partnerType, partnerCenter);
  const wire = type === "TEST_INPUT_STUB"
    ? createWireBetween(partner, "out", pin, "in", [bend])
    : createWireBetween(pin, "out", partner, "in", [bend]);
  state.nodes.push(partner, pin);
  state.wires.push(wire);
  selectMany([partner.id, pin.id], [wire.id]);
  render();
  return true;
}

function compositePreviewParts(type, center, options = {}) {
  const isLogicStub = type === "TEST_INPUT_STUB" || type === "TEST_OUTPUT_STUB";
  const isCableStub = type === "CABLE_TEST_INPUT_STUB" || type === "CABLE_OUTPUT_STUB";
  if (!isLogicStub && !isCableStub) return null;
  if (isLogicStub) {
    const sourceOnLeft = type === "TEST_INPUT_STUB";
    const pinCenter = sourceOnLeft
      ? { x: center.x - 2, y: center.y }
      : { x: center.x + 2, y: center.y };
    const partnerCenter = { x: center.x, y: center.y - 2 };
    const pin = {
      id: "pending-pin",
      type: "PIN",
      x: pinCenter.x - NODE_SIZES.PIN.w / 2,
      y: pinCenter.y - NODE_SIZES.PIN.h / 2,
      rotation: 0,
      mirrorX: false,
      mirrorY: false,
    };
    const partner = {
      id: "pending-logic-partner",
      type: sourceOnLeft ? "TEST_INPUT" : "OUTPUT",
      value: false,
      onColor: sourceOnLeft ? state.settings.inputHotColor : state.settings.outputHotColor,
      x: partnerCenter.x - NODE_SIZES.TEST_INPUT.w / 2,
      y: partnerCenter.y - NODE_SIZES.TEST_INPUT.h / 2,
      rotation: 0,
      mirrorX: false,
      mirrorY: false,
    };
    const bend = { ...center };
    const wire = sourceOnLeft
      ? createWireBetween(partner, "out", pin, "in", [bend])
      : createWireBetween(pin, "out", partner, "in", [bend]);
    wire.id = "pending-wire";
    wire.previewPoints = sourceOnLeft
      ? [portPosition(partner, "out", "output"), bend, portPosition(pin, "in", "input")]
      : [portPosition(pin, "out", "output"), bend, portPosition(partner, "in", "input")];
    return { nodes: [partner, pin], wires: [wire] };
  }
  const bits = Math.min(32, Math.max(1, Math.round(Number(options.bits ?? 4))));
  const sourceOnLeft = type === "CABLE_TEST_INPUT_STUB";
  const pinCenter = sourceOnLeft
    ? { x: center.x - 5, y: center.y }
    : { x: center.x + 5, y: center.y };
  const partnerCenter = { x: center.x, y: center.y - 6 };
  const pin = {
    id: "pending-cable-pin",
    type: "CABLE_PIN",
    bits,
    x: pinCenter.x - NODE_SIZES.CABLE_PIN.w / 2,
    y: pinCenter.y - NODE_SIZES.CABLE_PIN.h / 2,
    rotation: 0,
    mirrorX: false,
    mirrorY: false,
  };
  const partner = {
    id: "pending-cable-partner",
    type: sourceOnLeft ? "CABLE_TEST_SWITCH" : "CABLE_OUTPUT",
    bits,
    data: 0,
    x: partnerCenter.x - NODE_SIZES.CABLE_TEST_SWITCH.w / 2,
    y: partnerCenter.y - NODE_SIZES.CABLE_TEST_SWITCH.h / 2,
    rotation: 0,
    mirrorX: false,
    mirrorY: false,
  };
  const bend = sourceOnLeft
    ? { x: portPosition(partner, "out", "output").x, y: portPosition(pin, "in", "input").y }
    : { x: portPosition(partner, "in", "input").x, y: portPosition(pin, "out", "output").y };
  const wire = sourceOnLeft
    ? createWireBetween(partner, "out", pin, "in", [bend])
    : createWireBetween(pin, "out", partner, "in", [bend]);
  wire.id = "pending-cable-wire";
  wire.previewPoints = sourceOnLeft
    ? [portPosition(partner, "out", "output"), bend, portPosition(pin, "in", "input")]
    : [portPosition(pin, "out", "output"), bend, portPosition(partner, "in", "input")];
  return { nodes: [partner, pin], wires: [wire] };
}

function pendingPreviewNode(type, center, options = {}) {
  if (type === "TEST_INPUT_STUB" || type === "TEST_OUTPUT_STUB" || type === "CABLE_TEST_INPUT_STUB" || type === "CABLE_OUTPUT_STUB") return null;
  if (isMacroPart(type)) {
    const macro = findMacro(macroIdFromPart(type));
    const size = macro?.size || { w: 6, h: 4 };
    return {
      id: "pending-preview",
      type: "MACRO",
      macroId: macro?.id,
      sourceMacroId: macro?.id,
      size,
      x: center.x - size.w / 2,
      y: center.y - size.h / 2,
      rotation: normalizeRotationOption(options.rotation),
      mirrorX: Boolean(options.mirrorX),
      mirrorY: Boolean(options.mirrorY),
    };
  }
  const node = {
    id: "pending-preview",
    type,
    x: center.x,
    y: center.y,
  };
  if (type === "MULTI_INPUT" || isCableSourceType(type) || type === "CABLE_OUTPUT" || type === "CABLE_TO_BUS" || type === "BUS_TO_CABLE" || type === "MULTI_TEST_INPUT" || type === "MULTI_OUTPUT" || type === "MULTI_PIN" || type === "CABLE_PIN" || type === "BUS") {
    node.bits = Math.min(32, Math.max(1, Math.round(Number(options.bits ?? 4))));
  }
  if (isCableMergeSplitType(type)) node.segments = cableSegments({ segments: options.segments });
  if (isCableSourceType(type)) node.data = Math.max(0, Math.trunc(Number(options.data ?? 0)));
  if (type === "BUS") node.busDiagonal = Boolean(options.busDiagonal);
  node.rotation = normalizeRotationOption(options.rotation);
  node.mirrorX = Boolean(options.mirrorX);
  node.mirrorY = Boolean(options.mirrorY);
  if (type === "MULTI_INPUT" || type === "MULTI_TEST_INPUT") node.values = multiBitValues(node);
  if (type === "TEXT") applyTextDefaults(node);
  if (isFanInType(type)) node.fanIn = 2;
  const size = nodeSize(node);
  node.x = center.x - size.w / 2;
  node.y = center.y - size.h / 2;
  if (type === "MULTI_INPUT" || type === "MULTI_TEST_INPUT") {
    node.x = Math.round(node.x);
    node.y = Math.round(center.y - 2);
  }
  if (isCableSourceType(type) || type === "CABLE_OUTPUT") {
    node.x = Math.round(node.x);
    node.y = Math.round(center.y - 3);
  }
  if (type === "CABLE_TO_BUS" || type === "BUS_TO_CABLE" || isCableMergeSplitType(type)) {
    node.x = Math.round(node.x);
    node.y = Math.round(node.y);
  }
  if (type === "MULTI_OUTPUT" || type === "MULTI_PIN") {
    node.x = Math.round(node.x);
    node.y = Math.round(center.y - 2);
  }
  if (type !== "TEXT") snapNodePortsToGrid(node);
  return node;
}

async function placeNode(type, center, options = {}) {
  if (placeCompositePart(type, center)) return;
  const textValue = type === "TEXT"
    ? await requestTextValue({ title: "Text", value: state.settings.textDefaults.text || "Text" })
    : null;
  if (type === "TEXT" && textValue === null) return;
  recordUndo();
  const node = createNodeAt(type, center, options);
  if (type === "TEXT") node.text = textValue || state.settings.textDefaults.text || "Text";
  state.nodes.push(node);
  selectNode(node.id);
  render();
}

function updatePartButtons() {
  document.querySelectorAll("[data-add]").forEach((button) => {
    const active = button.dataset.add === state.pendingPart;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", active ? "true" : "false");
  });
}

function updateControlCursor(event = null) {
  const active = state.tool === "control"
    && event
    && !state.drag
    && Boolean(controlSwitchAtGridPoint(screenToGridRaw(event.clientX, event.clientY)));
  canvas.classList.toggle("control-action-cursor", active);
}

function partNeedsBitCount(type) {
  return type === "MULTI_INPUT" || isCableSourceType(type) || type === "CABLE_OUTPUT" || type === "CABLE_TEST_INPUT_STUB" || type === "CABLE_OUTPUT_STUB" || type === "CABLE_TO_BUS" || type === "BUS_TO_CABLE" || type === "MULTI_TEST_INPUT" || type === "MULTI_OUTPUT" || type === "MULTI_PIN" || type === "CABLE_PIN" || type === "BUS";
}

async function requestBitCount(type) {
  const value = await requestTextValue({
    title: `${partLabel(type)} bits`,
    value: "4",
    inputType: "number",
    min: "1",
    max: "32",
    step: "1",
    validate: (raw) => {
      const bits = Math.round(Number(raw));
      return Number.isFinite(bits) && bits >= 1 && bits <= 32
        ? ""
        : "값은 1 이상 32 이하의 정수여야 합니다.";
    },
  });
  if (value === null) return null;
  const bits = Math.round(Number(value));
  return bits;
}

function parseCableSegmentText(value) {
  const segments = String(value || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => Math.round(Number(part)));
  if (!segments.length || segments.some((bits) => !Number.isFinite(bits) || bits < 1 || bits > 32)) return null;
  const total = segments.reduce((sum, bits) => sum + bits, 0);
  if (total > 32) return null;
  return segments;
}

function cableSegmentValidationMessage(value) {
  const segments = String(value || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => Math.round(Number(part)));
  if (!segments.length) return "공백으로 구분된 1~32 사이의 정수를 하나 이상 입력해야 합니다.";
  if (segments.some((bits) => !Number.isFinite(bits) || bits < 1 || bits > 32)) {
    return "각 값은 1 이상 32 이하의 정수여야 합니다.";
  }
  const total = segments.reduce((sum, bits) => sum + bits, 0);
  if (total > 32) return "값들의 합은 32 이하여야 합니다.";
  return "";
}

async function requestCableSegments(type) {
  const value = await requestTextValue({
    title: `${partLabel(type)} segments`,
    value: "4 4",
    validate: cableSegmentValidationMessage,
  });
  if (value === null) return null;
  return parseCableSegmentText(value);
}

async function setPendingPart(type) {
  const options = {};
  if (isCableSourceType(type)) {
    const config = await requestCableSwitchConfig({ bits: 4, data: 0 });
    if (config === null) {
      clearPendingPart();
      return;
    }
    Object.assign(options, config);
  } else if (isCableMergeSplitType(type)) {
    const segments = await requestCableSegments(type);
    if (segments === null) {
      clearPendingPart();
      return;
    }
    options.segments = segments;
  } else if (partNeedsBitCount(type)) {
    const bits = await requestBitCount(type);
    if (bits === null) {
      clearPendingPart();
      return;
    }
    options.bits = bits;
  }
  state.pendingPart = type;
  state.pendingPartOptions = options;
  setTool("move", { keepPendingPart: true });
}

function clearPendingPart() {
  state.pendingPart = null;
  state.pendingPartOptions = null;
  state.busStart = null;
  updatePartButtons();
  updateControlCursor();
}

function setTool(tool, options = {}) {
  state.tool = tool;
  canvas.classList.toggle("control-mode", tool === "control");
  cancelWireDraft({ renderAfter: false });
  if (tool !== "move") state.drag = null;
  if (tool !== "wire") hideAttachLabel();
  if (!options.preserveSelection) clearSelection();
  if (!options.keepPendingPart) {
    state.pendingPart = null;
    state.pendingPartOptions = null;
    state.busStart = null;
  }
  document.querySelectorAll(".tool").forEach((button) => {
    const active = button.dataset.tool === tool;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", active ? "true" : "false");
  });
  updatePartButtons();
  updateControlCursor();
  render();
}

function modeLabel() {
  if (state.tool === "control") return "Control";
  if (state.tool === "wire") return "Wire";
  return "Move";
}

function zoomPercent() {
  return Math.round((state.zoom / DEFAULT_ZOOM) * 100);
}

function syncSettingsInputs(settings = settingsDraft) {
  const normalized = normalizeSettings(settings);
  wireHotColorInput.value = normalized.wireHotColor;
  wireColdColorInput.value = normalized.wireColdColor;
  inputHotColorInput.value = normalized.inputHotColor;
  outputHotColorInput.value = normalized.outputHotColor;
  xSignalColorInput.value = normalized.xSignalColor;
  zSignalColorInput.value = normalized.zSignalColor;
  orderArrowColorInput.value = normalized.orderArrowColor;
  dataArrowColorInput.value = normalized.dataArrowColor;
  orderArrowDirectionInput.value = normalized.orderArrowDirection;
  dataArrowDirectionInput.value = normalized.dataArrowDirection;
  arrowScaleInput.value = Number(normalized.arrowScale || 1);
  textDefaultContentInput.value = normalized.textDefaults.text;
  textDefaultSizeInput.value = Number(normalized.textDefaults.fontSize || 48);
  textDefaultColorInput.value = normalized.textDefaults.color && normalized.textDefaults.color.startsWith("#")
    ? normalized.textDefaults.color
    : DEFAULT_TEXT_SETTINGS.color;
  textDefaultFontInput.value = normalized.textDefaults.fontFamily || DEFAULT_TEXT_SETTINGS.fontFamily;
  textDefaultWidthInput.value = textBoxSize(normalized.textDefaults).w;
  textDefaultHeightInput.value = textBoxSize(normalized.textDefaults).h;
  textDefaultHorizontalInput.value = textBoxHorizontalAlign(normalized.textDefaults);
  textDefaultVerticalInput.value = textBoxVerticalAlign(normalized.textDefaults);
}

function saveSettingsToStorage() {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(normalizeSettings(state.settings)));
  } catch (error) {
    statusEl.textContent = "Settings could not be saved in this browser.";
  }
}

function updateSettingsDraft(mutator) {
  settingsDraft = normalizeSettings(settingsDraft);
  mutator(settingsDraft);
  settingsDraft = normalizeSettings(settingsDraft);
}

function openSettings() {
  settingsDraft = normalizeSettings(cloneData(state.settings));
  syncSettingsInputs(settingsDraft);
  bringModalToFront(settingsModal);
  settingsModal.hidden = false;
}

function closeSettings() {
  settingsDraft = normalizeSettings(cloneData(state.settings));
  settingsModal.hidden = true;
}

function saveSettings() {
  recordUndo();
  state.settings = normalizeSettings(cloneData(settingsDraft));
  saveSettingsToStorage();
  syncSettingsInputs(state.settings);
  settingsModal.hidden = true;
  render();
}

function startWire(endpoint) {
  state.statusNotice = "";
  state.wireStartSnapshot = null;
  if (endpoint?.kind === "pending-junction") {
    state.wireStartSnapshot = editorSnapshot();
    endpoint = materializePendingJunctionEndpoint(endpoint, "output");
  }
  state.wireStart = endpoint;
  state.wirePoints = [];
  render();
}

function cancelWireDraft({ renderAfter = true } = {}) {
  if (state.wireStartSnapshot) {
    state.nodes = cloneData(state.wireStartSnapshot.nodes || []);
    state.wires = cloneData(state.wireStartSnapshot.wires || []);
  }
  state.wireStartSnapshot = null;
  state.wireStart = null;
  state.wirePoints = [];
  if (renderAfter) render();
}

function addWireBend(point) {
  const lastPoint = state.wirePoints[state.wirePoints.length - 1] || endpointPosition(state.wireStart, "output");
  if (lastPoint && samePoint(lastPoint, point)) return;
  state.wirePoints.push({ ...point });
  render();
}

function finishWire(endpoint) {
  if (!state.wireStart) return;
  const undoSnapshot = state.wireStartSnapshot || editorSnapshot();
  const originalNodes = cloneData((state.wireStartSnapshot || { nodes: state.nodes }).nodes || []);
  const originalWires = cloneData((state.wireStartSnapshot || { wires: state.wires }).wires || []);
  const startEndpoint = materializePendingJunctionEndpoint(state.wireStart, "output");
  const endEndpoint = materializePendingJunctionEndpoint(endpoint, "input");
  const restoreBeforeFinish = () => {
    state.nodes = originalNodes;
    state.wires = originalWires;
  };
  const pair = wireEndpointsForBusPair(startEndpoint, endEndpoint);
  const start = endpointPosition(pair.from, "output");
  const end = endpointPosition(pair.to, "input");
  if (!start || !end || samePoint(start, end)) {
    restoreBeforeFinish();
    state.wireStartSnapshot = null;
    state.wireStart = null;
    state.wirePoints = [];
    render();
    return;
  }
  const fromBits = endpointBitLength(pair.from, "output");
  const toBits = endpointBitLength(pair.to, "input");
  if (fromBits !== toBits) {
    restoreBeforeFinish();
    state.statusNotice = `Wire rejected: cable length mismatch (${fromBits} bit -> ${toBits} bit)`;
    state.wireStartSnapshot = null;
    state.wireStart = null;
    state.wirePoints = [];
    render();
    return;
  }

  const normalizedEnd = normalizeEndpoint(pair.to, "input");
  const endNode = normalizedEnd.kind === "port" ? findNode(normalizedEnd.nodeId) : null;
  const routePoints = pair.from === startEndpoint
    ? state.wirePoints
    : [...state.wirePoints].reverse();
  const nextWire = {
    id: uid("wire"),
    from: { ...pair.from },
    to: { ...pair.to },
    points: routePoints.map((point) => ({ ...point })),
    bitLength: fromBits,
  };
  const splitWires = state.wires;
  let candidateWires = state.wires;
  if (normalizedEnd.kind === "port" && normalizedEnd.direction === "input" && endNode?.type !== "JUNCTION") {
    candidateWires = candidateWires.filter((wire) => {
      const to = normalizeEndpoint(wire.to, "input");
      return !(to.kind === "port" && to.nodeId === normalizedEnd.nodeId && to.port === normalizedEnd.port);
    });
  }
  state.wires = [...candidateWires, nextWire];
  const issues = analyzeCircuitIssues();
  state.wires = splitWires;
  const blockingIssue = firstBlockingCircuitIssue(issues);
  if (blockingIssue) {
    restoreBeforeFinish();
    state.statusNotice = `Wire rejected: ${blockingIssue.message}`;
    state.wireStartSnapshot = null;
    state.wireStart = null;
    state.wirePoints = [];
    render();
    return;
  }

  state.undoStack.push(undoSnapshot);
  if (state.undoStack.length > 100) state.undoStack.shift();
  state.redoStack = [];
  state.statusNotice = "";
  state.wires = [...candidateWires, nextWire];
  syncJunctionBitLengthsFromWires();
  state.wireStartSnapshot = null;
  state.wireStart = null;
  state.wirePoints = [];
  render();
}

function portEndpointFromNodePort(node, port, direction, bitLength = portBitLength(node, port)) {
  const endpoint = {
    kind: "port",
    nodeId: node.id,
    port,
    direction,
    bitLength: Math.max(1, Math.round(Number(bitLength || 1))),
  };
  if (node?.type === "MULTI_PIN") {
    const match = String(endpoint.port).match(/^bit(\d+)/);
    if (match) {
      const direction = state.wireStart ? "input" : "output";
      return {
        ...endpoint,
        port: `bit${match[1]}${direction === "input" ? "in" : "out"}`,
        direction,
      };
    }
  }
  return endpoint;
}

function portEndpointFromElement(port) {
  const node = findNode(port.dataset.nodeId);
  if (!node) {
    return {
      kind: "port",
      nodeId: port.dataset.nodeId,
      port: port.dataset.port,
      direction: port.dataset.direction,
      bitLength: Math.max(1, Math.round(Number(port.dataset.bitLength || 1))),
    };
  }
  return portEndpointFromNodePort(
    node,
    port.dataset.port,
    port.dataset.direction,
    Math.max(1, Math.round(Number(port.dataset.bitLength || 1))),
  );
}

function portEndpointAtGridPoint(point) {
  let best = null;
  for (const node of state.nodes) {
    const candidates = [
      ...nodeInputs(node).map((port) => ({ port, direction: "input" })),
      ...nodeOutputs(node).map((port) => ({ port, direction: "output" })),
    ];
    for (const candidate of candidates) {
      const position = portPosition(node, candidate.port, candidate.direction);
      const bitLength = portBitLength(node, candidate.port);
      const tolerance = bitLength > 1 ? 0.62 : 0.35;
      const distance = Math.hypot(point.x - position.x, point.y - position.y);
      if (distance > tolerance || (best && distance >= best.distance)) continue;
      best = {
        distance,
        endpoint: portEndpointFromNodePort(node, candidate.port, candidate.direction, bitLength),
      };
    }
  }
  return best?.endpoint || null;
}

function controlSwitchAtGridPoint(point) {
  let best = null;
  for (const node of state.nodes) {
    if (!(node.type === "INPUT" || node.type === "TEST_INPUT" || node.type === "MULTI_INPUT" || node.type === "MULTI_TEST_INPUT")) continue;
    const size = nodeSize(node);
    const bitCount = node.type === "MULTI_INPUT" || node.type === "MULTI_TEST_INPUT" ? multiBitCount(node) : 1;
    for (let index = 0; index < bitCount; index += 1) {
      const local = bitCount === 1
        ? { x: size.w / 2, y: size.h / 2 }
        : { x: 1 + index * 2, y: 2 };
      const transformed = transformLocalPoint(local, node, size);
      const center = { x: node.x + transformed.x, y: node.y + transformed.y };
      const distance = Math.hypot(point.x - center.x, point.y - center.y);
      if (distance > 0.62 || (best && distance >= best.distance)) continue;
      best = {
        distance,
        node,
        bitIndex: bitCount === 1 ? null : index,
      };
    }
  }
  return best ? { node: best.node, bitIndex: best.bitIndex } : null;
}

function attachCandidateFromEvent(event) {
  if (state.tool !== "wire") return null;
  const port = event.target.closest?.(".port");
  if (port) return portEndpointFromElement(port);
  const pointRaw = screenToGridRaw(event.clientX, event.clientY);
  const pointPort = portEndpointAtGridPoint(pointRaw);
  if (pointPort) return pointPort;
  const point = { x: Math.round(pointRaw.x), y: Math.round(pointRaw.y) };
  const wire = findWireAtGridPoint(point, null, 0.35);
  return wire ? { kind: "pending-junction", wireId: wire.id, point, bitLength: wireBitLength(wire) } : null;
}

function updateAttachLabel(event) {
  if (state.pendingPart === "BUS" && state.tool === "move") {
    const point = screenToGrid(event.clientX, event.clientY);
    const options = state.busStart?.options || state.pendingPartOptions || {};
    const count = endpointsUnderBusTool(point, options).length;
    const bits = busToolBits(options);
    state.attachCandidate = null;
    if (!count) {
      attachLabel.hidden = true;
      return null;
    }
    const shellRect = canvas.parentElement.getBoundingClientRect();
    attachLabel.textContent = `attach ${count}/${bits}`;
    attachLabel.style.left = `${event.clientX - shellRect.left + 12}px`;
    attachLabel.style.top = `${event.clientY - shellRect.top + 12}px`;
    attachLabel.hidden = false;
    return null;
  }
  const candidate = attachCandidateFromEvent(event);
  state.attachCandidate = candidate;
  if (!candidate) {
    attachLabel.hidden = true;
    return null;
  }
  attachLabel.textContent = "attach";
  const shellRect = canvas.parentElement.getBoundingClientRect();
  attachLabel.style.left = `${event.clientX - shellRect.left + 12}px`;
  attachLabel.style.top = `${event.clientY - shellRect.top + 12}px`;
  attachLabel.hidden = false;
  return candidate;
}

function hideAttachLabel() {
  state.attachCandidate = null;
  attachLabel.hidden = true;
}

function startSelectionDrag(pointerId, gridPoint, startClient) {
  const selectedNodes = state.selectedNodeIds.map((id) => {
    const node = findNode(id);
    return node ? { id, x: node.x, y: node.y } : null;
  }).filter(Boolean);
  const selectedWires = state.selectedWireIds.map((id) => {
    const wire = findWire(id);
    return wire ? {
      id,
      points: (wire.points || []).map((point) => ({ ...point })),
      from: normalizeEndpoint(wire.from, "output").kind === "wire" ? { ...wire.from.point } : null,
      to: normalizeEndpoint(wire.to, "input").kind === "wire" ? { ...wire.to.point } : null,
    } : null;
  }).filter(Boolean);
  state.drag = {
    kind: "selection",
    pointerId,
    startGrid: { ...gridPoint },
    startClient,
    moved: false,
    nodes: selectedNodes,
    wires: selectedWires,
    rotationCenter: state.selectionRotationCenter ? { ...state.selectionRotationCenter } : null,
  };
  canvas.setPointerCapture(pointerId);
}

function moveSelectionDrag(drag, gridPoint) {
  const dx = gridPoint.x - drag.startGrid.x;
  const dy = gridPoint.y - drag.startGrid.y;
  for (const item of drag.nodes) {
    const node = findNode(item.id);
    if (node) {
      node.x = item.x + dx;
      node.y = item.y + dy;
    }
  }
  for (const item of drag.wires) {
    const wire = findWire(item.id);
    if (!wire) continue;
    wire.points = item.points.map((point) => ({ x: point.x + dx, y: point.y + dy }));
    if (item.from && normalizeEndpoint(wire.from, "output").kind === "wire") wire.from.point = { x: item.from.x + dx, y: item.from.y + dy };
    if (item.to && normalizeEndpoint(wire.to, "input").kind === "wire") wire.to.point = { x: item.to.x + dx, y: item.to.y + dy };
  }
  if (drag.rotationCenter) {
    state.selectionRotationCenter = {
      x: drag.rotationCenter.x + dx,
      y: drag.rotationCenter.y + dy,
    };
  }
}

function selectedRotationBounds() {
  const bounds = [];
  for (const id of state.selectedNodeIds) {
    const node = findNode(id);
    if (node) bounds.push(nodeBounds(node));
  }
  for (const id of state.selectedWireIds) {
    const wire = findWire(id);
    const item = wire ? wireBounds(wire) : null;
    if (item) bounds.push(item);
  }
  if (!bounds.length) return null;
  return bounds.reduce((acc, item) => ({
    minX: Math.min(acc.minX, item.minX),
    minY: Math.min(acc.minY, item.minY),
    maxX: Math.max(acc.maxX, item.maxX),
    maxY: Math.max(acc.maxY, item.maxY),
  }));
}

function updateSelectionRotationCenter() {
  if (state.selectedNodeIds.length === 1 && state.selectedWireIds.length === 0) {
    const node = findNode(state.selectedNodeIds[0]);
    if (node) {
      const local = transformLocalPoint(localRotationCenter(node), node, nodeSize(node));
      state.selectionRotationCenter = {
        x: Math.round(node.x + local.x),
        y: Math.round(node.y + local.y),
      };
      return;
    }
  }
  const bounds = selectedRotationBounds();
  state.selectionRotationCenter = bounds
    ? {
      x: Math.round((bounds.minX + bounds.maxX) / 2),
      y: Math.round((bounds.minY + bounds.maxY) / 2),
    }
    : null;
}

function currentSelectionRotationCenter() {
  if (!state.selectionRotationCenter) updateSelectionRotationCenter();
  return state.selectionRotationCenter;
}

function snapPointToGrid(point) {
  return { x: Math.round(point.x), y: Math.round(point.y) };
}

function snapNodePortsToGrid(node) {
  const ports = [
    ...nodeInputs(node).map((port) => ({ port, direction: "input" })),
    ...nodeOutputs(node).map((port) => ({ port, direction: "output" })),
  ];
  if (!ports.length) {
    node.x = Math.round(node.x);
    node.y = Math.round(node.y);
    return;
  }
  const first = portPosition(node, ports[0].port, ports[0].direction);
  const dx = Math.round(first.x) - first.x;
  const dy = Math.round(first.y) - first.y;
  node.x += dx;
  node.y += dy;
}

function rotateEndpointPoint(endpoint, direction, center, quarters = 1) {
  const normalized = normalizeEndpoint(endpoint, direction);
  if (normalized.kind !== "wire" || !endpoint.point) return;
  endpoint.point = snapPointToGrid(rotatePointByQuarters(endpoint.point, center, quarters));
}

function mirrorPoint(point, center, axis) {
  return axis === "vertical"
    ? { x: center.x * 2 - point.x, y: point.y }
    : { x: point.x, y: center.y * 2 - point.y };
}

function mirrorEndpointPoint(endpoint, direction, center, axis) {
  const normalized = normalizeEndpoint(endpoint, direction);
  if (normalized.kind !== "wire" || !endpoint.point) return;
  endpoint.point = snapPointToGrid(mirrorPoint(endpoint.point, center, axis));
}

function rotateSelectionByQuarters(quarters) {
  if (!selectedCount()) return;
  const center = currentSelectionRotationCenter();
  if (!center) return;
  recordUndo();
  for (const id of state.selectedNodeIds) {
    const node = findNode(id);
    if (!node) continue;
    const size = nodeSize(node);
    const localBefore = transformLocalPoint(localRotationCenter(node, size), node, size);
    const nodeCenter = { x: node.x + localBefore.x, y: node.y + localBefore.y };
    const rotatedCenter = rotatePointByQuarters(nodeCenter, center, quarters);
    node.rotation = rotationQuarter(node) + quarters;
    const localAfter = transformLocalPoint(localRotationCenter(node, size), node, size);
    node.x = rotatedCenter.x - localAfter.x;
    node.y = rotatedCenter.y - localAfter.y;
    snapNodePortsToGrid(node);
  }
  for (const id of state.selectedWireIds) {
    const wire = findWire(id);
    if (!wire) continue;
    wire.points = (wire.points || []).map((point) => snapPointToGrid(rotatePointByQuarters(point, center, quarters)));
    rotateEndpointPoint(wire.from, "output", center, quarters);
    rotateEndpointPoint(wire.to, "input", center, quarters);
  }
  render();
}

function rotateSelectionCounterClockwise() {
  rotateSelectionByQuarters(1);
}

function toggleSelectedBusDiagonal() {
  const busNodes = state.selectedNodeIds
    .map((id) => findNode(id))
    .filter((node) => node?.type === "BUS");
  if (!busNodes.length) return;
  recordUndo();
  for (const node of busNodes) {
    const oldSize = nodeSize(node);
    const center = {
      x: node.x + oldSize.w / 2,
      y: node.y + oldSize.h / 2,
    };
    node.busDiagonal = !node.busDiagonal;
    const nextSize = nodeSize(node);
    node.x = center.x - nextSize.w / 2;
    node.y = center.y - nextSize.h / 2;
    snapNodePortsToGrid(node);
  }
  render();
}

function mirrorSelection(axis) {
  if (!selectedCount()) return;
  const center = currentSelectionRotationCenter();
  if (!center) return;
  recordUndo();
  for (const id of state.selectedNodeIds) {
    const node = findNode(id);
    if (!node) continue;
    const size = nodeSize(node);
    const localBefore = transformLocalPoint(localRotationCenter(node, size), node, size);
    const nodeCenter = { x: node.x + localBefore.x, y: node.y + localBefore.y };
    const mirroredCenter = mirrorPoint(nodeCenter, center, axis);
    if (axis === "vertical") node.mirrorX = !node.mirrorX;
    if (axis === "horizontal") node.mirrorY = !node.mirrorY;
    const localAfter = transformLocalPoint(localRotationCenter(node, size), node, size);
    node.x = mirroredCenter.x - localAfter.x;
    node.y = mirroredCenter.y - localAfter.y;
    snapNodePortsToGrid(node);
  }
  for (const id of state.selectedWireIds) {
    const wire = findWire(id);
    if (!wire) continue;
    wire.points = (wire.points || []).map((point) => snapPointToGrid(mirrorPoint(point, center, axis)));
    mirrorEndpointPoint(wire.from, "output", center, axis);
    mirrorEndpointPoint(wire.to, "input", center, axis);
  }
  render();
}

function endpointTouchesNode(endpoint, nodeId, direction) {
  const normalized = normalizeEndpoint(endpoint, direction);
  return normalized.kind === "port" && normalized.nodeId === nodeId;
}

function cloneData(data) {
  return JSON.parse(JSON.stringify(data));
}

function resetTemplateState() {
  state.template.polygon = [];
  state.template.draft = [];
  state.template.pins = [];
  state.template.texts = [];
  state.template.tool = "select";
  state.template.pendingOptions = {};
  state.template.sourcePinId = null;
  state.template.selected = null;
  state.template.pointer = null;
  state.template.clipboard = null;
  state.template.undoStack = [];
  state.template.redoStack = [];
  state.template.drag = null;
  state.template.rotateKeyDown = false;
  state.template.view = { x: 0, y: 0, zoom: DEFAULT_ZOOM };
}

function templateWorkspacePayload() {
  return {
    polygon: cloneData(state.template.polygon || []),
    draft: cloneData(state.template.draft || []),
    pins: cloneData(state.template.pins || []),
    texts: cloneData(state.template.texts || []),
    tool: state.template.tool || "select",
    pendingOptions: cloneData(state.template.pendingOptions || {}),
    sourcePinId: state.template.sourcePinId || null,
    multiPinBits: state.template.multiPinBits || null,
    cablePinBits: state.template.cablePinBits || null,
  };
}

function restoreTemplateWorkspace(payload = null) {
  resetTemplateState();
  if (!payload || typeof payload !== "object") return;
  state.template.polygon = cloneData(Array.isArray(payload.polygon) ? payload.polygon : []);
  state.template.draft = cloneData(Array.isArray(payload.draft) ? payload.draft : []);
  state.template.pins = cloneData(Array.isArray(payload.pins) ? payload.pins : []).map(normalizeTemplatePin);
  state.template.texts = cloneData(Array.isArray(payload.texts) ? payload.texts : []);
  state.template.tool = typeof payload.tool === "string" ? payload.tool : "select";
  state.template.pendingOptions = cloneData(payload.pendingOptions || {});
  state.template.sourcePinId = payload.sourcePinId || null;
  state.template.multiPinBits = payload.multiPinBits || state.template.multiPinBits;
  state.template.cablePinBits = payload.cablePinBits || state.template.cablePinBits;
}

function templateWorkspaceHasContent() {
  return state.template.polygon.length
    || state.template.draft.length
    || state.template.pins.length
    || state.template.texts.length;
}

function editorSnapshot() {
  return cloneData({
    designName: state.designName,
    nodes: state.nodes,
    wires: state.wires,
    settings: state.settings,
    macros: state.macros,
    selectedNodeIds: state.selectedNodeIds,
    selectedWireIds: state.selectedWireIds,
    selectionRotationCenter: state.selectionRotationCenter,
  });
}

function restoreSnapshot(snapshot) {
  state.designName = snapshot.designName || state.designName;
  state.nodes = cloneData(snapshot.nodes || []);
  state.wires = cloneData(snapshot.wires || []);
  state.settings = { ...state.settings, ...(snapshot.settings || {}) };
  state.macros = cloneData(snapshot.macros || []);
  state.macroInstanceValues = new Map();
  selectMany(snapshot.selectedNodeIds || [], snapshot.selectedWireIds || []);
  if (Object.prototype.hasOwnProperty.call(snapshot, "selectionRotationCenter")) {
    state.selectionRotationCenter = snapshot.selectionRotationCenter ? { ...snapshot.selectionRotationCenter } : null;
  }
  renderMacroParts();
  syncSettingsInputs();
  hideFanInMenu();
  hideAttachLabel();
  render();
}

function recordUndo() {
  state.undoStack.push(editorSnapshot());
  if (state.undoStack.length > 100) state.undoStack.shift();
  state.redoStack = [];
}

function undo() {
  if (!state.undoStack.length) return;
  state.redoStack.push(editorSnapshot());
  restoreSnapshot(state.undoStack.pop());
}

function redo() {
  if (!state.redoStack.length) return;
  state.undoStack.push(editorSnapshot());
  restoreSnapshot(state.redoStack.pop());
}

function templatePointFromEvent(event) {
  const local = templateRawPointFromEvent(event);
  return {
    x: Math.round(local.x / GRID),
    y: Math.round(local.y / GRID),
  };
}

function templateRawPointFromEvent(event) {
  const svgPoint = templateCanvas.createSVGPoint();
  svgPoint.x = event.clientX;
  svgPoint.y = event.clientY;
  const local = svgPoint.matrixTransform(templateCanvas.getScreenCTM().inverse());
  return local;
}

function templateViewCenterPoint() {
  const rect = templateCanvas.getBoundingClientRect();
  const width = (rect.width || TEMPLATE_VIEW_W * GRID) / state.template.view.zoom;
  const height = (rect.height || TEMPLATE_VIEW_H * GRID) / state.template.view.zoom;
  return {
    x: Math.round((state.template.view.x + width / 2) / GRID),
    y: Math.round((state.template.view.y + height / 2) / GRID),
  };
}

function templateBounds() {
  const points = state.template.polygon;
  if (!points.length) return null;
  return {
    minX: Math.min(...points.map((point) => point.x)),
    minY: Math.min(...points.map((point) => point.y)),
    maxX: Math.max(...points.map((point) => point.x)),
    maxY: Math.max(...points.map((point) => point.y)),
  };
}

function pointInPolygonOrOnEdge(point, polygon) {
  if (polygon.length < 3) return false;
  for (let index = 0; index < polygon.length; index += 1) {
    const a = polygon[index];
    const b = polygon[(index + 1) % polygon.length];
    if (pointOnSegment(point, a, b, 0.0001)) return true;
  }
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i, i += 1) {
    const pi = polygon[i];
    const pj = polygon[j];
    if (((pi.y > point.y) !== (pj.y > point.y))
      && point.x < ((pj.x - pi.x) * (point.y - pi.y)) / (pj.y - pi.y) + pi.x) {
      inside = !inside;
    }
  }
  return inside;
}

function templatePinOutsideBody(pin) {
  return state.template.polygon.length >= 3 && !pointInPolygonOrOnEdge({ x: pin.x, y: pin.y }, state.template.polygon);
}

function inferCircuitPinDirection(source, sourcePort = "") {
  if (!source) return "";
  const graph = buildConnectivity();
  const sourceRoots = source.type === "MULTI_PIN" && sourcePort
    ? new Set([
      graph.find(portKey(source.id, `${sourcePort}in`)),
      graph.find(portKey(source.id, `${sourcePort}out`)),
    ])
    : new Set([
      graph.find(portKey(source.id, "in")),
      graph.find(portKey(source.id, "out")),
    ]);
  let reachesConsumer = false;
  let reachesDriver = false;

  for (const node of state.nodes) {
    if (node.id === source.id || ["INPUT", "TEST_INPUT", "OUTPUT", "CABLE_OUTPUT", "PIN", "CABLE_PIN", "JUNCTION", "TEXT"].includes(node.type)) continue;
    for (const input of nodeInputs(node)) {
      if (sourceRoots.has(graph.find(portKey(node.id, input)))) reachesConsumer = true;
    }
    for (const output of nodeOutputs(node)) {
      if (sourceRoots.has(graph.find(portKey(node.id, output)))) reachesDriver = true;
    }
  }

  if (reachesDriver && !reachesConsumer) return "output";
  if (reachesConsumer && !reachesDriver) return "input";
  return "";
}

function inferTemplatePinDirection(pin, source, bounds) {
  const graphDirection = inferCircuitPinDirection(source, pin.sourcePort);
  if (graphDirection) return graphDirection;
  const centerX = (bounds.minX + bounds.maxX) / 2;
  return pin.x >= centerX ? "output" : "input";
}

function openTemplateEditor(sourcePinId = null) {
  state.template.sourcePinId = sourcePinId;
  state.template.selected = null;
  state.template.pendingOptions = {};
  state.template.rotateKeyDown = false;
  if (!templateWorkspaceHasContent()) restoreTemplateFromCachedMacro();
  state.template.view = { x: 0, y: 0, zoom: DEFAULT_ZOOM };
  bringModalToFront(templateModal);
  templateModal.hidden = false;
  updateTemplateViewBox();
  renderTemplateEditor();
}

function restoreTemplateFromCachedMacro() {
  const macro = rootHiddenMacro();
  if (!macro) return;
  if (macro.template) {
    state.template.polygon = cloneData(macro.template.polygon || []);
    state.template.draft = [];
    state.template.pins = cloneData(macro.template.pins || []).map(normalizeTemplatePin);
    state.template.texts = cloneData(macro.template.texts || []);
  } else {
    state.template.polygon = cloneData(macro.polygon || []);
    state.template.pins = (macro.pins || []).map((pin) => ({
      id: uid("template-pin"),
      label: pin.label || "",
      direction: pin.direction || "input",
      kind: Number(pin.bitLength || 1) > 1 ? "cable" : "pin",
      bitLength: Math.max(1, Math.round(Number(pin.bitLength || 1))),
      x: pin.x,
      y: pin.y,
      sourcePinId: pin.internalNodeId || null,
      sourcePort: pin.internalPort || "",
    })).map(normalizeTemplatePin);
    state.template.texts = cloneData(macro.texts || []);
  }
  state.template.draft = [];
  state.template.tool = "select";
  state.template.pendingOptions = {};
  state.template.selected = null;
  state.template.clipboard = null;
  state.template.undoStack = [];
  state.template.redoStack = [];
  state.template.drag = null;
}

function closeTemplateEditor() {
  state.template.rotateKeyDown = false;
  state.template.pendingOptions = {};
  if (templateCanAutoCache()) {
    const macro = macroFromCircuit({ silent: true });
    if (macro) {
    addMacroDefinition(macro, { paletteVisible: false });
    statusEl.textContent = `Cached macro in this design: ${macro.name}`;
    }
  }
  templateModal.hidden = true;
  render();
}

function selectTemplateObject(selection) {
  state.template.selected = selection;
  renderTemplateEditor();
}

function templateSelectionItems(selection = state.template.selected) {
  if (!selection) return [];
  return selection.type === "multi" ? selection.items || [] : [selection];
}

function expandTemplateMultiPinItems(items) {
  const expanded = [];
  const seen = new Set();
  const addItem = (item) => {
    const key = `${item.type}:${item.id || ""}`;
    if (seen.has(key)) return;
    seen.add(key);
    expanded.push(item);
  };
  for (const item of items) {
    if (item.type !== "pin") {
      addItem(item);
      continue;
    }
    const pin = state.template.pins.find((candidate) => candidate.id === item.id);
    if (!pin?.multiPinGroup) {
      addItem(item);
      continue;
    }
    for (const groupPin of state.template.pins.filter((candidate) => candidate.multiPinGroup === pin.multiPinGroup)) {
      addItem({ type: "pin", id: groupPin.id });
    }
  }
  return expanded;
}

function templateSelectionFromItems(items) {
  const expanded = expandTemplateMultiPinItems(items);
  return expanded.length > 1 ? { type: "multi", items: expanded } : expanded[0] || null;
}

function templateSelectionHas(type, id = null) {
  return templateSelectionItems().some((item) => item.type === type && (id === null || item.id === id));
}

function deleteSelectedTemplateObject() {
  const selected = state.template.selected;
  if (!selected) return;
  recordTemplateUndo();
  const items = templateSelectionItems(selected);
  if (items.some((item) => item.type === "polygon")) {
    state.template.polygon = [];
    state.template.draft = [];
  }
  const pinIds = new Set(items.filter((item) => item.type === "pin").map((item) => item.id));
  const textIds = new Set(items.filter((item) => item.type === "text").map((item) => item.id));
  state.template.pins = state.template.pins.filter((pin) => !pinIds.has(pin.id));
  state.template.texts = state.template.texts.filter((text) => !textIds.has(text.id));
  state.template.selected = null;
  renderTemplateEditor();
}

function cancelTemplateAction() {
  state.template.tool = "select";
  state.template.pendingOptions = {};
  state.template.draft = [];
  state.template.drag = null;
  state.template.pointer = null;
  state.template.rotateKeyDown = false;
  hideFanInMenu();
  renderTemplateEditor();
}

function templateSnapshot() {
  return cloneData({
    polygon: state.template.polygon,
    draft: state.template.draft,
    pins: state.template.pins,
    texts: state.template.texts,
    selected: state.template.selected,
  });
}

function restoreTemplateSnapshot(snapshot) {
  state.template.polygon = cloneData(snapshot.polygon || []);
  state.template.draft = cloneData(snapshot.draft || []);
  state.template.pins = cloneData(snapshot.pins || []);
  state.template.texts = cloneData(snapshot.texts || []);
  state.template.selected = cloneData(snapshot.selected || null);
  renderTemplateEditor();
}

function recordTemplateUndo() {
  state.template.undoStack.push(templateSnapshot());
  if (state.template.undoStack.length > 100) state.template.undoStack.shift();
  state.template.redoStack = [];
}

function undoTemplate() {
  if (!state.template.undoStack.length) return;
  state.template.redoStack.push(templateSnapshot());
  restoreTemplateSnapshot(state.template.undoStack.pop());
}

function redoTemplate() {
  if (!state.template.redoStack.length) return;
  state.template.undoStack.push(templateSnapshot());
  restoreTemplateSnapshot(state.template.redoStack.pop());
}

function selectedTemplateData() {
  const selected = state.template.selected;
  if (!selected) return null;
  if (selected.type === "multi") {
    const items = templateSelectionItems(selected);
    return {
      type: "multi",
      polygon: items.some((item) => item.type === "polygon") ? cloneData(state.template.polygon) : null,
      pins: items
        .filter((item) => item.type === "pin")
        .map((item) => state.template.pins.find((pin) => pin.id === item.id))
        .filter(Boolean)
        .map(cloneData),
      texts: items
        .filter((item) => item.type === "text")
        .map((item) => state.template.texts.find((text) => text.id === item.id))
        .filter(Boolean)
        .map(cloneData),
    };
  }
  if (selected.type === "polygon") return { type: "polygon", polygon: cloneData(state.template.polygon) };
  if (selected.type === "pin") {
    const pin = state.template.pins.find((item) => item.id === selected.id);
    return pin ? { type: "pin", pin: cloneData(pin) } : null;
  }
  if (selected.type === "text") {
    const text = state.template.texts.find((item) => item.id === selected.id);
    return text ? { type: "text", text: cloneData(text) } : null;
  }
  return null;
}

function copyTemplateSelection() {
  const data = selectedTemplateData();
  if (data) state.template.clipboard = data;
}

function pasteTemplateSelection() {
  if (!state.template.clipboard) return;
  recordTemplateUndo();
  const data = cloneData(state.template.clipboard);
  if (data.type === "polygon") {
    if (state.template.polygon.length) {
      templateStatus.textContent = "매크로 몸체 다각형은 파일당 최대 1개만 만들 수 있습니다.";
      return;
    }
    state.template.polygon = data.polygon.map((point) => ({ x: point.x + 1, y: point.y + 1 }));
    state.template.selected = { type: "polygon" };
  }
  if (data.type === "pin") {
    const pin = { ...data.pin, id: uid("template-pin"), x: data.pin.x + 1, y: data.pin.y + 1, sourcePinId: null };
    state.template.pins.push(pin);
    state.template.selected = { type: "pin", id: pin.id };
  }
  if (data.type === "text") {
    const text = { ...data.text, id: uid("template-text"), x: data.text.x + 1, y: data.text.y + 1 };
    state.template.texts.push(text);
    state.template.selected = { type: "text", id: text.id };
  }
  if (data.type === "multi") {
    const items = [];
    const groupIds = new Map();
    if (data.polygon) {
      if (state.template.polygon.length) {
        templateStatus.textContent = "留ㅽ겕濡?紐몄껜 ?ㅺ컖?뺤? ?뚯씪??理쒕? 1媛쒕쭔 留뚮뱾 ???덉뒿?덈떎.";
        return;
      }
      state.template.polygon = data.polygon.map((point) => ({ x: point.x + 1, y: point.y + 1 }));
      items.push({ type: "polygon" });
    }
    for (const sourcePin of data.pins || []) {
      let groupId = "";
      if (sourcePin.multiPinGroup) {
        if (!groupIds.has(sourcePin.multiPinGroup)) groupIds.set(sourcePin.multiPinGroup, uid("template-multipin"));
        groupId = groupIds.get(sourcePin.multiPinGroup);
      }
      const pin = {
        ...sourcePin,
        id: uid("template-pin"),
        x: sourcePin.x + 1,
        y: sourcePin.y + 1,
        sourcePinId: null,
        sourcePort: "",
        multiPinGroup: groupId || undefined,
      };
      state.template.pins.push(pin);
      items.push({ type: "pin", id: pin.id });
    }
    for (const sourceText of data.texts || []) {
      const text = { ...sourceText, id: uid("template-text"), x: sourceText.x + 1, y: sourceText.y + 1 };
      state.template.texts.push(text);
      items.push({ type: "text", id: text.id });
    }
    state.template.selected = templateSelectionFromItems(items);
  }
  renderTemplateEditor();
}

function cutTemplateSelection() {
  if (!state.template.selected) return;
  copyTemplateSelection();
  deleteSelectedTemplateObject();
}

function moveSelectedTemplateObject(dx, dy) {
  const selected = state.template.selected;
  if (!selected) return;
  const items = templateSelectionItems(selected);
  if (items.some((item) => item.type === "polygon")) {
    state.template.polygon = state.template.polygon.map((point) => ({ x: point.x + dx, y: point.y + dy }));
  }
  for (const selectedPin of items.filter((item) => item.type === "pin")) {
    const pin = state.template.pins.find((item) => item.id === selectedPin.id);
    if (pin) {
      pin.x += dx;
      pin.y += dy;
    }
  }
  for (const selectedText of items.filter((item) => item.type === "text")) {
    const text = state.template.texts.find((item) => item.id === selectedText.id);
    if (text) {
      text.x += dx;
      text.y += dy;
    }
  }
}

function selectedTemplateBounds() {
  const bounds = templateSelectionItems()
    .map((item) => templateObjectBoundsGrid(item))
    .filter(Boolean);
  if (!bounds.length) return null;
  return bounds.reduce((acc, item) => ({
    minX: Math.min(acc.minX, item.minX),
    minY: Math.min(acc.minY, item.minY),
    maxX: Math.max(acc.maxX, item.maxX),
    maxY: Math.max(acc.maxY, item.maxY),
  }));
}

function gridPointInBounds(point, bounds) {
  return point.x >= bounds.minX
    && point.x <= bounds.maxX
    && point.y >= bounds.minY
    && point.y <= bounds.maxY;
}

function templatePointInSelectedBounds(point) {
  const bounds = selectedTemplateBounds();
  return Boolean(bounds && gridPointInBounds(point, bounds));
}

function rotateTemplateTextBox(text, center, quarters) {
  const size = textBoxSize(text);
  const boxCenter = { x: text.x + size.w / 2, y: text.y + size.h / 2 };
  const rotatedCenter = rotatePointByQuarters(boxCenter, center, quarters);
  if (Math.abs(quarters) % 2 === 1) {
    const nextW = size.h;
    const nextH = size.w;
    text.w = nextW;
    text.h = nextH;
    text.x = Math.round(rotatedCenter.x - nextW / 2);
    text.y = Math.round(rotatedCenter.y - nextH / 2);
  } else {
    text.x = Math.round(rotatedCenter.x - size.w / 2);
    text.y = Math.round(rotatedCenter.y - size.h / 2);
  }
}

function rotateSelectedTemplateObject(quarters) {
  const selected = state.template.selected;
  if (!selected) return false;
  const bounds = selectedTemplateBounds();
  if (!bounds) return false;
  const center = {
    x: Math.round((bounds.minX + bounds.maxX) / 2),
    y: Math.round((bounds.minY + bounds.maxY) / 2),
  };
  const items = templateSelectionItems(selected);
  const selectedMultiPinGroups = new Set();
  recordTemplateUndo();
  if (items.some((item) => item.type === "polygon")) {
    state.template.polygon = state.template.polygon.map((point) => snapPointToGrid(rotatePointByQuarters(point, center, quarters)));
  }
  for (const selectedPin of items.filter((item) => item.type === "pin")) {
    const pin = state.template.pins.find((item) => item.id === selectedPin.id);
    if (pin) {
      const rotated = snapPointToGrid(rotatePointByQuarters(pin, center, quarters));
      pin.x = rotated.x;
      pin.y = rotated.y;
      if (pin.multiPinGroup) selectedMultiPinGroups.add(pin.multiPinGroup);
    }
  }
  for (const groupId of selectedMultiPinGroups) {
    for (const pin of state.template.pins.filter((item) => item.multiPinGroup === groupId)) {
      pin.multiPinArrowOffset = rotateVectorByQuarters(pin.multiPinArrowOffset || { x: 0, y: -2 }, quarters);
    }
  }
  for (const selectedText of items.filter((item) => item.type === "text")) {
    const text = state.template.texts.find((item) => item.id === selectedText.id);
    if (text) rotateTemplateTextBox(text, center, quarters);
  }
  renderTemplateEditor();
  return true;
}

function mirrorTemplateTextBox(text, center, axis) {
  const size = textBoxSize(text);
  const boxCenter = { x: text.x + size.w / 2, y: text.y + size.h / 2 };
  const mirroredCenter = mirrorPoint(boxCenter, center, axis);
  text.x = Math.round(mirroredCenter.x - size.w / 2);
  text.y = Math.round(mirroredCenter.y - size.h / 2);
}

function mirrorSelectedTemplateObject(axis) {
  const selected = state.template.selected;
  if (!selected) return false;
  const bounds = selectedTemplateBounds();
  if (!bounds) return false;
  const center = {
    x: Math.round((bounds.minX + bounds.maxX) / 2),
    y: Math.round((bounds.minY + bounds.maxY) / 2),
  };
  const items = templateSelectionItems(selected);
  const selectedMultiPinGroups = new Set();
  recordTemplateUndo();
  if (items.some((item) => item.type === "polygon")) {
    state.template.polygon = state.template.polygon.map((point) => snapPointToGrid(mirrorPoint(point, center, axis)));
  }
  for (const selectedPin of items.filter((item) => item.type === "pin")) {
    const pin = state.template.pins.find((item) => item.id === selectedPin.id);
    if (pin) {
      const mirrored = snapPointToGrid(mirrorPoint(pin, center, axis));
      pin.x = mirrored.x;
      pin.y = mirrored.y;
      if (pin.multiPinGroup) selectedMultiPinGroups.add(pin.multiPinGroup);
    }
  }
  for (const groupId of selectedMultiPinGroups) {
    for (const pin of state.template.pins.filter((item) => item.multiPinGroup === groupId)) {
      pin.multiPinArrowOffset = mirrorVector(pin.multiPinArrowOffset || { x: 0, y: -2 }, axis);
    }
  }
  for (const selectedText of items.filter((item) => item.type === "text")) {
    const text = state.template.texts.find((item) => item.id === selectedText.id);
    if (text) mirrorTemplateTextBox(text, center, axis);
  }
  renderTemplateEditor();
  return true;
}

function templateHasPendingShadow() {
  return state.template.tool === "pin" || state.template.tool === "multi-pin" || state.template.tool === "cable-pin";
}

function rotateTemplatePendingByQuarters(quarters) {
  if (!templateHasPendingShadow()) return false;
  state.template.pendingOptions = {
    ...(state.template.pendingOptions || {}),
    rotation: normalizeRotationOption((state.template.pendingOptions?.rotation || 0) + quarters),
  };
  renderTemplateEditor();
  return true;
}

function mirrorTemplatePending(axis) {
  if (!templateHasPendingShadow()) return false;
  const key = axis === "vertical" ? "mirrorX" : "mirrorY";
  state.template.pendingOptions = {
    ...(state.template.pendingOptions || {}),
    [key]: !Boolean(state.template.pendingOptions?.[key]),
  };
  renderTemplateEditor();
  return true;
}

function templateObjectBoundsGrid(item) {
  if (item.type === "polygon") return templateBounds();
  if (item.type === "pin") {
    const pin = state.template.pins.find((candidate) => candidate.id === item.id);
    if (!pin) return null;
    const width = templatePinKind(pin) === "cable" ? NODE_SIZES.CABLE_PIN.w : PIN_VISUAL_CELLS;
    const height = templatePinKind(pin) === "cable" ? NODE_SIZES.CABLE_PIN.h : PIN_VISUAL_CELLS;
    return { minX: pin.x - width / 2, minY: pin.y - height / 2, maxX: pin.x + width / 2, maxY: pin.y + height / 2 };
  }
  if (item.type === "text") {
    const text = state.template.texts.find((candidate) => candidate.id === item.id);
    if (!text) return null;
    const bounds = textPixelBounds(text);
    return {
      minX: bounds.minX / GRID,
      minY: bounds.minY / GRID,
      maxX: bounds.maxX / GRID,
      maxY: bounds.maxY / GRID,
    };
  }
  return null;
}

function selectTemplateInBounds(bounds) {
  const items = [];
  if (state.template.polygon.length >= 3) {
    const polygonBounds = templateBounds();
    if (polygonBounds && boundsContains(bounds, polygonBounds)) items.push({ type: "polygon" });
  }
  for (const pin of state.template.pins) {
    const pinBounds = templateObjectBoundsGrid({ type: "pin", id: pin.id });
    if (pinBounds && boundsContains(bounds, pinBounds)) items.push({ type: "pin", id: pin.id });
  }
  for (const text of state.template.texts) {
    const textBounds = templateObjectBoundsGrid({ type: "text", id: text.id });
    if (textBounds && boundsContains(bounds, textBounds)) items.push({ type: "text", id: text.id });
  }
  state.template.selected = templateSelectionFromItems(items);
}

function templatePolygonPixelBounds(points) {
  if (!points.length) return null;
  return {
    minX: Math.min(...points.map((point) => point.x)) * GRID,
    minY: Math.min(...points.map((point) => point.y)) * GRID,
    maxX: Math.max(...points.map((point) => point.x)) * GRID,
    maxY: Math.max(...points.map((point) => point.y)) * GRID,
  };
}

function appendTemplateMultiPinArrow(parent, orderedPins) {
  if (!orderedPins.length) return;
  const first = orderedPins[0];
  const bits = Number(first.multiPinBits || orderedPins.length || 1);
  const second = orderedPins[1];
  const direction = second
    ? {
      x: (second.x - first.x) / 2,
      y: (second.y - first.y) / 2,
    }
    : { x: 1, y: 0 };
  const length = Math.hypot(direction.x, direction.y) || 1;
  const unit = { x: direction.x / length, y: direction.y / length };
  const normal = first.multiPinArrowOffset || { x: unit.y * 2, y: -unit.x * 2 };
  const head = {
    x: first.x - unit.x + normal.x,
    y: first.y - unit.y + normal.y,
  };
  const tail = {
    x: first.x + unit.x * (bits * 2 - 1) + normal.x,
    y: first.y + unit.y * (bits * 2 - 1) + normal.y,
  };
  const arrow = orderArrowGeometry(head, tail);
  const color = orderArrowColor();
  const scale = arrowScale();
  parent.appendChild(createSvg("line", {
    class: "multibit-order-arrow",
    x1: arrow.tail.x * GRID,
    y1: arrow.tail.y * GRID,
    x2: arrow.back.x * GRID,
    y2: arrow.back.y * GRID,
    style: `stroke: ${color}; stroke-width: ${2 * scale}`,
  }));
  parent.appendChild(createSvg("polygon", {
    class: "multibit-arrow-head",
    points: [
      `${arrow.head.x * GRID},${arrow.head.y * GRID}`,
      `${arrow.wingA.x * GRID},${arrow.wingA.y * GRID}`,
      `${arrow.wingB.x * GRID},${arrow.wingB.y * GRID}`,
    ].join(" "),
    style: `fill: ${color}; stroke: ${color}`,
  }));
}

function cablePinVisibleSizePx() {
  const inset = cablePinVisualInset() * GRID;
  return {
    width: NODE_SIZES.CABLE_PIN.w * GRID - inset * 2,
    height: NODE_SIZES.CABLE_PIN.h * GRID - inset * 2,
  };
}

function appendCablePinGlyph(parent, cx, cy, className = "template-pin") {
  const size = cablePinVisibleSizePx();
  const pendingClass = className.includes("template-pending-shadow") ? " template-pending-shadow" : "";
  parent.appendChild(createSvg("rect", {
    class: `${className} template-cable-pin`,
    x: cx - size.width / 2,
    y: cy - size.height / 2,
    width: size.width,
    height: size.height,
  }));
  parent.appendChild(createSvg("circle", {
    class: `template-cable-pin-mark${pendingClass}`,
    cx,
    cy,
    r: GRID / 2,
  }));
}

function appendTemplatePendingShadow() {
  if (!state.template.pointer || !templateHasPendingShadow()) return;
  const pinMarkerSize = GRID * PIN_VISUAL_CELLS;
  if (state.template.tool === "pin") {
    templateCanvas.appendChild(createSvg("rect", {
      class: "template-pin template-pending-shadow",
      x: state.template.pointer.x * GRID - pinMarkerSize / 2,
      y: state.template.pointer.y * GRID - pinMarkerSize / 2,
      width: pinMarkerSize,
      height: pinMarkerSize,
    }));
    return;
  }
  if (state.template.tool === "cable-pin") {
    appendCablePinGlyph(
      templateCanvas,
      state.template.pointer.x * GRID,
      state.template.pointer.y * GRID,
      "template-pin template-pending-shadow",
    );
    return;
  }
  const bits = Math.min(32, Math.max(1, Math.round(Number(state.template.multiPinBits || 4))));
  const positions = templateMultiPinPoints(state.template.pointer, bits, state.template.pendingOptions || {});
  const arrowOffset = templateMultiPinArrowOffset(state.template.pendingOptions || {});
  const previewPins = positions.map((point, index) => ({
    ...point,
    multiPinIndex: index,
    multiPinBits: bits,
    multiPinArrowOffset: arrowOffset,
  }));
  appendTemplateMultiPinArrow(templateCanvas, previewPins);
  for (const point of positions) {
    templateCanvas.appendChild(createSvg("rect", {
      class: "template-pin template-pending-shadow",
      x: point.x * GRID - pinMarkerSize / 2,
      y: point.y * GRID - pinMarkerSize / 2,
      width: pinMarkerSize,
      height: pinMarkerSize,
    }));
  }
}

function templatePinPixelBounds(pin) {
  const width = templatePinKind(pin) === "cable" ? NODE_SIZES.CABLE_PIN.w * GRID : GRID * PIN_VISUAL_CELLS;
  const height = templatePinKind(pin) === "cable" ? NODE_SIZES.CABLE_PIN.h * GRID : GRID * PIN_VISUAL_CELLS;
  return {
    minX: pin.x * GRID - width / 2,
    minY: pin.y * GRID - height / 2,
    maxX: pin.x * GRID + width / 2,
    maxY: pin.y * GRID + height / 2,
  };
}

function svgElementPixelBounds(element, fallback) {
  try {
    const box = element.getBBox();
    return {
      minX: box.x,
      minY: box.y,
      maxX: box.x + box.width,
      maxY: box.y + box.height,
    };
  } catch (error) {
    return fallback;
  }
}

function renderTemplateEditor() {
  templateCanvas.replaceChildren();
  updateTemplateToolButtons();
  updateTemplateViewBox();
  appendTemplateGrid();
  const polygon = state.template.polygon;
  const draft = state.template.draft;
  const selectedBounds = [];
  if (polygon.length >= 3) {
    templateCanvas.appendChild(createSvg("polygon", {
      class: `template-body ${templateSelectionHas("polygon") ? "selected" : ""}`,
      points: polygon.map((point) => `${point.x * GRID},${point.y * GRID}`).join(" "),
      "data-template-kind": "polygon",
    }));
    if (templateSelectionHas("polygon")) selectedBounds.push(templatePolygonPixelBounds(polygon));
  }
  if (draft.length) {
    const previewPoints = state.template.tool === "polygon" && state.template.pointer
      ? [...draft, state.template.pointer]
      : draft;
    templateCanvas.appendChild(createSvg("polyline", {
      class: "template-draft",
      points: previewPoints.map((point) => `${point.x * GRID},${point.y * GRID}`).join(" "),
    }));
    for (const point of draft) {
      templateCanvas.appendChild(createSvg("circle", {
        class: "template-draft-point",
        cx: point.x * GRID,
        cy: point.y * GRID,
        r: GRID * 0.16,
      }));
    }
  }
  appendTemplatePendingShadow();
  const multiPinGroups = new Map();
  for (const pin of state.template.pins) {
    if (!pin.multiPinGroup) continue;
    if (!multiPinGroups.has(pin.multiPinGroup)) multiPinGroups.set(pin.multiPinGroup, []);
    multiPinGroups.get(pin.multiPinGroup).push(pin);
  }
  for (const pins of multiPinGroups.values()) {
    const ordered = [...pins].sort((a, b) => Number(a.multiPinIndex || 0) - Number(b.multiPinIndex || 0));
    appendTemplateMultiPinArrow(templateCanvas, ordered);
  }
  for (const pin of state.template.pins) {
    const pinMarkerSize = GRID * PIN_VISUAL_CELLS;
    const activeSource = Boolean(state.template.sourcePinId && pin.sourcePinId === state.template.sourcePinId);
    if (templatePinKind(pin) === "cable") {
      appendCablePinGlyph(
        templateCanvas,
        pin.x * GRID,
        pin.y * GRID,
        `template-pin ${pin.sourcePinId ? "linked" : ""} ${activeSource ? "active-source" : ""} ${templateSelectionHas("pin", pin.id) ? "selected" : ""}`,
      );
      templateCanvas.lastChild.previousSibling.setAttribute("data-template-pin-id", pin.id);
      templateCanvas.lastChild.setAttribute("data-template-pin-id", pin.id);
      if (templateSelectionHas("pin", pin.id)) selectedBounds.push(templatePinPixelBounds(pin));
      if (templatePinBitLength(pin) > 1) {
        templateCanvas.appendChild(createSvg("text", {
          class: "template-pin-label",
          x: pin.x * GRID - (NODE_SIZES.CABLE_PIN.w * GRID) / 2 - GRID * 0.35,
          y: pin.y * GRID - (NODE_SIZES.CABLE_PIN.h * GRID) / 2 + GRID * 0.35,
          "text-anchor": "end",
        }));
        templateCanvas.lastChild.textContent = String(templatePinBitLength(pin));
      }
      continue;
    }
    const rect = createSvg("rect", {
      class: `template-pin ${pin.sourcePinId ? "linked" : ""} ${activeSource ? "active-source" : ""} ${templateSelectionHas("pin", pin.id) ? "selected" : ""}`,
      x: pin.x * GRID - pinMarkerSize / 2,
      y: pin.y * GRID - pinMarkerSize / 2,
      width: pinMarkerSize,
      height: pinMarkerSize,
      "data-template-pin-id": pin.id,
    });
    templateCanvas.appendChild(rect);
    if (templateSelectionHas("pin", pin.id)) {
      selectedBounds.push(templatePinPixelBounds(pin));
    }
    if (pin.label) {
      templateCanvas.appendChild(createSvg("text", {
        class: "template-pin-label",
        x: pin.x * GRID + GRID * 0.35,
        y: pin.y * GRID,
      }));
      templateCanvas.lastChild.textContent = pin.label;
    }
  }
  for (const text of state.template.texts) {
    const bounds = textPixelBounds(text);
    const textPosition = textPositionInBox(text, bounds.minX, bounds.minY, bounds.maxX - bounds.minX, bounds.maxY - bounds.minY);
    templateCanvas.appendChild(createSvg("rect", {
      class: `template-text-hitbox ${templateSelectionHas("text", text.id) ? "selected" : ""}`,
      x: bounds.minX,
      y: bounds.minY,
      width: bounds.maxX - bounds.minX,
      height: bounds.maxY - bounds.minY,
      "data-template-text-id": text.id,
    }));
    const textEl = createSvg("text", {
      class: `template-text ${templateSelectionHas("text", text.id) ? "selected" : ""}`,
      x: textPosition.x,
      y: textPosition.y,
      style: textStyle(text),
      "text-anchor": textAnchor(text),
      "dominant-baseline": textBaseline(text),
      dy: textBaselineOffset(text),
    });
    textEl.textContent = text.text || "Text";
    templateCanvas.appendChild(textEl);
    if (templateSelectionHas("text", text.id)) {
      selectedBounds.push(bounds);
    }
  }
  if (state.template.drag?.kind === "box-select") {
    const bounds = normalizedBounds(state.template.drag.startGrid, state.template.pointer || state.template.drag.startGrid);
    templateCanvas.appendChild(createSvg("rect", {
      class: "selection-box",
      x: bounds.minX * GRID,
      y: bounds.minY * GRID,
      width: (bounds.maxX - bounds.minX) * GRID,
      height: (bounds.maxY - bounds.minY) * GRID,
    }));
  }
  for (const bounds of selectedBounds) appendSelectionCornerHandles(templateCanvas, bounds);
  templateStatus.textContent = state.template.polygon.length
    ? "Right-click a template pin to associate it with the circuit pin that opened this editor."
    : "Click Polygon, then click points. Click the first point again to close.";
}

function updateTemplateToolButtons() {
  const toolById = {
    "template-tool-polygon": "polygon",
    "template-tool-rectangle": "rectangle",
    "template-tool-pin": "pin",
    "template-tool-multi-pin": "multi-pin",
    "template-tool-cable-pin": "cable-pin",
    "template-tool-text": "text",
  };
  for (const [id, tool] of Object.entries(toolById)) {
    const button = document.getElementById(id);
    const active = state.template.tool === tool;
    button?.classList.toggle("active", active);
    button?.setAttribute("aria-pressed", active ? "true" : "false");
  }
}

function linkTemplatePin(pinId) {
  const pin = state.template.pins.find((item) => item.id === pinId);
  const source = findNode(state.template.sourcePinId);
  if (!pin || !source || pin.sourcePinId) return;
  recordTemplateUndo();
  pin.sourcePinId = source.id;
  renderTemplateEditor();
}

function unlinkTemplatePin(pinId) {
  const pin = state.template.pins.find((item) => item.id === pinId);
  if (!pin?.sourcePinId) return;
  recordTemplateUndo();
  pin.sourcePinId = null;
  pin.sourcePort = "";
  renderTemplateEditor();
}

function templatePinContextGroup(pin) {
  if (!pin?.multiPinGroup) return pin ? [pin] : [];
  return state.template.pins
    .filter((item) => item.multiPinGroup === pin.multiPinGroup)
    .sort((a, b) => Number(a.multiPinIndex || 0) - Number(b.multiPinIndex || 0));
}

function linkTemplatePinOrGroup(pinId) {
  const pin = state.template.pins.find((item) => item.id === pinId);
  const source = findNode(state.template.sourcePinId);
  if (!pin || !source) return;
  const group = templatePinContextGroup(pin);
  if (group.some((item) => item.sourcePinId)) return;
  if (group.some((item) => !templatePinCompatibleWithSource(item, source))) return;
  recordTemplateUndo();
  for (const item of group) {
    item.sourcePinId = source.id;
    item.sourcePort = source.type === "MULTI_PIN" ? `bit${Number(item.multiPinIndex || 0)}` : "";
    item.kind = source.type === "CABLE_PIN" ? "cable" : "pin";
    item.bitLength = source.type === "CABLE_PIN" ? multiBitCount(source) : 1;
  }
  renderTemplateEditor();
}

function unlinkTemplatePinOrGroup(pinId) {
  const pin = state.template.pins.find((item) => item.id === pinId);
  if (!pin) return;
  const group = templatePinContextGroup(pin);
  if (!group.some((item) => item.sourcePinId)) return;
  recordTemplateUndo();
  for (const item of group) {
    item.sourcePinId = null;
    item.sourcePort = "";
  }
  renderTemplateEditor();
}

function showTemplatePinContextMenu(pinId, clientX, clientY) {
  const pin = state.template.pins.find((item) => item.id === pinId);
  if (!pin) return;
  const group = templatePinContextGroup(pin);
  const hasLinkedPin = group.some((item) => item.sourcePinId);
  const source = findNode(state.template.sourcePinId);
  const canAssociate = Boolean(source && group.every((item) => templatePinCompatibleWithSource(item, source)));
  fanInMenu.replaceChildren();
  const associateButton = document.createElement("button");
  associateButton.type = "button";
  associateButton.textContent = "Associate with this pin";
  associateButton.disabled = hasLinkedPin || !canAssociate;
  associateButton.addEventListener("click", () => {
    if (associateButton.disabled) return;
    hideFanInMenu();
    linkTemplatePinOrGroup(pinId);
  });
  fanInMenu.appendChild(associateButton);

  const unlinkButton = document.createElement("button");
  unlinkButton.type = "button";
  unlinkButton.textContent = "Unassociate";
  unlinkButton.disabled = !hasLinkedPin;
  unlinkButton.addEventListener("click", () => {
    if (unlinkButton.disabled) return;
    hideFanInMenu();
    unlinkTemplatePinOrGroup(pinId);
  });
  fanInMenu.appendChild(unlinkButton);
  positionContextMenu(clientX, clientY);
}

function showTemplateTextContextMenu(textId, clientX, clientY) {
  const text = state.template.texts.find((item) => item.id === textId);
  if (!text) return;
  fanInMenu.replaceChildren();
  appendTextControls(text, (mutate) => {
    const target = state.template.texts.find((item) => item.id === textId);
    if (!target) return;
    recordTemplateUndo();
    mutate(target);
    renderTemplateEditor();
  });
  positionContextMenu(clientX, clientY);
}

function templateTextAtEvent(event) {
  const target = event.target.closest?.("[data-template-text-id]");
  if (target) return target.dataset.templateTextId;
  const point = templateRawPointFromEvent(event);
  for (let index = state.template.texts.length - 1; index >= 0; index -= 1) {
    const text = state.template.texts[index];
    const bounds = textPixelBounds(text);
    if (
      point.x >= bounds.minX
      && point.x <= bounds.maxX
      && point.y >= bounds.minY
      && point.y <= bounds.maxY
    ) {
      return text.id;
    }
  }
  return "";
}

function validateTemplateForSave() {
  if (state.template.polygon.length < 3) return "매크로 몸체 다각형을 먼저 완성해야 합니다.";
  if (state.template.pins.some(templatePinOutsideBody)) return "핀은 매크로 몸체 밖에 완전히 벗어날 수 없습니다.";
  const circuitIssue = firstBlockingCircuitIssue(analyzeCircuitIssues());
  if (circuitIssue) return circuitIssue.message;
  const sourcePinIds = new Set(state.nodes.filter((node) => node.type === "PIN" || node.type === "MULTI_PIN" || node.type === "CABLE_PIN").map((node) => node.id));
  const linked = new Set(state.template.pins.map((pin) => pin.sourcePinId).filter(Boolean));
  const mismatchedTemplatePin = state.template.pins
    .filter((pin) => pin.sourcePinId)
    .some((pin) => !templatePinCompatibleWithSource(pin, findNode(pin.sourcePinId)));
  if (mismatchedTemplatePin) return "Template pin type does not match the linked internal pin.";
  for (const id of linked) {
    if (!sourcePinIds.has(id)) return "존재하지 않는 내부 Pin에 연결된 템플릿 Pin이 있습니다.";
  }
  if (!linked.size) return "템플릿 Pin을 적어도 하나 내부 Pin과 연결해야 합니다.";
  return "";
}

function templateCanAutoCache() {
  return state.template.polygon.length >= 3
    && state.template.pins.length > 0
    && !state.template.pins.some(templatePinOutsideBody)
    && state.template.pins.some((pin) => pin.sourcePinId);
}

function recordUndoForColorInput(input) {
  if (input.dataset.editing === "true") return;
  recordUndo();
  input.dataset.editing = "true";
}

function deleteSelection({ record = true } = {}) {
  if (!selectedCount()) return;
  if (record) recordUndo();
  const nodeIds = new Set(state.selectedNodeIds);
  const wireIds = new Set(state.selectedWireIds);
  state.nodes = state.nodes.filter((node) => !nodeIds.has(node.id));
  state.wires = state.wires.filter((wire) => {
    if (wireIds.has(wire.id)) return false;
    for (const id of nodeIds) {
      if (endpointTouchesNode(wire.from, id, "output") || endpointTouchesNode(wire.to, id, "input")) return false;
    }
    return true;
  });
  clearSelection();
  render();
}

function cutSelection() {
  if (!selectedCount()) return;
  recordUndo();
  copySelection();
  deleteSelection({ record: false });
}

function selectedClipboardData() {
  const nodeIds = new Set(state.selectedNodeIds);
  const explicitWireIds = new Set(state.selectedWireIds);
  const nodes = state.nodes.filter((node) => nodeIds.has(node.id)).map(cloneData);
  const wires = state.wires.filter((wire) => {
    if (explicitWireIds.has(wire.id)) return true;
    const from = normalizeEndpoint(wire.from, "output");
    const to = normalizeEndpoint(wire.to, "input");
    return from.kind === "port" && to.kind === "port" && nodeIds.has(from.nodeId) && nodeIds.has(to.nodeId);
  }).map(cloneData);
  return { nodes, wires };
}

function copySelection() {
  if (!selectedCount()) return;
  const data = selectedClipboardData();
  if (!data.nodes.length && !data.wires.length) return;
  state.clipboard = data;
  statusEl.textContent = `Copied ${data.nodes.length} components and ${data.wires.length} wires`;
}

function remapEndpoint(endpoint, nodeIdMap) {
  const copy = cloneData(endpoint);
  if (copy.kind === "port" && nodeIdMap.has(copy.nodeId)) copy.nodeId = nodeIdMap.get(copy.nodeId);
  return copy;
}

function pasteSelection() {
  if (!state.clipboard) return;
  recordUndo();
  const nodeIdMap = new Map();
  const wireIdMap = new Map();
  const pastedNodes = state.clipboard.nodes.map((node) => {
    const copy = cloneData(node);
    const nextId = uid(copy.type?.toLowerCase?.() || "node");
    nodeIdMap.set(copy.id, nextId);
    copy.id = nextId;
    copy.x += 1;
    copy.y += 1;
    return copy;
  });
  const pastedWires = state.clipboard.wires.map((wire) => {
    const copy = cloneData(wire);
    const nextId = uid("wire");
    wireIdMap.set(copy.id, nextId);
    copy.id = nextId;
    copy.from = remapEndpoint(copy.from, nodeIdMap);
    copy.to = remapEndpoint(copy.to, nodeIdMap);
    copy.points = (copy.points || []).map((point) => ({ x: point.x + 1, y: point.y + 1 }));
    if (copy.from.kind === "wire" && wireIdMap.has(copy.from.wireId)) copy.from.wireId = wireIdMap.get(copy.from.wireId);
    if (copy.to.kind === "wire" && wireIdMap.has(copy.to.wireId)) copy.to.wireId = wireIdMap.get(copy.to.wireId);
    if (copy.from.kind === "wire") copy.from.point = { x: copy.from.point.x + 1, y: copy.from.point.y + 1 };
    if (copy.to.kind === "wire") copy.to.point = { x: copy.to.point.x + 1, y: copy.to.point.y + 1 };
    return copy;
  }).filter((wire) => {
    const from = normalizeEndpoint(wire.from, "output");
    const to = normalizeEndpoint(wire.to, "input");
    const fromOk = from.kind !== "port" || nodeIdMap.has(state.clipboard.nodes.find((node) => nodeIdMap.get(node.id) === from.nodeId)?.id);
    const toOk = to.kind !== "port" || nodeIdMap.has(state.clipboard.nodes.find((node) => nodeIdMap.get(node.id) === to.nodeId)?.id);
    return fromOk && toOk;
  });

  state.nodes.push(...pastedNodes);
  state.wires.push(...pastedWires);
  selectMany(pastedNodes.map((node) => node.id), pastedWires.map((wire) => wire.id));
  state.clipboard = { nodes: pastedNodes.map(cloneData), wires: pastedWires.map(cloneData) };
  render();
}

function nodeFromEventTarget(target) {
  const group = target.closest?.(".node");
  return group ? findNode(group.dataset.nodeId) : null;
}

function serializableNode(node) {
  if (node?.type === "CLOCK") {
    const { value, lastClockTick, ...rest } = node;
    return {
      ...rest,
      clockHz: clockFrequency(node),
    };
  }
  if (node?.type === "PULSE") {
    const { lastPulseTick, ...rest } = node;
    return {
      ...rest,
      pulsePattern: normalizePulsePattern(node.pulsePattern),
      pulseHz: pulseFrequency(node),
      pulseIndex: Math.max(0, Math.trunc(Number(node.pulseIndex || 0))) % normalizePulsePattern(node.pulsePattern).length,
    };
  }
  return node;
}

function circuitPayload() {
  syncJunctionBitLengthsFromWires();
  return {
    kind: "digital-works-design",
    name: state.designName,
    nodes: state.nodes.map(serializableNode),
    wires: state.wires,
    settings: normalizeSettings(state.settings),
    macros: state.macros,
    templateWorkspace: templateWorkspacePayload(),
  };
}

function circuitPayloadText() {
  return JSON.stringify(circuitPayload(), null, 2);
}

function markSavedState() {
  state.savedPayloadText = circuitPayloadText();
}

function hasUnsavedChanges() {
  return state.savedPayloadText !== circuitPayloadText();
}

function confirmDiscardUnsaved(actionLabel) {
  if (!hasUnsavedChanges()) return true;
  return window.confirm(`Unsaved changes will be lost if you ${actionLabel}. Continue?`);
}

function designFileName() {
  const base = state.fileName
    ? state.fileName.replace(/\.[^.]+$/, "")
    : (state.designName || "digital-works-design").trim().replace(/[\\/:*?"<>|]+/g, "-");
  return `${base || "digital-works-design"}.json`;
}

function downloadCircuitPayload(payload, fileName = designFileName()) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(link.href);
  markSavedState();
}

async function writeCircuitToHandle(handle) {
  const writable = await handle.createWritable();
  await writable.write(circuitPayloadText());
  await writable.close();
  state.fileHandle = handle;
  state.fileName = handle.name || state.fileName;
  markSavedState();
  statusEl.textContent = `Saved ${state.fileName || "file"}`;
}

async function exportCircuit({ saveAs = false } = {}) {
  try {
    if (saveAs) {
      if ("showSaveFilePicker" in window) {
        const handle = await window.showSaveFilePicker({
          id: DESIGN_FILE_PICKER_ID,
          suggestedName: designFileName(),
          types: [{
            description: "Digital Works JSON",
            accept: { "application/json": [".json"] },
          }],
        });
        await writeCircuitToHandle(handle);
        return;
      }
      downloadCircuitPayload(circuitPayload(), designFileName());
      statusEl.textContent = `Downloaded ${designFileName()}`;
      return;
    }
    if (!saveAs && state.fileHandle) {
      await writeCircuitToHandle(state.fileHandle);
      return;
    }
    if ("showSaveFilePicker" in window) {
      const handle = await window.showSaveFilePicker({
        id: DESIGN_FILE_PICKER_ID,
        suggestedName: designFileName(),
        types: [{
          description: "Digital Works JSON",
          accept: { "application/json": [".json"] },
        }],
      });
      await writeCircuitToHandle(handle);
      return;
    }
    downloadCircuitPayload(circuitPayload(), designFileName());
    statusEl.textContent = `Downloaded ${designFileName()}`;
  } catch (error) {
    if (error?.name === "AbortError") return;
    statusEl.textContent = `Save failed: ${error.message || "could not write file"}`;
  }
}

function loadCircuitData(data, file = null, handle = null) {
  if (!Array.isArray(data.nodes) || !Array.isArray(data.wires)) throw new Error("Invalid circuit");
  recordUndo();
  state.designName = data.name || file?.name?.replace(/\.[^.]+$/, "") || "Untitled Design";
  state.fileName = file?.name || handle?.name || "";
  state.fileHandle = handle || null;
  state.nodes = cloneData(data.nodes);
  for (const node of state.nodes) {
    if (!SEQUENTIAL_TYPES.has(node.type)) continue;
    node.q = signalValue(node.q ?? SIGNAL.ZERO);
    if (FLIP_FLOP_TYPES.has(node.type)) node.lastClock = signalValue(node.lastClock ?? SIGNAL.ZERO);
  }
  state.wires = data.wires;
  state.macroInstanceValues = new Map();
  syncJunctionBitLengthsFromWires();
  state.settings = normalizeSettings({ ...state.settings, ...(data.settings || {}) });
  saveSettingsToStorage();
  state.macros = Array.isArray(data.macros)
    ? data.macros.map((macro) => ({
      ...macro,
      loadedAsPaletteMacro: Boolean(macro.paletteVisible),
      paletteVisible: false,
    }))
    : [];
  for (const node of state.nodes) {
    if (node.type !== "MACRO") continue;
    const macro = findMacro(node.macroId);
    if (!macro || macro.instanceSnapshot || (!macro.loadedAsPaletteMacro && !macro.displayName)) continue;
    const instanceMacro = createMacroInstanceDefinition(macro);
    if (!instanceMacro) continue;
    state.macros.push(instanceMacro);
    node.sourceMacroId = macro.sourceMacroId || macro.id;
    node.macroId = instanceMacro.id;
  }
  restoreTemplateWorkspace(data.templateWorkspace || null);
  state.simulationRunning = false;
  resetClockTickBaselines();
  updateSimulationRunButton();
  renderMacroParts();
  syncSettingsInputs();
  clearSelection();
  markSavedState();
  render();
  statusEl.textContent = `Loaded ${state.fileName || state.designName}`;
}

function importCircuit(file) {
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    try {
      const data = JSON.parse(String(reader.result));
      loadCircuitData(data, file, null);
    } catch (error) {
      statusEl.textContent = "Import failed: invalid circuit JSON";
    }
  });
  reader.readAsText(file);
}

async function openCircuitFile() {
  if (!("showOpenFilePicker" in window)) {
    document.getElementById("load-file").click();
    return;
  }
  try {
    const [handle] = await window.showOpenFilePicker({
      id: DESIGN_FILE_PICKER_ID,
      multiple: false,
      types: [{
        description: "Digital Works JSON",
        accept: { "application/json": [".json"] },
      }],
    });
    const file = await handle.getFile();
    const data = JSON.parse(await file.text());
    loadCircuitData(data, file, handle);
  } catch (error) {
    if (error?.name === "AbortError") return;
    statusEl.textContent = `Import failed: ${error.message || "invalid circuit JSON"}`;
  }
}

function circuitBounds() {
  const bounds = state.nodes.map(nodeBounds);
  if (!bounds.length) return { minX: 0, minY: 0, maxX: 6, maxY: 4 };
  return bounds.reduce((acc, item) => ({
    minX: Math.min(acc.minX, item.minX),
    minY: Math.min(acc.minY, item.minY),
    maxX: Math.max(acc.maxX, item.maxX),
    maxY: Math.max(acc.maxY, item.maxY),
  }));
}

function macroFromCircuit(options = {}) {
  const validationError = validateTemplateForSave();
  if (validationError) {
    if (!options.silent) window.alert(validationError);
    return null;
  }
  const existing = rootHiddenMacro();
  const name = existing?.name || state.designName || "Macro";
  const duplicate = false;
  const macroId = existing?.id || uid("macrodef");
  if (duplicate) {
    window.alert("이미 import한 매크로와 같은 이름으로 저장할 수 없습니다.");
    return null;
  }
  const bounds = templateBounds();
  const width = bounds.maxX - bounds.minX;
  const height = bounds.maxY - bounds.minY;
  const pins = state.template.pins
    .filter((pin) => pin.sourcePinId)
    .map((pin) => {
      const source = findNode(pin.sourcePinId);
      const direction = inferTemplatePinDirection(pin, source, bounds);
      return {
        id: pin.label || pin.id,
        label: pin.label || "",
        direction,
        internalNodeId: pin.sourcePinId,
        internalPort: pin.sourcePort || "",
        bitLength: source?.type === "CABLE_PIN" ? multiBitCount(source) : templatePinBitLength(pin),
        x: pin.x - bounds.minX,
        y: pin.y - bounds.minY,
      };
    });
  const macro = {
    kind: "digital-works-macro",
    id: macroId,
    name,
    size: { w: width, h: height },
    polygon: state.template.polygon.map((point) => ({ x: point.x - bounds.minX, y: point.y - bounds.minY })),
    texts: state.template.texts.map((text) => ({ ...text, x: text.x - bounds.minX, y: text.y - bounds.minY })),
    template: {
      polygon: cloneData(state.template.polygon),
      pins: cloneData(state.template.pins),
      texts: cloneData(state.template.texts),
    },
    pins,
    circuit: {
      nodes: state.nodes,
      wires: state.wires,
      settings: state.settings,
      macros: state.macros.filter((macro) => macro.id !== macroId),
    },
  };
  const cycleId = findMacroDependencyCycle(flattenMacroDefinitions([...state.macros.filter((item) => item.id !== macroId), macro]));
  if (cycleId) {
    if (!options.silent) window.alert("매크로 의존성에 순환이 있어서 저장할 수 없습니다.");
    return null;
  }
  return macro;
}

function exportMacro() {
  const macro = macroFromCircuit();
  if (!macro) return;
  addMacroDefinition(macro);
  closeTemplateEditor();
  statusEl.textContent = `Saved macro in this design: ${macro.name}`;
  render();
}

function addMacroDefinition(macro, options = {}) {
  if (options.record !== false) recordUndo();
  const size = macro.size || { w: 6, h: 4 };
  const existing = state.macros.find((item) => item.id === macro.id);
  const normalized = {
    ...macro,
    id: macro.id || uid("macrodef"),
    name: macro.name || "Macro",
    size,
    pins: normalizeMacroPinDirections(positionedMacroPins(Array.isArray(macro.pins) ? macro.pins : [], size), size),
    polygon: Array.isArray(macro.polygon) ? macro.polygon : [],
    texts: Array.isArray(macro.texts) ? macro.texts : [],
    paletteVisible: options.paletteVisible ?? existing?.paletteVisible ?? false,
  };
  state.macros = state.macros.filter((item) => item.id !== normalized.id);
  state.macros.push(normalized);
  renderMacroParts();
}

function macrosFromImportData(data, fallbackName) {
  if (data.kind === "digital-works-macro") return [data];
  if (data.macro && data.macro.kind === "digital-works-macro") return [data.macro];
  if (data.kind === "digital-works-design" && Array.isArray(data.macros)) {
    const hiddenMacros = data.macros.filter((macro) => !macro.paletteVisible);
    const referencedIds = new Set();
    for (const macro of hiddenMacros) {
      for (const id of macroDependencyIds(macro)) referencedIds.add(id);
    }
    const rootMacros = hiddenMacros.filter((macro) => !referencedIds.has(macro.id));
    const topLevel = rootMacros[rootMacros.length - 1] || hiddenMacros[hiddenMacros.length - 1];
    return topLevel ? [topLevel] : [];
  }
  return [];
}

function validateMacroImport(candidates) {
  const currentRootMacro = rootHiddenMacro();
  const candidateIds = new Set(candidates.map((macro) => macro.id).filter(Boolean));
  if (currentRootMacro?.id && candidateIds.has(currentRootMacro.id)) return "Cannot import a macro into itself.";
  const allMacros = flattenMacroDefinitions([...state.macros, ...candidates]);
  const graph = macroDependencyGraph(allMacros);
  if (currentRootMacro) {
    for (const candidate of candidates) {
      if (macroHasDependencyPath(graph, candidate.id, currentRootMacro.id)) {
        return "Cannot import this macro because it would create a macro dependency cycle.";
      }
    }
  }
  const cycleId = findMacroDependencyCycle(allMacros);
  if (cycleId) return "Cannot import this macro because its dependencies contain a cycle.";
  return "";
}

function importMacro(file) {
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    try {
      const data = JSON.parse(String(reader.result));
      const fallbackName = file.name.replace(/\.[^.]+$/, "");
      const macros = macrosFromImportData(data, fallbackName);
      if (!macros.length) throw new Error("Invalid macro");
      const importError = validateMacroImport(macros);
      if (importError) throw new Error(importError);
      recordUndo();
      for (const macro of macros) {
        addMacroDefinition(
          { ...macro, displayName: macros.length === 1 ? fallbackName : macro.displayName || macro.name || "Macro" },
          { record: false, paletteVisible: true },
        );
      }
      render();
      statusEl.textContent = `Imported ${macros.length} macro${macros.length === 1 ? "" : "s"}`;
    } catch (error) {
      statusEl.textContent = `Macro import failed: ${error.message || "invalid macro JSON"}`;
    }
  });
  reader.readAsText(file);
}

function renderMacroParts() {
  macroParts.replaceChildren();
  for (const macro of state.macros.filter((item) => item.paletteVisible)) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "macro-button";
    button.dataset.add = `MACRO:${macro.id}`;
    button.textContent = macro.displayName || macro.name;
    button.title = macro.displayName || macro.name;
    button.classList.toggle("active", state.pendingPart === button.dataset.add);
    button.addEventListener("click", () => setPendingPart(button.dataset.add));
    macroParts.appendChild(button);
  }
}

// Pointer handling is mode-specific: move selects/drags, control operates live parts, wire drafts connections.
canvas.addEventListener("pointerdown", async (event) => {
  const gridPoint = screenToGrid(event.clientX, event.clientY);
  state.pointerGrid = gridPoint;
  const bendHandle = event.target.closest?.(".wire-bend-handle");
  if (bendHandle && state.tool === "move") {
    const wire = findWire(bendHandle.dataset.wireId);
    if (!wire) return;
    if (selectedCount() > 1 && isWireSelected(wire.id)) {
      recordUndo();
      startSelectionDrag(event.pointerId, gridPoint, { x: event.clientX, y: event.clientY });
      render();
      return;
    }
    selectWire(wire.id);
    recordUndo();
    state.drag = {
      kind: "wire-bend",
      pointerId: event.pointerId,
      wireId: wire.id,
      pointIndex: Number(bendHandle.dataset.pointIndex),
    };
    canvas.setPointerCapture(event.pointerId);
    render();
    return;
  }

  const group = event.target.closest?.(".node");
  if (group && event.button === 2) {
    const node = findNode(group.dataset.nodeId);
    if (selectedCount() > 1 && isNodeSelected(node.id)) return;
    selectNode(node.id);
    showNodeContextMenu(node, event.clientX, event.clientY);
    render();
    return;
  }

  if (state.pendingPart && state.tool === "move" && event.button === 0 && !state.spaceDown) {
    hideFanInMenu();
    if (state.pendingPart === "BUS") {
      handleBusToolClick(gridPoint);
      return;
    }
    await placeNode(state.pendingPart, gridPoint, state.pendingPartOptions || {});
    clearPendingPart();
    render();
    return;
  }

  const wireEndpoint = attachCandidateFromEvent(event);
  if (wireEndpoint && state.tool === "wire") {
    event.stopPropagation();
    if (state.wireStart) {
      finishWire(wireEndpoint);
    } else {
      startWire(wireEndpoint);
    }
    hideAttachLabel();
    return;
  }

  const controlHit = state.tool === "control"
    ? controlSwitchAtGridPoint(screenToGridRaw(event.clientX, event.clientY))
    : null;
  if ((controlHit || group) && state.tool === "control") {
    const node = controlHit?.node || findNode(group.dataset.nodeId);
    if ((node?.type === "INPUT" || node?.type === "MULTI_INPUT" || node?.type === "TEST_INPUT" || node?.type === "MULTI_TEST_INPUT") && event.button === 0) {
      recordUndo();
      const bitTarget = event.target.closest?.("[data-bit-index]");
      state.drag = {
        kind: "control-input",
        pointerId: event.pointerId,
        nodeId: node.id,
        bitIndex: Number.isInteger(controlHit?.bitIndex) ? controlHit.bitIndex : bitTarget ? Number(bitTarget.dataset.bitIndex) : null,
        moved: false,
        startClient: { x: event.clientX, y: event.clientY },
      };
      canvas.setPointerCapture(event.pointerId);
    }
    return;
  }

  if (group && state.tool === "move") {
    const node = findNode(group.dataset.nodeId);
    if (!isNodeSelected(node.id)) selectNode(node.id);
    recordUndo();
    startSelectionDrag(event.pointerId, gridPoint, { x: event.clientX, y: event.clientY });
    render();
    return;
  }

  const wireTarget = event.target.closest?.(".wire");
  if (wireTarget && state.tool === "move") {
    if (!isWireSelected(wireTarget.dataset.wireId)) selectWire(wireTarget.dataset.wireId);
    hideFanInMenu();
    recordUndo();
    startSelectionDrag(event.pointerId, gridPoint, { x: event.clientX, y: event.clientY });
    render();
    return;
  }

  hideFanInMenu();

  if (state.tool === "wire") {
    const wire = findWireAtGridPoint(gridPoint);
    if (wire) {
      if (state.wireStart) {
        const endpoint = junctionEndpointForWirePoint(wire, gridPoint, "input");
        finishWire(endpoint);
      } else {
        const endpoint = junctionEndpointForWirePoint(wire, gridPoint, "output");
        startWire(endpoint);
      }
      hideAttachLabel();
      return;
    }
    if (state.wireStart) {
      addWireBend(gridPoint);
      return;
    }
  }

  if (state.tool === "move") {
    const wire = findWireAtGridPoint(gridPoint, null, 0.35);
    if (wire) {
      if (!isWireSelected(wire.id)) selectWire(wire.id);
      hideFanInMenu();
      recordUndo();
      startSelectionDrag(event.pointerId, gridPoint, { x: event.clientX, y: event.clientY });
      render();
      return;
    }
  }

  clearSelection();
  if (state.tool === "move" && event.button === 0 && !state.spaceDown) {
    state.drag = {
      kind: "box-select",
      pointerId: event.pointerId,
      startGrid: { ...gridPoint },
    };
    canvas.setPointerCapture(event.pointerId);
  } else if (event.button === 1 || (event.button === 0 && state.spaceDown)) {
    state.drag = {
      kind: "pan",
      pointerId: event.pointerId,
      start: { x: event.clientX, y: event.clientY },
      pan: { ...state.pan },
    };
    canvas.setPointerCapture(event.pointerId);
  }
  render();
});

canvas.addEventListener("pointermove", (event) => {
  state.pointerGrid = screenToGrid(event.clientX, event.clientY);
  updateControlCursor(event);
  updateAttachLabel(event);
  let needsViewportOnly = false;
  let needsSceneOnly = false;
  let needsInteractionOnly = Boolean(state.wireStart || state.pendingPart || state.busStart);
  if (state.drag?.kind === "control-input") {
    if (event.clientX !== state.drag.startClient.x || event.clientY !== state.drag.startClient.y) {
      state.drag.moved = true;
    }
  }
  if (state.drag?.kind === "node") {
    const node = findNode(state.drag.nodeId);
    const nextX = state.pointerGrid.x - state.drag.offset.x;
    const nextY = state.pointerGrid.y - state.drag.offset.y;
    if (event.clientX !== state.drag.startClient.x || event.clientY !== state.drag.startClient.y) {
      state.drag.moved = true;
    }
    node.x = nextX;
    node.y = nextY;
    needsSceneOnly = true;
  }
  if (state.drag?.kind === "selection") {
    if (event.clientX !== state.drag.startClient.x || event.clientY !== state.drag.startClient.y) {
      state.drag.moved = true;
    }
    moveSelectionDrag(state.drag, state.pointerGrid);
    needsSceneOnly = true;
  }
  if (state.drag?.kind === "box-select") {
    selectInBounds(normalizedBounds(state.drag.startGrid, state.pointerGrid));
    needsInteractionOnly = true;
  }
  if (state.drag?.kind === "wire-bend") {
    const wire = findWire(state.drag.wireId);
    if (wire?.points[state.drag.pointIndex]) {
      state.drag.moved = true;
      wire.points[state.drag.pointIndex] = { ...state.pointerGrid };
      needsSceneOnly = true;
    }
  }
  if (state.drag?.kind === "pan") {
    state.pan.x = state.drag.pan.x + (event.clientX - state.drag.start.x);
    state.pan.y = state.drag.pan.y + (event.clientY - state.drag.start.y);
    needsViewportOnly = true;
  }
  if (needsSceneOnly) {
    renderScene({ simulateLogic: false });
  } else if (needsViewportOnly) {
    state.pointerGrid = screenToGrid(event.clientX, event.clientY);
    if (needsInteractionOnly) {
      setViewportTransform();
      renderInteractionLayers();
    } else {
      renderViewportOnly();
    }
  } else if (needsInteractionOnly) {
    renderInteractionLayers();
  } else {
    renderStatus();
  }
});

canvas.addEventListener("pointerleave", () => {
  updateControlCursor();
});

canvas.addEventListener("pointerup", (event) => {
  if (state.drag?.pointerId === event.pointerId) {
    const node = state.drag.kind === "control-input" ? findNode(state.drag.nodeId) : null;
    if ((node?.type === "MULTI_INPUT" || node?.type === "MULTI_TEST_INPUT") && !state.drag.moved && Number.isInteger(state.drag.bitIndex)) {
      const values = multiBitValues(node);
      setMultiBitValue(node, state.drag.bitIndex, !values[state.drag.bitIndex]);
    } else if ((node?.type === "MULTI_INPUT" || node?.type === "MULTI_TEST_INPUT") && !state.drag.moved) {
      state.undoStack.pop();
    } else if ((node?.type === "INPUT" || node?.type === "TEST_INPUT") && !state.drag.moved) {
      node.value = !node.value;
    } else if ((state.drag.kind === "selection" || state.drag.kind === "wire-bend" || state.drag.kind === "control-input") && !state.drag.moved) {
      state.undoStack.pop();
    }
    state.drag = null;
    canvas.releasePointerCapture(event.pointerId);
    updateControlCursor(event);
    render();
  }
});

canvas.addEventListener("pointerleave", hideAttachLabel);

canvas.addEventListener("contextmenu", (event) => {
  event.preventDefault();
  const node = nodeFromEventTarget(event.target);
  if (state.pendingPart === "BUS" || state.busStart) {
    showBusToolContextMenu(event.clientX, event.clientY);
    return;
  }
  if (selectedCount() > 1) {
    hideFanInMenu();
    return;
  }
  if (node) {
    selectNode(node.id);
    showNodeContextMenu(node, event.clientX, event.clientY);
    render();
  } else {
    showCanvasContextMenu(event.clientX, event.clientY);
  }
});

canvas.addEventListener("dblclick", (event) => {
  const node = nodeFromEventTarget(event.target);
  if (node?.type === "MACRO") openMacroViewerForNode(node);
});

document.addEventListener("pointerdown", (event) => {
  if (!fanInMenu.contains(event.target) && event.target.closest?.("#canvas") !== canvas) hideFanInMenu();
});

function preventBrowserZoomInApp(event) {
  if (event.target.closest?.("#digital-works-app")) event.preventDefault();
}

document.addEventListener("wheel", (event) => {
  if ((event.ctrlKey || event.metaKey) && !physicalZoomModifierDown && event.target.closest?.("#digital-works-app")) {
    event.preventDefault();
  }
}, { passive: false, capture: true });
document.addEventListener("gesturestart", preventBrowserZoomInApp, { passive: false });
document.addEventListener("gesturechange", preventBrowserZoomInApp, { passive: false });
document.addEventListener("gestureend", preventBrowserZoomInApp, { passive: false });

// Zoom around the cursor by preserving the grid coordinate under the pointer.
canvas.addEventListener("wheel", (event) => {
  if ((event.ctrlKey || event.metaKey) && physicalZoomModifierDown) return;
  event.preventDefault();
  if (state.scaleKeyDown && !topOpenModal() && (state.pendingPart === "BUS" || state.busStart)) {
    const delta = event.deltaY < 0 ? 1 : -1;
    scaleBusTool(event.shiftKey ? "x" : "y", delta);
    return;
  }
  if (state.rotateKeyDown && !topOpenModal()) {
    const direction = event.deltaY < 0 ? 1 : -1;
    if (state.pendingPart === "BUS" || state.busStart) {
      rotateBusToolBySteps(direction);
      return;
    }
    if (rotatePendingPartByQuarters(direction)) return;
    if (selectedCount()) {
      rotateSelectionByQuarters(direction);
      return;
    }
  }
  const before = screenToGrid(event.clientX, event.clientY);
  const factor = event.deltaY < 0 ? 1.1 : 0.9;
  state.zoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, state.zoom * factor));
  const rect = canvas.getBoundingClientRect();
  state.pan.x = event.clientX - rect.left - before.x * GRID * state.zoom;
  state.pan.y = event.clientY - rect.top - before.y * GRID * state.zoom;
  renderViewportOnly();
}, { passive: false });

document.addEventListener("keydown", (event) => {
  if (event.key === "Control" || event.key === "Meta") physicalZoomModifierDown = true;
  if (busToolMenuDraft && event.key === "Escape") {
    event.preventDefault();
    hideFanInMenu();
    return;
  }
  if (event.key === "F5") {
    if (!confirmDiscardUnsaved("reload")) {
      event.preventDefault();
      return;
    }
    if (hasUnsavedChanges()) {
      event.preventDefault();
      state.skipUnloadWarning = true;
      window.location.reload();
      return;
    }
  }
  const editingText = ["INPUT", "TEXTAREA"].includes(event.target?.tagName) || event.target?.isContentEditable;
  const activeModal = topOpenModal();
  if (activeModal) {
    if (activeModal === templateModal && !editingText) {
      if (event.key === "Escape") {
        event.preventDefault();
        cancelTemplateAction();
        return;
      }
      if (!event.ctrlKey && !event.metaKey && !event.altKey && (event.key === "r" || event.key === "R")) {
        event.preventDefault();
        state.template.rotateKeyDown = true;
        return;
      }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z" && event.shiftKey) {
        event.preventDefault();
        redoTemplate();
        return;
      }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z") {
        event.preventDefault();
        undoTemplate();
        return;
      }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "x") {
        event.preventDefault();
        cutTemplateSelection();
        return;
      }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "c") {
        event.preventDefault();
        copyTemplateSelection();
        return;
      }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "v") {
        event.preventDefault();
        pasteTemplateSelection();
        return;
      }
      if (!event.ctrlKey && !event.metaKey && !event.altKey && (event.key === "z" || event.key === "Z")) {
        event.preventDefault();
        if (mirrorTemplatePending("vertical")) return;
        mirrorSelectedTemplateObject("vertical");
        return;
      }
      if (!event.ctrlKey && !event.metaKey && !event.altKey && (event.key === "x" || event.key === "X")) {
        event.preventDefault();
        if (mirrorTemplatePending("horizontal")) return;
        mirrorSelectedTemplateObject("horizontal");
        return;
      }
      if (event.key === "Delete" || event.key === "Backspace") {
        event.preventDefault();
        deleteSelectedTemplateObject();
        return;
      }
    }
    if (activeModal === textModal && event.key === "Escape") {
      event.preventDefault();
      finishTextRequest(null);
      return;
    }
    if (activeModal === dimensionModal && event.key === "Escape") {
      event.preventDefault();
      finishDimensionRequest(null);
      return;
    }
    if (activeModal === cableSwitchModal && event.key === "Escape") {
      event.preventDefault();
      finishCableSwitchRequest(null);
      return;
    }
    return;
  }
  if (!editingText && (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z" && event.shiftKey) {
    event.preventDefault();
    redo();
    return;
  }
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s" && event.shiftKey) {
    event.preventDefault();
    void exportCircuit({ saveAs: true });
    return;
  }
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
    event.preventDefault();
    void exportCircuit();
    return;
  }
  if (!editingText && (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z") {
    event.preventDefault();
    undo();
    return;
  }
  if (!editingText && (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "x") {
    event.preventDefault();
    cutSelection();
    return;
  }
  if (!editingText && (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "c") {
    event.preventDefault();
    copySelection();
    return;
  }
  if (!editingText && (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "v") {
    event.preventDefault();
    pasteSelection();
    return;
  }
  if (event.code === "Space") {
    state.spaceDown = true;
    if (!editingText && !event.repeat && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault();
      toggleSimulationRunning();
    }
  }
  if (!editingText && !event.ctrlKey && !event.metaKey && !event.altKey && (event.key === "r" || event.key === "R")) {
    state.rotateKeyDown = true;
  }
  if (!editingText && !event.ctrlKey && !event.metaKey && !event.altKey && (event.key === "s" || event.key === "S")) {
    state.scaleKeyDown = true;
  }
  if (event.key === "m" || event.key === "M") setTool("move");
  if (event.key === "c" || event.key === "C") setTool("control");
  if (event.key === "w" || event.key === "W") setTool("wire");
  if (
    !editingText
    && templateModal.hidden
    && settingsModal.hidden
    && textModal.hidden
    && macroViewModal.hidden
    && !event.ctrlKey
    && !event.metaKey
    && !event.altKey
    && (event.key === "z" || event.key === "Z")
  ) {
    event.preventDefault();
    if (mirrorPendingPart("vertical")) return;
    mirrorSelection("vertical");
    return;
  }
  if (
    !editingText
    && templateModal.hidden
    && settingsModal.hidden
    && textModal.hidden
    && macroViewModal.hidden
    && !event.ctrlKey
    && !event.metaKey
    && !event.altKey
    && (event.key === "x" || event.key === "X")
  ) {
    event.preventDefault();
    if (mirrorPendingPart("horizontal")) return;
    mirrorSelection("horizontal");
    return;
  }
  if (event.key === "Delete" && selectedCount()) {
    deleteSelection();
  }
  if (event.key === "Escape") {
    setTool("move");
    clearSelection();
    clearPendingPart();
    hideAttachLabel();
    render();
  }
});

document.addEventListener("keyup", (event) => {
  if (event.key === "Control" || event.key === "Meta") physicalZoomModifierDown = event.ctrlKey || event.metaKey;
  if (event.code === "Space") state.spaceDown = false;
  if (event.key === "r" || event.key === "R") {
    state.rotateKeyDown = false;
    state.template.rotateKeyDown = false;
  }
  if (event.key === "s" || event.key === "S") state.scaleKeyDown = false;
});

window.addEventListener("blur", () => {
  physicalZoomModifierDown = false;
  state.spaceDown = false;
  state.rotateKeyDown = false;
  state.scaleKeyDown = false;
  state.template.rotateKeyDown = false;
});

window.addEventListener("beforeunload", (event) => {
  if (state.skipUnloadWarning) return;
  if (!hasUnsavedChanges()) return;
  event.preventDefault();
  event.returnValue = "";
});

document.querySelectorAll("[data-add]").forEach((button) => {
  button.addEventListener("click", () => {
    void setPendingPart(button.dataset.add);
  });
});

// Toolbar buttons use data attributes so adding a new gate or tool needs little JS wiring.
document.querySelectorAll("[data-tool]").forEach((button) => {
  button.addEventListener("click", () => setTool(button.dataset.tool));
});
simulationRunToggle?.addEventListener("click", toggleSimulationRunning);

document.getElementById("reset-view").addEventListener("click", () => {
  state.pan = { x: 520, y: 300 };
  state.zoom = DEFAULT_ZOOM;
  render();
});
document.getElementById("reset-simulation").addEventListener("click", resetSimulation);

document.getElementById("settings-open").addEventListener("click", openSettings);
document.getElementById("settings-close").addEventListener("click", closeSettings);
for (const modal of [settingsModal, templateModal, macroViewModal, textModal, dimensionModal, cableSwitchModal]) registerStackedModal(modal);
document.getElementById("template-close").addEventListener("click", closeTemplateEditor);
document.getElementById("template-tool-polygon").addEventListener("click", () => {
  state.template.tool = "polygon";
  state.template.draft = state.template.polygon.length ? [] : state.template.draft;
  renderTemplateEditor();
});
document.getElementById("template-tool-rectangle").addEventListener("click", async () => {
  if (state.template.polygon.length) {
    templateStatus.textContent = "A macro body polygon already exists.";
    return;
  }
  state.template.tool = "rectangle";
  renderTemplateEditor();
  const size = await requestDimensionValue({ title: "Rectangle Size", width: 8, height: 6 });
  if (size === null) {
    state.template.tool = "select";
    renderTemplateEditor();
    return;
  }
  if (!size.width || !size.height) {
    templateStatus.textContent = "Enter positive rectangle width and height.";
    state.template.tool = "select";
    renderTemplateEditor();
    return;
  }
  const center = templateViewCenterPoint();
  const left = Math.round(center.x - size.width / 2);
  const top = Math.round(center.y - size.height / 2);
  recordTemplateUndo();
  state.template.polygon = [
    { x: left, y: top },
    { x: left + size.width, y: top },
    { x: left + size.width, y: top + size.height },
    { x: left, y: top + size.height },
  ];
  state.template.draft = [];
  state.template.tool = "select";
  state.template.selected = { type: "polygon" };
  renderTemplateEditor();
});
document.getElementById("template-tool-pin").addEventListener("click", () => {
  state.template.tool = "pin";
  state.template.pendingOptions = {};
  renderTemplateEditor();
});
document.getElementById("template-tool-multi-pin").addEventListener("click", async () => {
  const source = findNode(state.template.sourcePinId);
  const defaultBits = source?.type === "MULTI_PIN" ? multiBitCount(source) : 4;
  const value = await requestTextValue({ title: "Template multi pin bits", value: String(defaultBits) });
  if (value === null) {
    state.template.tool = "select";
    renderTemplateEditor();
    return;
  }
  state.template.multiPinBits = Math.min(32, Math.max(1, Math.round(Number(value || defaultBits))));
  state.template.tool = "multi-pin";
  state.template.pendingOptions = {};
  renderTemplateEditor();
});
document.getElementById("template-tool-cable-pin").addEventListener("click", async () => {
  const source = findNode(state.template.sourcePinId);
  const defaultBits = source?.type === "CABLE_PIN" ? multiBitCount(source) : 4;
  const value = await requestTextValue({ title: "Template cable pin bits", value: String(defaultBits) });
  if (value === null) {
    state.template.tool = "select";
    renderTemplateEditor();
    return;
  }
  const parsedBits = Math.round(Number(value || defaultBits));
  state.template.cablePinBits = Number.isFinite(parsedBits) ? Math.min(32, Math.max(1, parsedBits)) : defaultBits;
  state.template.tool = "cable-pin";
  state.template.pendingOptions = {};
  renderTemplateEditor();
});
document.getElementById("template-tool-text").addEventListener("click", () => {
  state.template.tool = "text";
  renderTemplateEditor();
});
templateCanvas.addEventListener("pointerdown", async (event) => {
  if (event.button === 1) {
    event.preventDefault();
    state.template.drag = {
      kind: "pan",
      pointerId: event.pointerId,
      start: { x: event.clientX, y: event.clientY },
      view: { ...state.template.view },
    };
    templateCanvas.setPointerCapture(event.pointerId);
    return;
  }
  if (event.button === 2) return;
  event.preventDefault();
  const point = templatePointFromEvent(event);
  if (state.template.tool === "pin") {
    recordTemplateUndo();
    const pin = {
      id: uid("template-pin"),
      label: "",
      direction: "input",
      kind: "pin",
      bitLength: 1,
      x: point.x,
      y: point.y,
      sourcePinId: null,
      sourcePort: "",
    };
    state.template.pins.push(pin);
    state.template.selected = { type: "pin", id: pin.id };
    state.template.tool = "select";
    renderTemplateEditor();
    return;
  }
  if (state.template.tool === "cable-pin") {
    recordTemplateUndo();
    const bits = Math.min(32, Math.max(1, Math.round(Number(state.template.cablePinBits || 4))));
    const pin = {
      id: uid("template-pin"),
      label: "",
      direction: "input",
      kind: "cable",
      bitLength: bits,
      x: point.x,
      y: point.y,
      sourcePinId: null,
      sourcePort: "",
    };
    state.template.pins.push(pin);
    state.template.selected = { type: "pin", id: pin.id };
    state.template.tool = "select";
    renderTemplateEditor();
    return;
  }
  if (state.template.tool === "multi-pin") {
    recordTemplateUndo();
    const source = findNode(state.template.sourcePinId);
    const bits = Math.min(32, Math.max(1, Math.round(Number(state.template.multiPinBits || multiBitCount(source || { bits: 4 })))));
    addTemplateMultiPin(point, bits, null, state.template.pendingOptions || {});
    state.template.tool = "select";
    state.template.pendingOptions = {};
    renderTemplateEditor();
    return;
  }
  if (state.template.tool === "text") {
    const textValue = await requestTextValue({ title: "Text", value: state.settings.textDefaults.text || "Text" });
    if (textValue === null) {
      state.template.tool = "select";
      renderTemplateEditor();
      return;
    }
    recordTemplateUndo();
    const text = {
      id: uid("template-text"),
      x: point.x,
      y: point.y,
    };
    applyTextDefaults(text, textValue);
    state.template.texts.push(text);
    state.template.selected = { type: "text", id: text.id };
    state.template.tool = "select";
    renderTemplateEditor();
    return;
  }
  const textId = templateTextAtEvent(event);
  const pinTarget = event.target.closest?.(".template-pin");
  const pinId = pinTarget?.dataset.templatePinId || "";
  const bodyTarget = event.target.closest?.(".template-body");
  const hitsCurrentSelection = Boolean(state.template.selected) && (
    (textId && templateSelectionHas("text", textId))
    || (pinId && templateSelectionHas("pin", pinId))
    || (bodyTarget && templateSelectionHas("polygon"))
    || templatePointInSelectedBounds(point)
  );
  if (hitsCurrentSelection) {
    recordTemplateUndo();
    state.template.drag = { pointerId: event.pointerId, start: point, moved: false };
    templateCanvas.setPointerCapture(event.pointerId);
    renderTemplateEditor();
    return;
  }
  if (textId) {
    state.template.selected = { type: "text", id: textId };
    recordTemplateUndo();
    state.template.drag = { pointerId: event.pointerId, start: point, moved: false };
    templateCanvas.setPointerCapture(event.pointerId);
    renderTemplateEditor();
    return;
  }
  if (pinTarget) {
    state.template.selected = templateSelectionFromItems([{ type: "pin", id: pinId }]);
    recordTemplateUndo();
    state.template.drag = { pointerId: event.pointerId, start: point, moved: false };
    templateCanvas.setPointerCapture(event.pointerId);
    renderTemplateEditor();
    return;
  }
  if (bodyTarget) {
    state.template.selected = { type: "polygon" };
    recordTemplateUndo();
    state.template.drag = { pointerId: event.pointerId, start: point, moved: false };
    templateCanvas.setPointerCapture(event.pointerId);
    renderTemplateEditor();
    return;
  }
  if (state.template.tool !== "polygon" || state.template.polygon.length) {
    state.template.selected = null;
    state.template.drag = {
      kind: "box-select",
      pointerId: event.pointerId,
      startGrid: { ...point },
      moved: false,
    };
    templateCanvas.setPointerCapture(event.pointerId);
    renderTemplateEditor();
    return;
  }
  if (state.template.tool === "polygon") {
    if (state.template.polygon.length) {
      templateStatus.textContent = "매크로 몸체 다각형은 파일당 최대 1개만 만들 수 있습니다.";
      return;
    }
    if (state.template.draft.length >= 3 && samePoint(point, state.template.draft[0])) {
      recordTemplateUndo();
      state.template.polygon = state.template.draft;
      state.template.draft = [];
    } else {
      recordTemplateUndo();
      state.template.draft.push(point);
    }
  }
  renderTemplateEditor();
});
templateCanvas.addEventListener("pointermove", (event) => {
  state.template.pointer = templatePointFromEvent(event);
  if (!state.template.drag || state.template.drag.pointerId !== event.pointerId) {
    if ((state.template.tool === "polygon" && state.template.draft.length && !state.template.polygon.length) || templateHasPendingShadow()) {
      renderTemplateEditor();
    }
    return;
  }
  if (state.template.drag.kind === "pan") {
    const zoom = state.template.view.zoom;
    state.template.view.x = state.template.drag.view.x - (event.clientX - state.template.drag.start.x) / zoom;
    state.template.view.y = state.template.drag.view.y - (event.clientY - state.template.drag.start.y) / zoom;
    renderTemplateEditor();
    return;
  }
  if (state.template.drag.kind === "box-select") {
    const bounds = normalizedBounds(state.template.drag.startGrid, state.template.pointer);
    selectTemplateInBounds(bounds);
    state.template.drag.moved = true;
    renderTemplateEditor();
    return;
  }
  const point = state.template.pointer;
  const dx = point.x - state.template.drag.start.x;
  const dy = point.y - state.template.drag.start.y;
  if (!dx && !dy) return;
  moveSelectedTemplateObject(dx, dy);
  state.template.drag.start = point;
  state.template.drag.moved = true;
  renderTemplateEditor();
});
templateCanvas.addEventListener("pointerleave", () => {
  state.template.pointer = null;
  renderTemplateEditor();
});
templateCanvas.addEventListener("wheel", (event) => {
  event.preventDefault();
  if (state.template.rotateKeyDown && topOpenModal() === templateModal) {
    if (rotateTemplatePendingByQuarters(event.deltaY < 0 ? 1 : -1)) return;
    rotateSelectedTemplateObject(event.deltaY < 0 ? 1 : -1);
    return;
  }
  const rect = templateCanvas.getBoundingClientRect();
  const before = templateCanvas.createSVGPoint();
  before.x = event.clientX;
  before.y = event.clientY;
  const localBefore = before.matrixTransform(templateCanvas.getScreenCTM().inverse());
  const nextZoom = Math.min(
    TEMPLATE_MAX_ZOOM,
    Math.max(templateMinimumZoom(rect), state.template.view.zoom * (event.deltaY < 0 ? 1.1 : 0.9)),
  );
  state.template.view.zoom = nextZoom;
  state.template.view.x = localBefore.x - (event.clientX - rect.left) / nextZoom;
  state.template.view.y = localBefore.y - (event.clientY - rect.top) / nextZoom;
  renderTemplateEditor();
}, { passive: false });
templateCanvas.addEventListener("pointerup", (event) => {
  if (state.template.drag?.pointerId !== event.pointerId) return;
  if (state.template.drag.kind !== "pan" && state.template.drag.kind !== "box-select" && !state.template.drag.moved) state.template.undoStack.pop();
  state.template.drag = null;
  templateCanvas.releasePointerCapture(event.pointerId);
});
templateCanvas.addEventListener("contextmenu", (event) => {
  event.preventDefault();
  const textId = templateTextAtEvent(event);
  if (textId) {
    selectTemplateObject({ type: "text", id: textId });
    showTemplateTextContextMenu(textId, event.clientX, event.clientY);
    return;
  }
  const target = event.target.closest?.(".template-pin");
  if (!target) {
    if (event.target.closest?.(".template-body")) selectTemplateObject({ type: "polygon" });
    return;
  }
  selectTemplateObject({ type: "pin", id: target.dataset.templatePinId });
  showTemplatePinContextMenu(target.dataset.templatePinId, event.clientX, event.clientY);
});
settingsModal.addEventListener("pointerdown", (event) => {
  if (event.target === settingsModal) closeSettings();
});
macroViewModal.addEventListener("pointerdown", (event) => {
  if (event.target === macroViewModal) macroViewModal.hidden = true;
});
document.getElementById("macro-view-close").addEventListener("click", () => {
  macroViewModal.hidden = true;
  state.macroViewer.stack = [];
});
document.getElementById("macro-view-back").addEventListener("click", () => {
  if (state.macroViewer.stack.length > 1) {
    state.macroViewer.stack.pop();
    renderMacroViewer();
  }
});
macroViewCanvas.addEventListener("dblclick", (event) => {
  const target = event.target.closest?.(".macro-view-node");
  if (!target) return;
  const result = state.macroViewer.currentResult;
  const node = result?.nodes.find((item) => item.id === target.dataset.viewNodeId);
  if (node?.type !== "MACRO") return;
  const macro = findMacroForViewer(node.macroId);
  if (!macro) return;
  state.macroViewer.stack.push({
    macro,
    inputs: inputValuesForNode(node, result.values),
    title: macro.name || "Macro",
  });
  renderMacroViewer();
});
wireHotColorInput.addEventListener("input", () => {
  updateSettingsDraft((settings) => {
    settings.wireHotColor = wireHotColorInput.value;
  });
});
wireColdColorInput.addEventListener("input", () => {
  updateSettingsDraft((settings) => {
    settings.wireColdColor = wireColdColorInput.value;
  });
});
inputHotColorInput.addEventListener("input", () => {
  updateSettingsDraft((settings) => {
    settings.inputHotColor = inputHotColorInput.value;
  });
});
outputHotColorInput.addEventListener("input", () => {
  updateSettingsDraft((settings) => {
    settings.outputHotColor = outputHotColorInput.value;
  });
});
xSignalColorInput.addEventListener("input", () => {
  updateSettingsDraft((settings) => {
    settings.xSignalColor = xSignalColorInput.value;
  });
});
zSignalColorInput.addEventListener("input", () => {
  updateSettingsDraft((settings) => {
    settings.zSignalColor = zSignalColorInput.value;
  });
});
orderArrowColorInput.addEventListener("input", () => {
  updateSettingsDraft((settings) => {
    settings.orderArrowColor = orderArrowColorInput.value;
  });
});
dataArrowColorInput.addEventListener("input", () => {
  updateSettingsDraft((settings) => {
    settings.dataArrowColor = dataArrowColorInput.value;
  });
});
orderArrowDirectionInput.addEventListener("change", () => {
  updateSettingsDraft((settings) => {
    settings.orderArrowDirection = orderArrowDirectionInput.value;
  });
});
dataArrowDirectionInput.addEventListener("change", () => {
  updateSettingsDraft((settings) => {
    settings.dataArrowDirection = dataArrowDirectionInput.value;
  });
});
arrowScaleInput.addEventListener("input", () => {
  updateSettingsDraft((settings) => {
    settings.arrowScale = Math.min(2, Math.max(0.5, Number(arrowScaleInput.value || 1)));
  });
});
textDefaultContentInput.addEventListener("input", () => {
  updateSettingsDraft((settings) => {
    settings.textDefaults.text = textDefaultContentInput.value || "Text";
  });
});
textDefaultSizeInput.addEventListener("input", () => {
  updateSettingsDraft((settings) => {
    settings.textDefaults.fontSize = Math.max(8, Number(textDefaultSizeInput.value || DEFAULT_TEXT_SETTINGS.fontSize));
  });
});
textDefaultColorInput.addEventListener("input", () => {
  updateSettingsDraft((settings) => {
    settings.textDefaults.color = textDefaultColorInput.value;
  });
});
textDefaultFontInput.addEventListener("change", () => {
  updateSettingsDraft((settings) => {
    settings.textDefaults.fontFamily = textDefaultFontInput.value;
  });
});
textDefaultWidthInput.addEventListener("input", () => {
  updateSettingsDraft((settings) => {
    settings.textDefaults.w = Math.max(1, Math.round(Number(textDefaultWidthInput.value || NODE_SIZES.TEXT.w)));
  });
});
textDefaultHeightInput.addEventListener("input", () => {
  updateSettingsDraft((settings) => {
    settings.textDefaults.h = Math.max(1, Math.round(Number(textDefaultHeightInput.value || NODE_SIZES.TEXT.h)));
  });
});
textDefaultHorizontalInput.addEventListener("change", () => {
  updateSettingsDraft((settings) => {
    settings.textDefaults.align = textDefaultHorizontalInput.value;
  });
});
textDefaultVerticalInput.addEventListener("change", () => {
  updateSettingsDraft((settings) => {
    settings.textDefaults.verticalAlign = textDefaultVerticalInput.value;
  });
});
document.getElementById("settings-reset").addEventListener("click", () => {
  settingsDraft = normalizeSettings();
  syncSettingsInputs(settingsDraft);
});
document.getElementById("settings-save").addEventListener("click", saveSettings);
for (const input of [wireHotColorInput, wireColdColorInput, inputHotColorInput, outputHotColorInput, xSignalColorInput, zSignalColorInput, orderArrowColorInput, dataArrowColorInput]) {
  input.addEventListener("change", () => {
    input.dataset.editing = "false";
  });
}
textForm.addEventListener("submit", (event) => {
  event.preventDefault();
  textModalInput.setCustomValidity("");
  const validationMessage = pendingTextValidator ? pendingTextValidator(textModalInput.value) : "";
  if (validationMessage) {
    textModalInput.setCustomValidity(validationMessage);
    textModalInput.reportValidity();
    return;
  }
  finishTextRequest(textModalInput.value || "Text");
});
textModalCancel.addEventListener("click", () => finishTextRequest(null));
textModal.addEventListener("pointerdown", (event) => {
  if (event.target === textModal) finishTextRequest(null);
});
dimensionForm.addEventListener("submit", (event) => {
  event.preventDefault();
  finishDimensionRequest({
    width: parsePositiveGridLength(dimensionWidthInput.value),
    height: parsePositiveGridLength(dimensionHeightInput.value),
  });
});
dimensionCancel.addEventListener("click", () => finishDimensionRequest(null));
dimensionModal.addEventListener("pointerdown", (event) => {
  if (event.target === dimensionModal) finishDimensionRequest(null);
});
cableSwitchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const config = parseCableSwitchConfig();
  if (!config) return;
  finishCableSwitchRequest(config);
});
cableSwitchCancel.addEventListener("click", () => finishCableSwitchRequest(null));
cableSwitchModal.addEventListener("pointerdown", (event) => {
  if (event.target === cableSwitchModal) finishCableSwitchRequest(null);
});

document.getElementById("clear-circuit").addEventListener("click", () => {
  if (!confirmDiscardUnsaved("clear the circuit")) return;
  recordUndo();
  state.designName = "Untitled Design";
  state.fileHandle = null;
  state.fileName = "";
  state.nodes = [];
  state.wires = [];
  state.macros = [];
  state.macroInstanceValues = new Map();
  setSimulationRunning(false);
  resetTemplateState();
  clearSelection();
  renderMacroParts();
  render();
  markSavedState();
});

document.getElementById("save-file").addEventListener("click", () => exportCircuit());
document.getElementById("save-file-as").addEventListener("click", () => exportCircuit({ saveAs: true }));
document.getElementById("load-file-button").addEventListener("click", (event) => {
  if (event.target.id === "load-file") return;
  if (!("showOpenFilePicker" in window)) return;
  event.preventDefault();
  openCircuitFile();
});
document.getElementById("load-file").addEventListener("change", (event) => {
  const file = event.target.files?.[0];
  if (file) importCircuit(file);
  event.target.value = "";
});
document.getElementById("import-macro").addEventListener("change", (event) => {
  const file = event.target.files?.[0];
  if (file) importMacro(file);
  event.target.value = "";
});

macroDropZone.addEventListener("dragover", (event) => {
  event.preventDefault();
  macroDropZone.classList.add("drag-over");
});
macroDropZone.addEventListener("dragleave", () => {
  macroDropZone.classList.remove("drag-over");
});
macroDropZone.addEventListener("drop", (event) => {
  event.preventDefault();
  macroDropZone.classList.remove("drag-over");
  for (const file of event.dataTransfer?.files || []) importMacro(file);
});

syncSettingsInputs();
renderMacroParts();
document.querySelectorAll(".tool").forEach((button) => {
  const active = button.dataset.tool === state.tool;
  button.classList.toggle("active", active);
  button.setAttribute("aria-pressed", active ? "true" : "false");
});
updatePartButtons();
updateSimulationRunButton();
markSavedState();
setInterval(tickClocks, 25);
render();
