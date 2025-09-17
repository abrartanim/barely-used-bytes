import datetime
from typing import List, Optional

from fastapi import FastAPI, HTTPException, status, Response, Depends, Header
from pydantic import BaseModel, Field, EmailStr
import firebase_admin
from firebase_admin import credentials, firestore, auth
from google.cloud.firestore import DELETE_FIELD



app = FastAPI(
    title = "Barely Used Bytes",
    description= "Backend api for managing used hardware parts listings.",
    version = "0.1.0",
)


try:
    if not firebase_admin._apps:
        cred = credentials.Certificate("serviceAccountKey.json")
        firebase_admin.initialize_app(cred)
    db = firestore.client()
    print("Firebase firestore initialized successfully.")
except Exception as e:
    print(f"Error initializing Firebase Firestore: {e}")
    db = None

async def get_current_user(authorization: str = Header(...)):
    """
    Dependency to verify Firebase ID token from the Authorization header.
    Returns the decoded token payload which includes user info.
    """
    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication scheme.",
        )
    
    token = authorization.split("Bearer ")[1]
    
    try:
        # Verify the token against the Firebase project
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except auth.InvalidIdTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Firebase ID token.",
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred: {e}",
        )
        
        
class Location(BaseModel):
    city: str
    country: str
    
class ProductBase(BaseModel):
    name: str = Field(..., min_length=3, max_length=100)
    category: str = Field(..., min_length=2, max_length=50)
    subcategory: str = Field(..., min_length=2, max_length=50)
    description: str = Field(..., min_length=10, max_length=1000)
    price: float = Field(..., gt=0) 
    currency: str = Field("BDT", max_length=5)
    condition: str = Field(..., max_length=50) 
    images: List[str] = Field(..., min_items=1) 
    sellerId: str = Field(..., min_length=5) 
    sellerName: str = Field(..., min_length=3, max_length=100) 
    location: Location
    status: str = Field("available", max_length=20) 
    specifications: str = Field("", max_length=1000) 
    yearsUsed: int = Field(0, ge=0) 
    negotiable: bool = False
    shippingOptions: List[str] = Field(["local pickup"], min_items=1)
    
class ProductCreate(ProductBase):
    # Model for creating a new product (no productId, timestamps or views initially)
    pass

class ProductUpdate(BaseModel):
    # Model for updating an existing product (all fields optional for partial updates)
    name: Optional[str] = None
    category: Optional[str] = None
    subcategory: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    currency: Optional[str] = None
    condition: Optional[str] = None
    images: Optional[List[str]] = None
    sellerId: Optional[str] = None
    sellerName: Optional[str] = None
    location: Optional[Location] = None
    status: Optional[str] = None
    specifications: Optional[str] = None
    yearsUsed: Optional[int] = None
    negotiable: Optional[bool] = None
    shippingOptions: Optional[List[str]] = None


class Product(ProductBase):
    productId: str
    postedAt: datetime.datetime
    updatedAt: datetime.datetime
    views: int
     
     
# --- Pydantic Models for User Data ---

class Address(BaseModel):
    street: Optional[str] = None
    city: str
    zipCode: Optional[str] = None
    country: str

class UserBase(BaseModel):
    # Fields common to both creating and updating a user
    email: EmailStr # Ensures valid email format
    displayName: str = Field(..., min_length=3, max_length=100)
    profilePictureUrl: Optional[str] = None
    phoneNumber: Optional[str] = None
    address: Optional[Address] = None
    roles: List[str] = ["buyer"] # Default role
    bio: Optional[str] = None
    rating: float = Field(0.0, ge=0.0, le=5.0) # Rating between 0 and 5
    totalReviews: int = Field(0, ge=0)
    isVerifiedSeller: bool = False

class UserCreate(UserBase):
    # Model for creating a new user (userId, timestamps are managed by backend)
    # For initial user creation, we might not have a Firebase Auth UID yet,
    # or we might expect it from the client if they've already authenticated.
    # For simplicity here, we assume the backend will assign a userId or use the one from Firebase Auth.
    pass

