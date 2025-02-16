<template>
  <div>
    <BackButton buttonText="Back to Main" destination="/" />
    <div class="container">
      <h2>COMBINATORICS CALCULATOR</h2>
      
      <div class="calculator-section">
        <div class="input-section">
          <select id="operation" aria-label="Select operation" v-model="selectedOperation" @change="updateFieldVisibility">
            <optgroup label="Basic Operations">
              <option value="permutation">Permutation (P) - Without Repetition</option>
              <option value="permutation-rep">Permutation (P) - With Repetition</option>
              <option value="variation">Variation (V) - Without Repetition</option>
              <option value="variation-rep">Variation (V) - With Repetition</option>
              <option value="combination">Combination (C) - Without Repetition</option>
              <option value="combination-rep">Combination (C) - With Repetition</option>
            </optgroup>
            <optgroup label="Advanced Operations">
              <option value="circular">Circular Permutation</option>
              <option value="derangement">Derangement</option>
              <option value="multiset">Multiset Permutation</option>
              <option value="partition">Integer Partition</option>
            </optgroup>
          </select>

          <div class="input-group">
            <div class="input-field">
              <label for="n">n (total items):</label>
              <input type="number" id="n" min="0" placeholder="Enter n" aria-label="Enter total items" v-model.number="nValue">
            </div>
            
            <div class="input-field" id="r-field" :class="{ hidden: !showRField }">
              <label for="r">r (selected items):</label>
              <input type="number" id="r" min="0" placeholder="Enter r" aria-label="Enter selected items" v-model.number="rValue">
            </div>

            <div class="input-field" id="repetitions-field" :class="{ hidden: !showRepetitionsField }">
              <label for="repetitions">Repetitions:</label>
              <input type="text" id="repetitions" placeholder="Enter repetitions (comma-separated)" aria-label="Enter repetitions" v-model="repetitionsInput">
            </div>
          </div>

          <button id="calculate" aria-label="Calculate" @click="calculate">CALCULATE</button>
        </div>

        <div class="output-section">
          <div class="formula-display">
            <h3>Formula:</h3>
            <div id="formula" class="formula-text">{{ formula }}</div>
          </div>

          <div class="result-section">
            <h3>Result:</h3>
            <div id="result" class="result-text" v-html="result"></div>
          </div>

          <div class="steps-section">
            <h3>Steps:</h3>
            <div id="steps" class="steps-text">{{ steps }}</div>
          </div>
        </div>
      </div>

      <div class="info-section">
        <div class="info-box">
          <h3>WHAT IS COMBINATORICS?</h3>
          <p>Combinatorics is the branch of mathematics studying finite, discrete structures. It includes counting complex arrangements and patterns in mathematical systems.</p>
        </div>

        <div class="formula-reference">
          <h3>QUICK REFERENCE</h3>
          <ul>
            <li>P(n) = n! (Permutation without repetition)</li>
            <li>P(n; n1, n2, ..., nk) = n! / (n1! × n2! × ... × nk!) (Permutation with repetition)</li>
            <li>V(n, r) = n! / (n - r)! (Variation without repetition)</li>
            <li>V̄(n, r) = n^r (Variation with repetition)</li>
            <li>C(n, r) = n! / (r! × (n - r)!) (Combination without repetition)</li>
            <li>C̄(n, r) = (n + r - 1)! / (r! × (n - 1)!) (Combination with repetition)</li>
            <li>Circular Permutation = (n - 1)!</li>
            <li>Derangement = n! × (1/1! - 1/2! + 1/3! - ... ± 1/n!)</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Import the math.js library and BackButton component
import { inject } from 'vue';

