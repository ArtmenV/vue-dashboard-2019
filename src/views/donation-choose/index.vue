<template>
  <div class="page-container">
    <div class="donation-choose">
      <div class="page-header">
        Privoxy project development fund general donation

        <div class="description">
          Make a donation to support privoxy project development
        </div>

        <el-button
          class="donate-btn"
          type="success"
          @click="stripeRedirect(getStripeSKU(null))"
        >
          Donate here
        </el-button>
      </div>

      <main class="main">
        <div class="header">
          You may also donate and fund the development of these features:
        </div>

        <div class="feature-donation-container">
          <div
            class="feature-donation"
            v-for="donation in donations"
            :key="donation.id"
          >
            <div class="header">
              {{ donation.header }}
            </div>

            <div class="text">
              {{ donation.text }}
            </div>

            <el-radio-group v-model="donation.donationSelected">
              <el-radio
                v-for="option in donation.donationOptions"
                :key="option.id"
                :label="option.id"
              >
                {{ option.displayCost }}
              </el-radio>
            </el-radio-group>

            <el-button
              class="donate-btn"
              type="primary"
              size="small"
              @click="stripeRedirect(getStripeSKU(donation.donationSelected))"
            >
              Fund this feature
            </el-button>
          </div>
        </div>
      </main>
    </div>

    <svg class="background-top-curve" width="1031" height="518" viewBox="0 0 1031 518" xmlns="http://www.w3.org/2000/svg">
      <path d="M1031 117C531 160 266.409 262.078 -8.34451e-07 517.97L-8.3445e-07 117V-1.52588e-05L1031 -1.66893e-06V117Z"/>
    </svg>

    <svg class="background-bottom-curve" width="936" height="557" viewBox="0 0 936 557" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M936 0V557H0C423.276 447.386 680.378 304.256 936 0Z" fill="#C4C4C4"/>
    </svg>

    <svg 
      style=" margin-bottom: -8px;"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1440 68"
      enable-background="new 0 0 1440 68"
      class="background-wave-curve"
    >
      <path d="m1622.3 1937.7c0 0-410.7 169.1-913.4 75.5-502.7-93.6-977.7 56.3-977.7 56.3v440h1891.1v-571.8" transform="translate(0-1977)"/>
    </svg>

    <div class="background-header-rectangle"></div>
  </div>
</template>

<script>
  const stripe = Stripe('pk_test_4EwpSbo2l0I96SPGae300CwJ')

  export default {
    data () {
      return {
        donations: [
          {
            id: 1,
            header: 'Customize landing page',
            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
            buttonEnabled: true,

            donationOptions: [
              {
                id: 1,
                displayCost: '5$'
              },
              {
                id: 2,
                displayCost: '10$'
              },
              {
                id: 3,
                displayCost: '20$'
              },
              {
                id: 4,
                displayCost: '50$'
              }
            ],

            donationSelected: 1
          },
          {
            id: 2,
            header: 'Manage cookie settings',
            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
            buttonEnabled: true,

            donationOptions: [
              {
                id: 5,
                displayCost: '5$'
              },
              {
                id: 6,
                displayCost: '10$'
              },
              {
                id: 7,
                displayCost: '20$'
              },
              {
                id: 8,
                displayCost: '50$'
              }
            ],

            donationSelected: 5
          },
          {
            id: 3,
            header: 'Zero day threat panel',
            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
            buttonEnabled: true,

            donationOptions: [
              {
                id: 9,
                displayCost: '5$'
              },
              {
                id: 10,
                displayCost: '10$'
              },
              {
                id: 11,
                displayCost: '20$'
              },
              {
                id: 12,
                displayCost: '50$'
              }
            ],

            donationSelected: 9
          },
          {
            id: 4,
            header: 'List of templates',
            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
            buttonEnabled: true,

            donationOptions: [
              {
                id: 13,
                displayCost: '5$'
              },
              {
                id: 14,
                displayCost: '10$'
              },
              {
                id: 15,
                displayCost: '20$'
              },
              {
                id: 16,
                displayCost: '50$'
              }
            ],

            donationSelected: 13
          },
          {
            id: 5,
            header: 'Manage log settings',
            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
            buttonEnabled: true,

            donationOptions: [
              {
                id: 17,
                displayCost: '5$'
              },
              {
                id: 18,
                displayCost: '10$'
              },
              {
                id: 19,
                displayCost: '20$'
              },
              {
                id: 20,
                displayCost: '50$'
              }
            ],

            donationSelected: 17
          },
          {
            id: 6,
            header: 'Emergency Alert System',
            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
            buttonEnabled: true,

            donationOptions: [
              {
                id: 21,
                displayCost: '5$'
              },
              {
                id: 22,
                displayCost: '10$'
              },
              {
                id: 23,
                displayCost: '20$'
              },
              {
                id: 24,
                displayCost: '50$'
              }
            ],

            donationSelected: 21
          }
        ],

        selectedDonation: null
      }
    },

    mounted () {
      location.href.replace(this.$route.fullPath, '')
    },

    methods: {
      getRedirectLink (header) {
        let result = '/donation-make?header=' + header

        if (this.$route.query) {
          const query = this.$route.query

          if (query.back) {
            result += '&back=' + query.back
          }

          if (query.username) {
            result += '&username=' + query.username
          }

          if (query.email) {
            result += '&email=' + query.email
          }
        }
        
        return result
      },

      stripeRedirect (sku) {
      },

      getStripeSKU (product) {
        switch (product) {
          case 1: return 'sku_FD0bQzJPJHAWVl'
          case 2: return 'sku_FD0bKirEIokoX8'
          case 3: return 'sku_FD0b8MR9Wax9Sa'
          case 4: return 'sku_FD0bA5SXFQcWXz'
          case 5: return 'sku_FCxvk5M8JNQRkx'
          case 6: return 'sku_FCxvk5M8JNQRkx'
          default: return 'sku_FCxvk5M8JNQRkx'
        }
      }
    }
  }
