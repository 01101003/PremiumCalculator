<template>
  <div class="ai-page">
    <div class="container">
      <h2>ASK MISTRAL</h2>
      <div id="chatbox" ref="chatbox">
        <div 
          v-for="(message, index) in messages" 
          :key="index" 
          class="message" 
          :class="message.type"
        >
          {{ message.text }}
        </div>
      </div>
      <div class="input-section">
        <textarea 
          id="userInput" 
          v-model="userInput" 
          placeholder="Ask me something..." 
          @keypress.enter.prevent="sendMessage"
        ></textarea>
        <button id="send-btn" @click="sendMessage">Send</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userInput: '',
      messages: []
    };
  },
  methods: {
    async sendMessage() {
      const message = this.userInput.trim();
      if (!message) return;

      // Add user message to chat
      this.messages.push({
        type: 'user',
        text: message
      });

      // Clear input
      this.userInput = '';
      
      // Scroll to bottom
      this.$nextTick(() => {
        this.scrollToBottom();
      });

      try {
        // Send to API
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userMessage: message })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // Add AI response to chat
        this.messages.push({
          type: 'ai',
          text: data.reply
        });
        
        // Scroll to bottom again after response
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      } catch (error) {
        console.error("Error:", error);
        // Add error message
        this.messages.push({
          type: 'ai',
          text: "Error: Unable to reach AI. Please try again later."
        });
        
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      }
    },
    scrollToBottom() {
      const chatbox = this.$refs.chatbox;
      chatbox.scrollTop = chatbox.scrollHeight;
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

.ai-page {
  font-family: 'Press Start 2P', cursive;
  margin: 0;
  padding: 0;
  background-color: #ffe4c4;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.container {
  width: 90%;
  max-width: 800px;
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 0 15px rgba(0,0,0,0.1);
}

h2 {
  text-align: center;
  color: #8B4513;
  margin-bottom: 30px;
}

#chatbox {
  height: 400px;
  overflow-y: auto;
  border: 2px solid #333;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 15px;
  background: #f5f5f5;
}

.message {
  margin: 10px 0;
  padding: 10px;
  border-radius: 5px;
  max-width: 80%;
  word-wrap: break-word;
}

.user {
  background: #f0f8ff;
  align-self: flex-end;
  margin-left: auto;
}

.ai {
  background: #e6f2ff;
  align-self: flex-start;
}

.input-section {
  display: flex;
  gap: 10px;
}

#userInput {
  flex-grow: 1;
  min-height: 100px;
  border: 2px solid #333;
  border-radius: 5px;
  padding: 10px;
  font-family: inherit;
}

#send-btn {
  padding: 15px;
  background: #ff6b6b;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-family: inherit;
  transition: 0.3s;
}

#send-btn:hover {
  background: #ff5252;
}
</style>

