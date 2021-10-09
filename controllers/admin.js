// const Product = require("../models/product"); //importing product model

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

  //creating new product 
  //by intialising product
  const product = new Product(title,price,description,imageUrl)
  // console.log(product);
  //
  product.save()  // to call "then" we goto Product model and we retuern collection and then redirect to products 
  .then((result) => {
      console.log("Created Product");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};

//firstly we need to load the product that gets edited
// exports.getEditProduct = (req, res, next) => {
//   const editMode = req.query.edit;

//   console.log(editMode);
//   if (!editMode) {
//     return res.redirect("/");
//   }
//   const prodId = req.params.productId;
//   Product.findByPk(prodId)
//     .then((product) => {
//       res.render("admin/edit-product", {
//         pageTitle: "Edit Product",
//         path: "/admin/edit-product",
//         editing: editMode,
//         product: product,
//         title: "Update Product",
//       });
//     })
//     .catch((err) => console.log(err));
// };

// //
// exports.postEditProduct = (req, res, next) => {
//   const prodId = req.body.productId;
//   const updatedTitle = req.body.title;
//   const updatedPrice = req.body.price;
//   const updatedImageUrl = req.body.imageUrl;
//   const updatedDesc = req.body.description;
//   Product.findByPk(prodId)

//     //working with the product we retrivd and that needs to get updated
//     .then((product) => {
//       //this will not change in our DB but will do it locally
//       product.title = updatedTitle;
//       product.price = updatedPrice;
//       product.description = updatedDesc;
//       product.imageUrl = updatedImageUrl;

//       //save method will save the changes to our database
//       //if product doesn't exit it will create new one or else it will update the old with newvalues

//       return product.save();
//     })

//     // this then blockk will handle successful  responses from our save promise
//     .then((result) => {
//       console.log("UPDATED PRODUCT!");
//       res.redirect("/admin/products");
//     })
//     .catch((err) => console.log(err));
// };

// exports.getProducts = (req, res, next) => {
//   req.user
//     .getProducts() //it will give all product for that user
//     .then((products) => {
//       res.render("admin/products", {
//         prods: products,
//         pageTitle: "Admin Products",
//         path: "/admin/products",
//       });
//     })
//     .catch((err) => console.log(err));
// };

//deleting product
// exports.postDeleteProduct = (req, res, next) => {
//   const prodId = req.body.productId;
//   Product.findByPk(prodId) //finding product by id
//     //now we have our product and on that product we can call destroy method
//     .then((product) => {
//       return product.destroy();
//     })

//     //this then block will will execute if the destruction succeeded
//     .then((result) => {
//       console.log("DESTROYED PRODUCT");
//       res.redirect("/admin/products");
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };
