# Endpoints

This document provides a list of endpoints available in our backend server.

### Books `/books`
| Endpoint | HTTP Method | Description | Full Command |
|----------|-------------|-------------|--------------|
| /upload | POST | Upload book file | `POST /upload` |
| /uploadedbooks/:id | GET | Request book file | `GET /uploadedbooks/:id ` |
| /books | GET | Request all books meta data | `GET /books` |
| /books/:id| GET | Request certain book meta data| `GET /books/:id` |
| /books/:id| DELETE| Delete certain book | `DELETE /books/:id` |
| /booksTitles | GET | Request all books titles | `GET /booksTitles` |


### User `/user`
| Endpoint | HTTP Method | Description | Full Command |
|----------|-------------|-------------|--------------| 
| /signup | POST | create new user | `POST /signup` | 
| /confirm-signup/:confirmToken | PATCH | Confirm signup after sending confirmation token via email | `PATCH /confirm-signup/:confirmToken` | 
| /login | POST | login the user | `POST /login` | 
| /logout | POST | logout the user | `POST /logout` | 
| /forgot-password | POST | Request that user forgot his password | `POST /forgot-password` | 
| /reset-password/:resetToken | PATCH | Reset password with reset token which sent by email | `PATCH /reset-password/:resetToken` | 

### AI Endpoints `/ai`
| Endpoint | HTTP Method | Description | Full Command |
|----------|-------------|-------------|--------------| 
| /question/[book_id] | GET | ask question to ai in the current document/book for the current user with the current page in document/book| `GET /question/[book_id]`| 
| /text-to-speech/[book_id] | GET | request to apply TOT to text and retrieve the audio| `GET /text-to-speech/[book_id]`| 


### Notes `/notes`
| Endpoint | HTTP Method | Description | Full Command |
|----------|-------------|-------------|--------------| 
| /notes/[book_id] | POST | Request to store a new note in this book for this user | `POST /notes/[book_id]`| 
| /notes/[book_id] | GET | Request to store get a specific note in this book, page coordinates for this user | `GET /notes/[book_id]`| 
| /notes/[book_id] | DELETE | Request to delete specific not in this book for this user | `DELETE /notes/[book_id]`| 
| /notes/[book_id]/all | GET | Request to get all notes in this book for this user | `GET /notes/[book_id]/all`| 


### Images, Icons
Images and icons in the application will be served from `/public` directory by get it by image/icon name.

| Endpoint | HTTP Method | Description | Full Command |
|----------|-------------|-------------|--------------| 
| /public/[image.jpg] | GET | Request image or icon | `GET /public/[image.jpg]` |



That's an elementary solution for this problem, and if images and icons getting increased we will make a saving pictures service to work efficiently.

### User but not crucial endpoints aka next phase
| Endpoint | HTTP Method | Description | Full Command |
|----------|-------------|-------------|--------------| 
| /change-email | POST | Request to change user email | `POST /change-email` | 
| /reset-email/:resetToken | PATCH | Reset user email by the sended token to current email | `PATCH /reset-email/:resetToken` | 
| /update-user | PATCH | Update user non-crucial data | `PATCH /update-user` | 
| /update-password | PATCH | Request to change user password while he still remember the current password | `PATCH /update-password` | 
| /delete-user | DELETE | Request to delete the user account | `DELETE /delete-user` | 


