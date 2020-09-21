<template>
  <div class="container">
    <el-button class="back-to-list" size="mini" @click="$router.push(backPath)">
      <i class="el-icon-arrow-left"></i> Back
    </el-button><br/>

    <div class="action-file" v-loading="loading">
      <h1 class="header" v-if="state === 'edit'">
        Edit threatlist
      </h1>
      <h1 class="header" v-else>
        Threatlist
      </h1>

      <div class="view" v-if="actionFile && state === 'view'">
        <div class="view__filename">
          <strong>Filename: </strong> {{ actionFile.name }}
        </div>

        <div class="view__filename">
          <strong>Environment: </strong> {{ getEnvironment(actionFile.environment) }}
        </div>

        <div class="view__version">
          <strong>Selected version: </strong> {{ actionFile.selected_version }}
        </div>

        <div class="view__timestamp" v-if="actionFile.selected_version_date">
          <strong>Selected version date: </strong> {{ prettyDate(actionFile.selected_version_date, 's') }}
        </div>
        
        <div class="view__version">
          <strong>Latest version: </strong> {{ actionFile.latest_version }}
        </div>

        <div class="view__timestamp" v-if="actionFile.latest_version_date">
          <strong>Latest version date: </strong> {{ prettyDate(actionFile.latest_version_date, 's') }}
        </div>

        <div class="view__description">
          <strong>Description: </strong>
          <span :class="{'text-muted': actionFile.description.length == 0}">
            {{ actionFile.description || 'no desrciption' }}
          </span>
        </div>

        <div class="view__applied-to-servers" v-if="!actionFile.is_global && actionFile.applied_to_servers.length > 0">
          <strong>Applied to servers: </strong>
          <div class="tag-container">
            <el-tag
              class="server-tag"
              size="mini"
              v-for="server in actionFile.applied_to_servers"
              :key="server.id"
              @click.native="$router.push('/servers/' + server.id)">
              {{ server.name }}
            </el-tag>
          </div>
        </div>

        <div class="view__applied-to-server-groups" v-if="!actionFile.is_global">
          <strong>Applied to server group: </strong>
          <div class="tag-container">
            <el-tag
              class="group-tag"
              v-for="group in actionFile.applied_to_server_groups"
              @click.native="$router.push('/server-groups/' + group.id + '?back=' + $route.path)"
              size="mini"
              :key="group.id">
              {{ group.name }}
            </el-tag>
          </div>
        </div>

        <div class="view__threats" v-if="typeof actionFile.data !== 'string'">
          <el-table 
            :data="actionFile.data" 
            :header-cell-style="style.headerCell"
            :cell-style="style.tableCell"
          >
            <el-table-column prop="value" label="Threat"></el-table-column>

            <el-table-column prop="note" label="Note"></el-table-column>
          </el-table>
        </div>

        <div v-else class="view__threats threats--rawfile">{{actionFile.data}}</div>

        <el-button size="mini" type="primary" class="edit-btn" @click="state = 'edit'" v-if="!actionFile.is_global">
          Edit
        </el-button>
      </div>

      <div class="edit" v-if="actionFile && state === 'edit'">
        <strong>Filename: </strong>

        <div class="input-v" :data-error-msg="nameError === nameErrorMsg ? nameErrorMsg : ''">
          <el-input v-model.trim="actionFileEditing.name" />
        </div>

        <strong>Description: </strong>
        <el-input v-model="actionFileEditing.description"></el-input>

        <strong>Version: </strong>
        <el-select v-model="actionFileSelectedVersion">
          <el-option
            v-for="version in actionFile.latest_version"
            :key="version"
            :value="version"
            :label="version">
          </el-option>
        </el-select>

        <strong>Environment</strong>

        <el-select v-model="actionFileEditing.environment" placeholder="Select environment">
          <el-option
            label="None"
            :value="null"
          />

          <el-option
            label="Business"
            :value="0"
          />

          <el-option
            label="Home"
            :value="1"
          />
        </el-select>

        <el-table 
          class="edit__threats" 
          :data="actionFileEditing.data"
          :header-cell-style="style.headerCell"
          :cell-style="style.tableCell"
        >
          <el-table-column
            label="Threat"
            prop="value"
          >
          </el-table-column>

          <el-table-column
            label="note"
            prop="note">
          </el-table-column>

          <el-table-column
            label=""
            width="43"
            class="centerize">
            <template slot-scope="scope">
              <el-button style="color: red;" class="remove-btn" type="text" @click.native.prevent="deleteThreat(scope.$index)">
                <i class="el-icon-circle-close-outline"></i>
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="edit__new-threat">
          <el-input class="input" v-model="newThreat.value" placeholder="Threat"></el-input>
          <el-input class="input" v-model="newThreat.note" placeholder="Note"></el-input>
          <el-button class="btn" type="text" @click="threatAdd" :disabled="!newThreat.value">
            <i class="el-icon-circle-plus-outline"></i>
          </el-button>

          <el-alert
            type="error"
            class="error-alert"
            style="grid-column: 1 / 4"
            v-if="threatAddError.length > 0"
            :title="threatAddError"
            :closable="false"
          />
        </div>

        <el-button class="btn-cancel" type="primary-outline" @click="state = 'view'" size="mini">
          Cancel
        </el-button>

        <el-button class="btn-save" type="primary" @click="handleSave" size="mini" :disabled="!hasActionFileChanged">
          Save
        </el-button>        
      </div>
    </div>
  </div>
