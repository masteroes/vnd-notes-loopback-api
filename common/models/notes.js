'use strict';

module.exports = (Notes) => {
  Notes.createNote = async (userId, data) => {
    data.userId = userId;

    const response = await Notes.create(data);
    return response;
  };
};