</script>

<style lang="scss">
  body {
    overflow-x: hidden;
  }
</style>

<style lang="scss" scoped>
  @font-face {
    font-family: "Ubu11ntu";
    src: url('/static/fonts/Ubuntu-Regular.ttf') format("truetype");
    font-weight: normal;
  }
  
  // page's styles

  .donation-choose {
    z-index: 2;

    padding: 20px;
    width: 100vw; 

    .page-header {
      margin: 20px auto;

      font-family: 'Ubu11ntu', sans-serif;
      font-size: 2em;
      font-weight: bold;

      color: whitesmoke;

      .description {
        font-size: 18px;
        margin: 20px auto;
        font-weight: normal;
      }
    }

    .main {
      width: 100%;
      margin-top: 120px;

      .header {
        font-family: 'Ubu11ntu', sans-serif;
        font-size: 28px;
        color: black;
        margin: 20px auto;
        max-width: 600px;
        margin-bottom: 20px;
      }

      .feature-donation-container {
        max-width: 1065px;
        margin: 0 auto;
        display: grid;
        grid-gap: 20px;
        grid-template-columns: repeat(auto-fill, minmax(335px, 1fr));        

        .feature-donation {
          padding: 20px;
          border: 1px solid lightgray;
          border-radius: 5px;
          background-color: white;

          max-width: 400px;
          min-width: 300px;
          margin: 0 auto;

          display: grid;
          grid-gap: 20px;

          .header {
            font-size: 24px;
            margin: 0;
            color: black;
          }

          .text {
            text-align: left;
          }
        }
      }
    }
  }

  // reponsive

  @media (max-width: 440px) {
    .background-header-rectangle {
      height: 300px !important;
    }

    .background-wave-curve {
      top: 299px !important;
    }

    .main {
      margin-top: 100px !important;
    }
  }

  // svg's styles

  $gradient-start-color: #99c1fd;

  .background-top-curve {
    position: absolute;
    top: 50px;
    left: 0;

    width: 70vw;
    
    height: auto;

    path {
      fill: #99c1fd;
    }
  }

  .background-bottom-curve {
    position: absolute;
    right: 0;
    bottom: 0;

    width: 50vw;
    height: auto;

    path {
      fill: #fedba4;
    }
  }

  .background-wave-curve {
    position: absolute;
    top: 200px;
    left: 0;

    min-width: 100vw;
    height: auto;

    transform: rotateX(180deg);

    path {
      fill: #1f57ac;
    }
  }

  .background-header-rectangle {
    background-color: #1f57ac;
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 200px;
  }

  .page-container {
    position: relative;
    background-color: whitesmoke;
    
    min-height: 100vh;
    min-width: 100vw;

    display: flex;
    flex-direction: column;
    align-items: center;

    text-align: center;
  }
</style>