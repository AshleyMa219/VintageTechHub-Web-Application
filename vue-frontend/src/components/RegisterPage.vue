<template>
  <div class="register-page">
    <el-card>
      <h2>Register</h2>
      <el-form
          class="register-form"
          :model="model"
          :rules="rules"
          ref="form"
          @submit.prevent="register"
      >
        <el-form-item prop="username">
          <el-input v-model="model.username" placeholder="Email"></el-input>
        </el-form-item>
        <el-form-item prop="firstname">
          <el-input v-model="model.firstname" placeholder="First Name"></el-input>
        </el-form-item>
        <el-form-item prop="lastname">
          <el-input v-model="model.lastname" placeholder="Last Name"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
              v-model="model.password"
              placeholder="Password"
              type="password"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
              :loading="loading"
              class="register-button"
              type="primary"
              native-type="submit"
              block
          >Register</el-button>
        </el-form-item>
        <a class="forgot-password" href="#" v-on:click="goForgotPasswordPage()" style="display: inherit">Forgot password?</a>
        <a class="forgot-password" href="#" v-on:click="goLoginPage()" style="display: inherit">Go back to Login</a>
      </el-form>
    </el-card>
  </div>
</template>

<script>

export default {
  name: "registerPage",
  data() {
    var checkEmail = (rule, value, callback) => {
      const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
      setTimeout(() => {
        if (mailReg.test(value)) {
          callback()
        } else {
          callback(new Error())
        }
      }, 100)
    }
    return {
      model: {
        username: "",
        password: "",
        firstname: "",
        lastname: "",
      },
      loading: false,
      rules: {
        username: [
          {
            required: true,
            message: "Email is required",
            trigger: "blur"
          },
          {
            validator: checkEmail,
            message: "Please check email format",
            trigger: "blur"
          },
          {
            min: 4,
            message: "Email length should be at least 5 characters",
            trigger: "blur"
          }
        ],
        firstname: [
          {
            required: true,
            message: "Firstname is required",
            trigger: "blur"
          },
          {
            min: 3,
            message: "Firstname length should be at least 3 characters",
            trigger: "blur"
          }
        ],
        lastname: [
          {
            required: true,
            message: "Lastname is required",
            trigger: "blur"
          },
          {
            min: 3,
            message: "Lastname length should be at least 3 characters",
            trigger: "blur"
          },
        ],
        password: [
          {
            required: true,
            message: "Password is required",
            trigger: "blur"
          },
          {
            min: 5,
            message: "Password length should be at least 5 characters",
            trigger: "blur"
          }
        ]
      }
    }
  },
  methods: {
    goForgotPasswordPage(){
      this.$emit('goForgotPasswordPage','goForgotPasswordPage');
    },
    goLoginPage(){
      this.$emit('goLoginPage','goLoginPage');
    },
    async register() {
      let valid = await this.$refs.form.validate();
      if (!valid) {
        return null;
      } else {
        try {
          const params = {
            email: this.model.username,
            password: this.model.password,
            firstname: this.model.firstname,
            lastname: this.model.lastname
          }
          const response = await this.$axios.get('api/register/createUser', {params});
          this.response = response.data;
        } catch (error) {
          console.error('Error:', error.message);
        }
        if (await this.response[0]['result'] === 'user already exist'){
          this.$message.error("Your email already registered!");
        }
        else if(await this.response[0]['result'] === 'Success'){
          this.$message.success("Register Success,Please verify you email!");
          this.$emit('goLoginPage','goLoginPage');
        }
      }
    }
  }
}
</script>

<style scoped>
.register-page {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.register-button {
  width: 100%;
  margin-top: 40px;
}
.register-form {
  width: 290px;
}
</style>
<style lang="scss" scoped>
$teal: rgb(0, 124, 137);
.el-button--primary {
  background: $teal;
  border-color: $teal;

  &:hover,
  &.active,
  &:focus {
    background: lighten($teal, 7);
    border-color: lighten($teal, 7);
  }
}
.login .el-input__inner:hover {
  border-color: $teal;
}
.login .el-input__prefix {
  background: rgb(238, 237, 234);
  height: calc(100% - 2px);
  left: 1px;
  top: 1px;
  border-radius: 3px;
  .el-input__icon {
    width: 30px;
  }
}
.login .el-input input {
  padding-left: 35px;
}
.login .el-card {
  padding-top: 0;
  padding-bottom: 30px;
}
h2 {
  letter-spacing: 1px;
  font-family: Roboto, sans-serif;
  padding-bottom: 20px;
}
a {
  color: $teal;
  text-decoration: none;
  &:hover,
  &:active,
  &:focus {
    color: lighten($teal, 7);
  }
}
.login .el-card {
  width: 340px;
  display: flex;
  justify-content: center;
}
</style>

