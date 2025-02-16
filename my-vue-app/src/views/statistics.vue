<template>
  <div class="statistics-page">
    <div class="calculator-container">
      <h2>STATISTICS CALCULATOR</h2>
      
      <div class="main-content">
        <div class="table-section">
          <div class="table-controls">
            <button id="addRow" class="control-button" @click="addRow">Add Row</button>
            <button id="deleteRow" class="control-button" @click="deleteRow">Delete Row</button>
            <button id="clearTable" class="control-button" @click="clearTable">Clear Table</button>
            <button id="sortData" class="control-button sort-button" @click="sortData">Sort Data</button>
          </div>
          
          <div class="table-container">
            <table id="dataTable">
              <thead>
                <tr>
                  <th>Class/Value (X)</th>
                  <th>Frequency (f)</th>
                  <th>Cum. Freq</th>
                  <th>Rel. Freq (%)</th>
                  <th>Cum. Rel. Freq (%)</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, index) in tableData" :key="index">
                  <td><input type="number" class="data-input x-value" step="any" v-model="row.x" @input="updateFrequencyCalculations"></td>
                  <td><input type="number" class="data-input frequency" min="0" step="any" v-model="row.f" @input="updateFrequencyCalculations"></td>
                  <td class="cum-freq">{{ row.cumFreq }}</td>
                  <td class="rel-freq">{{ row.relFreq }}%</td>
                  <td class="cum-rel-freq">{{ row.cumRelFreq }}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="formulas-section">
          <div class="formula-category">
            <h3>Basic Statistics</h3>
            <div class="formula-buttons">
              <button class="formula-button" @click="calculateStatistic('mean')">Mean (x̄)</button>
              <button class="formula-button" @click="calculateStatistic('median')">Median</button>
              <button class="formula-button" @click="calculateStatistic('mode')">Mode</button>
              <button class="formula-button" @click="calculateStatistic('range')">Range</button>
            </div>
          </div>

          <div class="formula-category">
            <h3>Dispersion</h3>
            <div class="formula-buttons">
              <button class="formula-button" @click="calculateStatistic('variance')">Variance (σ²)</button>
              <button class="formula-button" @click="calculateStatistic('stddev')">Std Dev (σ)</button>
              <button class="formula-button" @click="calculateStatistic('cv')">Coef. of Variation</button>
            </div>
          </div>

          <div class="formula-category">
            <h3>Position Measures</h3>
            <div class="formula-buttons">
              <button class="formula-button" @click="calculateStatistic('quartiles')">Quartiles</button>
              <button class="formula-button" @click="calculateStatistic('iqr')">IQR</button>
              <button class="formula-button" @click="calculateStatistic('percentile')">Percentiles</button>
            </div>
          </div>

          <div class="formula-category">
            <h3>Distribution Analysis</h3>
            <div class="formula-buttons">
              <button class="formula-button" @click="calculateStatistic('skewness')">Skewness</button>
              <button class="formula-button" @click="calculateStatistic('kurtosis')">Kurtosis</button>
            </div>
          </div>
          
          <div class="results-display">
            <h3>Results:</h3>
            <div id="results" v-html="results.join('<br>')"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>


