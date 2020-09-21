<template>
  <div
    class="file-item"
    :class="{'is-active': state}"
    @click="$emit('change', id, !state, place)"
  >
    <div class="name">
      <i
        v-if="type || type === 0"
        class="material-icons-outlined type-icon"
      >
        {{ getIconClassFromFileType(type) }}
      </i>

      <div class="text">
        {{ name }}
      </div>
    </div>

    <el-button
      type="text"
      icon="el-icon-view"
      class="icon-btn"
      @click.stop="openFilePage"
    />
  </div>
</template>

<script>
  export default {
    props: [
      'id',
      'name',
      'state',
      'place',
      'type'
    ],

    methods: {
      openFilePage () {
        window.open(this.$router.resolve({path: '/action-files/' + this.id + '?back=' + this.$route.path}).href)
      },

      getIconClassFromFileType (type) {
        switch (type) {
          case 0: return 'business'
          case 1: return 'home'
          default: return 'unknown'
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .file-item {
    width: 100%;
    padding: 0 10px;
    cursor: pointer;
    user-select: none;
    transition: all .1s ease-in-out;
    height: 30px;

    display: flex;
    justify-content: space-between;
    align-items: center;

    .icon-btn {
      font-size: 18px;
    }

    .name {
      display: flex;
      align-items: center;

      .text {
        white-space: nowrap;
        max-width: 13em;
        font-size: 13px;
        color: rgb(48, 49, 51);
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .type-icon {
        margin-right: 5px;
        font-size: 15px;
      }
    }

    &.is-active {
      background-color: lightblue;
      .icon-btn {
        color: rgba(0, 0, 255, 0.7);

        &:hover {
          color: rgba(0, 0, 255, 1);
        }
      }
    }
  }
</style>
