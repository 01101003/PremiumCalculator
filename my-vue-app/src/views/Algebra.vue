<template>
    <div class="algebra-view">
      <div class="container">
        <h2>ADVANCED ALGEBRA CALCULATOR</h2>
        
        <div class="calculator-section">
          <div class="input-section">
            <select v-model="operation">
              <option value="solve">Solve Equation</option>
              <option value="simplify">Simplify Expression</option>
              <option value="factor">Factor</option>
              <option value="expand">Expand</option>
              <option value="integrate">Integrate</option>
              <option value="derivative">Find Derivative</option>
            </select>
            <div id="math-input" ref="mathInput"></div>
            <button @click="calculate">Calculate</button>
          </div>
          
          <div class="loading" v-show="isLoading">
            <p>Computing result...</p>
          </div>
          
          <div class="result-section">
            <h3>Result:</h3>
            <div id="result" v-html="result"></div>
          </div>
          
          <div class="steps-section">
            <h3>Solution Steps:</h3>
            <div id="steps" v-html="steps"></div>
          </div>
          
          <div class="plot-section">
            <div id="plot" v-html="plot"></div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  
  export default {
    data() {
      return {
        operation: 'solve',
        result: '',
        steps: '',
        plot: '',
        isLoading: false,
        mathField: null,
        WOLFRAM_APP_ID: 'JH52EH-UAKWTEXGXQ',
        WOLFRAM_API_URL: 'https://api.wolframalpha.com/v1/result'
      }
    },
    mounted() {
      this.initMathField();
      this.loadExternalStyles();
    },
    methods: {
      loadExternalStyles() {
        // Load Google Fonts if not already loaded
        if (!document.getElementById('press-start-2p-font')) {
          const link = document.createElement('link');
          link.id = 'press-start-2p-font';
          link.rel = 'stylesheet';
          link.href = 'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap';
          document.head.appendChild(link);
        }
      },
      initMathField() {
        const MQ = window.MathQuill.getInterface(2);
        this.mathField = MQ.MathField(this.$refs.mathInput, {
          handlers: {
            edit: () => {
              this.clearResults();
            }
          }
        });
      },
      clearResults() {
        this.result = '';
        this.steps = '';
        this.plot = '';
      },
      formatQuery(input, operation) {
        // Remove any LaTeX formatting
        let query = input
          .replace(/\\frac{([^}]*)}{([^}]*)}/g, '($1)/($2)')
          .replace(/\\left|\\right|\\cdot|\\times/g, '')
          .replace(/\{|\}/g, '')
          .replace(/\\/g, '');
  
        // Format based on operation type
        switch(operation) {
          case 'solve':
            return `solve ${query} for x`;
          case 'simplify':
            return `simplify ${query}`;
          case 'factor':
            return `factor ${query}`;
          case 'expand':
            return `expand ${query}`;
          case 'integrate':
            return `integrate ${query} with respect to x`;
          case 'derivative':
            return `derivative of ${query} with respect to x`;
          case 'plot':
            // For plot, we'll show a message instead
            throw new Error('Plotting is not supported in the Instant Calculator API. Please use a graphing calculator for plotting.');
          default:
            return query;
        }
      },
      displayError(message) {
        const errorDiv = `<div class="error">${message}</div>`;
        this.result += errorDiv;
      },
      displayWarning(operation) {
        const warningMessages = {
          'plot': 'Plotting is not supported in this calculator mode.',
          'simplify': 'For complex simplifications, try writing the expression in a standard form.',
          'expand': 'For complex expansions, try breaking down the expression into smaller parts.'
        };
  
        if (warningMessages[operation]) {
          const warningDiv = `
            <div class="warning" style="background-color: #fff3cd; padding: 10px; border-radius: 5px; margin-bottom: 10px;">
              ${warningMessages[operation]}
            </div>
          `;
          this.result += warningDiv;
        }
      },
      async calculate() {
        const input = this.mathField.latex();
        
        if (!input.trim()) {
          this.displayError('Please enter an expression');
          return;
        }
  
        this.clearResults();
        this.displayWarning(this.operation);
        this.isLoading = true;
  
        try {
          // Don't proceed with API call for plot operation
          if (this.operation === 'plot') {
            throw new Error('Plotting is not supported in this calculator mode.');
          }
  
          const query = this.formatQuery(input, this.operation);
          console.log('Formatted query:', query);
  
          const params = new URLSearchParams({
            appid: this.WOLFRAM_APP_ID,
            i: query
          });
  
          const response = await fetch(`${this.WOLFRAM_API_URL}?${params}`);
          console.log('Response status:', response.status);
  
          if (!response.ok) {
            if (response.status === 501) {
              throw new Error('This operation is not supported. Try simplifying your input or breaking it into steps.');
            }
            throw new Error('Failed to get response from Wolfram Alpha');
          }
  
          const result = await response.text();
          console.log('Result:', result);
  
          // Display the result
          this.result += `<div class="result-text">${result}</div>`;
  
        } catch (error) {
          console.error('Error:', error);
          this.displayError(error.message || 'An error occurred while processing your request');
        } finally {
          this.isLoading = false;
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .algebra-view {
    font-family: 'Press Start 2P', cursive;
    background-color: #ffe4c4;
    margin: 0;
    padding: 0;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .algebra-view .container {
    width: 120%;
    max-width: 800px;
    background: white;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 0 15px rgba(0,0,0,0.1);
  }
  
  .algebra-view h2 {
    text-align: center;
    color: #8B4513;
    margin-bottom: 30px;
  }
  
  .algebra-view .calculator-section {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .algebra-view .input-section {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  
  .algebra-view select {
    padding: 10px;
    font-family: inherit;
    border: 2px solid #333;
    border-radius: 5px;
    background: white;
  }
  
  .algebra-view #math-input {
    min-height: 100px;
    border: 2px solid #333;
    border-radius: 5px;
    padding: 10px;
  }
  
  .algebra-view button {
    padding: 15px;
    background: #ff6b6b;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-family: inherit;
    transition: 0.3s;
  }
  
  .algebra-view button:hover {
    background: #ff5252;
  }
  
  .algebra-view .result-section {
    margin-top: 20px;
    padding: 20px;
    background: #f5f5f5;
    border-radius: 5px;
  }
  
  .algebra-view .steps-section {
    margin-top: 20px;
    padding: 20px;
    background: #f0f8ff;
    border-radius: 5px;
  }
  
  .algebra-view .loading {
    text-align: center;
    padding: 20px;
  }
  
  .algebra-view .error {
    color: #ff0000;
    padding: 10px;
    background: #ffe6e6;
    border-radius: 5px;
    margin-top: 10px;
  }
  
  .algebra-view .plot-section {
    margin-top: 20px;
    text-align: center;
  }
  
  .algebra-view .plot-section img {
    max-width: 100%;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
  }
  
  .algebra-view .mq-editable-field {
    min-height: 50px;
    margin-bottom: 0;
  }
  
  .algebra-view .mq-editable-field.mq-focused {
    box-shadow: 0 0 5px rgba(0,0,0,0.2);
    border-color: #ff6b6b !important;
  }
  
  .algebra-view .mq-math-mode {
    font-size: 18px;
  }
  
  /* Make the math input more visible */
  .algebra-view #math-input {
    background: white;
    padding: 5px;
    border-radius: 5px;
    min-height: 70px;
  }
  </style>