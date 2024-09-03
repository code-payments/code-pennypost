<script setup lang="ts">
import { onMounted, Ref, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { useAccount, UserSession, logout } from '../../state/account';
import LogoSmall from '../elements/LogoSmall.vue';

const router = useRouter();
const emit = defineEmits(['close']);

const account = ref<Ref<UserSession | undefined>>();
const open = ref(true);

function onClose() {
  open.value = false;
  emit('close');
}

function signOut() {
  logout();
  router.push({ name: 'home' });
}

onMounted(async () => {
  account.value = await useAccount();
});

</script>

<template>

  <TransitionRoot as="template" :show="open" v-if="account && account.value">
    <Dialog as="div" class="relative z-50" @close="onClose()">
      <div class="fixed inset-0 bg-slate-900/25 backdrop-blur-sm transition-opacity opacity-100" />

      <div class="fixed inset-0 overflow-hidden">
        <div class="absolute inset-0 overflow-hidden">
          <div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <TransitionChild as="template" enter="transform transition ease-in-out duration-500 sm:duration-700"
              enter-from="translate-x-full" enter-to="translate-x-0"
              leave="transform transition ease-in-out duration-500 sm:duration-700" leave-from="translate-x-0"
              leave-to="translate-x-full">
              <DialogPanel class="pointer-events-auto w-screen max-w-md">
                <div class="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">

                  <div class="relative mt-6 flex-1 px-4 sm:px-6">


                    <div class="mt-6 flow-root">
                      <div class="-my-6 divide-y divide-gray-500/10">
                        <div class="px-8 pb-6">
                          <div class="flex items-center justify-between">
                            <router-link to="/">
                              <LogoSmall class="h-7" />
                            </router-link>
                            <button type="button" class="-m-2.5 rounded-md p-2.5 text-gray-700" @click="onClose()">
                              <span class="sr-only">Close menu</span>
                              <XMarkIcon class="h-6 w-6" aria-hidden="true" />
                            </button>
                          </div>

                        </div>
                        <div class="px-8 py-6">
                          <div class="-my-2 items-start space-y-2">
                            <router-link to="/write" class="block w-full py-2 font-semibold">
                              Write
                            </router-link>

                            <a class="block w-full py-2" href="/purchases" v-if="false">View
                              Purchases</a>
                          </div>
                        </div>
                        <div class="px-8 py-6">
                          <p class="flex flex-col">
                            <span class="text-sm text-slate-500">Signed in as</span>
                            <span class="mt-0.5 truncate">{{ account.value.name ? account.value.name : 'Anonymous User' }}</span>
                          </p>
                        </div>
                        <div class="px-8 py-6">
                          <div class="-my-2 space-y-2">
                            <a class="block w-full py-2" href="/account-settings">Account
                              Settings</a>
                            <button class="block w-full py-2 text-left" type="button" @click="signOut()">Sign
                              out</button>
                          </div>
                        </div>
                      </div>

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