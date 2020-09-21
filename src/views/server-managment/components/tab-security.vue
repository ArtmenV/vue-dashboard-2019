<template>
  <div class="security" v-loading="isLoading">
    <div class="checkbox-container">
      <el-checkbox
        v-model="isMaxLengthURL"
        @change="handleMaxLengthURL"
        class="settings-container__checkbox"
        style="margin-left: 20px;"
      >
        Enable Maximum URL Length Filter
      </el-checkbox>
    </div>

    <div class="url-container">
      <div 
        v-if="isMaxLengthURL && isEditMaxURL"
        class="edit-mode" 
        >
        <div class="input-v">
          <div class="description-edit">
            Maximum URL Length
          </div>
          <div class="input-container">
            <el-input 
              v-model="maxUrlLength"
              @keyup.enter.native="isEditMaxURL"
              placeholder="from 200 to 2000"
              class="name-input" 
              size="small"  
            />
            <!-- <div v-if="editMaxURLError.length" class="input-error">
              {{ editMaxURLError }}
            </div> -->
            <small style="color: red">{{ editMaxURLError }}</small>
          </div>
          
        </div>

        <el-button 
          class="submit-btn" 
          type="text" 
          @click="handleEditMaxURLSubmit"
        >
          <i class="el-icon-check"></i>
        </el-button>

        <el-button 
          class="close-btn" 
          type="text" 
          @click="handleEditMaxUrlClose"
        >
          <i class="el-icon-close"></i>
        </el-button>
      </div>
      
      <div v-if="isMaxLengthURL && !isEditMaxURL">
        <div class="edit-mode not-edit-mode">
          <div class="description">
            Maximum URL Length
          </div>
          <div class="manual-field">
            {{ maxUrlLength || '300' }}
          </div>
          <el-button 
            class="edit-btn" 
            size="small" 
            type="text" 
            @click="handleMaxURLEdit"
          >
            <h2>
              <i class="el-icon-edit" />
            </h2>
          </el-button>
        </div>
      </div>

      <!-- disabled -->
      <div v-if="!isMaxLengthURL && !isEditMaxURL">
        <div class="edit-mode not-edit-mode">
          <div class="description silver-description">
            Maximum URL Length
          </div>
          <div class="silver-field">
            {{ maxUrlLength || '300' }}
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
        </div>
      </div>
    </div>

    <el-alert
      type="error"
      class="error-alert"
      v-if="editMaxURLError"
      :title="editMaxURLError"
      :closable="true"
    /> 

    <!-- //whitelist -->
    <div v-if="isMaxLengthURL">
      <div class="row">
        <div class="whitelist-container">
          <h2 class="header header--list">
            Whitelist
          </h2>

          <select
            v-model="selected.whitelist"
            multiple 
            class="site-select" 
            :size="Math.max(Math.min(whitelistUrlLengthData.data.length, 10), 5)"
          >
            <option
              v-for="action in whitelistUrlLengthData.data"
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
            Add domains to avoid blocking by this filter
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
          :disabled="!whitelistNew"
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

    <!-- //disabled -->
    <div v-else>
      <div class="row">
        <div class="whitelist-container">
          <h2 class="header header--list header-silver">
            Whitelist
          </h2>

          <select
            v-model="whitelist"
            multiple 
            class="site-select" 
            :size="Math.max(Math.min(whitelistUrlLengthData.data.length, 10), 5)"
            disabled="true"
          >
            <option
              v-for="action in whitelistUrlLengthData.data"
              :key="action.id"
              class="action-option"
              :class="{'active': selected.whitelist.indexOf(action.value) !== -1}">
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
            Add domains to avoid blocking by this filter
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
      urlLengthData: {
        type: Object,
        required: false
      },
      whitelistUrlLengthData: {
        type: Object,
        required: false
      },

    },

    data () {
      return {
        isMaxLengthURL: false,
        isEditMaxLength: false,

        maxUrlLength: '',
        savedMaxUrlLength: '',

        isLoading: false,

        isEditMaxURL: false,
        editMaxURLError: '',

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
      this.isMaxLengthURL = this.urlLengthData.url_length_filter
      this.maxUrlLength = this.urlLengthData.max_url_length
    },

    methods: {
      async handleMaxLengthURL() {
          this.editMaxURLError = ''
          this.isLoading = true

          const newData = {
            enableLengthFilter: this.isMaxLengthURL,
            maxUrlLength: Number(this.maxUrlLength) || 300
          }
          
          try {
            const response = await SPPCloudApi.updateMaxUrlLength(this.serverId, newData)

            this.$emit('updateServerInfo')
            this.editMaxURLError = ''
            this.isEditMaxURL = false
            this.isLoading = false
            if(!this.maxUrlLength) {
              this.maxUrlLength = 300
            }
          } catch(e) {
            if ( e.response.data.messages[0].context) {
              if (e.response.data.messages[0].context['server_url_length_filter_d_t_o.max_url_length']) {
                this.editMaxURLError = e.response.data.messages[0].context['server_url_length_filter_d_t_o.max_url_length'].reason
              } else if (e.response.data.messages[0].context['server_url_length_filter_d_t_o.enable_length_filter']) {
                this.editMaxURLError = e.response.data.messages[0].context['server_url_length_filter_d_t_o.enable_length_filter'].reason
              }
            
          } else {
            this.editMaxURLError = e.message
          }
            this.isLoading = false
          } finally {
            this.isLoading = false
          }
      },

      handleMaxURLEdit() {
        this.isEditMaxURL = true
        this.savedMaxUrlLength = this.maxUrlLength
      },

      async handleEditMaxURLSubmit() {
        this.editMaxURLError = ''
        if (!this.maxUrlLength.length) {
          this.editMaxURLError = 'is required'
        } else if (!this.maxUrlLength.match(/^\d+$/)) {
          this.editMaxURLError = 'only digit from 200 to 2000'
        } else if (this.maxUrlLength < 200 || this.maxUrlLength > 2000) {
          this.editMaxURLError = 'only digit from 200 to 2000'
        } else {
          this.isLoading = true

          const newData = {
            enableLengthFilter: this.isMaxLengthURL,
            maxUrlLength: Number(this.maxUrlLength)
          }

          try {
            const response = await SPPCloudApi.updateMaxUrlLength(this.serverId, newData)

            this.$emit('updateServerInfo')
            this.editMaxURLError = ''
            this.isEditMaxURL = false
            this.isLoading = false
          } catch(e) {
            if ( e.response.data.messages[0].context) {
              if (e.response.data.messages[0].context['server_url_length_filter_d_t_o.max_url_length']) {
                this.editMaxURLError = e.response.data.messages[0].context['server_url_length_filter_d_t_o.max_url_length'].reason
              } else if (e.response.data.messages[0].context['server_url_length_filter_d_t_o.enable_length_filter']) {
                this.editMaxURLError = e.response.data.messages[0].context['server_url_length_filter_d_t_o.enable_length_filter'].reason
              }
            } else {
              this.editMaxURLError = e.message
            }
            this.isLoading = false
          } finally {
            this.isLoading = false
          }
        }
      },

      handleEditMaxUrlClose () {
        this.isEditMaxURL = false
        this.maxUrlLength = this.savedMaxUrlLength
        this.editMaxURLError = ''
      },

      whitelistRemove () {
        this.$confirm('Are you sure to delete this items?')
          .then(_ => {
            this.isLoading = true

            let newData = this.whitelistUrlLengthData.data
            .filter(el => this.selected.whitelist.indexOf(el.value) === -1)
            
            newData.map(el => el.id)


            SPPCloudApi
              .setWhitelist(this.whitelistUrlLengthData.id, newData)
              .then(r => {
                this.whitelistUrlLengthData.data = this.whitelistUrlLengthData.data.filter(el => this.selected.whitelist.indexOf(el.value) === -1)
    
                this.selected.whitelist = []
                this.isLoading = false
              })
              .catch (e => {
                this.errMessage = handleError(this, e)
                this.isLoading = false
              })

          })
          .catch(_ => {})
      },

      whitelistAdd () {
        if (this.isNewWhitelistItemValid) {
          let newWhitelist = [...this.whitelistUrlLengthData.data]

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

          this.isLoading = true
          SPPCloudApi
            .setWhitelist(this.whitelistUrlLengthData.id, newWhitelist)
            .then(r => {
              this.whitelistUrlLengthData.data = JSON.parse(JSON.stringify(r.data.result.data))
      
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
      urlLengthData(data) {
        this.isMaxLengthURL = data.url_length_filter
        this.maxUrlLength = this.urlLengthData.max_url_length
      },
    }
  }
</script>
<style lang="scss">
</style>
<style lang="scss" scoped>
.security {

  .error-alert {
    margin: -.5rem 0 .8rem;
    max-width: 240px;
  }
  .url-container {
    margin-bottom: 1rem;
    .edit-mode {
      display: flex;
      align-items: start;
      margin-left: 24px;
      .input-v {
        display: flex;

        .input-container {
          display: flex;
          flex-direction: column;
        }
      }
        .description {
          display: flex;
          font-size: 14px;
          color: #606266;
          margin: 0 .7rem 0 0;
        }

        .description-edit {
          display: flex;
          padding-top: .45rem;
          font-size: 14px;
          color: #606266;
          margin: 0 .7rem 0 0;
        }
      
        .silver-description {
          color: silver;
        }

        .manual-field {
          color: #606266;
          padding: 0 7px 3px 7px;
          border-bottom: 1px solid #409EFF;
          margin-right: 1rem;
        }

        .silver-field {
          color: silver;
          padding: 0 7px 3px 7px;
          border-bottom: 1px solid silver;
          margin-right: 1rem;
        }

        .edit-btn {
          padding: 0 !important;
          margin: 0 !important;
          h2 {
            padding: 0 !important;
            margin: 0 !important;
          }
        }

        .input-error {
          font-size: 12px;
          color: red;
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
        margin-left: 10px;
        padding: 7px 0;

        i {
          font-size: 18px;
          font-weight: bold;
        }
      }
    }
    .not-edit-mode {
      margin-top: .45rem;
    }
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
			margin: .6rem 0 .2rem 0;
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
