<template>
  <div class="container">
    <div class="header">
      Threatlists
    </div>

    <div class="top-container">
      <el-button type="primary-outline" size="small" class="reset-btn" @click="resetFilter">Reset filters</el-button>
      <el-input type="text" v-model="filter.search" class="search-input" size="small" @keyup.enter.native="updateList" placeholder="Search..."></el-input>
      <el-button size="small" type="primary" @click="updateList">Search</el-button>

      <el-button size="small add-btn" type="success" @click="$router.push('/action-files/add')">Add new</el-button>      
    </div>

    <el-table 
      :data="actionList" 
      v-loading="loading" 
      :header-cell-style="style.headerCell"
      :cell-style="style.tableCell"
    >
      <el-table-column
        prop="name"
        label="Name"
        width="200"
      />

      <el-table-column
        prop="description"
        label="Description"
        min-width="140"
      />

      <el-table-column
        prop="latest_version"
        min-width="116"
        label="Latest version"
      />

      <el-table-column
        width="160"
        label="Latest version date">

        <template slot-scope="scope">
          {{ _prettyDate(actionList[scope.$index].latest_version_date, 's') }}
        </template>
      </el-table-column>

      <el-table-column
        prop="selected_version"
        min-width="140"
        label="Selected version"
      />

      <el-table-column
        min-width="170"
        label="Selected version date">
        <template slot-scope="scope">
          {{ _prettyDate(actionList[scope.$index].selected_version_date, 's') }}
        </template>
      </el-table-column>

      <el-table-column
        fixed="right"
        label="Actions"
        width="140">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="View action file" placement="bottom">
            <el-button
              @click.native.prevent="viewAction(actionList[scope.$index].block_list_id)"
              type="text"
              class="icon-btn"
              size="small">
              <i class="el-icon-view"></i>
            </el-button>
          </el-tooltip>

          <el-tooltip class="item" effect="dark" :content="getTooltipMessageEdit(actionList[scope.$index].is_global)" placement="bottom">
            <el-button
              @click.native.prevent="editAction(actionList[scope.$index].block_list_id)"
              type="text"
              class="icon-btn"
              :disabled="actionList[scope.$index].is_global"
              size="small">
              <i class="el-icon-edit"></i>
            </el-button>
          </el-tooltip>

          <el-tooltip class="item" effect="dark" :content="getTooltipMessageDelete(actionList[scope.$index].is_global)" placement="bottom">
            <el-button
              @click.native.prevent="deleteFile(actionList[scope.$index].block_list_id)"
              type="text"
              class="icon-btn del-btn"
              :disabled="actionList[scope.$index].is_global"
              size="small">
              <i class="el-icon-delete"></i>
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
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
  import SPPCloudApi from '@/api/cloud-api.js'
  import handleError from '@/utils/errorHandler.js'
  import prettyDate from '@/utils/prettyDate.js'

  export default {
    data () {
      return {
        loading: true,
        actionList: [],
        filter: {
          search: ''
        },
        pageNumber: 1,
        total: null,
        totalPages: null,

        errMessage: null,

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

    beforeDestroy () {
      if (this.errMessage) {
        this.errMessage.close()
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
      viewAction () {
        this.$emit('view-action', ...arguments)
      },

      editAction () {
        this.$emit('edit-action', ...arguments)
      },

      updateList () {
        this.loading = true
        SPPCloudApi
          .getActionFilesList(this.filter, this.pageNumber)
          .then(responce => {
            this.loading = false
            this.actionList = responce.items
            this.total = responce.total_results
            this.totalPages = responce.total_pages
          })
          .catch(e => {
            this.errMessage = handleError(this, e)
          })
      },

      handlePageChange (newPage) {
        this.pageNumber = newPage
        this.updateList()
      },

      _prettyDate (dateISO, format) {
        return prettyDate (dateISO, format)
      },

      resetFilter () {
        this.filter.search = ''
        this.pageNumber = 1

        this.updateList()
      },

      deleteFile (id) {
        this.$confirm('Are you sure you want delete action file?')
          .then(_ => {
            SPPCloudApi
              .deleteActionFile(id)
              .then(r => {
                if (this.actionList.length === 1 && this.pageNumber !== 1) {
                  this.pageNumber--
                }
                this.updateList()
              })
          })
      },

      handleGlobalChange (file) {
        this.loading = true
        SPPCloudApi
          .setActionFileSettings(file.block_list_id, {
            'is_applied_to_client': file.is_applied_to_client
          })
          .then(r => this.loading = false)
          .catch(e => {
            handleError(this, e)
            file.is_applied_to_client = !file.is_applied_to_client
            this.loading = false
          })
      },

      getTooltipMessageDelete (isAvailable) {
        if (!isAvailable) {
          return 'Delete action file'
        } else {
          return `You don't have access to delete this file.`
        }
      },

      getTooltipMessageEdit (isAvailable) {
        if (!isAvailable) {
          return 'Edit action file'
        } else {
          return `You don't have access to edit this file.`
        }
      }
    }
  }
</script>

<style lang="scss">
.el-table .cell {
  word-break: break-word !important;
}
</style>

<style lang="scss" scoped>  
  .header {
    font-size: 24px;
    font-weight: bold;
  }

  .top-container {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin: 10px 0;

    .reset-btn {
      margin-left: 10px;
    }

    .search-input {
      max-width: 300px;
      margin: 0 10px;
    }

    .add-btn {
      margin-left: 20px;
    }
  }

  .icon-btn {
    font-size: 18px;

    &.del-btn {
      color: red;

      &.is-disabled {
        color: lightgray;
      }
    }
  }

  .bottom-container {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin: 10px 0;
  }
</style>
