const router = require("express").Router();
const Tag = require("../db").import("../models/tag");
const UserSkill = require("../db").import("../models/userSkill");
const Resource = require("../db").import("../models/resource");
const validateSession = require("../middleware/validate-session");
const fetch = require("node-fetch");


/*******************
 *** Skill Upload ****
 ********************/
router.post("/upload", (req, res) => {

let baseURL = `https://api.stackexchange.com/2.2/tags?`;
let skills = [];
let pageNumber = 1;
let has_more = true;

  const skillUpload = (skillsArray) => {
    for (let i = 0; i < skillsArray.length; i++) {
      Tag.findOne({where: {skillName: skillsArray[i]}})
      .then(skillExist => {
        if (!skillExist) {
          Tag.create({
              skillName: skillsArray[i]
            })
           }
      })
      }
};

  const getSkills = () => {
    let url = `${baseURL}page=${pageNumber}&pagesize=100&order=desc&sort=popular&site=stackoverflow`
    // console.log(pageNumber)
    fetch(url)
    .then((response) => response.json())
    .then((results) => {
        for (let i = 0; i < results.items.length; i++) {
           skills.push(results.items[i].name)
        }
        if (results.has_more === true && pageNumber <= 100) {
            pageNumber++
            getSkills();
            //console.log(skills);
        } else if (results.has_more === true && pageNumber === 101) {
          // console.log(skills);
          skillUpload(skills);
        } else if (results.has_more === false) {
          has_more = false;
          skillUpload(skills);
        }
      })
    .then((response) => res.status(200).json(response))
    .catch((err) => res.status(500).json({ error: err }));
}

getSkills();
});


/*******************
 *** Create Tag ****
 ********************/
router.post("/add", validateSession, (req, res) => {

  Tag.create({
    skillName: req.body.skill.skillName
  })
    .then((skill) => res.status(200).json(skill))
    .catch((err) => res.status(500).json({ error: err }));
});

/******************************
 ***** Get All Tags ****
 ******************************/
router.get("/", validateSession, (req, res) => {
    Tag.findAll({attributes: {exclude: ['createdAt', 'updatedAt', 'id']}}
      )
      .then((tags) => res.status(200).json(tags))
      .catch((err) => res.status(500).json({ error: err }));
  });

  /******************************
 ***** Get Single Tag and Resources ****
 ******************************/
router.get("/:id", validateSession, (req, res) => {
    Tag.findOne({where: {id: req.params.id},
      order: [[ { model: Resource }, "createdAt", 'DESC']],
        include: [{
            model: Resource
        }]
    })
      .then((tags) => res.status(200).json(tags))
      .catch((err) => res.status(500).json({ error: err }));
  });

/***************************
 **** Change Tag Name *****
 ***************************/
router.put("/update/:id", validateSession, (req, res) => {
    const updateSkill = {
        skillName: req.body.skill.skillName,
    };
    const queryTag = { where: { id: req.params.id} };
    const queryUserSkills = { where: { tagId: req.params.id}}
  
    Tag.update(updateSkill, queryTag)
      .then( UserSkill.update(updateSkill, queryUserSkills) )
      .then((skill) => res.status(200).json(skill))
      .catch((err) => res.status(500).json({ error: err }));
  });

/***************************
 ****** Delete Tag *******
 ***************************/
  router.delete("/delete/:id", validateSession, (req, res) => {
    Tag.destroy({
        where: { id: req.params.id },
      })
        .then(() => res.status(200).send("Skill tag deleted."))
        .catch((err) => res.status(500).json({ error: err }));
    });



module.exports = router;
