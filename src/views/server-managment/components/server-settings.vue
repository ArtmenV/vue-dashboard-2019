<template>
  <div class="server-container">

    <div v-loading="loading" class="pageheader" v-if="server">
      <el-tag 
        class="pageheader__status"
        :type="server.status ? 'success' : 'danger'"
        size="default">
        {{ server.status ? 'SYNC ON' : 'SYNC OFF' }}
      </el-tag>
      
      <div class="pageheader__server-name">
        <div class="view-mode" v-if="!serverName.editing">
          <h1 class="name" @click="handleEditNameClick">
            {{ server.name }}
          </h1>

          <el-button class="edit-btn" size="small" type="text" @click="handleEditNameClick">
            <h2><i class="el-icon-edit"></i></h2>
          </el-button>
        </div>

        <div class="edit-mode" v-else>
          <div class="input-v" :data-error-msg="nameError === nameErrorMsg ? nameErrorMsg : ''">
            <el-input class="name-input" size="small" @keyup.enter.native="handleEditNameSubmit" v-model.trim="serverName.newName"/>
          </div>

          <el-button class="submit-btn" type="text" @click="handleEditNameSubmit">
            <i class="el-icon-check"></i>
          </el-button>

          <el-button class="close-btn" type="text" @click="handleEditNameClose">
            <i class="el-icon-close"></i>
          </el-button>
        </div>
      </div>

      <!-- <div class="pageheader__server-groups" style="margin-left: auto;" v-if="server.group.length">
        Server groups: 
        <span class="group" v-for="(group, index) in server.group" :key="group.id">
          {{ group.name + (index === server.group.length - 1 ? '' : ', ') }}
        </span>
      </div> -->
    </div>

    <div v-if="server" class="server-ip" style="display:flex;align-items:center;">
      {{ server.ip }}

      <el-checkbox
        v-if="server"
        style="margin-left: 20px;"
        v-model="server.status"
        @change="updateServerSynchronization"
      >
        Enable Server Synchronization
      </el-checkbox>
    </div>

    <el-button
      class="back-to-list-btn"
      size="mini"
      @click="goBack"
    >
      <i class="el-icon-arrow-left"></i> Back
    </el-button>

    <!-- Tabs with server statistics, settings and information -->
    <el-tabs v-loading="loading" v-model="currentTab" type="border-card">
            <!-- @change="updateSettings" -->

      <!-- Statistics -->
      <el-tab-pane 
        v-loading="isLoadingStatistic"
        element-loading-spinner="el-icon-loading"
        element-loading-text="Please wait. Statistics is loading"
        element-loading-background="rgba(250, 250, 250, 0.8)"
        label="Statistics"
        :disabled="!server || !server.is_logging"
      >
        <div class="sync-container">
          <div class="sync-interval">
            <div class="settings-title synch">
            Sync Interval Chart Display
            </div>
            <el-select
              v-model="syncTimeValue"
              default-first-option
              placeholder="Choose or write time"
              @change="handleGenerateDataInterval"
            >
              <el-option
                v-for="item in syncData"
                :key="item.id"
                :label="item.label"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </div>
        </div>

        <div class="stat"> 
          <div class="total-container">
            <el-card v-if="server" style="height:100%;">
              <div class="total" style="height:100%;">
                <div class="grid-container">
                  <div class="header">Threats blocked</div>
                  <svg-icon icon-class="computer" class="icon"/>
                  <div class="blocks-count">
                    {{ totalThreatsBlocked }}
                  </div>
                </div>
              </div>
            </el-card>

            <el-card v-if="server" style="height:100%;" :key="key1">
              <div class="total" style="height:100%;">
                <div class="grid-container">
                  <div class="header">Active connections</div>
                  <svg-icon icon-class="users" class="icon"/>
                  <div class="blocks-count">
                    {{ server.totalActiveUsers ? server.totalActiveUsers : '-' }}
                  </div>
                </div>
              </div>
            </el-card>
          </div>

          <el-card class="top-five" :key="keyJS">
            <div class="graphic-title">
              Threats blocked 
              <!-- for last  -->
              <!-- {{ currentPeriod }} -->
            </div>
            <div v-if="noStatMessage.length > 0" class="no-stat-msg" style="text-align: center">
              {{ noStatMessage }}
            </div>

            <div 
              v-else
              id="chartTop"
              ref="topChart"
              class="top-chart"
              :style="{'width': fixer}"
            >
            </div>
            <div 
              v-if="!noStatMessage.length" 
              class="blocked-container"
            >
              <div class="js-square"></div>
              <div 
                class="js-blocked" 
                style="margin-right: .9rem"
              >
                JavaScript blocked
              </div>
              <div class="other-square"></div>
              <div class="other-blocked">
                Others blocked
              </div>
            </div>
            <div class="sync-info">
              Last sync time: {{ lastTimeSync ? _prettyDate(lastTimeSync) : '---' }}
            </div>
          </el-card>        

          <div class="chart-memory-average">
            <el-card class="load-average" :key="keyLoad">
              <div class="graphic-title">
                Load average 
                <!-- for last  -->
                <!-- {{ currentPeriod }} -->
              </div>
              <div 
                v-if="noStatMessageAverage.length" 
                class="no-stat-msg"
              >
                {{ noStatMessageAverage }}
              </div>

              <div v-else id="chartUsage" ref="chartUsage"></div>

              <div class="sync-info">
                Last sync time: {{ lastTimeSync ? _prettyDate(lastTimeSync) : '---' }}
              </div>
            </el-card>

            <el-card class="memory-graph" :key="keyMemory">
              <div class="graphic-title">
                Memory and Disk usage 
                <!-- for last  -->
                <!-- {{ currentPeriod }} -->
              </div>
              <div v-if="noStatMessageMemory" class="no-stat-msg">
                {{ noStatMessageAverage }}
              </div>

              <div v-else id="chartMemoryUsageId" ref="chartMemoryUsage"></div>

              <div class="sync-info">
                Last sync time: {{ lastTimeSync ? _prettyDate(lastTimeSync) : '---' }}
              </div>
            </el-card>
          </div>
        </div> 
      </el-tab-pane>

      <!-- Threatlist -->
      <el-tab-pane v-if="server" class="threatlist" label="Threatlist">
        <file-transfer
          :data="actionFiles"
          @transfer="handleThreatlistTransfer"
        ></file-transfer>
      </el-tab-pane>

      <!-- Whitelist -->
      <el-tab-pane v-if="server" class="whitelist" label="Whitelist">
        <div class="whitelist-wrapper">
          <div class="whitelist-container">
            <div>
              <h2 class="header header--list">Whitelist</h2>

              <select
                v-model="selected.whitelist"
                multiple 
                class="site-select" 
                :size="Math.max(Math.min(server.whitelist.data.length, 10), 5)"
              >
                <option
                  v-for="action in server.whitelist.data"
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
          </div>
          <div class="notification header-silver">
            Tip:
            <div class="description">
              Add domains to avoid blocking by threatlists
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
            :disabled="!whitelistNew"
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
      </el-tab-pane>

      <el-tab-pane class="info" label="Settings" v-if="server">
        <settings 
          @settingsInfo="() => getSettingsInfo()"
          :key="key1"

          :serverId="serverId"
          :server="server"
          :isLogging="isLogging"

          :sslCheckboxProps="sslCheckbox"
          :findWordProps="findWord"
          :replaceWordProps="replaceWord"
          :youTubeCheckboxProps="youTubeCheckbox"
          :funCheckboxProps="funCheckbox"
          :editTimeSyncProps="editTimeSync"
          :editPutManuallySyncProps="editPutManuallySync"

          :serverSettngsData="serverSettngsData"

          :currentTimeDataProps="currentTimeData"
          :currentTimeManualEditingProps="currentTimeManualEditing"
        />
      </el-tab-pane>

      <el-tab-pane 
        class="info" 
        label="Security" 
        v-if="server"
      >
        <security
          :serverId="serverId"
          :server="server"
          :isLogging="isLogging"
          :selected="selected"
          :urlLengthData="server.url_length_filter"
          :whitelistUrlLengthData="server.whitelist_url_length_filter"
          @updateServerInfo="() => updateServer()"
        />
      </el-tab-pane>

      <el-tab-pane 
        class="info" 
        label="Privacy" 
        v-if="server"
      >
        <privacy
          :serverId="serverId"
          :server="server"
          :isLogging="isLogging"
          @updateServerInfo="() => updateServer()"
          @settingsInfo="() => getSettingsInfo()"
          :selected="selected"
          :serverSettngsData="serverSettngsData"
        />
      </el-tab-pane>

      <el-tab-pane 
        class="info" 
        label="Logging" 
        v-if="server"
      >
        <logging
          :serverId="serverId"
          :server="server"
          :isLogging="isLogging"
          @updateServer="() => updateServer()"
          :selected="selected"
          @loggingValue="loggingValue"

          :sslCheckbox="sslCheckbox"
          :findWord="findWord"
          :replaceWord="replaceWord"
          :funCheckbox="funCheckbox"
          :serverCanvasBlock="serverCanvasBlock"

          :currentTimeData="currentTimeData"
          :currentTimeManualEditing="currentTimeManualEditing"

          :logForwardingData="logForwardingData"
        />

      </el-tab-pane>

      <el-tab-pane 
        label="Reporting" 
        v-if="server"
      >
        <reporting
          :server="server"
        />

      </el-tab-pane>

      <!-- Information -->
      <el-tab-pane v-if="server" class="info" label="Info">
        <div class="info-container">
          <span class="info-title">Host name: </span>
          <span class="info-content">
            {{ server.hostName }}
          </span>

          <span class="info-title">Description: </span>
          <span class="info-content">
            <div class="view" v-if="!editing.description" :class="{'text--muted': server.origin.description.length === 0 }">
              {{ server.origin.description || 'no description' }}

              <el-button type="text" class="icon-btn edit-btn" @click="handleEditDescrClick">
                <i class="el-icon-edit"></i>
              </el-button>
            </div>

            <div class="edit" v-else>
              <el-input v-model="editing.newDescription"  @keyup.enter.native="handleEditDescrSubmit" size="mini"></el-input>

              <el-button type="text" class="icon-btn submit-btn" @click="handleEditDescrSubmit">
                <i class="el-icon-check"></i>
              </el-button>

              <el-button type="text" class="icon-btn close-btn" @click="handleEditDescrClose">
                <i class="el-icon-close"></i>
              </el-button>
            </div>
          </span>

          <span class="info-title">Server ip: </span>
          <span class="info-content">{{ server.ip }}</span>

          <span class="info-title">Server status: </span>
          <span class="info-content">{{ server.status ? 'SYNC ON' : 'SYNC OFF' }}</span>

          <span class="info-title"> {{ server.group.length > 1 ? 'Server groups:' : 'Server group:'}} </span>
          <span class="info-content">
            <span class="group" v-for="(group, index) in server.group" :key="group.id">
              {{ group.name + (index === server.group.length - 1 ? '' : ', ') }}
            </span>
          </span>

          <span class="info-title">Load average: </span>
          <span class="info-content">{{ server.loadAverage }}</span>
          <span class="info-title">Uptime: </span>
          <span class="info-content">{{ server.uptime }}</span>
          <span class="info-title">Last sync: </span>
          <span class="info-content">{{ _prettyDate(lastTimeSync) }}
            <el-tooltip class="item" effect="dark" placement="top">
              <div class="question-mark"></div>
              <div slot="content" class="content">
                Based on time on your device
              </div>
            </el-tooltip>
          </span>

          <span class="info-title">Server uuid: </span>
          <span class="info-content">{{ server.origin.host_uuid }}</span>
        </div>
        <div v-if="server.os_info" class="info-container os-setting"> 
          <span class="info-title">Operation system type: </span>
          <span class="info-content">{{ server.os_info.os }}</span>

          <span class="info-title">Operation system version: </span>
          <span class="info-content">{{ server.os_info.release }}</span>

          <!-- Hypervisor type -->
          <span class="info-title">Virtual server: </span>
          <span class="info-content">{{ getCurrentServerVirtualType }}</span>
          
          <span class="info-title">Type: </span>
          <span class="info-content">{{ getCurrentServerType }}</span>

          <span class="info-title">Arch : </span>
          <span class="info-content">{{ server.os_info.arch }}</span> 

          <span class="info-title">Appliance: </span>
          <span class="info-content">{{ server.os_info.appliance }}</span>  
          <!-- description -->
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import baseUrl from "@/api/config"
  import store from '@/store/index.js'
  import axios from 'axios'
  import c3 from 'c3'
  import SPPCloudApi from '@/api/cloud-api.js'
  import handleError from '@/utils/errorHandler.js'
  import prettyDate from '@/utils/prettyDate.js'

  let chartTop = null
  let chartUsage = null
  let chartMemoryUsageId = null

  let categories = []
  let blocks = []

  let chartData = []
  let chartCategories = []

  export default {
    props: {
      tab: {
        type: String,
        required: false,
        default: '1'
      }
    },

    data () {
      return {
        loading: true,
        isLoadingStatistic: false,
        server: null,

        key1: 1,
        keyMemory: 100,
        keyLoad: 200,
        keyJS: 300,

        graphicData: {},
        lastTimeSync: '',

        // for time interval
        syncTimeValue: 1,
        currentPeriod: '24 hours',
        timeInterval: 24,
        totalThreatsBlocked: null,

        currentTab: this.tab,

        syncValue: 1,
        syncData: [
          {
            id: 1,
            label: '24 hours'
          },
          {
            id: 2,
            label: '7 days'
          },
          {
            id: 3,
            label: '30 days'
          },
        ],

        selected: {
          action: {
            used: [],
            available: []
          },
          whitelist: []
        },

        isLogging: false,

        actionFiles: {
          used: [],
          available: []
        },

        show: {
          whitelistAdding: false,
        },

        nameErrorMsg: '',

        whitelistNew: '',
        whitelistNewItems: [],

        fixer: '99%',
        
        serverId: null,

        serverName: {
          editing: false,
          newName: '',
        },

        whitelistAddingErrorMsg: '',

        errMessage: null,

        noStatMessage: '',
        noStatMessageAverage: '',
        noStatMessageMemory: '',

        // data for chldren component
        sslCheckbox: false,
        findWord: '',
        replaceWord: '',
        youTubeCheckbox: false,
        funCheckbox: false,
        editTimeSync: '',

        currentTimeData: '',
        editPutManuallySync: null,
        currentTimeManualEditing: '',

        editing: {
          description: false,
          newDescription: ''
        },

        serverCanvasBlock: false,

        serverSettngsData: {},

        logForwardingData: {}
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

      nameError () {
        const name = this.serverName.newName

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
      },

      getCurrentServerVirtualType () {
        if ( 
          this.server.os_info.virtual_server === '0' 
        ) {
          return 'none'
        } else {
          return this.server.os_info.virtual_server
        }
      },

      getCurrentServerType () {
        if ( 
          this.server.os_info.physical_server === '0'  
        ) {
          return 'virtual'
        } else 
          if (this.server.os_info.physical_server === '1' ) {
          return 'physical'
        } else {
          return this.server.os_info.physical_server
        }
      },
    },

    props: [
      'id',
      'tab'
    ],

    beforeDestroy () {
      if (chartTop) {
        chartTop.unload()
      }

      if (chartUsage) {
        chartUsage.unload()
      }

      if (chartMemoryUsageId) {
        chartMemoryUsageId.unload()
      }

      if (this.errMessage) {
        this.errMessage.close()
      }
    },

    mounted () {
      categories = []
      blocks = []

      chartData = []
      chartCategories = []
      // Switching to tab specified in `tab` prop
      switch (this.tab) {
        case 'stat':
          this.currentTab = '1'
          break

        case 'threats':
          this.currentTab = '2'
          break

        case 'whitelist':
          this.currentTab = '3'
          break

        case 'settings':
          this.currentTab = '4'
          break

        case 'security':
          this.currentTab = '5'
          break

        case 'privacy':
          this.currentTab = '6'
          break

        case 'logging':
          this.currentTab = '7'
          break

        case 'reporting':
          this.currentTab = '8'
          break

        case 'info':
          this.currentTab = '9'
          break
      }

      if (this.$route.query.noredirect) {
        this.currentTab = '1'
      }
      this.updateServer()
      this.getSettingsInfo()
      this.getGraphicData()
    },

    components: {
      FileTransfer: () => import('@/components/FileTransfer/index.vue'),
      Settings: () => import('./tab-settings'),
      Privacy: () => import('./tab-privacy'),
      Security: () => import('./tab-security'),
      Logging: () => import('./tab-logging.vue'),
      Reporting: () => import('./tab-reporting.vue')
    },

    methods: {
      updateServer () {
        // Gets an information about the server
        const id = this.$route.params['id']

        this.serverId = this.$route.params['id']

        SPPCloudApi
          .getServerInfo(id)
          .then(r => {
            try {
              this.server = r
              // this.graph = r.graph
              this.server.status = !!this.server.status
              this.logForwardingData = r.logForwardingData

              this.actionFiles.used = this.convert(r.actionFiles.used)
              this.actionFiles.available = this.convert(r.actionFiles.available)
            } catch (e) {
              console.log(e)
            }

            this.loading = false
          })
          .catch (e => {
            console.log('error', e)
            this.errMessage = handleError(this, e)
          })
      },

      getGraphicData() {
        this.isLoadingStatistic = true
        SPPCloudApi
          .getGraphicStatistic(this.serverId, this.timeInterval || 24)
            .then(result => {
              this.graphicData = result.graph
              this.lastTimeSync = result.last_sync
              this.totalThreatsBlocked = [...result.graph.threads_blocked.js_tread, ...result.graph.threads_blocked.other_tread]
                .reduce((a, b) => a + b, 0)
                if (result.graph.threads_blocked && result.graph.threads_blocked.js_tread.length > 0) {
                  this.drawTopFivePlot(result.graph.threads_blocked)
                  this.noStatMessage = ""
                } else {
                  this.noStatMessage = "You don't have any blocks now"
                }
                if (result.graph.load5min && result.graph.load5min.length) {
                  this.drawLoadAveragePlot(result.graph)
                } else {
                  this.noStatMessageAverage = 'To see the statistic you should use your server for some time.'
                }
                if (result.graph.memory && result.graph.memory.length) {
                  this.drawMemoryUsage(result.graph)
                } else {
                  this.noStatMessageMemory = 'To see the statistic you should use your server for some time.'
                }
              this.isLoadingStatistic = false
            })
            .catch(err => {
              this.isLoadingStatistic = false
              console.log('error', err)
              this.errMessage = handleError(this, err)
            })
            .finally(_ => {
              this.isLoadingStatistic = false
            })
      },

      drawTopFivePlot (data) {
        let formatTime = '%H:%M'
        let formatTimeCount = 12
        if (this.currentPeriod === '7 days') {
          formatTime = '%m/%d %H:%M'
          formatTimeCount = 10
        } else if (this.currentPeriod === '30 days') {
          formatTime = '%m/%d %H:%M'
          formatTimeCount = 10
        }
        const timeServerJS = data.js_date_time.map(item => new Date(item))
        const timeServerOther = data.other_date_time.map(item => new Date(item))
        const maxValue = Math.max([...data.js_tread, ...data.other_tread])

        let dataTimeJS = ['x1', ...timeServerOther]
        let dataTimeOther = ['x2', ...timeServerJS]
        let dataBlockJS = ['Other blocks', ...data.other_tread]
        let dataBlockOther = ['JavaScript blocks', ...data.js_tread]

        chartTop = c3.generate({
          bindto: this.$refs.topChart,
          data: {
            xs: {
              'JavaScript blocks': 'x2',
              'Other blocks': 'x1',
            },
            columns: [
              [...dataTimeJS],
              [...dataTimeOther],
              [...dataBlockJS],
              [...dataBlockOther],
            ],
            names: {
              'data2': 'JavaScript blocks',
              'data1': 'Other blocks',
            },
            types: {
              'JavaScript blocks': 'area',
              'Other blocks': 'area'
            },
            colors: {
              'JavaScript blocks': '#ffbb00',
              'Other blocks': '#96003e',
            },
          },
            axis: {
              x: {
                type: 'timeseries',
                localtime: true,
                tick: {
                  format: formatTime,
                  count: formatTimeCount,
                },
              },
              y: {
                max: maxValue,
                min: 0,
                padding: { top: 0, bottom: 0 },
              }
            },
            legend: {
              show: false
            },
            point: {
              show: false
            }
        });
      },

      drawLoadAveragePlot (data) {
        let formatTime = '%H:%M'
        let formatTimeCount = 12
        if (this.currentPeriod === '7 days') {
          formatTime = '%m/%d %H:%M'
          formatTimeCount = 10
        } else if (this.currentPeriod === '30 days') {
          formatTime = '%m/%d %H:%M'
          formatTimeCount = 10
        }

        const maxData = data.max_value ? (data.max_value + 0.1) : null

        const timeData = data.time.map(item => new Date(item))

        let dataTime = ['x', ...timeData]
        let CPUdata = ['data1', ...data.load5min]

        chartUsage = c3.generate({
          bindto: this.$refs.chartUsage,
          data: {
            x: 'x',
            columns: [ [...dataTime], [ ...CPUdata] ],
              names: {
                'data1': 'Load Average',
              },
              types: {
                'data1': 'area-spline',
              },
            axes: {
              'data2': 'y'
            },
            empty: { 
              label: { 
                text: 'Enable statistics'
              } 
            },
            colors: {
              data1: '#0043ff',
            },
        },
          line: {
            connectNull: false
          },
          axis: {
            x: {
              type: 'timeseries',
                localtime: true,
                tick: {
                  format: formatTime,
                  count: formatTimeCount,
                },
            },
            y: {
              show: true,
              max: maxData || 1,
              min: 0,
              padding: {top: 0, bottom: 0},
            }
          },
          transition: {
            duration: 1500
          },
          legend: true,
          empty: {label: { text: "No Data Available" }},
          point: {
            show: false
          }
        });
      },

      drawMemoryUsage (data) {
        let formatTime = '%H:%M'
        let formatTimeCount = 12
        if (this.currentPeriod === '7 days') {
          formatTime = '%m/%d %H:%M'
          formatTimeCount = 10
        } else if (this.currentPeriod === '30 days') {

          formatTime = '%m/%d %H:%M'
          formatTimeCount = 10
        }

        const timeData = data.time.map(item => new Date(item))

        let dataTime = ['x', ...timeData]
        let memoryData = ['data1', ...data.memory]
        let dataDisk = ['data2', ...data.disk]

        chartMemoryUsageId = c3.generate({
          bindto: this.$refs.chartMemoryUsage,
          data: {
            x: 'x',
            xFormat: '%H:%M:%S %p', 
            columns: [ [...dataTime], [ ...memoryData], [ ...dataDisk] ],
              names: {
                'data1': 'Memory Usage',
                'data2': 'Disk Usage',
              },
              types: {
                'data1': 'area-spline',
                'data2': 'area-spline'
              },
              colors: {
                data1: '#11bfbf',
                data2: '#3C73F6',
                // data1: '#11bfbf',

                // data2: '#6a00a3',
              // data1: '#db0f1c',
              // data2: '#6600ba', 
              // var 1             
              // data1: '#ea2902',
              // data2: '#2d70ff',
              // var 2           
              // data1: '#ea2902',
              // data2: '#820093',
              // // var 3         
              // data1: '#d400ff',
              // data2: '#6a00ff'
            },
            },
            line: {
              connectNull: false
            },
            axis: {
              x: {
                type: 'timeseries',
                localtime: true,
                tick: {
                  format: formatTime,
                  count: formatTimeCount,
                },
              },
              y: {
                max: 100,
                min: 0,
                padding: { top: 0, bottom: 0 },
              }
            },
            transition: {
              duration: 1500
            },
            legend: {
              padding: 25,
              item: {
                tile: {
                  width: 10,
                  height: 10
                }
              }
            },
            point: {
              show: false
            }
        });
      },

      whitelistShowAdding () {
        this.show.whitelistAdding = true
      },

      whitelistAdd () {
        if (this.isNewWhitelistItemValid) {
          let newWhitelist = [...this.server.whitelist.data]

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
            .setWhitelist(this.server.whitelist.id, newWhitelist)
            .then(r => {
              this.server.whitelist.data = JSON.parse(JSON.stringify(r.data.result.data))
      
              this.whitelistNew = ''
              this.whitelistNewItems = []    
              this.whitelistAddingErrorMsg = ''
      
              this.show.whitelistAdding = false
              this.loading = false
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
            this.loading = true

            let newData = this.server.whitelist.data.filter(el => this.selected.whitelist.indexOf(el.value) === -1)

            newData.map(el => el.id)

            SPPCloudApi
              .setWhitelist(this.server.whitelist.id, newData)
              .then(r => {
                this.server.whitelist.data = this.server.whitelist.data.filter(el => this.selected.whitelist.indexOf(el.value) === -1)
    
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

      _prettyDate (dateISO) {
        return prettyDate(dateISO)
      },

      handleEditNameClick () {
        this.serverName.newName = this.server.name
        this.serverName.editing = true
      },

      handleEditNameClose () {
        this.serverName.editing = false
      },

      handleEditNameSubmit () {
        if (this.nameError === '') {
          this.loading = true
          SPPCloudApi
            .setServerSettings(this.serverId, {
              name: this.serverName.newName
            })
            .then(r => {
              this.loading = false
              this.server.name = this.serverName.newName
              this.serverName.editing = false
            })
            .catch (e => {
              this.loading = false
              this.errMessage = handleError(this, e)
            })
        } else {
          this.nameErrorMsg = this.nameError
        }
      },

      updateServerSynchronization () {
        this.loading = true
        SPPCloudApi
          .setServerSynchronization(this.serverId, {
            synchronization:  this.server.status ? 1 : 0
          })
          .then(r => {
            this.loading = false
          })
          .catch(e => {
            console.log(e)
            this.server.status = !this.server.status
            this.loading = false
          })
      },

      handleEditDescrClick () {
        this.editing.description = true
        this.editing.newDescription = this.server.origin.description
      },

      handleEditDescrClose () {
        this.editing.description = false
      },

      handleEditDescrSubmit () {
        this.loading = true
        SPPCloudApi
          .setServerSettings(this.serverId, {
            description: this.editing.newDescription
          })
          .then(r => {
            this.loading = false
            this.server.origin.description = this.editing.newDescription
            this.editing.description = false
          })
          .catch (e => {
            this.loading = false
            this.errMessage = handleError(this, e)
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
          .setServerActionFiles(this.server.id, _payload)
          .then(r => {
            // link to an array from which we'll move files
            const from = (direction === 'to-right') ? this.actionFiles.used : this.actionFiles.available

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
            // link to an array to which we'll move files
            const to = (direction === 'to-right') ? this.actionFiles.available : this.actionFiles.used

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

      convert (list) {
        let result = []

        if (list.filter(el => el.category && el.category.name.toLowerCase() === 'custom').length) {
          const id = list.filter(el => el.category && el.category.name.toLowerCase() === 'custom')[0].category.id

          result.push({
            name: 'Custom',
            id: id,
            items: []
          })
        }

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
            result.unshift({
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
          this.whitelistNewItems.push(this.whitelistNew)
          this.whitelistNew = ''
        } else {
          this.whitelistAddingErrorMsg = 'Please enter correct URL.'
        }
      },

      goBack () {
        if (this.$route.query && this.$route.query.noredirect) {
          this.$router.push('/servers/list')
        } else {
          this.$router.go(-1)
        }
      },

      loggingValue(data) {
        this.server.is_logging
      },

      async getSettingsInfo () {
        this.settingsError = ""
        this.loading = true
        const config = {
          headers: 
            {
              'Authorization': "bearer " + store.getters.token,
              'Content-Type': 'application/json'
            }
          }
        try {
          const { data: { result } } = await axios(
            baseUrl + `/api/frontend/v1/server/${this.serverId}/settings`,
            config
          )
          this.sslCheckbox = result.https_inspection
          this.findWord = result.fun_filter.search || "text1"
          this.replaceWord = result.fun_filter.replace || "text2"
          this.funCheckbox = result.fun_filter.is_active
          this.serverCanvasBlock = result.canvas_blocker
          this.serverSettngsData = result
          this.isLogging = result.logging
          
          const time = result.sync_frequency
          const eightHours = 8 * 60
          const twentyFourHours = 24 * 60
          if ( time === 1 || time === 5 || time === 30 || time === 60) {
            const frequency = time
            this.currentTimeData = `${frequency} min`
            this.editPutManuallySync = null
            this.currentTimeManualEditing = ''
          } else if (time === eightHours || time === twentyFourHours) {
              const frequency = time / 60
              this.currentTimeData = `${frequency} h`
              this.editPutManuallySync = null
              this.currentTimeManualEditing = ''
          } else {
            this.currentTimeData = `Manual (min)`
            const timeMin = time
            this.currentTimeManualEditing = `${timeMin} min`
            this.editPutManuallySync = false
          }
          this.loading = false
        } catch(e) {
          this.settingsError = e.message
        } finally {
          this.key1++
          this.loading = false
          this.editTimeSyncError = ''
        }
      },

      handleGenerateDataInterval() {
        switch(this.syncTimeValue) {
          case 1:
            this.currentPeriod = '24 hours'
            break
          
          case 2:
            this.currentPeriod = '7 days'
            break

          case 3:
            this.currentPeriod = '30 days'
            break

          default:
            break
        }

        switch(this.syncTimeValue) {
          case 1:
            this.timeInterval = 24
            break
          
          case 2:
            this.timeInterval = 168
            break

          case 3:
            this.timeInterval = 720
            break

          default:
            break
        }

        this.getGraphicData()
      }
    },

    watch: {
      currentTab: function (val) {
        if (val == 0) {
          setTimeout(() => {
            chartTop && chartTop.flush()
            chartUsage && chartUsage.flush()
            chartMemoryUsageId && chartMemoryUsageId.flush()
          }, 100);
        }
      },

      serverId() {
        this.getSettingsInfo()
      }
    },
  }
</script>

<style lang="scss">
.settings-container {
  .el-input--suffix .el-input__inner {
    width: 170px;
    
  }
  .el-input__inner {
    height: 35px;
  }
  .el-input__suffix {
    top: 3px;
  }
  .is-reverse {
    padding-bottom: 8px;
    line-height: 25px;
  }
}

.server-container {
  .c3-legend-item {
    font-family:  Helvetica Neue, Helvetica;
    font-size:  13px;
    margin-right: 1rem;
    stroke: Helvetica Neue, Helvetica;
    text {
      font-family: Helvetica Neue, Helvetica;
    }
  }
  .c3 text {
    font-family:  Helvetica Neue, Helvetica;
  }
  .c3-axis-y text { 
    font-size: 12px; 
    z-index: -100 !important
  }
  .c3-axis-x text { 
    font-size: 12px; 
  }
  .c3-region.regionY {
    fill: rgb(47, 0, 255);
  }
  .c3-legend-item {
    cursor:default !important;
    pointer-events: none;
  }
  .c3-legend-item-data1 text {
    font-size: 14px !important;
  }
  .c3-legend-item-data2 text {
    font-size: 14px !important;
  }
  .c3-tooltip-container {
    width: 150px !important;
  }
  .c3 text { 
    font-size: 10px; 
  }
  .c3-area {
    opacity: .4 !important;
  }
  .c3-chart-line {
    opacity: .8 !important;
  }
  .el-table .cell {
    word-break: break-word !important;
  }

  #chartMemoryUsageId {
    .c3-area {
      opacity: .2 !important;
    }
  }
}

.el-loading-spinner i {
  font-size: 26px !important;
}

.el-loading-spinner .el-loading-text {
  font-size: 26px !important;
}
</style>

<style lang="scss" scoped>
  .server-container {
    margin-top: 10px;

    .sync-container {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      margin-bottom: 10px;

      .sync-interval {
        display: flex;
      }

      .settings-title {
        margin: 3px 0;
        display: flex;
        align-items: center;
        font-weight: bold;
      }
      .synch {
        margin: .4rem .9rem .4rem 0;
      }
    }

    .pageheader {
      display: flex;
      align-items: center;
      width: 100%;
      height: 60px;

      &__status {
        margin-right: 10px;
      }

      &__server-name {
        .view-mode,
        .edit-mode {
          display: flex;
          align-items: center;

          margin-right: 20px;
        }
        
        .view-mode {
          .name {
            margin-right: 5px;
            font-size: 24px;
            font-weight: normal;
          }

          margin-right: 10px;
        }

        .edit-mode {
          i {
            font-size: 18px;
            font-weight: bold;
          }

          .close-btn {
            color: red;
          }

          .submit-btn {
            color: green;
            margin-left: 10px;
          }
        }
      }
    }

    .back-to-list-btn {
      margin: 15px 0px;
    }

    .stat {
      display: grid;
      grid-template-columns: 200px 5fr;
      grid-gap: 10px;

      .load-average, .top-five {
        .graphic-title {
          display: flex;
          justify-content: center;
          font-size: 20px;
          margin-bottom: .9rem;
          margin-top: .7rem;
        }

        .sync-info {
          display: flex;
          justify-content: flex-end;

          margin-top: .9rem;
          margin-right: -.3rem;
          margin-bottom: -.5rem;

          font-size: 12px;
          color: #acacac;
          font-style: italic
        }
      }

      .chart-memory-average {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-gap: 10px;
        grid-column-start: 1;
        grid-column-end: 3;
      }

      .memory-graph {
        .graphic-title {
          display: flex;
          justify-content: center;
          font-size: 20px;
          margin-bottom: .9rem;
          margin-top: .7rem;
        }

        .sync-info {
          display: flex;
          justify-content: flex-end;

          margin-top: .9rem;
          margin-right: -.3rem;
          margin-bottom: -.5rem;

          font-size: 12px;
          color: #acacac;
          font-style: italic
        }
      }

      .top-chart {
        min-height: 300px;
        margin: 0 auto;
        max-height: 300px;
      }

      .blocked-container {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 5px;

        .js-square {
          width: 10px;
          height: 10px;
          background-color: #ffbb00;
          font-size: 12px;
          
        }

        .js-blocked {
          font-size: 14px;
          margin-left: .5rem;
          color: #606266
        }

        .other-square {
          width: 10px;
          height: 10px;
          background-color: #96003e;
          font-size: 12px;
        }

        .other-blocked {
          font-size: 14px;
          margin-left: .5rem;
          color: #606266
        }
      }

      .total-container {
        display: grid;
        grid-gap: 10px;
      }

      .total {
        display: flex;
        display: -webkit-flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        font-size: 18px;
        max-height: 140px;

        .blocks-count {
          font-size: 36px;
          margin-right: auto;
          display: -webkit-box;
          display: -ms-flexbox;
          display: flex;
          -webkit-box-align: start;
              -ms-flex-align: start;
                  align-items: flex-start;
        }

        .grid-container {
          display: -ms-grid;
          display: grid;
          -ms-grid-columns: 1fr 10px 1fr;
          grid-template-columns: .55fr 1fr;
          grid-gap: 10px;
          width: 100%;

          .text-container {
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-pack: center;
                -ms-flex-pack: center;
                    justify-content: center;
            -webkit-box-orient: vertical;
            -webkit-box-direction: normal;
                -ms-flex-direction: column;
                    flex-direction: column;
          }

          .header {
            color: rgba(0,0,0,.45);

                grid-column-start: 1;
            -ms-grid-column-span: 2;
            grid-column-end: 3;
          }

          .icon {
            font-size: 34px;
            margin-left: auto;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-align: start;
                -ms-flex-align: start;
                    align-items: flex-start;
          }
        }
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

      .action-description {
        padding: 0px 10px;
        font-size: 15px;
      }
    }

  .whitelist-wrapper {
    display: flex;
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

    .notification {
      margin-left: 1rem;
      font-size: 20px;

      .description {
        font-size: 14px;
        margin-top: .7rem;
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
        max-width: 500px;
        margin-bottom: 10px;
        grid-column-start: 1;
        grid-column-end: 4;
      }
    }

    .info-container {
      display: grid;
      grid-template-columns: 200px 1fr;
      font-size: 16px;

      .info {
        &-content,
        &-title {
          margin: 3px 0;
          display: flex;
          align-items: center;
        }
        
        &-content {
          .view,
          .edit {
            display: flex;
            max-width: 300px;

            .icon-btn {
              font-size: 16px;
              padding: 0;

              &.edit-btn {
                margin-left: 10px;
              }
            }
          }
          
          .group {
            margin-right: 5px;
          }

          .edit {
            .icon-btn {
              font-size: 18px;
              font-weight: bold;

              &.submit-btn {
                color: green;
                margin-left: 10px;
              }

              &.close-btn {
                color: red;
              }
            }
          }
        }
      }
    }

    .os-setting {
      margin-top: 1rem;
    }

    // setting sections
    .settings-container {
      font-size: 16px;
        &__item {
          max-width: 40%;
          margin-top: 5px;
          padding-bottom: 1.4rem;
          border-bottom: 1px rgb(212, 212, 212) solid;
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
    }

      .error {
        max-width: 240px;
        margin-top: 1.5rem;
      }

      &__checkbox {
        margin-left: 0 !important;
        margin-top: .3rem;
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
        margin: 1.4rem 0 .7rem 0;
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
      h2  {
        margin: 0;
        margin-left: 15px;
      }
    }
  }

  .question-mark {
    display: inline-flex;
    // align-self: center;

    padding-top: 1px;
    padding-left: 1px;
    padding-right: 1px;
    margin-left: .7rem;

    width: 16px;
    height: 16px;

    background: rgb(180, 180, 180);

    border-radius: 100%;

    align-items: center;
    justify-content: center;

    cursor: pointer;

    &::before {
      content: "?";
      color: white;
      font-size: 12px;
      font-weight: bold;
    }
  }
</style>