export default {
  data() {
    return {
      tableData: [
        { 
          x: null, 
          f: null, 
          cumFreq: '0.00', 
          relFreq: '0.00', 
          cumRelFreq: '0.00' 
        }
      ],
      results: []
    };
  },
  mounted() {
    // Load math.js from CDN
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mathjs/9.4.4/math.js';
    script.async = true;
    document.head.appendChild(script);
  },
  methods: {
    addRow() {
      this.tableData.push({
        x: null, 
        f: null, 
        cumFreq: '0.00', 
        relFreq: '0.00', 
        cumRelFreq: '0.00'
      });
      this.$nextTick(() => {
        this.updateFrequencyCalculations();
      });
    },
    
    deleteRow() {
      if (this.tableData.length > 1) {
        this.tableData.pop();
        this.updateFrequencyCalculations();
      }
    },
    
    clearTable() {
      this.tableData = [{
        x: null, 
        f: null, 
        cumFreq: '0.00', 
        relFreq: '0.00', 
        cumRelFreq: '0.00'
      }];
      this.results = [];
    },
    
    sortData() {
      this.tableData.sort((a, b) => {
        const aVal = parseFloat(a.x) || 0;
        const bVal = parseFloat(b.x) || 0;
        return aVal - bVal;
      });
      this.updateFrequencyCalculations();
    },
    
    updateFrequencyCalculations() {
      let cumFreq = 0;
      let totalFreq = 0;
      
      // Calculate total frequency
      this.tableData.forEach(row => {
        const freq = parseFloat(row.f) || 0;
        totalFreq += freq;
      });
      
      // Update frequency columns
      this.tableData.forEach(row => {
        const freq = parseFloat(row.f) || 0;
        cumFreq += freq;
        
        // Cumulative Frequency
        row.cumFreq = cumFreq.toFixed(2);
        
        // Relative Frequency (%)
        const relFreq = totalFreq > 0 ? (freq / totalFreq * 100) : 0;
        row.relFreq = relFreq.toFixed(2);
        
        // Cumulative Relative Frequency (%)
        const cumRelFreq = totalFreq > 0 ? (cumFreq / totalFreq * 100) : 0;
        row.cumRelFreq = cumRelFreq.toFixed(2);
      });
    },
    
    // Statistical Calculation Functions
    getTableData() {
      const data = [];
      
      this.tableData.forEach(row => {
        const x = parseFloat(row.x);
        const f = parseFloat(row.f) || 1;
        
        if (!isNaN(x)) {
          data.push({ x, f });
        }
      });
      
      return data;
    },
    
    calculateMean(data) {
      const sum = data.reduce((acc, { x, f }) => acc + x * f, 0);
      const count = data.reduce((acc, { f }) => acc + f, 0);
      return (sum / count).toFixed(4);
    },
    
    calculateMedian(data) {
      const expandedData = [];
      data.forEach(({ x, f }) => {
        for (let i = 0; i < f; i++) {
          expandedData.push(x);
        }
      });
      expandedData.sort((a, b) => a - b);
      
      const mid = Math.floor(expandedData.length / 2);
      if (expandedData.length % 2 === 0) {
        return ((expandedData[mid - 1] + expandedData[mid]) / 2).toFixed(4);
      }
      return expandedData[mid].toFixed(4);
    },
    
    calculateMode(data) {
      const frequency = {};
      let maxFreq = 0;
      let modes = [];

      data.forEach(({ x, f }) => {
        const key = x.toString();
        frequency[key] = (frequency[key] || 0) + f;
        if (frequency[key] > maxFreq) {
          maxFreq = frequency[key];
          modes = [x];
        } else if (frequency[key] === maxFreq) {
          modes.push(x);
        }
      });

      return modes.map(x => x.toFixed(4)).join(', ');
    },
    
    calculateRange(data) {
      const values = data.map(({ x }) => x);
      return (Math.max(...values) - Math.min(...values)).toFixed(4);
    },
    
    calculateVariance(data) {
      const mean = parseFloat(this.calculateMean(data));
      const sumSquaredDiff = data.reduce((acc, { x, f }) => {
        return acc + (Math.pow(x - mean, 2) * f);
      }, 0);
      const count = data.reduce((acc, { f }) => acc + f, 0);
      return (sumSquaredDiff / count).toFixed(4);
    },
    
    calculateStdDev(data) {
      return Math.sqrt(parseFloat(this.calculateVariance(data))).toFixed(4);
    },
    
    calculateCoefVariation(data) {
      const mean = parseFloat(this.calculateMean(data));
      const stdDev = parseFloat(this.calculateStdDev(data));
      return ((stdDev / mean) * 100).toFixed(4);
    },
    
    calculateQuartiles(data) {
      const expandedData = [];
      data.forEach(({ x, f }) => {
        for (let i = 0; i < f; i++) {
          expandedData.push(x);
        }
      });
      expandedData.sort((a, b) => a - b);
      
      const q1Index = Math.floor(expandedData.length * 0.25);
      const q2Index = Math.floor(expandedData.length * 0.5);
      const q3Index = Math.floor(expandedData.length * 0.75);

      return `Q1: ${expandedData[q1Index].toFixed(4)}, Q2: ${expandedData[q2Index].toFixed(4)}, Q3: ${expandedData[q3Index].toFixed(4)}`;
    },
    
    calculateIQR(data) {
      const expandedData = [];
      data.forEach(({ x, f }) => {
        for (let i = 0; i < f; i++) {
          expandedData.push(x);
        }
      });
      expandedData.sort((a, b) => a - b);
      
      const q1Index = Math.floor(expandedData.length * 0.25);
      const q3Index = Math.floor(expandedData.length * 0.75);
      
      return (expandedData[q3Index] - expandedData[q1Index]).toFixed(4);
    },
    
    calculatePercentile(data, p) {
      const expandedData = [];
      data.forEach(({ x, f }) => {
        for (let i = 0; i < f; i++) {
          expandedData.push(x);
        }
      });
      expandedData.sort((a, b) => a - b);
      
      const index = Math.ceil((p/100) * expandedData.length) - 1;
      return expandedData[index].toFixed(4);
    },
    
    calculateSkewness(data) {
      const mean = parseFloat(this.calculateMean(data));
      const stdDev = parseFloat(this.calculateStdDev(data));
      const n = data.reduce((acc, { f }) => acc + f, 0);
      
      const sumCubedDeviations = data.reduce((acc, { x, f }) => {
        return acc + (Math.pow(x - mean, 3) * f);
      }, 0);
      
      return (sumCubedDeviations / (n * Math.pow(stdDev, 3))).toFixed(4);
    },
    
    calculateKurtosis(data) {
      const mean = parseFloat(this.calculateMean(data));
      const stdDev = parseFloat(this.calculateStdDev(data));
      const n = data.reduce((acc, { f }) => acc + f, 0);
      
      const sumQuarticDeviations = data.reduce((acc, { x, f }) => {
        return acc + (Math.pow(x - mean, 4) * f);
      }, 0);
      
      return ((sumQuarticDeviations / (n * Math.pow(stdDev, 4))) - 3).toFixed(4);
    },
    
    calculateStatistic(type) {
      const data = this.getTableData();
      if (data.length === 0) {
        this.results.push('Please enter some data first.');
        return;
      }

      let result;
      switch (type) {
        case 'mean':
          result = this.calculateMean(data);
          break;
        case 'median':
          result = this.calculateMedian(data);
          break;
        case 'mode':
          result = this.calculateMode(data);
          break;
        case 'range':
          result = this.calculateRange(data);
          break;
        case 'variance':
          result = this.calculateVariance(data);
          break;
        case 'stddev':
          result = this.calculateStdDev(data);
          break;
        case 'cv':
          result = this.calculateCoefVariation(data);
          break;
        case 'quartiles':
          result = this.calculateQuartiles(data);
          break;
        case 'iqr':
          result = this.calculateIQR(data);
          break;
        case 'percentile':
          const p = prompt('Enter percentile (1-100):', '75');
          if (p) {
            result = this.calculatePercentile(data, parseFloat(p));
          }
          break;
        case 'skewness':
          result = this.calculateSkewness(data);
          break;
        case 'kurtosis':
          result = this.calculateKurtosis(data);
          break;
      }

      if (result) {
        this.results.push(`${type.toUpperCase()}: ${result}`);
      }
    }
  }
};
</script>

