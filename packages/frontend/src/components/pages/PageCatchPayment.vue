<script setup lang="ts">
    import { onMounted } from 'vue';
    import { useRouter } from 'vue-router';
    import { CheckIcon } from '@heroicons/vue/24/outline';
    import { login } from '../../state/account';

    const router = useRouter();
    const props = defineProps({
        slug: { type: String, required: true, },
        title: { type: String, required: true, },
        intent: { type: String, required: true, },
        offset: { type: Number, default: 0, },
    });

    onMounted(async () => {
        try {
            await login(props.intent, 'redirect');
        } catch (e) {
            console.warn(`Attempted login failed: ${e}`);
        }

        router.push({ name: 'post-with-offset', params: { 
            slug: props.slug, 
            title: props.title,
            offset: props.offset,
        } });
    });
</script>


<template>
    <div class="bg-zinc-800">
        <div class="max-w-2xl mx-auto">
            <div class="flex flex-col items-center justify-center h-screen">
                <div class="flex items-center justify-center">
                    <CheckIcon class="w-10 h-10 text-green-500 mr-2" />
                    <div class="text-lg font-bold tracking-tight text-white">
                        Payment Success
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>