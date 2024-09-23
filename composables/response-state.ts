import { useState } from "nuxt/app";

export const useResponseState = () => useState<{ error: boolean,
  successfully: boolean,
  title?: string,
  message: string }>('response-state', () => {
  return {
    error: false,
    successfully: false,
    title: '',
    message: ''
  }
})
