<!--   Header component -->
<template>
    <header class="header">
        <div class="left">
            <img src="@/assets/logo.png" alt="Pokedex" class="logo" @click="goToHome"/>
            <div class="app-name" @click="goToHome">Pokedex</div>
        </div>
        <div class="right">
            <div v-if="isLoggedIn" class="user-info">
                <span @click="goToProfile">{{ userName }}</span>
                <button @click="logout">Logout</button>
            </div>
            <button v-else @click="showLoginModal = true">Login</button>
        </div>
        <LoginComponent :showModal="showLoginModal" @update:showModal="showLoginModal = $event" />
    </header>
  </template>
  
  <script>
  import { computed, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useUserStore } from '@/store/userStore';
  import LoginComponent from '@/components/LoginModal.vue'; 

  export default {
    components: {
      LoginComponent
    },

    setup() {
      const userStore = useUserStore();
      const router = useRouter(); // Use useRouter to access the router instance
      const isLoggedIn = computed(() => userStore.isLogged);
      const userName = computed(() => userStore.getName);
  
      const logout = async() => {
        await userStore.logout();
        router.push('/');
      };
      
      const showLoginModal = ref(false);
      //navigate to profile page
      const goToProfile = () => {
        router.push('/profile');
      };
      //navigate to home page
      const goToHome = () => {
        router.push('/');
      }

      return {
        isLoggedIn,
        userName,
        logout,
        showLoginModal,
        goToProfile,
        goToHome
      };
    },
  };
  </script>
  
  <style scoped>
  .header {
    padding: 15px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #ccc;
    justify-content: space-between;
  }
  
  .header .left {
    display: flex;
    align-items: center;
  }

  .header .right {
    display: flex;
    align-items: center;
  }

  .header .logo {
    max-height: 50px;
    cursor: pointer;
  }
  
  .header .app-name {
    margin-left: 25px;
    font-weight: bold;
    font-size: 20px;
    cursor: pointer;
  }
  
  .user-info {
    display: flex;
    align-items: center;
  }

  .user-info span {
    display: flex;
    color: #2c3e50;
    font-weight: bold;
    text-decoration: none;
    cursor: pointer;
  }
  
  button {
    background: #2c3e50;
    color: #fff;
    border: 0;
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
    margin-left: 15px;
  }
  </style>
  