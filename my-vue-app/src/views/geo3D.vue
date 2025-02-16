<template>
    <div class="main-container">
      <div class="sidebar">
        <h2>3D GEOMETRY</h2>
        <div class="controls-section">
          <select v-model="selectedShape" id="shapeSelector">
            <option value="">Select Shape</option>
            <option value="cube">Cube</option>
            <option value="sphere">Sphere</option>
            <option value="cylinder">Cylinder</option>
            <option value="cone">Cone</option>
            <option value="pyramid">Regular Pyramid</option>
            <option value="prism">Regular Prism</option>
          </select>
          
          <div class="shape-inputs">
            <!-- Cube inputs -->
            <div v-if="selectedShape === 'cube'" class="input-group">
              <label for="sideLength">Side Length</label>
              <input type="number" id="sideLength" v-model="shapeParams.sideLength" step="0.1" min="0">
            </div>
            
            <!-- Sphere inputs -->
            <div v-if="selectedShape === 'sphere'" class="input-group">
              <label for="radius">Radius</label>
              <input type="number" id="radius" v-model="shapeParams.radius" step="0.1" min="0">
            </div>
            
            <!-- Cylinder inputs -->
            <div v-if="selectedShape === 'cylinder'">
              <div class="input-group">
                <label for="radius">Radius</label>
                <input type="number" id="radius" v-model="shapeParams.radius" step="0.1" min="0">
              </div>
              <div class="input-group">
                <label for="height">Height</label>
                <input type="number" id="height" v-model="shapeParams.height" step="0.1" min="0">
              </div>
            </div>
            
            <!-- Cone inputs -->
            <div v-if="selectedShape === 'cone'">
              <div class="input-group">
                <label for="radius">Base Radius</label>
                <input type="number" id="radius" v-model="shapeParams.radius" step="0.1" min="0">
              </div>
              <div class="input-group">
                <label for="height">Height</label>
                <input type="number" id="height" v-model="shapeParams.height" step="0.1" min="0">
              </div>
            </div>
            
            <!-- Pyramid inputs -->
            <div v-if="selectedShape === 'pyramid'">
              <div class="input-group">
                <label for="sides">Number of Base Sides</label>
                <input type="number" id="sides" v-model="shapeParams.sides" step="1" min="3" max="12">
              </div>
              <div class="input-group">
                <label for="baseLength">Base Side Length</label>
                <input type="number" id="baseLength" v-model="shapeParams.baseLength" step="0.1" min="0">
              </div>
              <div class="input-group">
                <label for="height">Height</label>
                <input type="number" id="height" v-model="shapeParams.height" step="0.1" min="0">
              </div>
            </div>
            
            <!-- Prism inputs -->
            <div v-if="selectedShape === 'prism'">
              <div class="input-group">
                <label for="sides">Number of Base Sides</label>
                <input type="number" id="sides" v-model="shapeParams.sides" step="1" min="3" max="12">
              </div>
              <div class="input-group">
                <label for="baseLength">Base Side Length</label>
                <input type="number" id="baseLength" v-model="shapeParams.baseLength" step="0.1" min="0">
              </div>
              <div class="input-group">
                <label for="height">Height</label>
                <input type="number" id="height" v-model="shapeParams.height" step="0.1" min="0">
              </div>
            </div>
          </div>
          
          <div class="action-buttons">
            <button id="drawShape" @click="drawShape">Draw Shape</button>
            <button id="calculateVolume" @click="calculateVolume">Calculate Volume</button>
            <button id="calculateSurfaceArea" @click="calculateSurfaceArea">Calculate Surface Area</button>
            <button id="clearBoard" @click="clearBoard">Clear Board</button>
          </div>
  
          <div class="view-controls">
            <h3>View Controls</h3>
            <button id="rotateXY" @click="rotateView('xy')">Rotate XY</button>
            <button id="rotateYZ" @click="rotateView('yz')">Rotate YZ</button>
            <button id="rotateXZ" @click="rotateView('xz')">Rotate XZ</button>
            <button id="resetView" @click="resetView">Reset View</button>
          </div>
  
          <div class="measurements">
            <h3>Measurements</h3>
            <div id="measurementResults">{{ measurementResults }}</div>
          </div>
          
          <div class="properties">
            <h3>Properties</h3>
            <div id="propertyResults">{{ propertyResults }}</div>
          </div>
        </div>
      </div>
      
      <div class="workspace">
        <div class="geogebra-container">
          <div id="ggb-element" ref="ggbElement"></div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted, reactive, onBeforeUnmount, watch } from 'vue';
  
  export default {
    name: 'Geo3DView',
    setup() {
      const ggbElement = ref(null);
      const ggbApp = ref(null);
      const selectedShape = ref('');
      const measurementResults = ref('');
      const propertyResults = ref('');
      
      const shapeParams = reactive({
        sideLength: 1,
        radius: 1,
        height: 1,
        sides: 3,
        baseLength: 1
      });
      
      // Initialize GeoGebra
      const initGeoGebra = () => {
        const appletObj = new window.GGBApplet({
          "appName": "3d",
          "width": window.innerWidth - 340,
          "height": window.innerHeight - 40,
          "showToolBar": true,
          "showAlgebraInput": true,
          "showMenuBar": true,
          "showToolBarHelp": true,
          "showResetIcon": true,
          "enableLabelDrags": true,
          "enableShiftDragZoom": true,
          "enableRightClick": true,
          "errorDialogsActive": true,
          "useBrowserForJS": false,
          "allowStyleBar": true,
          "preventFocus": false,
          "showZoomButtons": true,
          "scale": 1,
          "showFullscreenButton": true,
          "id": "ggb1",
          "perspective": "T",
          "appletOnLoad": function(api) {
            api.setAxisLabels(1, "x", "y", "z");
            api.setGridVisible(true);
            api.set3DAxesVisible(true, true, true);
            api.evalCommand("ZoomIn(-5, -5, -5, 5, 5, 5)");
          }
        }, true);
        
        appletObj.inject(ggbElement.value);
        ggbApp.value = appletObj;
      };
      
      // Handle window resizing
      const handleResize = () => {
        const newWidth = window.innerWidth - 340;
        const newHeight = window.innerHeight - 40;
        if (window.ggbApplet) {
          window.ggbApplet.setSize(newWidth, newHeight);
        }
      };
      
      // Drawing shape function
      const drawShape = () => {
        if (!selectedShape.value) {
          alert('Please select a shape first');
          return;
        }
        
        const ggbApi = window.ggbApplet;
        clearBoard();
        
        switch(selectedShape.value) {
          case 'cube':
            const sideLength = parseFloat(shapeParams.sideLength);
            if (isNaN(sideLength) || sideLength <= 0) {
              alert('Please enter a valid side length');
              return;
            }
            ggbApi.evalCommand(`Cube((0,0,0), (${sideLength},0,0), (0,${sideLength},0))`);
            break;
              
          case 'sphere':
            const radius = parseFloat(shapeParams.radius);
            if (isNaN(radius) || radius <= 0) {
              alert('Please enter a valid radius');
              return;
            }
            ggbApi.evalCommand(`Sphere((0,0,0), ${radius})`);
            break;
              
          case 'cylinder':
            const cylRadius = parseFloat(shapeParams.radius);
            const cylHeight = parseFloat(shapeParams.height);
            if (isNaN(cylRadius) || isNaN(cylHeight) || cylRadius <= 0 || cylHeight <= 0) {
              alert('Please enter valid dimensions');
              return;
            }
            ggbApi.evalCommand(`Cylinder((0,0,0), (0,0,${cylHeight}), ${cylRadius})`);
            break;
              
          case 'cone':
            const coneRadius = parseFloat(shapeParams.radius);
            const coneHeight = parseFloat(shapeParams.height);
            if (isNaN(coneRadius) || isNaN(coneHeight) || coneRadius <= 0 || coneHeight <= 0) {
              alert('Please enter valid dimensions');
              return;
            }
            ggbApi.evalCommand(`Cone((0,0,0), (0,0,${coneHeight}), ${coneRadius})`);
            break;
              
          case 'pyramid':
            const pyrSides = parseInt(shapeParams.sides);
            const pyrBaseLength = parseFloat(shapeParams.baseLength);
            const pyrHeight = parseFloat(shapeParams.height);
            if (isNaN(pyrSides) || isNaN(pyrBaseLength) || isNaN(pyrHeight) || 
                pyrSides < 3 || pyrBaseLength <= 0 || pyrHeight <= 0) {
              alert('Please enter valid dimensions');
              return;
            }
            // Create regular polygon base
            ggbApi.evalCommand(`Polygon((0,0,0),${pyrSides},${pyrBaseLength})`);
            // Create pyramid apex
            ggbApi.evalCommand(`(0,0,${pyrHeight})`);
            // Create pyramid using Pyramid command
            ggbApi.evalCommand(`Pyramid(poly1,(0,0,${pyrHeight}))`);
            break;
              
          case 'prism':
            const prismSides = parseInt(shapeParams.sides);
            const prismBaseLength = parseFloat(shapeParams.baseLength);
            const prismHeight = parseFloat(shapeParams.height);
            if (isNaN(prismSides) || isNaN(prismBaseLength) || isNaN(prismHeight) || 
                prismSides < 3 || prismBaseLength <= 0 || prismHeight <= 0) {
              alert('Please enter valid dimensions');
              return;
            }
            // Create regular polygon base
            ggbApi.evalCommand(`Polygon((0,0,0),${prismSides},${prismBaseLength})`);
            // Create prism using Prism command
            ggbApi.evalCommand(`Prism(poly1,(0,0,${prismHeight}))`);
            break;
        }
      };
      
      const calculateVolume = () => {
        if (!selectedShape.value) {
          alert('Please select a shape first');
          return;
        }
        
        let volume = 0;
        
        switch(selectedShape.value) {
          case 'cube':
            const sideLength = parseFloat(shapeParams.sideLength);
            volume = Math.pow(sideLength, 3);
            break;
              
          case 'sphere':
            const radius = parseFloat(shapeParams.radius);
            volume = (4/3) * Math.PI * Math.pow(radius, 3);
            break;
              
          case 'cylinder':
            const cylRadius = parseFloat(shapeParams.radius);
            const cylHeight = parseFloat(shapeParams.height);
            volume = Math.PI * Math.pow(cylRadius, 2) * cylHeight;
            break;
              
          case 'cone':
            const coneRadius = parseFloat(shapeParams.radius);
            const coneHeight = parseFloat(shapeParams.height);
            volume = (1/3) * Math.PI * Math.pow(coneRadius, 2) * coneHeight;
            break;
              
          case 'pyramid':
            const pyrSides = parseInt(shapeParams.sides);
            const pyrBaseLength = parseFloat(shapeParams.baseLength);
            const pyrHeight = parseFloat(shapeParams.height);
            const pyrBaseArea = (pyrSides * Math.pow(pyrBaseLength, 2)) / (4 * Math.tan(Math.PI / pyrSides));
            volume = (1/3) * pyrBaseArea * pyrHeight;
            break;
              
          case 'prism':
            const prismSides = parseInt(shapeParams.sides);
            const prismBaseLength = parseFloat(shapeParams.baseLength);
            const prismHeight = parseFloat(shapeParams.height);
            const prismBaseArea = (prismSides * Math.pow(prismBaseLength, 2)) / (4 * Math.tan(Math.PI / prismSides));
            volume = prismBaseArea * prismHeight;
            break;
        }
        
        measurementResults.value = `Volume: ${volume.toFixed(2)} cubic units`;
      };
      
      const calculateSurfaceArea = () => {
        if (!selectedShape.value) {
          alert('Please select a shape first');
          return;
        }
        
        let surfaceArea = 0;
        
        switch(selectedShape.value) {
          case 'cube':
            const sideLength = parseFloat(shapeParams.sideLength);
            surfaceArea = 6 * Math.pow(sideLength, 2);
            break;
              
          case 'sphere':
            const radius = parseFloat(shapeParams.radius);
            surfaceArea = 4 * Math.PI * Math.pow(radius, 2);
            break;
              
          case 'cylinder':
            const cylRadius = parseFloat(shapeParams.radius);
            const cylHeight = parseFloat(shapeParams.height);
            surfaceArea = 2 * Math.PI * cylRadius * (cylRadius + cylHeight);
            break;
              
          case 'cone':
            const coneRadius = parseFloat(shapeParams.radius);
            const coneHeight = parseFloat(shapeParams.height);
            const slantHeight = Math.sqrt(Math.pow(coneRadius, 2) + Math.pow(coneHeight, 2));
            surfaceArea = Math.PI * coneRadius * (coneRadius + slantHeight);
            break;
              
          case 'pyramid':
            const pyrSides = parseInt(shapeParams.sides);
            const pyrBaseLength = parseFloat(shapeParams.baseLength);
            const pyrHeight = parseFloat(shapeParams.height);
            const pyrBaseArea = (pyrSides * Math.pow(pyrBaseLength, 2)) / (4 * Math.tan(Math.PI / pyrSides));
            const pyrApothem = Math.sqrt(Math.pow(pyrHeight, 2) + Math.pow(pyrBaseLength/(2 * Math.sin(Math.PI/pyrSides)), 2));
            const pyrPerimeter = pyrSides * pyrBaseLength;
            surfaceArea = pyrBaseArea + (0.5 * pyrPerimeter * pyrApothem);
            break;
              
          case 'prism':
            const prismSides = parseInt(shapeParams.sides);
            const prismBaseLength = parseFloat(shapeParams.baseLength);
            const prismHeight = parseFloat(shapeParams.height);
            const prismBaseArea = (prismSides * Math.pow(prismBaseLength, 2)) / (4 * Math.tan(Math.PI / prismSides));
            const prismPerimeter = prismSides * prismBaseLength;
            surfaceArea = 2 * prismBaseArea + prismPerimeter * prismHeight;
            break;
        }
        
        measurementResults.value = `Surface Area: ${surfaceArea.toFixed(2)} square units`;
      };
      
      const clearBoard = () => {
        const ggbApi = window.ggbApplet;
        ggbApi.reset();
        ggbApi.setAxisLabels(1, "x", "y", "z");
        ggbApi.setGridVisible(true);
        ggbApi.set3DAxesVisible(true, true, true);
        measurementResults.value = '';
        propertyResults.value = '';
      };
      
      const rotateView = (plane) => {
        const ggbApi = window.ggbApplet;
        switch(plane) {
          case 'xy':
            ggbApi.evalCommand("SetViewDirection(0, 0, 1)");
            break;
          case 'yz':
            ggbApi.evalCommand("SetViewDirection(1, 0, 0)");
            break;
          case 'xz':
            ggbApi.evalCommand("SetViewDirection(0, 1, 0)");
            break;
        }
      };
      
      const resetView = () => {
        const ggbApi = window.ggbApplet;
        ggbApi.evalCommand("ZoomIn(-5, -5, -5, 5, 5, 5)");
        ggbApi.evalCommand("SetViewDirection(1, 1, 1)");
      };
      
      onMounted(() => {
        // Check if GeoGebra script is already loaded
        if (typeof window.GGBApplet === 'undefined') {
          const script = document.createElement('script');
          script.src = 'https://www.geogebra.org/apps/deployggb.js';
          script.async = true;
          script.onload = initGeoGebra;
          document.head.appendChild(script);
        } else {
          initGeoGebra();
        }
        
        // Add Google font
        const link = document.createElement('link');
        link.href = 'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap';
        link.rel = 'stylesheet';
        document.head.appendChild(link);
        
        window.addEventListener('resize', handleResize);
      });
      
      onBeforeUnmount(() => {
        window.removeEventListener('resize', handleResize);
      });
      
      return {
        ggbElement,
        selectedShape,
        shapeParams,
        measurementResults,
        propertyResults,
        drawShape,
        calculateVolume,
        calculateSurfaceArea,
        clearBoard,
        rotateView,
        resetView
      };
    }
  };
  </script>
  
  <style scoped>
  .main-container {
    display: flex;
    height: 100vh;
  }
  
  .sidebar {
    width: 300px;
    background: white;
    padding: 20px;
    box-shadow: 2px 0 10px rgba(0,0,0,0.1);
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .workspace {
    flex: 1;
    padding: 20px;
    background: #f8f9fa;
  }
  
  h2 {
    text-align: center;
    color: #2c3e50;
    font-size: 1.3rem;
    margin: 0 0 20px 0;
    font-family: 'Press Start 2P', cursive;
  }
  
  h3 {
    color: #2c3e50;
    margin: 0 0 10px 0;
    font-size: 0.9rem;
    font-family: 'Press Start 2P', cursive;
  }
  
  .controls-section {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  #shapeSelector {
    padding: 12px;
    border: 2px solid #34495e;
    border-radius: 8px;
    font-family: 'Press Start 2P', cursive;
    font-size: 0.8rem;
    width: 100%;
  }
  
  .shape-inputs {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  
  .input-group {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  
  .input-group label {
    font-size: 0.7rem;
    color: #34495e;
    font-family: 'Press Start 2P', cursive;
  }
  
  .input-group input {
    padding: 8px;
    border: 2px solid #34495e;
    border-radius: 5px;
    font-family: 'Press Start 2P', cursive;
    font-size: 0.8rem;
  }
  
  .action-buttons, .view-controls {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  button {
    padding: 12px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-family: 'Press Start 2P', cursive;
    transition: all 0.3s ease;
    font-size: 0.7rem;
    color: white;
  }
  
  #drawShape { background-color: #2ecc71; }
  #calculateVolume { background-color: #3498db; }
  #calculateSurfaceArea { background-color: #9b59b6; }
  #clearBoard { background-color: #e74c3c; }
  
  .view-controls button {
    background-color: #f39c12;
  }
  
  #resetView {
    background-color: #95a5a6;
  }
  
  button:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }
  
  .geogebra-container {
    width: 100%;
    height: calc(100vh - 40px);
    border-radius: 8px;
    overflow: hidden;
    background: white;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  }
  
  #ggb-element {
    width: 100%;
    height: 100%;
  }
  
  .measurements, .properties {
    background-color: #f1f5f9;
    padding: 15px;
    border-radius: 8px;
  }
  
  #measurementResults, #propertyResults {
    font-size: 0.7rem;
    line-height: 1.4;
    font-family: 'Press Start 2P', cursive;
  }
  
  @media (max-width: 768px) {
    .main-container {
      flex-direction: column;
    }
    
    .sidebar {
      width: 100%;
      max-height: 300px;
    }
    
    .workspace {
      height: calc(100vh - 300px);
    }
    
    .geogebra-container {
      height: 100%;
    }
  }
  </style>