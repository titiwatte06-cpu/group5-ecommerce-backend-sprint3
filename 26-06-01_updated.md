# Group 5 Ecommerce-backend_updated 2026-06-01

## Install/update tools

```bash
- cookie-parser
- cors
- bcrypt
- express-rate-limit
- helmet
- jsonwebtoken
```

## Middlewae

```bash
- authUser.js
- error.middleware.js
- rateLimiter.js
```

## users/address

```bash
routes

router.post("/login", userLogin);
router.post("/logout", userLogout);
router.get("/auth/me", authUser, authenUser);
router.get("/profile", authUser, authenUser);
router.get("/me/addresses", authUser, getUserAddresses);
router.post("/me/addresses", authUser, addUserAddress);
router.put("/me/addresses/:addressId", authUser, updateUserAddress);
router.delete("/me/addresses/:addressId", authUser, deleteUserAddress);
router.post("/", createUser);
router.get("/", getUsers);
router.get("/:id", getUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

```

## products

```bash
routes

router.get("/", getProducts); *with query categoryId, productname, price=ASC/DSC
router.get("/:id", getProduct);
router.post("/", createProduct);
router.delete("/:id", deleteProduct); *soft delete, only isActive = false
router.put("/:id", updateProduct);
```
