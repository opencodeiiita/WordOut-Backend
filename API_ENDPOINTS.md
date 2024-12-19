# API EndPoints

### User Signup

- **Method:** `POST`
- **URL:** `/api/signup`
- **Purpose:**  `Sign up the user`
- **Request Headers:** `None`
- **Request Body:**
  ```json
  {
    "name": "string",
    "email":"string",
    "password": "string"
  }
  ```

- **Example Request:**
  ```json
  {
    "name": "ABC",
    "email":"abc@def.com",
    "password":"123456"
  }
  ```

- **Example Response:**

- **Success Response:**
- **Response Body:**
  ```json
  {
    "status": "success",
    "message": "User registered successfully",
    "userId": "676408066f52cf35843a5047",
    "token": "<--token-->"
  }
  ```  
- **Response Header:** `Authorization: Bearer <--token-->`

- **Error Responses**
 ```json
  {
    "status": "error",
    "message": "User with this email already exists"
  }
  ``` 
  ```json
  {
    "status": "error",
    "message": "Validation failed",
    "errors": [
        {
            "type": "field",
            "value": "12356",
            "msg": "Password must be at least 6 characters long",
            "path": "password",
            "location": "body"
        }
    ]
  }
  ```

### Send a friend request

- **Method:** `POST`
- **URL:** `/api/users/friend-request/:receiverId`
- **Purpose:**  `Send a friend Request`
- **Request Headers:** `None`
- **Request Body:**
  ```json
  {
    "userId":"ObjectId"
  }
  ```

- **Example Request:**
  ```json
  {
    "userId":"676408066f52cf35843a5047"
  }
  ```

- **Example Response:**

- **Success Response:**
- **Response Body:**
  ```json
  {
    "message": "Friend request sent!",
    "friendRequest": {
        "sender": "676408066f52cf35843a5047",
        "receiver": "67640c946f52cf35843a504c",
        "status": "pending",
        "_id": "67640e8c6f52cf35843a504f",
        "created_at": "2024-12-19T12:16:12.757Z",
        "__v": 0
    }
  }
  ```  

- **Error Responses**
 ```json
  {
    "message": "Friend request already sent!"
  }
  ``` 
  ```json
  {
    "message": "Error sending friend request",
    "error": {
        "stringValue": "\"67640c946f52cf35843a5d04c\"",
        "valueType": "string",
        "kind": "ObjectId",
        "value": "67640c946f52cf35843a5d04c",
        "path": "receiver",
        "reason": {},
        "name": "CastError",
        "message": "Cast to ObjectId failed for value \"67640c946f52cf35843a5d04c\" (type string) at path \"receiver\" for model \"FriendRequest\""
    }
  }
  ``` 

### Accept/Reject a friend request

- **Method:** `POST`
- **URL:** `/api/users/friend-request/respond/:requestId`
- **Purpose:**  `Take action on a friend Request`
- **Request Headers:** `None`
- **Request Body:**
  ```json
  {
    "status":"accepted/rejected"
  }
  ```

- **Example Request:**
  ```json
  {
    "status":"accepted"
  }
  ```

- **Example Response:**

- **Success Response:**
- **Response Body:**
  ```json
  {
    "message": "Friend request accepted!",
    "friendRequest": {
        "_id": "67640e8c6f52cf35843a504f",
        "sender": "676408066f52cf35843a5047",
        "receiver": "67640c946f52cf35843a504c",
        "status": "accepted",
        "created_at": "2024-12-19T12:16:12.757Z",
        "__v": 0
    }
  }
  ```  

- **Error Responses**
 ```json
  {
    "message": "Invalid status!"
  } 
  ``` 
  ```json
  {
    "message": "Error responding to friend request",
    "error": {
        "stringValue": "\"67640e8c6f52cf35s843a504f\"",
        "valueType": "string",
        "kind": "ObjectId",
        "value": "67640e8c6f52cf35s843a504f",
        "path": "_id",
        "reason": {},
        "name": "CastError",
        "message": "Cast to ObjectId failed for value \"67640e8c6f52cf35s843a504f\" (type string) at path \"_id\" for model \"FriendRequest\""
    }
  }
  ``` 

