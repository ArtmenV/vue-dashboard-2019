<template>
  <div class="page-container" v-loading="loading">
    <div class="company-name" v-if="company">
      <div v-show="!nameEditing" class="view">
        {{ company.name }}
      </div>
    </div>

    <el-tabs type="border-card">
      <!-- Threatlists -->
      <el-tab-pane label="Threatlists">
        <file-transfer
          :data="actionFiles"
          @transfer="handleThreatlistTransfer"
        ></file-transfer>
      </el-tab-pane>
      
      <!-- Whitelist -->
      <el-tab-pane label="Whitelist">
        <div class="outer-container" style="display:grid; grid-template-columns:500px 1fr; grid-gap: 20px;">
          <div class="whitelist-container" v-if="company">
            <h2 class="header header--list">Whitelist</h2>

            <select v-model="selected.whitelist" multiple class="site-select" :size="company.whitelist.data.length">
              <option
                v-for="action in company.whitelist.data"
                :key="action.id"
                class="action-option"
                :class="{'active': selected.whitelist.indexOf(action.value) !== -1}">
                {{ action.value }}
              </option>
            </select>

            <div class="footer">
              <el-button type="text" @click="whitelistRemove" :disabled="selected.whitelist.length === 0" class="del-btn">
                <i class="el-icon-delete"></i>
              </el-button>

              <el-button type="text" @click="whitelistUploadCSV" disabled>
                <i class="el-icon-upload"></i>
              </el-button>
            </div>
          </div>

          <div class="help-text">
            Add domains that will be whitelisted for all the servers on your account.
          </div>
        </div>

        <div class="new-element">
          <el-input
            class="input"
            type="textarea"
            :autosize="{ minRows: 2 }"
            v-model="whitelistNew"
            size="mini" 
          />
          
          <el-button 
            size="mini" 
            type="success" 
            @click="whitelistAdd" 
            :disabled="!whitelistNew"
            style="margin-bottom: auto;"
          >
            Submit
          </el-button>
        </div>

        <el-alert
          type="error"
          style="max-width: 500px; margin-top: 10px;"
          v-if="whitelistAddingErrorMsg"
          :title="whitelistAddingErrorMsg"
          :closable="false"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import SPPCloudApi from '@/api/cloud-api.js'
  import handleError from '@/utils/errorHandler.js'

  export default {
    data () {
      return {
        company: null,

        nameEditing: false,
        newCompanyName: '',

        errMessage: null,

        loading: false,

        selected: {
          whitelist: []
        },

        actionFiles: {
          used: [],
          available: []
        },

        whitelistNew: '',
        whitelistAddingErrorMsg: '',
        whitelistNewItems: [],
        whitelistError: '',
      }
    },

    beforeDestroy () {
      if (this.errMessage) {
        this.errMessage.close()
      }
    },

    mounted () {
      if (this.$store.state.user.subscriptionType === 'Free Plan' || this.$store.state.user.subscriptionType === 'Pro Plan') {
        this.$router.push('/')
      }
      this.loading = true
      SPPCloudApi
        .getCompany()
        .then(r => {
          const result = JSON.parse(JSON.stringify(r.data.result))

          this.loading = false
          this.company = result

          this.actionFiles.used = this.convert(result.action_files_used)

          try {
            this.actionFiles.available = this.convert(result.action_files_available)
          } catch (e) {
            console.log(e)
          }
        })
        .catch(e => {
          this.errMessage = handleError(this, e)
        })
    },

    components: {
      FileTransfer: () => import('@/components/FileTransfer/index.vue'),
      GlobalFiles: () => import('./components/global-files')
    },

    computed: {
      isNewWhitelistItemValid: function () {
        // string was copied from stackoverflow and was edited somehow
        function validUrl (string) {
          var pattern = new RegExp('^((https?:\\/\\/)|(\.))?'+ 
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
            '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
          return !!pattern.test(string);
        }

        if (this.whitelistNew.indexOf('\n') === -1) {
          return validUrl(this.whitelistNew)
        } else {
          let flag = true

          this.whitelistNew.split('\n').forEach(e => {
            if (e && !validUrl(e)) {
              flag = false
            }
          })

          return flag
        }
      }
    },

    methods: {
      handleEdit () {
        this.nameEditing = true
        this.newCompanyName = this.company.name
      },

      handleSubmit () {
        /* ... */
      },

      handleClose () {
        this.nameEditing = false
      },

      handleThreatlistTransfer (direction, payload) {
        this.loading = true

        const _payload = { action_files_used: [] }

        const $payload = JSON.parse(JSON.stringify(payload))

        this.actionFiles.used.forEach(el => {
          el.items.forEach(e => {
            _payload.action_files_used.push(e.id)
          })
        })
                
        if (direction === 'to-right') {
          _payload.action_files_used = _payload.action_files_used.filter(el => !$payload.filter(e => e === el).length)
        } else {
          $payload.forEach(e => {
            _payload.action_files_used.push(e)
          })
        }

        SPPCloudApi
          .updateCompany(_payload)
          .then(r => {
            // link to an array from which we'll move files
            const from = (direction === 'to-right') ? this.actionFiles.used : this.actionFiles.available

            // throw 404
    
            // link to an array to which we'll move files
            const to = (direction === 'to-right') ? this.actionFiles.available : this.actionFiles.used

            const ignoredFiles = []

            if (r.data.messages.length) {
              this.errMessage = handleError(this, r.data.messages[0].context.reason)

              const messages = r.data.messages

              messages.forEach(e => {
                if (e.context && e.context.action_file_id) {
                  ignoredFiles.push(e.context.action_file_id)
                }
              })
            }

            $payload.filter(e => ignoredFiles.indexOf(e) === -1).forEach(el => {
              // getting an item by id and it's category name
              let item
              const category = from.filter(e => e.items.filter(i => {
                if (i.id == el) {
                  item = JSON.parse(JSON.stringify(i))
                  return true
                }
                return false
              }).length === 1)[0]
      
              // pushing to array previous mentioned data
              if (direction === 'to-left') {
                if (!to.filter(e => e.id === category.id).length) {
                  to.push({
                    id: category.id,
                    name: category.name,
                    items: [item]
                  })
                } else {
                  to.filter(e => e.id === category.id)[0].items.push(item)
                }
              }
              
              // deleted data from old place
              if (direction === 'to-right') {
                from.forEach(e => {
                  e.items = e.items.filter(i => i.id != el)
                })
              }
            })
            
            this.loading = false
          })
          .catch(e => {
            this.errMessage = handleError(this, e)
            this.loading = false
          })
      },

      whitelistAdd () {
        if (this.isNewWhitelistItemValid) {
          let newWhitelist = [...this.company.whitelist.data]

          if (this.whitelistNew.indexOf('\n') !== -1) {
            this.whitelistNew.split('\n').forEach(e => {
              if (e) {
                newWhitelist.push({value: e})
              }
            })
          } else {
            newWhitelist.push({value: this.whitelistNew})
          }
          
          if (this.whitelistNewItems.length) {
            this.whitelistNewItems.forEach(e => {
              newWhitelist.push({value: e})
            })
          }

          this.loading = true
          SPPCloudApi
            .setWhitelist(this.company.whitelist.id, newWhitelist)
            .then(r => {
              try {
                this.company.whitelist.data = JSON.parse(JSON.stringify(r.data.result.data))
                this.whitelistNew = ''
                this.whitelistNewItems = []    
                this.whitelistAddingErrorMsg = ''
        
                this.loading = false
              } catch (e) {
                handleError(this, e)
              }
            })
            .catch (e => {
              this.errMessage = handleError(this, e)
            })

        } else {
          this.whitelistAddingErrorMsg = 'Incorrect URL'
        }
      },

      whitelistRemove () {
        this.$confirm('Are you sure to delete this items?')
          .then(_ => {

            let newData = this.company.whitelist.data.filter(el => this.selected.whitelist.indexOf(el.value) === -1)

            newData.map(el => el.id)

            SPPCloudApi
              .setWhitelist(this.company.whitelist.id, newData)
              .then(r => {
                this.company.whitelist.data = this.company.whitelist.data.filter(el => this.selected.whitelist.indexOf(el.value) === -1)
    
                this.selected.whitelist = []
                this.loading = false
              })
              .catch (e => {
                this.errMessage = handleError(this, e)
              })
          })
          .catch(_ => {})
      },

      whitelistUploadCSV () {
        // ...
      },

      convert (list) {
        let result = []

        list.forEach(el => {
          let id
          let name

          if (el.category) {
            id = el.category.id
            name = el.category.name
          } else {
            id = -1
            name = 'Uncategorized'
          }

          if (!result.filter(e => e.id === id).length) {
            result.push({
              id: id,
              name: name,
              items: [el]
            })
          } else {
            result.filter(e => e.id === id)[0].items.push(el)
          }
        })

        return result
      }
    }
  }
</script>

<style lang="scss" scoped>
  .page-container {
    padding: 20px;

    .company-name {
      display: flex;
      align-items: center;

      font-size: 24px;
      font-weight: bold;

      margin-bottom: 20px;

      .close-btn,
      .submit-btn,
      .edit-btn {
        font-size: 20px;
        margin-left: 5px;
      }

      .edit {
        .submit-btn {
          color: green;
        }

        .close-btn {
          color: red;
        }

        .name-input {
          width: 200px;
        }
      }
    }

    .whitelist-container {
      border: 1px solid #e4e7ed;
      max-width: 500px;

      .header {
        font-weight: 500;
        font-size: 20px;
        text-align: center;
        margin: 0;
        padding: 5px 0;
        background-color: #f5f7fa;
      }

      .site-select {
        width: 100%;
        overflow-y: hidden;
        border: 0;
        outline: none;

        option {
          min-height: 30px;
          display: flex;
          align-items: center;
          padding-left: 5px;          
        }
      }

      .footer {
        background-color: #f5f7fa;
        display: flex;
        justify-content: flex-end;
        align-items: center;

        padding-right: 10px;
        
        i {
          font-size: 20px;
        }

        .del-btn {
          color: red;

          &.is-disabled {
            color: #c0c4cc;
          }
        }
      }
    }

    .new-element {
      max-width: 500px;
      margin-top: 10px;
      display: grid;
      grid-template-columns: 1fr 80px;
      column-gap: 10px;
    }
  }
</style>
