<template>
  <div class="container" v-if="group">
    <div class="nameheader">
      <div class="view" v-show="!groupName.editing">
        <h2 class="name" @click="showEditingName">
          {{ group.name }}
        </h2>

        <el-button type="text" class="edit-btn" @click="showEditingName">
          <i class="el-icon-edit"></i>
        </el-button>
      </div>

      <div class="edit" v-show="groupName.editing">
        <div class="input-v" :data-error-msg="nameError === nameErrorMsg ? nameErrorMsg : ''">
          <el-input v-model.trim="groupName.newName" class="name-input" @keyup.enter.native="submitEditingName"></el-input>
        </div>
        
        <el-button type="text" class="submit-btn" @click="submitEditingName">
          <i class="el-icon-check"></i>
        </el-button>

        <el-button type="text" class="close-btn" @click="cancelEditingName">
          <i class="el-icon-close"></i>
        </el-button>
      </div>
    </div>

    <div class="description" v-if="this.group">
      <div class="view" v-show="!groupDescription.editing">
        <div class="view__text" :class="{'text--muted': this.group.description.length === 0}">
          {{ this.group.description || 'no description' }}
        </div>

        <div class="view__edit">
          <el-button type="text" class="edit-btn" @click="showEditingDescription">
            <i class="el-icon-edit"></i>
          </el-button>
        </div>
      </div>

      <div class="edit" v-show="groupDescription.editing">
        <el-input 
          v-model="groupDescription.newDescription"
          class="name-input"
          @keyup.enter.native="submitEditingDescription"
          size="mini"
          placeholder="Enter new description..."
        />

        <el-button type="text" class="submit-btn" @click="submitEditingDescription">
          <i class="el-icon-check"></i>
        </el-button>

        <el-button type="text" class="close-btn" @click="cancelEditingDescription">
          <i class="el-icon-close"></i>
        </el-button>
      </div>
    </div>

    <el-button class="back-to-list-btn" size="mini" @click="$router.push('/server-groups/list')">
      <i class="el-icon-arrow-left"></i> Back
    </el-button>

    <el-tabs type="border-card" v-loading="loading">
      <el-tab-pane label="Servers">
        <div class="container" style="display:grid; grid-template-columns:500px 1fr; grid-gap: 20px;">          
          <div class="list-container">
            <h2 class="header header--list">Servers</h2>

            <select
              v-if="group"
              v-model="selected.servers"
              class="server-select"
              :size="Math.max(Math.min(group.servers.length, 10), 5)"
              multiple
            >
              <option v-for="server in group.servers" :key="server.id" :value="server.id">
                {{ server.name }}
              </option>
            </select>

            <div class="footer">
              <el-button type="text" class="del-btn" @click="removeServers" :disabled="selected.servers.length === 0">
                <i class="el-icon-delete"></i>
              </el-button>
            </div>
          </div>

          <div class="help-text">
            Select several servers from the list to include into server group
          </div>
        </div>

          <div class="new-server">
            <el-select 
              filterable
              v-model="newElement.serversList" 
              multiple 
              placeholder="Choose servers to include into server group" 
              size="mini"
            >
              <el-option
                v-for="server in serversList"
                :key="server.server_id"
                :value="server.server_id"
                :label="server.name">
              </el-option>
            </el-select>

            <el-button type="success" size="mini" @click="addServer" :disabled="!newElement.serversList.length">ADD</el-button>
        </div>
      </el-tab-pane>

      <el-tab-pane label="Threatlist">
        <file-transfer
          :data="actionFiles"
          @transfer="handleThreatlistTransfer"
        ></file-transfer>
      </el-tab-pane>

      <el-tab-pane label="Whitelist">
        <div class="list-container">
          <h2 class="header header--list">Whitelist</h2>

          <select
            v-if="group"
            v-model="selected.whitelist"
            class="server-select"
            :size="Math.max(Math.min(group.whitelist.data.length, 10), 5)"
            multiple
          >
            <option v-for="item in group.whitelist.data" :key="item.value">
              {{ item.value }}
            </option>
          </select>

          <div class="footer">
            <el-button type="text" class="del-btn" @click="removeWhitelist" :disabled="selected.whitelist.length === 0">
              <i class="el-icon-delete"></i>
            </el-button>
          </div>
        </div>

        <!-- Adding new item to whitelist -->
        <div class="new-whitelist">
          <el-input
            class="input"
            type="textarea"
            :autosize="{ minRows: 2 }"
            v-model="whitelistNew"
            size="mini" 
          />

          <el-button
            type="success"
            size="mini"
            @click="addWhitelist"
            :disabled="!whitelistNew"
            style="margin-bottom: auto;"
          >
            Submit
          </el-button>

          <div class="new-items-list">
            <div 
              class="item"
              v-for="(item, index) in newElement.whitelistNewItems"
              :key="index"
            >
              {{ item }}
            </div>
          </div>

          <el-alert
            type="error"
            class="error-alert"
            v-if="whitelistError.length > 0"
            :title="whitelistError"
            :closable="false"
          />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import handleError from '@/utils/errorHandler.js'
  import SPPCloudApi from '@/api/cloud-api.js'

  export default {
    data () {
      return {
        group: null,
        loading: true,

        selected: {
          servers: [],
          whitelist: [],
          usedaction: [],
          availableaction: []
        },

        newElement: {
          server: false,
          whitelist: false,
          serverName: '',
          serversList: [],
          whitelistItem: '',
          whitelistNewItems: [],
          whitelistError: ''
        },

        groupId: null,

        errMessage: null,
        nameErrorMsg: '',

        groupName: {
          editing: false,
          newName: ''
        },

        whitelistNew: '',
        whitelistNewItems: [],
        whitelistError: '',

        groupDescription: {
          editing: false,
          newDescription: ''
        },

        serversList: [],

        actionFiles: {
          used: [],
          available: []
        },
      }
    },

    props: [
      'id'
    ],

    beforeDestroy () {
      if (this.errMessage) {
        this.errMessage.close()
      }
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
      },

      backPath () {
        if (this.$route.query && this.$route.query.back) {
          return this.$route.query.back
        } else {
          return '/action-files/list'
        }
      },

      nameError () {
        const name = this.groupName.newName

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
      this.groupId = this.$route.params['id']

      SPPCloudApi
        .getGroupInfo(this.groupId)
        .then(r => {
          this.loading = false
          this.group = r

          try {
            this.actionFiles.used = this.convert(r.action_files_used)
            this.actionFiles.available = this.convert(r.action_files_available)
          } catch (e) {
            this.errMessage = handleError(this, e)
          }
          this.updateServerList()
        })
        .catch(e => {
          this.errMessage = handleError(this, e)
        })      
    },

    components: {
      FileTransfer: () => import('@/components/FileTransfer/index.vue')
    },

    methods: {
      removeServers () {
        this.$confirm('Are you sure you want delete these servers?')
          .then(_ => {
            this.group.servers.filter(el => this.selected.servers.indexOf(el.id) !== -1).forEach(el => {
              this.serversList.push({
                server_id: el.id,
                name: el.name
              })
            })
    
            let newList = this.group.servers.filter(el => this.selected.servers.indexOf(el.id) === -1)
            
            newList = newList.map(el => el.id)
    
            this.loading = true
    
            SPPCloudApi
              .setServerGroupSettings(this.groupId, {servers: newList})
              .then(r => {
                this.group.servers = this.group.servers.filter(el => this.selected.servers.indexOf(el.id) === -1)
                this.selected.servers = []
                this.loading = false
              })
              .catch(e => {
                this.errMessage = handleError(this, e)

                this.loading = false
              })
          })        
      },

      addServer () {
        this.loading = true
        let newData = [...this.newElement.serversList]

        this.group.servers.forEach(el => {
          newData.push(el.id)
        })

        SPPCloudApi
          .setServerGroupSettings(this.groupId, {servers: newData})
          .then(r => {
            this.newElement.serversList.forEach(el => {
              const name = this.serversList.filter(item => item.server_id === el)[0].name
    
              this.group.servers.push({
                id: el,
                name: name
              })
            })
    
            this.serversList = this.serversList.filter(el => {
              return this.newElement.serversList.indexOf(el.server_id) === -1
            })
    
            this.newElement.serversList = []
    
            this.loading = false
          })
          .catch(e => {
            this.loading = false 

            this.errMessage = handleError(this, e)
          })
      },

      removeWhitelist () {
        this.$confirm('Are you sure to delete these items?')
          .then(_ => {
            let newData = this.group.whitelist.data.filter(el => this.selected.whitelist.indexOf(el.value) === -1)
            newData.map(el => el.id)

            SPPCloudApi
              .setWhitelist(this.group.whitelist.id, newData)
              .then(r => {
                this.group.whitelist.data = this.group.whitelist.data.filter(el => this.selected.whitelist.indexOf(el.value) === -1)
                this.selected.whitelist = []
              })
              .catch(e => console.log(e))
          })
          .catch(_ => {})        
      },

      addWhitelist () {

        if (this.isNewWhitelistItemValid) {
          let newWhitelist = [...this.group.whitelist.data]

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
            .setWhitelist(this.group.whitelist.id, newWhitelist)
            .then(r => {
              try {
                this.group.whitelist.data = JSON.parse(JSON.stringify(r.data.result.data))
                this.whitelistNew = ''
                this.whitelistNewItems = []    
                this.whitelistAddingErrorMsg = ''
        
                this.loading = false
              } catch (e) {
                console.log(e)
                console.log('babah')
              }
            })
            .catch (e => {
              this.errMessage = handleError(this, e)
            })

        } else {
          this.whitelistError = 'Incorrect URL'
        }
      },

      moveRight () {
        let moveItems = []
        let action_files_used = []

        this.group.action_files_used.forEach(el => {
          if (this.selected.usedaction.indexOf(el.id) !== -1) {
            moveItems.push(el)
          } else {
            action_files_used.push(el.id)
          }
        });
        SPPCloudApi
          .setServerActionFile(this.groupId, {action_files_used: action_files_used})
          .then(r => {
            this.group.action_files_available.push(...moveItems)
    
            this.group.action_files_used = this.group.action_files_used.filter(el => this.selected.usedaction.indexOf(el.id) === -1)
    
            this.selected.usedaction = []
          })
          .catch(e => console.log(e))
      },

      moveLeft () {
        let moveItems = []
        let action_files_used = []

        this.group.action_files_available.forEach(el => {
          if (this.selected.availableaction.indexOf(el.id) !== -1) {
            moveItems.push(el)
            action_files_used.push(el.id)
          }
        })

        this.group.action_files_used.forEach(el => action_files_used.push(el.id))

        SPPCloudApi
          .setServerActionFile(this.groupId, {action_files_used: action_files_used})
          .then(r => {
            this.group.action_files_used.push(...moveItems)
    
            this.group.action_files_available = this.group.action_files_available.filter(el => this.selected.availableaction.indexOf(el.id) === -1)
    
            this.selected.availableaction = []
          })
          .catch(e => console.log(e))
      },

      showEditingName () {
        this.groupName.editing = true
        this.groupName.newName = this.group.name
      },

      showEditingDescription () {
        this.groupDescription.editing = true
        this.groupDescription.newDescription = this.group.description
      },

      cancelEditingDescription () {
        this.groupDescription.editing = false
      },

      submitEditingDescription () {
        this.loading = true

        const newDescription = this.groupDescription.newDescription

        SPPCloudApi
          .setServerGroupSettings(this.groupId, {description: newDescription})
          .then(r => {
            this.group.description = newDescription
            this.groupDescription.editing = false
            this.loading = false
          })
          .catch(e => {
            this.errMessage = handleError(this, e)
          })
      },

      cancelEditingName () {
        this.groupName.editing = false
      },

      submitEditingName () {
        if (this.nameError === '') {
          this.loading = true
          const newName = this.groupName.newName
          SPPCloudApi
            .setServerGroupSettings(this.groupId, {name: newName})
            .then(r => {
              this.group.name = newName
              this.groupName.editing = false
              this.loading = false
            })
            .catch(e => {
              this.errMessage = handleError(this, e)
            })
        } else {
          this.nameErrorMsg = this.nameError
        }
      },

      updateServerList () {
        SPPCloudApi
        .getShortServerList()
        .then(r => {
          r.forEach(el => {
            if (!this.group.servers.some(item => item.id === el.server_id)) {
              this.serversList.push(el)
            }
          })
        })
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
          .setServerGroupSettings(this.groupId, _payload)
          .then(r => {
            if (r.data.messages.length) {
              this.errMessage = handleError(this, r.data.messages[0].context.reason)
            } else {
              // link to an array from which we'll move files
              const from = (direction === 'to-right') ? this.actionFiles.used : this.actionFiles.available
  
              // throw 404
      
              // link to an array to which we'll move files
              const to = (direction === 'to-right') ? this.actionFiles.available : this.actionFiles.used
  
              $payload.forEach(el => {
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
              

            }
            this.loading = false
          })
          .catch(e => {
            this.loading = false
            this.errMessage = handleError(this, e)
          })
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
      },

      addMoreWhitelist () {
        if (this.isNewWhitelistItemValid) {
          this.newElement.whitelistNewItems.push(this.newElement.whitelistItem)
          this.newElement.whitelistItem = ''
        } else {
          this.newElement.whitelistError = 'Please enter correct URL.'
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .container {
    .nameheader {
      height: 40px;

      .view {
        display: flex;
        height: 100%;
        align-items: center;
        
        .edit-btn {
          font-size: 24px;
          margin-left: 10px;
        }
      }

      .edit {
        display: flex;
        height: 100%;
        align-items: center;
        
        .submit-btn,
        .close-btn {
          font-size: 24px;
          margin-left: 10px;
          font-weight: bold;
        }

      }
    }

    .name-input {
      max-width: 200px;
    }

    .submit-btn {
      color: green;
    }

    .close-btn {
      color: red;
    }

    .description {
      height: 35px;

      .edit,
      .view {
        display: flex;
        align-items: center;

        & > * {
          margin-right: 10px;
        }

        i {
          font-size: 18px;
        }
      }
    }

    .back-to-list-btn {
      margin: 10px 0;
    }

    .del-btn {
      color: red;

      &.is-disabled {
        color: #c0c4cc;
      }
    }

    .list-container {
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

      .server-select {
        width: 100%;
        overflow-y: auto;
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
      }
    }

    .new-server {
      display: grid;
      grid-template-columns: 1fr 70px;
      grid-gap: 10px;
      margin-top: 10px;
      max-width: 500px;
    }

    .new-whitelist {
      display: grid;
      grid-template-columns: 1fr 80px;
      margin-top: 10px;
      max-width: 500px;

      .input {
        width: calc(100% - 10px);
      }

      .new-items-list {
        grid-column-start: 1;
        grid-column-end: 4;

        padding-top: 10px;

        .item {
          padding: 5px 0;
        }
      }

      .error-alert {
        max-width: 500px;
        margin-bottom: 10px;
        grid-column-start: 1;
        grid-column-end: 4;
      }
    }

    .action-container {
      display: grid;
      grid-template-columns: 1fr 50px 1fr 1fr;
      column-gap: 15px;

      .action-move {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        font-size: 34px;

        padding-top: 40px;

        i {
          margin: 5px 0;

          transition: all .2s ease-in;           

          &:hover {
            cursor: pointer;
            color: #409EFF;
            background-color: #f5f7fa;
          }
        }
      }

      .header {
        font-weight: 500;
        font-size: 20px;
        text-align: center;
        margin: 0;
        padding: 5px 0;
      }

      .action {
        border: 1px solid #e4e7ed;
        .header {
          background-color: #f5f7fa;
        }

        .action-select {
          width: 100%;
          overflow-y: hidden;

          border: 0;

          &:hover {
            cursor: pointer;
          }

          outline: none;
          option {
            min-height: 30px;
            display: flex;
            align-items: center;
            padding-left: 5px;
          }
        }
      }
    }
  }
</style>
