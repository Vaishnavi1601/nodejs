const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
  Product.fetchAll() //here we will get the products

    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

//retrieve single product when we click on details
exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId; // we get productId here

  Product.findById(prodId)
    .then((product) => {
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title,
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll() //getting all the data for Product model
    // in then block we have product array
    .then((products) => {
      console.log(products);
      //rendering page after we get products
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  req.user
    //request user and get cart related to that user
    .getCart()
    .then((products) => {
      console.log(products);
      res
        .render("shop/cart", {
          path: "/cart",
          pageTitle: "Your Cart",
          products: products,
        })
        .catch((err) => {
          console.log(err);
        });
    });
};

//postCart method is responsible for adding new products to the cart
exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;

  Product.findById(prodId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      console.log(result);
      res.redirect("/cart");
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;

  req.user
    .deleteItemFromCart(prodId)

    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => {
      console.log(err);
    });
};

//postOrder taek all the cart items and move them into order
exports.postOrder = (req, res, next) => {
  req.user
    .addOrder()
    .then((result) => {
      res.redirect("/orders");
    })
    .catch((err) => console.log(err));
};

exports.getOrders = (req, res, next) => {
  req.user
    //get orders of user
    .getOrders({ include: ["products"] }) //fetching all products realted to that order, gives back array of products per order
    .then((orders) => {
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders: orders, //stores all the retrieved orders
      });
    })
    .catch((err) => console.log(err));
};
