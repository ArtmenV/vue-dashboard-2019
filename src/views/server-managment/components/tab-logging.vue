<template>
  <div class="logging" v-loading="isLoading">
    <div class="checkbox-container">
      <div class="container">
        <el-checkbox
          v-model="isLoggingCheckbox"
          @change="updateLogging"
        > 
          Enable Server Statistics (Logging)
        </el-checkbox>
      </div>

      <div class="log-forwarding">
        <el-checkbox
          @change="handlerForwarding"
          v-model="isLogForwardCheckbox"
          class="settings-container__checkbox https__checkbox"
          style="margin-left: 20px;"
          :disabled="!logForwardingData.log_forwarding_server || !logForwardingData.log_forwarding_port"
        >
          Enable Log Forwarding
        </el-checkbox>
        <div v-if="!logForwardingData.log_forwarding_server || !logForwardingData.log_forwarding_port">
          <div class="not-confirmed-emails">

            <el-tooltip class="item" effect="dark" placement="top">
              <div class="question-mark"></div>

              <div slot="content" class="content">
                You must fill in the IP address/FQDN and Port fields
                <br>
                <div class="content-line">
                  to activate Log Forwarding
                </div>
              </div>
            </el-tooltip>
          </div>
        </div>
      </div>
    </div>

    <div class="edit-word">
      <div 
        class="edit-container" 
        v-if="isEditWordLogging"
      >
        <div class="input-container">
          <div class="description">
            Enter IP address or FQDN
          </div>
          <div class="input-item">
            <el-input 
              class="name-input"
              placeholder="enter IP/FQDN"
              size="small" 
              v-model.trim="inputID"
            />
            <small style="color: red">{{ fieldinputIDError }}</small>
          </div>
          
          <div class="container-item">
            <div class="row">
              <div class="description">
                Port #
              </div>
              <el-input 
                class="name-input"
                placeholder="enter port"
                size="small" 
                v-model.trim="inputPort"
              />

              <el-button 
                class="submit-btn" 
                type="text" 
                @click="handlerForwarding"
              >
                <i class="el-icon-check"></i>
              </el-button>

              <el-button 
                class="close-btn" 
                type="text" 
                @click="handleEditClose"
              >
                <i class="el-icon-close"></i>
              </el-button>
            </div>
            <small style="color: red">{{ fieldinputPortError }}</small>
          </div>
        </div>
      </div>

      <!-- before edit section -->
      <div class="edit-word" v-else>
        <div class="input-container">
          <div class="description edit">
            Enter IP address or FQDN
          </div>

          <div class="view-mode">
            <span class="name" @click="handleEdit">
              {{ inputID || 'IP address/FQDN' }}
            </span>
          </div>

          <div class="description edit">
            Port #
          </div>

          <div class="view-mode" @click="handleEdit">
            <span class="name">
              {{ inputPort || 'Port' }}
            </span>
          </div>
        </div>

        <el-button 
          class="edit-btn" 
          size="small" 
          type="text" 
          @click="handleEdit"
        >
          <h2>
            <i class="el-icon-edit" />
          </h2>
        </el-button>
      </div>
    </div>

    <el-alert
      v-if="logForwardUpdateError.length != 0"
      type="error"
      :title="successMessage"
    />

    <!-- disabled -->
    <!-- <div class="edit-word" v-else>
      <div class="input-container">
        <div class="description description-silver">
          Enter IP address or FQDN
        </div>

        <div class="view-mode">
          <span class="name-silver">
            {{ inputID || 'IP address/FQDN ' }}
          </span>
        </div>

        <div class="description description-silver">
          Port #
        </div>

        <div class="view-mode">
          <span class="name-silver">
            {{ inputPort || 'Port' }}
          </span>
        </div>
      </div>

      <el-button 
        class="edit-btn" 
        size="small" 
        type="text" 
        :disabled="true"
      >
        <h2>
          <i class="el-icon-edit" />
        </h2>
      </el-button>
    </div> -->
  </div>
</template>

