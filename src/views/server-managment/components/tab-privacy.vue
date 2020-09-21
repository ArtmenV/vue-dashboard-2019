<template>
  <div class="privacy" v-loading="isLoading">
    <div class="checkbox-container">
      <el-checkbox
        v-model="isPrivacyBlocker"
        @change="handlerBlocker"
        class="settings-container__checkbox https__checkbox"
        style="margin-left: 20px;"
      >
        Enable Browser Canvas Blocker
      </el-checkbox>
    </div>

    <el-alert
      class="errorCheckbox"
      v-if="errorPrivacyBlockerCheckbox.length"
      type="error"
      :title="errorPrivacyBlockerCheckbox"
    />

    <div v-if="isPrivacyBlocker">
      <div class="row">
        <div class="whitelist-container">
          <h2 class="header header--list">
            Whitelist for canvas blocker
          </h2>

          <select
            v-model="selected.whitelist"
            multiple 
            class="site-select" 
            :size="Math.max(Math.min(server.whitelist_canvas_blocker.data.length, 10), 5)"
          >
            <option
              v-for="action in server.whitelist_canvas_blocker.data"
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
        <div class="notifcation">
          Tip: 
          <div class="description">
            Add domains to avoid banking software being blocked
          </div>
        </div>
      </div>

      <div class="new-element">
        <el-alert
          type="error"
          class="error-alert"
          v-if="whitelistAddingErrorMsg"
          :title="whitelistAddingErrorMsg"
          :closable="false"
        />          

        <el-input
          class="input"
          type="textarea"
          :autosize="{ minRows: 2 }"
          v-model="whitelistNew"
          @keyup.enter.native="addWhitelist"
          size="mini" 
        />

        <el-button
          type="success"
          size="mini"
          @click="whitelistAdd"
          class="submit-btn"
        >
        <!-- :disabled="!whitelistNew" -->
          Submit
        </el-button>

        <div class="new-items-list">
          <div 
            class="item"
            v-for="(item, index) in whitelistNewItems"
            :key="index"
          >
            {{ item }}
          </div>
        </div>
      </div>
    </div>

    <!-- //disabled -->
    <div v-else>
      <div class="row">
        <div class="whitelist-container">
          <h2 class="header header--list header-silver">
            Whitelist for canvas blocker
          </h2>

          <select
            v-model="whitelist"
            multiple 
            class="site-select" 
            :size="Math.max(Math.min(server.whitelist_canvas_blocker.data.length, 10), 5)"
            disabled="true"
          >
            <option
              v-for="action in server.whitelist_canvas_blocker.data"
              :key="action.id"
              class="action-option"
            >
              {{ action.value }}
            </option>
          </select>

          <div class="footer">
            <el-button type="text" @click="whitelistRemove" :disabled="true" class="del-btn">
              <i class="el-icon-delete"></i>
            </el-button>

            <el-button type="text" @click="whitelistUploadCSV" disabled>
              <i class="el-icon-upload"></i>
            </el-button>
          </div>
        </div>
        <div class="notifcation header-silver">
          Tip:
          <div class="description">
            Add domains to avoid banking software being blocked
          </div>
        </div>
      </div>

      <div class="new-element">
        <el-alert
          type="error"
          class="error-alert"
          v-if="whitelistAddingErrorMsg"
          :title="whitelistAddingErrorMsg"
          :closable="false"
        />          

        <el-input
          class="input"
          type="textarea"
          :autosize="{ minRows: 2 }"
          v-model="whitelistNew"
          @keyup.enter.native="addWhitelist"
          size="mini"
          :disabled="true"
        />

        <el-button
          type="success"
          size="mini"
          @click="whitelistAdd"
          :disabled="true"
          class="submit-btn"
        >
          Submit
        </el-button>

        <div class="new-items-list">
          <div 
            class="item"
            v-for="(item, index) in whitelistNewItems"
            :key="index"
          >
            {{ item }}
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
  import baseUrl from "@/api/config"
  import store from '@/store/index.js'
  import SPPCloudApi from '@/api/cloud-api.js'
  import handleError from '@/utils/errorHandler.js'
  import axios from 'axios'
  export default {
    props: {
      server: {
        type: Object,
        requred: true
      },
      serverId: {
        type: Number | String,
        required: false
      },
      isLogging: {
        type: Boolean,
        required: false
      },
      serverSettngsData: {
        type: Object,
        required: false
      }
    },

    data () {
      return {
        isPrivacyBlocker: false,
        isLoading: false,

        errorPrivacyBlockerCheckbox: '',

        whitelist: [],
        whitelistAddingErrorMsg: '',
        whitelistNew: '',
        whitelistNewItems: [],

        show: {
          whitelistAdding: false,
        },

        selected: {
          action: {
            used: [],
            available: []
          },
          whitelist: []
        },
      }
    },

    mounted () {
      this.isPrivacyBlocker = this.serverSettngsData.canvas_blocker
    },

    methods: {
      async handlerBlocker () {
        this.isLoading = true
        this.errorPrivacyBlockerCheckbox = ''

          const data = {
            https_inspection: this.serverSettngsData.https_inspection,
            logging: this.serverSettngsData.logging,
            sync_frequency: this.serverSettngsData.sync_frequency,
            canvas_blocker: this.isPrivacyBlocker,
            fun_filter: {
              search: this.serverSettngsData.fun_filter.search || "text1",
              replace: this.serverSettngsData.fun_filter.replace || "text2",
              is_active: this.serverSettngsData.fun_filter.is_active,
            }
          }
          const config = {
            headers: 
              {
                'Authorization': "bearer " + store.getters.token,
                'Content-Type': 'application/json'
              }
            }
        try {
          const {data : { result }} = await axios.put(
            baseUrl + `/api/frontend/v1/server/${this.serverId}/settings`,
            data,
            config
          )
          this.$emit('settingsInfo')
          this.isLoading = false
        } catch(e) {
          this.isLoading = false
          if ( e.response.data.messages[0].context) {
            this.errorPrivacyBlockerCheckbox = e.response.data.messages[0].context['settings_dto.logging'].reason
          } else {
            this.errorPrivacyBlockerCheckbox = e.message
          }
        }
      },

      whitelistRemove () {
        this.$confirm('Are you sure to delete this items?')
          .then(_ => {
            this.isLoading = true

            let newData = this.server.whitelist_canvas_blocker.data
              .filter(el => this.selected.whitelist.indexOf(el.value) === -1)

            newData.map(el => el.id)
            
            SPPCloudApi
              .setWhitelist(this.server.whitelist_canvas_blocker.id, newData)
              .then(r => {
                this.server.whitelist_canvas_blocker.data = 
                  this.server.whitelist_canvas_blocker.data
                    .filter(el => this.selected.whitelist.indexOf(el.value) === -1)
    
                this.selected.whitelist = []
                this.isLoading = false
                this.$emit('updateServerInfo')
              })
              .catch (e => {
                this.errMessage = handleError(this, e)
              })

          })
          .catch(_ => {})
      },

      whitelistAdd () {
        if (this.isNewWhitelistItemValid) {
          this.isLoading = true
          let newWhitelist = [...this.server.whitelist_canvas_blocker.data]

          // , {value: this.whitelistNew}

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
            .setWhitelist(this.server.whitelist_canvas_blocker.id, newWhitelist)
            .then(r => {
              this.server.whitelist.data = JSON.parse(JSON.stringify(r.data.result.data))

              this.$emit('updateServerInfo')
      
              this.whitelistNew = ''
              this.whitelistNewItems = []    
              this.whitelistAddingErrorMsg = ''
      
              this.show.whitelistAdding = false
              this.isLoading = false
            })
            .catch (e => {
              this.errMessage = handleError(this, e)
              this.isLoading = false
            })

        } else {
          this.whitelistAddingErrorMsg = 'Incorrect URL'
        }
      },

      whitelistUploadCSV () {
        // ...
      },
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
    },

    watch: {

    }
  }
</script>

<style lang="scss">

</style>

<style lang="scss" scoped>
.privacy {
  .errorCheckbox {
    margin-bottom: 1rem;
    max-width: 280px;
  }
  .row {
    display: flex;

    .header-silver {
      color: silver;
    } 

    .notifcation {
      margin: .4rem 0 0 1rem;
      font-weight: 500;
      font-size: 20px;

      .description {
        margin-top: .4rem;
        font-size: 14px;
      }
    }
  }

  .settings-container {
		&__checkbox {
			margin-left: 0 !important;
			margin: .6rem 0 .8rem 0;
		}
	}

  .whitelist-container {
    border: 1px solid #e4e7ed;
    min-width: 420px;

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

      .del-btn {
        color: red;

        &.is-disabled {
          color: #c0c4cc;
        }
      }
    }
  }

  .new-element {
    display: grid;
    grid-template-columns: 1fr 80px;
    margin-top: 10px;
    max-width: 420px;

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

    .submit-btn {
      margin-bottom: auto;
    }

    .error-alert {
      max-width: 420px;
      margin-bottom: 10px;
      grid-column-start: 1;
      grid-column-end: 4;
    }
  }
}
</style>