class UserUpdate(BaseModel):
    # Model for updating an existing user (all fields optional for partial updates)
    email: Optional[EmailStr] = None
    displayName: Optional[str] = None
    profilePictureUrl: Optional[str] = None
    phoneNumber: Optional[str] = None
    address: Optional[Address] = None
    roles: Optional[List[str]] = None
    bio: Optional[str] = None
    rating: Optional[float] = None
    totalReviews: Optional[int] = None
    isVerifiedSeller: Optional[bool] = None

class User(UserBase):
    # Full User model including fields managed by the backend/Firestore
    userId: str
    createdAt: datetime.datetime
    lastLoginAt: datetime.datetime

#--------------------------------------------------

# --- Pydantic Models for Order Data ---

class ShippingAddress(BaseModel):
    street: str
    city: str
    zipCode: str
    country: str

class OrderBase(BaseModel):
    # Fields common to both creating and updating an order
    productId: str = Field(..., min_length=5)
    buyerId: str = Field(..., min_length=5)
    sellerId: str = Field(..., min_length=5)
    productName: str = Field(..., min_length=3)
    productPrice: float = Field(..., gt=0)
    quantity: int = Field(1, gt=0) # Quantity will typically be 1 for unique used parts
    totalAmount: float = Field(..., gt=0)
    currency: str = Field("USD", max_length=5)
    orderStatus: str = Field("pending_payment", max_length=50) # e.g., "pending_payment", "processing", "shipped", "delivered", "cancelled"
    paymentMethod: str = Field(..., max_length=50)
    paymentStatus: str = Field("unpaid", max_length=20) # e.g., "paid", "unpaid", "refunded"
    shippingAddress: ShippingAddress
    shippingTrackingNumber: Optional[str] = None
    sellerNotes: Optional[str] = None
    buyerNotes: Optional[str] = None
    reviewId: Optional[str] = None

class OrderCreate(OrderBase):
    # Model for creating a new order (orderId, timestamps are managed by backend)
    pass

class OrderUpdate(BaseModel):
    # Model for updating an existing order (all fields optional for partial updates)
    orderStatus: Optional[str] = None
    paymentMethod: Optional[str] = None
    paymentStatus: Optional[str] = None
    shippingAddress: Optional[ShippingAddress] = None
    shippingTrackingNumber: Optional[str] = None
    sellerNotes: Optional[str] = None
    buyerNotes: Optional[str] = None
    reviewId: Optional[str] = None
    # Product/buyer/seller IDs should generally not be updated after creation

class Order(OrderBase):
    # Full Order model including fields managed by the backend/Firestore
    orderId: str
    orderedAt: datetime.datetime
    shippedAt: Optional[datetime.datetime] = None
    deliveredAt: Optional[datetime.datetime] = None
# ===================================

# --- Pydantic Models for Review Data ---

class ReviewBase(BaseModel):
    # Fields common to both creating and updating a review
    productId: str = Field(..., min_length=5)
    sellerId: str = Field(..., min_length=5)
    reviewerId: str = Field(..., min_length=5)
    orderId: str = Field(..., min_length=5)
    rating: int = Field(..., ge=1, le=5) # Rating between 1 and 5
    comment: str = Field(..., min_length=10, max_length=1000)
    productName: str = Field(..., min_length=3) # Denormalized
    sellerName: str = Field(..., min_length=3) # Denormalized
    reviewerName: str = Field(..., min_length=3) # Denormalized
    isApproved: bool = True # Default to true, can be set to false for moderation
    helpfulVotes: int = Field(0, ge=0)

class ReviewCreate(ReviewBase):
    # Model for creating a new review (reviewId, timestamp managed by backend)
    pass

class ReviewUpdate(BaseModel):
    # Model for updating an existing review (all fields optional for partial updates)
    rating: Optional[int] = None
    comment: Optional[str] = None
    isApproved: Optional[bool] = None
    helpfulVotes: Optional[int] = None
    # Other fields like IDs and names should not be updated after creation

