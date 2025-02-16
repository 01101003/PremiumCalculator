<template>
  <div>
    <div class="container">
      <div class="hero-section">
        <h1>
          <span class="premium-text">PREMIUM</span>
          <span class="calculator-text">CALCULATOR</span>
        </h1>
        
        <div class="intro-text">
          <p ref="introText1" class="typewriter"></p>
          <p ref="introText2" class="typewriter"></p>
        </div>
      </div>
      <div class="calculator-grid">
        <div 
          v-for="(url, name) in calculatorButtons" 
          :key="name"
          class="calculator-card"
          @click="navigate(name, url)"
          @mouseenter="buttonMouseEnter"
          @mouseleave="buttonMouseLeave"
          @mousedown="buttonMouseDown"
          @mouseup="buttonMouseUp"
        >
          <div class="card-icon">{{ getIcon(name) }}</div>
          <div class="card-name">{{ name }}</div>
          <div class="card-description">{{ getDescription(name) }}</div>
        </div>
      </div>

      <div class="features-section">
        <h2>WHY CHOOSE PREMIUM CALCULATOR?</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">📊</div>
            <h3>PRECISE RESULTS</h3>
            <p>Get accurate calculations for all your mathematical needs</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🧩</div>
            <h3>INTUITIVE DESIGN</h3>
            <p>User-friendly interface makes complex math simple</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🔄</div>
            <h3>SAVE YOUR WORK</h3>
            <p>Login to save and access your calculations anytime</p>
          </div>
        </div>
      </div>

      <div class="action-buttons">
        <button 
          v-for="(url, name) in actionButtons" 
          :key="name"
          class="button"
          @click="handleActionButton(name, url)"
          @mouseenter="buttonMouseEnter"
          @mouseleave="buttonMouseLeave"
          @mousedown="buttonMouseDown"
          @mouseup="buttonMouseUp"
        >{{ name }}</button>
      </div>
    </div>

    <!-- Overlay -->
    <div class="overlay" v-show="showOverlay" @click="closeModals"></div>

    <!-- About Us Container -->
    <div class="about-us-container" v-show="showAboutUs" @click.stop>
      <h2>ABOUT PREMIUM CALCULATOR</h2>
      
      <div class="mission-statement">
        <p>We are passionate mathematicians and computer scientists dedicated to making complex mathematical computations accessible, fun, and intuitive. Our mission is to transform intimidating mathematical challenges into engaging, pixel-perfect experiences.</p>
      </div>
  
      <div class="team-section">
        <div class="team-member">
          <img src="" alt="Team Member 1">
          <h3>Ryan. Iv</h3>
          <p>Founder & Lead Developer</p>
        </div>
        <div class="team-member">
          <img src="" alt="Team Member 2">
          <h3>Sofia. </h3>
          <p>Designer</p>
        </div>
      </div>
    </div>

    <!-- Login Form -->
    <form class="form" v-show="showLoginForm" @click.stop @submit.prevent="submitLogin">
      <div class="title">Welcome,<br /><span>sign up to continue</span></div>
      <input type="email" placeholder="Email" v-model="email" class="input" />
      <input type="password" placeholder="Password" v-model="password" class="input" />
      <div class="login-with">
        <div class="button-log"><b>t</b></div>
        <div class="button-log">
          <svg class="icon" height="56.6934px" id="Layer_1" style="enable-background:new 0 0 56.6934 56.6934;" version="1.1" viewBox="0 0 56.6934 56.6934" width="56.6934px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <path d="M51.981,24.4812c-7.7173-0.0038-15.4346-0.0019-23.1518-0.001c0.001,3.2009-0.0038,6.4018,0.0019,9.6017  c4.4693-0.001,8.9386-0.0019,13.407,0c-0.5179,3.0673-2.3408,5.8723-4.9258,7.5991c-1.625,1.0926-3.492,1.8018-5.4168,2.139  c-1.9372,0.3306-3.9389,0.3729-5.8713-0.0183c-1.9651-0.3921-3.8409-1.2108-5.4773-2.3649  c-2.6166-1.8383-4.6135-4.5279-5.6388-7.5549c-1.0484-3.0788-1.0561-6.5046,0.0048-9.5805  c0.7361-2.1679,1.9613-4.1705,3.5708-5.8002c1.9853-2.0324,4.5664-3.4853,7.3473-4.0811c2.3812-0.5083,4.8921-0.4113,7.2234,0.294  c1.9815,0.6016,3.8082,1.6874,5.3044,3.1163c1.5125-1.5039,3.0173-3.0164,4.527-4.5231c0.7918-0.811,1.624-1.5865,2.3908-2.4196  c-2.2928-2.1218-4.9805-3.8274-7.9172-4.9056C32.0723,4.0363,26.1097,3.995,20.7871,5.8372  C14.7889,7.8907,9.6815,12.3763,6.8497,18.0459c-0.9859,1.9536-1.7057,4.0388-2.1381,6.1836  C3.6238,29.5732,4.382,35.2707,6.8468,40.1378c1.6019,3.1768,3.8985,6.001,6.6843,8.215c2.6282,2.0958,5.6916,3.6439,8.9396,4.5078  c4.0984,1.0993,8.461,1.0743,12.5864,0.1355c3.7284-0.8581,7.256-2.6397,10.0725-5.24c2.977-2.7358,5.1006-6.3403,6.2249-10.2138  C52.5807,33.3171,52.7498,28.8064,51.981,24.4812z"></path>
          </svg>
        </div>
        <div class="button-log">
          <svg xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" xml:space="preserve" width="56.693px" viewBox="0 0 56.693 56.693" version="1.1" id="Layer_1" height="56.693px" class="icon">
            <path d="M40.43,21.739h-7.645v-5.014c0-1.883,1.248-2.322,2.127-2.322c0.877,0,5.395,0,5.395,0V6.125l-7.43-0.029  c-8.248,0-10.125,6.174-10.125,10.125v5.518h-4.77v8.53h4.77c0,10.947,0,24.137,0,24.137h10.033c0,0,0-13.32,0-24.137h6.77  L40.43,21.739z"></path>
          </svg>
        </div>
      </div>
      <button class="button-confirm" type="submit">Let`s go →</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'MainPage',
  data() {
    return {
      calculatorButtons: {
        'ALGEBRA': 'algebra',
        'GEOMETRY': 'geometryoptions',
        'STATISTICS': 'statistics',
        'COMBINATORICS': 'combinatorics',
        'DISCRETE MATHEMATICS': 'dismath',
        'THEORY OF NUMBERS': 'numbers'
      },
      actionButtons: {
        'ABOUT US': null,
        'CHEAT SHEET': 'cheatsheet',
        'LOGIN': null,
        'ASK MISTRAL': 'AI'
      },
      showOverlay: false,
      showAboutUs: false,
      showLoginForm: false,
      email: '',
      password: '',
      introText: [
        'Welcome to the ultimate mathematical toolkit for students, teachers, and professionals!',
        'Choose a calculator below to begin your mathematical journey.'
      ]
    }
  },
  mounted() {
    // Start the typing animation after the component is mounted
    this.typeWriter(this.$refs.introText1, this.introText[0], 0, 50);
  },
  methods: {
    // Typing animation function
    typeWriter(element, text, index, speed) {
      if (index < text.length) {
        element.textContent += text.charAt(index);
        index++;
        setTimeout(() => this.typeWriter(element, text, index, speed), speed);
      } else if (element === this.$refs.introText1) {
        // When first paragraph is done, start typing the second paragraph
        setTimeout(() => {
          this.typeWriter(this.$refs.introText2, this.introText[1], 0, 50);
        }, 500); // Wait 500ms before starting the second paragraph
      }
    },
    // Rest of the methods remain unchanged
    navigate(name, url) {
      if (name && this.calculatorButtons[name]) {
        this.$router.push({ name: this.calculatorButtons[name] });
      }
    },
    handleActionButton(name, url) {
      if (name === 'ABOUT US') {
        this.showAboutUs = true;
        this.showOverlay = true;
      } else if (name === 'LOGIN') {
        this.showLoginForm = true;
        this.showOverlay = true;
      } else if (name && this.actionButtons[name]) {
        this.$router.push({ name: this.actionButtons[name] });
      }
    },
    closeModals() {
      this.showAboutUs = false;
      this.showLoginForm = false;
      this.showOverlay = false;
    },
    submitLogin() {
      this.$emit('login', { email: this.email, password: this.password });
      this.email = '';
      this.password = '';
      this.closeModals();
    },
    buttonMouseEnter(event) {
      event.target.style.transform = 'translate(-2px, -2px)';
      event.target.style.boxShadow = '5px 5px 0 #333';
    },
    buttonMouseLeave(event) {
      event.target.style.transform = 'translate(0, 0)';
      event.target.style.boxShadow = '3px 3px 0 #333';
    },
    buttonMouseDown(event) {
      event.target.style.transform = 'translate(1px, 1px)';
      event.target.style.boxShadow = '2px 2px 0 #333';
    },
    buttonMouseUp(event) {
      event.target.style.transform = 'translate(-2px, -2px)';
      event.target.style.boxShadow = '5px 5px 0 #333';
    },
    getIcon(name) {
      const icons = {
        'ALGEBRA': '∑',
        'GEOMETRY': '△',
        'STATISTICS': '📊',
        'COMBINATORICS': '🔢',
        'DISCRETE MATHEMATICS': '🧮',
        'THEORY OF NUMBERS': '🔢'
      };
      return icons[name] || '📐';
    },
    getDescription(name) {
      const descriptions = {
        'ALGEBRA': 'Solve equations, find roots, and manipulate expressions',
        'GEOMETRY': 'Calculate areas, volumes, and angles for various shapes',
        'STATISTICS': 'Analyze data sets with mean, median, standard deviation',
        'COMBINATORICS': 'Compute permutations, combinations, and arrangements',
        'DISCRETE MATHEMATICS': 'Work with sets, logic, graphs, and proofs',
        'THEORY OF NUMBERS': 'Explore primes, factors, and number properties'
      };
      return descriptions[name] || 'Advanced mathematical tools at your fingertips';
    }
  }
}
</script>

<style scoped>
.container {
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  margin: 0 auto;
  font-family: 'Press Start 2P', cursive;
}

.hero-section {
  text-align: center;
  margin-bottom: 40px;
}

h1 {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-bottom: 30px;
}

@media (min-width: 576px) {
  h1 {
    flex-direction: row;
    gap: 20px;
  }
}

.premium-text {
  color: #8B4513;
  font-size: 24px;
  text-shadow: 2px 2px 0px rgba(0,0,0,0.1);
}

.calculator-text {
  color: #ff6b6b;
  font-size: 24px;
  text-shadow: 2px 2px 0px rgba(0,0,0,0.1);
}

@media (min-width: 576px) {
  .premium-text,
  .calculator-text {
    font-size: 36px;
  }
}

@media (min-width: 768px) {
  .premium-text,
  .calculator-text {
    font-size: 48px;
  }
}

.intro-text {
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.6;
  font-size: 12px;
}

@media (min-width: 576px) {
  .intro-text {
    font-size: 14px;
  }
}

.intro-text p {
  margin-bottom: 15px;
}

.calculator-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  width: 100%;
  margin-bottom: 60px;
}

@media (min-width: 576px) {
  .calculator-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 992px) {
  .calculator-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.calculator-card {
  background: white;
  border: 2px solid #333;
  border-radius: 8px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 3px 3px 0 #333;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  height: 100%;
}

.card-icon {
  font-size: 32px;
  margin-bottom: 15px;
}

.card-name {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
}

.card-description {
  font-size: 10px;
  color: #666;
  line-height: 1.4;
}

.features-section {
  width: 100%;
  margin-bottom: 60px;
}

.features-section h2 {
  text-align: center;
  font-size: 16px;
  color: #8B4513;
  margin-bottom: 30px;
}

@media (min-width: 576px) {
  .features-section h2 {
    font-size: 18px;
  }
}

@media (min-width: 768px) {
  .features-section h2 {
    font-size: 20px;
  }
}

.features-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

@media (min-width: 576px) {
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 768px) {
  .features-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.feature-card {
  background: #f5f5f5;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  height: 100%;
}

.feature-icon {
  font-size: 28px;
  margin-bottom: 15px;
}

.feature-card h3 {
  font-size: 12px;
  margin-bottom: 10px;
  color: #333;
}

.feature-card p {
  font-size: 10px;
  color: #666;
  line-height: 1.4;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 20px;
  width: 100%;
  max-width: 600px;
}

@media (min-width: 576px) {
  .action-buttons {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
  }
}

.button {
  background: white;
  border: 2px solid #333;
  color: #333;
  padding: 15px;
  font-size: 14px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 3px 3px 0 #333;
  font-family: 'Press Start 2P', cursive;
  text-align: center;
}

@media (min-width: 576px) {
  .button {
    font-size: 16px;
    padding: 15px 20px;
  }
}

.button:hover {
  transform: translate(-2px, -2px);
  box-shadow: 5px 5px 0 #333;
}

.action-buttons .button {
  width: 100%;
}

@media (min-width: 576px) {
  .action-buttons .button {
    width: auto;
  }
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

.about-us-container {
  font-family: 'Press Start 2P', cursive;
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0,0,0,0.1);
  text-align: center;
  width: 90%;
  max-width: 800px;
  max-height: 80vh;
  overflow-y: auto;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
}


@media (min-width: 576px) {
  .about-us-container {
    padding: 30px;
  }
}

@media (min-width: 768px) {
  .about-us-container {
    padding: 40px;
  }
}

.about-us-container h2 {
  color: #8B4513;
  margin-bottom: 20px;
  font-size: 16px;
}

@media (min-width: 576px) {
  .about-us-container h2 {
    font-size: 18px;
    margin-bottom: 25px;
  }
}

@media (min-width: 768px) {
  .about-us-container h2 {
    font-size: 20px;
    margin-bottom: 30px;
  }
}

.team-section {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  margin-top: 20px;
}

@media (min-width: 576px) {
  .team-section {
    grid-template-columns: repeat(2, 1fr);
    margin-top: 25px;
  }
}

@media (min-width: 768px) {
  .team-section {
    margin-top: 30px;
  }
}

.team-member {
  background: #f5f5f5;
  padding: 15px;
  border-radius: 8px;
  transition: transform 0.3s;
}

@media (min-width: 576px) {
  .team-member {
    padding: 20px;
  }
}

.team-member:hover {
  transform: scale(1.05);
}

.team-member img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 10px;
}

@media (min-width: 576px) {
  .team-member img {
    width: 80px;
    height: 80px;
    margin-bottom: 12px;
  }
}

@media (min-width: 768px) {
  .team-member img {
    width: 100px;
    height: 100px;
    margin-bottom: 15px;
  }
}

.team-member h3 {
  font-size: 14px;
  margin: 0 0 5px 0;
}

.team-member p {
  font-size: 10px;
  margin: 0;
}

.mission-statement {
  background: #f0f8ff;
  padding: 15px;
  border-radius: 8px;
  margin-top: 20px;
  line-height: 1.4;
  font-size: 10px;
}

@media (min-width: 576px) {
  .mission-statement {
    padding: 20px;
    margin-top: 25px;
    line-height: 1.5;
    font-size: 11px;
  }
}

@media (min-width: 768px) {
  .mission-statement {
    margin-top: 30px;
    line-height: 1.6;
    font-size: 12px;
  }
}

.form {
  --input-focus: #e46363;
  --font-color: #323232;
  --font-color-sub: #666;
  --bg-color: beige;
  --main-color: black;
  padding: 20px;
  background: white;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 15px;
  border-radius: 5px;
  border: 2px solid var(--main-color);
  box-shadow: 4px 4px var(--main-color);
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  font-family: 'Press Start 2P', cursive;
  width: 90%;
  max-width: 320px;
}

@media (min-width: 576px) {
  .form {
    gap: 20px;
  }
}

.title {
  color: var(--font-color);
  font-weight: 900;
  font-size: 16px;
  margin-bottom: 15px;
}

@media (min-width: 576px) {
  .title {
    font-size: 18px;
    margin-bottom: 20px;
  }
}

@media (min-width: 768px) {
  .title {
    font-size: 20px;
    margin-bottom: 25px;
  }
}

.title span {
  color: var(--font-color-sub);
  font-weight: 600;
  font-size: 14px;
}

@media (min-width: 576px) {
  .title span {
    font-size: 15px;
  }
}

@media (min-width: 768px) {
  .title span {
    font-size: 17px;
  }
}

.input {
  width: 100%;
  height: 36px;
  border-radius: 5px;
  border: 2px solid var(--main-color);
  background-color: var(--bg-color);
  box-shadow: 3px 3px var(--main-color);
  font-size: 12px;
  font-weight: 600;
  color: var(--font-color);
  padding: 5px 8px;
  outline: none;
  font-family: 'Press Start 2P', cursive;
  box-sizing: border-box;
}

@media (min-width: 576px) {
  .input {
    height: 38px;
    font-size: 13px;
    padding: 5px 9px;
    box-shadow: 4px 4px var(--main-color);
  }
}

@media (min-width: 768px) {
  .input {
    height: 40px;
    font-size: 14px;
    padding: 5px 10px;
  }
}

.input::placeholder {
  color: var(--font-color-sub);
  opacity: 0.8;
}

.input:focus {
  border: 2px solid var(--input-focus);
}

.login-with {
  display: flex;
  gap: 15px;
  margin-top: 5px;
}

@media (min-width: 576px) {
  .login-with {
    gap: 18px;
  }
}

@media (min-width: 768px) {
  .login-with {
    gap: 20px;
  }
}

.button-log {
  cursor: pointer;
  width: 32px;
  height: 32px;
  border-radius: 100%;
  border: 2px solid var(--main-color);
  background-color: var(--bg-color);
  box-shadow: 3px 3px var(--main-color);
  color: var(--font-color);
  font-size: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

@media (min-width: 576px) {
  .button-log {
    width: 36px;
    height: 36px;
    font-size: 22px;
  }
}

@media (min-width: 768px) {
  .button-log {
    width: 40px;
    height: 40px;
    font-size: 25px;
    box-shadow: 4px 4px var(--main-color);
  }
}

.icon {
  width: 20px;
  height: 20px;
  fill: var(--main-color);
}

@media (min-width: 576px) {
  .icon {
    width: 22px;
    height: 22px;
  }
}

@media (min-width: 768px) {
  .icon {
    width: 24px;
    height: 24px;
  }
}

.button-log:active,
.button-confirm:active {
  box-shadow: 0px 0px var(--main-color);
  transform: translate(3px, 3px);
}

.button-confirm {
  margin: 30px auto 0 auto;
  width: 100px;
  height: 36px;
  border-radius: 5px;
  border: 2px solid var(--main-color);
  background-color: var(--bg-color);
  box-shadow: 3px 3px var(--main-color);
  font-size: 14px;
  font-weight: 600;
  color: var(--font-color);
  cursor: pointer;
  font-family: 'Press Start 2P', cursive;
}
.intro-text {
  
  min-height: 5em; 
}

@media (min-width: 576px) {
  .button-confirm {
    margin-top: 40px;
    width: 110px;
    height: 38px;
    font-size: 15px;
  }
}

@media (min-width: 768px) {
  .button-confirm {
    margin-top: 50px;
    width: 120px;
    height: 40px;
    font-size: 16px;
    box-shadow: 4px 4px var(--main-color);
  }
}
</style>