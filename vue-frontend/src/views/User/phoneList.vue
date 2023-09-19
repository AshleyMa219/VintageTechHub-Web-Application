<template>
  <div class="phoneList">
    <!-- <el-button class="addBtn" type="success" @click="dialogVisible = true"> New </el-button> -->
    <addDialog :dialog-visible="dialogVisible" @close="close" />

    <el-table
      :data="tableData"
      height="450"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >

    <!-- <el-table-column align="center" label="Operation">
        <template #default="{ row }">
          <el-button
            :disabled="row.disabled"
            @click="handleEnableDisable(row)"
          >
            {{ row.disabled ? 'Disabled' : 'Enabled' }}
          </el-button>
        </template>
      </el-table-column> -->

    <!-- @click="handleSelectionChange(row)" -->
    <!-- <el-table-column  prop="title" label="Enable / Disable">
      <el-table-column type="selection" width="80">
      </el-table-column>
      </el-table-column> -->
      <!-- <el-table-column align="center" label="Operation">
        <template #default="{ row }">
          <el-button
            type="primary"
            :disabled="row.disabled"
            @click="handleSelectionChange()"
          >
          Enable / Disable
          </el-button>
        </template>
      </el-table-column> -->

      <el-table-column align="center" prop="title" label="Product title">
      </el-table-column>
      <el-table-column align="center" prop="brand" label="Brand">
      </el-table-column>
      <el-table-column align="center" prop="price" label="Price">
      </el-table-column>
      <el-table-column align="center" prop="stock" label="Storage">
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
      <el-table-column align="center" label="Operation">
        <template #default="{ row }">
          <el-button
            
            type="danger"
            :disabled="row.disabled"
            @click="handleDelete(row)"
          >
            delete
          </el-button>

          <el-button type="warning" v-if="!row.disabled" @click="handleDisable(row)">
  Disable
  </el-button>
  <el-button type="primary" v-else @click="handleEnable(row)">
  Enable
  </el-button>

        </template>
      </el-table-column>
    </el-table>
    </div>
</template>

<script>
import addDialog from "./dialog.vue";
export default {
  async mounted() {
    await this.initData();
  },
  components: {
    addDialog,
  },
  data() {
    return {
      id:localStorage.getItem("id"),
      tableData: [],
      dialogVisible: false,
    };
  },
  methods: {
    async initData() {
      const id = localStorage.getItem("id");
      const { data } = await this.$axios.get(`api/user/phonelist?id=${id}`);
      if (data.code === 200) {
        this.tableData = data.data;
      } else {
        this.tableData = [];
        this.$message.warning("failed to get the list");
      }
    },

       async handleDisable(row){
     await this.$axios.post('api/phone/disable',{
      params:{
        _id: row._id,
        disabled: true
      }
     }).then(() => {
      const index = this.tableData.indexOf(row)
      this.tableData[index].disabled = true
      this.$message('disabled!')
     })
   },
   async handleEnable(row){
     await this.$axios.post('api/phone/disable',{
      params:{
        _id: row._id,
        disabled: false
      }
     }).then(() => {
      const index = this.tableData.indexOf(row)
      this.tableData[index].disabled = false
      this.$message('enabled!')
     })
   },

     handleEnableDisable(row) {
      row.disabled = !row.disabled;
      const { data } =  this.$axios.post(
        "api/phone/disable",
        { _id: row._id, disabled: row.disabled }
      );
      if (data.code !== 200) {
        this.$message.warning(data.message);
      }
    },
    
    async handleDelete(row) {
      this.$confirm("confirm to delete?", {
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
        type: "warning",
      })
        .then(async () => {
          const { data } = await this.$axios.post(
            `api/user/phonelist/delete/${row._id}`);
          // console.log(row._id);
          if (data.code === 200) {
            this.$message.success(data.message);
            await this.initData();
          } else {
            this.$message.warning(data.message);
          }
        })
        .catch((err) => {
          if (err === "cancel") {
            this.$message.info("cancel");
          } else {
            this.$message.error(err.message);
          }
        });
    },
    showModal() {
      this.dialogVisible = true;
      console.log(this.dialogVisible)
      // console.log(this.show)
    },
    // closeModal(data) {
    //   this.show = false;
    // },
    
    async close(val) {
      this.dialogVisible = false;
      if (val === "success") {
        console.log("success");
        await this.initData();
      }
    },
    
    // handleSelectionChange(val) {
      async handleSelectionChange(val) {
      console.log(val);
      // console.log(val[0]._id);
      // console.log(val);
      await this.$axios.post(
            'api/phone/disable',{
              params:{
                _id:val[0]._id,
                disabled: false
              }
            });

      const _ids = [];
      if (val.length) {
        for (const i of val) {
          i.disabled = true;
          _ids.push(i._id);
          console.log(_ids);
        }
      }
      for (const i of this.tableData) {
        if (!_ids.includes(i._id)) i.disabled = false;
      }
    },
  },

};
</script>