class Review(ReviewBase):
    # Full Review model including fields managed by the backend/Firestore
    reviewId: str
    reviewedAt: datetime.datetime

#==================================
@app.get("/")
async def read_root():
    
    if db: 
        return {"message": "Welcome to Barely Used Bytes API!"}
    else:
        return {"message": "Database not found :("}
    
    
""" Product Enpoints """
    
@app.get("/products", response_model=List[Product], summary="Get all products")
async def get_all_products():
    """
    Retrieves a list of all products from the Firestore 'products' collection.
    """
    if db is None:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Firestore database not initialized.")
    products_ref = db.collection('products')
    try:
        
        docs = products_ref.stream()
        products = []
        for doc in docs:
            product_data = doc.to_dict()
            # Convert Firestore Timestamps to datetime objects for Pydantic
            if 'postedAt' in product_data and hasattr(product_data['postedAt'], 'isoformat'):
                product_data['postedAt'] = product_data['postedAt'].isoformat()
            if 'updatedAt' in product_data and hasattr(product_data['updatedAt'], 'isoformat'):
                product_data['updatedAt'] = product_data['updatedAt'].isoformat()
            
            # Ensure productId is included from the document ID
            product_data['productId'] = doc.id
            products.append(Product(**product_data))
        return products
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error fetching products: {e}")


@app.get("/products/{product_id}", response_model=Product, summary="Get a product by ID")
async def get_product_by_id(product_id: str):
    """
    Retrieves a single product by its unique ID from the Firestore 'products' collection.
    """
    if db is None:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Firestore database not initialized.")
    product_ref = db.collection('products').document(product_id)
    try:
        doc = product_ref.get()
        if not doc.exists:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
        
        product_data = doc.to_dict()
        # Convert Firestore Timestamps to datetime objects for Pydantic
        if 'postedAt' in product_data and hasattr(product_data['postedAt'], 'isoformat'):
                product_data['postedAt'] = product_data['postedAt'].isoformat()
        if 'updatedAt' in product_data and hasattr(product_data['updatedAt'], 'isoformat'):
                product_data['updatedAt'] = product_data['updatedAt'].isoformat()

        # Ensure productId is included from the document ID
        product_data['productId'] = doc.id
        return Product(**product_data)
    except HTTPException as e:
        raise e # Re-raise 404
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error fetching product: {e}")

@app.post("/products", response_model=Product, status_code=status.HTTP_201_CREATED, summary="Create a new product")
async def create_product(product: ProductCreate, current_user: dict = Depends(get_current_user)):
    """
    Creates a new product listing in the Firestore 'products' collection.
    """
    if db is None:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Firestore database not initialized.")
    
    if product.sellerId != current_user['uid']:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Seller ID must match authenticated user.")

    products_ref = db.collection('products')
    try:
        # Prepare data for Firestore
        product_data = product.model_dump()
        now = datetime.datetime.now(datetime.timezone.utc) 

        # Add server-managed fields
        product_data['postedAt'] = now
        product_data['updatedAt'] = now
        product_data['views'] = 0 # Initialize views to 0

        
        update_time, doc_ref = products_ref.add(product_data) 

      
        new_product_doc = doc_ref.get()
        new_product_data = new_product_doc.to_dict()
        new_product_data['productId'] = new_product_doc.id
        
        
        if 'postedAt' in new_product_data and hasattr(new_product_data['postedAt'], 'isoformat'):
            new_product_data['postedAt'] = new_product_data['postedAt'].isoformat()
        if 'updatedAt' in new_product_data and hasattr(new_product_data['updatedAt'], 'isoformat'):
            new_product_data['updatedAt'] = new_product_data['updatedAt'].isoformat()

        return Product(**new_product_data)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error creating product: {e}")

