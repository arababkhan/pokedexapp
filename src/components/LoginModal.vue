<!-- login modal. when user click login button on header, this modal will be shown. -->
<template>
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <div class="modal-header">
            <div class="modal__close">
                <img src="@/assets/cancle-icon.png" alt="close" @click="closeModal"/>
            </div>
            <h2 class="header-text">Login</h2>
        </div>
        <form @submit.prevent="login">
            <div class="input-group">
                <label for="email">Email</label>
                <input type="email" id="email" v-model="email" required>
            </div>
            <div class="input-group">
                <label for="password">Password</label>
                <input type="password" id="password" v-model="password" required>
            </div>
            <button type="submit" class="login-button">Login</button>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { useUserStore } from '@/store/userStore'; 

  export default {
    props: {
      showModal: Boolean
    },
    emits: ['update:showModal'],
    setup(props, { emit }) {
      const email = ref('');
      const password = ref('');
      const userStore = useUserStore();

      const login = async() => {
        try{
          const res = await userStore.login({ email: email.value, password: password.value });
          if(res)
            closeModal();
          else
            alert("unauthorized user!")
        } catch (error) {
          alert("login failed!")
        }
      };
  
      const closeModal = () => {
        emit('update:showModal', false);
      };
  
      return {
        email,
        password,
        login,
        closeModal
      };
    }
  };
  </script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .modal {
    background: white;
    padding: 20px;
    border-radius: 5px;
    width: 100%;
    max-width: 400px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    position: relative;
  }

  .header-text {
    width: 100%;
    text-align: center;
  }

  .modal__close {
    background-color: transparent;
    border: none;
    cursor: pointer;
    position: absolute;
    top: 0;
    right: 0;
  }

  .modal__close img {
    width: 20px;
  }

  .input-group {
    margin-bottom: 20px;
  }

  .input-group label {
    display: block;
    margin-bottom: 5px;
  }

  .input-group input {
    width: 90%;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  .login-button {
    width: 80px;
    background-color: #4CAF50; /* Green */
    color: white;
    padding: 10px 20px;
    margin: 0px 0px 10px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .login-button:hover {
    background-color: #45a049;
  }
  </style>
  