### Get All Friend Requests for a User

- **Method:** `GET`
- **URL:** `/api/users/friend-requests/:userId`
- **Purpose:**  `Get All Friend Requests for a User`
- **Request Headers:** `None`
- **Request Body:** `None`

- **Example Response:**

- **Success Response:**
- **Response Body:**
  ```json
  {
    "message": "Friend requests fetched",
    "requests": [
        {
            "_id": "67640e8c6f52cf35843a504f",
            "sender": {
                "_id": "676408066f52cf35843a5047",
                "name": "ABC",
                "email": "abc@def.com"
            },
            "receiver": {
                "_id": "67640c946f52cf35843a504c",
                "name": "DEF",
                "email": "abcsd@def.com"
            },
            "status": "accepted",
            "created_at": "2024-12-19T12:16:12.757Z",
            "__v": 0
        }
    ]
  }
  ```  

- **Error Responses** 
  ```json
  {
    "message": "Error fetching friend requests",
    "error": {
        "stringValue": "\"676408066f52scf35843a5047\"",
        "valueType": "string",
        "kind": "ObjectId",
        "value": "676408066f52scf35843a5047",
        "path": "receiver",
        "reason": {},
        "name": "CastError",
        "message": "Cast to ObjectId failed for value \"676408066f52scf35843a5047\" (type string) at path \"receiver\" for model \"FriendRequest\""
    }
  }
  ``` 

### Get Status of a Specific Friend Request

- **Method:** `GET`
- **URL:** `/api/users/friend-request/status/:requestId`
- **Purpose:**  `Get Status of a Specific Friend Request`
- **Request Headers:** `None`
- **Request Body:** `None`

- **Example Response:**

- **Success Response:**
- **Response Body:**
  ```json
  {
    "message": "Friend request status fetched",
    "status": "accepted",
    "friendRequest": {
        "_id": "67640e8c6f52cf35843a504f",
        "sender": {
            "_id": "676408066f52cf35843a5047",
            "name": "ABC",
            "email": "abc@def.com"
        },
        "receiver": {
            "_id": "67640c946f52cf35843a504c",
            "name": "DEF",
            "email": "abcsd@def.com"
        },
        "status": "accepted",
        "created_at": "2024-12-19T12:16:12.757Z",
        "__v": 0
    }
  }
  ```  

- **Error Responses**
  ```json
  {
    "message": "Error fetching friend request status",
    "error": {
        "stringValue": "\"67640e8c6f5d2cf35843a504f\"",
        "valueType": "string",
        "kind": "ObjectId",
        "value": "67640e8c6f5d2cf35843a504f",
        "path": "_id",
        "reason": {},
        "name": "CastError",
        "message": "Cast to ObjectId failed for value \"67640e8c6f5d2cf35843a504f\" (type string) at path \"_id\" for model \"FriendRequest\""
    }
  }
  ``` 

### Mark Player as Online

- **Method:** `POST`
- **URL:** `/api/users/mark-online/:userId`
- **Purpose:**  `Mark Player as Online`
- **Request Headers:** `None`
- **Request Body:** `None`

- **Example Response:**

- **Success Response:**
- **Response Body:**
  ```json
  {
    "message": "User marked as online",
    "user": {
        "_id": "676408066f52cf35843a5047",
        "name": "ABC",
        "email": "abc@def.com",
        "password": "$2a$12$kHeUYNhqW4PjnSWcEp0ldOn92ypeT4e8vdN5to6SGGQATxeRHEVuy",
        "last_online": null,
        "blockedUsers": [],
        "bio": "",
        "wordScore": 0,
        "__v": 0
    }
  }
  ```  

- **Error Responses**
  ```json
  {
    "message": "Error marking user as online",
    "error": {
        "stringValue": "\"676408066xf52cf35843a5047\"",
        "valueType": "string",
        "kind": "ObjectId",
        "value": "676408066xf52cf35843a5047",
        "path": "_id",
        "reason": {},
        "name": "CastError",
        "message": "Cast to ObjectId failed for value \"676408066xf52cf35843a5047\" (type string) at path \"_id\" for model \"user\""
    }
  }
  ``` 

