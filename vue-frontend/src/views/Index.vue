<template>
  <div class="main">
    <div class="section">
      <div class="title">
        <span>SOLD OUT SOON</span>
      </div>
      <div class="bottom">
        <el-card class="box-card" v-for="(phone, index) in soldOutList" :key="index" @click="findPhoneDetail(phone)">
          <div class="imgWrapper">
            <img :src="phone.image" alt=""/>
          </div>
          <div class="rating">
            Price: {{ phone.price }}
          </div>
        </el-card>
      </div>
    </div>
    <div class="section">
      <div class="title">
        <span>BEST SELLER</span>
      </div>
      <div class="bottom">
        <el-card class="box-card" v-for="(phone, index) in bestSellerList" :key="index" @click="findPhoneDetail(phone)" >
          <div class="imgWrapper">
            <img :src="phone.image" />
          </div>
          <div class="rating">
            Rating: {{ parseFloat(phone.averageRating).toFixed(3) }}
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
  export default{
    name: 'index',
    mounted() {
      this.getSoldOutList()
      this.getBestSellerList()
    },
    data() {
      return {
        soldOutList: [],
        bestSellerList: [],
        address: ''
      }
    },
    methods: {
      async getSoldOutList(){
        const data = await this.$axios.get('api/phone/sold')
        this.soldOutList = data.data
        this.soldOutList.forEach(n => {
          try {
            n.image = require('../assets/image/' + n.brand + '.jpeg')
          } catch (error) {
            console.log(error);
            n.image = require('../assets/image/no.jpg')
          }
        })
      },
      async getBestSellerList(){
        const data = await this.$axios.get('api/phone/best')
        this.bestSellerList = data.data
        this.bestSellerList.forEach(n => {
          try {
            n.image = require('../assets/image/' + n.brand + '.jpeg')
          } catch (error) {
            console.log(error);
            n.image = require('../assets/image/no.jpg')
          }
        })
      },
      findPhoneDetail(phone){
        this.$router.push({ path:'/item', query: { _id: phone._id }});
      }
    },
  }
</script>

<style lang="scss" scoped>
.main{
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding-top: 20px;
  .section{
    display: flex;
    flex-flow: column;
    width: 48%;
    box-shadow: 0px 0px 5px 5px rgba(74, 74, 74, 0.2);
    border-radius: 10px;
    padding: 10px 0;
    .title{
      text-align: center;
      margin-bottom: 10px;
    }
    .bottom{
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-wrap: wrap;
    .box-card{
      width: 47%;
      margin-bottom: 10px;
      border-radius: 5px;
      box-shadow: 0px 0px 3px 3px rgba(74, 74, 74, 0.2);
      text-align: center;
      .imgWrapper{
        img{
        width: 95%;
        min-height: 150px;
        max-height: 500px;
      }
      }
    }
  }
  }
}
</style>