@app.put("/products/{product_id}", response_model=Product, summary="Update an existing product")
async def update_product(product_id: str, product_update: ProductUpdate, current_user: dict = Depends(get_current_user)):
    """
    Updates an existing product listing in the Firestore 'products' collection.
    Only provided fields will be updated.
    """
    if db is None:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Firestore database not initialized.")
    product_ref = db.collection('products').document(product_id)
    try:
        doc = product_ref.get()
        if not doc.exists:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
        
        product_data = doc.to_dict()
        if product_data.get('sellerId') != current_user['uid']:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have permission to update this product.")

        # Get only the fields that were provided in the request body
        update_data = product_update.model_dump(exclude_unset=True) # Exclude fields not set in the request
        
        if not update_data:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No fields provided for update")

        now = datetime.datetime.now(datetime.timezone.utc)
        update_data['updatedAt'] = now # Update the timestamp on modification

        product_ref.update(update_data) # Synchronous update

        # Fetch the updated document to return the full Product model
        updated_product_doc = product_ref.get()
        updated_product_data = updated_product_doc.to_dict()
        updated_product_data['productId'] = updated_product_doc.id

        # Convert Firestore Timestamps for the response model
        if 'postedAt' in updated_product_data and hasattr(updated_product_data['postedAt'], 'isoformat'):
            updated_product_data['postedAt'] = updated_product_data['postedAt'].isoformat()
        if 'updatedAt' in updated_product_data and hasattr(updated_product_data['updatedAt'], 'isoformat'):
            updated_product_data['updatedAt'] = updated_product_data['updatedAt'].isoformat()
            
        return Product(**updated_product_data)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error updating product: {e}")

@app.delete("/products/{product_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete a product")
async def delete_product(product_id: str, current_user: dict = Depends(get_current_user)):
    """
    Deletes a product listing from the Firestore 'products' collection.
    """
    if db is None:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Firestore database not initialized.")
    product_ref = db.collection('products').document(product_id)
    try:
        doc = product_ref.get()
        if not doc.exists:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
        
        product_data = doc.to_dict()
        if product_data.get('sellerId') != current_user['uid']:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have permission to delete this product.")

        product_ref.delete() # Synchronous delete
        return Response(status_code=status.HTTP_204_NO_CONTENT)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error deleting product: {e}")
    
    
@app.get("/users", response_model=List[User], summary="Get all users")
async def get_all_users(current_user: dict = Depends(get_current_user)):
    """
    Retrieves a list of all user profiles from the Firestore 'users' collection.
    NOTE: This endpoint is protected and requires authentication. 
    In a real-world application, this should be restricted to admin users.
    """
    if db is None:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Firestore database not initialized.")
    users_ref = db.collection('users')
    try:
        docs = users_ref.stream()
        users = []
        for doc in docs:
            user_data = doc.to_dict()
            # Convert Firestore Timestamps to datetime objects for Pydantic
            if 'createdAt' in user_data and hasattr(user_data['createdAt'], 'isoformat'):
                user_data['createdAt'] = user_data['createdAt'].isoformat()
            if 'lastLoginAt' in user_data and hasattr(user_data['lastLoginAt'], 'isoformat'):
                user_data['lastLoginAt'] = user_data['lastLoginAt'].isoformat()
            
            user_data['userId'] = doc.id # Ensure userId is included from the document ID
            users.append(User(**user_data))
        return users
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error fetching users: {e}")

@app.get("/users/{user_id}", response_model=User, summary="Get a user by ID")
async def get_user_by_id(user_id: str, current_user: dict = Depends(get_current_user)):
    """
    Retrieves a single user profile by their unique ID from the Firestore 'users' collection.
    A user can only retrieve their own profile.
    """
    if db is None:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Firestore database not initialized.")
    
    if user_id != current_user['uid']:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You can only retrieve your own profile.")

    user_ref = db.collection('users').document(user_id)
    try:
        doc = user_ref.get()
        if not doc.exists:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        
        user_data = doc.to_dict()
        if 'createdAt' in user_data and hasattr(user_data['createdAt'], 'isoformat'):
            user_data['createdAt'] = user_data['createdAt'].isoformat()
        if 'lastLoginAt' in user_data and hasattr(user_data['lastLoginAt'], 'isoformat'):
            user_data['lastLoginAt'] = user_data['lastLoginAt'].isoformat()

        user_data['userId'] = doc.id
        return User(**user_data)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error fetching user: {e}")

