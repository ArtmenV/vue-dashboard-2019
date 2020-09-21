<template>
  <div class="page-container">
    <group-list @state-change="changeState" v-show="$route.params['id'] === 'list'"/>

    <group-add @state-change="changeState" v-if="$route.params['id'] === 'new'" :id="id"/>

    <group-settings @state-change="changeState" v-if="$route.params['id'] !== 'list' && $route.params['id'] !== 'new'" :id="id"/>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        state: 'list',
        id: 'new'
      }
    },

    components: {
      groupList: () => import('./components/group-list.vue'),
      groupAdd: () => import('./components/group-add.vue'),
      groupSettings: () => import('./components/group-settings.vue')
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
    },

    methods: {
      changeState (state, id) {
        this.state = state

        this.$router.push('/server-groups/' + id)

        this.id = id
      }
    }
  }
</script>

<style lang="scss" scoped>
  .page-container {
    padding: 20px;
  }
</style>

