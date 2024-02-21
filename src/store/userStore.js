/*************************************/
/*   user store to manage user state */
/*************************************/

import { defineStore } from 'pinia';
import axios from 'axios';
import { API_BASE_URL } from '@/const/config';
import { usePokemonStore } from './pokemonStore';

export const useUserStore = defineStore('user', {
  state: () => ({
    logged: false,
    name: '',
    lastName: '',
    country: '',
    city: '',
    address: '',
    phone: '',
    avatar: '',
    birthday: '',
    email: '',
    token: null
  }),
  actions: {
    //login
    async login(credentials) {
      try {
        const response = await axios.post(`${API_BASE_URL}/login`, credentials);
        if(response.data.error) { //login failed
          return false;
        } else { //login success
          this.logged = true;
          this.name = response.data.data.name;
          this.lastName = response.data.data.lastName;
          this.token = response.data.data.tokenId;
          this.email = response.data.data.email;

          axios.defaults.headers.common['Authorization'] = `${this.token}`;

          //login succeed, fetch pokemons
          const pokemonStore = usePokemonStore();
          await pokemonStore.fetchPokemons();
          return true;
        }        
      } catch (error) {
        console.error('Login failed:', error);
        throw error; 
      }
    },
    //logout
    async logout() {
        this.logged = false;
        this.name = '';
        this.lastName = '';
        this.country = '';
        this.city = '';
        this.address = '';
        this.phone = '';
        this.avatar = '';
        this.birthday = '';
        this.email = '';
        this.token = null;

        axios.defaults.headers.common['Authorization'] = null;

        //if logout, fetch uncaptured pokemons.
        const pokemonStore = usePokemonStore();
        await pokemonStore.fetchPokemons();
    },
    //get detailed user info.
    async setUserData() {
      try{
        const response = await axios.get(`${API_BASE_URL}/user`);
        this.name = response.data.data.name;
        this.lastName = response.data.data.lastName;
        this.country = response.data.data.country;
        this.city = response.data.data.city;
        this.address = response.data.data.address;
        this.phone = response.data.data.phone;
        this.avatar = response.data.data.avatar;
        this.birthday = response.data.data.birthday;
        this.email = response.data.data.email;
      } catch (error) {
        console.error('getting User Info failed:', error);
        throw error; 
      }
    }
  },
  getters: {
    isLogged: (state) => state.logged,
    getName: (state) => state.name,
    getEmail: (state) => state.email,
    getAvatar: (state) => state.avatar,
    getCity: (state) => state.city,
    getCountry: (state) => state.country,
    getPhone: (state) => state.phone,
    getAddress: (state) => state.address,
    getToken: (state) => state.token,
  },
});