export default {
  
  data() {
    return {
      selectedOperation: 'permutation',
      nValue: null,
      rValue: null,
      repetitionsInput: '',
      showRField: true,
      showRepetitionsField: false,
      formula: '',
      result: '',
      steps: '',
      math: null
    };
  },
  created() {
    this.math = inject('math', null);
    this.updateFieldVisibility();
  },
  mounted() {
    // Ensure math.js is available
    if (!this.math && window.math) {
      this.math = window.math;
    }
  },
  methods: {
    updateFieldVisibility() {
      // Hide the r field for specific operations
      this.showRField = !(
        this.selectedOperation === 'permutation' || 
        this.selectedOperation === 'derangement' || 
        this.selectedOperation === 'circular' || 
        this.selectedOperation === 'partition'
      );
      
      // Show repetitions field for specific operations
      this.showRepetitionsField = 
        this.selectedOperation === 'permutation-rep' || 
        this.selectedOperation === 'multiset';
    },
    
    factorial(n) {
      if (n < 0) return 0;
      if (n <= 1) return 1;
      return this.math ? this.math.factorial(n) : this.factorialFallback(n);
    },
    
    factorialFallback(n) {
      // Simple fallback implementation in case math.js is not available
      let result = 1;
      for (let i = 2; i <= n; i++) {
        result *= i;
      }
      return result;
    },
    
    validateInputs(n, r, repetitions = null) {
      if (isNaN(n) || n < 0) return "n must be a non-negative number";
      if (r !== null && (isNaN(r) || r < 0)) return "r must be a non-negative number";
      if (!repetitions && r !== null && r > n) return "r cannot be greater than n";
      if (repetitions && this.repetitionsInput.trim() === '') return "Please enter repetitions";
      return null;
    },
    
    permutation(n) {
      return this.factorial(n);
    },
    
    permutationWithRepetition(n, repetitions) {
      const totalSum = repetitions.reduce((a, b) => a + b, 0);
      if (totalSum !== n) {
        return `Error: Sum of repetitions (${totalSum}) must equal n (${n})`;
      }
      const denominator = repetitions.reduce((acc, val) => acc * this.factorial(val), 1);
      return this.factorial(totalSum) / denominator;
    },
    
    variationWithoutRepetition(n, r) {
      return this.factorial(n) / this.factorial(n - r);
    },
    
    variationWithRepetition(n, r) {
      return Math.pow(n, r);
    },
    
    combination(n, r) {
      return this.factorial(n) / (this.factorial(r) * this.factorial(n - r));
    },
    
    combinationWithRepetition(n, r) {
      return this.factorial(n + r - 1) / (this.factorial(r) * this.factorial(n - 1));
    },
    
    circularPermutation(n) {
      if (n <= 1) return 1;
      return this.factorial(n - 1);
    },
    
    derangement(n) {
      if (n === 0) return 1;
      if (n === 1) return 0;
      
      let result = this.factorial(n);
      let sum = 0;
      for (let i = 0; i <= n; i++) {
        sum += Math.pow(-1, i) / this.factorial(i);
      }
      return Math.round(result * sum);
    },
    
    multisetPermutation(n, repetitions) {
      const totalSum = repetitions.reduce((a, b) => a + b, 0);
      if (totalSum !== n) {
        return `Error: Sum of repetitions (${totalSum}) must equal n (${n})`;
      }
      const denominator = repetitions.reduce((acc, val) => acc * this.factorial(val), 1);
      return this.factorial(n) / denominator;
    },
    
    integerPartition(n) {
      if (n < 0) return 0;
      if (n === 0) return 1;
      
      // Dynamic programming implementation
      const dp = Array(n + 1).fill(0);
      dp[0] = 1;
      
      for (let i = 1; i <= n; i++) {
        for (let j = i; j <= n; j++) {
          dp[j] += dp[j - i];
        }
      }
      
      return dp[n];
    },
    
    calculate() {
      const n = parseInt(this.nValue);
      let r = this.showRField ? parseInt(this.rValue) : null;
      let repetitions = null;

      if (this.showRepetitionsField && this.repetitionsInput.trim() !== '') {
        repetitions = this.repetitionsInput.split(',')
          .map(x => parseInt(x.trim()))
          .filter(x => !isNaN(x));
      }

      const validationError = this.validateInputs(n, r, this.showRepetitionsField ? repetitions : null);
      if (validationError) {
        this.result = `Error: ${validationError}`;
        this.formula = '';
        this.steps = '';
        return;
      }

      let calculationResult;

      // Calculate result
      switch (this.selectedOperation) {
        case 'permutation':
          calculationResult = this.permutation(n);
          this.formula = 'P(n) = n!';
          this.steps = `1. Calculate n! = ${n}! = ${calculationResult}`;
          break;

        case 'permutation-rep':
          calculationResult = this.permutationWithRepetition(n, repetitions);
          if (typeof calculationResult === 'string' && calculationResult.startsWith('Error')) {
            this.result = calculationResult;
            this.formula = '';
            this.steps = '';
            return;
          }
          this.formula = 'P(n; n1, n2, ..., nk) = n! / (n1! × n2! × ... × nk!)';
          this.steps = `1. Calculate n! = ${this.factorial(n)}\n` +
                    `2. Calculate product of repetition factorials: ${repetitions.map(x => `${x}!`).join(' × ')} = ${repetitions.reduce((acc, val) => acc * this.factorial(val), 1)}\n` +
                    `3. Divide: ${calculationResult}`;
          break;

        case 'variation':
          calculationResult = this.variationWithoutRepetition(n, r);
          this.formula = 'V(n, r) = n! / (n - r)!';
          this.steps = `1. Calculate n! = ${this.factorial(n)}\n` +
                    `2. Calculate (n - r)! = ${this.factorial(n - r)}\n` +
                    `3. Divide: ${calculationResult}`;
          break;

        case 'variation-rep':
          calculationResult = this.variationWithRepetition(n, r);
          this.formula = 'V̄(n, r) = n^r';
          this.steps = `1. Calculate n^r = ${n}^${r} = ${calculationResult}`;
          break;

        case 'combination':
          calculationResult = this.combination(n, r);
          this.formula = 'C(n, r) = n! / (r! × (n - r)!)';
          this.steps = `1. Calculate n! = ${this.factorial(n)}\n` +
                    `2. Calculate r! = ${this.factorial(r)}\n` +
                    `3. Calculate (n - r)! = ${this.factorial(n - r)}\n` +
                    `4. Divide: ${calculationResult}`;
          break;

        case 'combination-rep':
          calculationResult = this.combinationWithRepetition(n, r);
          this.formula = 'C̄(n, r) = (n + r - 1)! / (r! × (n - 1)!)';
          this.steps = `1. Calculate (n + r - 1)! = ${this.factorial(n + r - 1)}\n` +
                    `2. Calculate r! = ${this.factorial(r)}\n` +
                    `3. Calculate (n - 1)! = ${this.factorial(n - 1)}\n` +
                    `4. Divide: ${calculationResult}`;
          break;

        case 'circular':
          calculationResult = this.circularPermutation(n);
          this.formula = 'Circular P(n) = (n - 1)!';
          this.steps = `1. Calculate (n - 1)! = ${this.factorial(n - 1)} = ${calculationResult}`;
          break;

        case 'derangement':
          calculationResult = this.derangement(n);
          this.formula = '!n = n! × ∑((-1)^k / k!) for k=0 to n';
          this.steps = `1. Input n = ${n}\n` +
          (n <= 10 ? 
              `2. Using formula: !n = n! × ∑((-1)^k / k!) for k=0 to n\n` :
              `2. Using approximation formula: !n ≈ round(n! / e)\n`) +
              `3. Final result: ${calculationResult}`;
          break;

        case 'multiset':
          calculationResult = this.multisetPermutation(n, repetitions);
          if (typeof calculationResult === 'string' && calculationResult.startsWith('Error')) {
            this.result = calculationResult;
            this.formula = '';
            this.steps = '';
            return;
          }
          this.formula = 'Multiset P(n; r1, r2, ...) = n! / (r1! × r2! × ...)';
          this.steps = `1. Calculate n! = ${this.factorial(n)}\n` +
                    `2. Calculate product of factorials of repetitions: ${repetitions.map(x => `${x}!`).join(' × ')} = ${repetitions.reduce((acc, val) => acc * this.factorial(val), 1)}\n` +
                    `3. Divide to get final result: ${calculationResult}`;
          break;

        case 'partition':
          calculationResult = this.integerPartition(n);
          this.formula = 'Integer Partition of n';
          this.steps = `1. Calculate integer partitions of ${n}\n` +
                    `2. Final result: ${calculationResult}`;
          break;
      }

      // Display results
      this.result = `<div>Result: ${calculationResult}</div>`;
    }
  }
};
</script>

