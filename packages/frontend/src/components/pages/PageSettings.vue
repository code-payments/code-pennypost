<script setup lang="ts">
import { Ref, onMounted, reactive, ref } from 'vue';
import { UserCircleIcon } from '@heroicons/vue/24/solid'
import { UserSession, useAccount } from '../../state/account';

import GenericLayout from '../layouts/GenericLayout.vue';
import SectionHeader from '../sections/SectionHeader.vue';
import DialogUpdateProfile from '../dialogs/DialogUpdateProfile.vue';

import { ArrowTopRightOnSquareIcon } from '@heroicons/vue/20/solid';
import { updateUser } from '../../services/helpers/user';

const account = ref<Ref<UserSession | undefined>>();
const isUpdateDialogOpen = ref(false);

const state = reactive({
    name: '',
    bio: '',
});

const setState = () => {
    if (!account.value || !account.value.value) {
        return;
    }

    state.name = account.value.value?.name || '';
    state.bio = account.value.value?.bio || '';
}

const onUpdate = async () => {
    if (!account.value || !account.value.value) {
        return;
    }

    await updateUser({
        name: state.name,
        bio: state.bio,
    });

    isUpdateDialogOpen.value = false;
    account.value.value.name = state.name;
    account.value.value.bio = state.bio;
}

const onCancel = () => {
    isUpdateDialogOpen.value = false;
    setState();
}

onMounted(async () => {
    account.value = await useAccount();
    setState();
});
</script>

<template>
    <GenericLayout>
        <template #header>
            <SectionHeader />
        </template>

        <template #main>

            <header class="max-w-2xl">
                <h1
                    class="text-lg sm:text-xl md:text-2xl mt-10 lg:mt-0 font-bold tracking-tight text-zinc-800 dark:text-zinc-100">
                    Account Settings</h1>
                <p class="mt-1 text-sm leading-6 text-gray-600">This information will be displayed publicly so be
                    careful what you share.</p>
            </header>

            <form v-if="account && account.value">
                <div class="space-y-12">
                    <div class="border-b border-gray-900/10 pb-12">
                        <h2 class="hidden text-base font-semibold leading-7 text-gray-900">Profile</h2>
                        <p class="hidden mt-1 text-sm leading-6 text-gray-600">This information will be displayed publicly
                            so be
                            careful what you share.</p>

                        <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div class="sm:col-span-4">
                                <label for="displayname" class="block text-sm font-medium leading-6 text-gray-900">Display
                                    Name</label>
                                <div class="mt-2">
                                    <div class="flex rounded-md shadow-sm ring-1
                                    ring-inset ring-gray-300 focus-within:ring-2
                                    focus-within:ring-inset
                                    focus-within:ring-indigo-600 sm:max-w-md">
                                        <input v-model="state.name" type="text" name="displayname" id="displayname"
                                            class="block flex-1 border-0
                                            bg-transparent py-1.5 px-2
                                            text-gray-900
                                            placeholder:text-gray-400
                                            focus:ring-0 sm:text-sm
                                            sm:leading-6" />
                                    </div>
                                </div>
                            </div>

                            <div class="col-span-full">
                                <label for="about" class="block text-sm font-medium leading-6 text-gray-900">Bio</label>
                                <div class="mt-2">
                                    <textarea v-model="state.bio" id="about" name="about" rows="3" class="block w-full rounded-md border-0
                                        py-1.5 text-gray-900 shadow-sm ring-1
                                        ring-inset ring-gray-300
                                        placeholder:text-gray-400 focus:ring-2
                                        focus:ring-inset focus:ring-indigo-600
                                        sm:text-sm sm:leading-6" />
                                </div>
                                <p class="mt-3 text-sm leading-6 text-gray-600">Write a few sentences about yourself.</p>
                            </div>

                            <div class="col-span-full" v-if="false">
                                <label for="photo" class="block text-sm font-medium leading-6 text-gray-900">Photo</label>
                                <div class="mt-2 flex items-center gap-x-3">
                                    <UserCircleIcon class="h-12 w-12 text-gray-300" aria-hidden="true" />
                                    <button type="button"
                                        class="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">Change</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="border-b border-gray-900/10 pb-12">
                        <h2 class="text-base font-semibold leading-7 text-gray-900">Payment Address</h2>
                        <p class="mt-1 text-sm leading-6 text-gray-600">
                            {{ account.value.codeAddress }}

                            <a :href="`https://explorer.solana.com/address/${account.value.codeAddress}`" target="_blank"
                                class="ml-2 inline-block text-black">
                                <ArrowTopRightOnSquareIcon class="h-5 w-5 inline-block" />
                            </a>
                        </p>
                    </div>

                    <div class="border-b border-gray-900/10 pb-12" v-if="false">
                        <h2 class="text-base font-semibold leading-7 text-gray-900">Notifications</h2>
                        <p class="mt-1 text-sm leading-6 text-gray-600">We'll always let you know about important changes,
                            but you pick what else you want to hear about.</p>

                        <div class="mt-10 space-y-10">

                            <fieldset>
                                <legend class="text-sm font-semibold leading-6 text-gray-900">Push Notifications</legend>
                                <p class="mt-1 text-sm leading-6 text-gray-600">These are delivered via Code App to your
                                    mobile
                                    phone.</p>
                                <div class="mt-6 space-y-6">
                                    <div class="flex items-center gap-x-3">
                                        <input id="push-everything" name="push-notifications" type="radio"
                                            class="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600" />
                                        <label for="push-everything"
                                            class="block text-sm font-medium leading-6 text-gray-900">Everything</label>
                                    </div>
                                    <div class="flex items-center gap-x-3">
                                        <input id="push-nothing" name="push-notifications" type="radio"
                                            class="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600" />
                                        <label for="push-nothing"
                                            class="block text-sm font-medium leading-6 text-gray-900">No push
                                            notifications</label>
                                    </div>
                                </div>
                            </fieldset>
                        </div>
                    </div>
                </div>

                <div class="mt-6 flex items-center justify-end gap-x-6">
                    <button type="button" @click="onCancel" class="text-sm font-semibold leading-6 text-gray-900">Cancel</button>
                    <button @click="isUpdateDialogOpen = true"
                    type="button" class="inline-flex justify-center rounded-lg
                    text-sm font-semibold py-1.5 px-6 bg-slate-900 text-white
                    hover:bg-slate-700">Save</button>
                </div>
            </form>
        </template>
    </GenericLayout>


    <DialogUpdateProfile v-if="isUpdateDialogOpen" @no="isUpdateDialogOpen = false" @yes="onUpdate" />

</template>