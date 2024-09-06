<script setup lang="ts">
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { ref } from 'vue';

const open = ref(true);
const publishing = ref(false);

const emit = defineEmits(['close', 'publish']);

const close = () => {
  open.value = false;
  emit('close');
}

const publish = () => {
  publishing.value = true;
  emit('publish');
}

</script>

<template>
  <TransitionRoot as="template" :show="open">
    <Dialog as="div" class="relative z-50" @close="close()">
      <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100"
        leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-black/70 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <TransitionChild as="template" enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
            <DialogPanel
              class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-md sm:p-6">

              <div>
                <div class="mt-3 text-center">
                  <DialogTitle as="h3" class="mx-auto max-w-xs text-xl font-semibold tracking-tight text-[#07204E]">
                    Publish this article for free?
                  </DialogTitle>

                  <p class="mt-3 text-sm text-gray-500">
                    To add a paywall add the <code class="
                    mx-0.5 text-[#34AA4E] bg-gray-100 p-1 font-mono
                    font-semibold border border-gray-200
                    rounded-md">[paywall]</code> tag anywhere in your article
                    where you want the paywall to appear.  Otherwise, your
                    article will appear free, but people will still be able to
                    tip you.
                  </p>
                </div>
              </div>

              <div class="mt-5 sm:mt-10">
                <div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">

                  <button type="button" class="inline-flex w-full justify-center
                  rounded-md bg-[#34AA4E] px-3 py-2 text-sm font-semibold
                  text-white shadow-sm focus-visible:outline
                  focus-visible:outline-2 focus-visible:outline-offset-2
                  focus-visible:outline-indigo-600" @click="publish()">

                    <svg v-if="publishing" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                      </path>
                    </svg>

                    <span v-if="!publishing">Publish</span>
                    <span v-else>Publishing...</span>
                  </button>

                  <button type="button" class="mt-3 inline-flex w-full
                  justify-center rounded-md bg-white px-3 py-2 text-sm
                  font-medium text-gray-800 ring-1 ring-inset
                  ring-gray-200 hover:bg-gray-50 sm:mt-0" @click="close()">
                    Nevermind</button>

                </div>
              </div>

            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
