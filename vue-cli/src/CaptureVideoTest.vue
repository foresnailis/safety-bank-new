<template>
    <div>
      <input 
        class="phone_input" 
        type="file" 
        accept="image/*" 
        capture="user"
        @change="handleVideoCapture"
      />
    </div>
  </template>
  
  <script>
  export default {
    methods: {
      handleVideoCapture(event) {
        const file = event.target.files[0];
        if (file) {
          // 这里可以添加处理视频文件的逻辑
          console.log('捕获到的视频文件:', file);
        }
      }
    }
  };
  </script>
  
  <style>

  </style>
  