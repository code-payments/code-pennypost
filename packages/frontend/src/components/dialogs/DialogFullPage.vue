<script setup lang="ts">
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'

const model = defineModel({ default: false, type: Boolean, required: true });
const props = defineProps({
  title: { type: String, required: true },
});

const close = () => {
  model.value = false;
}
</script>

<template>
  <TransitionRoot as="template" :show="model">
    <Dialog class="relative z-50" @close="close">
      <TransitionChild as="template" enter="ease-in-out duration-500" enter-from="opacity-0" enter-to="opacity-100"
        leave="ease-in-out duration-500" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-hidden">
        <div class="absolute inset-0 overflow-hidden">
          <div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full ">
            <TransitionChild 
              as="template" enter="transform transition ease-in-out duration-500 sm:duration-700"
              enter-from="translate-x-full" enter-to="translate-x-0"
              leave="transform transition ease-in-out duration-500 sm:duration-700" leave-from="translate-x-0"
              leave-to="translate-x-full">
              <DialogPanel class="pointer-events-auto w-screen max-w-full">
                <div class="flex h-full flex-col bg-white py-6 shadow-xl">
                  <div class="px-4 sm:px-6 border-b border-stone-100 pb-5">
                    <div class="flex items-start justify-between">
                      <DialogTitle class="text-lg text-stone-400">
                        {{ props.title }}
                      </DialogTitle>
                      <div class="ml-3 flex h-7 items-center">
                        <button @click="close" class="sm:inline-flex
                        justify-center rounded-full py-1 px-3 sm:px-4 text-sm
                        sm:text-md text-white font-semibold bg-[#34AA4E]
                        whitespace-nowrap">
                          Done
                        </button>
                      </div>
                    </div>
                  </div>

                  <div class="overflow-y-auto">
                    <div class="relative mt-6 flex-1 px-4 sm:px-6">
                      <slot />
                    </div>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>