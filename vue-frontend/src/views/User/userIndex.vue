<template>
  <div>
    <div class="head">

      <div class="head-title" v-if="!$route.query.email" >
        <span @click="$router.push('/index')">
          - User Page - 
        </span>
        
      </div>
<!-- ---------------------------  top bar  -->
      <div class="head-link" v-if="!$route.query.email">
        <router-link 
            :class="{ active: $route.path === '/user' }" to="/user"
        >Password</router-link>
        
        <router-link
            :class="{ active: $route.path === '/user/edit' }" to="/user/edit"
        >Edit-Profile</router-link>

        <router-link
            :class="{ active: $route.path === '/user/phones' }" to="/user/phones"
        >Phone-List</router-link>

        <router-link
            :class="{ active: $route.path === '/user/comments' }" to="/user/comments"
            style="margin-right: 20px"
        >Comments</router-link>

        <span class="goHome" @click="out">Sign-out </span>
        
        <el-button  @click="$router.push('/index')">Return</el-button>
      </div>
    </div>
<!-- ---------------------------  content  -->
    <div class="footer" v-if="$route.path === '/user'">
      <h4>Update Password</h4>

      <el-form ref="form" :model="form" :rules="rules" label-width="100px">

        <el-form-item v-if="!$route.query.email" prop="oldPassword" label="Old : ">
          <el-input type="password" v-model="form.oldPassword"></el-input>
        </el-form-item>

        <el-form-item prop="newPassword" label="New : ">
          <el-input type="password" v-model="form.newPassword"></el-input>
        </el-form-item>

      <el-form-item>
        <div class="operation">
          <el-button class="submit" @click="onSubmit">Confirm</el-button>
        </div>
      </el-form-item>
      </el-form>
    </div>

    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        oldPassword: "",
        newPassword: "",

        id: localStorage.getItem("id"),
        email: localStorage.getItem("email"),
        lastname: "",
        firstname: "",

      },
      rules: {
        oldPassword: [{ required: true, message: "old password", trigger: "blur" },],
        newPassword: [{ required: true, message: "new password", trigger: "blur" }],
        newPassword: [
    { required: true, message: "please type in the password", trigger: "blur" },
    { min: 5, message: "at least 5 characters", trigger: "blur" }
  ]
      },
    };
  },
  methods: {
    async onSubmit() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          const params = {
            "id" : localStorage.getItem("id"),
            "oldPassword" : this.form.oldPassword,
            "newPassword" : this.form.newPassword,
          }
          const response = await this.$axios.post("api/profile/updatepsd", params)
          if (response.data["msg"]==="Incorrect Password"){
            this.$message.error("Incorrect Password!");
          }
          else if (response.data["msg"]==="Success"){
            this.$message.success("Password Update Success!");
          }
        }
      });
    },
    

    out() {
      this.$router.push("/index");
      localStorage.clear();
    },
  },

  mounted() {

    const username = localStorage.getItem("username");
    const [firstname, lastname] = username.split(" ");
    this.form.firstname = firstname;
    this.form.lastname = lastname;
    this.form.email = localStorage.getItem("email");
  },

};
</script>

<style lang="scss" scoped>
.head {
  height: 56px;
  line-height: 56px;
  background-color: #fff;
  color: #86ca90;
  display: flex;
  justify-content: space-between;
  &-title {
    padding-left: 50px;
    font-family: sans-serif;
    color: #6eb06a;
    font-size: 24px;
    font-weight: 600;
  }
  &-link {
    padding-right: 50px;
    a {
      font-size: 15px;
      color: rgba(0, 0, 0, 0.3);
      margin: 0px 10px;
      text-decoration: none;
      &:hover {
        color: #86ca90;
      }
    }
    .active {
      color: #000;
    }
  }
}

// .banner {
//   width: 100%;
//   height: 150px;
//   background: #86ca90;
//   color: white;
//   box-shadow: inset 0 8px 8px -8px rgba(0, 0, 0, 0.3),
//   inset 0 -8px 8px -8px rgba(0, 0, 0, 0.3);
//   padding-top: 10px;
//   &-title {
//     text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
//     font-weight: 700 !important;
//     text-align: center;
//     font-size: 48px;
//     padding-bottom: 8px;
//   }
//   p {
//     color: #fff;
//     text-align: center;
//     font-size: 24px;
//     font-weight: 300 !important;
//     margin-bottom: 0;
//   }
// }

.footer {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

h4 {
  text-align: left;
  margin-left: 24px;
  margin-bottom: 20px;
}
.el-button {
  // width: 100%;
  background-color: #69af73;
  color: #fff;
}
.operation {
  // display: flex;
  // justify-content: space-between;
  padding: 0 10px;
}

.goHome {
  cursor: pointer;
  font-size: 24px;
  font-weight: 600;
}
</style>
