require('dotenv').config();
const axios = require('axios');
const AI_API = process.env.AI_API;

const addFileToAI = () => {
  /*
    doc_id = from user req book or document, we the search in one of them to extract
              the required file, this is a required to search for actually
      TODO: file_type book or document
  */

  const doc_id = '657ca6946a4b116e10326793';
  const url = 'https://bookipedia-files.onrender.com/fileinfo'; // FIXME: REPLACE IT WITH OUR URL

  axios
    .post(`${AI_API}/add_document/${doc_id}?url=${url}/${doc_id}`)
    .then(function (response) {
      console.log(response.status, '\n', response.data);
      console.log('response zaee elfoll');
    })
    .catch(function (error) {
      console.log(error.message);
      console.log('y3amee error');
    });
};

const questionToAI = () => {
  // Add a request interceptor to log the request sent
  // axios.interceptors.request.use(
  //   function (config) {
  //     // Log the request before it's sent
  //     console.log('Request:', config);
  //     return config;
  //   },
  //   function (error) {
  //     // Do something with request error
  //     return Promise.reject(error);
  //   },
  // );

  /*
    user_prompt = the user question from req.body.question
    chat = the last 5 questions form question model
    doc_ids = the user question asked on

    chat_id = we will add chat model, contains chat summary and chat_id
    chat_summary = from chat model 
  */

  // request query parameters
  const queryParams = {
    // chat_id: '657ca6946a4b116e10326793',
    enable_web_retrieval: true,
  };

  // request body
  const dataToSend = {
    user_prompt: 'what are Tesla major contributions?',
    chat_summary:
      'Nikola Tesla was a Serbian-American inventor, electrical engineer, and futurist. He is known for his contributions.',
    chat: 'User: Who is Nikola Tesla? Answer: Nikola Tesla was a famous inventor. User: What is his nationality? Answer: He was a Serbian-American.',
    doc_ids: ['657ca6946a4b116e10326793'],
  };

  const chat_id = '657ca6946a4b116e10326793';

  // Axios GET request with query parameters and request body
  axios
    .get(`${AI_API}/chat_response/${chat_id}`, {
      params: queryParams,
      data: dataToSend,
    })
    .then((response) => {
      // Handle success
      console.log('Response:', response.data);
    })
    .catch((error) => {
      // Handle error
      console.error('Error:', error.message);
    });

  console.log(`${AI_API}/chat_response`);
};

// addFileToAI();
questionToAI();

// module.exports = addFileToAI;
