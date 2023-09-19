<template>
  <div class="comments">
    <el-table
      :data="tableData"
      :row-style="setRowStyle"
      height="450"
      style="width: 100%"
      :row-class-name="getRowClassName"
    >
      <el-table-column align="center" prop="title" label="Title">
      </el-table-column>
      <el-table-column align="center" prop="image" label="Image">
        <template #default="{ row }">
          <el-image
            style="height: 45px;"
            :src="require(`../../assets/image/${row.brand}.jpeg`)"
            fit="cover"
          />
        </template>
      </el-table-column>
      <el-table-column align="center" prop="rating" label="Rating">
        <template #default="{ row }">
          <span>
              <img v-for="star in row.rating" :alt="star" src="../../assets/image/star.png" width="30" height="30">
              <img v-for="outline in 5 - row.rating" :alt="outline" src="../../assets/image/no-star.png" width="30" height="30">
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="comment" label="Comment">
      </el-table-column>
        <el-table-column width="100" align="center" label="Hidden" prop="hidden">
          <template #default="{ row }">
            <input
                type="checkbox"
                :value="row"
                :checked="row.hidden"
                v-model="select"
                @change="hidden(row)"
            >
          </template>
  </el-table-column>

    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        { hidden: true, checked: true },
        { hidden: false, checked: false },
        { hidden: null, checked: false },
      ],
    };
  },
  async created() {
    await this.initData();
  },
  computed: {

  },
  methods: {
    getRowClassName({ row }){
      return {
      [row.id]: true,
    };
    },
    setRowStyle({ row }) {
      if (row.hidden) {
        return 'background-color: aliceblue;';
      } else {
        return '';
      }
    },
    async hidden(row) {
      const data = await this.$axios.get('api/user/changeComment', {
            params:{
              reviewer: row.reviewer,
              id: row.id,
            }
          })
      const tr = document.getElementsByClassName(row.id);
      if (tr[0].style.backgroundColor === 'aliceblue') {
        tr[0].style.backgroundColor = '';
      } else {
        tr[0].style.backgroundColor = 'aliceblue';
      }
    },
    async initData() {
      const userId = localStorage.getItem("id")
      const { data } = await this.$axios.get(`api/user/comments?id=${userId}`);
      if (data.code === 200) {
        this.tableData = data.data.map(item => ({ ...item, showComments: true }));
    //     try {
    //   n.image = require('../assets/image/' + n.brand + '.jpeg')
    //  } catch (error) {
    //   console.log(error);
    //   n.image = require('../assets/image/no.jpg')
    //  }
      } else {
        this.tableData = [];
        this.$message.warning("failed to get form data");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.comments {
  width: 95%;
  margin: 40px auto 0;
  .contents {
    .user {
      text-align: right;
      margin: 5px 0;
    }
  }
}
</style>