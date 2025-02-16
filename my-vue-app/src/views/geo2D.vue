<template>
    <div class="main-container">
      <div class="sidebar">
        <h2>2D GEOMETRY</h2>
        <div class="controls-section">
          <select id="shapeSelector" v-model="selectedShape">
            <option value="">Select Shape</option>
            <option value="circle">Circle</option>
            <option value="triangle">Triangle</option>
            <option value="rectangle">Rectangle</option>
            <option value="polygon">Regular Polygon</option>
            <option value="ellipse">Ellipse</option>
          </select>
          
          <div class="shape-inputs">
            <!-- Circle inputs -->
            <div v-if="selectedShape === 'circle'" class="input-group">
              <label for="radius">Radius</label>
              <input type="number" id="radius" step="0.1" min="0" v-model="circleRadius">
            </div>
            
            <!-- Triangle inputs -->
            <div v-if="selectedShape === 'triangle'">
              <div class="input-group">
                <label for="sideA">Side A</label>
                <input type="number" id="sideA" step="0.1" min="0" v-model="triangleSideA">
              </div>
              <div class="input-group">
                <label for="sideB">Side B</label>
                <input type="number" id="sideB" step="0.1" min="0" v-model="triangleSideB">
              </div>
              <div class="input-group">
                <label for="sideC">Side C</label>
                <input type="number" id="sideC" step="0.1" min="0" v-model="triangleSideC">
              </div>
            </div>
            
            <!-- Rectangle inputs -->
            <div v-if="selectedShape === 'rectangle'">
              <div class="input-group">
                <label for="width">Width</label>
                <input type="number" id="width" step="0.1" min="0" v-model="rectangleWidth">
              </div>
              <div class="input-group">
                <label for="height">Height</label>
                <input type="number" id="height" step="0.1" min="0" v-model="rectangleHeight">
              </div>
            </div>
            
            <!-- Regular polygon inputs -->
            <div v-if="selectedShape === 'polygon'">
              <div class="input-group">
                <label for="sides">Number of Sides</label>
                <input type="number" id="sides" step="1" min="3" max="12" v-model="polygonSides">
              </div>
              <div class="input-group">
                <label for="sideLength">Side Length</label>
                <input type="number" id="sideLength" step="0.1" min="0" v-model="polygonSideLength">
              </div>
            </div>
            
            <!-- Ellipse inputs -->
            <div v-if="selectedShape === 'ellipse'">
              <div class="input-group">
                <label for="majorAxis">Major Axis</label>
                <input type="number" id="majorAxis" step="0.1" min="0" v-model="ellipseMajorAxis">
              </div>
              <div class="input-group">
                <label for="minorAxis">Minor Axis</label>
                <input type="number" id="minorAxis" step="0.1" min="0" v-model="ellipseMinorAxis">
              </div>
            </div>
          </div>
          
          <div class="action-buttons">
            <button id="drawShape" @click="drawShape">Draw Shape</button>
            <button id="calculateArea" @click="calculateArea">Calculate Area</button>
            <button id="calculatePerimeter" @click="calculatePerimeter">Calculate Perimeter</button>
            <button id="clearBoard" @click="clearBoard">Clear Board</button>
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
  export default {
    name: 'Geo2DView',
    data() {
      return {
        selectedShape: '',
        circleRadius: null,
        triangleSideA: null,
        triangleSideB: null,
        triangleSideC: null,
        rectangleWidth: null,
        rectangleHeight: null,
        polygonSides: null,
        polygonSideLength: null,
        ellipseMajorAxis: null,
        ellipseMinorAxis: null,
        measurementResults: '',
        propertyResults: '',
        ggbApi: null,
        GEOGEBRA_TOOLS: {
          MOVE: 0,
          NEW_POINT: 1,
          LINE: 2,
          PERPENDICULAR: 3,
          PARALLEL: 4,
          MIDPOINT: 5,
          CIRCLE_TWO_POINTS: 6,
          CIRCLE_THREE_POINTS: 7,
          CONIC_FIVE_POINTS: 8,
          POLYGON: 9,
          REGULAR_POLYGON: 10,
          INTERSECT: 11,
          ANGLE: 12,
          REFLECT: 13,
          ROTATE: 14,
          TRANSLATE: 15
        }
      };
    },
    mounted() {
      this.initGeoGebra();
      window.addEventListener('resize', this.handleResize);
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.handleResize);
    },
    methods: {
      initGeoGebra() {
        const ggbApp = new window.GGBApplet({
          "appName": "geometry",
          "width": window.innerWidth - 340,
          "height": window.innerHeight - 40,
          "showToolBar": true,
          "customToolBar": "0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15",
          "showMenuBar": true,
          "showAlgebraInput": true,
          "showAlgebraView": true,
          "algebraInputPosition": "bottom",
          "enableLabelDrags": true,
          "enableShiftDragZoom": true,
          "enableRightClick": true,
          "showResetIcon": true,
          "showFullscreenButton": true,
          "useBrowserForJS": false,
          "allowStyleBar": true,
          "preventFocus": false,
          "showZoomButtons": true,
          "showSuggestionButtons": true,
          "showAnimationButton": true,
          "scale": 1.0,
          "disableAutoScale": false,
          "allowUpscale": true,
          "clickToLoad": false,
          "borderColor": null,
          "buttonShadows": false,
          "buttonBorders": false,
          "preventFocus": true,
          "appletOnLoad": (api) => {
            this.ggbApi = api;
            api.setCoordSystem(-10, 10, -10, 10);
            api.setGridVisible(true);
            api.setAxesVisible(true, true);
            api.setGridStyle(1);
            api.setGridIsBold(true);
            api.setGridOpacity(0.3);
            api.setAxisSteps(1, 1);
            api.setAxisLabels(1, "x", "y");
            api.setPointCapture(1);
            api.setColor("grid", 128, 128, 128);
            api.setLineThickness(2);
            api.setPointSize(5);
            
            api.registerUpdateListener((objName) => {
              this.updateMeasurements(api, objName);
            });
          }
        }, true);
  
        ggbApp.inject(this.$refs.ggbElement);
        window.ggbApplet = ggbApp; // This is needed for some GeoGebra operations
      },
      handleResize() {
        if (window.ggbApplet) {
          const newWidth = window.innerWidth - 340;
          const newHeight = window.innerHeight - 40;
          window.ggbApplet.setSize(newWidth, newHeight);
        }
      },
      updateMeasurements(api, objName) {
        // Get object type
        const objectType = api.getObjectType(objName);
        
        // Initialize measurements HTML
        let measurementsHTML = '';
        let propertiesHTML = '';
        
        switch(objectType) {
          case 'point':
            const x = api.getXcoord(objName);
            const y = api.getYcoord(objName);
            measurementsHTML += `Point ${objName}: (${x.toFixed(2)}, ${y.toFixed(2)})<br>`;
            break;
                
          case 'segment':
            const length = api.getValue(objName);
            measurementsHTML += `Length of ${objName}: ${length.toFixed(2)}<br>`;
            
            // Calculate and show slope if it's a line segment
            const startPoint = api.getCommandString(objName).split(',')[0].slice(8);
            const endPoint = api.getCommandString(objName).split(',')[1].slice(0, -1);
            const x1 = api.getXcoord(startPoint);
            const y1 = api.getYcoord(startPoint);
            const x2 = api.getXcoord(endPoint);
            const y2 = api.getYcoord(endPoint);
            const slope = (y2 - y1) / (x2 - x1);
            propertiesHTML += `Slope: ${slope.toFixed(2)}<br>`;
            break;
                
          case 'polygon':
            const area = api.getArea(objName);
            const perimeter = api.getValue(objName);
            measurementsHTML += `Area: ${area.toFixed(2)}<br>`;
            measurementsHTML += `Perimeter: ${perimeter.toFixed(2)}<br>`;
            
            // Calculate and show number of sides
            const vertices = api.getValue(objName + ".VertexNumber");
            propertiesHTML += `Number of sides: ${vertices}<br>`;
            
            // Check if regular
            const isRegular = api.getValue(objName + ".Regular");
            if(isRegular) {
              propertiesHTML += "Regular polygon<br>";
            }
            break;
                
          case 'circle':
            const radius = api.getValue(objName + ".Radius");
            const circumference = 2 * Math.PI * radius;
            const circleArea = Math.PI * radius * radius;
            measurementsHTML += `Radius: ${radius.toFixed(2)}<br>`;
            measurementsHTML += `Circumference: ${circumference.toFixed(2)}<br>`;
            measurementsHTML += `Area: ${circleArea.toFixed(2)}<br>`;
            break;
                
          case 'angle':
            const degrees = api.getValue(objName) * 180 / Math.PI;
            measurementsHTML += `Angle: ${degrees.toFixed(2)}°<br>`;
            
            // Check if right angle
            if(Math.abs(degrees - 90) < 0.01) {
              propertiesHTML += "Right angle<br>";
            }
            break;
        }
        
        // Update the display
        if(measurementsHTML) {
          this.measurementResults = measurementsHTML;
        }
        if(propertiesHTML) {
          this.propertyResults = propertiesHTML;
        }
      },
      drawShape() {
        if (!this.ggbApi) return;
  
        switch (this.selectedShape) {
          case 'circle':
            this.drawCircle();
            break;
          case 'triangle':
            this.drawTriangle();
            break;
          case 'rectangle':
            this.drawRectangle();
            break;
          case 'polygon':
            this.drawRegularPolygon();
            break;
          case 'ellipse':
            this.drawEllipse();
            break;
        }
      },
      drawCircle() {
        const radius = parseFloat(this.circleRadius);
        if (isNaN(radius) || radius <= 0) {
          alert('Please enter a valid radius');
          return;
        }
  
        this.ggbApi.evalCommand(`Circle((0, 0), ${radius})`);
      },
      drawTriangle() {
        const a = parseFloat(this.triangleSideA);
        const b = parseFloat(this.triangleSideB);
        const c = parseFloat(this.triangleSideC);
        
        if (isNaN(a) || isNaN(b) || isNaN(c) || a <= 0 || b <= 0 || c <= 0) {
          alert('Please enter valid side lengths');
          return;
        }
        
        // Check triangle inequality
        if (a + b <= c || b + c <= a || a + c <= b) {
          alert('These side lengths cannot form a triangle');
          return;
        }
  
        // Using law of cosines to calculate angles
        const angleA = Math.acos((b*b + c*c - a*a)/(2*b*c));
        
        this.ggbApi.evalCommand("A = (0, 0)");
        this.ggbApi.evalCommand(`B = (${c}, 0)`);
        const x = b * Math.cos(angleA);
        const y = b * Math.sin(angleA);
        this.ggbApi.evalCommand(`C = (${x}, ${y})`);
        this.ggbApi.evalCommand("Polygon(A, B, C)");
      },
      drawRectangle() {
        const width = parseFloat(this.rectangleWidth);
        const height = parseFloat(this.rectangleHeight);
        
        if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
          alert('Please enter valid dimensions');
          return;
        }
  
        this.ggbApi.evalCommand(`Rectangle((0, 0), (${width}, 0), (${width}, ${height}), (0, ${height}))`);
      },
      drawRegularPolygon() {
        const sides = parseInt(this.polygonSides);
        const length = parseFloat(this.polygonSideLength);
        
        if (isNaN(sides) || isNaN(length) || sides < 3 || sides > 12 || length <= 0) {
          alert('Please enter a valid number of sides (3-12) and side length');
          return;
        }
  
        this.ggbApi.evalCommand(`Regular(${sides}, (0, 0), (${length}, 0))`);
      },
      drawEllipse() {
        const a = parseFloat(this.ellipseMajorAxis);
        const b = parseFloat(this.ellipseMinorAxis);
        
        if (isNaN(a) || isNaN(b) || a <= 0 || b <= 0) {
          alert('Please enter valid axis lengths');
          return;
        }
  
        this.ggbApi.evalCommand(`Ellipse((0, 0), (${a}, 0), ${b})`);
      },
      calculateArea() {
        if (!this.selectedShape || !this.ggbApi) return;
        
        try {
          const area = this.ggbApi.getArea('shape1');
          this.measurementResults = `Area: ${area.toFixed(2)} square units`;
        } catch (e) {
          alert('Unable to calculate area. Make sure a shape is drawn.');
        }
      },
      calculatePerimeter() {
        if (!this.selectedShape || !this.ggbApi) return;
        
        try {
          const perimeter = this.ggbApi.getPerimeter('shape1');
          this.measurementResults = `Perimeter: ${perimeter.toFixed(2)} units`;
        } catch (e) {
          alert('Unable to calculate perimeter. Make sure a shape is drawn.');
        }
      },
      clearBoard() {
        if (this.ggbApi) {
          this.ggbApi.reset();
          this.measurementResults = '';
          this.propertyResults = '';
        }
      }
    }
  };
  </script>
  
  <style scoped>
  body {
    font-family: 'Press Start 2P', cursive;
    background-color: #ffe4c4;
    margin: 0;
    padding: 0;
    min-height: 100vh;
  }
  
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
    font-family: inherit;
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
  }
  
  .input-group input {
    padding: 8px;
    border: 2px solid #34495e;
    border-radius: 5px;
    font-family: inherit;
    font-size: 0.8rem;
  }
  
  .action-buttons {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  button {
    padding: 12px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.3s ease;
    font-size: 0.7rem;
    color: white;
    width: 100%;
  }
  
  #drawShape {
    background-color: #2ecc71;
  }
  
  #calculateArea {
    background-color: #3498db;
  }
  
  #calculatePerimeter {
    background-color: #9b59b6;
  }
  
  #clearBoard {
    background-color: #e74c3c;
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
  
  h3 {
    color: #2c3e50;
    margin: 0 0 10px 0;
    font-size: 0.9rem;
  }
  
  #measurementResults, #propertyResults {
    font-size: 0.7rem;
    line-height: 1.4;
  }
  
  </style>