<template>
  <div class="algebra-view">
    <div class="container">
      <h2>ADVANCED ALGEBRA CALCULATOR</h2>

      <div class="calculator-section">
        <div class="input-section">
          <div class="input-header">
            <select v-model="operation">
              <option value="solve">Solve Equation</option>
              <option value="simplify">Simplify Expression</option>
              <option value="factor">Factor</option>
              <option value="expand">Expand</option>
              <option value="integrate">Integrate</option>
              <option value="derivative">Find Derivative</option>
            </select>
            <button @click="openHowToModal" class="how-to-btn">
              <span class="btn-icon">?</span> How to Use
            </button>
          </div>

          <div id="math-input" ref="mathInput"></div>
          <button @click="calculate" class="calculate-btn">Calculate</button>

          <div class="loading" v-show="isLoading">
            <p>Computing result...</p>
          </div>
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
  
  <!-- Overlay and Modal (moved outside container for proper positioning) -->
  <div class="overlay" v-show="showOverlay || showHowToModal" @click="closeModals"></div>
  
  <!-- How To Modal -->
  <div class="modal how-to-modal" v-show="showHowToModal" @click.stop>
    <div class="modal-header">
      <h2>How to Use the Algebra Calculator</h2>
      <button @click="closeHowToModal" class="close-modal-btn">×</button>
    </div>

    <div class="modal-content">
      <section>
        <h3>Input Methods</h3>
        <p>Use the MathQuill input field to enter mathematical expressions. Click buttons or type directly to create notations.</p>
      </section>

      <section>
        <h3>Calculation Types</h3>
        <div class="calc-types-grid">
          <div class="calc-type">
            <strong>Solve Equation</strong>
            <code>x + 5 = 10</code>
          </div>
          <div class="calc-type">
            <strong>Simplify Expression</strong>
            <code>(x^2 + 2x + 1) / (x + 1)</code>
          </div>
          <div class="calc-type">
            <strong>Factor</strong>
            <code>x^2 - 4</code>
          </div>
          <div class="calc-type">
            <strong>Expand</strong>
            <code>(x + 2)(x - 3)</code>
          </div>
          <div class="calc-type">
            <strong>Integrate</strong>
            <code>∫ x^2 dx</code>
          </div>
          <div class="calc-type">
            <strong>Derivative</strong>
            <code>d/dx(x^3 + 2x)</code>
          </div>
        </div>
      </section>

      <section>
        <h3>Calculation Storage</h3>
        <p>Users can save calculation history. Simple calculations such as 2+2 are not stored.</p>
      </section>

      <section class="tips-section">
        <h3>Pro Tips</h3>
        <ul>
          <li>Use LaTeX-style input for complex notations</li>
          <li>Ensure well-formed equations</li>
        </ul>
      </section>
    </div>

    <div class="modal-footer">
      <button @click="closeHowToModal" class="got-it-btn">Got It!</button>
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
      showHowToModal: false,
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
      this.showHowToModal = false;
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
    openHowToModal() {
      this.showHowToModal = true;
      this.showOverlay = true;
    },
    closeHowToModal() {
      this.showHowToModal = false;
      this.showOverlay = false;
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

          console.log('Attempting to create new account');
          // Create new user account
          const userData = await appwriteService.createEmailAccount(
            this.email,
            this.password,
            this.fullName || this.email.split('@')[0]
          );

          console.log('Authentication successful, userData:', userData);
          // Verify userData has user_id
          if (!userData.user_id) {
            console.error('userData is missing user_id property:', userData);
          }

          // Update store with user data
          await this.updateUserState(userData);
        } else {
          console.log('Attempting to login');
          // Login existing user
          const userData = await appwriteService.login(this.email, this.password);

          console.log('Authentication successful, userData:', userData);
          // Verify userData has user_id
          if (!userData.user_id) {
            console.error('userData is missing user_id property:', userData);
          }

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
        console.log('Logging out user');
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
        console.log('Checking for active session');
        // First try to get current session from Appwrite
        const session = await account.get();
        console.log('Session from Appwrite:', session);

        if (session && session.$id) {
          // Get full user data from our custom users collection
          const userData = await this.getUserData(session.$id);
          console.log('User data from custom collection:', userData);

          if (userData) {
            // Update Vuex store with user data
            await this.updateUserState({ ...session, ...userData });
            console.log('Updated user state with:', { ...session, ...userData });
          }
        } else {
          // No valid session, ensure store is cleared
          await this.clearUserState();
        }
      } catch (error) {
        console.error('Session check error:', error);
        // Clear user state in Vuex store
        await this.clearUserState();
      }
    },
    async getUserData(appwriteUserId) {
      try {
        console.log('Getting user data for Appwrite user ID:', appwriteUserId);
        const userData = await appwriteService.getUserByProviderId('email', appwriteUserId);
        console.log('User data retrieved:', userData);
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
          console.log('About to save calculation - userid state:', {
            isLoggedIn: this.isLoggedIn,
            userId: this.userId,
            userIdType: typeof this.userId
          });

          if (this.isLoggedIn && this.userId) {
            // No need to parse userId here - we'll let the service handle the conversion
            // The userId from Vuex should already be an integer based on the store mutations
            console.log('Saving calculation with userId:', this.userId, typeof this.userId);
            try {
              const result = await appwriteService.saveCalculation(
                this.userId,
                this.operation,
                input,
                this.result
              );
              console.log('Calculation saved successfully:', result);
            } catch (error) {
              console.error('Error saving calculation:', error);
            }
          } else {
            console.log('Not saving calculation - not logged in or no userId');
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
    }
  },
  mounted() {
    this.initMathInput();
    this.checkSession();
  }
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

/* Modal and overlay styles */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  width: 90%;
  max-width: 600px;
  max-height: 85vh;
  overflow-y: auto;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  z-index: 1001;
  font-family: 'Press Start 2P', cursive;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: #8b4513;
  color: white;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.2em;
}

.close-modal-btn {
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  margin: 0;
}

.modal-content {
  padding: 20px;
}

.modal-content section {
  margin-bottom: 20px;
}

.modal-content h3 {
  color: #8b4513;
  margin-top: 0;
}

.calc-types-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 15px;
  margin-top: 10px;
}

.calc-type {
  background: #f5f5f5;
  padding: 10px;
  border-radius: 5px;
}

.calc-type code {
  display: block;
  margin-top: 5px;
  padding: 8px;
  background: #ffe4c4;
  border-radius: 4px;
  font-family: monospace;
}

.tips-section ul {
  padding-left: 20px;
}

.tips-section li {
  margin-bottom: 8px;
}

.modal-footer {
  padding: 15px 20px;
  text-align: right;
  border-top: 1px solid #eee;
}

.got-it-btn {
  background: #8b4513;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-family: inherit;
}

.got-it-btn:hover {
  background: #a0522d;
}

.how-to-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 8px 12px;
  background: #8b4513;
  font-size: 0.8em;
}

.btn-icon {
  font-weight: bold;
  font-size: 1.2em;
}

.input-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

/* Ensure the modal scrolls if content is too tall */
@media (max-height: 700px) {
  .modal {
    max-height: 90vh;
  }
}

.debug-info {
  font-family: monospace;
  font-size: 12px;
}
</style>