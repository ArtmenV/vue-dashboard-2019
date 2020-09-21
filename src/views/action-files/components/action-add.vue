<template>
  <div class="container" v-loading="loading">
    <h2 class="header">
      Create new action file
    </h2>

    <div class="form-container">
      <div class="title">
        Name:
      </div>

      <div class="input-v" :data-error-msg="nameError === nameErrorMsg ? nameErrorMsg : ''">
        <el-input size="mini" v-model.trim="newFile.name" />
      </div>

      <div class="title">
        Description:
      </div>

      <el-input size="mini" v-model="newFile.description">
      </el-input>

      <div class="title">
        Environment
      </div>

      <el-select v-model="newFile.environment" placeholder="Select environment" size="mini">
        <el-option label="None" :value="null" />

        <el-option label="Business" :value="0" />

        <el-option label="Home" :value="1" />
      </el-select>

      <el-button size="mini" class="cancel" @click="$router.push('/action-files/list')">
        Cancel
      </el-button>

      <el-button
        type="success"
        size="mini"
        class="submit"
        @click="submitHandler"
      >
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
        newFile: {
          name: '',
          description: '',
          environment: null,
        },

        nameErrorMsg: '',

        errMessage: null
      }
    },

    beforeDestroy () {
      if (this.errMessage) {
        this.errMessage.close()
      }
    },

    computed: {
      nameError () {
        const name = this.newFile.name

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

          const newFile = {
            name: this.newFile.name,
            description: this.newFile.description,
            environment: this.newFile.environment
          }

          if (this.newFile.environment) {
            newFile.environment = this.newFile.environment
          }
          
          SPPCloudApi
            .createActionFile(newFile)
            .then(r => this.$router.push('/action-files/' + r.data.result.block_list_id)) 
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
