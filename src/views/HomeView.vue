<script>
import { ref } from 'vue'
import io from 'socket.io-client';
const socket = io('http://localhost:5173');

socket.on('message', (data)=>{
  console.log(data);
})
socket.on('connect_error', (data)=>{
  console.error(data);
})

export default {
  name: 'Homeview',
  components:'HelloWorld',
  data() {
    return {
      message: null,
      room_id: 1
    }
  },
  methods: {
    send() {
      socket.emit('message', {
        message: this.message,
        room_id: this.room_id
      });
    }
  }
};
</script>

<template>
  <main>
    <TheWelcome />
  </main>
  <div class="home">
    <input type="number" v-model="room_id"/>
    <input type="text" v-model="message">
    <button @click="send">Отправить</button>
    <div class="chat"></div>
  </div>
</template>
