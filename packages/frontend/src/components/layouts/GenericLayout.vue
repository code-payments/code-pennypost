<script setup lang="ts">
import SectionFooter from '../sections/SectionFooter.vue';
</script>

<template>
  <div class="flex w-full min-h-screen">
    <div class="fixed inset-0 flex justify-center sm:px-8">
      <div class="flex w-full max-w-7xl lg:px-8">
        <div class="w-full bg-white ring-1 ring-zinc-100 dark:bg-zinc-900 dark:ring-zinc-300/20"></div>
      </div>
    </div>

    <div class="relative flex w-full flex-col">
      <slot name="header" />

      <main class="flex-grow">
        <div class="sm:px-8 mt-0 lg:mt-20">
          <div class="mx-auto w-full max-w-7xl lg:px-8">

            <div class="relative px-4 sm:px-8 lg:px-12">
              <div class="mx-auto max-w-2xl lg:max-w-5xl">
                <div class="xl:relative">
                  <div class="mx-auto max-w-2xl">

                    <article>
                      <slot name="main" />

                    </article>
                  </div>
                </div>
              </div>
            </div>

            <slot name="cta" />
          </div>
        </div>

      </main>

      <SectionFooter />
    </div>
  </div>
</template>