<template>
  <div class="wrapper" v-if="isGet">
    <div class="main">
      <div class="image">
        <img :src="item.image" alt="NO PHOTO!">
      </div>
      <div class="content">
        <div class="title">
          <p>{{ item.title }}</p>
        </div>
        <div class="brand">
          <p>Brand: <span>{{ item.brand }}</span></p>
        </div>
        <div class="stock">
          <p>Stock: <span>{{ item.stock }}</span></p>
        </div>
        <div class="seller">
          <p>Seller: <span>{{ seller }}</span></p>
        </div>
        <div class="price">
          <p>Price: <span>${{ item.price }}</span></p>
        </div>
        <div class="button">
          <el-button class="add" type="primary" @click="qualityCheck">Add to cart</el-button>
        </div>
      </div>
    </div>
    <div class="review">
      <el-card class="box-card add-comment">
        <el-form
          label-width="100px"
          :model="formData"
          :rules="rules"
          ref="formData"
        >
          <el-form-item label="Rating" prop="count">
            <el-select 
              size="large"
              v-model="formData.count"
            >
              <el-option
                v-for="item in 5"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Comment" prop="desc">
            <el-input v-model="formData.desc" type="textarea" />
          </el-form-item>
          <el-form-item>
            <el-button class="commentBtn" type="primary" @click="submitComment('formData')">Comment</el-button>
          </el-form-item>
        </el-form>
      </el-card>
      <Review v-for="(review, index) in reviewsDisplay" :key="index" :review="review" :phoneID="item._id" :reviewerID="review.reviewer"></Review>
    </div>
    <div class="load">
      <el-button v-if="loadMore" @click="loadMoreReview" type="info">Load More...</el-button>
      <el-button v-if="!loadMore && item.reviews.length > 3" @click="hideReviews" type="info">Hide Review...</el-button>
    </div>
  </div>
</template>

<script>
import Review from '@/components/Review.vue';
export default{
    name: "item",
    components: {
      Review
    },
    data() {
      return {
        isLoin: localStorage.getItem('isLogin'),
        phone_id:'',
        formData: {
            count: '',
            desc: ''
        },
        rules: {
          count: [
          {
            required: true,
            message: 'Please select rating',
            trigger: 'change',
          },
          ],
          desc: [
          { required: true, message: 'Please comment!', trigger: 'blur' },
          ]
        },
        item: {},
        isGet: false,
        reviewsLimit: 3,
        reviewer_id: localStorage.getItem('id') ? localStorage.getItem('id') : 'None',
        reviewer_name: localStorage.getItem('username') ? localStorage.getItem('username') : 'None',
        seller: ''
      };
    },
    mounted() {
      this.isGet = false
      this.phone_id = this.$route.query._id;
      this.getPhoneDetail(this.phone_id)
    },
    computed: {
      reviewsDisplay(){
        return this.item.reviews.slice(0, this.reviewsLimit);
      },
      loadMore(){
        return this.reviewsLimit < this.item.reviews.length;
      }
    },
    methods: {
      async getPhoneDetail(phoneID){
        // get phone details
        const data = await this.$axios.get('api/phone/item/'+ phoneID);
        this.item = data.data[0]
        // get seller detail
        const userInfo = await this.$axios.get('api/login/userInfo', {
            params:{
              id: this.item.seller
            }
        });
        if(userInfo.data.length > 0){
          const seller = userInfo.data[0];
          this.seller = seller.firstname + ' ' + seller.lastname;
        }else{
          this.seller = 'None';
        }

        try{
          this.item.image = require('../assets/image/' + this.item.brand + '.jpeg')
        }catch(err){
          console.log(err)
        }
        this.isGet = true;
      },
      async submitComment(formData){
        if(!this.isLoin){
          this.$message({
            message: "Please login first!",
            type: 'error'
          })
          return
        }
        await this.$refs[formData].validate(async (valid) => {
          if(valid){
            const obj = {
              reviewer: localStorage.getItem('id'),
              rating: parseInt(this.formData.count),
              comment: this.formData.desc
            }
            const res = await this.$axios.post('api/phone/review',{
              params:{
                id: this.phone_id,
                review: obj
              }
            })
            if(res.status == 200){
              this.$refs[formData].resetFields()
              // this.getPhoneDetail(this.phone_id)
              obj.reviewer = this.reviewer_id
              this.item.reviews.unshift(obj)
            }
          }else{
            console.log("error!");
          }
        })
      },
      loadMoreReview(){
        if(this.reviewsLimit < this.item.reviews.length){
          this.reviewsLimit += 3
        }else{
          this.$message("No more reviews!")
        }
      },
      hideReviews(){
        this.reviewsLimit = 3
      },
      qualityCheck(){
        if(!this.isLoin){
          this.$message({
            message: "Please login first!",
            type: 'error'
          })
          return
        }
        this.$prompt("Enter the quantity:", "Add to Cart", {
          confirmButtonText: "OK",
          cancelButtonText: "Cancel",
          inputPattern: /^[1-9]\d*$/,
          inputErrorMessage: "Input value must be greater than zero and less than the stock!",
          inputValidator: (inputValue) => {
            const value = parseInt(inputValue,10);
            if(value > this.item.stock){
              return false
            }
            return true
          }
        })
        .then(({ value }) => {
          const phone = {
            id: this.phone_id,
            title: this.item.title,
            brand: this.item.brand,
            singlePrice: this.item.price,
            quantity: parseInt(value)
          }
          this.$store.dispatch('addToCart', phone).then(() => {
            const count = this.$store.state.cart.length            
            this.$alert('Your have total  ' + count + ' items in cart!', 'Items in Cart', {
              confirmButtonText: 'OK',
              showClose: false,
              callback: action => {

              }
            });
          })
        }).catch(() =>{
          console.log("invalid input!")
        })
      }
    },
}
</script>

<style lang="scss" scoped>
  .wrapper{
    width: 100%;
    padding: 30px 10%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    .main{
      display: flex;
      justify-content: center;
      .image{
        width: 560px;
        height: 560px;
        img{
        width: 560px;
        height: 560px;
      }
      } 
      .content{
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 540px;
        margin-left: 10px;
        .title{
          width: 450px;
          font-size: 26px;
        }
        .brand{
          font-size: 22px;
        }
        .stock{
          font-size: 22px;
        }
        .seller{
          font-size: 22px;
        }
        .price{
          font-size: 24px;
          font-weight: 500;
          color: rgb(249, 102, 34);
        }
        .button{
          align-self: flex-end;
          height: 60px;
          .add{
            height: 40px;
            width: 150px;
            font-size: 18px;
          }
        }
      }
    }
    .review{
      display: flex;
      flex-direction: column;
      margin-top: 50px;
      .box-card{
        width: 1100px;
        margin: 0 auto;
        margin-bottom: 5px;
        .add-comment{
          .commentBtn{
            margin-left: 10px;
          }
        }
      }
    }
    .load{
      margin-top: 10px;
    }
  }
</style>