@app.post("/users", response_model=User, status_code=status.HTTP_201_CREATED, summary="Create a new user")
async def create_user(user: UserCreate, current_user: dict = Depends(get_current_user)):
    """
    Creates a new user profile in the Firestore 'users' collection.
    The document ID is the Firebase UID of the authenticated user.
    This should be called once after a user signs up via Firebase Authentication.
    """
    if db is None:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Firestore database not initialized.")
    
    user_id = current_user['uid']
    user_ref = db.collection('users').document(user_id)

    try:
        if user_ref.get().exists:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=f"User profile for UID {user_id} already exists.")

        user_data = user.model_dump()
        now = datetime.datetime.now(datetime.timezone.utc)

        user_data['createdAt'] = now
        user_data['lastLoginAt'] = now

        user_ref.set(user_data)

        new_user_doc = user_ref.get()
        new_user_data = new_user_doc.to_dict()
        new_user_data['userId'] = new_user_doc.id
        
        if 'createdAt' in new_user_data and hasattr(new_user_data['createdAt'], 'isoformat'):
            new_user_data['createdAt'] = new_user_data['createdAt'].isoformat()
        if 'lastLoginAt' in new_user_data and hasattr(new_user_data['lastLoginAt'], 'isoformat'):
            new_user_data['lastLoginAt'] = new_user_data['lastLoginAt'].isoformat()

        return User(**new_user_data)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error creating user: {e}")

@app.put("/users/{user_id}", response_model=User, summary="Update an existing user")
async def update_user(user_id: str, user_update: UserUpdate, current_user: dict = Depends(get_current_user)):
    """
    Updates an existing user profile in the Firestore 'users' collection.
    Only provided fields will be updated. A user can only update their own profile.
    """
    if db is None:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Firestore database not initialized.")
    
    if user_id != current_user['uid']:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You can only update your own profile.")

    user_ref = db.collection('users').document(user_id)
    try:
        doc = user_ref.get()
        if not doc.exists:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        
        update_data = user_update.model_dump(exclude_unset=True)
        
        if not update_data:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No fields provided for update")

        if 'createdAt' in update_data:
            del update_data['createdAt']
        if 'userId' in update_data:
            del update_data['userId']

        user_ref.update(update_data)

        updated_user_doc = user_ref.get()
        updated_user_data = updated_user_doc.to_dict()
        updated_user_data['userId'] = updated_user_doc.id

        if 'createdAt' in updated_user_data and hasattr(updated_user_data['createdAt'], 'isoformat'):
            updated_user_data['createdAt'] = updated_user_data['createdAt'].isoformat()
        if 'lastLoginAt' in updated_user_data and hasattr(updated_user_data['lastLoginAt'], 'isoformat'):
            updated_user_data['lastLoginAt'] = updated_user_data['lastLoginAt'].isoformat()
            
        return User(**updated_user_data)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error updating user: {e}")

@app.delete("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete a user")
async def delete_user(user_id: str, current_user: dict = Depends(get_current_user)):
    """
    Deletes a user profile from the Firestore 'users' collection.
    Note: In a real app, you'd also want to delete the user from Firebase Authentication.
    A user can only delete their own profile.
    """
    if db is None:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Firestore database not initialized.")
    
    if user_id != current_user['uid']:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You can only delete your own profile.")

    user_ref = db.collection('users').document(user_id)
    try:
        doc = user_ref.get()
        if not doc.exists:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        
        user_ref.delete()
        return Response(status_code=status.HTTP_204_NO_CONTENT)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error deleting user: {e}")

