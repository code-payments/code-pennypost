<script setup lang="ts">
import * as proto from '@code-pennypost/api';
import { UserCircleIcon } from '@heroicons/vue/24/solid';
import { CSSProperties, onMounted, reactive, ref } from 'vue';

import { useContext } from '../../state/context';
import { useConfig } from '../../config';
import { isLoggedIn, login } from '../../state/account';
import { getLocalizedTime } from '../../utils/time';
import { getFullContent } from '../../services/helpers/data';
import { getPaymentIntentId } from '../../services/helpers/payment';
import { ClientOnly } from '../ClientOnly';

import GenericLayout from '../layouts/GenericLayout.vue';
import SectionHeader from '../sections/SectionHeader.vue';
import SectionWriteOwn from '../sections/SectionWriteOwn.vue';
import CodePaymentButton from '../elements/CodePaymentButton.vue';

const props = defineProps({
  slug: { type: String, required: true, },
  title: { type: String, required: true, },
  offset: { type: String, default: 0, },
});

const config = useConfig();
const ctx = useContext();
const state = reactive({
  post: proto.Post.fromJsonString(ctx.post),
  owner: proto.User.fromJsonString(ctx.owner),
  content: ctx.preview,
  isPreview: true,
  previewHeight: 0,
});
const el = ref<HTMLElement | null>(null);

const payment = async (intent: string) => {

  await login(intent, 'direct');
  await unlock();

  return true;
}

const unlock = async () => {
    try {
      const res = await getFullContent(state.post.slug);
      if (res.result == proto.DataGetFullResponse_Result.OK) {

        setTimeout(() => {
          state.isPreview = false;
          state.previewHeight = el.value?.clientHeight || 0;
          state.content.html = res.content;
        }, 1000);

      }
    } catch (e) {
      console.warn(`Failed to get full content for ${state.post.slug}`, e);
    }
}

const scroll = () => {
  if (props.offset) {
    setTimeout(() => {
      window.scrollTo(0, parseFloat(props.offset));
    }, 100);
  }
}

const getContainerStyle = (): CSSProperties => {
  const height = 300;
  const gradientEnd = state.isPreview ? '100%' : `${height}px`;
  const background = `
    linear-gradient(180deg, 
    rgba(2, 0, 36, 0) 0,
    rgba(255, 255, 255, 0) ${height / 2}px,
    rgba(255, 255, 255, 1) ${gradientEnd},
    rgba(255, 255, 255, 1) 100%)`;

  if (state.isPreview) {
    return {
      background,
      height: `${height}px`,
      top: 'initial',
    };
  } else {
    const top = Math.abs(state.previewHeight - height);
    return {
      background,
      top: `${top}px`,
    };
  }
}

onMounted(async () => {
  scroll();

  if (isLoggedIn()) {
    await unlock();
  }
});
</script>


<template>
  <GenericLayout>
    <template #header>
        <SectionHeader />
    </template>

    <template #main>
      <div class="sm:mt-8 prose">

        <h1 class="mb-4" v-html="state.content.title"></h1>

        <div class="pb-4">
          <header class="border-t border-b border-gray-900/10" v-if="state.owner.name">
            <div class="flex">
              <div class="mr-4 flex-shrink-0 self-center">
                <UserCircleIcon class="h-12 w-12 text-gray-300" />
              </div>
              <div>
                <h4 class="text-xs uppercase">{{ state.owner.name }}</h4>
                <p class="mt-1 text-xs text-zinc-400">{{ getLocalizedTime(state.post.createdAt) }}</p>
              </div>
            </div>
          </header>

          <header class="flex flex-col" v-else>
            <time class="order-first flex items-center text-sm text-zinc-400 dark:text-zinc-500">
              <span class="h-4 w-0.5 rounded-full bg-zinc-200 dark:bg-zinc-500"></span>
              <span class="ml-3">{{ getLocalizedTime(state.post.createdAt) }}</span>
            </time>
          </header>
        </div>

        <div ref="el" class="relative">
          <section ref="el" v-html="state.content.html" />

          <!-- Preview Fade -->
          <div 
            class="absolute inset-0 pointer-events-none"
            :style="getContainerStyle()" 
            :class="{'fade-out': !state.isPreview}"></div>
        </div>

      </div>
    </template>

    <template #cta>
      <div>
        <div v-if="!state.isPreview">
          <SectionWriteOwn />
        </div>

        <div v-else class="w-full max-w-lg mx-auto">
          <div class="bg-white py-10 text-center ring-1 ring-inset ring-gray-900/5
              lg:flex lg:flex-col lg:justify-center lg:py-16">
            <div class="mx-auto max-w-sm">
              <p class="text-lg font-light mb-10">
                Unlock the rest of this post <br> for ${{ state.post.price }}
              </p>

              <ClientOnly>
                <CodePaymentButton v-if="state.post"
                  :create-intent="getPaymentIntentId"
                  :item="state.post.id"
                  :amount="state.post.price"
                  :destination="state.post.paymentAddress"
                  :currency="config.storeCurrency"
                  :success-url="`/redirect/payment/{{INTENT_ID}}/post/${state.post.slug}`"
                  @success="payment"
                />
              </ClientOnly>

              <p class="mt-6 text-xs leading-5 text-gray-600">Don’t have the Code Wallet app yet? <br>
                <a href="https://www.getcode.com/#Download" target="_blank" class="underline">Download It
                  Now</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </template>
  </GenericLayout>
</template>

<style scoped>
.fade-out {
  animation: fadeOut 1s ease-out forwards;
}

@keyframes fadeOut {
  0% {
    transform-origin: bottom;
    transform: scaleY(1) translateY(0%)
  }

  99% {
    transform: scaleY(0.5) translateY(50%);
  }

  100% {
    opacity: 0;
    display: none;
  }
}

</style>