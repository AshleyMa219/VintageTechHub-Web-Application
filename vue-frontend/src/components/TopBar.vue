<template>
  <div class="wrapper">
    <div class="title" @click="backToHome()">
      <p>OldPhoneDeals</p>
    </div>
    <div class="main">
      <div class="inputs">
        <el-form  
          :inline="true" 
          :model="formData" 
          @submit.native.prevent
          class="search">
          <el-form-item prop="searchVal">
            <el-input
              v-model="formData.searchVal"
              class="searchInput"
              placeholder="Search"
              :prefix-icon="Search"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="searchBtn" @click="getSearchValue">Search</el-button>
          </el-form-item>
          <el-form-item v-if="this.$route.path == '/search'">
            <el-select 
            class="brandInput"
            v-model="selectBrand"
            value-key="selectBrand"
            placeholder="Brands" 
            @change="brandSelected">
              <el-option
                v-for="item in brands"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div class="slider" v-if="this.$route.path == '/search'">
            <div class="slider-title">Max</div>
            <el-slider class="range" v-model="selectPrice" :min="0" :max=800 @change="brandSelected" />
        </div>
      </div>

      <div class="checkOut">
        <el-button type="warning" @click="goCheckout">Check out</el-button>
      </div>
      <div class="userInfo">
        <el-button v-if="isLogin===false" class="signIn" type="primary" @click="showModal">Login</el-button>
        <div  v-if="show">
          <div class="modal-overlay" ></div>
          <div class="modal" ref="modal">
            <component :is="currentComponent" @close="closeModal"
                       @goRegisterPage="registerPageLoad" @goLoginPage="loginPageLoad"
                       @goForgotPasswordPage="forgotPasswordPageLoad">
            </component>
          </div>
        </div>
        <el-button v-if="isLogin===true" type="primary" @click="logout">LogOut</el-button>
        <el-button type="text" id="name" @click="$router.push('/user')">{{ this.username }}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { Search } from "@element-plus/icons-vue"
import LoginPage from "@/components/LoginPage.vue";
import registerPage from "@/components/RegisterPage.vue";
import forgotPasswordPage from "@/components/ForgotPasswordPage.vue";
export default {
  name: 'TopBar',
  components: {
    LoginPage,
    registerPage,
    forgotPasswordPage
  },
  computed: {
    isLogin() {
      return localStorage.getItem("isLogin");
    },
  },
  data() {
    return {
      show: false,
      formData:{
        searchVal: ''
      },
      // rule:{
      //   searchVal:[
      //     { required: true,  message: "keyword is required!", trigger: 'blur'}
      //   ]
      // },
      Search,
      brands:[
        "default","Apple", "BlackBerry", "HTC", "Huawei", "LG",
        "Motorola", "Nokia", "Samsung","Sony"
      ],
      selectBrand: null,
      selectPrice: null,
      isLogin: false,
      username: '',
      id: '',
      showLogin: false,
      currentComponent: 'LoginPage'
    }
  },
  mounted() {
    const isLogin = localStorage.getItem('isLogin');
    const username = localStorage.getItem('username');
    const id = localStorage.getItem('id');
    if (isLogin && username && id) {
      this.isLogin = true;
      this.username = username;
      this.id = id;
    }
    document.addEventListener('mousedown', this.handleClickOutside);
  },
  beforeDestroy() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  },
  methods: {
    handleClickOutside(event) {
      const modal = this.$refs.modal;
      if (!modal || modal.contains(event.target)) {
        return;
      }
      this.closePopUp();
    },
    registerPageLoad(){
      this.currentComponent = 'registerPage'
    },
    loginPageLoad(){
      this.currentComponent = 'LoginPage'
    },
    forgotPasswordPageLoad(){
      this.currentComponent = 'forgotPasswordPage'
    },
    logout() {
      this.isLogin = false;
      this.username = '';
      this.id = '';
      localStorage.removeItem('isLogin');
      localStorage.removeItem('username');
      localStorage.removeItem('id');
      this.$message.success("Logout Successful!");
      this.$router.push({path:'/'})
    },
    showModal() {
      this.show = true;
    },
    closeModal(data) {
      this.isLogin = true;
      this.username = data.firstname + " " + data.lastname;
      this.id = data._id;
      this.showLogin = false;
      localStorage.setItem('email', data.email);
      localStorage.setItem('isLogin', true);
      localStorage.setItem('username', this.username);
      localStorage.setItem('id', this.id);
      this.show = false;
    },
    closePopUp(){
      this.show = false;
    },
    getSearchValue(){
      if(this.selectBrand != null){
        this.selectBrand = this.brands[0].value
      }
      if(this.selectPrice != null){
        this.selectPrice = 0
      }
      this.$router.push({ path: '/search', query: { keyword: this.formData.searchVal}})
    },
    brandSelected(){
      if(this.selectPrice == 0){
        this.selectPrice = null
      }
      this.$router.push({ path: '/search', query: { brand: this.selectBrand, price: this.selectPrice}})
    },
    // maxPriceSelected(){
    //   this.$router.push({ path: '/search', query: { price: this.selectPrice, brand: this.selectBrand}})
    // }
    backToHome(){
      this.$router.push({ path: '/'});
    },
    goCheckout(){
      if(this.isLogin){
        this.$router.push({ path: '/checkout'})
      }else{
        this.$message({
          message: "Please login first!",
          type: 'error'
        })
      }
    }
  },
}
</script>

<style lang="scss" scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 20px;
  z-index: 1000;
}
  .wrapper{
    width: 100%;
    min-width: 1200px;
    .title{
      height: 50px;
      line-height: 50px;
      // background-color: rgb(154, 226, 226);
      text-align: center;
      font-size: 20px;
      font-weight: 500;
      cursor: pointer;
      color: white;
      background-color: rgba(22, 22, 23, .8);
      border-bottom: 1px solid #fff;
    }
    .main{
      display: flex;
      align-items: center;
      flex-direction: row;
      height: 60px;
      padding: 0 20px;
      background-color: rgba(22, 22, 23, .8);
      .inputs{
        display: flex;
        padding-top: 15px;
        flex: 5;
        .brandInput{
          width: 150px;
        }
        .searchBtn{
          margin-left: -15px;
        }
        .slider{
          display: flex;
          justify-content: space-between;
          width: 230px;
          .slider-title{
            width: 50px;
            line-height: 30px;
            color: white;
          }
          .range{
            width: 200px;
          }
        }
      }

      .checkOut{
        flex: 1;
        margin-left: auto;
        justify-self: flex-end;
        margin-right: 20px;
      }
      .userInfo{
        flex: 1;
        width: 200px;
        display: flex;
        justify-content: space-around;
      }
    }
  }
</style>