@app.get("/orders", response_model=List[Order], summary="Get all orders for the current user")
async def get_orders(current_user: dict = Depends(get_current_user)):
    """
    Retrieves a list of all orders from the Firestore 'orders' collection 
    where the current user is either the buyer or the seller.
    """
    if db is None:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Firestore database not initialized.")
    
    user_id = current_user['uid']
    orders_dict = {}

    try:
        # Query for orders where the user is the buyer
        buyer_query = db.collection('orders').where('buyerId', '==', user_id).stream()
        for doc in buyer_query:
            order_data = doc.to_dict()
            if 'orderedAt' in order_data and hasattr(order_data['orderedAt'], 'isoformat'):
                order_data['orderedAt'] = order_data['orderedAt'].isoformat()
            if 'shippedAt' in order_data and hasattr(order_data['shippedAt'], 'isoformat'):
                order_data['shippedAt'] = order_data['shippedAt'].isoformat()
            if 'deliveredAt' in order_data and hasattr(order_data['deliveredAt'], 'isoformat'):
                order_data['deliveredAt'] = order_data['deliveredAt'].isoformat()
            order_data['orderId'] = doc.id
            orders_dict[doc.id] = Order(**order_data)

        # Query for orders where the user is the seller
        seller_query = db.collection('orders').where('sellerId', '==', user_id).stream()
        for doc in seller_query:
            if doc.id not in orders_dict: # Avoid duplicates
                order_data = doc.to_dict()
                if 'orderedAt' in order_data and hasattr(order_data['orderedAt'], 'isoformat'):
                    order_data['orderedAt'] = order_data['orderedAt'].isoformat()
                if 'shippedAt' in order_data and hasattr(order_data['shippedAt'], 'isoformat'):
                    order_data['shippedAt'] = order_data['shippedAt'].isoformat()
                if 'deliveredAt' in order_data and hasattr(order_data['deliveredAt'], 'isoformat'):
                    order_data['deliveredAt'] = order_data['deliveredAt'].isoformat()
                order_data['orderId'] = doc.id
                orders_dict[doc.id] = Order(**order_data)

        return list(orders_dict.values())
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error fetching orders: {e}")


@app.get("/orders/{order_id}", response_model=Order, summary="Get an order by ID")
async def get_order_by_id(order_id: str, current_user: dict = Depends(get_current_user)):
    """
    Retrieves a single order by its unique ID.
    A user can only retrieve an order if they are the buyer or the seller.
    """
    if db is None:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Firestore database not initialized.")
    order_ref = db.collection('orders').document(order_id)
    try:
        doc = order_ref.get()
        if not doc.exists:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
        
        order_data = doc.to_dict()
        
        if order_data.get('buyerId') != current_user['uid'] and order_data.get('sellerId') != current_user['uid']:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have permission to view this order.")

        if 'orderedAt' in order_data and hasattr(order_data['orderedAt'], 'isoformat'):
            order_data['orderedAt'] = order_data['orderedAt'].isoformat()
        if 'shippedAt' in order_data and hasattr(order_data['shippedAt'], 'isoformat'):
            order_data['shippedAt'] = order_data['shippedAt'].isoformat()
        if 'deliveredAt' in order_data and hasattr(order_data['deliveredAt'], 'isoformat'):
            order_data['deliveredAt'] = order_data['deliveredAt'].isoformat()

        order_data['orderId'] = doc.id
        return Order(**order_data)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error fetching order: {e}")

@app.post("/orders", response_model=Order, status_code=status.HTTP_201_CREATED, summary="Create a new order")
async def create_order(order: OrderCreate, current_user: dict = Depends(get_current_user)):
    """
    Creates a new order in the Firestore 'orders' collection.
    The buyerId must match the authenticated user.
    """
    if db is None:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Firestore database not initialized.")
    
    if order.buyerId != current_user['uid']:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Buyer ID must match authenticated user.")

    orders_ref = db.collection('orders')
    try:
        order_data = order.model_dump()
        now = datetime.datetime.now(datetime.timezone.utc)

        order_data['orderedAt'] = now
        # shippedAt and deliveredAt are optional and set later

        update_time, doc_ref = orders_ref.add(order_data) 

        new_order_doc = doc_ref.get() 
        new_order_data = new_order_doc.to_dict()
        new_order_data['orderId'] = new_order_doc.id
        
        if 'orderedAt' in new_order_data and hasattr(new_order_data['orderedAt'], 'isoformat'):
            new_order_data['orderedAt'] = new_order_data['orderedAt'].isoformat()
        if 'shippedAt' in new_order_data and hasattr(new_order_data['shippedAt'], 'isoformat'):
            new_order_data['shippedAt'] = new_order_data['shippedAt'].isoformat()
        if 'deliveredAt' in new_order_data and hasattr(new_order_data['deliveredAt'], 'isoformat'):
            new_order_data['deliveredAt'] = new_order_data['deliveredAt'].isoformat()

        return Order(**new_order_data)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error creating order: {e}")

