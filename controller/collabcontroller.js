const { Sequelize } = require("../models");
const { Op } = require("sequelize");
var db = require("../models/index");
const { name } = require("ejs");
const Collabs = db.collabs;
const Users = db.users;
const Repository = db.repositorys;
let pagecollabs = async (req, res) => {
  var id = req.query.id;
  // const coid = await Collabs.findAll({
  //   where: { repositoryId: id },
  // });
  const coid = await Users.findAll({
    attributes: ["username", "email"],
    include: [
      {
        model: Collabs,
        where: {
          repositoryId: id,
        },
        required: true,
        raw: true,
      },
    ],
  });
  console.log("coid???????????????????", coid);

  res.render("collab", { id, coid });
};
let collab = async (req, res) => {
  console.log("<<<<<<<<<<<<colaab");
  try {
    const { name } = req.query;
    const users = await Users.findAll({
      where: {
        username: {
          [Op.like]: `%${name}%`,
        },
      },
    });
    console.log("user<<<", users);
    res.status(200).json({
      repos: users,
    });
    // res.json(users);
  } catch (err) {
    console.log(
      "<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<"
    );
    console.log(err.message);
    res.status(500).json({ error: "server error" });
  }
};
let createcollabs = async (req, res) => {
  var userId = req.query.userId;
  var repositoryId = req.query.repositoryId;
  console.log("req.query.userId.....", req.query.userId);
  console.log("req.query.repositoryId.............", req.query.repositoryId);
  const co = await Collabs.create({
    userId: userId,
    repositoryId: repositoryId,
  });
  console.log("co>>>>>>", co);
  res.redirect(`/pagecollabs?id=${repositoryId}`);
};
let deletecollabs = async (req, res) => {
  try {
    console.log("<<<<<<<<<<<repodelete call");
    const deletecols = await Collabs.destroy({
      where: { id: req.query.id },
    });
    var id = req.query.repositoryId;
    res.redirect(`/pagecollabs?id=${id}`);
    return deletecols;
  } catch (err) {
    throw err;
  }
};
module.exports = { pagecollabs, collab, createcollabs, deletecollabs };
