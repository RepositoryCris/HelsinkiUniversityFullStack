const getInfoMessage = (array) => {
  return `
  <p>Phone has info for ${array.length} people</p>  
  <p>${new Date()}</p>
`;
};

module.exports = {
  getInfoMessage,
};
