<template>
  <div>
    <p>Hämtar data<span>{{ dots }}</span></p>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from 'vue';

export default defineComponent({
  name: 'LoadingAnimation',
  setup() {
    const dots = ref('');
    let interval: number;

    onMounted(() => {
      interval = window.setInterval(() => {
        dots.value = dots.value.length < 3 ? dots.value + '.' : '';
      }, 500);
    });

    onUnmounted(() => {
      clearInterval(interval);
    });

    return { dots };
  },
});
</script>
