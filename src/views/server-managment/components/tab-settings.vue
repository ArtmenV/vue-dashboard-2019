<template>
  <div class="settings-container" v-loading="loading">
    <div class="settings-container__item">
      <div class="http-container">
        <div class="settings-title">
          HTTPS Inspection
        </div>

        <el-checkbox
          v-model="sslCheckbox"
          @change="updateSettings"
          class="settings-container__checkbox https__checkbox"
          style="margin-left: 20px;"
        >
          Enable Inspection
        </el-checkbox>
      </div>
      
			<el-checkbox
        v-model="funCheckbox"
        @change="updateSettings"
        class="settings-container__checkbox fun__checkbox"
        style="margin-left: 20px;"
      >
        Enable Fun Filter
      </el-checkbox>

      <!-- //find -->
      <div v-if="funCheckbox">
        <div class="word-container">
          <div class="name-find">
            Replace this
          </div>
          <div class="word-input">
            <div class="view-mode" v-if="!isEditFindWord">
              <div class="view-container">
                <span class="name" @click="handleEditFindWord">
                  {{ findWord || 'text1' }}
                </span>
              </div>

              <el-button 
                class="edit-btn" 
                size="small" 
                type="text" 
                @click="handleEditFindWord"
              >
                <h2><i class="el-icon-edit"></i></h2>
              </el-button>
            </div>

            <div class="edit-word" v-else>
              <div class="input-container">
                <div class="input-v">
                  <el-input 
                    class="find-word-input"
                    placeholder="single word"
                    size="small" 
                    @keyup.enter.native="handleEditFindWordSubmit" 
                    v-model.trim="findWord"
                  />
                </div>
                <small style="color: red">{{ erorrFind }}</small>
              </div>
              <el-button class="submit-btn" type="text" @click="handleEditFindWordSubmit">
                <i class="el-icon-check"></i>
              </el-button>

              <el-button class="close-btn" type="text" @click="handleEditFindWordClose">
                <i class="el-icon-close"></i>
              </el-button>
            </div>
          </div>

          <!-- //replace -->
          <div class="word-container">
            <div class="name-find">
              within this
            </div>

            <div class="word-input">
              <div class="view-mode" v-if="!isEditReplaceWord">
                <div class="view-container">
                  <span class="name" @click="handleEditReplaceWord">
                    {{ replaceWord || 'text2' }}
                  </span>
                </div>

                <el-button class="edit-btn" size="small" type="text" @click="handleEditReplaceWord">
                  <h2><i class="el-icon-edit"></i></h2>
                </el-button>
              </div>

              <div class="edit-word" v-else>
                <div class="input-container">
                  <div class="input-v">
                    <el-input 
                      class="name-input"
                      placeholder="single word"
                      size="small" 
                      @keyup.enter.native="handleEditReplacedWordSubmit" 
                      v-model.trim="replaceWord"
                    />
                  </div>
                  <small style="color: red">{{ erorrReplace }}</small>
                </div>

                <el-button class="submit-btn" type="text" @click="handleEditReplaceWordSubmit">
                  <i class="el-icon-check"></i>
                </el-button>

                <el-button class="close-btn" type="text" @click="handleEditReplaceWordClose">
                  <i class="el-icon-close"></i>
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- disabled fin section -->
      <div v-if="!funCheckbox">
        <div class="word-container">
          <div class="name-find silver">
            Replace this
          </div>
          <div class="word-input">
            <div class="view-mode" v-if="!isEditFindWord">
              <div class="view-container">
                <span class="name-silver">
                  {{ findWord || 'text1' }}
                </span>
              </div>

              <el-button 
                class="edit-btn"
                size="small" 
                type="text" 
                @click="handleEditFindWord"
                :disabled="true"
              >
                <h2><i class="el-icon-edit"></i></h2>
              </el-button>
            </div>

            <div class="edit-word" v-else>
              <div class="input-container">
                <div class="input-v">
                  <el-input 
                    class="find-word-input"
                    placeholder="single word"
                    size="small" 
                    @keyup.enter.native="handleEditFindWordSubmit" 
                    v-model.trim="findWord"
                  />
                </div>
                <small style="color: red">{{ erorrFind }}</small>
              </div>
              <el-button class="submit-btn" type="text" @click="handleEditFindWordSubmit">
                <i class="el-icon-check"></i>
              </el-button>

              <el-button class="close-btn" type="text" @click="handleEditFindWordClose">
                <i class="el-icon-close"></i>
              </el-button>
            </div>
          </div>

          <!-- //replace -->
          <div class="word-container">
            <div class="name-find silver">
              within this
            </div>

            <div class="word-input">
              <div class="view-mode" v-if="!isEditReplaceWord">
                <div class="view-container">
                  <span class="name-silver">
                    {{ replaceWord || 'text2' }}
                  </span>
                </div>
                <el-button 
                  class="edit-btn" 
                  size="small" 
                  type="text" 
                  @click="handleEditReplaceWord"
                  :disabled="true"
                >
                  <h2>
                    <i class="el-icon-edit" />
                  </h2>
                </el-button>
              </div>

              <div class="edit-word" v-else>
                <div class="input-container">
                  <div class="input-v">
                    <el-input 
                      class="name-input"
                      placeholder="single word"
                      size="small" 
                      @keyup.enter.native="handleEditReplacedWordSubmit" 
                      v-model.trim="replaceWord"
                    />
                  </div>
                  <small style="color: red">{{ erorrReplace }}</small>
                </div>

                <el-button class="submit-btn" type="text" @click="handleEditReplaceWordSubmit">
                  <i class="el-icon-check"></i>
                </el-button>

                <el-button class="close-btn" type="text" @click="handleEditReplaceWordClose">
                  <i class="el-icon-close"></i>
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- block -->
      <el-alert
        class="error"
        v-if="settingsError.length != 0"
        type="error"
        :title="settingsError"
      />
    </div>

    <!-- time sync -->
    <div>
      <div class="settings-title synch">
        Sync Interval
      </div>

      <div class="description">
        The amount of time in minutes your server will check for cloud updates
      </div>

      <div class="sync-container">
        <el-select
          v-model="currentTimeData"
          @change="updateSettings"
          default-first-option
          placeholder="Choose or write time"
        >
          <el-option
            v-for="item in timeData"
            :key="item.id"
            :label="item.label"
            :value="item.label"
          >
          </el-option>
        </el-select>

        <div class="edit-mode" v-if="editPutManuallySync">
          <div class="input-v">
            <el-input 
              v-model="editTimeSync"
              @keyup.enter.native="handleEditTimeSyncSubmit"
              placeholder="1"
              class="name-input" 
              size="small"  
            />
            <small v-if="editTimeSyncError" class="input-error">
              {{ editTimeSyncError }}
            </small>
          </div>

          <el-button class="submit-btn" type="text" @click="handleEditTimeSyncSubmit">
            <i class="el-icon-check"></i>
          </el-button>

          <el-button class="close-btn" type="text" @click="handleEditNameClose">
            <i class="el-icon-close"></i>
          </el-button>
        </div>
        
        <div v-if="editPutManuallySync === false">
          <div class="input-edit">
            <div class="manual-field">
              {{ currentTimeManualEditing }}
            </div>
              <el-button 
                class="edit-btn" 
                size="small" 
                type="text" 
                @click="openFildEdit"
              >
                <h2>
                  <i class="el-icon-edit" />
                </h2>
              </el-button>
            </div>
        </div>
      </div>
    </div>

    <el-alert
      class="error"
      v-show="settingsFrequencyError.length != 0"
      type="error"
      :title="settingsFrequencyError"
    />

  </div>
