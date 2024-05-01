### Cases were we as a backend server integrate with ai-api

- user ask question in chat
- user need text-to-speech in a text
- user need text summarization to chapters or pages

but what is actually done between backend and AI ?!

#### Firstly AI needs to:

- convert each file to embeddings and save a unique id for each file that we use to interact with each other.
- update a chat summary with each question in a chat to use it to deal with question that refers the pre asked questions.
- apply ocr to some documents that user needs.
- delete the file impeddings if deleted from database

so, according to ai and user needs, we need to structure a systems that follow there needs.

so, what did we do?\
let's take the cycles

File Upload:\
➥ user: upload a document file, or admin: upload an official book\
➥ backend: save the uplaoded file, marked that aiApplied: false, extract the file_id, if the file is document the lib_doc: false, if the file is book lib_doc: true to mark if the file may need ocr or not to ai, then send the request with file_id, lib_doc, file_link to ai\
➥ ai: they take the file information, get the pdf file, scan if needs ocr? post the new ocr file to backend to update the file, in the backend response is the new file_id, and if not need ocr or after apply ocr, the file then go to the next phase to generate the word embeddings to the file, and after they complete there work. finally they post an acknowledge to the backend that the file with that id, ai applied to it.
in the backend we take the file_id, and from file_type table we search what is this file_id actually is a book or document, and then in the file type entity we marked aiApplied: true, so in flutter they open the option to apply ai operations in that file

Question:\
➥ user: ask question in chat from the book/document\
➥ backend: take that question and id search with file type to the actual file_id with question asked in, and search in chat model where the file_id is what user asked for, and extract the chat_summary, then we send a request to ai with: question, file_id, chat_summary\
➥ ai: they genereate a response to the question and sent it as a response in stream, and then in background task they update the chat summary and posted it to backend to be updated.

Text-To-Speech:\
➥ user: user send a text\
➥ backend: sent the text to ai\
➥ ai: convert to speech, in row-audio format, stream it to backend, and backend the stream it back to flutter

Delete File:\
➥ user: when a user delete a document or admin delete a book
➥ backend: extract the acual file_id and sent it to ai to delete the file embeddings for that id\
➥ ai: delete the embeddings.

todo:

- [ ] text summarization to chapters and pages