<script>
  import SPPCloudApi from '@/api/cloud-api.js'
  import store from '@/store/index.js'
  import baseUrl from "@/api/config"
  import axios from 'axios'
  export default {
    props: [
      'server', 
      'serverId', 
      'isLogging', 
      'selected',
      'sslCheckbox',
      'findWord',
      'replaceWord', 
      'youTubeCheckbox',
      'funCheckbox', 
      'currentTimeData', 
      'currentTimeManualEditing',
      'logForwardingData',
      'serverCanvasBlock'
    ],
    data () {
      return {
        isLoading: false,
        isLoggingCheckbox: false,
        isEditWordLogging: false,

        isLogForwardCheckbox: false,
        isServerCanvasBlock: false,

        inputID: '',
        inputPort: '',

        logForwardUpdateError: '',

        fieldinputPortError: '',
        fieldinputIDError: '',

        savedIpAdress: '',
        savedPort: ''
      }
    },

    methods: {
      handleEdit() {
        this.isEditWordLogging = true
  
        this.savedIpAdress = this.inputID
        this.savedPort = this.inputPort
      },

      handleEditClose() {
        this.isEditWordLogging = false
        this.inputID = this.savedIpAdress
        this.inputPort = this.savedPort
        this.fieldinputIDError = ''
        this.fieldinputPortError = ''
      },

      async handlerForwarding() {
        this.fieldinputIDError = ''
        this.fieldinputPortError = ''

        const dataIP4 = this.inputID ? this.inputID.match(/^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/) : ''
        const dataIP6 = this.inputID ? this.inputID.match(/(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))/) : ''
        const dataSite = this.inputID ? this.inputID.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g) : ''
        const dataPort = this.inputPort ? this.inputPort.match(/^\d+$/) : ''
        if (
          this.inputID.length >= 6
          && (dataIP4 && dataPort || dataIP6 && dataPort || dataSite && dataPort)
          && this.inputPort.length < 10
          ) {
            this.logForwardUpdateError = ''
            this.isLoading = true
            const config = {
              headers: 
                {
                  'Authorization': "bearer " + store.getters.token,
                  'Content-Type': 'application/json'
                }
              }
            const data = {
              log_forwarding : this.isLogForwardCheckbox,
              port : this.inputPort,
              server : this.inputID
            }
            try {
              const { data: { result } } = await axios.patch(
                baseUrl + `/api/frontend/v1/server/${this.serverId}/log-forwarding`,
                data,
                config
              )
              this.isLoading = false
              this.$emit('updateServer')
            } catch(e) {
              this.logForwardUpdateError = e.message
            } finally {
              this.isLoading = false
            }
              this.isEditWordLogging = false
              this.fieldinputIDError = ''
              this.fieldinputPortError = ''
        } else {

          if (this.inputPort.trim()) {
            
            if (!dataPort) {
              this.fieldinputPortError = 'only number'
            } else if (this.inputPort.trim().length > 9) {
              this.fieldinputPortError = 'the maximum is 9 characters'
            } else {
              this.fieldinputPortError = ''
            }
          } else {
            this.fieldinputPortError = 'is required'
          }

          //? input id
          if (this.inputID.length >= 6) {
            if ((dataIP4 || dataIP6 || dataSite)) {
              this.fieldinputIDError = ''
            } else if ((!dataIP4 || !dataIP6 || !dataSite)) {
              this.fieldinputIDError = 'only URL/IPv4/IPv6'
            }
          } else {
            this.fieldinputIDError = 'is required min 6 characters'
          }
        }
      },

      updateLogging () {
        let timeDate
        
        this.isLoading = true
        this.$emit('loadingLogging', true)
        if (this.currentTimeData.includes('min')) {
          if (this.currentTimeData === 'Manual (min)') {
            timeDate = parseFloat(this.currentTimeManualEditing)
          } else {
            timeDate = parseFloat(this.currentTimeData)
          }
        }
        if (this.currentTimeData.includes('h')) {
          const timeMine = parseFloat(this.currentTimeData)
          timeDate = 60 * timeMine
        }

        const data = {
          https_inspection: this.sslCheckbox,
          logging: this.isLoggingCheckbox,
          sync_frequency: Number(timeDate),
          canvas_blocker: this.isServerCanvasBlock,
          fun_filter: {
            search: this.findWord || "text1",
            replace: this.replaceWord || "text2",
            is_active: this.funCheckbox,
          }
        }

        if (!this.isLoggingCheckbox) {
          this
            .$confirm('Logging data will be completely removed. Are you sure you want to disable logging?')
            .then(_ => {
              this.isLoading = true
              SPPCloudApi
                .setServerSyncSettings(
                  this.serverId, 
                  data
                )
                .then(r => {
                  this.isLoading = false
                  if (this.currentTab == 0) {
                    this.currentTab = '4'
                  }
                  this.$emit('updateServer')
                  this.$emit('loadingLogging', false)
                })
                .catch(e => {
                  // console.log(e)
                  this.server.status = !this.server.status
                  this.isLoading = false
                  this.$emit('loadingLogging', false)
                })
            })
            .catch(_ => {
              this.server.is_logging = !this.server.is_logging
              this.isLoading = false
            })
        } else {
          this.isLoading = true
          SPPCloudApi
            .setServerSyncSettings(
              this.serverId, 
              data
            )
            .then(r => {
              this.isLoading = false
              if (this.currentTab == 0) {
                this.currentTab = '5'
              }
              this.$emit('updateServer')
            })
            .catch(e => {
              this.server.status = !this.server.status
              this.isLoading = false
            })
        }
      },
    },

    mounted() {
      this.isLoggingCheckbox = this.isLogging
      this.isServerCanvasBlock = this.serverCanvasBlock
      
      this.isLogForwardCheckbox = this.logForwardingData.log_forwarding,
      
      this.inputID = this.logForwardingData.log_forwarding_server || '',
      this.inputPort = this.logForwardingData.log_forwarding_port || ''
    },

    watch: {
      isLogging(data) {
        this.isLoggingCheckbox = data
      },
      serverCanvasBlock(data) {
        this.isServerCanvasBlock = data
      },
      logForwardingData(data) {
        this.isLogForwardCheckbox = data.log_forwarding
      },
    }
  }