</template>

<script>
  import baseUrl from "@/api/config"
  import store from '@/store/index.js'
  import axios from 'axios'
  import SPPCloudApi from '@/api/cloud-api.js'
  import handleError from '@/utils/errorHandler.js'
  import prettyDate from '@/utils/prettyDate.js'

  export default {
    props: [
      'serverId', 
      'server', 
      'isLogging',

      'sslCheckboxProps',
      'findWordProps',
      'replaceWordProps', 
      'youTubeCheckboxProps',
      'funCheckboxProps', 
      'currentTimeDataProps', 
      'currentTimeManualEditingProps',
      'editTimeSyncProps',
      'editPutManuallySyncProps',
      'serverSettngsData'
    ],

    data () {
      return {
        loading: false,
        currentTab: this.tab,

        serverName: {
          editing: false,
          newName: '',
        },

        errMessage: null,

        editing: {
          description: false,
          newDescription: ''
        },

        //tab-setting
				sslCheckbox: false,
				funCheckbox: false, 
        youTubeCheckbox: false,

				findWord: '',
        replaceWord: '',
        erorrFind: '',
        erorrReplace: '',
        
				isEditFindWord: false,
				isEditReplaceWord: false,

        settingsError: '',
        settingsFrequencyError: '',
        currentTimeManualEditing: '',
        editPutManuallySync: null,
        editTimeSyncError: '',
        editTimeSync: '',

        currentTimeData: '1 min',
        timeData: [
        {
          id: 2,
          label: '1 min',
          // value: 1
        },
        {
          id: 3,
          label: '5 min',
          // value: 5
        },
        {
          id: 4,
          label: '30 min',
          // value: 30
        },
        {
          id: 5,
          label: '60 min',
          // value: 360
        },
        {
          id: 6,
          label: '8 h',
          // value: 28800
        },
        {
          id: 7,
          label: '24 h',
          // value: 86400
        },
        {
          id: 8,
          label: 'Manual (min)',
          // value: 86400
        },
        ]
      }
    },

    mounted () {
      this.sslCheckbox = this.sslCheckboxProps,
      this.findWord = this.findWordProps
      this.replaceWord = this.replaceWordProps
      this.youTubeCheckbox = this.youTubeCheckboxProps
      this.funCheckbox = this.funCheckboxProps
      this.currentTimeData = this.currentTimeDataProps
      this.currentTimeManualEditing = this.currentTimeManualEditingProps
      this.editTimeSync = this.editTimeSyncProps
      this.editPutManuallySync = this.editPutManuallySyncProps
    },

    components: {
      FileTransfer: () => import('@/components/FileTransfer/index.vue')
    },

    methods: {
      async updateSettings () {
        let timeDate
        
        if (this.currentTimeData === 'Manual (min)' && !this.currentTimeManualEditing) {
          this.editPutManuallySync = true
          return
        }
        this.loading = true
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
          logging: this.isLogging,
          sync_frequency: Number(timeDate),
          canvas_blocker: this.serverSettngsData.canvas_blocker,
          fun_filter: {
            search: this.findWord || "text1",
            replace: this.replaceWord || "text2",
            is_active: this.funCheckbox,
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
          this.loading = false
          this.editPutManuallySync = false
					this.editTimeSync = ''
          this.editTimeSyncError = ''
          const timeNew = result.sync_frequency
          if (timeNew === 1 || timeNew === 5 || timeNew === 30 || timeNew === 60 || timeNew === 480 || timeNew === 1440) {
            this.editPutManuallySync = null
          }
        } catch(e) {
          this.settingsFrequencyError = e.message
          this.loading = false
        }
      },

      updateLogging () {
        let timeDate
        
        if (this.currentTimeData === 'Manual (min)' && !this.currentTimeManualEditing) {
          this.editPutManuallySync = true
          return
        }
        this.loading = true
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
          logging: this.server.is_logging,
          sync_frequency: Number(timeDate),
          canvas_blocker: this.serverSettngsData.canvas_blocker,
          fun_filter: {
            search: this.findWord || "text1",
            replace: this.replaceWord || "text2",
            is_active: this.funCheckbox,
          }
        }

        if (!this.server.is_logging) {
          this
            .$confirm('Logging data will be completely removed. Are you sure you want to disable logging?')
            .then(_ => {
              this.loading = true
              SPPCloudApi
                .setServerSyncSettings(
                  this.serverId, 
                  data
                )
                .then(r => {
                  this.loading = false
                  if (this.currentTab == 0) {
                    this.currentTab = '4'
                  }
                  this.$emit('settingsInfo')
                  this.$emit('loadingLogging', false)
                })
                .catch(e => {
                  console.log(e)
                  this.server.status = !this.server.status
                  this.loading = false
                  this.$emit('loadingLogging', false)
                })
            })
            .catch(_ => {
              this.server.is_logging = !this.server.is_logging
            })
        } else {
          this.loading = true
          SPPCloudApi
            .setServerSyncSettings(
              this.serverId, 
              data
            )
            .then(r => {
              this.loading = false
              if (this.currentTab == 0) {
                this.currentTab = '4'
              }
              this.$emit('settingsInfo')
            })
            .catch(e => {
              console.log(e)
              this.server.status = !this.server.status
              this.loading = false
            })
        }
      },

      async handleEditTimeSyncSubmit () {
        if (this.editTimeSync === '') {
          this.editTimeSyncError = `Field is empty`
          return
        }

        const regex = this.editTimeSync.match(/\D/g)

        if ( Number(this.editTimeSync) > 1440 || regex && regex.length >= 0) {
          this.editTimeSyncError = 'You can put integers from 1 to 1440 only'
          return
        }

        this.loading = true

        const timeDate = this.editTimeSync
        const data = {
          https_inspection: this.sslCheckbox,
          logging: this.server.is_logging,
          sync_frequency: Number(timeDate),
          canvas_blocker: this.serverSettngsData.canvas_blocker,
          fun_filter: {
            search: this.findWord || "text1",
            replace: this.replaceWord || "text2",
            is_active: this.funCheckbox,
          }
        }
        const timeSet = this.editTimeSync
        const config = {
          headers: 
            {
              'Authorization': "bearer " + store.getters.token,
              'Content-Type': 'application/json'
            }
          }
        try {
          const response = await axios.put(
            baseUrl + `/api/frontend/v1/server/${this.serverId}/settings`,
            data,
            config
          )
          this.$emit('settingsInfo')
          this.loading = false
          this.editPutManuallySync = false
          this.editTimeSync = ''
          this.currentTimeManualEditing = +timeDate + ' min'
        } catch(e) {
          this.settingsFrequencyError = 'Request failed'
          this.loading = false
        }
      },

      handleEditNameClose () {
        this.currentTimeData = '1 min'
        this.updateSettings()
        this.getSettingsInfo()
      },

      openFildEdit () {
        this.editPutManuallySync = true
			},
			
			handleEditFindWord () {
        this.isEditFindWord = true
        this.savedFindWord = this.findWord
			},
			
			handleEditFindWordClose () {
        this.isEditFindWord = false
        this.findWord = this.savedFindWord
      },
      
      handleEditReplaceWord () {
        this.isEditReplaceWord = true
        this.savedReplaceWord = this.replaceWord
      },

      handleEditReplaceWordClose () {
        this.isEditReplaceWord = false
        this.replaceWord = this.savedReplaceWord
      },

      handleEditReplaceWordSubmit () {
        this.erorrReplace = ''
        if (!this.replaceWord.length) {
          this.erorrReplace = 'is required'
          return
        } else if (this.findWord === this.replaceWord) {
          this.erorrReplace = 'They are both equal'
          return
        }
        this.isEditReplaceWord = false
        if (this.replaceWord.length && this.findWord.length && this.funCheckbox) {
          this.updateSettings()
        }
      },

      handleEditFindWordSubmit () {
        this.erorrFind = ''
        if (!this.findWord.length) {
          this.erorrFind = 'is required'
          return
        } else if (this.findWord === this.replaceWord) {
          this.erorrFind = 'They are both equal'
          return
        }
        this.isEditFindWord = false
        if (this.replaceWord.length && this.findWord.length && this.funCheckbox) {
          this.updateSettings()
        }
      }
    },

    watch: {
      currentTimeData (data) {
        if (data === '1 min' 
        || data === '5 min'
        || data === '30 min'
        || data === '60 min'
        || data === '8 h'
        || data === '24 h'
        ) {
          this.editPutManuallySync = null
        }
      },

      sslCheckboxProps(data) {
        this.sslCheckbox = data
      },

      findWordProps(data) {
        this.findWord = data
      },

      replaceWordProps(data) {
        this.replaceWord = data
      },

      youTubeCheckboxProps(data) {
        this.youTubeCheckbox = data
      },

      funCheckboxProps(data) {
        this.funCheckbox = data
      },

      currentTimeDataProps(data) {
        this.currentTimeData = data
      },

      currentTimeManualEditingProps(data) {
        this.currentTimeManualEditing = data
      },

      editTimeSyncProps(data) {
        this.editTimeSync = data
      },

      editPutManuallySyncProps(data) {
        this.editPutManuallySync = data
      }
    }
}
</script>

