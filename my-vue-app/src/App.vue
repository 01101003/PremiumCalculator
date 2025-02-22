<template>
  <Analytics>
    <div id="app">
      <Sidebar 
        :isLoggedIn="isLoggedIn"
        :username="username"
        :userPlan="userPlan"
        @show-about="showAboutUs = true; showOverlay = true"
        @show-login="showAuthForm($event)"
        @logout="handleLogout"
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
      <form class="form" v-show="showLoginForm" @click.stop @submit.prevent="submitAuth">
        <div class="title">Welcome,<br><span>{{ isSignUp ? 'sign up to join us' : 'sign in to continue' }}</span></div>
        <input type="email" placeholder="Email" v-model="email" class="input" />
        <input type="password" placeholder="Password" v-model="password" class="input" />
        <input v-if="isSignUp" type="text" placeholder="Full Name" v-model="fullName" class="input" />
        <input v-if="isSignUp" type="password" placeholder="Confirm Password" v-model="confirmPassword" class="input" />
        
        <div v-if="authError" class="error-message">{{ authError }}</div>
        
        <button class="button-confirm" type="submit">{{ isSignUp ? 'Sign Up →' : 'Let`s go →' }}</button>
      </form>
    </div>
  </Analytics>
</template>

<script>
import Sidebar from '@/components/SideBar.vue';
import { appwriteService, account } from '@/config/appwrite';

export default {
  components: {
    Sidebar
  },
  data() {
    return {
      showOverlay: false,
      showAboutUs: false,
      showLoginForm: false,
      isSignUp: false,
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
      currentUser: null,
      authError: '',
      isLoading: false
    };
  },
  computed: {
    isLoggedIn() {
      return !!this.currentUser;
    },
    username() {
      return this.currentUser ? this.currentUser.name : 'Guest User';
    },
    userPlan() {
      return this.currentUser ? 'Premium Plan' : 'Free Plan';
    }
  },
  methods: {
    closeModals() {
      this.showAboutUs = false;
      this.showLoginForm = false;
      this.showOverlay = false;
      this.resetForm();
    },
    resetForm() {
      this.email = '';
      this.password = '';
      this.confirmPassword = '';
      this.fullName = '';
      this.authError = '';
    },
    showAuthForm(type) {
      this.isSignUp = type === 'signup';
      this.showLoginForm = true;
      this.showOverlay = true;
    },
    async submitAuth() {
      this.authError = '';
      this.isLoading = true;
      
      try {
        if (this.isSignUp) {
          if (this.password !== this.confirmPassword) {
            this.authError = 'Passwords do not match!';
            return;
          }
          
          // Create new user account
          const userData = await appwriteService.createEmailAccount(
            this.email,
            this.password,
            this.fullName || this.email.split('@')[0]
          );
          
          this.currentUser = userData;
        } else {
          // Login existing user
          const userData = await appwriteService.login(this.email, this.password);
          this.currentUser = userData;
        }
        
        // Close the form on success
        this.closeModals();
        
      } catch (error) {
        console.error('Authentication error:', error);
        this.authError = error.message || 'Authentication failed. Please try again.';
      } finally {
        this.isLoading = false;
      }
    },
    async handleLogout() {
      try {
        await appwriteService.logout();
        this.currentUser = null;
      } catch (error) {
        console.error('Logout failed:', error);
      }
    },
    async checkSession() {
      try {
        const session = await account.get();
        if (session.$id) {
          // Get full user data from our custom users collection
          const userData = await this.getUserData(session.$id);
          this.currentUser = { ...session, ...userData };
        }
      } catch (error) {
        console.log('No active session');
      }
    },
    async getUserData(appwriteUserId) {
      try {
        const credentials = await appwriteService.databases.listDocuments(
          appwriteService.DATABASE_ID,
          appwriteService.COLLECTIONS.AUTH_CREDENTIALS,
          [
            appwriteService.databases.Query.equal('provider_user_id', appwriteUserId),
            appwriteService.databases.Query.equal('provider', 'email')
          ]
        );
        
        if (credentials.total > 0) {
          const userId = credentials.documents[0].user_id;
          
          const users = await appwriteService.databases.listDocuments(
            appwriteService.DATABASE_ID,
            appwriteService.COLLECTIONS.USERS,
            [appwriteService.databases.Query.equal('user_id', userId)]
          );
          
          if (users.total > 0) {
            return users.documents[0];
          }
        }
        
        return null;
      } catch (error) {
        console.error('Error fetching user data:', error);
        return null;
      }
    }
  },
  mounted() {
    this.checkSession();
  }
};
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

.error-message {
  color: #e46363;
  font-size: 12px;
  text-align: center;
  width: 100%;
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