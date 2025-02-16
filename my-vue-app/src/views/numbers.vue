<template>
    <div class="numbers-calculator-view">
      <BackButton buttonText="Back to Main" destination="/"/>
      
      <div class="container">
        <h2>THEORY OF NUMBERS CALCULATOR</h2>
        
        <div class="calculator-section">
          <div class="input-section">
            <select v-model="operation">
              <option value="prime">Check Prime</option>
              <option value="factor">Prime Factorization</option>
              <option value="gcd">Greatest Common Divisor</option>
              <option value="lcm">Least Common Multiple</option>
              <option value="congruence">Modular Congruence</option>
              <option value="euclidean">Euclidean Algorithm</option>
            </select>
            <div class="input-fields">
              <input type="number" v-model="input1" placeholder="First Number">
              <input type="number" v-model="input2" placeholder="Second Number (optional)">
              <input type="number" v-model="input3" placeholder="Modulus (optional)">
            </div>
            <div class="modulus-note"></div>
            <button @click="calculate">Calculate</button>
          </div>
          
          <div class="loading" v-show="isLoading">
            <p>Computing result...</p>
          </div>
          
          <div class="result-section" v-if="result">
            <h3>Result:</h3>
            <div class="result-text" v-html="result"></div>
          </div>
          
          <div class="steps-section" v-if="steps">
            <h3>Explanation:</h3>
            <div class="steps-text" v-html="steps"></div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  
  
  export default {
    data() {
      return {
        operation: 'prime',
        input1: '',
        input2: '',
        input3: '',
        result: '',
        steps: '',
        isLoading: false
      }
    },
    methods: {
      clearResults() {
        this.result = '';
        this.steps = '';
      },
      
      calculate() {
        const num1 = parseInt(this.input1);
        const num2 = parseInt(this.input2);
        const num3 = parseInt(this.input3);
        
        this.clearResults();
        this.isLoading = true;
  
        setTimeout(() => {
          try {
            switch(this.operation) {
              case 'prime':
                this.result = this.isPrime(num1) 
                  ? `${num1} is a prime number` 
                  : `${num1} is NOT a prime number`;
                this.steps = `A prime number is a natural number greater than 1 that is only divisible by 1 and itself.
  We checked divisibility from 2 to √${num1} and found no divisors.`;
                break;
              
              case 'factor':
                const factors = this.primeFactorization(num1);
                this.result = `Prime Factors of ${num1}: ${factors.join(' × ')}`;
                this.steps = `We systematically divided ${num1} by the smallest possible prime factors.`;
                break;
              
              case 'gcd':
                if (!num2) {
                  throw new Error('Please enter two numbers');
                }
                const gcdResult = this.gcd(num1, num2);
                this.result = `GCD(${num1}, ${num2}) = ${gcdResult}`;
                this.steps = `Used the Euclidean algorithm: repeatedly replace the larger number with the remainder of the division.`;
                break;
              
              case 'lcm':
                if (!num2) {
                  throw new Error('Please enter two numbers');
                }
                const lcmResult = this.lcm(num1, num2);
                this.result = `LCM(${num1}, ${num2}) = ${lcmResult}`;
                this.steps = `Calculated by: LCM = (${num1} × ${num2}) ÷ GCD(${num1}, ${num2})`;
                break;
              
              case 'congruence':
                if (!num2 || !num3) {
                  throw new Error('Please enter all three numbers');
                }
                const congruenceResult = this.modularCongruence(num1, num2, num3);
                this.result = `${num1} ≡ ${num2} (mod ${num3}) is ${congruenceResult}`;
                this.steps = `Checked if the remainders are the same when divided by ${num3}`;
                break;
              
              case 'euclidean':
                if (!num2) {
                  throw new Error('Please enter two numbers');
                }
                const euclideanResult = this.extendedEuclidean(num1, num2);
                this.result = `GCD(${num1}, ${num2}) = ${euclideanResult.gcd}`;
                this.steps = `Coefficients: x = ${euclideanResult.x}, y = ${euclideanResult.y}
  Satisfies: ${num1} × ${euclideanResult.x} + ${num2} × ${euclideanResult.y} = ${euclideanResult.gcd}`;
                break;
            }
          } catch (error) {
            this.result = `<div class="error">${error.message}</div>`;
          } finally {
            this.isLoading = false;
          }
        }, 500);
      },
      
      isPrime(n) {
        if (n <= 1) return false;
        if (n <= 3) return true;
        
        if (n % 2 === 0 || n % 3 === 0) return false;
        
        for (let i = 5; i * i <= n; i += 6) {
          if (n % i === 0 || n % (i + 2) === 0) return false;
        }
        
        return true;
      },
  
      primeFactorization(n) {
        const factors = [];
        let divisor = 2;
        
        while (divisor * divisor <= n) {
          if (n % divisor === 0) {
            factors.push(divisor);
            n /= divisor;
          } else {
            divisor++;
          }
        }
        
        if (n > 1) {
          factors.push(n);
        }
        
        return factors;
      },
  
      gcd(a, b) {
        a = Math.abs(a);
        b = Math.abs(b);
        while (b) {
          [a, b] = [b, a % b];
        }
        return a;
      },
  
      lcm(a, b) {
        return Math.abs((a * b) / this.gcd(a, b));
      },
  
      modularCongruence(a, b, m) {
        a = ((a % m) + m) % m;
        b = ((b % m) + m) % m;
        return a === b;
      },
  
      extendedEuclidean(a, b) {
        if (b === 0) {
          return { gcd: a, x: 1, y: 0 };
        }
        
        const { gcd, x, y } = this.extendedEuclidean(b, a % b);
        return {
          gcd: gcd,
          x: y,
          y: x - Math.floor(a / b) * y
        };
      }
    }
  }
  </script>
  
  <style scoped>
  .numbers-calculator-view {
    font-family: 'Press Start 2P', cursive;
    background-color: #ffe4c4;
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
    padding: 50px;
    border-radius: 15px;
    box-shadow: 0 0 20px rgba(0,0,0,0.15);
  }
  
  h2 {
    text-align: center;
    color: #8B4513;
    margin-bottom: 40px;
    font-size: 1.8rem;
  }
  
  .calculator-section {
    display: flex;
    flex-direction: column;
    gap: 30px;
  }
  
  .input-section {
    display: flex;
    flex-direction: column;
    gap: 25px;
  }
  
  select {
    padding: 15px;
    font-family: inherit;
    border: 3px solid #333;
    border-radius: 8px;
    background: white;
    font-size: 1.1rem;
  }
  
  .input-fields {
    display: flex;
    gap: 15px;
  }
  
  .input-fields input {
    flex: 1;
    padding: 15px;
    border: 3px solid #333;
    border-radius: 8px;
    font-family: inherit;
    width: 100%;
    font-size: 1.1rem;
  }
  
  button {
    padding: 20px;
    background: #ff6b6b;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-family: inherit;
    transition: 0.3s;
    width: 100%;
    font-size: 1.2rem;
  }
  
  button:hover {
    background: #ff5252;
  }
  
  .result-section, .steps-section {
    margin-top: 30px;
    padding: 30px;
    background: #f5f5f5;
    border-radius: 10px;
  }
  
  .result-text, .steps-text {
    white-space: pre-wrap;
    word-wrap: break-word;
    line-height: 1.6;
    font-size: 1.1rem;
  }
  
  .modulus-note {
    font-size: 12px;
    color: #666;
    text-align: center;
    font-style: italic;
    margin-top: 10px;
  }
  
  .loading {
    text-align: center;
    margin: 20px 0;
    font-style: italic;
    color: #666;
  }
  
  .error {
    color: #ff0000;
    font-weight: bold;
  }
  
  @media (max-width: 600px) {
    .input-fields {
      flex-direction: column;
    }
  
    .container {
      width: 98%;
      padding: 20px;
    }
  
    h2 {
      font-size: 1.4rem;
    }
  
    select, input, button {
      font-size: 1rem;
    }
  }
  </style>