<template>
  <TransitionRoot as="template" :show="modelValue">
    <Dialog as="div" class="relative z-10" @close="() => loading ? {} : $emit('update:modelValue', false)">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-white bg-opacity-25 backdrop-blur-sm transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel
              class="relative transform overflow-hidden rounded-2xl bg-white p-8 text-left shadow-2xl transition-all sm:my-8 sm:max-w-sm lg:max-w-7xl !w-full"
            >
              <div v-if="loading" class="absolute inset-0 w-full h-full bg-white bg-opacity-75 flex justify-center items-center cursor-default z-10">
                <Spinner class="!text-violet-700 !w-12 !h-12"/>
              </div>
              <div class="border-b-2 mb-6 pb-6 flex justify-between items-center gap-3">
                <div class="inline-flex items-center justify-start gap-3">
                  <div
                    v-if="iconContainerClass"
                    class="inline-flex h-16 w-16 items-center justify-center rounded-full"
                    :class="iconContainerClass"
                  >
                    <XMarkIcon v-if="color === 'error'" class="h-8 w-8 text-red-600" aria-hidden="true" />
                    <XMarkIcon v-else-if="color === 'warning'" class="h-8 w-8 text-orange-600" aria-hidden="true" />
                    <XMarkIcon v-else-if="color === 'success'" class="h-8 w-8 text-green-600" aria-hidden="true" />
                    <XMarkIcon v-else-if="color === 'info'" class="h-8 w-8 text-blue-600" aria-hidden="true" />
                    <slot name="icon"></slot>
                  </div>
                  <DialogTitle as="h2" class="font-semibold leading-6 text-2xl lg:text-3xl text-gray-900">
                    {{ title }}
                  </DialogTitle>
                </div>

                <slot name="header"></slot>
              </div>

              <div>
                <slot></slot>
              </div>

              <div class="mt-2 sm:mt-3">
                <slot name="footer"></slot>
                <Button
                  v-if="goBack"
                  :disabled="loading"
                  type="button"
                  class="inline-flex w-full justify-end bg-red-700 text-white font-semibold"
                  @click="() => loading ? {} : $emit('update:modelValue', false)"
                >
                  {{ goBack }}
                </Button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script lang="ts">
import { PropType, computed, defineComponent } from 'vue';
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue';
import { CheckIcon, ExclamationTriangleIcon, XMarkIcon } from '@heroicons/vue/24/outline';
import Button from '../Button.vue';
import Spinner from '../Spinner.vue';

export default defineComponent({
  components: {
    Dialog,
    TransitionRoot,
    TransitionChild,
    DialogPanel,
    DialogTitle,
    CheckIcon,
    XMarkIcon,
    ExclamationTriangleIcon,
    Button,
    Spinner
},
  emits: ['update:modelValue'],
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    color: {
      type: String as PropType<'warning' | 'error' | 'success' | 'info' | string | null>,
      default: null,
    },
    goBack: {
      type: String,
      default: null,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const iconContainerClassMap = {
      warning: 'bg-orange-100',
      error: 'bg-red-100',
      success: 'bg-green-100',
      info: 'bg-blue-100',
    };

    const iconContainerClass = computed(() =>
      props.color ? iconContainerClassMap[props.color as keyof typeof iconContainerClassMap] ?? props.color : null
    );

    return {
      iconContainerClass,
    };
  },
});
</script>
