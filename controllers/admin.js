const Product = require("../models/product"); //importing product model

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
  req.user
  //seuqlize adds special method depending on the association we added
  // for belongsTo(app.js)  it adds method that allow us to creat enew associated object
  // createProduct -- bcz Product is name of our model and create  is added automatically at the beginnning of method name
  .createProduct({   // we are getting createProduct method through our sequelize object and this will create a connected model (product and user)

      //id will be managed automatically
      title: title,
      price: price,
      imageUrl: imageUrl,
      description: description,
    })
    .then((result) => {
      console.log("Created Product");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};

//firstly we need to load the product that gets edited
exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;

  console.log(editMode);
  if (!editMode) {
    return res.redirect("/");
  }
  const prodId = req.params.productId;
  Product.findByPk(prodId)
    .then((product) => {
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

//
exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  Product.findByPk(prodId)

    //working with the product we retrivd and that needs to get updated
    .then((product) => {
      //this will not change in our DB but will do it locally
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDesc;
      product.imageUrl = updatedImageUrl;

      //save method will save the changes to our database
      //if product doesn't exit it will create new one or else it will update the old with newvalues

      return product.save();
    })

    // this then blockk will handle successful  responses from our save promise
    .then((result) => {
      console.log("UPDATED PRODUCT!");
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};

exports.getProducts = (req, res, next) => {
  req.user
    .getProducts() //it will give all product for that user
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
  Product.findByPk(prodId) //finding product by id
    //now we have our product and on that product we can call destroy method
    .then((product) => {
      return product.destroy();
    })

    //this then block will will execute if the destruction succeeded
    .then((result) => {
      console.log("DESTROYED PRODUCT");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};
