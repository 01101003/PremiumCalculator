<template>
  <div class="sidebar" :class="{ 'collapsed': isCollapsed }">
    <div class="sidebar-header">
      <router-link to="/" class="sidebar-logo">
        <span class="premium">PREMIUM</span>
        <span class="calculator">CALCULATOR</span>
      </router-link>
      <button class="collapse-button" @click="toggleCollapse">
        {{ isCollapsed ? '→' : '←' }}
      </button>
    </div>
    
    <div class="sidebar-content">
      <!-- User Profile Section -->
      <div class="user-profile" v-if="isLoggedIn">
        <div class="avatar">
          <img :src="userProfileImage || '/api/placeholder/40/40'" alt="User Avatar" />
        </div>
        <div class="user-info" v-show="!isCollapsed">
          <h3>{{ username }}</h3>
          <p>{{ userPlan }}</p>
          <button 
            class="logout-button" 
            @click="$emit('logout')"
            @mouseenter="buttonMouseEnter"
            @mouseleave="buttonMouseLeave"
            @mousedown="buttonMouseDown"
            @mouseup="buttonMouseUp"
          >
            LOGOUT
          </button>
        </div>
      </div>
      
      <div class="login-prompt" v-else>
        <div class="auth-buttons">
          <button 
            class="auth-button"
            @click="$emit('show-login', 'login')"
            @mouseenter="buttonMouseEnter"
            @mouseleave="buttonMouseLeave"
            @mousedown="buttonMouseDown"
            @mouseup="buttonMouseUp"
          >
            LOGIN
          </button>
          <button 
            class="auth-button"
            @click="$emit('show-login', 'signup')"
            @mouseenter="buttonMouseEnter"
            @mouseleave="buttonMouseLeave"
            @mousedown="buttonMouseDown"
            @mouseup="buttonMouseUp"
          >
            SIGN UP
          </button>
        </div>
        <span v-show="!isCollapsed">to save your calculations</span>
      </div>
      
      <!-- Navigation Links -->
      <nav class="sidebar-nav">
        <h4 v-show="!isCollapsed">CALCULATORS</h4>
        <router-link 
          v-for="(url, name) in calculatorLinks" 
          :key="name"
          :to="{ name: url }"
          class="nav-item"
          :class="{ 'icon-only': isCollapsed }"
          :title="name"
        >
          <span class="icon">{{ name.charAt(0) }}</span>
          <span class="label" v-show="!isCollapsed">{{ name }}</span>
        </router-link>
        
        <h4 v-show="!isCollapsed">ACTIONS</h4>
        <router-link 
          v-for="(url, name) in actionLinks" 
          :key="name"
          :to="url ? { name: url } : ''"
          class="nav-item"
          :class="{ 'icon-only': isCollapsed }"
          :title="name"
          @click.native="handleActionLink(name, $event)"
        >
          <span class="icon">{{ getIcon(name) }}</span>
          <span class="label" v-show="!isCollapsed">{{ name }}</span>
        </router-link>

        <div v-if="isLoggedIn" class="nav-section">
          <h4 v-show="!isCollapsed">HISTORY</h4>
          <router-link 
            to="/calculations-history"
            class="nav-item"
            :class="{ 'icon-only': isCollapsed }"
            title="Calculations History"
          >
            <span class="icon">📊</span>
            <span class="label" v-show="!isCollapsed">CALCULATIONS</span>
          </router-link>
        </div>
      </nav>
    </div>
  </div>
</template>
<script>
import { appwriteService } from '@/config/appwrite';

