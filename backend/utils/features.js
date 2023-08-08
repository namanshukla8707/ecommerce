class Features {
  // this.query is Product.find() , queryStr is request.query string all the query written in the query.
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  // This is search feature.
  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};

    // Changing Product.find method
    this.query = this.query.find({ ...keyword });
    return this;
  }

  // This is filter feature.
  filter() {
    // Making copy of original query & queryStr so that our main do not got disturb {...this.queryStr} this syntax will create a copy.
    const queryCopy = { ...this.queryStr };
    // console.log(queryCopy);
    // output --> { keyword: 'samsung', category: 'laptop' }
    // Removing some fields for category
    const removeFields = ["keyword", "page", "limit"];

    // In the queryCopy the key will be deleted.
    removeFields.forEach((key) => delete queryCopy[key]);
    // console.log(queryCopy);
    // output --> { category: 'laptop' }
      
    // Filter for rating and price
      let queryStr = JSON.stringify(queryCopy);// converting object to string.
      queryStr=queryStr.replace(/\b(gt|gte|lt|lte)\b/g,(key)=>`$${key}`)
      this.query = this.query.find(JSON.parse(queryStr));
      return this;  
    }
    pagination(resultperpage) {
        const currentpage = Number(this.queryStr.page) || 1;
        const skip = resultperpage * (currentpage - 1);
        //this.query is product.find() and then limit is how many product we want to see and skip is how many product we want to skip from starting.
        this.query = this.query.limit(resultperpage).skip(skip);
        return this;
    }
}
module.exports = Features;
