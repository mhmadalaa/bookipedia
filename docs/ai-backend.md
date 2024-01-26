# Endpoints

### REQuests from Backend-API to AI-API

#### Documents (OCR)

| Endpoint      | HTTP Method | Description                                                                                                                                                                 | Full Command        |
| ------------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| /document/ocr | GET         | Request to apply ocr for the sended document throw req body for the current user, and it will response with the better file after applying ocr instead of the user uploaded | `GET /document/ocr` |

#### Text-To-Speech

| Endpoint  | HTTP Method | Description                                                                                  | Full Command    |
| --------- | ----------- | -------------------------------------------------------------------------------------------- | --------------- |
| /text/tot | GET         | Request to apply text to speech to the sended text and stream thre returned audio to flutter | `GET /text/tot` |

### REQuests from AI-API to Backend-API

| Endpoint                              | HTTP Method | Description                                                 | Full Command                                |
| ------------------------------------- | ----------- | ----------------------------------------------------------- | ------------------------------------------- |
| /books/summary/[book_id]/[chapter_no] | POST        | Request to store specific chapter summary for specific book | `POST /book/summary/[book_id]/[chapter_no]` |
