<template>
  <div class="page-container">
    <list v-show="state === 'list'" />

    <NewTemplate v-if="state === 'new'" />

    <Template v-if="state === 'template'" />
  </div>
</template>

<script>
  export default {
    computed: {
      state () {
        switch (this.$route.params['id']) {
          case 'list': return 'list'
          case 'new': return 'new'
          default: return 'template'
        }
      }
    },

    components: {
      list: () => import('./components/list.vue'),
      Template: () => import('./components/template.vue'),
      NewTemplate: () => import('./components/new-template.vue')
    },

    mounted () {
      if (this.$store.state.user.subscriptionType === 'Free Plan' || this.$store.state.user.subscriptionType === 'Pro Plan') {
        this.$router.push('/')
      }
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
