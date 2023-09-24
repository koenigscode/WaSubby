<template>
    <div class="login">
        <input type="text" v-model="email" placeholder="Enter E-Mail" />
        <input type="password" v-model="password" placeholder="Enter password" />
        <button>Login</button>
    </div>
</template>

<script>
export default {
  name: 'Login'
}
</script>
