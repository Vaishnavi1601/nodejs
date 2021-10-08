const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
  Product.findAll()
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
  Product.findByPk(prodId)
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
  Product.findAll() //getting all the data for Product model
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
    .then((cart) => {
      console.log(cart);
      // we can use cart to fetch the products that are inside it by returing getProducts
      return (
        cart
          .getProducts() //added by sequelize as a method
          // in this then block we have products that are in this cart
          .then((products) => {
            console.log(products);
            res.render("shop/cart", {
              path: "/cart",
              pageTitle: "Your Cart",
              products: products,
            });
          })
          .catch((err) => console.log(err))
      );
    })
    .catch((err) => console.log(err));
};

//postCart method is responsible for adding new products to the cart
exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;

  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: prodId } });
    })
    .then((products) => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }

      //adding  a product to the cart whch is already part of the cart
      //increment the quantity
      if (product) {
        const oldQuantity = product.cartItem.quantity; // getting quantity of item already stored in the cart
        newQuantity = oldQuantity + 1;
        return product;
      }
      return Product.findByPk(prodId);
    })

    //adding new product for the first time
    .then((product) => {
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity },
      });
    })
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  //get cart for the user 
  req.user
    .getCart()
    
    .then((cart) => {
      //we got access to cart and in that cart find product with that productId for this user
      return cart.getProducts({ where: { id: prodId } });
    })
    .then((products) => {

      const product = products[0];
      //destroying product not in product table but in cartItem table that connects  cart with that product
      return product.cartItem.destroy(); 
    })
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => {
      console.log(err);
    });
};

//postOrder taek all the cart items and move them into order
exports.postOrder = (req, res, next) => {
  let fetchedCart;
  req.user
  //get all the cart items
    .getCart()
    .then((cart) => {
      fetchedCart = cart; // storing the cartitem in fetchedCart
      return cart.getProducts();  //returns all products in the cart
    })

    //with access to the cart we can get access to the products,
    //aftr getting access to product move the product into newly created ordre
    .then((products) => {
      return req.user
        .createOrder()   //this gives us an order and now we need to add products to that order
        .then((order) => {

          //order.addProducts(Products)  //passing products to created order, also we need to set quantity for products
          //each product have special id and to assign that the products we pass here need to be modified-- done with map method

          return order.addProducts(
            products.map((product) => {
             //adding new object quantity to orderItem(table)
              product.orderItem = { quantity: product.cartItem.quantity }; //get quantity from the cart and store thaht for order item
              //return product with the added quantity for order
              return product;
            })
          );
        })
        .catch((err) => console.log(err));
    })
    .then((result) => {
      //dropiing all the items in the cart by settuing them to null,--- clearing the cart
      return fetchedCart.setProducts(null);
    })
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
