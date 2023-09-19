<template>
  <el-card :class="[isGrey ? 'grey': '', 'box-card']" v-if="onlyShow">
    <div class="top">
      <div class="reviewr">
        <div class="reviewer">Reviewer: {{ reviewerName }}</div>
        <div class="rating">Rating: {{ review.rating }}</div>
      </div>
      <div class="hide" v-if="showButton">
        <el-button v-if="!isGrey" type="info" @click="reviewHidden(true)">Hide</el-button>
        <el-button v-else type="primary" @click="reviewHidden(false)">Show</el-button>
      </div>
    </div>
    <div class="comment">
      <div>Comment:</div>
      <div class="info" v-if="showAllCommnet">{{ review.comment }}</div>
      <div class="info " v-else>{{ partialComponent }}<button @click="showAllCommnet = true" v-if="showMore"> Show more </button></div>
    </div>
  </el-card>
</template>

<script>

export default{
  name: 'Review',
  props:{
    review: {
      type: Object,
      required: true
    },
    phoneID:{
      type: String,
      required: true
    },
    reviewerID:{
      type: String,
      required: true
    }
  },

  data() {
    return {
      showAllCommnet: false,
      isHidden: true,
      userId: localStorage.getItem('id') ? localStorage.getItem('id') : 'None',
      isGrey: false,
      userName: localStorage.getItem('username') ? localStorage.getItem('username') : 'None',
      reviewerName: ''
    }
  },

  mounted() {
    this.getReviewerName()
  },
  methods: {
    async getReviewerName(){
      if(this.review.hasOwnProperty('hidden')){
        this.review.hidden == true ? this.isGrey = true : this.isGrey = false
      }else{
        this.isGrey = false
      }
      const res = /\d/.test(this.review.reviewer)
      if(!res){
        return
      }
      const userInfo = await this.$axios.get('api/login/userInfo', {
        params:{
          id: this.review.reviewer
        }
      });
      if(userInfo.data.length > 0){
        const reviewer = userInfo.data[0]
        this.reviewerName = reviewer.firstname + ' ' + reviewer.lastname;
      }else{
        this.reviewerName = 'Robot';
      }
    },
    async reviewHidden(value){
      await this.$axios.post('api/phone/hidden',{
        params:{
          phoneID: this.phoneID,
          reviewID: this.review.reviewer,
          hidden: value,
        }
      }).then((res) => {
        this.isGrey = value
      })
    }
  },
  computed:{
    partialComponent(){
      const comment = this.review.comment;
      const commentMaxLength = 200;
      const length = this.review.comment.length;
      if(length > commentMaxLength){
        return comment.substring(0, commentMaxLength) + '...';
      }else{
        return comment;
      }
    },
    onlyShow() {
      if(this.isGrey == true && this.showButton == false){
        return false
      }
      return true
    },
    showMore() {
      const length = this.review.comment.length;
      return length > 200;
    },
    showButton(){
      const res = /\d/.test(this.review.reviewer)
      if(res){
        if(this.userId == this.phoneID || this.userId == this.reviewerID){
          return true
        }else{
          return false
        }
      }else{
        if(this.userId == this.phoneID || this.reviewerID == this.userName){
          return true
        }else{
          return false
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.grey{
  color: rgb(191, 191, 191);
}
.box-card{
  font-size: 18px;
  line-height: 22px;
  .top{
    display: flex;
    justify-content: space-between;
  }
}
</style>