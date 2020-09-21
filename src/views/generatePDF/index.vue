<template>
  <div 
    class="reporting" 
    :key="keys"
  >

    <div 
      id="graphicContainer" 
      ref="generatePDF"
      v-loading="isLoading"
      element-loading-spinner="el-icon-loading"
      element-loading-text="Please wait. Statistics is loading"
      element-loading-background="rgba(250, 250, 250, 0.8)"
    >
      <div class="stat" id="printBlank">
        <div>
          <img 
            id="logoImage"
            class="logo__image" 
            :src="logoSrc" 
            alt="logo"
          >
        </div>

        <div class="timePDF">
          {{ _prettyDate(new Date())}}
        </div>
        <div class="title">
          Security and Privacy Plus Security Report
        </div>
        <div class="container--info">
          <div>Server: <strong>{{ server.name }}</strong></div>
          <div>Server IP address: <strong>{{ server.ip }}</strong></div>
          <div>Timeframe: <strong>last {{ $route.query.period }}</strong></div>
          <div class="sync-info">
            Last sync (server time): <strong>{{ lastTimeSync ? _prettyDate(lastTimeSync) : '---' }}</strong>
          </div>
        </div>

        <div class="title-container">
          <h4>Security Threats Blocked Across All Domains:</h4>  
        </div>

        <div class="table-statistic">
          <div class="column">
            <div class="column__head"><strong>Total Threats Blocked</strong></div>
            <div class="column__footer"><h2>{{graph.threads_blocked ? graph.threads_blocked.blocks_count.total : 0 }}</h2></div>
          </div>

          <div class="column">
            <div class="column__head"><strong>JavaScript Threats Blocked</strong></div>
            <div class="column__footer"><h2>{{ graph.threads_blocked ? graph.threads_blocked.blocks_count.js : 0 }}</h2></div>
          </div>

          <div class="column">
            <div class="column__head"><strong>.js % Of All Threats Blocked</strong></div>
            <div class="column__footer"><h2>{{ procentJSBlocked ? procentJSBlocked : 0 }}%</h2></div>
          </div>
        </div>

        <div v-if="!isHiddenGraphicBlocked" class="top-five" :key="keyJS">
          <div class="graphic-title">
            Threats blocked 
          </div>
          <div v-if="noStatMessage.length > 0" class="no-stat-msg">
            {{ noStatMessage }}
          </div>

          <div v-else id="chartContainerBlocked">
            <div 
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
                style="margin-right: .6rem"
              >
                JavaScript blocked
              </div>
              <div class="other-square"></div>
              <div class="other-blocked">
                Others blocked
              </div>
            </div>
          </div>
        </div>        

        <div class="chart-memory-average">
          <div class="load-average" :key="keyLoad">
            <div class="graphic-title">
              Load average 
            </div>
            <div 
              v-if="noStatMessageAverage.length" 
              class="no-stat-msg"
            >
              {{ noStatMessageAverage }}
            </div>
            <div v-else id="chartContainerLoad">
              <div 
                id="chartUsage" 
                ref="chartUsage"
              >
              </div>
            </div>
          </div>

          <div class="memory-graph" :key="keyMemory">
            <div class="graphic-title">
              Memory and Disk usage 
            </div>
            <div v-if="noStatMessageMemory" class="no-stat-msg">
              {{ noStatMessageAverage }}
            </div>
            <div v-else id="chartContainerMemory">
              <div 
                id="chartMemoryUsageId" 
                ref="chartMemoryUsage"
              >
              </div>
            </div>

          </div>
        </div>
      </div> 
    </div>
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
    // props: {
    //   server: {
    //     type: Object,
    //     required: true,
    //   },
    // },

    data () {
      return {
        isLoading: false,
        isLoadingTimer: false,
        isGenerate: true,

        keys: 1,
        server: {},

        isLogging: false,
        isLoadingTimerIMGPDF: false,
        isLoadingTimerWindowPrint: false,
        graph: {},

        checkDataLength: null,
        
        lastTimeSync: '',
        totalThreatsBlocked: null,
        blockedJS: null,
        timeInterval: null,

        timeForPDF: null,

        procentJSBlocked: null,
        isTogglePrewiev: false,
        isHiddenGraphicBlocked: false,

        currentPeriod: '24 hours',

        syncTimeValue: 1,
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

        keyMemory: 100,
        keyLoad: 200,
        keyJS: 300,
        key1: 1,
        fixer: '99%',

        noStatMessage: '',
        noStatMessageAverage: '',
        noStatMessageMemory: '',
      }
    },

    mounted() {
      if (this.$route.query.interval) {
        this.getGraphicData()
        this.updateServer()
      }
    },

    methods: {
      getGraphicData() {
        this.isLoading = true
        SPPCloudApi
          .getGraphicStatistic(+this.$route.query.server, +this.$route.query.interval)
            .then(result => {

              this.isLogging = result.isLogging

              this.graph = result.graph
              this.currentPeriod = this.$route.query.period

              if (result.isLogging && result.graph.load5min.length > 0) {
                this.lastTimeSync = result.last_sync
                this._prettyDate(result.last_sync)

                this.checkDataLength = true

                if (result.graph.threads_blocked && result.graph.threads_blocked.js_tread.length > 0) {
                  this.drawTopFivePlot(result.graph.threads_blocked)
                  
                  this.procentJSBlocked = +(result.graph.threads_blocked.blocks_count.js / result.graph.threads_blocked.blocks_count.total * 100).toFixed(1)
                  this.isHiddenGraphicBlocked = false
                  this.noStatMessage = ''
                } else {
                  this.noStatMessage = 'To see the statistic you should use your server for some time.'
                  this.isHiddenGraphicBlocked = true
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
              } else {
                this.isLogging = false
                this.checkDataLength = false
              }
              this.isLoading = false
            })
            .catch(err => {
              console.log('error', err)
              this.errMessage = handleError(this, err)
            })
            .finally(_ => {
              this.isLoading = false
              setTimeout(() => {
                const title = `spp-report-${this.server.name}-${this.currentPeriod}-${this._prettyDate(this.lastTimeSync)}`
                document.title = title
                window.print();
              }, 1200)
            })
      },

      updateServer () {
        const id = +this.$route.query.server

        this.serverId = +this.$route.query.server

        SPPCloudApi
          .getServerInfo(id)
          .then(r => {
            try {
              this.server = r
              this.server.status = !!this.server.status
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
          size: {
            height: 230,
            width: 680
          },
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
        let period = 289
        let syncInterval = 300000
        let daysPeriod = 1
        let formatTime = '%H:%M'
        let formatTimeCount = 12
        if (this.currentPeriod === '7 days') {
          period = 169
          syncInterval = 3600000
          daysPeriod = 7
          formatTime = '%m/%d %H:%M'
          formatTimeCount = 10
        } else if (this.currentPeriod === '30 days') {
          period = 181
          syncInterval = 14400000
          daysPeriod = 30
          formatTime = '%m/%d %H:%M'
          formatTimeCount = 10
        }
        const lastTimeData = data.time[data.time.length - 1]
        const d = new Date(lastTimeData)
        // debugger
        const currentTime = new Date(d.getTime());
        const dateNow = currentTime.setDate(d.getDate())
        const datePast = currentTime.setDate(d.getDate() - daysPeriod)

        const time = dateNow - datePast

        const maxData = data.max_value ? (data.max_value + 0.1) : null
        const fillEmptyData = period - data.load5min.length
        const fillArray = []

        for (let i = 1; i <= fillEmptyData; i++) {
          fillArray.push(0)
        }
        
        let arrayTimes = [];
        if (fillEmptyData !== 0) {
          for (let i = syncInterval; i <= time; i = i+syncInterval) {
            const newTime = time - i
            arrayTimes.push(new Date(d - newTime))
          }
        }

        const timeData = data.time.map(item => new Date(item))
        // const timeDataLength = timeData.length
        const sliceArray = arrayTimes.slice(0, fillEmptyData)
        let dataTime = ['x', ...sliceArray, ...timeData]
        let CPUdata = ['data1', ...fillArray, ...data.load5min]
        chartUsage = c3.generate({
          size: {
            height: 230,
            width: 330
          },
          bindto: this.$refs.chartUsage,
          data: {
            x: 'x',
            columns: [ [...dataTime], [ ...CPUdata] ],
              names: {
                'data1': 'Load Average',
              },
              types: {
                'data1': 'area',
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
        // debugger
        let period = 289
        let syncInterval = 300000
        let daysPeriod = 1
        let formatTime = '%H:%M'
        let formatTimeCount = 12
        if (this.currentPeriod === '7 days') {
          period = 169
          syncInterval = 3600000
          daysPeriod = 7
          formatTime = '%m/%d %H:%M'
          formatTimeCount = 10
        } else if (this.currentPeriod === '30 days') {
          period = 181
          syncInterval = 14400000
          daysPeriod = 30
          formatTime = '%m/%d %H:%M'
          formatTimeCount = 10
        }
        const lastTimeData = data.time[data.time.length - 1]
        const d = new Date(lastTimeData)
        // debugger
        const currentTime = new Date(d.getTime());
        const dateNow = currentTime.setDate(d.getDate())
        const datePast = currentTime.setDate(d.getDate() - daysPeriod)

        const time = dateNow - datePast
        const fillEmptyData = period - data.load5min.length
        const fillArray = []

        for (let i = 1; i <= fillEmptyData; i++) {
          fillArray.push(0)
        }

        let arrayTimes = [];
        if (fillEmptyData !== 0) {
          for (let i = syncInterval; i <= time; i = i+syncInterval) {
            const newTime = time - i
            arrayTimes.push(new Date(d - newTime))
          }
        }

        const timeData = data.time.map(item => new Date(item))
        const sliceArray = arrayTimes.slice(0, fillEmptyData)

        let dataTime = ['x', ...sliceArray, ...timeData]
        let memoryData = ['data1', ...fillArray, ...data.memory]
        let dataDisk = ['data2', ...fillArray, ...data.disk]

        chartMemoryUsageId = c3.generate({
          size: {
            height: 230,
            width: 330
          },
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
                'data1': 'area',
                'data2': 'area'
              },
              colors: {
              data1: '#11bfbf',
              data2: '#2d70ff',
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
                max: 100,
                min: 0,
                padding: { top: 0, bottom: 0 },
              }
            },
            transition: {
              duration: 1500
            },
            legend: {
              padding: 2,
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

      async nadleDonwloadWindowPrint() {
        this.isLoadingTimerWindowPrint = true

        const namePDF = `spp-report-${this.server.name}-${this.currentPeriod}-${this.timeForPDF}.pdf`

        var printContents = document.getElementById('graphicContainer').innerHTML;
        var originalContents = document.body.innerHTML;
        document.body.innerHTML = printContents
        window.print();
        document.body.innerHTML = originalContents;
        this.isLoadingTimerWindowPrint = false
        setTimeout(() => {
          location.reload()
        }, 1500)
      },

      _prettyDate (dateISO) {
        return prettyDate(dateISO)
      },

      handleGeneratePreview() {
        this.isGenerate = true
        this.isTogglePrewiev = true

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

    computed: {
      logoSrc () {
        return require('@/assets/images/logo_03.png')
      },
    }
  }
</script>

<style lang="scss">
.reporting {
  #graphicContainer {
    max-width: 680px
  }
  .el-card.is-always-shadow {
    box-shadow: none;
  }

  .el-card__body {
    padding: 0px;
  }

  .el-card {
    border: none;
  }
}
.el-input__inner {
  height: 35px;
}
.reporting {
  position: relative;
  #chartMemoryUsageId, #chartUsage {
    box-sizing: border-box;
    height: 250px;
    max-width: 350px;
  }
  .c3-event-rect {
    max-width: 330px !important;
  }
}
.el-card__body {
  position: relative;
}

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
.c3-area {
  opacity: .4 !important;
}
.c3-chart-line {
  opacity: .8 !important;
}
.el-loading-spinner i {
  font-size: 26px !important;
}
.el-loading-spinner .el-loading-text {
  font-size: 26px !important;
}
</style>

<style lang="scss" scoped>
.reporting {
  margin-left: 1rem;
  .settings-title {
    margin: 3px 0;
    display: flex;
    align-items: center;
    font-weight: bold;
  }
  .synch {
    margin: .2rem .9rem .4rem 0;
  }
  .sync-container {
    display: flex;
    margin: 10px 0;

    .title {
      margin: 3px 0;
      display: flex;
      align-items: center;
    }
    .synch {
      margin: .4rem .9rem .4rem 0;
    }
  }

  .disabled-button {
    cursor: not-allowed;
    margin-left: 1rem;
    padding: 8px 15px;

    .icon {
      margin-right: .3rem;
    }
  }

  .print-button {
    margin-left: 1rem;
    padding: 8px 15px;

    .icon {
      margin-right: .3rem;
    }
  }

  .preview {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1rem;
    padding-bottom: .7rem;
    border-bottom: 1px solid silver;
    max-width: 680px;

    h4 {
      padding: 0;
      margin: 0;
    }
  }

  .stat {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 10px;
    max-width: 680px;

    margin-top: 2rem;
    margin-bottom: 2rem;

    .container--info {
      grid-column: 1 / 3;
      display: flex;
      flex-direction: column;
    }

    .title {
      grid-column: 1/3;

      margin: 1rem 0;

      text-align: center;
      font-size: 20px;

      h4 {
        margin: 0;
        padding: 0;
      }
    }

    .title-container {
      grid-column: 1/3;

      margin: 1rem 0;

      text-align: center;
      font-size: 16px;

      h4 {
        margin: 0;
        padding: 0;
      }
    }

    .table-statistic {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      justify-content: space-between;
      grid-column: 1 / 3;

      .column {
        
        &__head {
          display: flex;
          justify-content: center;
          align-items: center;
          align-items: center;
          height: 60px;
          padding: 10px;
          text-align: center;

          background: #71b4fc;
          border: .5px solid #a1a1a1;
        }

        &__footer {
          text-align: center;
          padding: 10px;

          border: .5px solid rgb(161, 161, 161);
        }

        h2 {
          padding: 0;
          margin: 0;
        }
      }
    }

    .logo__image {
      padding: 10px;
      max-width: 190px;

      &:hover {
        cursor: pointer;
      }
    }

    .timePDF {
      justify-self: end;
      align-self: center;
      font-size: 18px;
    }

    .top-five {
      grid-column: 1 / 3;
      .graphic-title {
        display: flex;
        justify-content: center;

        margin: .9rem 0 .9rem 0;
        padding-left: 1rem;

        font-size: 18px;
      }
    }

    .load-average {
      .graphic-title {
        display: flex;
        justify-content: center;

        margin: .9rem 0 .9rem 1.4rem;

        font-size: 18px;
      }
    }

    .chart-memory-average {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-gap: 10px;
      grid-column: 1 / 3;
    }

    .memory-graph {
      .graphic-title {
        display: flex;
        justify-content: center;

        margin: .9rem 0 .9rem 1.4rem;

        font-size: 18px;
      }
    }

    .blocked-container {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 5px;

      .js-square {
        width: 10px;
        height: 10px;
        background: #ffbb00;
        font-size: 12px;
        color: #606266
      }

      .js-blocked {
        font-size: 14px;
        margin-left: .5rem;
        color: #606266
      }

      .other-square {
        width: 10px;
        height: 10px;
        background:#96003e;
        font-size: 12px;
        color: #606266
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
}
@media print {
    html, body, #printBlank {
    height:100%; 
    margin: 0 !important; 
    padding: 0 !important;
    overflow: hidden;
  }
  @page { margin: 2rem; }
  body { margin: 1.6rem; }
  * {
      -webkit-print-color-adjust: exact !important; /*Chrome, Safari */
      color-adjust: exact !important;  /*Firefox*/
    }
  #printBlank {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 10px;
    max-width: 680px;

    margin-top: .2rem;
    margin-bottom: 2rem;

    .container--info {
      grid-column: 1 / 3;
      display: flex;
      flex-direction: column;
    }

    .title {
      grid-column: 1/3;

      margin: .4rem 0;

      text-align: center;
      font-size: 20px;

      h4 {
        margin: 0;
        padding: 0;
      }
    }

    .title-container {
      grid-column: 1/3;

      margin: .4rem 0;

      text-align: center;
      font-size: 16px;

      h4 {
        margin: 0;
        padding: 0;
      }
    }

    .table-statistic {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      justify-content: space-between;
      grid-column: 1 / 3;

      .column {
        
        &__head {
          display: flex;
          justify-content: center;
          align-items: center;
          align-items: center;
          height: 60px;
          padding: 10px;
          text-align: center;

          background: #91cff8 !important;
          border: .5px solid #a1a1a1;
        }

        &__footer {
          text-align: center;
          padding: 10px;

          border: .5px solid rgb(161, 161, 161);
        }

        h2 {
          padding: 0;
          margin: 0;
        }
      }
    }

    .logo__image {
      padding: 10px;
      max-width: 190px;

      &:hover {
        cursor: pointer;
      }
    }

    .timePDF {
      justify-self: end;
      align-self: center;
      font-size: 18px;
    }

    .top-five {
      grid-column: 1 / 3;
      .graphic-title {
        display: flex;
        justify-content: center;

        margin: .4rem 0 .4rem 0;
        padding-left: 1rem;

        font-size: 18px;
      }
    }

    .load-average {
      .graphic-title {
        display: flex;
        justify-content: center;

        margin: .4rem 0 .4rem 1.4rem;

        font-size: 18px;
      }
    }

    .chart-memory-average {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-gap: 10px;
      grid-column: 1 / 3;
    }

    .memory-graph {
      .graphic-title {
        display: flex;
        justify-content: center;

        margin: .4rem 0 .4rem 1.4rem;

        font-size: 18px;
      }
    }

    .blocked-container {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 5px;

      .js-square {
        width: 10px;
        height: 10px;
        background: #ffbb00 !important;
        font-size: 12px;
        color: #606266
      }

      .js-blocked {
        font-size: 14px;
        margin-left: .5rem;
        color: #606266
      }

      .other-square {
        width: 10px;
        height: 10px;
        background: #96003e !important;
        font-size: 19px;
        color: #606266
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
}
</style>
