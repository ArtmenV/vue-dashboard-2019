<template>
  <div class="container">
    <div class="header">
      <div class="header__title">Server groups</div>
    </div>

    <div class="top-container">
      <el-button type="primary-outline" size="small" class="reset-btn" @click="resetFilter">Reset filters</el-button>
      <el-input type="text" class="search-input" size="small" @keyup.enter.native="updateList" v-model="filter.search" placeholder="Search..."></el-input>
      <el-button size="small" type="primary" @click="updateList">Search</el-button>

      <el-button size="small add-btn" type="success" @click="$router.push('/server-groups/new')">Add new</el-button>
    </div>

    <el-table 
      :data="groupList"
      v-loading="loading"
      :header-cell-style="style.headerCell"
      :cell-style="style.tableCell"
    >
      <el-table-column
        label="Name"
        prop="name">
      </el-table-column>

      <el-table-column
        label="Description"
        prop="description">
      </el-table-column>

      <el-table-column
        label="Action"
        width="120">

        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="View server group" placement="bottom">
            <el-button type="text" @click.native.prevent="stateChange('settings', groupList[scope.$index].server_group_id)">
              <i class="el-icon-view icon-btn"></i>
            </el-button>
          </el-tooltip>

          <el-tooltip class="item" effect="dark" content="Edit server group" placement="bottom">
            <el-button type="text" @click.native.prevent="stateChange('settings', groupList[scope.$index].server_group_id)">
              <i class="el-icon-edit icon-btn"></i>
            </el-button>
          </el-tooltip>

          <el-tooltip class="item" effect="dark" content="Delete server group" placement="bottom">
            <el-button
              @click.native.prevent="deleteGroup(groupList[scope.$index].server_group_id)"
              type="text"
              class="icon-btn del-btn"
              style="color:red;"
              size="small">
              <i class="el-icon-delete"></i>
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>

      <template slot="empty">
        <div 
          class="no-tickets" 
          style="display:grid; 
          grid-gap: 20px; 
          grid-template-columns: 1fr; 
          margin: 20px auto;"
        >
          <span class="no-tickets__header">
            Looks like you don't have any server groups matching your search. To create one, press the button below
          </span>

          <el-button class="no-tickets__new-btn" style="width: 250px; margin: 0 auto;" type="success" size="small" @click="$router.push('/server-groups/new')">
            Create new server group
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
</template>

<script>
  import serverGroupApi from '@/api/server-group.js'
  import SPPCloudApi from '@/api/cloud-api.js'

  export default {
    data () {
      return {
        loading: true,
        groupList: null,
        filter: {
          search: ''
        },
        pageNumber: 1,
        total: null,
        totalPages: null,

        cssDisplay: null,

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
          .getGroupList(this.filter, pageNumber)
          .then(response => {
            this.loading = false
            this.groupList = response.items
            this.total = response.total_results
            this.totalPages = response.total_pages
          })
      },

      handlePageChange (newPage) {
        this.pageNumber = newPage
        this.updateList()
      },

      resetFilter () {
        this.filter.search = ''
        this.pageNumber = 1

        this.updateList()
      },

      deleteGroup (id) {
        this.$confirm('Are you sure you want delete server group?')
          .then(_ => {
            SPPCloudApi
              .deleteServerGroup(id)
              .then(r => {
                if (this.groupList.length === 1 && this.pageNumber !== 1) {
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
.el-table__empty-block {
  border-left: .5px solid #f4f4f4 !important;
  border-right: .5px solid #f4f4f4 !important
}

.el-table .cell {
  word-break: break-word !important;
}
</style>

<style lang="scss" scoped>
  .icon-btn {
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

  .bottom-container {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin: 10px 0;
  }
</style>
