<template>
  <div class="container" v-loading="loading">
    <h1 class="header">Server list</h1>
    
    <div class="top-container">
      <div class="wrapper container">
        <div class="wrapper__button">
          <el-radio-group v-model="filter.status" size="small" class="btn-group">
            <el-radio-button label="ALL"></el-radio-button>
            <el-radio-button label="SYNC ON" value="ONLINE"></el-radio-button>
            <el-radio-button label="SYNC OFF" value="OFFLINE"></el-radio-button>
          </el-radio-group>
        </div>
        <div class="wrapper__select">
          <el-select 
            v-model="filter.group" 
            class="status-select" 
            size="small" 
            placeholder="Choose group"
          >
            <el-option
              v-for="group in availableGroups"
              :key="group.server_group_id"
              :label="group.name"
              :value="group.server_group_id">
            </el-option>
          </el-select>

          <el-button 
            size="mini" 
            type="success" 
            class="validate-btn" 
            @click="$router.push('/servers/validate')"
          >
            Validate new server
          </el-button>
        </div>
      </div>

      <div class="wrapper wrapper-right">
        <el-button 
          type="primary-outline" 
          size="small" 
          class="reset-btn" 
          @click="resetFilter"
        >
          Reset filters
        </el-button>

        <el-input
          size="small"
          class="search-input"
          placeholder="Search..."
          @keyup.enter.native="handleFilter"
          v-model="filter.search">
        </el-input>

        <el-button 
          size="small" 
          class="search-btn" 
          type="primary" 
          @click="handleFilter"
        >
          Search
        </el-button>
      </div>
    </div>

    <el-table
      v-if="list"
      :data="list"
      :header-cell-style="style.headerCell"
      :cell-style="style.tableCell"
    >
      <el-table-column
        label="Name"
        prop="name"
        min-width="200"
        class="name-column"
      />

      <el-table-column
        label="IP"
        prop="host_ip"
        width="140"
      />

      <el-table-column
        label="Status"
        width="120"
        prop="host_status"
      >

        <template slot-scope="scope">
          <el-tag
            size="mini"
            :type="scope.row.host_status ? 'success' : 'danger'">
            {{ scope.row.host_status ? 'SYNC ON' : 'SYNC OFF' }}
          </el-tag>
        </template>

      </el-table-column>

      <el-table-column
        label="Group"
        prop="host_groups[0].name"
        min-width="100"
      >
        <template slot-scope="scope">
          <div class="group-list">
            <span v-for="(group, index) in scope.row.host_groups" :key="group.id" class="group">
              {{ group.name + (index === scope.row.host_groups.length - 1 ? '' : ', ') }}
              <wbr>
            </span>
          </div>
        </template>
      </el-table-column>

      <!-- <el-table-column
        label="Load average"
        prop="load_avarage"
        min-width="100"
      />

      <el-table-column
        label="Uptime"
        prop="uptime"
      /> -->

      <el-table-column
        label="Linked"
        prop="last_sync"
        min-width="180"
      >

        <template slot-scope="scope">
          {{ _prettyDate(scope.row.created_at) }}
        </template>

      </el-table-column>

      <el-table-column
        label="Actions"
        width="140"
        fixed="right"
      >

        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="View server's statistics" placement="bottom">
            <el-button type="text" @click="chooseServer(list[scope.$index].server_id, '0')">
              <i class="el-icon-view icon-btn"></i>
            </el-button>
          </el-tooltip>

          <el-tooltip class="item" effect="dark" content="View server's threatlist" placement="bottom">
            <el-button type="text" @click="chooseServer(list[scope.$index].server_id, '1')">
              <i class="el-icon-document icon-btn"></i>
            </el-button>
          </el-tooltip>

          <el-tooltip class="item" effect="dark" content="Delete server" placement="bottom">
            <el-button type="text" class="del-icon" @click="handleDelete(list[scope.$index].server_id)">
              <i class="el-icon-delete icon-btn"></i>
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>

      <template slot="empty">
        <div class="no-tickets" style="display:grid; grid-template-columns: 1fr; margin: 20px auto;">
          <span class="no-tickets__header">
            Looks like you don't have any servers matching your search.
          </span>
        </div>
      </template>
    </el-table>

    <div class="bottom-container" v-if="list">
      <div class="pagination">
        <el-pagination
          background
          layout="prev, pager, next"
          @current-change="handlePageChange"
          :page-size="10"
          :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import c3 from 'c3'
  import serverApi from '@/api/server-api.js'
  import SPPCloudApi from '@/api/cloud-api.js'
  import prettyDate from '@/utils/prettyDate.js'
  import handleError from '@/utils/errorHandler.js'

  export default {
    data () {
      return {
        filter: {
          status: 'ALL',
          group: undefined,
          search: ''
        },
        availableGroups: [],
        pageNumber: 1,
        list: null,
        total: null,
        totalPages: null,
        currentPage: null,
        loading: true,

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

    computed: {
      filterStatus: function () {
        return this.filter.status
      },

      filterGroup: function () {
        return this.filter.group
      }
    },

    watch: {
      filterStatus: function (val) {
        this.updateList()
      },

      filterGroup: function (val) {
        this.updateList()
      },

      cssDisplay: function (val) {
        this.updateList()
      }
    },

    mounted () {

      setInterval(() => {
        this.cssDisplay = this.$el.style.display
      }, 200)

      SPPCloudApi
        .getShortGroupList()
        .then(r => {
          this.availableGroups = r
          this.availableGroups.unshift({
            id: null,
            name: 'All groups'
          })
        })
    },

    beforeDestroy () {
      if (this.errMessage) {
        this.errMessage.close()
      }
    },

    methods: {
      chooseServer (id, param) {
        this.$emit('state-change', id, param)
      },

      handleFilter () {
        this.updateList()
      },

      handleDelete (id) {
        // const additional = (this.list.length !== 1) ? '' : ' Your subscription will be cancelled automatically.'
        // this.$confirm('Are you sure you want delete server?' + additional)
        this.$confirm('Are you sure you want delete server?')
        .then(_ => {
          SPPCloudApi
          .deleteServer(id)
          .then(r => this.updateList())
          .catch(e => {
            this.errMessage = handleError(this, e)
          })
        })
      },

      _prettyDate (dateISO) {
        return prettyDate(dateISO)
      },

      updateList () {
        this.loading = true
        
        SPPCloudApi
          .getServerList(this.filter, this.pageNumber)
          .then(r => {
            this.list = r.list
            this.total = r.total
            this.totalPages = r.totalPages
            this.currentPage = r.page
            this.loading = false
            this.total = r.total
          })
          .catch(error => console.log(error))
      },

      handlePageChange (newPage) {
        this.pageNumber = newPage
        this.updateList()
      },

      resetFilter () {
        this.filter.search = ''
        this.filter.status = 'ALL'
        this.filter.group = null
        this.pageNumber = 1

        this.updateList()
      }
    }
  }
</script>

<style lang="scss">
.top-container {
  .status-select {
    max-width:170px;
    min-width: 120px;
  }

  .el-input--small .el-input__inner {
    height: 31px !important;
  }
}

.el-table__body, .el-table__footer, .el-table__header {
  table-layout: auto !important;
}

.el-table__empty-block {
  border-left: .5px solid #f4f4f4 !important;
  border-right: .5px solid #f4f4f4 !important
}

.el-table .cell {
  word-break: break-word !important;
}
</style>

<style lang="scss" scoped>
  .container {
    .header {
      font-size: 24px;
    }

    .del-icon {
      color: red;
    }

    .icon-btn {
      font-size: 18px;

      &.del-icon {
        color: red;

        &.is-disabled {
          color: lightgray
        }
      }
    }

    .top-container {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;

      .wrapper {
        display: flex;
        flex-wrap: nowrap !important;

        .wrapper__select {
          flex-wrap: nowrap !important;
        }
      }

      .btn-group {
        display: flex;
        flex-wrap: nowrap;
      }

      .reset-btn {
        margin-left: auto;
        margin-right: 10px;
        height: 31px;
      }

      .validate-btn {
        margin-left: 10px;
        height: 31px !important;
      }

      .search-input {
        max-width: 220px;
      }

      .status-select {
        margin-left: 10px;
      }

      .search-btn {
        height: 31px;
        margin-left: 10px;
      }
    }

    .group-list {
      word-break: normal;
    }

    .bottom-container {
      display: flex;
      justify-content: flex-end;
      margin-top: 10px;

      .showing {
        padding-top: 7px;
      }
    }
  }

  @media screen and (max-width: 1076px) {
    .top-container {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;

      .wrapper-right {
        margin-top: 1rem;
      }
    }
  }

  @media screen and (max-width: 680px) {
    .top-container {
      .container {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
      }
      .wrapper {
        &__select {
          display: flex;
          margin-top: 1rem;

          .status-select {
            margin-left: 0 !important;
          }
        }
      }
    }
  }
</style>
