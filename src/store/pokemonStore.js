/********************************************/
/*   pokemon store to manage pokemons state */
/********************************************/

import { defineStore } from 'pinia';
import axios from 'axios';
import { API_BASE_URL } from '@/const/config';

export const usePokemonStore = defineStore('pokemon', {
  state: () => ({
    pokemons: [],
  }),
  actions: {
    //fetch pokemons from backend.
    async fetchPokemons() {
      const response = await axios.get(`${API_BASE_URL}/pokedex`);
      this.pokemons = response.data.data;
    },
    //add pokemon
    async addPokemon(pokemon) {
      await axios.post(`${API_BASE_URL}/pokemon`, pokemon);
      await this.fetchPokemons();
    },
    //delete pokemon
    async deletePokemon(pokemonId) {
      await axios.delete(`${API_BASE_URL}/pokemon`, {data: {id: pokemonId}});
      await this.fetchPokemons();
    },
  },
});
