<script setup lang="ts">
import { computed, defineAsyncComponent, reactive } from 'vue';
import { CoreOptions } from '../../types/editor-types';
import { ClientOnly } from '../ClientOnly';
import { extractDataUrls, convertDataUrlToBlob } from '../../utils/html';

import EditableTitle from '../elements/EditableTitle.vue';

const defaultTitle = 'Title';
const defaultContent = 'Tell your story...';

const currentDate = new Date().toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});

const state = reactive({
  isUploading: false,
  title: '',
  body: '',
  handledBlobUrls: [] as string[],
});

const editorOptions : CoreOptions = {

  placeholder: {
    text: defaultContent,
    hideOnClick: false
  },
  
  paste: {
    forcePlainText: false,
    cleanPastedHTML: true,
    cleanReplacements: [],
    cleanAttrs: ['class', 'style', 'dir'],
    cleanTags: ['meta'],
    unwrapTags: []
  },
  toolbar: {
    buttons: [
      'bold',
      'italic',
      'underline',
      'quote',
      'h2',
      'h3',
      'pre',
      'anchor',
    ]
  }
}

const emit = defineEmits(['change', 'upload']);
const content = computed(() => { return `<h1>${state.title}</h1>${state.body}`; });

function emitChange() {
  emit('change', content.value);
}

function emitUpload(blob: Blob, url: string) {
  emit('upload', { blob, url});
}

function onTitleChange() {
  emitChange();
}

async function onBodyChange(val: string) {
  state.body = val;
  emitChange();
  tryUpload();
}

async function tryUpload() {
  if (state.isUploading) {
    return;
  }

  state.isUploading = true;

  let html = state.body;
  const urls = await extractDataUrls(html);
  const blobs = await Promise.all(urls.map(convertDataUrlToBlob));

  // Replace the data URLs with blob URLs
  urls.forEach((url, index) => {
    const blob = blobs[index];
    const blobUrl = URL.createObjectURL(blob);


    // Now that we have the data URL converted to a blob URL, we need to update
    // the editor's content to reflect the change. If we don't, each keystroke
    // will trigger another upload.

    // But, we can't just do the following:

    // html = html.replace(url, blobUrl);
    // state.body = html;

    // Unfortunately, the editor doesn't know about our view model. So instead,
    // we need to manually replace the editor's content.

    // Find the url in the DOM:
    document.querySelectorAll('img').forEach((img) => {
      if (img.getAttribute('src') === url) {
        img.setAttribute('src', blobUrl);
        img.setAttribute('data-uploaded', 'true');
      }
    });
    
    emitUpload(blob, blobUrl);
  });

  state.isUploading = false;
}

// Dynamic import to avoid SSR issues
const MedianEditor = defineAsyncComponent(async() => {
  return (await import('vuejs-medium-editor')).default;
})
</script>

<template>
  <div class="sm:mt-8 prose">
    <header class="sm:flex flex-col hidden">
        <time datetime="2022-09-05"
        class="order-first flex items-center text-base text-zinc-400 dark:text-zinc-500"><span
        class="h-4 w-0.5 rounded-full bg-zinc-200 dark:bg-zinc-500"></span><span
        class="ml-3">{{currentDate}}</span>
        </time>
    </header>

    <div class="max-h-[80dvh] overflow-y-auto overflow-x-hidden px-4
    sm:max-h-none sm:overflow-auto sm:px-0">

      <EditableTitle v-model="state.title" :placeholder="defaultTitle" @update:modelValue="onTitleChange"/>

      <ClientOnly>
        <MedianEditor 
          hideVideo="true"
          hideGist="true" 
          hideImage="true"
          :options="editorOptions" 
          :onChange="onBodyChange" 
        />
      </ClientOnly>
    </div>
  </div>
</template>

<style>
.medium-editor-container {
  padding: 0;
  font-size: inherit !important;
}

.insert-image-container {
  display: none !important;
}

.medium-editor-placeholder {
  cursor: text;
  font-style: normal;
}
</style>