<script setup lang="ts">
import { useResponseState } from '../composables/response-state';

const responseState = useResponseState()

function handleCloseMessage() {
  responseState.value = {
    ...responseState.value,
    successfully: false,
  }
}
</script>

<template>
  <div>
    <UModal class="relative" v-model="responseState.successfully" prevent-close>
      <div class="flex flex-col py-8 px-5">
        <div class=" flex">
          <UIcon class="min-w-10 w-10 h-10 text-green-500" name="i-mynaui-check-waves" />
          <div class="ml-4">
            <h3 class="text-4xl font-black">Solicitação enviada</h3>
            <p class="mt-2">
              {{ responseState.message }}
            </p>
            <UButton @click="handleCloseMessage" class="mt-4 w-max">Obrigado</UButton>
          </div>
        </div>

      </div>
    </UModal>
  </div>
</template>
