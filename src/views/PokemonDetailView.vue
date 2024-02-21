<!-- Pokemon detail view Page -->
<!-- once user click pokemon on main page, this page shows detailed information of selected pokemon by id.  -->
<template>
  <div class="view__pokemon">
    <div class="pokemon" :key="pokemonId" :class="{ captured: pokemon.captured }" >
      <div class="pokemon__image">
        <img :src="pokemon.sprite" :alt="pokemon.name" />
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
    </div>
  </div>
</template>

<script>
  import { useRouter, useRoute } from 'vue-router';
  import { onMounted, computed, ref } from 'vue';
  import { usePokemonStore } from '@/store/pokemonStore';

export default {
  setup() {
    const router = useRoute();
    const pokemonStore = usePokemonStore();
    const pokemonId = ref('');
    const pokemon = ref({
      captured: false,
      name: '',
      sprite: '', 
      description: '',
      types: [],
      abilities: [],
      height: '',
      weight: ''
    });
    //once mounted component, find pokemon by id.
    onMounted(() => {
      if(router.params.id) {
        pokemonId.value = router.params.id;
        pokemon.value = pokemonStore.pokemons.find((pokemon) => pokemon.id === parseInt(pokemonId.value));
      }
    });

    return { pokemonId, pokemon };
  }
};
</script>

<style scoped>
  .view__pokemon .pokemon {
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
    width: 100%;
    max-width: 50%;
    margin: 30px auto;
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

  .pokemon.captured {
    background-color: #f0f0f0;
  }
</style>
