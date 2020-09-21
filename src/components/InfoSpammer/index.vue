<template>
  <div class="spammer-container">
    <div class="exclamation-mark" @click="long = !long" >
      !
    </div>

    <div class="content" :class="{'is-visible': long}">
      <div class="text">
        {{ text }}
      </div> 

      <el-button
        class="close-btn" 
        type="text"
        icon="el-icon-close"
        @click="long = false"
      />
    </div>
  </div>
</template>

<script>

  export default {
    props: [
      'text'
    ],

    data () {
      return {
        long: true,

        loading: false,
      }
    },
  }
</script>


<style lang="scss" scoped>
  $circle-size: 60px;
  $exclamation-mark-size: 46px;
  $main-color: rgb(71, 71, 231);

  .spammer-container {
    position: fixed;
    z-index: 2000;

    transition: all .2s ease-in;

    padding: 0;
    
    height: $circle-size;
    bottom: 120px;
    left: 50px;
    background-color: whitesmoke;
    border-radius: 5px;

    display: flex;
    align-items: center;
    justify-content: center;

    overflow: hidden;

    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);

    &:hover {
      cursor: pointer;
      box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
    }

    .exclamation-mark {
      font-size: $exclamation-mark-size;
      font-weight: bold;

      color: whitesmoke;
      background-color: $main-color;
      user-select: none;

      padding: 0 30px;

      height: 100%;
      display: flex;
      align-items: center;
    }

    .content {
      height: 100%;
      display: flex;
      align-items: center;
      color: $main-color;

      background-color: whitesmoke;

      overflow: hidden;

      .close-btn {
        font-size: 40px;
        padding: 0 30px;
      }

      .subscribe-btn {
        margin-left: 30px;
      }

      transition: width .2s ease-in;

      pointer-events: none;
      opacity: 0;
      width: 0px;
      &.is-visible {
        opacity: 1;
        width: calc(100vw - 175px);
        pointer-events: initial;
        .text {
          width: auto;
          height: 1em;
        }
      }

      .text {
        margin-left: auto;
        overflow: hidden;
        transition: all .2s ease-in;
      }
    }
  }
</style>

