<template>
  <div class="page-container">
    <list v-show="state === 'list'" />

    <info v-if="state === 'info'" />

    <new-ticket v-if="state === 'new'" />
  </div>
</template>

<script>
  export default {
    computed: {
      state () {
        switch (this.$route.params['id']) {
          case 'list': return 'list'
          case 'new': return 'new'
          default: return 'info'
        }
      }
    },

    components: {
      list: () => import('./components/list.vue'),
      info: () => import('./components/info.vue'),
      newTicket: () => import('./components/new-ticket.vue')
    },

    mounted () {
      if ((isNaN(this.$route.params['id'])
          || this.$route.params['id'].indexOf('.') !== -1)
          && this.$route.params['id'] !== 'list'
          && this.$route.params['id'] !== 'new') {
        this.$router.push('/404')
      }
    }
  }
</script>

<style lang="scss" scoped>
  .page-container {
    padding: 20px;
  }
</style>
