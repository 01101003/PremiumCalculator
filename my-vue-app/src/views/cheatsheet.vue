<template>
    <div class="container">
      <h1>MATHEMATICAL CHEAT SHEET</h1>
      
      <div class="category-grid">
        <div class="category" v-for="(category, index) in categories" :key="index">
          <h2>{{ category.title }}</h2>
          <div class="formula-item" v-for="(formula, fIndex) in category.formulas" :key="fIndex">
            <div class="formula-name">{{ formula.name }}</div>
            <div class="formula-content" v-html="formatContent(formula.content)"></div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  
  
  export default {
    data() {
      return {
        categories: [
          {
            title: 'ALGEBRA',
            formulas: [
              {
                name: 'Quadratic Formula',
                content: 'x = (-b ± √(b² - 4ac)) / 2a'
              },
              {
                name: 'Logarithm Rules',
                content: 'log(xy) = log(x) + log(y)<br>log(x/y) = log(x) - log(y)<br>log(x^n) = n·log(x)'
              },
              {
                name: 'Exponent Rules',
                content: 'x^a · x^b = x^(a+b)<br>x^a / x^b = x^(a-b)<br>(x^a)^b = x^(ab)'
              }
            ]
          },
          {
            title: 'GEOMETRY',
            formulas: [
              {
                name: 'Circle',
                content: 'Area = πr²<br>Circumference = 2πr<br>Arc Length = (θ/360°)·2πr'
              },
              {
                name: 'Triangle',
                content: 'Area = (b·h)/2<br>Pythagorean: a² + b² = c²<br>Sin Law: a/sin(A) = b/sin(B)<br>Cos Law: c² = a²+b²-2ab·cos(C)'
              },
              {
                name: '3D Shapes',
                content: 'Sphere Vol = (4/3)πr³<br>Cube Vol = a³<br>Cylinder Vol = πr²h'
              }
            ]
          },
          {
            title: 'STATISTICS',
            formulas: [
              {
                name: 'Central Tendency',
                content: 'Mean: x̄ = Σx/n<br>Weighted Mean: Σ(wx)/Σw<br>Geometric Mean: ⁿ√(x₁·x₂·...·xₙ)'
              },
              {
                name: 'Dispersion',
                content: 'Variance: σ² = Σ(x - x̄)²/n<br>Std Dev: σ = √(Σ(x - x̄)²/n)<br>CV = (σ/x̄) × 100%'
              },
              {
                name: 'Probability',
                content: 'P(A∪B) = P(A) + P(B) - P(A∩B)<br>P(A|B) = P(A∩B)/P(B)'
              }
            ]
          },
          {
            title: 'NUMBER THEORY',
            formulas: [
              {
                name: 'Division & Factors',
                content: 'GCD(a,b)·LCM(a,b) = a·b<br>Euler: φ(n) = n·Π(1-1/p)'
              },
              {
                name: 'Modular Arithmetic',
                content: '(a + b) mod n = <br>((a mod n) + (b mod n)) mod n<br>(a · b) mod n =<br>((a mod n) · (b mod n)) mod n'
              }
            ]
          },
          {
            title: 'CALCULUS',
            formulas: [
              {
                name: 'Derivatives',
                content: 'Power Rule: d/dx(x^n) = nx^(n-1)<br>Product: d/dx(uv) = u\'v + uv\'<br>Chain: d/dx(f(g(x))) = f\'(g(x))·g\'(x)'
              },
              {
                name: 'Integrals',
                content: '∫x^n dx = x^(n+1)/(n+1) + C<br>∫e^x dx = e^x + C<br>∫(1/x) dx = ln|x| + C'
              }
            ]
          },
          {
            title: 'DISCRETE MATH',
            formulas: [
              {
                name: 'Combinatorics',
                content: 'P(n,r) = n!/(n-r)!<br>C(n,r) = n!/r!(n-r)!<br>n! = n × (n-1)!'
              },
              {
                name: 'Sequences',
                content: 'Arithmetic: aₙ = a₁ + (n-1)d<br>Geometric: aₙ = a₁·r^(n-1)'
              }
            ]
          },
          {
            title: 'TRIGONOMETRY',
            formulas: [
              {
                name: 'Basic Identities',
                content: 'sin²θ + cos²θ = 1<br>tan θ = sin θ/cos θ<br>csc θ = 1/sin θ'
              },
              {
                name: 'Double Angle',
                content: 'sin(2θ) = 2sin θ cos θ<br>cos(2θ) = cos²θ - sin²θ'
              }
            ]
          },
          {
            title: 'LINEAR ALGEBRA',
            formulas: [
              {
                name: 'Matrices',
                content: 'det(2×2) = ad - bc<br>trace = Σaᵢᵢ'
              },
              {
                name: 'Vectors',
                content: '|v| = √(x² + y² + z²)<br>v·w = |v||w|cos θ'
              }
            ]
          }
        ]
      };
    },
    methods: {
      formatContent(content) {
        // This method allows us to use HTML in the content
        return content;
      }
    }
  };
  </script>
  
  <style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
  
  body {
    margin: 0;
    padding: 20px;
    min-height: 100vh;
  }
  
  .container {
    font-family: 'Press Start 2P', cursive;
    background-color: #ffe4c4;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    min-height: 100vh;
  }
  
  h1 {
    text-align: center;
    color: #8B4513;
    margin-bottom: 40px;
    font-size: 32px;
  }
  
  .category-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
    margin-bottom: 40px;
  }
  
  .category {
    background: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 0 15px rgba(0,0,0,0.1);
  }
  
  .category h2 {
    color: #ff6b6b;
    font-size: 18px;
    margin-bottom: 20px;
    text-align: center;
  }
  
  .formula-item {
    background: #f5f5f5;
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 15px;
  }
  
  .formula-name {
    color: #8B4513;
    font-size: 14px;
    margin-bottom: 10px;
  }
  
  .formula-content {
    font-family: monospace;
    font-size: 12px;
    line-height: 1.6;
    color: #333;
  }
  
  @media (max-width: 768px) {
    .category-grid {
      grid-template-columns: 1fr;
    }
    
    h1 {
      font-size: 24px;
    }
  }
  </style>