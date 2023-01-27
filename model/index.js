const query = require("../helper/query");

exports.create = async (table, columns, values) => {
  const result = await query.execute(
    `insert into ${table}(${columns}) values(${values})`
  );
  return result;
};

exports.create_bulk = async (table, columns, values) => {
  const result = await query.execute_bulk(
    `insert into ${table}(${columns}) VALUES ?`,
    values
  );
  return result;
};

exports.update = async (table, set, where) => {
  const result = await query.execute(
    `update ${table} set ${set} where ${where}`
  );
  return result;
};

exports.read = async (
  select,
  table,
  where,
  sort,
  sort_direction,
  limit,
  offset
) => {
  let queryString = `select ${select} from ${table}`;
  if (where !== null && where !== "") {
    queryString = queryString + ` where ${where}`;
  }
  if (
    sort !== null &&
    sort !== "" &&
    sort_direction !== null &&
    sort_direction !== ""
  ) {
    queryString = queryString + ` order by ${sort} ${sort_direction}`;
  }
  if (offset !== null && limit !== null) {
    queryString = queryString + ` limit ${offset}, ${limit}`;
  } else if (limit !== null && offset === null) {
    queryString = queryString + ` limit ${limit}`;
  }
  const result = await query.execute(queryString);
  return result;
};

exports.delete = async (table, where) => {
  const result = await query.execute(`delete from ${table} where ${where}`);
  return result;
};
