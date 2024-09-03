<script setup lang="ts">
import { onMounted, Ref, ref } from 'vue';
import { Bars3Icon } from '@heroicons/vue/24/outline'
import { useAccount, UserSession, isLoggedIn } from '../../state/account';
import { useConfig } from '../../config';
import { ClientOnly } from '../ClientOnly';

import Logo from '../elements/Logo.vue';
import SectionMenu from './SectionMenu.vue';

const mobileMenuOpen = ref(false)

const config = useConfig();
const account = ref<Ref<UserSession | undefined>>();
const betaFlag = ref<boolean>(config.betaFlag);

onMounted(async () => {
  account.value = await useAccount();
});

</script>

<template>
  <header class="relative z-50 flex flex-none flex-col mt-8">
    <div class="top-0 z-10 h-24 pt-6">
      <div class="sm:px-8 w-full ">
        <div class="mx-auto w-full max-w-7xl lg:px-8">
          <div class="relative px-4 sm:px-8 lg:px-12 border-b border-zinc-100 pb-4">
            <div class="mx-auto max-w-2xl lg:max-w-5xl">
              <div class="relative flex gap-4">
                <div class="flex flex-1">
                  <router-link to="/">
                    <Logo class="h-7 pl-2 md:pl-0" />
                  </router-link>
                </div>

                <div class="hidden sm:flex flex-1 justify-end md:justify-center">
                </div>

                <ClientOnly>
                  <div class="flex justify-end md:flex-1 pointer-events-auto">
                    <slot>
                      <router-link v-if="isLoggedIn()" to="/write" 
                      class="sm:inline-flex justify-center rounded-full py-1
                      px-3 sm:px-4 text-sm sm:text-md text-white font-semibold
                      bg-[#34AA4E] whitespace-nowrap">New Post</router-link>
                    </slot>

                    <div v-if="betaFlag && isLoggedIn()"
                      class="ml-4 pl-4 sm:ml-6 sm:pl-6 flex items-center border-l border-slate-900/15">
                      <div class="relative" data-headlessui-state="">
                        <button type="button"
                          class="lg:hidden inline-flex items-center justify-center rounded-md text-gray-700"
                          @click="mobileMenuOpen = true">
                          <span class="sr-only">Open main menu</span>
                          <Bars3Icon class="h-6 w-6" aria-hidden="true" />
                        </button>

                        <button @click="mobileMenuOpen = true"
                          class="hidden lg:flex items-center font-semibold hover:text-gray-900"
                          id="headlessui-menu-button-1" type="button" aria-haspopup="menu" aria-expanded="false"
                          data-headlessui-state="">
                          <span class="hidden items-center sm:flex">Account<svg aria-hidden="true" fill="none"
                              xmlns="http://www.w3.org/2000/svg" class="ml-3 h-3 w-3 stroke-slate-400">
                              <path d="M9.75 4.125 6 7.875l-3.75-3.75" stroke-width="1.5" stroke-linecap="round"
                                stroke-linejoin="round"></path>
                            </svg>
                          </span>
                        </button>
                      </div>
                    </div>

                  </div>
                </ClientOnly>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>


  <SectionMenu v-if="mobileMenuOpen" @close="mobileMenuOpen = false" />

</template>