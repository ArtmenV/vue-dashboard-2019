<template>
  <div class="container actions-container" v-loading="loading">
    <div class="header">
      <div class="header__title">Tickets</div>
    </div>

    <div v-show="ticketList" class="tickets-table">
      <div class="top-container">
        <el-button type="primary-outline" size="small" class="reset-btn" @click="resetFilter">Reset filters</el-button>
        <el-input type="text" class="search-input" size="small" @keyup.enter.native="updateList" v-model="filter.search" placeholder="Search..."></el-input>
        <el-button size="small" type="primary" @click="updateList">Search</el-button>

        <el-button size="small add-btn" type="success" @click="$router.push('/tickets/new')">Add new</el-button>
      </div>

      <el-table 
        :data="ticketList"
        :header-cell-style="style.headerCell"
        :cell-style="style.tableCell" 
      >
        <el-table-column
          label="#"
          width="40"
          prop="ticket_id">
        </el-table-column>        

        <el-table-column
          label="Summary"
          prop="summary">
        </el-table-column>

        <el-table-column
          label="Status"
          width="150">

          <template slot-scope="scope">
            <span class="created-at">
              {{ prettyTicketStatus(ticketList[scope.$index].status) }}
            </span>
          </template>

        </el-table-column>

        <el-table-column
          label="Created at"
          width="200">

          <template slot-scope="scope">
            <span class="created-at">
              {{ prettyDate(ticketList[scope.$index].created_at) }}
            </span>
          </template>

        </el-table-column>

        <el-table-column
          label="Action"
          width="80"
        >

          <template slot-scope="scope">
            <el-tooltip 
              class="item item_btn" 
              effect="dark" 
              content="View ticket" 
              placement="bottom"
            >
              <el-button
                type="text" 
                @click.native.prevent="$router.push('/tickets/' + ticketList[scope.$index].ticket_id)"
              >
                <i class="el-icon-view icon-btn"></i>
              </el-button>
            </el-tooltip>
          </template>

        </el-table-column>

        <template slot="empty">
          <div class="no-tickets">
            <span class="no-tickets__header">
              Looks like you don't have any tickets matching your search. To create one, press the button below
            </span><br/>

            <el-button 
              class="no-tickets__new-btn" 
              type="success" size="small" 
              @click="$router.push('/tickets/new')"
            >
              Create new ticket
            </el-button>
          </div>
        </template>
      </el-table>

      <div class="bottom-container">

        <el-pagination
          background
          layout="prev, pager, next"
          @current-change="handlePageChange"
          :page-size="10"
          :total="total">
        </el-pagination>
      </div>
    </div>

    <div v-if="!ticketList && !loading" class="no-tickets">
      <span class="no-tickets__header">
        Looks like you don't have any tickets for now. To create one, press the button below
      </span><br/>

      <el-button class="no-tickets__new-btn" type="success" size="small" @click="$router.push('/tickets/new')">
        Create new ticket
      </el-button>
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
        loading: true,
        ticketList: null,
        filter: {
          search: ''
        },
        pageNumber: 1,
        total: null,
        totalPages: null,

        cssDisplay: null,

        errMessage: null,

        style: {
          tableCell: {
            border: '.5px solid #f4f4f4 !important'
          },
          headerCell: {
            border: '.5px solid #f4f4f4 !important'
          }
        }
      }
    },

    watch: {
      cssDisplay: function (val) {
        this.updateList()
      }
    },

    mounted () {
      setInterval(() => {
        this.cssDisplay = this.$el.style.display
      }, 200)
    },

    methods: {
      stateChange (state, id) {
        this.$emit('state-change', state, id)
      },

      updateList () {
        this.loading = true
        const pageNumber = this.pageNumber
        SPPCloudApi
          .getTicketList(this.filter, pageNumber)
          .then(response => {
            this.loading = false
            this.ticketList = response.items
            this.total = response.total_results
            this.totalPages = response.total_pages
          })
      },

      prettyDate: prettyDate,

      prettyTicketStatus: prettyTicketStatus,

      handlePageChange (newPage) {
        this.pageNumber = newPage
        this.updateList()
      },

      resetFilter () {
        this.filter.search = ''
        this.pageNumber = 1

        this.updateList()
      },

      deleteTicket (id) {
        this.$confirm('Are you sure you want delete ticket?')
          .then(_ => {
            SPPCloudApi
              .deleteServerTicket(id)
              .then(r => {
                if (this.ticketList.length === 1 && this.pageNumber !== 1) {
                  this.pageNumber--
                }
                this.updateList()
              })
          })
      }
    }
  }
</script>

<style lang="scss">
.el-table .cell {
  word-break: break-word !important;
}
</style>

<style lang="scss">
.actions-container {
  .el-table_1_column_5 {
    margin-left: .4rem;
  }

  .item_btn {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: .6rem;
  }
}

.el-table__empty-text {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.el-table__empty-block {
  border-left: .5px solid #f4f4f4 !important;
  border-right: .5px solid #f4f4f4 !important;
}
</style>

<style lang="scss" scoped>
  .icon-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 18px;
  }

  .header {
    display: flex;

    &__title {
      font-size: 24px;
      font-weight: bold;
    }

    &__muted {
      font-size: 14px;
      color: lightgray;
      margin-top: 23px;
      margin-left: 30px;
    }
  }

  .top-container {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin: 10px 0;


    .search-input {
      max-width: 300px;
      margin: 0 10px;
    }

    .add-btn {
      margin-left: 20px;
    }
  }

  .no-tickets {
    padding: 30px;
    color: #909399;
    max-width: 500px;

    &__new-btn {
      margin-top: 20px;
    }
  }

  .bottom-container {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin: 10px 0;
  }
</style>