</template>

<script>
  import SPPCloudApi from '@/api/cloud-api.js'
  import prettyDate from '@/utils/prettyDate.js'
  import handleError from '@/utils/errorHandler.js'

  export default {
    data () {
      return {
        state: 'view',
        loading: true,
        actionFile: null,
        actionFileEditing: null,
        actionFileSelectedVersion: null,
        
        threatAddError: '',

        newThreat: {
          value: '',
          note: ''
        },

        id: null,

        nameErrorMsg: '',

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

    props: [
      'actionFileId',
      'defaultState'
    ],

    computed: {
      hasActionFileChanged () {
        return JSON.stringify(this.actionFile) != JSON.stringify(this.actionFileEditing)
      },

      backPath () {
        if (this.$route.query && this.$route.query.back) {
          return this.$route.query.back
        } else {
          return '/action-files/list'
        }
      },

      isNewThreatValid: function () {
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
        
        return validUrl(this.newThreat.value)
      },

      nameError () {
        const name = this.actionFileEditing.name

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

    watch: {
      actionFileSelectedVersion (val) {
        if (val !== this.actionFile.selected_version) {
          this.loading = true
          SPPCloudApi
            .selectActionFileVersion(this.id, val)
            .then(r => {
              this.actionFile = JSON.parse(JSON.stringify(r.data.result))
              this.actionFileEditing = JSON.parse(JSON.stringify(r.data.result))
              this.loading = false
              this.actionFileSelectedVersion = r.data.result.selected_version
              this.loading = false
            })
        }
      }
    },

    beforeDestroy () {
      if (this.errMessage) {
        this.errMessage.close()
      }
    },

    mounted () {
      this.state = this.defaultState

      this.id = this.$route.params['id']

      this.getActionFileInfo()
    },

    methods: {
      getEnvironment (env) {
        switch (env) {
          case 0: return 'Business'
          case 1: return 'Home'
          case null: return 'None'
          default: return 'unknown'
        }
      },

      getActionFileInfo () {
        SPPCloudApi
          .getActionFileInfo(this.id)
          .then(r => {
            this.actionFile = JSON.parse(JSON.stringify(r))
            this.actionFileEditing = JSON.parse(JSON.stringify(r))
            this.loading = false
            this.actionFileSelectedVersion = r.selected_version
          })
          .catch (e => {
            this.errMessage = handleError(this, e)
          })
      },

      deleteThreat (index) {
        this.actionFileEditing.data.splice(index, 1)
      },

      threatAdd () {
        if (this.isNewThreatValid) {
          this.actionFileEditing.data.push(Object.assign({}, this.newThreat))
          this.newThreat.value = ''
          this.newThreat.note = ''
          this.threatAddError = ''
        } else {
          this.threatAddError = 'Invalid URL'
        }
      },

      prettyDate: prettyDate,

      handleSave () {
        let payload
        if (JSON.stringify(this.actionFileEditing.data) !== JSON.stringify(this.actionFile.data)) {
          payload = {
            'name': this.actionFileEditing.name,
            'description': this.actionFileEditing.description,
            'data': this.actionFileEditing.data,
            'environment': this.actionFileEditing.environment
          }
        } else {
          payload = {
            'name': this.actionFileEditing.name,
            'description': this.actionFileEditing.description,
            'environment': this.actionFileEditing.environment
          }
        }

        if (this.nameError === '') {
          this.loading = true
          SPPCloudApi
            .setActionFileSettings(this.id, payload)
            .then(r => {
              this.actionFile = JSON.parse(JSON.stringify(r.data.result))
              this.actionFileEditing = JSON.parse(JSON.stringify(r.data.result))
              this.actionFile.latest_version = r.data.result.latest_version
              this.actionFile.latest_version_date = r.data.result.latest_version_date
              this.actionFile.selected_version = r.data.result.selected_version
              this.actionFile.selected_version_date = r.data.result.selected_version_date
              this.actionFileSelectedVersion = r.data.result.selected_version
              this.state = 'view'
              this.loading = false
            })
            .catch (e => {
              this.loading = false
              if (e.response.data.messages[0].context.reason) {
                return this.$message({
                  type: 'error',
                  message: e.response.data.messages[0].context.reason,
                  showClose: true,
                  duration: 0,
                  iconClass: ''
                })
              } else {
                this.errMessage = handleError(this, e)
              }

              if (this.errMessage) {
                this.errMessage.close()
              }
            })
        } else {
          this.nameErrorMsg = this.nameError
        }
      }
    }
  }
</script>

<style lang="scss">
  .action-file {
    .el-table td {
      padding: 7px 0;
    }
  }

  .edit__threats {
    .el-table td {
      padding: 2px 0;
    }

    .remove-btn {
      padding: 0;
      transform: translateY(2px)
    }
  }
</style>

<style lang="scss" scoped>
  .container {
    display: flex;
    flex-direction: column;

    max-width: 600px;

    .text-muted {
      user-select: none;
      color: lightgrey
    }
    
    .action-file {
      i {
        font-size: 20px;
      }
    }

    .centerize {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .back-to-list {
      max-width: 120px;
    }

    .header {
      font-size: 24px;
      font-weight: 500;

      .state {
        text-transform: uppercase;
      }
    }

    .view {
      display: grid;
      
      grid-template-columns: 1fr;
      grid-gap: 10px;      

      .edit-btn {
        width: 70px;
        margin-left: auto;
      }

      &__threats {
        margin: 10px 0;
      }

      &__filename,
      &__version,
      &__timestamp,
      &__description,
      &__applied-to-servers,
      &__applied-to-server-groups {
        display: grid;
        grid-template-columns: 200px 1fr;

        .group-tag,
        .server-tag {
          margin-right: 10px;

          &:hover {
            cursor: pointer;
          }
        }
      }

      .threats--rawfile {
        white-space: pre-wrap;
        overflow: scroll;

        padding: 10px;
        border-radius: 5px;
        background-color: whitesmoke;

        font-family: monospace;

        max-height: 500px;
      }
    }

    .edit {
      display: grid;
      grid-template-columns: 180px 1fr;
      grid-gap: 10px;
      grid-row-gap: 15px;

      strong {
        height: 100%;
        display: flex;
        align-items: center;
      }

      &__global {
        margin: 5px 0;
      }

      &__threats {
        grid-column-start: 1;
        grid-column-end: 3;
      }

      &__new-threat {
        grid-column-start: 1;
        grid-column-end: 3;

        display: grid;
        grid-template-columns: 1fr 1fr 43px;
      }

      .btn-save {
        grid-column-start: 2;
        grid-column-end: 2;

        margin-left: auto;
        margin-top: 15px;

        min-width: 75px;
      }

      .btn-cancel {
        grid-column-start: 1;
        grid-column-end: 1;

        margin-top: 15px;
      }
    }
  }
</style>

