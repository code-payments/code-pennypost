<script setup lang="ts">
    import { onMounted, ref } from 'vue';
    import { CheckIcon } from '@heroicons/vue/24/outline';

    import GenericLayout from '../layouts/GenericLayout.vue';
    import SectionHeader from '../sections/SectionHeader.vue';

    const props = defineProps({
        slug: { type: String, required: true, },
        title: { type: String, required: true, },
    });

    const el = ref<HTMLInputElement | null>(null);

    const url = ref('');
    const hasCopied = ref(false);

    const tweetText = "Read my latest Pennypost!";
    const hashtags = "pennypost";
    const via = "getcode";
    const tweetIntentUrl = ref('');

    const select = () => {
        if (el.value) {
            el.value.select();
        }
    }

    const onInputClick = () => {
        select();
    }

    const onCopyClick = () => {
        select();
        document.execCommand('copy', false, url.value);
        hasCopied.value = true;
        setTimeout(() => { hasCopied.value = false; }, 2000);
    }

    onMounted(() => {
        const port = window.location.port ? `:${window.location.port}` : '';
        const base = `${window.location.protocol}//${window.location.hostname}${port}`;
        url.value = `${base}/p/${props.slug}/${props.title}`
        tweetIntentUrl.value = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(url.value)}&hashtags=${hashtags}&via=${via}`

        // Update the browser URL without refreshing the page, so that the URL can be copied
        window.history.replaceState({}, '', url.value);
    });
    
</script>


<template>
  <GenericLayout>
    <template #header>
        <SectionHeader />
    </template>

    <template #main>

        <div class="max-w-2xl">
            <div class="text-left sm:text-center md:mt-10">
                <h1 class="text-2xl md:text-4xl font-bold tracking-tight text-[#07204E]">
                    Your Post Is Live!
                </h1>
                <p class="mt-6 text-base leading-6 text-[#07204E]">
                    Share the link below to access your post. Your article is private to those that have a link to it. It is up to you to share your article with the world.
                </p>

                <div class="mt-5 relative sm:max-w-sm sm:mx-auto">
                    <input :value="url" ref="el" @click="onInputClick()"
                    class="w-full pl-4 pr-10 truncate py-3 text-md sm:py-4
                    text-zinc-900 placeholder-zinc-500 border border-zinc-200
                    rounded-md appearance-none focus:outline-none
                    focus:ring-1 focus:ring-zinc-500 focus:border-zinc-500 text-center" 
                    readonly />

                    <button 
                    @click="onCopyClick()"
                    class="absolute right-4 top-5">
                        <CheckIcon v-if="hasCopied" class="text-green-500 h-5 w-5" />
                        <svg v-else class="h-4 w-4" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="16" height="16" fill="white" style="mix-blend-mode:multiply"/>
                            <path d="M14 5V14H5V5H14ZM14 4H5C4.73478 4 4.48043 4.10536 4.29289 4.29289C4.10536 4.48043 4 4.73478 4 5V14C4 14.2652 4.10536 14.5196 4.29289 14.7071C4.48043 14.8946 4.73478 15 5 15H14C14.2652 15 14.5196 14.8946 14.7071 14.7071C14.8946 14.5196 15 14.2652 15 14V5C15 4.73478 14.8946 4.48043 14.7071 4.29289C14.5196 4.10536 14.2652 4 14 4Z" fill="#161616"/>
                            <path d="M2 9H1V2C1 1.73478 1.10536 1.48043 1.29289 1.29289C1.48043 1.10536 1.73478 1 2 1H9V2H2V9Z" fill="#161616"/>
                        </svg>
                    </button>
                    
                </div>

                <a target="_blank" :href="tweetIntentUrl" 
                class="flex mx-auto mt-4 w-full sm:max-w-sm items-center justify-center
                rounded-md py-5 text-md outline-offset-2 transition
                active:transition-none bg-[#34AA4E] tracking-tight text-white">
                    Post on X
                </a>

                <p class="mt-2 sm:mt-10 text-sm text-zinc-500 leading-6">
                    Payments received will be automatically sent to your Code App, minus a $0.01 transaction fee.  
                </p>
            </div>
        </div>

    </template>
  </GenericLayout>
</template>