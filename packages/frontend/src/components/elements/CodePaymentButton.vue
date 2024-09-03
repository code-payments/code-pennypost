<script setup lang="ts">
import code from '@code-wallet/elements';
import { onMounted, ref } from 'vue';
import { CurrencyCode, isValidCurrency } from '@code-wallet/library';

const props = defineProps<{
    createIntent: (val: string) => Promise<{ clientSecret: string }>,
    item: string,
    destination: string,
    currency: string,
    amount: string,
    successUrl: string,
}>();

const emit = defineEmits(['success', 'cancel', 'error']);

if (!isValidCurrency(props.currency)) {
    throw new Error('Invalid payment currency provided');
}

const el = ref<HTMLElement | null>(null);

const { button } = code.elements.create('button', {
    destination: props.destination,
    currency: props.currency as CurrencyCode,
    amount: parseFloat(props.amount),
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
    const { clientSecret } = await props.createIntent(props.item);

    // A bit of a hack to get the current scroll position into the success URL.
    // Ideally, we'd emit an 'invoke' event to get options from the parent
    // component.

    const offset = `/${window.scrollY}`;

    button.update({
        clientSecret,
        confirmParams: {
            success: {
                url: props.successUrl + offset,
            }
        }
    });
});

onMounted(() => {
    if (!el.value) {
        throw new Error('Failed to mount pay with code element');
    }

    button.mount(el.value);
});
</script>

<template>
    <div ref="el" style="height: 60px"></div>
</template>