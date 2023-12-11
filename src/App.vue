<!-- App.vue -->

<template>
  <div class="app">
    <router-view />
  </div>
</template>

<script>

export default {
  name: 'App',
  components: {
  },
  data() {
    return {
    }
  },
  computed: {
  },
  methods: {
  },
}
</script>

<style lang="scss">

@import "./index.scss";

* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  font-family: "Montserrat", sans-serif;
  background-color: transparent;
}

.app {
  display: flex;
  font-family: "Montserrat", sans-serif;
  text-align: center;
  height: 100vh;
  width: 100vw;
  overflow: hidden; /* Hide scrollbars */
}

@font-face {
  font-family: 'Material Icons';
  src: url('../assets/MaterialSymbolsRounded[FILL,GRAD,opsz,wght].woff2') format('woff2');
}

@font-face {
  font-family: 'Montserrat';
  src: url('../assets/Montserrat-Regular.ttf') format('truetype');
  font-family: 'Montserrat';
}
</style>