@app.put("/orders/{order_id}", response_model=Order, summary="Update an existing order")
async def update_order(order_id: str, order_update: OrderUpdate, current_user: dict = Depends(get_current_user)):
    """
    Updates an existing order. Only the buyer or seller can update it.
    """
    if db is None:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Firestore database not initialized.")
    order_ref = db.collection('orders').document(order_id)
    try:
        doc = order_ref.get()
        if not doc.exists:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
        
        order_data = doc.to_dict()
        if order_data.get('buyerId') != current_user['uid'] and order_data.get('sellerId') != current_user['uid']:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have permission to update this order.")

        update_data = order_update.model_dump(exclude_unset=True)
        
        if not update_data:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No fields provided for update")

        # Handle specific timestamp updates if they are provided
        if 'shippedAt' in update_data and update_data['shippedAt'] is None: # Allow setting to null
            update_data['shippedAt'] = DELETE_FIELD
        elif 'shippedAt' in update_data and isinstance(update_data['shippedAt'], str):
            update_data['shippedAt'] = datetime.datetime.fromisoformat(update_data['shippedAt'].replace('Z', '+00:00'))

        if 'deliveredAt' in update_data and update_data['deliveredAt'] is None: # Allow setting to null
            update_data['deliveredAt'] = DELETE_FIELD
        elif 'deliveredAt' in update_data and isinstance(update_data['deliveredAt'], str):
            update_data['deliveredAt'] = datetime.datetime.fromisoformat(update_data['deliveredAt'].replace('Z', '+00:00'))
        
        order_ref.update(update_data)

        updated_order_doc = order_ref.get()
        updated_order_data = updated_order_doc.to_dict()
        updated_order_data['orderId'] = updated_order_doc.id

        if 'orderedAt' in updated_order_data and hasattr(updated_order_data['orderedAt'], 'isoformat'):
            updated_order_data['orderedAt'] = updated_order_data['orderedAt'].isoformat()
        if 'shippedAt' in updated_order_data and hasattr(updated_order_data['shippedAt'], 'isoformat'):
            updated_order_data['shippedAt'] = updated_order_data['shippedAt'].isoformat()
        if 'deliveredAt' in updated_order_data and hasattr(updated_order_data['deliveredAt'], 'isoformat'):
            updated_order_data['deliveredAt'] = updated_order_data['deliveredAt'].isoformat()
            
        return Order(**updated_order_data)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error updating order: {e}")

@app.delete("/orders/{order_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete an order")
async def delete_order(order_id: str, current_user: dict = Depends(get_current_user)):
    """
    Deletes an order. Only the buyer or seller can delete it.
    """
    if db is None:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Firestore database not initialized.")
    order_ref = db.collection('orders').document(order_id)
    try:
        doc = order_ref.get()
        if not doc.exists:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
        
        order_data = doc.to_dict()
        if order_data.get('buyerId') != current_user['uid'] and order_data.get('sellerId') != current_user['uid']:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have permission to delete this order.")

        order_ref.delete()
        return Response(status_code=status.HTTP_204_NO_CONTENT)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error deleting order: {e}")

# --- Review Endpoints ---

@app.get("/reviews", response_model=List[Review], summary="Get all reviews")
async def get_all_reviews():
    """
    Retrieves a list of all reviews from the Firestore 'reviews' collection.
    """
    if db is None:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Firestore database not initialized.")
    reviews_ref = db.collection('reviews')
    try:
        docs = reviews_ref.stream()
        reviews = []
        for doc in docs:
            review_data = doc.to_dict()
            if 'reviewedAt' in review_data and hasattr(review_data['reviewedAt'], 'isoformat'):
                review_data['reviewedAt'] = review_data['reviewedAt'].isoformat()
            
            review_data['reviewId'] = doc.id
            reviews.append(Review(**review_data))
        return reviews
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error fetching reviews: {e}")