export default {
  name: 'Sidebar',
  props: {
    isLoggedIn: {
      type: Boolean,
      default: false
    },
    username: {
      type: String,
      default: ''
    },
    userPlan: {
      type: String,
      default: 'Free Plan'
    }
  },
  data() {
    return {
      isCollapsed: false,
      calculatorLinks: {
        'ALGEBRA': 'algebra',
        'GEOMETRY': 'geometryoptions',
        'STATISTICS': 'statistics',
        'COMBINATORICS': 'combinatorics',
        'DISCRETE MATH': 'dismath',
        'NUMBER THEORY': 'numbers'
      },
      actionLinks: {
        'ABOUT US': '',
        'CHEAT SHEET': 'cheatsheet',
        'ASK MISTRAL': 'AI'
      },
      userProfileImage: null
    }
  },
  methods: {
    toggleCollapse() {
      this.isCollapsed = !this.isCollapsed;
    },
    handleActionLink(name, event) {
      if (name === 'ABOUT US') {
        event.preventDefault();
        this.$emit('show-about');
      }
    },
    getIcon(name) {
      const icons = {
        'ABOUT US': 'ℹ️',
        'CHEAT SHEET': '📝',
        'ASK MISTRAL': '🤖'
      };
      return icons[name] || name.charAt(0);
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
    async fetchUserProfileImage() {
      if (this.isLoggedIn) {
        try {
          const users = await appwriteService.databases.listDocuments(
            appwriteService.DATABASE_ID,
            appwriteService.COLLECTIONS.USERS,
            [appwriteService.databases.Query.equal('email', this.username)]
          );
          
          if (users.total > 0 && users.documents[0].profile_image) {
            this.userProfileImage = users.documents[0].profile_image;
          }
        } catch (error) {
          console.error('Failed to fetch profile image:', error);
        }
      }
    }
  },
  watch: {
    isLoggedIn(newValue) {
      if (newValue) {
        this.fetchUserProfileImage();
      } else {
        this.userProfileImage = null;
      }
    }
  },
  mounted() {
    this.fetchUserProfileImage();
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

.sidebar {
  font-family: 'Press Start 2P', cursive;
  background-color: white;
  height: 100vh;
  width: 250px;
  position: fixed;
  top: 0;
  left: 0;
  box-shadow: 3px 0 10px rgba(0,0,0,0.1);
  transition: width 0.3s ease;
  z-index: 1000;
  display: flex;
  flex-direction: column;
}

.sidebar.collapsed {
  width: 70px;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 15px;
  border-bottom: 2px solid #f0f0f0;
}

.sidebar-logo {
  display: flex;
  flex-direction: column;
  text-decoration: none;
  font-size: 12px;
  max-width: 180px;
  overflow: hidden;
}

.premium {
  color: #8B4513;
}

.calculator {
  color: #ff6b6b;
}

.collapsed .sidebar-logo {
  font-size: 10px;
}

.collapse-button {
  background: white;
  border: 2px solid #333;
  color: #333;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 2px 2px 0 #333;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: inherit;
  padding: 0;
}

.sidebar-content {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow-y: auto;
  padding: 20px 0;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 0 15px 20px 15px;
  border-bottom: 2px solid #f0f0f0;
}

.avatar img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #ff6b6b;
}

.user-info h3 {
  margin: 0;
  font-size: 12px;
  color: #333;
}

.user-info p {
  margin: 5px 0 0;
  font-size: 10px;
  color: #666;
}

.login-prompt {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 20px 15px;
  border-bottom: 2px solid #f0f0f0;
}

.login-button {
  background: white;
  border: 2px solid #333;
  color: #333;
  padding: 8px 12px;
  font-size: 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 3px 3px 0 #333;
  font-family: inherit;
}

.login-prompt span {
  font-size: 10px;
  color: #666;
  text-align: center;
}

.sidebar-nav {
  padding: 20px 15px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.sidebar-nav h4 {
  margin: 10px 0 5px;
  font-size: 10px;
  color: #666;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 15px;
  text-decoration: none;
  color: #333;
  padding: 8px 10px;
  border-radius: 4px;
  transition: 0.3s;
  font-size: 12px;
}

.nav-item:hover {
  background-color: #f5f5f5;
}

.nav-item .icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #8B4513;
}

.nav-item.icon-only {
  justify-content: center;
}

.nav-item.icon-only .icon {
  margin: 0;
}

.auth-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
}

.auth-button {
  background: white;
  border: 2px solid #333;
  color: #333;
  padding: 8px 12px;
  font-size: 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 3px 3px 0 #333;
  font-family: inherit;
}

</style>