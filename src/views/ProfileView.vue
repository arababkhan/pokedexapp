<template>
    <div class="profile__info" v-if="isLoggedIn">
      <div class="profile__image">
        <img :src="userLogo" alt="User Logo" />
      </div>
      <div class="profile__data">
        <div class="profile__name">{{ userName }}</div>
        <div class="profile__city">{{ userCity }}</div>
        <div class="profile__country">{{ userCountry }}</div>
        <div class="profile__email">{{ userEmail }}</div>
        <div class="profile__phone">{{ userPhone }}</div>
        <div class="profile__address">{{ userAddress }}</div>
      </div>
    </div>
  </template>
  
  <script>
  import { computed, onMounted } from 'vue';
  import { useUserStore } from '@/store/userStore';
  import { useRouter } from 'vue-router';
  
  export default {
    setup() {
      const userStore = useUserStore();
      const router = useRouter();
      const isLoggedIn = computed(() => userStore.isLogged);
  
      // Redirect to home if not logged in
      if (!isLoggedIn.value) {
        router.replace('/');
      }
      
      //once mounted component, fetch detailed user's information from backend.
      onMounted(async () => {
        try {
          //get detailed user's information
          await userStore.setUserData();
        } catch (error) {
            console.error("An error occurred while fetching user info:", error);
        }
      });

      const userLogo = computed(() => userStore.getAvatar);
      const userName = computed(() => userStore.getName);
      const userCity = computed(() => userStore.getCity); 
      const userCountry = computed(() => userStore.getCountry);
      const userEmail = computed(() => userStore.getEmail);
      const userPhone = computed(() => userStore.getPhone); 
      const userAddress = computed(() => userStore.getAddress); 

      return {
        isLoggedIn,
        userLogo,
        userName,
        userCity,
        userCountry,
        userEmail,
        userPhone,
        userAddress
      };
    }
  };
  </script>
  
  <style scoped>
  .profile__info {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin-top: 50px;
    margin-bottom: 50px;
  }
  .profile__image {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 50px;
  }
  .profile__image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .profile__data {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
  }
  .profile__name {
    font-size: 30px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  .profile__city,
  .profile__country,
  .profile__email,
  .profile__phone,
  .profile__address {
    font-size: 20px;
    margin-bottom: 10px;
  }
  </style>
  