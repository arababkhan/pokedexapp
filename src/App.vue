<template>
  <div id="app">
    <HeaderComponent />
    <main>
      <router-view />
    </main>
  </div>
</template>

<script>
import HeaderComponent from '@/components/Header.vue';

export default {
  components: {
    HeaderComponent,
  },
};
</script>

<style>
  body {
    padding: 0;
    margin: 0;
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }
</style>
