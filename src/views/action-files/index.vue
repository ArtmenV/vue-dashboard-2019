<template>
  <div class="page-container">
    <action-list
      v-if="state === 'list'"
      @view-action="viewActionClick"
      @edit-action="editActionClick"
    />

    <action-file
      v-if="state === 'file'"
      :defaultState="actionFileState"
      :actionFileId="actionFileId"
      @back-to-list="show = 'list'"
    />
    
    <action-add
      v-if="state === 'add'"
    />
  </div>
</template>

<script>
  export default {
    data () {
      return {
        show: 'list',
        actionFileState: 'view',
        actionFileId: null
      }
    },

    components: {
      actionList: () => import('./components/action-list.vue'),
      actionFile: () => import('./components/action-file.vue'),
      actionAdd: () => import('./components/action-add.vue')
    },

    mounted () {
      if ((isNaN(this.$route.params['id'])
          || this.$route.params['id'].indexOf('.') !== -1)
          && this.$route.params['id'] !== 'list'
          && this.$route.params['id'] !== 'add') {
        this.$router.push('/404')
      }
    },

    computed: {
      state () {
        if (this.$route.params['id'] === 'list') {
          return 'list'
        } else if (this.$route.params['id'] === 'add') {
          return 'add'
        } else {
          return 'file'
        }
      }
    },

    methods: {
      viewActionClick (id) {
        this.actionFileState = 'view'
        this.actionFileId = id
        this.show = 'file'

        this.$router.push('/action-files/' + id)
      },

      editActionClick (id) {
        this.actionFileState = 'edit'
        this.actionFileId = id
        this.show = 'file'

        this.$router.push('/action-files/' + id)
      },
    }
  }
</script>

<style lang="scss" scoped>
  .page-container {
    padding: 20px;
  }
</style>
