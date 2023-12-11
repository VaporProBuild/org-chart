<!-- <code from: https://codepen.io/dcode-software/pen/vYKVepQ> -->

<template>
  <div class="screen">
    <div class="loading loading--full-height"/>
  </div>
</template>

<style scoped>
.screen {
  position: absolute;
  height: 100%;
  width: 100%;
  background-color: rgba(51, 51, 51, 0.5); /* Set the desired background color and transparency here */
  z-index: 99999;
}

/* Style #1 */
.loading {
  display: flex;
  justify-content: center;
}

.loading--full-height {
  align-items: center;
  height: 100%;
}

.loading::after {
  content: "";
  width: clamp(50px, 20vw, 150px);
  height: clamp(50px, 20vw, 150px);
  border: 10px solid #dddddd;
  border-top-color:rgb(85, 113, 150);
  border-radius: 50%;
  transform: rotate(0.16turn);
  animation: loading 1s ease infinite;
}

@keyframes loading {
  /* Safari support */
  from {
    transform: rotate(0turn);
  }
  
  to {
    transform: rotate(1turn);
  }
}
</style>