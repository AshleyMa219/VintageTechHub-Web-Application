<template>
  <div class="card">
    <el-card>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px"
      title="new product info"
        :visible="dialogVisible"
        width="30%"
        @close="$emit('close')"
        >
        <el-form-item >New Phone</el-form-item>
        <el-form-item prop='title' label="Title">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item prop='brand' label="Brand">
      <el-select v-model="form.brand" placeholder="select Brand" @change="updateImage">
        <el-option label="Apple" value="Apple" />
        <el-option label="HTC" value="HTC" />
        <el-option label="Huawei" value="Huawei" />
        <el-option label="LG" value="LG" />
        <el-option label="Motorola" value="Motorola" />
        <el-option label="Nokia" value="Nokia" />
        <el-option label="Samsung" value="Samsung" />
        <el-option label="Sony" value="Sony" />
      </el-select>
    </el-form-item>
        <el-form-item prop='price' label="Price">
          <el-input v-model="form.price"></el-input>
        </el-form-item>
        <el-form-item prop='stock' label="Storage">
          <el-input v-model="form.stock"></el-input>
        </el-form-item>
      <el-form-item>
        <el-button type="info" @click="$emit('close')"> Cancel </el-button>
        <el-button type="success" @click="submit"> Confirm </el-button>
      </el-form-item>
      </el-form>
  </el-card>
  </div>
</template>


<script>
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["close"],
  data() {
    return {
      form:{
        title:'',
        brand:'',
        price:'',
        stock:'',
        image:'',
        seller:localStorage.getItem("id")
      },
      rules:{
        title:[{ required: true, message: "title", trigger: "blur" }],
        brand:[{ required: true, message: "brand", trigger: "blur" }],
        price:[{ required: true, message: "price", trigger: "blur" }],
        stock:[{ required: true, message: "storage", trigger: "blur" }],
      }
    };
  },
  methods: {
    submit() {
      this.$refs.form.validate(async (valid)=>{
        if(valid){
          const { data } = await this.$axios.post('api/user/phonelist/add',this.form)
          if(data.code === 200){
            this.$emit('close','success')
            this.$message.success(data.message)
          }else{
            this.$message.warning(data.message)
          }
        }
      })
    },
    updateImage() {
      this.form.image = this.form.brand;
    },
  },
};
</script>

<style lang="scss" scoped>
.el-card {
  padding-top: 0;
  padding-bottom: 30px;

  width: 600px;
  display: flex;
  justify-content: center;
}
.card {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>