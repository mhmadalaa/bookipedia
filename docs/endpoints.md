# Endpoints

This document provides a list of endpoints available in our backend server.

### Books

| Endpoint | HTTP Method | Description | Full Command |
|----------|-------------|-------------|--------------|
| /books | GET | Request all books meta data | `GET /books` |
| /books | POST | Upload book file | `POST /books` 🚩 this endpoint still under some business constraints | 
| /books/titles | GET | Request all books titles | `GET /books/titles` |
| /books/[book_id] | GET | Request book meta data| `GET /book/[book_id]` |
| /books/files/[book_id] | GET | Request book file | `GET /book/files/[book_id]` |


### User

| Endpoint | HTTP Method | Description | Full Command |
|----------|-------------|-------------|--------------| 
| /signup | POST | create new user | `POST /signup` | 
| /confirm-signup/:confirmToken | PATCH | Confirm signup after sending confirmation token via email | `PATCH /confirm-signup/:confirmToken` | 
| /login | POST | login the user | `POST /login` | 
| /logout | POST | logout the user | `POST /logout` | 
| /forgot-password | POST | Request that user forgot his password | `POST /forgot-password` | 
| /reset-password/:resetToken | PATCH | Reset password with reset token which sent by email | `PATCH /reset-password/:resetToken` | 

### User but not crucial endpoints aka next phase
| Endpoint | HTTP Method | Description | Full Command |
|----------|-------------|-------------|--------------| 
| /change-email | POST | Request to change user email | `POST /change-email` | 
| /reset-email/:resetToken | PATCH | Reset user email by the sended token to current email | `PATCH /reset-email/:resetToken` | 
| /update-user | PATCH | Update user non-crucial data | `PATCH /update-user` | 
| /update-password | PATCH | Request to change user password while he still remember the current password | `PATCH /update-password` | 
| /delete-user | DELETE | Request to delete the user account | `DELETE /delete-user` | 

### ML endpoints 

```md
  Still not clear like
    - chapters summary
    - ML questions and answers
```

### Images, Icons
Images and icons in the application will be served from `/public` directory by get it by image/icon name.

| Endpoint | HTTP Method | Description | Full Command |
|----------|-------------|-------------|--------------| 
| /public/[image.jpg] | GET | Request image or icon | `GET /public/[image.jpg]` |


That's an elementary solution for this problem, and if images and icons getting increased we will make a saving pictures service to work efficiently.