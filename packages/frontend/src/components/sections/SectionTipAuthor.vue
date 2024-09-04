<script setup lang="ts">
import { ref } from 'vue';
import { RadioGroup, RadioGroupOption } from '@headlessui/vue';
import { ClientOnly } from '../ClientOnly';
import { useConfig } from '../../config';

import CustomPaymentButton from '../elements/CustomPaymentButton.vue';

const props = defineProps<{
    destination: string,
}>();

interface TipOption {
  id: number;
  label: string;
  value: number;
}

const tips: TipOption[] = [
  { id: 1, label: '$0.25', value: 0.25 },
  { id: 2, label: '$1', value: 1 },
  { id: 3, label: '$5', value: 5 },
];

const selectedTip = ref<TipOption>(tips[1]);
const config = useConfig();

const onSuccess = (intent: string) => {
  console.log('Payment successful', intent);
};

</script>


<template>
  <div class="w-full max-w-lg mx-auto">
    <div class="bg-white py-10 text-center ring-1 ring-inset ring-gray-900/5
      lg:flex lg:flex-col lg:justify-center lg:py-16">
      <div class="mx-auto max-w-sm">
        <p class="text-3xl max-w-xs mx-auto font-medium mb-5 mt-0 text-[#07204E]">
          Did you like this article?
        </p>

        <p class="text-lg font-light mb-10">
          If you found this article helpful, consider tipping the author.
        </p>


 <fieldset>
    <legend class="block text-sm font-semibold leading-6 text-gray-900">Select a tip amount</legend>

    <div class="flex flex-col items-center mb-10">
    <RadioGroup v-model="selectedTip" class="mt-6 flex items-center space-x-3">
      <RadioGroupOption 
        as="template" 
        v-for="tip in tips" 
        :key="tip.id" 
        :value="tip" 
        v-slot="{ checked }">
        <div 
          :class="[
            checked ? 'ring-2 ring-green-600' : '',
            'transition relative flex cursor-pointer items-center justify-center rounded-full p-2 focus:outline-none'
          ]"
        >
          <span 
            aria-hidden="true" 
            :class="[
              checked ? 'border-transparent' : '',
              'flex items-center justify-center h-16 w-16 rounded-full border border-gray-300 bg-white text-gray-900'
            ]"
          >
            {{ tip.label }}
          </span>
        </div>
      </RadioGroupOption>
    </RadioGroup>
    </div>
  </fieldset>

              <ClientOnly>
                <CustomPaymentButton 
                  :amount="selectedTip.value.toString()"
                  :destination="props.destination"
                  :currency="config.storeCurrency"
                  @success="onSuccess"
                >
                <slot />
                </CustomPaymentButton>
              </ClientOnly>

      </div>
    </div>
  </div>
</template>