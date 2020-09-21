<template>
  <div class="container">
    <div class="header">
      <h1 class="header__title">Open ticket</h1>
    </div>

    <el-button class="back-to-list-btn" size="mini" @click="$router.push('/tickets/list')">
      <i class="el-icon-arrow-left"></i> Back
    </el-button>

    <div class="new-ticket-form" v-loading="loading">
      <span class="label">
        Summary
      </span>

      <div class="input-v" :data-error-msg="nameError === nameErrorMsg ? nameErrorMsg : ''">
        <el-input class="input" v-model.trim="ticket.summary" size="small" />
      </div>

      <span class="label">
        Description
      </span>

      <el-input class="input" v-model="ticket.description" :rows="7" type="textarea" size="small"></el-input>

      <el-button
        class="submit-btn"
        size="small"
        type="success"
        @click="sendTicket"
        :disabled="!sendingAvailable">
        Submit
      </el-button>
    </div>

    <el-alert
      v-if="successText"
      :title="successText"
      type="success"
      class="success-message"
      show-icon>
    </el-alert>
  </div>
</template>

<script>
  import SPPCloudApi from '@/api/cloud-api.js'
  import handleError from '@/utils/errorHandler.js'

  export default {
    data () {
      return {
        ticket: {
          summary: '',
          description: ''
        },

        successText: '',

        nameErrorMsg: '',

        loading: false,
        
        errMessage: null
      }
    },

    beforeDestroy () {
      if (this.errMessage) {
        this.errMessage.close()
      }
    },

    computed: {
      sendingAvailable () {
        return this.ticket.summary && this.ticket.description && !this.loading
      },

      nameError () {
        const name = this.ticket.summary

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

    mounted () {
      if (this.$route.query && this.$route.query.guarantee) {
        this.ticket.summary = '7 days money back guarantee'
      }
    },

    methods: {
      sendTicket () {
        if (this.nameError === '') {
          this.loading = true
  
          SPPCloudApi
            .createTicket({
              summary: this.ticket.summary,
              description: this.ticket.description
            })
            .then(r => {
              this.loading = false
              this.successText = 'Successfully opened ticket.'

              this.$message({
                type: 'success',
                message: 'Ticket has been successfully'
              })
              this.$router.push('/tickets/' + r.data.result.ticket_id)
            })
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

    .header {
      display: flex;

      &__title {
        font-size: 24px;
      }

      &__muted {
        font-size: 14px;
        color: lightgray;
        margin-top: 23px;
        margin-left: 30px;
      }
    }

    .new-ticket-form {
      margin-top: 20px;

      display: grid;
      grid-template-columns: 1fr 3fr;
      grid-gap: 10px;
      grid-row-gap: 15px;

      .label {
        display: flex;
        margin-top: 6px;
      }

      .submit-btn {
        grid-column-start: 2;
        grid-column-end: 3;

        margin-left: auto;
      }
    }

    .success-message {
      margin-top: 10px;
    }
  }
</style>
