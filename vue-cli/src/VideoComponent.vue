<template>
     <div>H5调前置摄像头DEMO</div>
        <video ref="videoRef" width="480" height="320" muted controls  autoplay="autoplay">
        </video>
    <div>
    <button @click="captureImage">拍照</button>
        </div>
    <canvas ref="canvasRef" width="480" height="320"></canvas>
</template>
<script setup lang="js">
import { ref, onMounted } from 'vue';

const videoRef = ref(null);
const canvasRef = ref(null);


onMounted(() => {
  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: false },
      video: { facingMode: "user" } // 调用前置摄像头
    })
    .then(stream => {
      if (videoRef.value) {
        videoRef.value.srcObject = stream;
        videoRef.value.play();
      }
    })
    .catch(error => {
      console.error(`访问用户媒体设备失败: ${error.name}, ${error.message}`);
    });
  } else if(navigator.webkitGetUserMedia){
    navigator.webkitGetUserMedia({
      audio: { echoCancellation: false },
      video: { facingMode: "user" } // 调用前置摄像头
    })
    .then(stream => {
      if (videoRef.value) {
        videoRef.value.srcObject = stream;
        videoRef.value.play();
      }
    })
    .catch(error => {
      console.error(`访问用户媒体设备失败: ${error.name}, ${error.message}`);
    });
  }else if(navigator.mozGetUserMedia){
    navigator.mozGetUserMedia({
      audio: { echoCancellation: false },
      video: { facingMode: "user" } // 调用前置摄像头
    })
    .then(stream => {
      if (videoRef.value) {
        videoRef.value.srcObject = stream;
        videoRef.value.play();
      }
    })
    .catch(error => {
      console.error(`访问用户媒体设备失败: ${error.name}, ${error.message}`);
    });
  }else if(navigator.getUserMedia){
    navigator.getUserMedia({
      audio: { echoCancellation: false },
      video: { facingMode: "user" } // 调用前置摄像头
    })
    .then(stream => {
      if (videoRef.value) {
        videoRef.value.srcObject = stream;
        videoRef.value.play();
      }
    })
    .catch(error => {
      console.error(`访问用户媒体设备失败: ${error.name}, ${error.message}`);
    });
  }
  else {
    alert('不支持访问用户媒体');
  }
});

const captureImage = () => {
  const video = videoRef.value;
  const canvas = canvasRef.value;
  if (canvas && video) {
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
  }
};

</script>
  