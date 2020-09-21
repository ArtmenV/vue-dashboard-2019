<template>
  <div class="page-container">
    <div class="message">
      <header class="header">
        Oops...
      </header>
      Your donation failed, please try again later.
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
  export default {
    methods: {
      loginRedirect () {
        this.$store.dispatch('LogOut')
        this.$router.push('/login')
      }
    }
  }
</script>


<style lang="scss" scoped>
  @font-face {
    font-family: "Ubu11ntu";
    src: url('/static/fonts/Ubuntu-Regular.ttf') format("truetype");
    font-weight: normal;
  }

  $gradient-start-color: #99c1fd;

  .background-top-curve {
    position: absolute;
    top: 0;
    left: 0;

    min-width: 100vw;
    height: auto;

    path {
      fill: #99c1fd;
    }
  }

  .background-bottom-curve {
    position: absolute;
    right: 0;
    bottom: 0;

    min-width: 50vw;
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
    background-color: whitesmoke;
    
    min-height: 100vh;
    min-width: 100vw;

    display: flex;
    flex-direction: column;
    align-items: center;

    text-align: center;

    .header {
      font-family: 'Ubu11ntu', sans-serif;
      font-size: 28px;

      position: relative;
      z-index: 2;

      margin-bottom: 20px;
    }

    .message {
      font-family: 'Ubu11ntu', sans-serif;
      font-size: 24px;

      position: relative;
      z-index: 2;

      margin-top: auto;
      margin-bottom: auto;

      .link-to-login {
        text-decoration: underline;
        color: rgb(71, 71, 255);

        transition: all .2s ease-in-out;

        &:hover {
          color: blue;
          cursor: pointer;
        }
      }
    }
  }
</style>