### Mark Player as Offline

- **Method:** `POST`
- **URL:** `/api/users/mark-offline/:userId`
- **Purpose:**  `Mark Player as Online`
- **Request Headers:** `None`
- **Request Body:** `None`

- **Example Response:**

- **Success Response:**
- **Response Body:**
  ```json
  {
    "message": "User marked as offline",
    "user": {
        "_id": "676408066f52cf35843a5047",
        "name": "ABC",
        "email": "abc@def.com",
        "password": "$2a$12$kHeUYNhqW4PjnSWcEp0ldOn92ypeT4e8vdN5to6SGGQATxeRHEVuy",
        "last_online": "2024-12-19T12:42:25.794Z",
        "blockedUsers": [],
        "bio": "",
        "wordScore": 0,
        "__v": 0
    }
  }
  ```  

- **Error Responses**
  ```json
  {
    "message": "Error marking user as offline",
    "error": {
        "stringValue": "\"676408066xf52cf35843a5047\"",
        "valueType": "string",
        "kind": "ObjectId",
        "value": "676408066xf52cf35843a5047",
        "path": "_id",
        "reason": {},
        "name": "CastError",
        "message": "Cast to ObjectId failed for value \"676408066xf52cf35843a5047\" (type string) at path \"_id\" for model \"user\""
    }
  }
  ``` 

### Get Last Online of a User

- **Method:** `GET`
- **URL:** `/api/users/last-online/:userId`
- **Purpose:**  `Get Last Online of a User`
- **Request Headers:** `None`
- **Request Body:** `None`

- **Example Response:**

- **Success Response:**
- **Response Body:**
  ```json
  {
    "message": "Last online time",
    "last_online": "19-12-2024(18:12)"
  }
  ```  

- **Error Responses**
  ```json
  {
    "message": "Error fetching last online",
    "error": {
        "stringValue": "\"676408066xf52cf35843a5047\"",
        "valueType": "string",
        "kind": "ObjectId",
        "value": "676408066xf52cf35843a5047",
        "path": "_id",
        "reason": {},
        "name": "CastError",
        "message": "Cast to ObjectId failed for value \"676408066xf52cf35843a5047\" (type string) at path \"_id\" for model \"user\""
    }
  }
  ``` 

### Block a User

- **Method:** `POST`
- **URL:** `/api/users/block`
- **Purpose:**  `Block a User`
- **Request Headers:** `None`
- **Request Body:** 
   ```json
  {
    "userId": "ObjectID",
    "blockedUserId": "ObjectID"
  }
  ```

- **Example Request:**
   ```json
  {
    "userId": "676408066f52cf35843a5047",
    "blockedUserId": "67640c946f52cf358s43a504c"
  }
  ```

- **Example Response:**

- **Success Response:**
- **Response Body:**
  ```json
  {
    "message": "User 67640c946f52cf35843a504c blocked successfully!",
    "blockedUsers": [
        "67640c946f52cf35843a504c"
    ]
  }
  ```  

- **Error Responses**
  ```json
  {
    "message": "Error blocking user",
    "error": {
        "stringValue": "\"67640c946f52cf358s43a504c\"",
        "valueType": "string",
        "kind": "ObjectId",
        "value": "67640c946f52cf358s43a504c",
        "path": "blockedUsers",
        "reason": {},
        "name": "CastError",
        "message": "Cast to ObjectId failed for value \"67640c946f52cf358s43a504c\" (type string) at path \"blockedUsers\" because of \"BSONError\""
    }
  }
  ``` 

### Unblock a User

- **Method:** `POST`
- **URL:** `/api/users/unblock`
- **Purpose:**  `Unblock a User`
- **Request Headers:** `None`
- **Request Body:** 
   ```json
  {
    "userId": "ObjectID",
    "blockedUserId": "ObjectID"
  }
  ```

