<template>
    <div class="container">
      <h2>DISCRETE MATHEMATICS</h2>
      
      <div class="calculator-section">
        <div class="input-section">
          <select id="operation" v-model="selectedOperation">
            <option value="">Select Operation</option>
            <option value="set-operations">Set Operations</option>
            <option value="graph-theory">Graph Theory</option>
            <option value="logic">Propositional Logic</option>
            <option value="relations">Relations</option>
          </select>
  
          <div class="operation-container">
            <!-- Set Operations -->
            <div class="operation-panel" :class="{ active: selectedOperation === 'set-operations' }" id="set-operations-panel">
              <div class="set-inputs">
                <textarea placeholder="Enter Set A (comma-separated)" v-model="setA"></textarea>
                <select id="set-operation" v-model="setOperation">
                  <option value="union">Union</option>
                  <option value="intersection">Intersection</option>
                  <option value="difference">Difference</option>
                  <option value="symmetric">Symmetric Difference</option>
                </select>
                <textarea placeholder="Enter Set B (comma-separated)" v-model="setB"></textarea>
              </div>
            </div>
  
            <!-- Graph Theory -->
            <div class="operation-panel" :class="{ active: selectedOperation === 'graph-theory' }" id="graph-theory-panel">
              <select id="graph-operation" v-model="graphOperation">
                <option value="adjacency">Adjacency Matrix</option>
                <option value="degree">Vertex Degrees</option>
                <option value="path">Shortest Path</option>
              </select>
              <textarea placeholder="Enter edges (format: v1-v2, v2-v3, ...)" v-model="graphInput"></textarea>
            </div>
  
            <!-- Logic -->
            <div class="operation-panel" :class="{ active: selectedOperation === 'logic' }" id="logic-panel">
              <select id="logic-operation" v-model="logicOperation">
                <option value="truth-table">Truth Table</option>
                <option value="simplify">Simplify Expression</option>
                <option value="equivalence">Check Equivalence</option>
              </select>
              <textarea placeholder="Enter logical expression" v-model="logicInput"></textarea>
            </div>
  
            <!-- Relations -->
            <div class="operation-panel" :class="{ active: selectedOperation === 'relations' }" id="relations-panel">
              <select id="relation-operation" v-model="relationOperation">
                <option value="properties">Check Properties</option>
                <option value="closure">Find Closure</option>
                <option value="composition">Composition</option>
              </select>
              <textarea placeholder="Enter relation pairs (format: (a,b), (b,c), ...)" v-model="relationInput"></textarea>
            </div>
          </div>
  
          <button id="calculate" @click="calculate">Calculate</button>
        </div>
  
        <div class="visualization-section">
          <canvas ref="visualizationCanvas"></canvas>
        </div>
  
        <div class="result-section">
          <h3>Result:</h3>
          <div id="result">{{ result }}</div>
        </div>
  
        <div class="steps-section">
          <h3>Solution Steps:</h3>
          <div id="steps">{{ steps }}</div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        selectedOperation: '',
        setA: '',
        setB: '',
        setOperation: 'union',
        graphOperation: 'adjacency',
        graphInput: '',
        logicOperation: 'truth-table',
        logicInput: '',
        relationOperation: 'properties',
        relationInput: '',
        result: '',
        steps: ''
      };
    },
    mounted() {
      this.initCanvas();
    },
    methods: {
      initCanvas() {
        const canvas = this.$refs.visualizationCanvas;
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
      },
      calculate() {
        switch (this.selectedOperation) {
          case 'set-operations':
            this.performSetOperation();
            break;
          case 'graph-theory':
            this.performGraphOperation();
            break;
          case 'logic':
            this.performLogicOperation();
            break;
          case 'relations':
            this.performRelationOperation();
            break;
        }
      },
      performSetOperation() {
        const arrayA = this.setA.split(',').map(item => item.trim());
        const arrayB = this.setB.split(',').map(item => item.trim());
        
        switch(this.setOperation) {
          case 'union':
            this.result = [...new Set([...arrayA, ...arrayB])].join(', ');
            this.steps = `Step 1: Combine all elements from Set A (${this.setA}) and Set B (${this.setB})\n` +
                         `Step 2: Remove duplicates\n` +
                         `Step 3: Final result: {${this.result}}`;
            break;
          case 'intersection':
            this.result = arrayA.filter(item => arrayB.includes(item)).join(', ');
            this.steps = `Step 1: Find elements common to both Set A (${this.setA}) and Set B (${this.setB})\n` +
                         `Step 2: Final result: {${this.result}}`;
            break;
          case 'difference':
            this.result = arrayA.filter(item => !arrayB.includes(item)).join(', ');
            this.steps = `Step 1: Find elements in Set A (${this.setA}) that are not in Set B (${this.setB})\n` +
                         `Step 2: Final result: {${this.result}}`;
            break;
          case 'symmetric':
            const diff1 = arrayA.filter(item => !arrayB.includes(item));
            const diff2 = arrayB.filter(item => !arrayA.includes(item));
            this.result = [...diff1, ...diff2].join(', ');
            this.steps = `Step 1: Find elements in Set A (${this.setA}) that are not in Set B (${this.setB}): {${diff1.join(', ')}}\n` +
                         `Step 2: Find elements in Set B (${this.setB}) that are not in Set A (${this.setA}): {${diff2.join(', ')}}\n` +
                         `Step 3: Combine these two sets\n` +
                         `Step 4: Final result: {${this.result}}`;
            break;
        }
        
        this.drawSetVisualization();
      },
      performGraphOperation() {
        if (!this.graphInput) {
          this.result = "Please enter graph edges";
          return;
        }
        
        const edges = this.processGraphInput();
        
        switch(this.graphOperation) {
          case 'adjacency':
            const { matrix, vertexList } = this.createAdjacencyMatrix(edges);
            this.result = "Adjacency Matrix:\n" + matrix.map(row => row.join(' ')).join('\n');
            this.steps = `Step 1: Identified vertices: ${vertexList.join(', ')}\n` +
                         `Step 2: Created ${vertexList.length}x${vertexList.length} matrix\n` +
                         `Step 3: Filled matrix based on edges`;
            this.drawGraphVisualization(edges, vertexList);
            break;
          case 'degree':
            const degrees = this.calculateVertexDegrees(edges);
            this.result = Object.entries(degrees)
              .map(([vertex, degree]) => `${vertex}: ${degree}`)
              .join('\n');
            this.steps = `Step 1: Count occurrences of each vertex in edge list\n` +
                         `Step 2: Final result: Degree of each vertex`;
            this.drawGraphVisualization(edges);
            break;
          // Add other graph operations as needed
        }
      },
      performLogicOperation() {
        if (!this.logicInput) {
          this.result = "Please enter a logical expression";
          return;
        }
        
        switch(this.logicOperation) {
          case 'truth-table':
            const table = this.createTruthTable(this.logicInput);
            this.result = "Truth Table:\n" + this.formatTruthTable(table);
            this.steps = `Step 1: Identified variables: ${Object.keys(table[0] || {}).join(', ')}\n` +
                         `Step 2: Generated ${table.length} combinations\n` +
                         `Step 3: Created truth table`;
            break;
          // Add other logic operations as needed
        }
      },
      performRelationOperation() {
        if (!this.relationInput) {
          this.result = "Please enter relation pairs";
          return;
        }
        
        const pairs = this.processRelation();
        
        switch(this.relationOperation) {
          case 'properties':
            const properties = this.checkRelationProperties(pairs);
            this.result = Object.entries(properties)
              .map(([prop, value]) => `${prop}: ${value}`)
              .join('\n');
            this.steps = `Step 1: Processed relation pairs\n` +
                         `Step 2: Checked each property\n` +
                         `Step 3: Compiled results`;
            break;
          // Add other relation operations as needed
        }
      },
      processGraphInput() {
        return this.graphInput.split(',').map(edge => {
          const [v1, v2] = edge.trim().split('-');
          return [v1.trim(), v2.trim()];
        });
      },
      createAdjacencyMatrix(edges) {
        const vertices = new Set();
        edges.forEach(([v1, v2]) => {
          vertices.add(v1);
          vertices.add(v2);
        });
        
        const vertexList = Array.from(vertices).sort();
        const matrix = Array(vertices.size).fill().map(() => Array(vertices.size).fill(0));
        
        edges.forEach(([v1, v2]) => {
          const i = vertexList.indexOf(v1);
          const j = vertexList.indexOf(v2);
          if (i >= 0 && j >= 0) {
            matrix[i][j] = 1;
            matrix[j][i] = 1;
          }
        });
        
        return { matrix, vertexList };
      },
      calculateVertexDegrees(edges) {
        const degrees = {};
        edges.forEach(([v1, v2]) => {
          degrees[v1] = (degrees[v1] || 0) + 1;
          degrees[v2] = (degrees[v2] || 0) + 1;
        });
        return degrees;
      },
      createTruthTable(expression) {
        // Extract variables (assuming they are uppercase letters)
        const variables = [...new Set(expression.match(/[A-Z]/g) || [])].sort();
        if (variables.length === 0) return [];
        
        const rows = Math.pow(2, variables.length);
        const table = [];
        
        for (let i = 0; i < rows; i++) {
          const row = {};
          variables.forEach((variable, index) => {
            row[variable] = (i & (1 << (variables.length - 1 - index))) !== 0;
          });
          table.push(row);
        }
        
        return table;
      },
      formatTruthTable(table) {
        if (table.length === 0) return "No variables found in expression";
        
        const variables = Object.keys(table[0]);
        const header = variables.join(' | ');
        const separator = '-'.repeat(header.length);
        
        const rows = table.map(row => {
          return variables.map(v => row[v] ? 'T' : 'F').join(' | ');
        });
        
        return [header, separator, ...rows].join('\n');
      },
      processRelation() {
        const pairs = this.relationInput.match(/\(([^)]+)\)/g) || [];
        return pairs.map(pair => {
          const [a, b] = pair.slice(1, -1).split(',').map(x => x.trim());
          return [a, b];
        });
      },
      checkRelationProperties(pairs) {
        const domain = new Set();
        const range = new Set();
        
        pairs.forEach(([a, b]) => {
          domain.add(a);
          range.add(b);
        });
        
        // Check reflexivity
        const isReflexive = Array.from(domain).every(a => 
          pairs.some(([x, y]) => x === a && y === a)
        );
        
        // Check symmetry
        const isSymmetric = pairs.every(([a, b]) => 
          a === b || pairs.some(([x, y]) => x === b && y === a)
        );
        
        // Check transitivity (simplified version)
        let isTransitive = true;
        for (const [a, b] of pairs) {
          for (const [c, d] of pairs) {
            if (b === c && !pairs.some(([x, y]) => x === a && y === d)) {
              isTransitive = false;
              break;
            }
          }
          if (!isTransitive) break;
        }
        
        return {
          'Reflexive': isReflexive ? 'Yes' : 'No',
          'Symmetric': isSymmetric ? 'Yes' : 'No',
          'Transitive': isTransitive ? 'Yes' : 'No',
          'Domain': Array.from(domain).join(', '),
          'Range': Array.from(range).join(', ')
        };
      },
      drawSetVisualization() {
        const canvas = this.$refs.visualizationCanvas;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(canvas.width, canvas.height) / 3;
        
        // Draw set A circle
        ctx.beginPath();
        ctx.arc(centerX - radius/2, centerY, radius, 0, 2 * Math.PI);
        ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = 'black';
        ctx.fillText('Set A', centerX - radius, centerY - radius - 10);
        
        // Draw set B circle
        ctx.beginPath();
        ctx.arc(centerX + radius/2, centerY, radius, 0, 2 * Math.PI);
        ctx.fillStyle = 'rgba(0, 0, 255, 0.3)';
        ctx.fill();
        ctx.stroke();
        ctx.fillText('Set B', centerX + radius/2, centerY - radius - 10);
      },
      drawGraphVisualization(edges, vertexList) {
        const canvas = this.$refs.visualizationCanvas;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Get unique vertices if not provided
        if (!vertexList) {
          const vertices = new Set();
          edges.forEach(([v1, v2]) => {
            vertices.add(v1);
            vertices.add(v2);
          });
          vertexList = Array.from(vertices);
        }
        
        // Calculate positions in a circle
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(canvas.width, canvas.height) / 2.5;
        const vertexPositions = {};
        
        vertexList.forEach((vertex, i) => {
          const angle = (i / vertexList.length) * 2 * Math.PI;
          vertexPositions[vertex] = {
            x: centerX + radius * Math.cos(angle),
            y: centerY + radius * Math.sin(angle)
          };
        });
        
        // Draw edges
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        edges.forEach(([v1, v2]) => {
          if (vertexPositions[v1] && vertexPositions[v2]) {
            ctx.beginPath();
            ctx.moveTo(vertexPositions[v1].x, vertexPositions[v1].y);
            ctx.lineTo(vertexPositions[v2].x, vertexPositions[v2].y);
            ctx.stroke();
          }
        });
        
        // Draw vertices
        ctx.fillStyle = 'blue';
        Object.entries(vertexPositions).forEach(([vertex, pos]) => {
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, 10, 0, 2 * Math.PI);
          ctx.fill();
          
          // Draw vertex label
          ctx.fillStyle = 'black';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(vertex, pos.x, pos.y);
          ctx.fillStyle = 'blue';
        });
      }
    }
  };
  </script>
  
  <style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
  
  .container {
    width: 90%;
    max-width: 1000px;
    background: white;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 0 15px rgba(0,0,0,0.1);
    margin: 20px auto;
    font-family: 'Press Start 2P', cursive;
  }
  
  h2 {
    text-align: center;
    color: #8B4513;
    margin-bottom: 30px;
    font-size: 1.5rem;
  }
  
  .calculator-section {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .input-section {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  
  select, textarea, input {
    padding: 12px;
    border: 2px solid #333;
    border-radius: 8px;
    font-family: inherit;
    font-size: 0.8rem;
    background: white;
  }
  
  textarea {
    min-height: 80px;
    resize: vertical;
  }
  
  .operation-panel {
    display: none;
    flex-direction: column;
    gap: 15px;
    padding: 15px;
    background: #f5f5f5;
    border-radius: 8px;
  }
  
  .operation-panel.active {
    display: flex;
  }
  
  .set-inputs {
    display: flex;
    gap: 10px;
    align-items: center;
  }
  
  button {
    padding: 15px;
    background: #ff6b6b;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-family: inherit;
    transition: 0.3s;
    font-size: 0.8rem;
  }
  
  button:hover {
    background: #ff5252;
    transform: translateY(-2px);
  }
  
  .visualization-section {
    height: 300px;
    background: #f8f9fa;
    border-radius: 8px;
    padding: 15px;
  }
  
  .result-section, .steps-section {
    background: #f5f5f5;
    padding: 20px;
    border-radius: 8px;
  }
  
  h3 {
    color: #2c3e50;
    margin: 0 0 15px 0;
    font-size: 1rem;
  }
  
  #result, #steps {
    white-space: pre-wrap;
    font-family: monospace;
    font-size: 0.9rem;
  }
  
  @media (max-width: 768px) {
    .container {
      width: 95%;
      padding: 20px;
    }
  
    .set-inputs {
      flex-direction: column;
    }
  }
  </style>