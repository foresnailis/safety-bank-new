<template>
    <div class="login-register">
      <nut-cell-group>
        <nut-input v-model="username" label="用户名" placeholder="请输入用户名" />
        <nut-input v-model="password" label="密码" type="password" placeholder="请输入密码" />
      </nut-cell-group>
      <nut-button type="primary" @click="login">登录</nut-button>
      <nut-button type="info" @click="register">注册</nut-button>
       <!-- 显示登录结果 -->
       <nut-popup :style="{ padding: '30px 50px' }" v-model:visible="show">{{ loginResult }}</nut-popup>

    </div>
</template>
  
  <script setup>
  import { ref } from 'vue';
  
  const username = ref('');
  const password = ref('');
  const loginResult = ref(null);
  const show = ref(false);// 展示框是否显示
  
  const login = () => {
    console.log('登录操作', username.value, password.value);
    // 这里添加登录逻辑
    if (password.value === '123456') {
        // 密码正确
        loginResult.value = '登录成功';
        show.value=true;
    } else {
        // 密码错误
        loginResult.value = '登录失败';
        show.value=true;
    }
  };
  
  const register = () => {
    console.log('注册操作', username.value, password.value);
    // 这里添加注册逻辑
  };
  </script>
  
  <style>
  .login-register {
    padding: 20px;
  }
  </style>
  