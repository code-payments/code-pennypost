<script setup lang="ts">
import { nextTick, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { isLoggedIn } from '../../state/account';
import { createPost } from '../../services/helpers/post';
import { uploadFile } from '../../services/helpers/data';
import { isContentEmpty } from '../../utils/html';

import SectionHeader from '../sections/SectionHeader.vue';
import EditorView from '../sections/EditorView.vue';
import GenericLayout from '../layouts/GenericLayout.vue';

import DialogPublishArticle from '../dialogs/DialogPublishArticle.vue';
import DialogEmptyArticle from '../dialogs/DialogEmptyArticle.vue';

const router = useRouter();
const state = reactive({
  content: '',
  isPublishDialogOpen: false,
  isEmptyDialogOpen: false,
  pendingUploads: [] as Promise<any>[],
  uploadedFiles: [] as [string, string][],
});

const onChange = (val: string) => {
  state.content = val;
}

const onUpload = async (file: {blob: Blob, url: string}) => {
  const req = uploadFile(file.blob);
  state.pendingUploads.push(req);

  const res = await req;
  state.uploadedFiles.push([file.url, res.id]);
}

const onPost = async () => {
  if (isContentEmpty(state.content)) {
    state.isEmptyDialogOpen = true;
  } else {
    state.isPublishDialogOpen = true;
  }
}

const onPublish = async () => {
  await Promise.all(state.pendingUploads);

  // This is an unfortunate workaround to get the HTML content from the editor
  // on Safari mobile. This browser does not trigger the `change` event when the
  // editor is updated after an upload, so we need to manually trigger an event
  // in order to get the latest content.
  document.querySelector('[data-medium-editor-element]')?.dispatchEvent(new Event('input'));

  nextTick(async () => {
    // Change the blob URLs to the uploaded file URLs in the content.
    // The path is `/content/{id}`
    for (const [url, id] of state.uploadedFiles) {
      state.content = state.content.replace(url, `/content/${id}`);
    }

    const res = await createPost(state.content);
    const [slug, title] = res.slug.split('/');
    router.push({ name: 'share', params: { slug, title } });
  });
}

onMounted(() => {
  if (!isLoggedIn()) {
    router.push({ name: 'home' });
  }
})
</script>

<template>
  <GenericLayout>
    <template #header>
      <SectionHeader>
        <div class="group flex items-center justify-items">
          <button @click="onPost" 
          class="sm:inline-flex justify-center rounded-full py-1 px-3 sm:px-4
          text-sm sm:text-md text-white font-semibold bg-[#34AA4E]
          whitespace-nowrap">
              Post
          </button>
        </div>
      </SectionHeader>
    </template>

    <template #main>
      <section class="article text-[#07204E]">

        <EditorView @change="onChange" @upload="onUpload" />

      </section>
    </template>

    <template #footer>
    </template>
  </GenericLayout>

  <DialogPublishArticle v-if="state.isPublishDialogOpen" @close="state.isPublishDialogOpen = false" @publish="onPublish" />
  <DialogEmptyArticle v-if="state.isEmptyDialogOpen" @close="state.isEmptyDialogOpen = false" />
</template>

<style>

.article p, 
.article h1,
.article h2,
.article h3 {
  color: #07204E !important;
}

.article h1 {
    margin-top: 1.5rem !important;
    font-size: 2.25rem !important;
    font-weight: 700 !important;
    letter-spacing: -0.025em !important;
}

@media (min-width: 640px) {
    .article h1 {
        font-size: 3rem !important;
    }
}

</style>