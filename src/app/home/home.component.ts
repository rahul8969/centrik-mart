import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  productList:Array<any>=[];
  categoryList:Array<any>=[];
  brandList:Array<any>=[];
  allProductList:Array<any>=[];
  productByCategory:Array<any>=[];
  showProductList:boolean=true;
  selectedCategory:any;
  selectedBrand:any;
  cartList:Array<any>=[];
  total=0;
  prices=[{price:"All"},{price:"200 - 500"},{price:"1000 - 5000"},{price:"5000 - 25000"},{price:"25000 - 100000"}];
  ratings=[{rating:"All"},{rating:1},{rating:2},{rating:3},{rating:4},{rating:5}];
  discounts=[{discount:"All"},{discount:5},{discount:10},{discount:15},{discount:20},{discount:25},{discount:30},{discount:35},{discount:40},{discount:45},{discount:50}];
  priceRange:any;
  ratingRange:any;
  discountRange:any;

  slideConfig = {  
    "slidesToShow": 3,  
    "slidesToScroll": 3,  
    "dots": true,  
    "infinite": true  
  };

  constructor(private http : HttpClient) { }

  ngOnInit(): void {
    this.getProductDatas();
  }

  getProductDatas(){
    this.http.get<any>("https://dummyjson.com/products?limit=100").subscribe(res=>{
      this.productList=res.products;
      this.allProductList=res.products;
      console.log("products",this.productList);
      if(this.allProductList.length>0){
        this.createCategoryAndBrandList(this.allProductList);
      }
    })
  }

  createCategoryAndBrandList(data:Array<any>) {
    // brandList and categoryList
    this.brandList=[];
    this.categoryList=[];
    data.map(items => {
      if (!this.brandList.length) this.brandList.push(items.brand);
      else {
        if (JSON.stringify(this.brandList).indexOf(items.brand) == -1) {
          this.brandList.push(items.brand);
        }
      }
      if (!this.categoryList.length) this.categoryList.push(items.category);
      else {
        if (JSON.stringify(this.categoryList).indexOf(items.category) == -1) {
          this.categoryList.push(items.category);
        }
      }
    })
    console.log("brandlist", this.brandList)
    console.log("categories", this.categoryList)
    // ends
    this.sortingProductList(this.allProductList);
  }

  sortingProductList(data:Array<any>){
    let demoList: Array<any> = [];
    let demoList2: Array<any> = [];
    this.categoryList.map(category => {
      data.map(items => {
        if (category == items.category) {
          demoList.push(items);
        }
      })
      if(demoList.length>0)demoList2.push({ type: category, data: demoList })
      demoList = [];
    })
    this.productByCategory = demoList2;
    console.log("product list by category", this.productByCategory);
  }

  filterByCategory(data:any){
    console.log(data);
    this.selectedCategory=data;
    this.productList=this.allProductList;
    let selectedProducts:Array<any>=[];
    this.productList.map(items=>{
      if(items.category==data){
        selectedProducts.push(items);
      }
    })
    this.sortingProductList(selectedProducts);
  }

  filterByBrands(data:any){
    console.log(data);
    this.selectedCategory=data;
    this.productList=this.allProductList;
    let selectedProducts:Array<any>=[];
    this.productList.map(items=>{
      if(items.brand==data){
        selectedProducts.push(items);
      }
    })
    this.sortingProductList(selectedProducts);
  }
  filterByPrice(data:any){
    console.log(data);
    this.priceRange=data;
    this.productList=this.allProductList;
    let selectedProducts:Array<any>=[];
    if(data=="All"){
      this.sortingProductList(this.allProductList);
    }else{
      this.productList.map(items=>{
        if(items.price==data){
          selectedProducts.push(items);
        }
      })
      this.sortingProductList(selectedProducts);
    }
    
  }

  filterByRatings(data:any){
    console.log(data,this.allProductList);
    this.ratingRange=data;
    this.productList=this.allProductList;
    let selectedProducts:Array<any>=[];
    if(data=="All"){
      this.sortingProductList(this.allProductList);
    }else{
      this.productList.map(items=>{
        if(items.rating <= parseFloat(data)){
          selectedProducts.push(items);
        }
      })
      this.sortingProductList(selectedProducts);
    }
  }

  filterByDiscounts(data:any){
    console.log(data);
    this.discountRange=data;
    this.productList=this.allProductList;
    let selectedProducts:Array<any>=[];
    if(data=="All"){
      this.sortingProductList(this.allProductList);
    }else{
      this.productList.map(items=>{
        if(items.discountPercentage <= parseFloat(data)){
          selectedProducts.push(items);
        }
      })
      this.sortingProductList(selectedProducts);
    }
  }

  addToCart(data:any){
    this.cartList.push(data);
    console.log("cart-list",this.cartList)
  }

  goToCart(data?:any){
    this.showProductList=false;
    // this.cartList.push(data);
    this.cartList.map(items=>{
      this.total+=items.price;
    })
    console.log("buy-list",this.cartList)
  }

  backToHome(){
    this.showProductList=true;
    this.productList=this.allProductList;
  }

}
