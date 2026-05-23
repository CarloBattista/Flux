<template>
  <span class="loader"></span>
</template>

<script>
export default {
  name: 'loader',
};
</script>

<style scoped>
.loader {
  height: 36px;
  aspect-ratio: 1;
  border-radius: 50%;
  display: inline-block;
  border-top: 3px solid #fff;
  border-right: 3px solid transparent;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  to {
    transform: rotate(360deg);
  }
}
</style>
