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
import axios from 'axios';
import Sidebar from '@/components/SideBar.vue';
import { appwriteService, account } from '@/config/appwrite';
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
  components: {
    Sidebar,
  },
  data() {
    return {
      operation: 'solve',
      mathField: null,
      result: '',
      steps: '',
      plot: '',
      showOverlay: false,
      showAboutUs: false,
      showLoginForm: false,
      isSignUp: false,
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
      authError: '',
      isLoading: false,
    };
  },
  computed: {
    ...mapState({
      storeUser: (state) => state.currentUser,
    }),
    ...mapGetters(['isLoggedIn', 'userId']),
    username() {
      return this.isLoggedIn ? this.storeUser.name : 'Guest User';
    },
    userPlan() {
      return this.isLoggedIn ? 'Premium Plan' : 'Free Plan';
    },
  },
  methods: {
    ...mapActions(['fetchCurrentUser', 'updateUserState', 'clearUserState']),
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
            this.isLoading = false;
            return;
          }

          // Create new user account
          const userData = await appwriteService.createEmailAccount(
            this.email,
            this.password,
            this.fullName || this.email.split('@')[0]
          );

          // Update store with user data
          await this.updateUserState(userData);
        } else {
          // Login existing user
          const userData = await appwriteService.login(this.email, this.password);

          // Update store with user data
          await this.updateUserState(userData);
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
        await this.clearUserState();
      } catch (error) {
        console.error('Logout failed:', error);
        // Force clear user state even if API logout fails
        await this.clearUserState();
      }
    },
    async checkSession() {
      try {
        // First try to get current session from Vuex store
        const currentUser = await this.fetchCurrentUser();

        // If no user in Vuex store, try to fetch from Appwrite
        if (!currentUser) {
          const session = await account.get();
          if (session.$id) {
            // Get full user data from our custom users collection
            const userData = await this.getUserData(session.$id);
            if (userData) {
              // Update Vuex store with user data
              await this.updateUserState({ ...session, ...userData });
            }
          }
        }
      } catch (error) {
        console.log('No active session:', error);
        // Clear user state in Vuex store
        await this.clearUserState();
      }
    },
    async getUserData(appwriteUserId) {
      try {
        const userData = await appwriteService.getUserByProviderId('email', appwriteUserId);
        return userData;
      } catch (error) {
        console.error('Error fetching user data:', error);
        return null;
      }
    },
    // Initialize MathQuill
    initMathInput() {
      if (!window.MathQuill) {
        console.error('MathQuill not loaded. Make sure to include the library.');
        return;
      }

      const MQ = window.MathQuill.getInterface(2);
      this.mathField = MQ.MathField(this.$refs.mathInput, {
        spaceBehavesLikeTab: true,
        handlers: {
          edit: () => {
            // Optional: Handle input changes
          },
        },
      });
    },
    // Construct Wolfram Alpha API query based on operation type
    buildWolframQuery(input, operation) {
      switch (operation) {
        case 'solve':
          return `solve ${input}`;
        case 'simplify':
          return `simplify ${input}`;
        case 'factor':
          return `factor ${input}`;
        case 'expand':
          return `expand ${input}`;
        case 'integrate':
          return `integrate ${input}`;
        case 'derivative':
          return `derivative of ${input}`;
        default:
          return input;
      }
    },
    // Calculate using the Vercel serverless function
    async calculate() {
      if (!this.mathField) {
        console.error('Math input not initialized');
        return;
      }

      this.isLoading = true;

      try {
        const input = this.mathField.latex(); // Get LaTeX from the editor

        // Restrict premium features for non-logged in users
        const premiumOperations = ['integrate', 'derivative', 'factor', 'expand'];
        if (!this.isLoggedIn && premiumOperations.includes(this.operation)) {
          alert(`Please log in to use ${this.operation}. This feature is available in the Premium Plan.`);
          this.isLoading = false;
          return;
        }

        // Build the Wolfram Alpha query
        const query = this.buildWolframQuery(input, this.operation);

        // Call the Vercel serverless function
        const response = await axios.post('/api/wolfram', {
          query,
        });

        // Process the result
        if (response.data) {
          this.result = response.data;
          this.steps = ''; // Quick calculation API doesn't provide steps
          this.plot = ''; // Quick calculation API doesn't provide plots

          // Save calculation history for logged-in users
          if (this.isLoggedIn) {
            await appwriteService.saveCalculation(
              this.userId,
              this.operation,
              input,
              this.result
            );
          }
        } else {
          this.result = 'Error processing calculation';
        }
      } catch (error) {
        console.error('Calculation error:', error);
        this.result = `Error: ${error.message || 'Unknown error'}`;
      } finally {
        this.isLoading = false;
      }
    },
  },
  mounted() {
    this.checkSession();

    // Load and initialize MathQuill
    this.$nextTick(() => {
      // Check if MathQuill is already loaded
      if (!window.MathQuill) {
        // Create script element for MathQuill
        const mqScript = document.createElement('script');
        mqScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/mathquill/0.10.1/mathquill.min.js';
        mqScript.onload = () => {
          this.initMathInput();
        };
        document.head.appendChild(mqScript);

        // Load MathQuill CSS
        const mqStyle = document.createElement('link');
        mqStyle.rel = 'stylesheet';
        mqStyle.href = 'https://cdnjs.cloudflare.com/ajax/libs/mathquill/0.10.1/mathquill.min.css';
        document.head.appendChild(mqStyle);
      } else {
        this.initMathInput();
      }
    });
  },
};
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
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
}

.algebra-view h2 {
  text-align: center;
  color: #8b4513;
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
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.algebra-view .mq-editable-field {
  min-height: 50px;
  margin-bottom: 0;
}

.algebra-view .mq-editable-field.mq-focused {
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  border-color: #ff6b6b !important;
}

.algebra-view .mq-math-mode {
  font-size: 18px;
}

.algebra-view #math-input {
  background: white;
  padding: 5px;
  border-radius: 5px;
  min-height: 70px;
}
</style>