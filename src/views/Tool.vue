<template>
  <div>Tool</div>
</template>

<script>
export default {
  name: 'Tool',
  data() {
    return {
      slug: this.$route.params.slug,
    };
  },
  watch: {
    '$route.params.slug': {
      handler(value) {
        if (value) this.slug = value;
      },
      immediate: true,
    },
  },
};
</script>

<style scoped></style>