- **Example Request:**
   ```json
  {
    "userId": "676408066f52cf35843a5047",
    "blockedUserId": "67640c946f52cf358s43a504c"
  }
  ```

- **Example Response:**

- **Success Response:**
- **Response Body:**
  ```json
  {
    "message": "User 67640c946f52cf35843a504c unblocked successfully!",
    "blockedUsers": []
  }
  ```  

- **Error Responses**
  ```json
  {
    "message": "Error unblocking user",
    "error": {
        "stringValue": "\"676408066f52cf35843a5s047\"",
        "valueType": "string",
        "kind": "ObjectId",
        "value": "676408066f52cf35843a5s047",
        "path": "_id",
        "reason": {},
        "name": "CastError",
        "message": "Cast to ObjectId failed for value \"676408066f52cf35843a5s047\" (type string) at path \"_id\" for model \"user\""
    }
  }
  ``` 

### Get All Blocked Users for a User

- **Method:** `GET`
- **URL:** `/api/users/blocked-users/:userId`
- **Purpose:**  `Get All Blocked Users for a User`
- **Request Headers:** `None`
- **Request Body:** `None`

- **Example Response:**

- **Success Response:**
- **Response Body:**
  ```json
  {
    "message": "Blocked users fetched successfully",
    "blockedUsers": []
  }
  ```  

- **Error Responses**
  ```json
  {
    "message": "Error fetching blocked users",
    "error": "Cast to ObjectId failed for value \"676s40c946f52cf35843a504c\" (type string) at path \"_id\" for model \"user\""
  }
  ``` 

### Fetching user profile

- **Method:** `GET`
- **URL:** `/api/users/profile/:userId`
- **Purpose:**  `Fetching user profile`
- **Request Headers:** `None`
- **Request Body:** `None`

- **Example Response:**

- **Success Response:**
- **Response Body:**
  ```json
  {
    "message": "Profile fetched successfully",
    "profile": {
        "_id": "67640c946f52cf35843a504c",
        "name": "DEF",
        "email": "abcsd@def.com",
        "password": "$2a$12$AkIzUHCQ1X8.lzzCcYi4Fu3H9FzGojtx0j7/pZSoQGlbyMZBVu9EW",
        "last_online": null,
        "blockedUsers": [],
        "bio": "",
        "wordScore": 0,
        "__v": 0
    }
  }
  ```  

- **Error Responses**
  ```json
  {
    "message": "Error fetching profile",
    "error": {
        "stringValue": "\"676s40c946f52cf35843a504c\"",
        "valueType": "string",
        "kind": "ObjectId",
        "value": "676s40c946f52cf35843a504c",
        "path": "_id",
        "reason": {},
        "name": "CastError",
        "message": "Cast to ObjectId failed for value \"676s40c946f52cf35843a504c\" (type string) at path \"_id\" for model \"user\""
    }
  } 
  ``` 

### Updating user profile

- **Method:** `PUT`
- **URL:** `/api/users/profile/:userId`
- **Purpose:**  `Updating user profile`
- **Request Headers:** `None`
- **Request Body:** 
  ```json
  {
    "name":"String",
    "email":"String",
    "bio":"String"
  }
  ```

- **Example Request:**
  ```json
  {
    "name":"newName",
    "email":"aso@osam.com",
    "bio":"Updated bio"
  }
  ```

- **Example Response:**

- **Success Response:**
- **Response Body:**
  ```json
  {
    "message": "Profile updated successfully",
    "profile": {
        "_id": "67640c946f52cf35843a504c",
        "name": "newName",
        "email": "aso@osam.com",
        "password": "$2a$12$AkIzUHCQ1X8.lzzCcYi4Fu3H9FzGojtx0j7/pZSoQGlbyMZBVu9EW",
        "last_online": null,
        "blockedUsers": [],
        "bio": "Updated bio",
        "wordScore": 0,
        "__v": 0
    }
  }
  ```  

