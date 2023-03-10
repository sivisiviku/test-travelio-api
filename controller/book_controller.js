const model = require("../model/index.js");
const axios = require("axios");

exports.test = async (req, res) => {
  return res.send("api is working!");
};

exports.read = async (req, res) => {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/books/v1/volumes?q=${req.body.keyword}:keyes&key=${process.env.API_KEY}`
    );
    const finalResponse = await Promise.all(
      response.data.items.map(async (book) => {
        const favorites = await model.read(
          `count(id) as count`,
          `favorites`,
          `id="${book.id}"`,
          null,
          null,
          1,
          null
        );
        return {
          id: book.id,
          title: book.volumeInfo.title,
          thumbnail: book.volumeInfo.imageLinks.thumbnail,
          authors: book.volumeInfo.authors,
          averageRating:
            book.volumeInfo.averageRating !== undefined
              ? book.volumeInfo.averageRating
              : null,
          isFavorite: favorites.data[0].count > 0 ? true : false,
        };
      })
    );
    return res.send({
      status: "success",
      message: null,
      data: finalResponse,
    });
  } catch (err) {
    return res.send({
      status: "error",
      message: err.message,
      data: null,
    });
  }
};

exports.readFavorite = async (req, res) => {
  try {
    const offset = (req.body.page - 1) * req.body.limit;
    const totalData = await model.read(
      `count(id) as total_data`,
      `favorites`,
      null,
      null,
      null,
      null,
      null
    );
    const totalPages = Math.ceil(totalData.data[0].total_data / req.body.limit);
    const data = await model.read(
      `*`,
      `favorites`,
      null,
      null,
      null,
      req.body.limit,
      offset
    );
    for (i = 0; i < data.data.length; i++) {
      data.data[i].isFavorite = true;
    }
    return res.send({
      status: "success",
      message: {
        total_pages: totalPages,
        total_data: totalData.data[0].total_data,
      },
      data: data.data,
    });
  } catch (err) {
    return res.send({
      status: "error",
      message: err.message,
      data: null,
    });
  }
};

exports.create = async (req, res) => {
  try {
    return res.send(
      await model.create(
        `favorites`,
        `id, title, thumbnail, authors, average_rating`,
        `"${req.body.id}", "${req.body.title}", "${req.body.thumbnail}", "${
          req.body.authors
        }", '${JSON.stringify(req.body.averageRating)}'`
      )
    );
  } catch (err) {
    return res.send({
      status: "error",
      message: err.message,
      data: null,
    });
  }
};

exports.delete = async (req, res) => {
  try {
    return res.send(await model.delete(`favorites`, `id="${req.body.id}"`));
  } catch (err) {
    return res.send({
      status: "error",
      message: err.message,
      data: null,
    });
  }
};
