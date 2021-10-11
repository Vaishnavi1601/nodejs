const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

//creating product
exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  //creating new product based on our model

  const product = new Product({
    //right side of : refers to data we receive in controller action
    //left side of : refers to keys we defined in our schema
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
  });
  // console.log(product);
  product
    //this save method is from mogoose
    .save() // to call "then" we goto Product model and we retuern collection and then redirect to products
    .then((result) => {
      console.log("Created Product");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};

// firstly we need to load the product that gets edited
//geteditproduct is respondible for fetching products that should be edited and then render it
exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit; //true
  console.log(46, editMode); //true
  if (!editMode) {
    return res.redirect("/");
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      if (!product) {
        return res.redirect("/");
      }
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product: product,
        title: "Update Product",
      });
    })
    .catch((err) => console.log(err));
};

//posteditproduct is resonsible for saving the changes to database whi ch we made in edit
exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedDesc = req.body.description;
  const updatedImageUrl = req.body.imageUrl;

  //fetching a product by id
  Product.findById(prodId)
    .then((product) => {
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDesc;
      product.imageUrl = updatedImageUrl;
      //save method update the changes to our database
      return product.save();
    })

    // redirect once product is saved
    .then((result) => {
      console.log("UPDATED PRODUCT!");
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};

exports.getProducts = (req, res, next) => {
  Product.find() //it will give all products
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((err) => console.log(err));
};

//deleting product
exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;

  //findByIdAndRemove --built in method provided by mongoose
  // Product.findByIdAndRemove(prodId)

    // .then(() => {
    //   console.log("DESTROYED PRODUCT");
    //   res.redirect("/admin/products");
    // })
    // .catch((err) => {
    //   console.log(err);
    // });
};
