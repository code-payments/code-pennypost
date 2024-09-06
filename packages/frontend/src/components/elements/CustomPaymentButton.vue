<script setup lang="ts">
import code from '@code-wallet/elements';
import { ref } from 'vue';
import { CurrencyCode, isValidCurrency } from '@code-wallet/library';
import { getTipIntentId } from '../../services/helpers/tip';

const props = defineProps<{
    item: string,
    destination: string,
    currency: string,
    amount: string,
}>();

const emit = defineEmits(['success', 'cancel', 'error']);
const el = ref<HTMLElement | null>(null);

if (!isValidCurrency(props.currency)) {
    throw new Error('Invalid payment currency provided');
}

const onClick = async () => {
    if (!el.value) {
        throw new Error('Failed to mount pay with code element');
    }

    const { clientSecret } = await getTipIntentId(props.item, props.amount);
    const { page } = code.elements.create('page', {
        clientSecret,
        destination: props.destination,
        currency: props.currency as CurrencyCode,
        amount: parseFloat(props.amount),
    });

    if (!page) {
        throw new Error('Failed to create button');
    }

    page.on('cancel', async () => {
        page.unmount();
        return emit('cancel');
    });
    page.on('error', async (event: any) => {
        page.unmount();
        return emit('error', event); 
    });
    page.on('success', async (event: any) => {
        page.unmount();
        const { intent } = event;
        return emit('success', intent);
    });

    // What follows is a bit of a hack, there are definitely more elegant ways
    // to do this. This is just a quick example.
    
    const div = document.createElement('div');
    el.value.appendChild(div);

    // Add a history entry so the back button works
    window.history.pushState(null, '', window.location.href);

    // Handle the back button event
    window.addEventListener('popstate', () => {
        page.unmount();
        div.remove();
    });
    
    // Mount the code-wallet payment page
    page.mount(div);
}

</script>

<template>
    <button @click="onClick()" class="inline-flex w-full justify-center
        rounded-md bg-[#34AA4E] no-underline py-4 text-sm font-semibold
        text-white shadow-sm focus-visible:outline
        focus-visible:outline-2 focus-visible:outline-offset-2
        focus-visible:outline-indigo-600 sm:col-start-2">
        <slot />
    </button>

    <Teleport to="body">
        <div ref="el"></div>
    </Teleport>
</template>
