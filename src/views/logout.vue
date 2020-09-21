<template>
  <div class="page">
    Logout in progress...
  </div>
</template>

<script>
export default {
  mounted () {
    this.$store.dispatch('LogOut').then(() => {
      this.$router.push('/') // 为了重新实例化vue-router对象 避免bug
    })
  }
}
</script>

<style lang="scss" scoped>
.page {
  padding: 20px;
}
</style>
