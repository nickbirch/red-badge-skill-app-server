const router = require("express").Router();
const AllSkill = require("../db").import("../models/allSkill")
const Resource = require("../db").import("../models/resource");
const ResourceSkill = require("../db").import("../models/resourceSkill");
const validateSession = require("../middleware/validate-session");

/************************
 *** Create Resource ****
 ***********************/
router.post("/add", validateSession, (req, res) => {

    AllSkill.findOne({ where: { skillName: req.body.resource.skillName } })
    .then(skill => {
        if (skill === null) {
          res.status(404).send("No matching skill")
        } else {
      Resource.create({
          title: req.body.resource.title,
          description: req.body.resource.description,
          type: req.body.resource.type,
          link: req.body.resource.link,
          allSkillId: skill.id
  
        })
          .then((resource) => res.status(200).json(resource))
          .catch((err) => res.status(500).json({ error: err }));
      }
    })
  });

  /************************
 *** Create Resource ****
 ***********************/
router.post("/test", validateSession, (req, res) => {

    // const testResource = await Resource.create({
    //     title: req.body.resource.title,
    //     description: req.body.resource.description,
    //     type: req.body.resource.type,
    //     link: req.body.resource.link
    //   })

    //   const skill = await Resource.findByPk(req.body.resource.id)

    //   await testResource.add(skill)

    Resource.create({
        title: req.body.resource.title,
        description: req.body.resource.description,
        type: req.body.resource.type,
        link: req.body.resource.link
      })
      .then(response => {
          console.log(req.body)
        ResourceSkill.create({
            resourceId: response.id,
            allSkillId: req.body.resource.id
          })
      }
         
      )
      .then((response) => res.status(200).json(response))
      .catch((err) => res.status(500).json({ error: err }));

  });

/******************************
 ***** Get Resources by skillId ****
 ******************************/
router.get("/:id", validateSession, (req, res) => {
    Resource.findAll({ where: { allSkillId: req.params.id }})
      .then((resources) => res.status(200).json(resources))
      .catch((err) => res.status(500).json({ error: err }));
  });

  /***************************
 **** Update Resource *****
 ***************************/
router.put("/update/:id", validateSession, (req, res) => {
    const updateResource = {
        title: req.body.resource.title,
        description: req.body.resource.description,
        type: req.body.resource.type,
        link: req.body.resource.link,
        allSkillId: req.body.resource.allSkillId
    };
    const query = { where: { id: req.params.id } };
  
    Resource.update(updateResource, query)
      .then((resource) => res.status(200).json(resource))
      .catch((err) => res.status(500).json({ error: err }));
  });

  /**************************
 **** Delete Resource *****
 ***************************/
router.delete("/delete/:id", validateSession, (req, res) => {
    Resource.destroy({
        where: { id: req.params.id},
      })
        .then(() => res.status(200).send("Resource removed."))
        .catch((err) => res.status(500).json({ error: err }));
    });

module.exports = router;