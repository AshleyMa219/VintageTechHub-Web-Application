<template>
  <div class="forgotPasswordPage">
    <el-card>
      <h2>ForgotPassword</h2>
      <el-form
          class="forgotPassword-form"
          :model="model"
          :rules="rules"
          ref="form"
          @submit.prevent="forgotPasswordPage"
      >
        <el-text>Please Send Email follow the steps in your email.</el-text>
        <el-form-item prop="username">
          <el-input v-model="model.username" placeholder="Email"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
              :loading="loading"
              class="forgotPassword-button"
              type="primary"
              native-type="submit"
              block
          >Send Email</el-button>
        </el-form-item>
        <a class="forgot-password" href="#" v-on:click="goLoginPage()" style="display: inherit">Go back to Login</a>
        <a class="sign-up" href="#" v-on:click="goRegisterPage()" style="display: inherit">Don't have account? Go Register</a>
      </el-form>
    </el-card>
  </div>
</template>

<script>

export default {
  name: "forgotPasswordPage",
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
        ]
      }
    }
  },
  methods: {
    goRegisterPage(){
      this.$emit('goRegisterPage','goRegisterPage');
    },
    goLoginPage(){
      this.$emit('goLoginPage','goLoginPage');
    },
    async forgotPasswordPage() {
      let valid = await this.$refs.form.validate();
      if (!valid) {
        return null;
      } else {
        try {
          const params = {
            email: this.model.username
          }
          const response = await this.$axios.get('api/reset/resetPassword', {params});
          this.response = response.data;
        } catch (error) {
          console.error('Error:', error.message);
        }
        if (await this.response[0]['result'] === 'user not exist'){
          this.$message.error("Your email not registered! Please register first!");
        }
        else if(await this.response[0]['result'] === 'Success'){
          this.$message.success("Reset request success,please check you email!");
          this.$emit('goLoginPage','goLoginPage');
        }
      }
    }

  }
}
</script>

<style scoped>

.forgotPasswordPage {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.forgotPassword-button {
  width: 100%;
  margin-top: 40px;
}
.forgotPassword-form {
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
.el-input__inner {
  border-color: $teal;
}
.register-page .el-input__inner:hover {
  border-color: $teal;
}
 .el-input__prefix {
  background: rgb(238, 237, 234);
  height: calc(100% - 2px);
  left: 1px;
  top: 1px;
  border-radius: 3px;
  .el-input__icon {
    width: 30px;
  }
}
.register-page.el-input input {
  padding-left: 35px;
}
.register-page.el-card {
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
.register-form .el-card {
  width: 360px;
  display: flex;
  justify-content: center;
}
</style>

