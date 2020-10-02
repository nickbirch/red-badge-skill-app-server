const router = require("express").Router();
const AllSkill = require("../db").import("../models/allSkill");
const UserSkill = require("../db").import("../models/userSkill");
const Resource = require("../db").import("../models/resource");
const validateSession = require("../middleware/validate-session");

/*******************
 *** Create Skill ****
 ********************/
router.post("/add", validateSession, (req, res) => {

  AllSkill.create({
    skillName: req.body.skill.skillName
  })
    .then((skill) => res.status(200).json(skill))
    .catch((err) => res.status(500).json({ error: err }));
});

/******************************
 ***** Get All Skills ****
 ******************************/
router.get("/", validateSession, (req, res) => {
    AllSkill.findAll({include: [Resource]})
      .then((skills) => res.status(200).json(skills))
      .catch((err) => res.status(500).json({ error: err }));
  });

  /******************************
 ***** Get Single Skill and Resources ****
 ******************************/
router.get("/:id", validateSession, (req, res) => {
    AllSkill.findOne({where: {id: req.params.id},
        include: [{
            model: Resource,
        }]
    })
      .then((skills) => res.status(200).json(skills))
      .catch((err) => res.status(500).json({ error: err }));
  });

/***************************
 **** Change Skill Name *****
 ***************************/
router.put("/update/:id", validateSession, (req, res) => {
    const updateSkill = {
        skillName: req.body.skill.skillName,
    };
    const queryAllSkills = { where: { id: req.params.id} };
    const queryUserSkills = { where: { allSkillId: req.params.id}}
  
    AllSkill.update(updateSkill, queryAllSkills)
      .then( UserSkill.update(updateSkill, queryUserSkills) )
      .then((skill) => res.status(200).json(skill))
      .catch((err) => res.status(500).json({ error: err }));
  });

/***************************
 ****** Delete Skill *******
 ***************************/
  router.delete("/delete/:id", validateSession, (req, res) => {
    AllSkill.destroy({
        where: { id: req.params.id },
      })
        .then(() => res.status(200).send("Skill deleted."))
        .catch((err) => res.status(500).json({ error: err }));
    });



module.exports = router;
