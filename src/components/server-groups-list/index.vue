<template>
  <div class="container">
    <el-table :data="groupList" v-loading="loading" border>
      <el-table-column
        prop="name"
        label="Name">
      </el-table-column>
      <el-table-column
        prop="description"
        label="Description">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="Actions">
        <template slot-scope="scope">
          <el-button type="text" size="small">Detail</el-button>
          <el-button type="text" size="small">Edit</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        loading: true,
        groupList: []
      }
    },

    mounted () {
      this.getGroupList()
    },

    methods: {
      getGroupList () {
        this.loading = true
        setTimeout(() => {
          this.groupList = [
            {
              name: 'Sample group',
              description: 'Just sample server group'
            },
            {
              name: 'Server group',
              description: 'Another server group'
            },
            {
              name: 'Cool group',
              description: 'Cool srever group because something'
            },
            {
              name: 'Awesome group',
              description: 'Best group ever done btw I like it :)'
            }
          ]     
          this.loading = false     
        }, 750);
      }
    }
  }
</script>
