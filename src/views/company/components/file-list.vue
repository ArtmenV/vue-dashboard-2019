<template>
  <div class="file-list-container">
    <div class="header">
      Cloud files
    </div>

    <div
      class="file"
      v-for="file in list"
      :key="file.block_list_id"
      @click="handleFileSelect(file)"
      :class="{'is-selected': selected === file.block_list_id}"
    >
      {{ file.name }}
    </div>
  </div>
</template>

<script>
  export default {
    props: [
      'list'
    ],

    data () {
      return {
        selected: -1
      }
    },

    methods: {
      getArrayOfAllCollapseItemsNames (files) {
        return files.reduce((acc, cur) => {
          acc.push(cur.name)
          return acc
        }, [])
      },

      getIconClassFromFileType (type) {
        switch (type) {
          case 'B': return 'business'
          case 'H': return 'home'
          default: return 'unknown'
        }
      },

      handleFileSelect (file) {
        this.selected = file.block_list_id
        this.$emit('selected-file-changed', file)
      }
    }
  }
</script>

<style lang="scss">
  .file-list-container {
    .el-collapse {
      border: 0;
    }
    .el-collapse-item__wrap {
      border-bottom: none;
    }

    .el-collapse-item__header {
      border-bottom: none;
      line-height: 25px;
      height: 25px;
      padding-right: 5px;
      user-select: none;
    }

    .el-collapse-item__arrow {
      line-height: 25px;
    }
  }
</style>

<style lang="scss" scoped>
  .file-list-container {
    border: 1px solid #e4e7ed;
    .header {
      background-color: #f5f7fa;
      padding: 5px;
      text-align: center;
      color: #303133;
      font-size: 18px;
    }

    .file {
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

        .type-icon {
          margin-right: 5px;
          font-size: 15px;
        }
      }

      &.is-selected {
        background-color: lightblue;
        .icon-btn {
          color: rgba(0, 0, 255, 0.7);

          &:hover {
            color: rgba(0, 0, 255, 1);
          }
        }
      }
    }
  }
</style>
