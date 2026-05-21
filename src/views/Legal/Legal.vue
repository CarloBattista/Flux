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

const markdownFiles = import.meta.glob('../../markdown/**/*.md', { query: '?raw', import: 'default' });

export default {
  name: 'Legal',
  components: {
    navigation,
    contentInfo,
  },
  props: {
    slug: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      content: '',
    };
  },
  computed: {
    formattedContent() {
      return marked(this.content || '');
    },
  },
  methods: {
    async loadMarkdown() {
      const filePath = Object.keys(markdownFiles).find((path) => path.includes(`/${this.slug}/`));

      if (filePath) {
        try {
          this.content = await markdownFiles[filePath]();
        } catch (error) {
          console.error('Errore nel caricamento del file markdown:', error);
          this.content = '# Errore\nImpossibile caricare il contenuto.';
        }
      } else {
        this.content = '# Non trovato\nLa pagina richiesta non esiste.';
      }
    },
  },
  watch: {
    slug: {
      immediate: true,
      handler: 'loadMarkdown',
    },
  },
};
</script>

<style scoped></style>
