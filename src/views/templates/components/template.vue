<template>
  <div class="template-container" v-loading="loading.page">
    <div class="header" v-if="template">
      <div class="header__name" v-loading="loading.name">
        <div class="view" v-show="!editing.name">
          {{ template.name }}

          <el-button
            class="icon-btn btn--edit"
            icon="el-icon-edit"
            type="text"
            @click="handleEditClick('name')"
          />
        </div>

        <div class="edit" v-show="editing.name">
          <div class="input-v" :data-error-msg="nameError === nameErrorMsg ? nameErrorMsg : ''">
            <el-input
              v-model.trim="editing._name"
              class="edit__input"
              @keyup.enter.native="handleEditSubmitClick('name')"
            />
          </div>

          <el-button
            class="icon-btn btn--submit"
            icon="el-icon-check"
            type="text"
            @click="handleEditSubmitClick('name')"
          />

          <el-button
            class="icon-btn btn--close"
            icon="el-icon-close"
            type="text"
            @click="handleEditCloseClick('name')"
          />
        </div>
      </div>

      <div class="header__description" v-loading="loading.description">
        <div class="view" v-show="!editing.description" :class="{'text--muted': template.description.length === 0}">
          {{ template.description || 'no description' }}

          <el-button
            class="icon-btn btn--edit"
            icon="el-icon-edit"
            type="text"
            @click="handleEditClick('description')"
          />
        </div>

        <div class="edit" v-show="editing.description">
          <el-input
            v-model="editing._description"
            class="edit__input"
            size="mini"
            @keyup.enter.native="handleEditSubmitClick('description')"
          />

          <el-button
            class="icon-btn btn--submit"
            icon="el-icon-check"
            type="text"
            @click="handleEditSubmitClick('description')"
          />

          <el-button
            class="icon-btn btn--close"
            icon="el-icon-close"
            type="text"
            @click="handleEditCloseClick('description')"
          />
        </div>
      </div>
    </div>

    <el-button class="back-to-list-btn" size="mini" @click="$router.push('/templates/list')">
      <i class="el-icon-arrow-left"></i> Back
    </el-button>

    <div class="tabs-container" style="margin-top:10px;">
      <el-tabs type="border-card" v-loading="loading.tabs">
        <el-tab-pane label="Threatlist">
          <file-transfer
            :data="actionFiles"
            @transfer="handleThreatlistTransfer"
          ></file-transfer>
        </el-tab-pane>

        <el-tab-pane label="Servers">
          <div class="container" style="display:grid; grid-template-columns:500px 1fr; grid-gap: 20px;">
            <div class="list-container">
              <h2 class="header header--list">Servers</h2>

              <select
                v-if="template"
                v-model="selected.servers"
                class="server-select"
                :size="Math.max(Math.min(template.applied_to_servers.length, 10), 5)"
                multiple
              >
                <option v-for="server in template.applied_to_servers" :key="server.id" :value="server.id">
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
              Select server to apply the template
            </div>
          </div>

          <div class="new-server">
            <el-select 
              filterable
              v-model="newElement.serversList" 
              multiple 
              placeholder="Choose servers to include into template" 
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

        <el-tab-pane label="Server groups">
          <div class="container" style="display:grid; grid-template-columns:500px 1fr; grid-gap: 20px;">
            <div class="list-container">
              <h2 class="header header--list">Server groups</h2>

              <select
                v-if="template"
                v-model="selected.serverGroups"
                class="server-select"
                :size="Math.max(Math.min(template.applied_to_server_groups.length, 10), 5)"
                multiple
              >
                <option v-for="server in template.applied_to_server_groups" :key="server.id" :value="server.id">
                  {{ server.name }}
                </option>
              </select>

              <div class="footer">
                <el-button type="text" class="del-btn" @click="removeServerGroups" :disabled="selected.serverGroups.length === 0">
                  <i class="el-icon-delete"></i>
                </el-button>
              </div>
            </div>

            <div class="help-text">
              Select server group to apply the template
            </div>
          </div>

          <div class="new-server">
            <el-select 
              filterable
              v-model="newElement.serverGroupsList" 
              multiple 
              placeholder="Choose server groups to include into template" 
              size="mini"
            >
              <el-option
                v-for="group in serverGroupsList"
                :key="group.server_group_id"
                :value="group.server_group_id"
                :label="group.name">
              </el-option>
            </el-select>

            <el-button type="success" size="mini" @click="addServerGroup" :disabled="!newElement.serverGroupsList.length">ADD</el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import handleError from '@/utils/errorHandler.js'
