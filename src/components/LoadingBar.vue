<template>
  <div class="screen">
    <div class="progress-container">
      <div
        class="progress-bar"
        :style="{ width: progress + '%', opacity: initialOpacity }"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'LoadingBar',
  props: {
    total: {
      type: Number,
      default: 1,
    },
    complete: {
      type: Number,
      default: 1,
    },
  },
  computed: {
    progress() {
      return ((this.complete + this.total / 5) / this.total) * 100;
    },
    initialOpacity() {
      return this.progress === 0;
    },
  },
})
</script>


<style scoped>
.screen {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(51, 51, 51, 0.5);
  z-index: 99999;
}

.progress-container {
  width: 60%;
  height: 40px;
  background-color: #f0f0f0;
  border-radius: 15px;
  overflow: hidden;
  border: rgb(221, 221, 221) solid 2.5px;
}

.progress-bar {
  height: 100%;
  border-radius: 8px;
  background: linear-gradient(to right, #557196, #227c9d);
  transition: width 0.5s;
  width: 0;
}

.time-info {
  margin-top: 10px;
  color: #ffffff;
  text-align: center;
}

.time-remaining,
.time-total {
  font-weight: bold;
}
</style>
