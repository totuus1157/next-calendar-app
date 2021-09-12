// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
// import apidata from "../data";
import mysql from "mysql2";

const connection = mysql.createConnection({
  host: "localhost",
  user: "node000user",
  password: "nodepass",
  database: "node000db",
  port: 4306,
});

connection.connect((error) => {
  if (error) throw error;
  console.log("Connected");
});

export default function handler(
  _req: NextApiRequest,
  res: NextApiResponse
): void {
  connection.query("SELECT * FROM `mydata`", (error, results, fields): void => {
    console.log(error);
    console.log(results);
    console.log(fields);
    res.status(200).json(results != undefined ? results : error);
  });

  // res.status(200).json(apidata);
}
