module.exports = (body) => {
  return {
    question: body.question,
    answer: body.answer,
    document: body.document,
    book: body.book,
    user: body.user,
  };
};
