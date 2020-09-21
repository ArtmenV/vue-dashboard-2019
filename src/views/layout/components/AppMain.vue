<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <router-view/>
    </transition>

    <div class="legal" v-if="$route.path !== '/plan-upgrade'">
    <div class="legal-link">
      <a
        class="legal-link-icon"
        target="_blank"
        href="https://nextvectorsecurity.com/donate/"
      >
        <div class="donate-icon">
          <svg width="20" height="20" viewBox="0 0 104 104" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M88.7695 15.2303C78.9482 5.40902 65.8899 0 52 0C38.1103 0 25.052 5.40902 15.2305 15.2303C5.40902 25.0518 0 38.1101 0 52C0 65.8899 5.40881 78.9482 15.2305 88.7697C25.052 98.591 38.1103 104 52 104C65.8899 104 78.9482 98.591 88.7697 88.7697C98.5912 78.9482 104 65.8899 104 52C104 38.1101 98.5912 25.0518 88.7695 15.2303ZM55.2638 74.6281H55.0469V81.3721C55.0469 83.0548 53.6829 84.419 52 84.419C50.3175 84.419 48.9531 83.0548 48.9531 81.3721V74.6281H42.2096C40.5271 74.6281 39.1627 73.2639 39.1627 71.5812C39.1627 69.8986 40.5271 68.5344 42.2096 68.5344H55.264C58.9824 68.5344 62.0076 65.509 62.0076 61.7906C62.0076 58.0722 58.9822 55.0469 55.2638 55.0469H48.7364C41.6579 55.0469 35.8991 49.2881 35.8991 42.2096C35.8991 35.1309 41.6581 29.3721 48.7364 29.3721H48.9531V22.6283C48.9531 20.9456 50.3175 19.5815 52 19.5815C53.6829 19.5815 55.0469 20.9456 55.0469 22.6283V29.3721H61.7908C63.4733 29.3721 64.8377 30.7363 64.8377 32.419C64.8377 34.1016 63.4733 35.4658 61.7908 35.4658H48.7364C45.0178 35.4658 41.9928 38.491 41.9928 42.2096C41.9928 45.928 45.018 48.9531 48.7364 48.9531H55.2638C62.3423 48.9531 68.1011 54.7121 68.1011 61.7906C68.1011 68.8691 62.3423 74.6281 55.2638 74.6281Z" fill="#409EFF"/>
          </svg>
        </div>
      </a>
      
      <a
        class="legal-link"
        target="_blank"
        href="https://nextvectorsecurity.com/donate/"
      >
        Donate
      </a>

      <a
        class="legal-link"
        target="_blank"
        href="/terms-and-conditions"
      >
        Terms and conditions
      </a>

      <a
        class="legal-link"
        target="_blank"
        href="/privacy-and-policy"
      >
        Privacy and policy
      </a>
    </div>
  


    </div>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
}
</script>

<style scoped>
  .app-main {
    min-height: calc(100vh - 50px);
    position: relative;
    overflow: hidden;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
</style>

<style lang="scss" scoped>
  .legal {
    margin-left: 20px;
    margin-bottom: 10px;

    .donate-icon {
      color: blue;
      width: 20px;
    }

    &-link {
      display: flex;
      margin-right: 20px;
      transition: all .2s ease-in;
      color: #409EFF;
      text-decoration: underline;

      .legal-link-icon {
        margin-right: 4px;
      }

      &:hover {
        color: rgb(30, 143, 255);
      }
    }
  }
</style>

