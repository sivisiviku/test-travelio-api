const mysql = require("mysql");
const mysqlConfig = {
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
};

exports.execute = (statement) => {
  const connection = mysql.createConnection(mysqlConfig);
  connection.connect();
  const response = new Promise((resolve, reject) => {
    connection.query(statement, (err, rows) => {
      if (err) {
        resolve({
          status: "error",
          message: err,
          data: null,
        });
      } else {
        resolve({
          status: "success",
          message: null,
          data: rows,
        });
      }
    });
  });
  connection.end();
  return response;
};

exports.execute_bulk = (statement, values) => {
  const connection = mysql.createConnection(mysqlConfig);
  connection.connect();
  const response = new Promise((resolve, reject) => {
    connection.query(statement, [values], (err, rows) => {
      if (err) {
        resolve({
          status: "error",
          message: err,
          data: null,
        });
      } else {
        resolve({
          status: "success",
          message: null,
          data: rows,
        });
      }
    });
  });
  connection.end();
  return response;
};
