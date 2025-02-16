<template>
  <div id="app">
    <Sidebar 
      :isLoggedIn="isLoggedIn"
      :username="username"
      :userPlan="userPlan"
      @show-about="showAboutUs = true; showOverlay = true"
      @show-login="showLoginForm = true; showOverlay = true"
    />
    
    <div class="main-content" :class="{ 'with-sidebar': true }">
      <router-view></router-view>
    </div>
    
    <!-- Overlay and modals -->
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
import Sidebar from '@/components/Sidebar.vue'

export default {
  components: {
    Sidebar
  },
  data() {
    return {
      showOverlay: false,
      showAboutUs: false,
      showLoginForm: false,
      email: '',
      password: '',
      isLoggedIn: false,
      username: 'Guest User',
      userPlan: 'Free Plan'
    }
  },
  methods: {
    closeModals() {
      this.showAboutUs = false;
      this.showLoginForm = false;
      this.showOverlay = false;
    },
    submitLogin() {
      // For demo purposes, let's simulate a successful login
      this.isLoggedIn = true;
      this.username = this.email.split('@')[0];
      this.userPlan = 'Premium Plan';
      
      // Close the login form
      this.closeModals();
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

body {
  font-family: 'Press Start 2P', cursive;
  margin: 0;
  padding: 0;
  background-color: #ffe4c4;
}

#app {
  display: flex;
}

.main-content {
  flex: 1;
  margin-left: 250px;
  transition: margin-left 0.3s ease;
  min-height: 100vh;
}

.main-content.with-sidebar {
  padding: 20px;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1001;
}

.about-us-container {
  font-family: 'Press Start 2P', cursive;
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0,0,0,0.1);
  text-align: center;
  max-width: 800px;
  width: 80%;
  max-height: 80vh;
  overflow-y: auto;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1002;
}

.about-us-container h2 {
  color: #8B4513;
  margin-bottom: 30px;
  font-size: 1.5rem;
}

.team-section {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-top: 30px;
}

.team-member {
  background: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  transition: transform 0.3s;
}

.team-member:hover {
  transform: scale(1.05);
}

.team-member img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 15px;
}

.mission-statement {
  background: #f0f8ff;
  padding: 20px;
  border-radius: 8px;
  margin-top: 30px;
  line-height: 1.6;
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
  gap: 20px;
  border-radius: 5px;
  border: 2px solid var(--main-color);
  box-shadow: 4px 4px var(--main-color);
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1002;
  font-family: 'Press Start 2P', cursive;
}

.title {
  color: var(--font-color);
  font-weight: 900;
  font-size: 20px;
  margin-bottom: 25px;
}

.title span {
  color: var(--font-color-sub);
  font-weight: 600;
  font-size: 17px;
}

.input {
  width: 250px;
  height: 40px;
  border-radius: 5px;
  border: 2px solid var(--main-color);
  background-color: var(--bg-color);
  box-shadow: 4px 4px var(--main-color);
  font-size: 15px;
  font-weight: 600;
  color: var(--font-color);
  padding: 5px 10px;
  outline: none;
  font-family: 'Press Start 2P', cursive;
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
  gap: 20px;
}

.button-log {
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 100%;
  border: 2px solid var(--main-color);
  background-color: var(--bg-color);
  box-shadow: 4px 4px var(--main-color);
  color: var(--font-color);
  font-size: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.icon {
  width: 24px;
  height: 24px;
  fill: var(--main-color);
}

.button-log:active,
.button-confirm:active {
  box-shadow: 0px 0px var(--main-color);
  transform: translate(3px, 3px);
}

.button-confirm {
  margin: 50px auto 0 auto;
  width: 120px;
  height: 40px;
  border-radius: 5px;
  border: 2px solid var(--main-color);
  background-color: var(--bg-color);
  box-shadow: 4px 4px var(--main-color);
  font-size: 17px;
  font-weight: 600;
  color: var(--font-color);
  cursor: pointer;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .main-content {
    margin-left: 70px;
  }
  
  .team-section {
    grid-template-columns: 1fr;
  }
  
  .about-us-container,
  .form {
    width: 90%;
    padding: 15px;
  }
}
</style>