<style lang="scss">
.settings-container {
  .el-input--suffix .el-input__inner {
    width: 170px;
  }
  .settings-container__checkbox {
    width: 200px;
  }

  .el-input__inner {
    height: 35px;
  }
  .el-input__suffix {
    top: 3px;
  }
  .el-button--small, .el-button--small.is-round {
    padding: 5px 5px;
}
  .el-button {
    margin: 0 !important;
    margin-left: .6rem !important;
  }
  .is-reverse {
    padding-bottom: 8px;
    line-height: 25px;
  }
}
</style>

<style lang="scss" scoped>
	.settings-container {
		font-size: 16px;
			&__item {
				display: flex;
				flex-direction: column;
				max-width: 650px;
				margin-top: 5px;
				padding-bottom: 1rem;
				border-bottom: 1px rgb(212, 212, 212) solid;

        .http-container {
          padding-bottom: 1rem;
          border-bottom: 1px solid #d4d4d4;
          margin-bottom: .4rem;
        }

        .https__checkbox {
          max-width: 165px;
        }

        .fun__checkbox {
          max-width: 110px;
        }

				.word-container {
          display: flex;
					margin-left: 25px;

          &-replace {
            display: flex;
            align-items: center;
          }
					.word-input {
            .input-v {
              max-width: 120px
            }

            .edit-word {
              display: flex;
              align-items: flex-start;

              .input-container {
                display: flex;
                flex-direction: column;
              }
            }
						.view-mode {
              display: flex;
              padding-bottom: -19px !important;

              h2 {
                margin: 0 !important;
                margin-left: 15px;
                margin-right: 35px;
              }

              .view-container {
                margin-top: .4rem;
                .name {
                  margin-right: .3rem;
                  border-bottom: 1px solid #409EFF;
                  font-size: 14px;
                  padding: 0 8px 2px 8px;
                };
              }

              .name-silver {
                margin-right: .3rem;
                color: silver;
                border-bottom: 1px solid silver;
                font-size: 14px;
                padding: 0 8px 2px 8px;
              }

              h4 {
                margin: 0 !important;
              }
							.edit-btn {
                margin-top: .1rem !important;
							}
						}
					}
				}

				.close-btn {
					color: red;
					padding: 7px 0;
          margin-right: 1.2rem !important;
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

				.name-container {
					display: flex;
					align-items: center;
					margin-left: 2rem;
				}

				.name-find {
					font-size: 14px;
					margin-right: 1rem;
					margin-top: .6rem;
					// margin-bottom: 15px;
					color: black;
				}
        .silver {
          color: silver;
        }
			}

			.separator {
				width: 100%;
				height: 15px;
				background-color: black;
			}

	.sync-container {
		display: flex;

		.edit-mode {
			display: flex;
			align-items: start;
			margin-left: 12px;

			.input-error {
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
	}

		.error {
			max-width: 240px;
			margin-top: 1rem;
		}

		&__checkbox {
			margin-left: 0 !important;
			margin-top: .6rem;
		}

		.settings {
			&-content,
			&-title {
				margin: 3px 0;
				display: flex;
				align-items: center;
				font-weight: bold;
			}
		}

		.settings__select {
			width: 180px;
			height: 25px;
		}

		.synch {
			margin: 1.4rem 0 0rem 0;
		}

    .description {
      margin: .5rem 0 .8rem 0;
      font-size: 14px;
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
