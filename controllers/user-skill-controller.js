const router = require("express").Router();
const User = require("../db").import("../models/user");
const AllSkill = require("../db").import("../models/allSkill");
const UserSkill = require("../db").import("../models/userSkill");
const validateSession = require("../middleware/validate-session");

/*******************
 *** Create Skill ****
 ********************/
router.post("/add", validateSession, (req, res) => {

  AllSkill.findOne({ where: { skillName: req.body.skill.skillName } })
  .then(skill => {
      if (skill === null) {
        res.status(404).send("No matching skill")
      } else {
    UserSkill.create({
        skillName: skill.skillName,
        activeLearning: req.body.skill.activeLearning,
        userId: req.user.id,
        allSkillId: skill.id

      })
        .then((myskill) => res.status(200).json(myskill))
        .catch((err) => res.status(500).json({ error: err }));
    }
  })
});

/******************************
 ***** Get Skills By UserID ****
 ******************************/
router.get("/", validateSession, (req, res) => {
    UserSkill.findAll({ where: { userId: req.user.id }})
      .then((skills) => res.status(200).json(skills))
      .catch((err) => res.status(500).json({ error: err }));
  });

  /******************************
 ***** Get Skills By skillId ****
 ******************************/
router.get("/:id", validateSession, (req, res) => {
    UserSkill.findOne({ where: { id: req.params.id, userId: req.user.id}})
      .then((skill) => res.status(200).json(skill))
      .catch((err) => res.status(500).json({ error: err }));
  });

/***************************
 **** Update User Skill *****
 ***************************/
router.put("/update/:id", validateSession, (req, res) => {
    const updateSkill = {
        activeLearning: req.body.skill.activeLearning,
    };
    const query = { where: { id: req.params.id, userId: req.user.id } };
  
    UserSkill.update(updateSkill, query)
      .then((skill) => res.status(200).json(skill))
      .catch((err) => res.status(500).json({ error: err }));
  });

/***************************
 **** Delete User Skill *****
 ***************************/
  router.delete("/delete/:id", validateSession, (req, res) => {
    UserSkill.destroy({
        where: { id: req.params.id, userId: req.user.id },
      })
        .then(() => res.status(200).send("Skill removed."))
        .catch((err) => res.status(500).json({ error: err }));
    });

module.exports = router;