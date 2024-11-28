<template>
  <div id="app">
    <main>
      <router-view />
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App',
});
</script>

<style scoped>
@media (min-width: 1024px) {
  header {
    display: flex;
    align-items: center; 
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    align-items: flex-start; 
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;
    padding: 1rem 0;
    margin-top: 1rem;
  }
}
  
main {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

#app {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