import SPPCloudApi from '@/api/cloud-api.js'

export default {
  data () {
    return {
      template: null,

      id: null,

      loading: {
        page: false,
        name: false,
        description: false,
        tabs: false
      },

      editing: {
        name: false,
        _name: '',

        description: false,
        _description: ''
      },

      actionFiles: {
        used: [],
        available: []
      },

      selected: {
        servers: [],
        serverGroups: []
      },

      serversList: [],
      serverGroupsList: [],

      nameErrorMsg: '',

      newElement: {
        server: false,
        serverName: '',
        serversList: [],

        serverGroup: false,
        serverGroupName: '',
        serverGroupsList: []
      },

      errMessage: null
    }
  },

  mounted () {
    this.id = this.$route.params['id']

    this.getTemplate()
  },

  beforeDestroy () {
    if (this.errMessage) {
      this.errMessage.close()
    }
  },

  computed: {
    nameError () {
      const name = this.editing._name

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

  components: {
    FileTransfer: () => import('@/components/FileTransfer/index.vue')
  },

  methods: {
    getTemplate () {
      this.loading.page = true

      SPPCloudApi
        .getTemplate(this.id)
        .then(r => {
          this.template = r.data.result
          this.loading.page = false

          try {
            this.actionFiles.used = this.convert(r.data.result.action_files_used)
            this.actionFiles.available = this.convert(r.data.result.action_files_available)
          } catch (e) {
            console.log(e)
          }

          this.updateServersList()
          this.updateServerGroupsList()
        })
        .catch(e => {
          this.errMessage = handleError(this, e)
        })
    },

    handleEditClick (field) {
      this.editing[field] = true
      this.editing['_' + field] = this.template[field]
    },

    handleEditCloseClick (field) {
      this.editing[field] = false
    },

    handleEditSubmitClick (field) {
      if (field === 'name' && this.nameError !== '') {
        this.nameErrorMsg = this.nameError

        return
      }

      this.loading[field] = true

      const payload = {}
      payload[field] = this.editing['_' + field]

      SPPCloudApi
        .updateTemplate(this.id, payload)
        .then(r => {
          this.template[field] = this.editing['_' + field]
          this.loading[field] = false
          this.handleEditCloseClick(field)
        })
        .catch(e => {
          this.errMessage = handleError(this, e)
          this.loading[field] = false
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

    handleThreatlistTransfer (direction, payload) {
      this.loading.tabs = true

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
        .updateTemplate(this.id, _payload)
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
          this.loading.tabs = false
        })
        .catch(e => {
          console.log(JSON.parse(JSON.stringify(e)))
          
          this.errMessage = handleError(this, e)
          this.loading.tabs = false
        })
    },

    updateServersList () {
      SPPCloudApi
        .getShortServerList()
        .then(r => {
          r.forEach(el => {
            if (!this.template.applied_to_servers.some(item => item.id === el.server_id)) {
              this.serversList.push(el)
            }
          })
        })
    },

    updateServerGroupsList () {
      SPPCloudApi
        .getShortGroupList()
        .then(r => {
          r.forEach(el => {
            if (!this.template.applied_to_server_groups.some(item => item.id === el.server_group_id)) {
              this.serverGroupsList.push(el)
            }
          })
        })
    },

    removeServers () {
      this.$confirm('Are you sure you want delete these servers?')
        .then(_ => {
          this.template.applied_to_servers.filter(el => this.selected.servers.indexOf(el.id) !== -1).forEach(el => {
            this.serversList.push({
              server_id: el.id,
              name: el.name
            })
          })
  
          let newList = this.template.applied_to_servers.filter(el => this.selected.servers.indexOf(el.id) === -1)
          
          newList = newList.map(el => el.id)
  
          this.loading.tabs = true
  
          SPPCloudApi
            .updateTemplate(this.id, {applied_to_servers: newList})
            .then(r => {
              this.template.applied_to_servers = this.template.applied_to_servers.filter(el => this.selected.servers.indexOf(el.id) === -1)
              this.selected.servers = []

              this.loading.tabs = false
            })
            .catch(e => {
              this.errMessage = handleError(this, e)

              this.loading.tabs = false
            })
        })
    },

    addServer () {
      this.loading.tabs = true
      let newData = [...this.newElement.serversList]

      this.template.applied_to_servers.forEach(el => {
        newData.push(el.id)
      })

      SPPCloudApi
        .updateTemplate(this.id, {applied_to_servers: newData})
        .then(r => {
          if (r.data.messages.length) {
            const messages = r.data.messages

            this.errMessage = handleError(this, messages[0].context.reason)
          } else {
            this.newElement.serversList.forEach(el => {
              const name = this.serversList.filter(item => item.server_id === el)[0].name
    
              this.template.applied_to_servers.push({
                id: el,
                name: name
              })
            })
    
            this.serversList = this.serversList.filter(el => {
              return this.newElement.serversList.indexOf(el.server_id) === -1
            })
    
            this.newElement.serversList = []    
          }

          this.loading.tabs = false
        })
        .catch(e => {
          this.errMessage = handleError(this, e)
          this.loading.tabs = false
        })
    },

    removeServerGroups () {
      this.$confirm('Are you sure you want delete these server groups?')
        .then(_ => {
          this.template.applied_to_server_groups
            .filter(el => this.selected.serverGroups.indexOf(el.id) !== -1)
            .forEach(el => {
              this.serverGroupsList.push({
                server_group_id: el.id,
                name: el.name
              })
          })
  
          let newList = this.template.applied_to_server_groups.filter(el => this.selected.serverGroups.indexOf(el.id) === -1)
          
          newList = newList.map(el => el.id)
  
          this.loading.tabs = true
  
          SPPCloudApi
            .updateTemplate(this.id, {applied_to_server_groups: newList})
            .then(r => {
              this.template.applied_to_server_groups = this.template.applied_to_server_groups.filter(el => this.selected.serverGroups.indexOf(el.id) === -1)
              this.selected.serverGroups = []

              this.loading.tabs = false
            })
            .catch(e => {
              this.errMessage = handleError(this, e)

              this.loading.tabs = false
            })
        })
    },

    addServerGroup () {
      this.loading.tabs = true
      let newData = [...this.newElement.serverGroupsList]

      this.template.applied_to_server_groups.forEach(el => {
        newData.push(el.id)
      })

      SPPCloudApi
        .updateTemplate(this.id, {applied_to_server_groups: newData})
        .then(r => {
          if (r.data.messages.length) {
            const messages = r.data.messages

            this.errMessage = handleError(this, messages[0].context.reason)
          } else {
            try {
              this.newElement.serverGroupsList.forEach(el => {
                const name = this.serverGroupsList.filter(item => item.server_group_id === el)[0].name
      
                this.template.applied_to_server_groups.push({
                  id: el,
                  name: name
                })
              })
      
              this.serverGroupsList = this.serverGroupsList.filter(el => {
                return this.newElement.serverGroupsList.indexOf(el.server_group_id) === -1
              })
      
              this.newElement.serverGroupsList = []    
            } catch (e) {
              console.log(e)
            }
          }
          
          this.loading.tabs = false
        })
        .catch(e => {
          this.errMessage = handleError(this, e)
          this.loading.tabs = false
        })
    },
  }
}
</script>

<style lang="scss" scoped>
.header {
  &__name {
    height: 40px;

    .view {
      font-size: 24px;
      font-weight: bold;
    }

    .icon-btn {
      font-size: 24px;
    }
  }

  &__description {
    .icon-btn {
      font-size: 18px;
    }
  }

  &__name,
  &__description {
    .edit {
      display: flex;
      align-items: center;
      max-width: 300px;
    }
  }

  .icon-btn {
    // font-size: 18px;
    margin-left: 10px;

    &.btn--close {
      color: red;
    }

    &.btn--submit {
      color: green;
    }
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

.del-btn {
  color: red;

  &.is-disabled {
    color: #c0c4cc;
  }
}
</style>