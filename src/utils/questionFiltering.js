module.exports = (body) => {
  return {
    question: body.question,
    document: body.document,
    book: body.book,
    user: body.user,
  };
};
