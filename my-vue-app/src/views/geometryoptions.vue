<template>
    <div class="container">
      <h1>GEOMETRY CALCULATOR</h1>
      
      <div class="geometry-options">
        <div class="geometry-card" @click="goTo2DShapes">
          <div class="card-content">
            <h2>2D SHAPES</h2>
            <div class="shape-preview">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="80" fill="#ff6b6b" />
                <rect x="20" y="20" width="160" height="160" fill="#4ecdc4" opacity="0.5" />
                <polygon points="100,20 20,180 180,180" fill="#45b7d1" opacity="0.7" />
              </svg>
            </div>
            <p>Explore circles, triangles, rectangles, and more!</p>
          </div>
        </div>
        
        <div class="geometry-card" @click="goTo3DShapes">
          <div class="card-content">
            <h2>3D SHAPES</h2>
            <div class="shape-preview">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
                <rect x="50" y="50" width="100" height="100" fill="#ff6b6b" />
                <path d="M50,50 L130,30 L150,110 L70,130 Z" fill="#4ecdc4" opacity="0.7" />
                <path d="M150,110 L130,30 L180,70 L180,150 Z" fill="#45b7d1" opacity="0.5" />
              </svg>
            </div>
            <p>Dive into cubes, spheres, cylinders, and more!</p>
          </div>
        </div>
      </div>
  
      <div class="navigation-controls">
        <BackButton buttonText="Back to Main" destination="/" />
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'GeometryOptions',
    methods: {
      goTo2DShapes() {
        this.$router.push('/geo2D');
      },
      goTo3DShapes() {
        this.$router.push('/geo3D');
      },
      goToMain() {
        this.$router.push('/');
      }
      
    },
    name: 'GeometryOptions',
    components: {
      BackButton
    },

  }
  </script>
  
  <style scoped>
  body {
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
    width: 90%;
    max-width: 1000px;
    background: white;
    padding: 40px;
    border-radius: 15px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
    text-align: center;
  }
  
  h1 {
    color: #2c3e50;
    margin-bottom: 40px;
    font-size: 2rem;
  }
  
  .geometry-options {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
    margin-bottom: 30px;
  }
  
  .geometry-card {
    background-color: #f1f5f9;
    border-radius: 15px;
    padding: 30px;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 3px solid #34495e;
  }
  
  .geometry-card:hover {
    transform: scale(1.05);
    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
  }
  
  .card-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }
  
  .shape-preview {
    width: 200px;
    height: 200px;
  }
  
  .shape-preview svg {
    width: 100%;
    height: 100%;
  }
  
  .geometry-card h2 {
    color: #2c3e50;
    font-size: 1.5rem;
  }
  
  .geometry-card p {
    color: #34495e;
    text-align: center;
    font-size: 0.8rem;
  }
  
  .navigation-controls {
    display: flex;
    justify-content: center;
  }
  
  .nav-button {
    padding: 15px 30px;
    background-color: #ff6b6b;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-family: 'Press Start 2P', cursive;
    transition: all 0.3s ease;
  }
  
  .nav-button:hover {
    background-color: #ff5252;
  }
  
  @media (max-width: 768px) {
    .geometry-options {
      grid-template-columns: 1fr;
    }
  
    .container {
      padding: 20px;
    }
  
    h1 {
      font-size: 1.5rem;
    }
  }
  </style>