@app.get("/reviews/{review_id}", response_model=Review, summary="Get a review by ID")
async def get_review_by_id(review_id: str):
    """
    Retrieves a single review by its unique ID from the Firestore 'reviews' collection.
    """
    if db is None:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Firestore database not initialized.")
    review_ref = db.collection('reviews').document(review_id)
    try:
        doc = review_ref.get()
        if not doc.exists:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Review not found")
        
        review_data = doc.to_dict()
        if 'reviewedAt' in review_data and hasattr(review_data['reviewedAt'], 'isoformat'):
            review_data['reviewedAt'] = review_data['reviewedAt'].isoformat()

        review_data['reviewId'] = doc.id
        return Review(**review_data)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error fetching review: {e}")

@app.post("/reviews", response_model=Review, status_code=status.HTTP_201_CREATED, summary="Create a new review")
async def create_review(review: ReviewCreate, current_user: dict = Depends(get_current_user)):
    """
    Creates a new review in the Firestore 'reviews' collection.
    The reviewerId must match the authenticated user.
    """
    if db is None:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Firestore database not initialized.")
    
    if review.reviewerId != current_user['uid']:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Reviewer ID must match authenticated user.")

    reviews_ref = db.collection('reviews')
    try:
        review_data = review.model_dump()
        now = datetime.datetime.now(datetime.timezone.utc)

        review_data['reviewedAt'] = now

        update_time, doc_ref = reviews_ref.add(review_data) 

        new_review_doc = doc_ref.get() 
        new_review_data = new_review_doc.to_dict()
        new_review_data['reviewId'] = new_review_doc.id
        
        if 'reviewedAt' in new_review_data and hasattr(new_review_data['reviewedAt'], 'isoformat'):
            new_review_data['reviewedAt'] = new_review_data['reviewedAt'].isoformat()

        return Review(**new_review_data)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error creating review: {e}")

@app.put("/reviews/{review_id}", response_model=Review, summary="Update an existing review")
async def update_review(review_id: str, review_update: ReviewUpdate, current_user: dict = Depends(get_current_user)):
    """
    Updates an existing review. Only the original reviewer can update it.
    """
    if db is None:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Firestore database not initialized.")
    review_ref = db.collection('reviews').document(review_id)
    try:
        doc = review_ref.get()
        if not doc.exists:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Review not found")
        
        review_data = doc.to_dict()
        if review_data.get('reviewerId') != current_user['uid']:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have permission to update this review.")

        update_data = review_update.model_dump(exclude_unset=True)
        
        if not update_data:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No fields provided for update")
        
        review_ref.update(update_data)

        updated_review_doc = review_ref.get()
        updated_review_data = updated_review_doc.to_dict()
        updated_review_data['reviewId'] = updated_review_doc.id

        if 'reviewedAt' in updated_review_data and hasattr(updated_review_data['reviewedAt'], 'isoformat'):
            updated_review_data['reviewedAt'] = updated_review_data['reviewedAt'].isoformat()
            
        return Review(**updated_review_data)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error updating review: {e}")

@app.delete("/reviews/{review_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete a review")
async def delete_review(review_id: str, current_user: dict = Depends(get_current_user)):
    """
    Deletes a review. Only the original reviewer can delete it.
    """
    if db is None:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Firestore database not initialized.")
    review_ref = db.collection('reviews').document(review_id)
    try:
        doc = review_ref.get()
        if not doc.exists:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Review not found")
        
        review_data = doc.to_dict()
        if review_data.get('reviewerId') != current_user['uid']:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have permission to delete this review.")

        review_ref.delete()
        return Response(status_code=status.HTTP_204_NO_CONTENT)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error deleting review: {e}")