- **Error Responses**
  ```json
  {
    "message": "Error updating profile",
    "error": {
        "stringValue": "\"67640ac946f52cf35843a504c\"",
        "valueType": "string",
        "kind": "ObjectId",
        "value": "67640ac946f52cf35843a504c",
        "path": "_id",
        "reason": {},
        "name": "CastError",
        "message": "Cast to ObjectId failed for value \"67640ac946f52cf35843a504c\" (type string) at path \"_id\" for model \"user\""
    }
  } 
  ``` 

### Getting all friends

- **Method:** `GET`
- **URL:** `/api/users/friends/search`
- **Purpose:**  `Getting all friends`
- **Request Headers:** `None`
- **Request Body:** 
  ```json
  {
    "userId":"ObjectID",
    "name":"String",
    "email":"String"
  }
  ```

- **Example Request:**
  ```json
  {
    "userId":"676408066f52cf35843a5047",
    "name":"newName",
    "email":"aso@osam.com"
  }
  ```

- **Example Response:**

- **Success Response:**
- **Response Body:**
  ```json
  {
    "success": true,
    "data": []
  }
  ```  

### Getting wordScore

- **Method:** `GET`
- **URL:** `/api/users/wordScore/:id`
- **Purpose:**  `Getting wordScore`
- **Request Headers:** `None`
- **Request Body:** `None`

- **Example Response:**

- **Success Response:**
- **Response Body:**
  ```json
  {
    "wordScore": 0
  }
  ```  

  - **Error Responses**
  ```json
  {
    "message": "Error while getting word score",
    "error": {
        "stringValue": "\"676408066f5a2cf35843a5047\"",
        "valueType": "string",
        "kind": "ObjectId",
        "value": "676408066f5a2cf35843a5047",
        "path": "_id",
        "reason": {},
        "name": "CastError",
        "message": "Cast to ObjectId failed for value \"676408066f5a2cf35843a5047\" (type string) at path \"_id\" for model \"user\""
    }
  } 
  ``` 

### Increasing wordScore

- **Method:** `POST`
- **URL:** `/api/users/wordScore/:id/increase`
- **Purpose:**  `Increasing wordScore`
- **Request Headers:** `None`
- **Request Body:** 
  ```json
  {
    "increment": "Number"
  }
  ```

- **Example Response:**
  ```json
  {
    "increment": 30
  }
  ```

- **Example Response:**

- **Success Response:**
- **Response Body:**
  ```json
  {
    "message": "WordScore increased",
    "wordScore": 30
  }
  ```  

  - **Error Responses**
  ```json
  {
    "message": "Error while increasing word score",
    "error": {
        "stringValue": "\"a676408066f52cf35843a5047\"",
        "valueType": "string",
        "kind": "ObjectId",
        "value": "a676408066f52cf35843a5047",
        "path": "_id",
        "reason": {},
        "name": "CastError",
        "message": "Cast to ObjectId failed for value \"a676408066f52cf35843a5047\" (type string) at path \"_id\" for model \"user\""
    }
  } 
  ``` 

### Decreasing wordScore

- **Method:** `POST`
- **URL:** `/api/users/wordScore/:id/decrease`
- **Purpose:**  `Decreasing wordScore`
- **Request Headers:** `None`
- **Request Body:** 
  ```json
  {
    "decrement": "Number"
  }
  ```

- **Example Response:**
  ```json
  {
    "decrement": 10
  }
  ```

- **Example Response:**

- **Success Response:**
- **Response Body:**
  ```json
  {
    "message": "WordScore decreased",
    "wordScore": 20
  }
  ```  

  - **Error Responses**
  ```json
  {
    "message": "Error while decreasing word score",
    "error": {
        "stringValue": "\"a676408066f52cf35843a5047\"",
        "valueType": "string",
        "kind": "ObjectId",
        "value": "a676408066f52cf35843a5047",
        "path": "_id",
        "reason": {},
        "name": "CastError",
        "message": "Cast to ObjectId failed for value \"a676408066f52cf35843a5047\" (type string) at path \"_id\" for model \"user\""
    }
  } 
  ``` 


