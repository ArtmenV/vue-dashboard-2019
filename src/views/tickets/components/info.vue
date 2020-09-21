<template>
  <div class="container" v-loading="loading">
    <el-button class="back-to-list-btn" size="mini" @click="$router.push('/tickets/list')">
      <i class="el-icon-arrow-left"></i> Back
    </el-button>

    <div class="info" v-if="ticket">
      <span class="info__label">
        Status:
      </span>

      <span class="info__value">
        {{ prettyTicketStatus(ticket.status) }}
      </span>

      <span class="info__label">
        Summary:
      </span>

      <span class="info__value">
        {{ ticket.summary }}
      </span>

      <span class="info__label">
        Description:
      </span>

      <span class="info__value">
        {{ ticket.description }}
      </span>

      <span class="info__label">
        Created at:
      </span>

      <span class="info__value">
        {{ prettyDate(ticket.created_at) }}
      </span>

      <span class="info__label">
        Ticket id:
      </span>

      <span class="info__value">
        {{ ticket.ticket_id }}
      </span>
    </div>
  </div>
</template>

<script>
  import SPPCloudApi from '@/api/cloud-api.js'
  import prettyDate from '@/utils/prettyDate.js'
  import prettyTicketStatus from '@/utils/prettyTicketStatus.js'

  export default {
    data () {
      return {
        ticket: null,
        loading: true
      }
    },

    computed: {
      ticketId () {
        return this.$route.params['id']
      }
    },

    mounted () {
      this.getTicketInfo()
    },

    methods: {
      getTicketInfo () {
        this.loading = true

        SPPCloudApi
          .getTicketInfo(this.ticketId)
          .then(r => {
            this.loading = false
            this.ticket = r.data.result
          })          
      },

      prettyDate: prettyDate,

      prettyTicketStatus: prettyTicketStatus
    }
  }
</script>

<style lang="scss" scoped>
  .container {
    max-width: 500px;

    .info {
      margin-top: 20px;

      display: grid;
      grid-template-columns: 1fr 3fr;
      grid-gap: 5px;

      &__label {
        font-weight: bold;
      }
    }
  }
</style>
