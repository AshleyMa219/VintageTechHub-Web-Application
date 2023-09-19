<template>
  <el-table 
    class="table" 
    :data="showList" 
    stripe  
    style="width: 100%"
    @row-click="listPhoneDetail"
    >
    <el-table-column prop="title" label="Title" width="700"/>
    <el-table-column prop="brand" label="Brand"/>
    <el-table-column prop="price" label="Price"/>
  </el-table>
</template>

<script>
import { toInteger } from 'lodash';
import { shallowRef } from 'vue';
  export default{
    name: 'search',
    data() {
      return {
        keyword: shallowRef(this.$router.currentRoute.value.query.keyword),
        brand: shallowRef(this.$router.currentRoute.value.query.brand),
        price: shallowRef(this.$router.currentRoute.value.query.price),
        searchList: shallowRef([]),
        showList: shallowRef([])
      }
    },
    mounted(){

      this.getSearchResult()
    },
    watch:{
      $route(){
        this.keyword = this.$router.currentRoute.value.query.keyword;
        this.brand = this.$router.currentRoute.value.query.brand;
        this.price = this.$router.currentRoute.value.query.price;

        if(!this.brand && !this.price){
          this.getSearchResult()
        }else{
          this.getConditionSelect()
        }
        
      }
    },
    methods:{
      async getSearchResult(){
        try {
          const data = await this.$axios.get('api/phone/search', {
            params:{
              keyword: this.keyword ? this.keyword : ""
            }
          })
          this.searchList = data.data
          this.showList = data.data
        } catch (error) {
          console.log(error);
        }
      },

      getConditionSelect(){
        this.showList = JSON.parse(JSON.stringify(this.searchList))
        if(this.price && this.brand){
          if(this.brand != 'default'){
            this.showList = this.showList.filter(target => target.brand == this.brand)
          }
          this.showList = this.showList.filter(target => toInteger(target.price) < toInteger(this.price))
        }else if(this.price == null){
          if(this.brand != 'default'){
            this.showList = this.showList.filter(target => target.brand == this.brand)
          }
        }else{
          this.showList = this.showList.filter(target => toInteger(target.price) < toInteger(this.price))
        }
      },
      listPhoneDetail(row){
        const _id = row._id;
        this.$router.push({ path:'/item', query: { _id: _id }});
      },
    }
  }
</script>

<style lang="scss" scoped>
  .table{
    font-size: 16px;
    cursor: pointer;
  }
</style>