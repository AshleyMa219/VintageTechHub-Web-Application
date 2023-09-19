<template>
  <div class="login-page">
    <el-card>
      <h2>Login</h2>
      <el-form
          class="login-form"
          :model="model"
          :rules="rules"
          ref="form"
          @submit.prevent="login"
      >
        <el-form-item prop="username">
          <el-input v-model="model.username" placeholder="Username"></el-input>
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
              class="login-button"
              type="primary"
              native-type="submit"
              block
          >Login</el-button>
        </el-form-item>
        <a class="forgot-password" href="#" v-on:click="goForgotPasswordPage()" style="display: inherit">Forgot password?</a>
        <a class="sign-up" href="#" v-on:click="goRegisterPage()" style="display: inherit">Don't have account? Go Register</a>
      </el-form>
    </el-card>
  </div>
</template>

<script>

export default {
  name: "loginPage",
  data() {
    const checkEmail = (rule, value, callback) => {
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
        password: ""
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
            message: "Email length should be at least 4 characters",
            trigger: "blur"
          }
        ],
        password: [
          {required: true, message: "Password is required", trigger: "blur"},
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
    goRegisterPage(){
      this.$emit('goRegisterPage','goRegisterPage');
    },
    goForgotPasswordPage(){
      this.$emit('goForgotPasswordPage','goForgotPasswordPage');
    },
    async login() {
      let valid = await this.$refs.form.validate();
      if (!valid) {
        return null;
      }else {
        await this.getPassword()
        if (
            await this.response[0]['result'] === true
        ) {
          this.$message.success("Login Successful!");
          const data = this.response[1];
          this.$emit('close',data);
          this.$router.go(0)
        } else if (await this.response[0]['result'] === 'user not exist') {
          this.$message.error("Email not exist!");
        } else if (await this.response[0]['result'] === 'Please Login to Your Email to Verify!') {
          this.$message.error("Please verify you email before you use!");
        }
        else {
          this.$message.error("Password is incorrect");
        }
      }
    },
    async getPassword() {
      await this.$axios.get('api/login/user', {
        params: {
          email: this.model.username,
          password: this.model.password
        },
      })
          .then((response) => {
            this.response = response.data;
          })
          .catch((error) => {
            console.error(error);
          });
    }
  }
}
</script>

<style scoped>

.login-page {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-button {
  width: 100%;
  margin-top: 40px;
}
.login-form {
  width: 290px;
}
.forgot-password {
  margin-top: 10px;
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

