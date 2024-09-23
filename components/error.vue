<script setup lang="ts">
import { useResponseState } from '../composables/response-state';

const responseState = useResponseState()

function handleCloseMessage() {
  responseState.value = {
    ...responseState.value,
    error: false,
  }
}
</script>

<template>
  <div>
    <UModal class="relative" v-model="responseState.error" prevent-close>
      <div class="flex flex-col py-8 px-5">
        <div class=" flex">
          <UIcon class="min-w-10 w-10 h-10 text-red-500" name="i-mynaui-danger-triangle" />
          <div class="ml-4">
            <h3 class="text-4xl font-black">{{ responseState.title?.length ? responseState.title : "Não concluído" }}
            </h3>
            <p class="mt-2">{{ responseState.message }}</p>
            <div class="mt-4 flex items-center space-x-2">
              <UButton @click="handleCloseMessage">Tentar denovo</UButton>
            </div>
          </div>
        </div>
      </div>
    </UModal>
  </div>
</template>