</script>

<style lang="scss">
.logging {
  .el-input__inner {
    max-width: 170px;
  }
  .el-input {
    position: relative;
    font-size: 14px;
    display: block;
    width: auto; 
  }
}
</style>

<style lang="scss" scoped>
.logging {
  margin-top: .5rem;
  .settings-container {
    &__checkbox {
      margin-left: 0 !important;
      margin: .6rem 0 .2rem 0;
    }
  }

  .checkbox-container {
    display: flex;
    flex-direction: column;
    max-width: 700px;

    .container {
      padding-bottom: 1rem;
      margin-bottom: .5rem;
      border-bottom: 1px solid #d4d4d4;
    }

    .log-forwarding {
      display: flex;
      .not-confirmed-emails {
        padding-top: 11px;
        padding-bottom: 5px;
        margin-left: .7rem;

        .question-mark {
          display: inline-flex;
          // align-self: center;

          padding-top: 2px;
          padding-right: 1px;

          width: 16px;
          height: 16px;

          background: lightgray;

          border-radius: 100%;

          align-items: center;
          justify-content: center;

          cursor: pointer;

          &::before {
            content: "?";
            color: white;
            font-size: 12px;
            font-weight: bold;
            padding-left: 2px;
            padding-right: 1px;
            padding-bottom: 1px;
            // line-height: 16px;
          }
        }
      }
    }
  }

  .content-line {
    margin-top: .9rem;
    line-height: 45;
  }

  .edit-word {
    display: flex;

    .edit-container {
      display: flex;
    }

    .input-container {
      display: flex;
      margin-left: 1.5rem;

      .edit {
        color: #000000 !important;
      }

      .container-item {
        display: flex;
        flex-direction: column;
        margin-top: -1px;

        .row {
          display: flex;
        }

        small {
          margin-left: 3.5rem;
        }
      }

      .input-item {
        margin-right: 1rem;

        small {
          width: 160px;
          word-break: break-all ;
        }
      }

      .description {
        margin-top: .6rem;
        font-size: 14px;
        color: #606266;
        margin-right: 1rem;
      }

      .description-silver {
        color: silver;
      }
    }

    .view-mode {
      margin-right: 1rem;
      margin-top: .4rem;
      
    .name {
      margin-top: .5rem;
      font-size: 14px;
      padding: 0 .4rem .1rem .4rem;
      border-bottom: 1px solid #409EFF;
    }

    .name-silver {
      margin-top: .5rem;
      font-size: 14px;
      color: silver;
      padding: 0 .4rem .1rem .4rem;
      border-bottom: 1px solid silver;
    }

      h4 {
        margin: 0;
      }
    }

    h2 {
      padding: 0px 0;
      margin: -2px 0;
    }

    .close-btn {
      color: red;
      padding: 7px 0;
      i {
        font-size: 18px;
        font-weight: bold;
      }
    }

    .submit-btn {
      color: green;
      margin-left: 8px;
      padding: 7px 0;

      i {
        font-size: 18px;
        font-weight: bold;
      }
    }
  }
  
  .input-edit {
    display: flex;
    justify-content: center;
    align-items: center;
    .manual-field {
      color: #606266;
      margin-left: 1.5rem;
      font-size: 14px;
    }
    .edit-btn {
      margin-right: 1.5rem;
      h2 {
        margin: 0 !important;
        margin-left: 15px;
      }
    }
  }
}
</style>