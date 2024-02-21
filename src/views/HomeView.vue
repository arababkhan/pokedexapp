<!-- Main Page which lists pokermons. -->
<!-- If user logged in, all pokermons are listed. If not, only uncaptured pokermons are listed.  -->
<template>
    <div class="home">
      <div class="search-bar">
        <input type="text" v-model="searchTerm" placeholder="Search Pokémon" @input="filterPokemons">
        <button @click="addPokemonForm">Add pokemon</button>
      </div>
      <div class="filter-bar"> 
        <label for="sort-type">Sort by</label>
        <select id="sort-type" v-model="sortKey">
          <option value="name">Name</option>
          <option value="abilities">Abilities</option>
        </select>

        <label for="sort-order">Sort by</label>
        <select id="sort-order" v-model="sortOrder">
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
          
        <input type="checkbox" v-model="showCaptured" class="check"/>
        <label>Favorite</label> 
      </div>
      
      <div class="pokemon-list">
        <div class="pokemon" v-for="pokemon in filteredPokemons" :key="pokemon.id" :class="{ captured: pokemon.captured }">
          <div class="pokemon__image">
            <img :src="pokemon.sprite" :alt="pokemon.name" @click="goToPokemon(pokemon.id)"/>
          </div>
          <div class="pokemon__info">
            <div class="pokemon__name">{{ pokemon.name }}</div>
            <div class="pokemon__description">{{ pokemon.description }}</div>
            <div class="pokemon__types">
                <div class="pokemon__type" v-for="pokemon_type in pokemon.types" :class="pokemon_type.toLowerCase()">{{ pokemon_type }}</div>
            </div>
            <div class="pokemon__abilities">
                <div class="pokemon__ability" v-for="pokemon_ability in pokemon.abilities">{{ pokemon_ability }}</div>
            </div>
            <div class="pokemon__stats">
                <div class="pokemon__stat">
                    <div class="pokemon__stat-name">Height</div>
                    <div class="pokemon__stat-value">{{ pokemon.height }}</div>
                </div>
                <div class="pokemon__stat">
                    <div class="pokemon__stat-name">Weight</div>
                    <div class="pokemon__stat-value">{{ pokemon.weight }}</div>
                </div>
            </div>
          </div>
          <div v-if="isLoggedIn" class="delete-pokemon" @click="deletePokemon(pokemon.id)">
            <img src="@/assets/trash-icon.png" alt="Delete" />
          </div>
        </div>
      </div>
      <!--  Form to add pokemon -->
      <div v-if="showAddForm" class="add-pokemon-form">
        <h1>Adding Pokemon</h1>
        <form @submit.prevent="addPokemon" class="form__form">
          
          <div class="form__form-group">
            <label for="pokemonId">Id</label>
            <input id="pokemonId" type="number" v-model.number="newPokemon.id" placeholder="Id" required>
            <label for="name">Name</label>
            <input id="name" type="text" v-model="newPokemon.name" placeholder="Name" required>
            <label for="species">Species</label>
            <input id="species" type="text" v-model="newPokemon.species" placeholder="Species" required>
          </div>
          <div class="form__form-group">
            <label for="height">Height</label>
            <input id="height" type="text" v-model="newPokemon.height" placeholder="Height">
            <label for="weight">Weight</label>
            <input id="weight" type="text" v-model="newPokemon.weight" placeholder="Weight">
            <label for="sprite">Sprite</label>
            <input id="sprite" type="text" v-model="newPokemon.sprite" placeholder="Sprite" >
          </div>
          <div class="form__form-group">
            <label for="types">Type:</label>
            <select id="types" v-model="newPokemon.types" multiple required>
              <option v-for="type in allTypes" :key="type" :value="type">{{ type }}</option>
            </select>
            <label for="abilities">Abilities:</label>
            <select id="abilities" v-model="newPokemon.abilities" multiple>
              <option v-for="ability in allAbilities" :key="ability" :value="ability">{{ ability }}</option>
            </select>
          </div>
          <div class="form__form-group">
            <label for="desc">Description:</label>
            <textarea id="desc" v-model="newPokemon.description"/>
            <div class="captured_pan">
              <input id="captured" type="checkbox" v-model="newPokemon.captured"/>
              <label>Caputred</label>
            </div>
            <div class="form__button-panel">
              <button class="form__submit" type="submit">Submit</button>
              <button class="form__submit" @click="showAddForm = false">Cancel</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import { computed, ref, onMounted } from 'vue';
  import { usePokemonStore } from '@/store/pokemonStore'; 
  import { useUserStore } from '@/store/userStore'; 
  import { useRouter } from 'vue-router';
  
  export default {
    setup() {
      const pokemonStore = usePokemonStore();
      const userStore = useUserStore();
      const router = useRouter();

      const searchTerm = ref(''); //ref of search input box.
      const sortKey = ref('name'); //ref of sort key.
      const sortOrder = ref('asc'); //ref of sort order.
      const showCaptured = ref(false); //ref of check box named favorite.
      
      const showAddForm = ref(false); //variable for showing or hidding addform.
      const newPokemon = ref({
        id: 0,
        name: '',
        description: '',
        species: '',
        types: [],
        abilities: [],
        height: '',
        weight: '',
        sprite: '',
        captured: false,
      });

      const allTypes = ref(['FIRE', 'WATER', 'GRASS', 'ELECTRIC', 'ICE', 'POISON', 'GROUND', 'FLYING', 'PSYCHIC', 'BUG', 'ROCK', 'GHOST', 'DRAGON']);
      const allAbilities = ref(['LEVITATE', 'HEATPROOF', 'SWARM', 'HUSTEL', 'TRUANT', 'SEND VEIL', 'ROUGH SKIN']);

      //when mounted component, fetch pokemons from backend.
      onMounted(async () => {
        try {
            await pokemonStore.fetchPokemons();
        } catch (error) {
            alert("An error occurred while fetching Pokemons");
        }
      });

      //get state if user logged in
      const isLoggedIn = computed(() => userStore.isLogged); 

      //get pokemons filtered or sorted
      const filteredPokemons = computed(() => {
        let result = pokemonStore.pokemons;

        //filtering
        if (searchTerm.value) {
          result = result.filter((pokemon) =>
            pokemon.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
            pokemon.description.toLowerCase().includes(searchTerm.value.toLowerCase())
          );
        }
        
        //getting only captured pokemons. it's available only if user logged in.
        if (showCaptured.value && isLoggedIn.value) {
          result = result.filter(pokemon => pokemon.captured);
        }
  
        // Sorting logic
        result = result.sort((a, b) => {
          let comparison = 0;
          if (a[sortKey.value] < b[sortKey.value]) {
            comparison = -1;
          } else if (a[sortKey.value] > b[sortKey.value]) {
            comparison = 1;
          }
          return sortOrder.value === 'asc' ? comparison : comparison * -1;
        });
  
        return result;
      });
      
      // delete pokemon. it's available only if user logged in.
      async function deletePokemon(id) {
        await pokemonStore.deletePokemon(id);
      }
      
      function filterPokemons() {
        const result = filteredPokemons.value;
      }
      
      //navigate to pokemon detail view page
      function goToPokemon(id) {
        if(isLoggedIn.value){
          router.push(`/pokemon/${id}`);
        } else {
          alert("you can see pokemon detail only if logged in.")
        }
      }

      //showing add pokemon form
      const addPokemonForm = () => {
        if(isLoggedIn.value)
          showAddForm.value = true;
        else
          alert("it's available only for loggined user")
      }

      //adding pokemon
      const addPokemon = async () => {
        console.log(newPokemon.value)
        pokemonStore.addPokemon(newPokemon.value);
        // Reset the form
        newPokemon.value = {
          id: 0,
          name: '',
          description: '',
          species: '',
          types: [],
          abilities: [],
          height: '',
          weight: '',
          sprite: '',
          captured: false, 
        }; 
        showAddForm.value = false; // Hide the form
      };

      return {
        searchTerm,
        sortKey,
        sortOrder,
        showCaptured,
        filteredPokemons,
        deletePokemon,
        isLoggedIn,
        filterPokemons,
        goToPokemon,
        showAddForm,
        newPokemon,
        addPokemon,
        allTypes,
        allAbilities,
        addPokemonForm
      };
    },
  };
  </script>
  
  <style scoped>
 .search-bar {
    display: flex;
    align-items: center;
    padding: 10px;
  }

  .search-bar input {
    height: 25px;
    width: 100%;
  }

  .search-bar button {
    height: 35px;
    background-color: #78c850;
    color: white;
    margin: 0px 10px;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
  }

  .filter-bar {
    display: flex;
    align-items: center;
    padding: 20px;
    background-color: #f5f5f5;
    border-top: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
  }
 
  .filter-bar label {
    margin-right: 10px;
  }
 .filter-bar select {
   padding: 10px;
   margin-right: 20px;
   border: 1px solid #ccc;
   border-radius: 4px;
   outline: none;
 }

 .filter-bar .check{
    cursor: pointer;
  }

  .pokemon {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 20px;
    max-width: 400px;
    padding: 1rem;
    border-radius: 1rem;
    background-color: #fff;
    box-shadow: 0 0 1rem rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    position: relative;
    cursor: pointer;
  }
  .pokemon.captured {
    background-color: #f0f0f0;
  }
  .pokemon__image {
    width: 100%;
    max-width: 200px;
    height: 100%;
    max-height: 200px;
    margin-bottom: 1rem;
  }
  .pokemon__image img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  .pokemon__info {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .pokemon__name {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    color: #333;
    text-decoration: none;
  }
  .pokemon__description {
    font-size: 1rem;
    font-weight: 400;
    margin-bottom: 1rem;
  }
  .pokemon__types {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
  }
  .pokemon__type {
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    margin-right: 0.5rem;
  }
  .pokemon__type.fire {
    background-color: #f08030;
    color: #fff;
  }
  .pokemon__type.water {
    background-color: #6890f0;
    color: #fff;
  }
  .pokemon__type.grass {
    background-color: #78c850;
    color: #fff;
  }
  .pokemon__type.electric {
    background-color: #f8d030;
    color: #fff;
  }
  .pokemon__type.ice {
    background-color: #98d8d8;
    color: #fff;
  }
  .pokemon__type.fighting {
    background-color: #c03028;
    color: #fff;
  }
  .pokemon__type.poison {
    background-color: #a040a0;
    color: #fff;
  }
  .pokemon__type.ground {
    background-color: #e0c068;
    color: #fff;
  }
  .pokemon__type.flying {
    background-color: #a890f0;
    color: #fff;
  }
  .pokemon__type.psychic {
    background-color: #f85888;
    color: #fff;
  }
  .pokemon__type.bug {
    background-color: #a8b820;
    color: #fff;
  }
  .pokemon__type.rock {
    background-color: #b8a038;
    color: #fff;
  }
  .pokemon__type.ghost {
    background-color: #705898;
    color: #fff;
  }
  .pokemon__type.dragon {
    background-color: #7038f8;
    color: #fff;
  }
  .pokemon__type.dark {
    background-color: #705848;
    color: #fff;
  }
  .pokemon__type.steel {
    background-color: #b8b8d0;
    color: #fff;
  }
  .pokemon__type.fairy {
    background-color: #ee99ac;
    color: #fff;
  }
  .pokemon__abilities {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
  }
  .pokemon__ability {
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    margin-right: 0.5rem;
    background-color: #f8f8f8;
    color: #000;
  }
  .pokemon__stats {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .pokemon__stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .pokemon__stat-name {
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    margin-bottom: 0.25rem;
  }
  .pokemon__stat-value {
    font-size: 1rem;
    font-weight: 700;
  }
  .delete-pokemon {
    position: absolute;
    top: 10px;
    right: 10px;
    background: transparent;
    border: 0;
    padding: 0;
    cursor: pointer;
  }
  .delete-pokemon img {
    width: 20px;
  }

  .pokemon-list {
    display: grid;
    width: 100%;
    grid-template-columns: 1fr 1fr 1fr;
  }

  .add-pokemon-form {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    z-index: 100;
  }
  .form__form {
    display: flex;
    flex-wrap: wrap;
  }
  .form__form-group {
    margin-bottom: 20px;
    width: 50%;
    display: flex;
    flex-direction: column;
  }
  .form__form-group label {
    display: block;
    margin-bottom: 10px;
    text-align: left;
    font-size: 14px;
  }
  .form__form-group input,
  .form__form-group select,
  .form__form-group textarea {
    width: 90%;
    padding: 10px;
    border: 1px solid #888;
    border-radius: 4px;
    outline: none;
    text-align: left;
    margin-bottom: 10px;
  }
  .form__form-group input:focus,
  .form__form-group textarea:focus {
    border-color: #000;
  }
  .form__form-group textarea {
    height: 100px;
  }
  .form__form-group #captured {
    width: 20px;
    display: inline-block;
  }
  
  .form__form-group .captured_pan {
    display: flex;
    flex-direction: row;
  }
  .form__button-panel {
    padding-top: 20px;
  }
  .form__submit {
    width: 80px;
    padding: 10px;
    border: 1px solid #e5e5e5;
    border-radius: 4px;
    outline: none;
    cursor: pointer;
    min-width: 100px;
    background-color: #4caf50;
    color: #fff;
  }
  .form__submit:hover {
    background-color: #43a047;
  }
  </style>
  