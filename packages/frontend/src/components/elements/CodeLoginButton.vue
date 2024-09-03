<script setup lang="ts">
import code from '@code-wallet/elements';
import { useConfig } from '../../config';
import { onMounted, ref } from 'vue';

const props = defineProps<{
    createIntent: (val: string) => Promise<{ clientSecret: string }>,
    successUrl: string,
}>();

const emit = defineEmits(['success', 'cancel', 'error']);

const config = useConfig();
const el = ref<HTMLElement | null>(null);
const nonce = Math.random().toString().substring(2);

const { button } = code.elements.create('button', {
    mode: 'login',
    login: {
        domain: config.hostname,
        verifier: config.storeVerifier,
    },
    confirmParams: {
        success: {
            url: props.successUrl,
        }, 
    }
});

if (!button) {
    throw new Error('Failed to create button');
}

button.on('cancel', async () => { return emit('cancel'); });
button.on('error', async (event: any) => { return emit('error', event); });
button.on('success', async (event: any) => {
    const { intent } = event;
    return emit('success', intent);
});

button.on('invoke', async () => {
    const { clientSecret } = await props.createIntent(nonce);
    button.update({ clientSecret });
});

onMounted(() => {
    if (!el.value) {
        throw new Error('Failed to mount login with code element');
    }
    
    button.mount(el.value);
});
</script>

<template>
    <div ref="el" style="height: 60px"></div>
</template>