<style scoped>
.statistics-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.calculator-container {
  width: 90%;
  max-width: 1200px;
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 0 15px rgba(0,0,0,0.1);
  margin: 30px auto;
}

h2 {
  text-align: center;
  color: #8B4513;
  margin-bottom: 30px;
  font-size: 1.2rem;
}

.main-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.table-section {
  padding: 20px;
  background: #f5f5f5;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.table-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}

.control-button {
  padding: 10px 15px;
  font-family: inherit;
  background: #ff6b6b;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.6rem;
}

.control-button:hover {
  background: #ff5252;
}

.sort-button {
  background: #4CAF50;
}

.sort-button:hover {
  background: #45a049;
}

.table-container {
  overflow-x: auto;
  max-height: 400px;
}

table {
  width: 100%;
  border-collapse: collapse;
  background: white;
}

th, td {
  padding: 10px;
  border: 1px solid #ddd;
  text-align: center;
  font-size: 0.6rem;
}

th {
  background: #ff6b6b;
  color: white;
}

.data-input {
  width: 100%;
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 3px;
  font-family: inherit;
  text-align: center;
  font-size: 0.6rem;
}

.formulas-section {
  padding: 20px;
  background: #f0f8ff;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.formula-buttons {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-bottom: 20px;
}

.formula-button {
  padding: 15px;
  font-family: inherit;
  background: white;
  border: 2px solid #333;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.6rem;
}

.formula-button:hover {
  background: #f5f5f5;
  transform: translateY(-2px);
}

.results-display {
  background: white;
  padding: 20px;
  border-radius: 5px;
  margin-top: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.results-display h3 {
  margin-top: 0;
  color: #8B4513;
  font-size: 0.8rem;
}

#results {
  font-family: monospace;
  white-space: pre-wrap;
  line-height: 1.5;
  font-size: 0.7rem;
}

.formula-category {
  margin-bottom: 20px;
  padding: 15px;
  background: white;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.formula-category h3 {
  margin: 0 0 10px 0;
  color: #8B4513;
  font-size: 0.8rem;
}

.cum-freq, .rel-freq, .cum-rel-freq {
  font-family: monospace;
  font-size: 0.6rem;
  color: #666;
}

/* Responsive design improvements */
@media (max-width: 1200px) {
  .main-content {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .table-container {
    max-height: 300px;
  }
}

@media (max-width: 768px) {
  .calculator-container {
    width: 95%;
    padding: 15px;
  }
  
  .formula-buttons {
    grid-template-columns: 1fr;
  }
  
  .control-button,
  .formula-button {
    font-size: 0.5rem;
    padding: 8px;
  }
  
  h2 {
    font-size: 1rem;
  }
  
  .formula-category h3,
  .results-display h3 {
    font-size: 0.7rem;
  }
}
</style>