<template>
  <div>
    <div v-if="ispaid">
      <!-- back to last page -->
      <el-button type="primary" @click="handleReturn">Return</el-button>

      <!-- shopping cart -->
      <el-table
          :data="cart"
          border
          stripe
          style="width: 50%"
          @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" label="selectAll" width="100px"></el-table-column>
        <el-table-column prop="title" label="Title" width="150px"></el-table-column>
        <el-table-column prop="singlePrice" label="Uint Price" width="150px"></el-table-column>
        <el-table-column prop="quantity" label="Quantity" width="160px" >
          <template v-slot="{ row }">
            <el-input-number v-model="row.quantity" @change="handleQuantityChange(row)" :min="0" size="small" :max="row.originalRemain"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column  label="Option"  >
          <template v-slot:default="scope">
            <el-row class="mb-4">
              <el-button type="danger" @click="removePhoneItem(scope.row)">Delete</el-button>
            </el-row>
          </template>
        </el-table-column>
      </el-table>

      <!-- total price -->
      <div class="totalPrice">
        <span>Total Price: {{ totalPrice.toFixed(2) }}</span>
        <el-button type="danger" @click="handlePayment">Pay</el-button>
      </div>
    </div>
    <div class="countDown" v-else>
      <el-col :sm="18" :lg="18">
        <el-result icon="success" title="Successful payment">
        </el-result>
        <p>You have paid successfully. Return to the main page in {{ seconds }} seconds</p>
      </el-col>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      checked: true,
      multipleSelection: [],
      totalPrice: 0,
      ispaid: true,
      seconds: 5
    }
  },

  computed:{
    ...mapState(["cart"])
  },

  methods: {
    // return last page
    handleReturn(){
      this.$router.push("/")
    },

    //select All and count the total price
    handleSelectionChange(val){
      this.totalPrice = 0
      this.multipleSelection = val
      this.multipleSelection.forEach(item => {
        this.totalPrice += item.singlePrice * item.quantity
      })
    },


    handleQuantityChange(row) {
    if (row.quantity === 0) {
      this.$confirm("Are you sure you want to delete this item?", "Confirm", {
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
        type: "warning",
      }).then(() => {
        this.removePhoneItem(row)
      }).catch(() => {

        row.quantity =1
      })
    } else {
      this.totalPrice = 0
      this.multipleSelection.forEach(item => {
        this.totalPrice += item.singlePrice * item.quantity
      })
    }
  },

    // remove target item
    removePhoneItem(phone){
      this.$store.commit("deleteItem", phone)
    },

    async handlePhoneStock(phone){
      console.log(phone.id);
      console.log(phone.quantity);

      this.$axios.post('api/checkout/payment', {
        id: phone.id,
        stock: phone.quantity
      })
    },

    // pay the bill
    handlePayment(){
      if(this.totalPrice == 0){
        this.$message.error("Please select at least one item!")
      }else{
        this.ispaid = false
        for(let i = 0; i < this.cart.length; i++){
          this.handlePhoneStock(this.cart[i])
        }
        this.$message.success("Payment succeeded!")
        this.$store.commit("clearCart")
        new Promise((resolve, reject) => {
          let timer = setInterval(() => {
            if(this.seconds > 0){
              this.seconds -= 1
            }else{
              clearInterval(timer)
              this.$router.replace("/index")
            }
          }, 1000)
        })
      }

    },
  }
}
</script>

<style scoped>

.el-button{
  margin: 20px;
}

.el-table{
  margin: 50px auto;
}

/* ::v-deep */
:deep .el-table__header .el-table-column--selection .cell .el-checkbox::after{
  color: #909399;
  content: "Select All";
  font-size: 10px;
  margin-left: 5px;
  font-weight: bold;
}

.totalPrice{
  margin: 20px auto;
  border: 1px solid #EBEEF5;
  width: 50%;
  height: 50px;
  position: relative;
}

.totalPrice span{
  position: absolute;
  line-height: 50px;
  color: #909399;
  right: 120px;
}

.totalPrice .el-button{
  position: absolute;
  width: 80px;
  margin: 0;
  padding: 0;
  height: 50px;
  right: 0px;
}

.countDown{
  width: 500px;
  height: 10px;
  margin: 0 auto;
  position: relative;
  top: 200px;
}
</style>
