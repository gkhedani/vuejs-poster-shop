const PRICE = 9.99;
const LOAD_NUM = 10;

new Vue({
   el: "#app",
   data: {
     total: 0,
     items: [],
     cart: [],
     results: [],
     newSearch: "anime",
     lastSearch: "",
     loading: false,
     price: PRICE
   },
   computed: {
     noMoreItems: function () {
       return this.items.length === this.results.length && this.results.length > 0;
     },
   },
   methods: {
     appendItems: function () {
       if (this.items.length < this.results.length) {
         let append = this.results.slice(this.items.length,
              this.items.length + LOAD_NUM);
         this.items = this.items.concat(append);
       }
     },
     onSubmit: function () {
       // don't search if the search field is blank
       if (this.newSearch.length) {
         // empty items that may already be listed
         this.items = [];
         this.loading = true;
         this.$http
          .get("/search/".concat(this.newSearch))
          .then(function (res) {
            // console.log(res.data);
           this.lastSearch = this.newSearch;
           // store all the results in a separate array
           this.results = res.data;
           this.appendItems();
           this.loading = false;
         });         
       }
     },
     addItem: function (index) {
      //  console.log(index);
       this.total += PRICE;
       let item = this.items[index];
       let found = false;
       for (let i = 0; i < this.cart.length; i++) {
         if (this.cart[i].id === item.id) {
           found = true;
           this.cart[i].qty++;
           break;
         }
       }
       if (!found) {
         this.cart.push({
           id: item.id,
           title: item.title,
           qty: 1,
           price: PRICE
         });
       }
      //  console.log(this.cart.length);
    },
    inc: function(item) {
      item.qty++;
      this.total += PRICE;
    },
    dec: function(item) {
      item.qty--;
      this.total -= PRICE;
      if (item.qty <= 0) {
        for (let i = 0; i < this.cart.length; i++) {
          if (this.cart[i].id === item.id) {
            this.cart.splice(i, 1);
            break;
          }
        }
      }
    }
   },
   filters: {
     currency: function(price) {
       return "$".concat(price.toFixed(2));
     }
   },
   mounted: function () {
     // when Vue has mounted itself into the DOM
     this.onSubmit();
     // watcher that will tell us that the user has scrolled to the bottom
     // however this 3rd party library, scroll monitor, does not integrate
     //   with Vue
     var  vueInstance = this;
     var elem = document.getElementById("product-list-bottom");
     var watcher = scrollMonitor.create(elem);
     watcher.enterViewport(function () {
       vueInstance.appendItems();
     });
   }
 });
