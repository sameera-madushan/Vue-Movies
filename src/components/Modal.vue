<script setup>
import { ref, watch } from 'vue';
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  videoUrl: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['update:modelValue']);
const isOpen = ref(props.modelValue);

const closeModal = () => {
  emit('update:modelValue', false);
};

watch(() => props.modelValue, (newVal) => {
  isOpen.value = newVal;
});

const openInNewTab = () => {
  if (props.videoUrl) {
    window.open(props.videoUrl, '_blank');
  }
};
</script>

<template>
    <div v-if="isOpen" class="modal-overlay" @click="closeModal">
      <div class="modal" @click.stop>
        <div class="modal-header">

          <button @click="openInNewTab" class="new-tab-button">Open in a New Tab</button>
  
          <button @click="closeModal" class="close-button">
            <i class='bx bx-x animate'></i>
          </button>
        </div>

        <slot></slot>
      </div>
    </div>
  </template>
  
  <style scoped>
  .modal-overlay {
    z-index: 999; 
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .modal {
    background-color: #1a1a1a;
    padding: 20px;
    border-radius: 8px;
    max-width: 720px;
    width: 100%;
  }
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .new-tab-button,
  .close-button {
    padding: 10px 15px;
    background-color: #42d392;
    color: white;
    border: none;
    cursor: pointer;
    border-radius: 4px;
  }
  
  .new-tab-button:hover{
    background-color: #47c7a2;
  }

  .close-button:hover{
    background-color: #ac1726;
  }
  
  .close-button {
    margin-left: auto;
    background-color: #dc3545;
  }
  </style>
  
  