<template>
  <div class="spammer-container">
    <div class="exclamation-mark" @click="long = !long" >
      !
    </div>

    <div class="content" :class="{'is-visible': long}">
      <div class="text" :class="{'text-left': $store.getters.subscriptionStatus === 'paused'}">
        {{ $store.getters.subscriptionStatus === 'cancelled'
          ? 'Your subsctiption is cancelled. Please press button to subscribe.'
          : 'Subscription is paused. Reason: Insufficient funds.'
        }}
      </div> 

      <el-button
        v-if="$store.getters.subscriptionStatus === 'cancelled'"
        @click="handleResubscribe"
        class="subscribe-btn"
        plain
        :loading="loading"
      >
        Resubscribe
      </el-button>

      <el-button
        class="close-btn" 
        type="text"
        icon="el-icon-close"
        @click="long = false"
      />
    </div>
  </div>
</template>

<script>
  import SPPCloudApi from '@/api/cloud-api.js'
  import handleError from '@/utils/errorHandler.js'

  export default {
    data () {
      return {
        long: true,

        loading: false,

        errMessage: null
      }
    },

    beforeDestroy () {
      if (this.errMessage) {
        this.errMessage.close()
      }
    },

    methods: {
      handleClick () {
        this.dialogOpened = true
      },

      handleResubscribe () {
        this.$confirm('Are you sure?')
          .then(_ => {
            this.loading = true
        
            SPPCloudApi
              .resubscribe({plan: parseInt(this.$store.getters.planId)})
              .then(r => {
                this.loading = false
                this.$emit('subscription-update', r.data.result)
                this.$emit('subscription-uncancelled')
                this.successMessage = 'Subscription has been updated successfully.'
                this.$store.dispatch('updateSubscriptionStatusAndType', {status: r.data.result.status, type: r.data.result.plan.name})
              })
              .catch(e => {
                this.loading = false
                this.errMessage = handleError(this, e)
              })
          })
          .catch(_ => {})
      },      
    }
  }
</script>


<style lang="scss" scoped>
  $circle-size: 60px;
  $exclamation-mark-size: 46px;

  .spammer-container {
    position: fixed;
    z-index: 2000;

    transition: all .2s ease-in;

    padding: 0;
    
    height: $circle-size;
    bottom: 50px;
    left: 50px;
    background-color: whitesmoke;
    border-radius: 5px;

    display: flex;
    align-items: center;
    justify-content: center;

    overflow: hidden;

    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);

    &:hover {
      cursor: pointer;
      box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
    }

    .exclamation-mark {
      font-size: $exclamation-mark-size;
      font-weight: bold;

      color: whitesmoke;
      background-color: rgb(202, 0, 0);
      user-select: none;

      padding: 0 30px;

      height: 100%;
      display: flex;
      align-items: center;
    }

    .content {
      height: 100%;
      display: flex;
      align-items: center;
      color: rgb(202, 0, 0);

      background-color: whitesmoke;

      overflow: hidden;

      .close-btn {
        font-size: 40px;
        padding: 0 30px;
      }

      .subscribe-btn {
        margin-left: 30px;
      }

      transition: width .2s ease-in;

      pointer-events: none;
      opacity: 0;
      width: 0px;
      &.is-visible {
        opacity: 1;
        width: calc(100vw - 175px);
        pointer-events: initial;
        .text {
          width: auto;
          height: 1em;
        }
      }

      .text {
        margin-left: auto;
        overflow: hidden;
        transition: all .2s ease-in;

        .text-left {
          margin-left: 20px;
        }
      }
    }
  }
</style>

