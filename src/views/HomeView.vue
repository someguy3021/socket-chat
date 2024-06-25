<script>
import { ref } from 'vue'
import io from 'socket.io-client';
const socket = io('http://localhost:5173');

export default {
  name: 'Homeview',
  components:'HelloWorld',
  data() {
    return {
      message: null
    }
  },
  methods: {
    send() {
      socket.emit('message', this.message);
    }
  }
};
</script>

<template>
  <main>
    <TheWelcome />
  </main>
  <div>
    <input type="text" v-model="message">
    <button @click="send">Отправить</button>
  </div>
</template>
