<template>
  <navigation />
  <div class="w-full max-w-[900px] mx-auto px-6 py-24">
    <div class="markdown-content" v-html="formattedContent"></div>
  </div>
  <contentInfo />
</template>

<script>
import { marked } from 'marked';

import '../../style/markdown.css';

import navigation from '../../components/navigation/navigation.vue';
import contentInfo from '../../components/navigation/content-info.vue';

import content from '../../markdown/cookie/21-05-26.md?raw';

export default {
  name: 'Cookie',
  components: {
    navigation,
    contentInfo,
  },
  computed: {
    formattedContent() {
      return marked(content);
    },
  },
  mounted() {
    window.scrollTo(0, 0);
  },
};
</script>

<style scoped></style>
