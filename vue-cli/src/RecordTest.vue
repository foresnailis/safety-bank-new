<template>
    <div>
      <button @click="startRecording" :disabled="isRecording">开始录音</button>
      <button @click="stopRecording" :disabled="!isRecording">停止录音</button>
      <audio v-if="audioUrl" :src="audioUrl" controls></audio>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const isRecording = ref(false);
  const audioChunks = ref([]);
  const audioUrl = ref(null);
  let mediaRecorder = null;
  
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(stream);
      isRecording.value = true;
  
      mediaRecorder.ondataavailable = event => {
        audioChunks.value.push(event.data);
      };
  
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks.value);
        audioUrl.value = URL.createObjectURL(audioBlob);
        audioChunks.value = [];
        isRecording.value = false;
      };
  
      mediaRecorder.start();
    } catch (error) {
      console.error('Error accessing the microphone:', error);
      isRecording.value = false;
    }
  };
  
  const stopRecording = () => {
    if (isRecording.value && mediaRecorder) {
      mediaRecorder.stop();
    }
  };
  </script>
  