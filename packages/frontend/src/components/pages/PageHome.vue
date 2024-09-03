<script setup lang="ts">
import SectionHeader from '../sections/SectionHeader.vue';
import GenericLayout from '../layouts/GenericLayout.vue';
import CodeLoginButton from '../elements/CodeLoginButton.vue';

import { ClientOnly } from '../ClientOnly';
import { useConfig } from '../../config';
import { createLoginIntent } from '../../services/helpers/login';
import { isLoggedIn } from '../../state/account';

const config = useConfig();
</script>

<template>
  <GenericLayout>
    <template #header>
        <SectionHeader />
    </template>

    <template #main>

        <div class="max-w-2xl">
            <div class="text-center max-w-xs mx-auto sm:max-w-full">
                <h1 class="text-5xl font-bold tracking-tight text-[#07204E] mt-9">
                    Monetize your content instantly.
                </h1>
                <p class="mt-10 text-base text-[#07204E]">
                    Effortlessly add a ${{ config.defaultPrice }} micropaywall to start earning from every post.
                </p>

                <div v-if="isLoggedIn()">
                    <router-link to="/write" 
                        class="inline-flex px-5 mt-10 justify-center
                        rounded-md bg-[#34AA4E] no-underline py-4 text-sm font-semibold
                        text-white shadow-sm focus-visible:outline
                        focus-visible:outline-2 focus-visible:outline-offset-2
                        focus-visible:outline-indigo-600 sm:col-start-2">
                            Write Your Own Pennypost</router-link>
                </div>
                <div v-else>
                    <ClientOnly>
                        <CodeLoginButton class="mt-10"
                            :create-intent="createLoginIntent"
                            success-url="/redirect/login/{{INTENT_ID}}" 
                        />
                    </ClientOnly>
                    <p class="mt-14 text-sm text-[#07204E]">
                        Don’t have the Code App yet? <a href="https://getcode.com/download" class="underline">Download It Now</a>
                    </p>
                </div>

            </div>
        </div>

    </template>
  </GenericLayout>
</template>