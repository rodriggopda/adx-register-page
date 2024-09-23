<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types';
import Error from '@/components/error.vue';
import Successfully from '@/components/successfully.vue';
import { useResponseState } from '@/composables/response-state';
import { z } from 'zod';
import { api } from '~/lib/fetcher';

const router = useRouter()
const responseState = useResponseState()

function requiredInputMessage(inputName: string) {
  return `O {{field}} é obrigatório`.replace('{{field}}', inputName)
}

function invalidInputMessage(inputName: string) {
  return `O {{field}} é inválido`.replace('{{field}}', inputName)
}

const registerSchema = z.object({
  name: z.string({ message: requiredInputMessage('Nome') }),
  phone: z.string({ message: requiredInputMessage('Telefone') }),
  email: z.string({ message: requiredInputMessage('Email') }).email({ message: invalidInputMessage('Email') }),
  document: z.string({ message: requiredInputMessage('CPF') }).min(11, { message: invalidInputMessage('CPF') }),
  invoiceNumber: z.string({ message: requiredInputMessage('Nº da Nota Fiscal') }),
  serialNumber: z.string({ message: requiredInputMessage('Nº do Chassi') }),
})

type FormRegisterSchema = z.output<typeof registerSchema>;
type InputImagesSchema = { fileName: string, base64?: string | ArrayBuffer | null }

const formState = reactive({
  name: undefined,
  email: undefined,
  phone: undefined,
  document: undefined,
  invoiceNumber: undefined,
  serialNumber: undefined,
})

const maxImages = 2
const images = reactive<InputImagesSchema[]>([])

async function handleInputImage(files: File[]) {
  if (images.length == maxImages) return;
  const [file] = files
  if (images.find((img) => img.fileName == file.name)) {
    responseState.value = {
      error: true,
      title: 'Imagem já selecionada',
      message: 'Por favor envie as imagens conforme as instruções',
      successfully: false
    }
    return
  }
  const source: InputImagesSchema = {
    fileName: file.name,
  }
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = async () => {
    const base64 = await Promise.resolve(reader.result).then((res) => res)
    source.base64 = base64
  }

  images.push(source)
  return
}

async function handleSubmitRegister(e: FormSubmitEvent<FormRegisterSchema>) {
  if (images.length < 2) {
    responseState.value = {
      error: true,
      title: 'Imagens não selecionadas',
      message: 'Você precisa enviar no mínimo duas fotos do seu produto conforme as instruções para serem validadas',
      successfully: false
    }
    return
  }
  const uri = `http://localhost:3000/registers`
  const payload = {
    ...formState,
    images
  }
  api
    .post(uri, payload)
    .then((data) => {
      responseState.value = {
        error: false,
        message: data.message,
        successfully: true
      }
      router.push('?successfully=true')
    })
    .catch((err) => {
      responseState.value = {
        error: true,
        message: err.message,
        successfully: false
      }
      router.push('?error=true')
    })
}
</script>

<template>
  <div>
    <Error />
    <Successfully />
    <div class="xl:grid xl:grid-cols-2 min-h-screen">
      <div class="p-4 xl:p-10 bg-zinc-900">
        <p class="text-white">Instruções das imagens a serem enviadas*</p>
      </div>
      <div class="p-4 xl:p-20">
        <div class="space-y-4 max-w-xl">
          <h1 class="text-3xl xl:text-6xl font-black ">Seja bem-vindo a página de registro de produto</h1>
          <p class="xl:text-2xl">
            Solicitaremos alguns dados que irão garantir o registro do seu
            produto, e parabéns por adquirir um produto da nossa marca.
          </p>
        </div>
        <div class="mt-6 space-y-4 max-w-xl">
          <h1 class="text-2xl xl:text-4xl font-black text-neutral-900">Formulário de registro</h1>
          <UForm method="post" class="space-y-4" :schema="registerSchema" :state="formState"
            @submit="handleSubmitRegister">
            <UFormGroup label="Nome completo" name="name">
              <UInput v-model="formState.name" placeholder="Jane doe" />
            </UFormGroup>
            <UFormGroup label="Email" name="email">
              <UInput v-model="formState.email" placeholder="somebody@mail.com" />
            </UFormGroup>
            <UFormGroup label="Telefone" name="phone">
              <UInput v-model="formState.phone" placeholder="(00) 90000-0000" />
            </UFormGroup>
            <UFormGroup label="CPF" name="document">
              <UInput v-model="formState.document" placeholder="000.000.000-00" />
            </UFormGroup>
            <UFormGroup label="Nº Nota Fiscal" name="invoiceNumber">
              <UInput v-model="formState.invoiceNumber" placeholder="000.000.000" />
            </UFormGroup>
            <UFormGroup label="Nº Série ou Chassi" name="serialNumber">
              <UInput v-model="formState.serialNumber" placeholder="AA000-000" />
            </UFormGroup>
            <div class="space-y-2">
              <UFormGroup :label="`Fotos do produto (${images.length}/${maxImages}) `" name="images">
                <UInput :disabled="images.length == maxImages" @change="handleInputImage" type="file"
                  icon="i-heroicons-folder" />
              </UFormGroup>
              <div v-if="images.length" class="space-y-2">
                <div v-for="img in images"
                  class="flex items-center justify-between border border-zinc-200 p-2 rounded-md">
                  <div v-if="img.base64" class="flex items-center gap-3">
                    <img class="object-scale-down w-16 h-16" :src="img.base64.toString()" width="64" height="64">
                    <p>{{ img.fileName }}</p>
                  </div>
                  <UButton @click="images.splice(images.indexOf(img), 1)" size="xs" color="black" square variant="solid"
                    icon="i-heroicons-trash" />
                </div>
              </div>
            </div>
            <p class="text-sm text-zinc-500">* Ao enviar seu email e telefone,
              você aceita receber comunicações por esses canais</p>
            <UButton class="w-max" type="submit">Registrar Produto</UButton>
          </UForm>
        </div>
      </div>
    </div>
  </div>
</template>