<style scoped>
body {
  margin: 0;
  padding: 0;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.container {
  width: 95%;
  max-width: 1000px;
  background: white;
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 0 20px rgba(0,0,0,0.15);
  margin: 100px auto;
}

h2 {
  text-align: center;
  color: #8B4513;
  margin-bottom: 30px;
  font-size: 1.8rem;
  font-family: 'Press Start 2P', cursive;
}

h3 {
  color: #ff6b6b;
  font-size: 1rem;
  margin-bottom: 15px;
  font-family: 'Press Start 2P', cursive;
}

.calculator-section {
  display: grid;
  grid-template-columns: 1fr;
  gap: 30px;
}

.input-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

select {
  padding: 15px;
  font-family: 'Press Start 2P', cursive;
  border: 3px solid #333;
  border-radius: 8px;
  background: white;
  font-size: 0.8rem;
  cursor: pointer;
}

.input-group {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.input-field {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.input-field label {
  font-size: 0.7rem;
  color: #333;
  font-family: 'Press Start 2P', cursive;
}

.input-field input {
  padding: 15px;
  border: 3px solid #333;
  border-radius: 8px;
  font-family: 'Press Start 2P', cursive;
  font-size: 0.8rem;
}

button {
  padding: 20px;
  background: #ff6b6b;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-family: 'Press Start 2P', cursive;
  transition: 0.3s;
  font-size: 1rem;
}

button:hover {
  background: #ff5252;
  transform: translateY(-2px);
}

.output-section {
  background: #f5f5f5;
  padding: 20px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.formula-display, .result-section, .steps-section {
  background: white;
  padding: 15px;
  border-radius: 8px;
}

.formula-text, .result-text, .steps-text {
  font-family: monospace;
  font-size: 0.9rem;
  line-height: 1.6;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.info-section {
  margin-top: 30px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.info-box, .formula-reference {
  background: #f5f5f5;
  padding: 20px;
  border-radius: 10px;
}

.info-box p {
  font-family: 'Press Start 2P', cursive;
  font-size: 0.7rem;
  line-height: 1.6;
}

.formula-reference ul {
  list-style: none;
  padding: 0;
  font-family: monospace;
  font-size: 0.8rem;
  line-height: 1.8;
}

.hidden {
  display: none;
}

@media (max-width: 768px) {
  .container {
    padding: 20px;
  }

  h2 {
    font-size: 1.2rem;
  }

  .input-group {
    grid-template-columns: 1fr;
  }

  .info-section {
    grid-template-columns: 1fr;
  }
}
</style>