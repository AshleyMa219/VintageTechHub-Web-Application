<template>
  <div class="profile">
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="first-name ">
        <el-input v-model="form.firstname"></el-input>
      </el-form-item>
      <el-form-item label="last-name ">
        <el-input v-model="form.lastname"></el-input>
      </el-form-item>
      <el-form-item prop="email" label="email ">
        <el-input v-model="form.email" :disabled=true></el-input>
      </el-form-item>
      <el-form-item>
      <el-button @click="onSubmit">Update</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        firstname: "",
        lastname: "",
        email: "",      
      },
      rules: {email: [{ required: true, message: "please type in the email", trigger: "blur" }],},
    };
  },
  methods: {
    async onSubmit() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          this.$prompt("please type in the password", "Verify", {
            confirmButtonText: "confirm",
            cancelButtonText: "cancel",
          })
              .then(async ({ value }) => {
                const params = {
                "id" : localStorage.getItem("id"),
                "firstname":this.form.firstname,
                "lastname":this.form.lastname,
                "email": this.form.email,
                "password" : value,
              }

              console.log(params)

              const response = await this.$axios.post("api/profile/updateInfo", params)
              if (response.data["msg"]==="Incorrect Password"){
                this.$message.error("Incorrect Password!");
              }
              else if (response.data["msg"]==="Success"){
                this.$message.success("Profile Update Success!");

                localStorage.setItem('username', this.form.firstname +' '+ this.form.lastname)
      this.$router.push("/index");
      // localStorage.clear();

              }

              })
              .catch(() => {
                this.$message.error("operation failed");
              });
        }
      });
    },
  },

  mounted() {
    const username = localStorage.getItem("username");
    const [firstname, lastname] = username.split(" ");
    this.form.firstname = firstname;
    this.form.lastname = lastname;
    this.form.email = localStorage.getItem("email");
    console.log(localStorage.getItem("email"))
  },
};
</script>

<style lang="scss" scoped>
.profile {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
}
.el-button {
  // width: 100%;
  background-color: #69af73;
  color: #fff;
}
</style>

