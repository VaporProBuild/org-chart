<template>
  <div class="error-popup">
    <p v-if="!message">
      Unknown Error
    </p>
    <p v-else>{{ message }}</p>
  </div>
</template>

<script>

export default {
  name: 'ErrorPopup',
  props: {
    message: {
      required: true,
      type: String,
    },
  },
}
</script>

<style>
.error-popup {
  height: auto;
  width: 18rem;
  background-color: rgb(153, 50, 50);
  color: white;
  position: absolute;
  right: 5rem;
  bottom: 3rem;
  padding-top: 1rem;
  padding-bottom: 1rem;
  padding-inline: 1.5rem;
  border-radius: 1rem;
  border: 0.5rem solid rgba(30, 41, 59, 0.584);
  overflow: hidden;
  text-align: left;
}

.error-popup p{
  color: white;
  font-size: 1rem;
  font-weight: bold;
}
</style>