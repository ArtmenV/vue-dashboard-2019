<template>
  <div class="container" v-loading="loading">
    <h2 class="header">
      Create new server group
    </h2>

    <div class="form-container">
      <div class="title">
        Name:
      </div>

      <div class="input-v" :data-error-msg="nameError === nameErrorMsg ? nameErrorMsg : ''">
        <el-input size="mini" v-model="newGroup.name" />
      </div>

      <div class="title">
        Description:
      </div>

      <el-input size="mini" v-model="newGroup.description">
      </el-input>

      <el-button size="mini" class="cancel" @click="$router.push('/server-groups/list')">
        Cancel
      </el-button>

      <el-button type="primary" size="mini" class="submit" @click="submitHandler">
        Create
      </el-button>
    </div>
  </div>
</template>

<script>
  import SPPCloudApi from '@/api/cloud-api.js'
  import handleError from '@/utils/errorHandler.js'

  export default {
    data () {
      return {
        loading: false,
        newGroup: {
          name: '',
          description: ''
        },

        nameErrorMsg: '',        

        errMessage: null,
      }
    },

    beforeDestroy () {
      if (this.errMessage) {
        this.errMessage.close()
      }
    },

    computed: {
      nameError () {
        const name = this.newGroup.name

        if (name.length) {
          const regex = /^\s*$|[\+\$\?\/#@!=%]/

          if (regex.test(name)) {
            return `Name shouldn't contain +, $, ?, #, @, !, % or /`
          } else {
            return ''
          }
        } else {
          return `Name can't be blank`
        }
      }
    },

    methods: {
      submitHandler () {
        if (this.nameError === '') {
          this.loading = true
          SPPCloudApi
            .createServerGroup({
              name: this.newGroup.name,
              description: this.newGroup.description
            })
            .then(r => this.$router.push('/server-groups/' + r.data.result.server_group_id))
            .catch(e => {
              this.loading = false
              
              if (this.errMessage) {
                this.errMessage.close()
              }
              
              this.errMessage = handleError(this, e)
            })
        } else {
          this.nameErrorMsg = this.nameError
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .container {
    max-width: 500px;

    .form-container {
      display: grid;
      grid-template-columns: 1fr 2fr;
      grid-gap: 10px;
      grid-row-gap: 15px;

      .title {
        display: flex;
        align-items: center;
      }

      .cancel {
        grid-column-start: 1;
        grid-column-end: 2;
      }

      .submit {
        grid-column-start: 2;
        grid-column-end: 3;

        margin-left: 50%;
      }
    }
  }
</style>
