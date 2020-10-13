const router = require("express").Router();
const Tag = require("../db").import("../models/tag");
const Resource = require("../db").import("../models/resource");
const ResourceTag = require("../db").import("../models/resourceTag");
const validateSession = require("../middleware/validate-session");

/************************
 *** Create Resource ****
 ***********************/
router.post("/add", validateSession, (req, res) => {
  Resource.create({
    title: req.body.resource.title,
    description: req.body.resource.description,
    type: req.body.resource.type,
    link: req.body.resource.link,
  })
    .then((resource) => {
      // console.log("req.body", req.body);
      // console.log("resource", resource);
      ResourceTag.create({ // adds to join table for reference
        resourceId: resource.id,
        tagId: req.body.skill.id,
      });
    })
    .then((response) =>
      res.status(200).json({
          message: "resource and resourcetag created!",
          resource: response,
        })
    )
    .catch((err) => res.status(500).json({ error: err }));
});

/***************************
 *** Add Tag to Resource ****
 **************************/
router.post("/addtag/:id", validateSession, (req, res) => {
  Tag.findOne({ where: { skillName: req.body.skill.skillName }
  })
  .then((tag) => {
    ResourceTag.create({
      resourceId: req.params.id,
      tagId: tag.id,
    });
  })
    .then((response) =>
      res.status(200).json({
          message: "new resourcetag created!",
          resource: response,
        })
    )
    .catch((err) => res.status(500).json({ error: err }));
});

/***************************
 *** Delete Tag from Resource ****
 **************************/
router.delete("/deletetag/:id", validateSession, (req, res) => {
  Tag.findOne({ where: { skillName: req.body.skill.skillName }
  })
  .then((tag) => {
    console.log(tag.id)
    console.log(req.params.id)
    ResourceTag.destroy({
    //where: { [Op.and]: [{ resourceId: req.params.id }, { tagId: tag.id }]},
    where: { resourceId: req.params.id, tagId: tag.id  }
    });
  })
    .then((response) =>
      res.status(200).json({
          message: "resourcetag deleted",
          resource: response,
        })
    )
    .catch((err) => res.status(500).json({ error: err }));
});

/******************************
 ***** Get tags for a Resource ****
 ******************************/
router.get("/:id", validateSession, (req, res) => {
  Resource.findOne({ where: { id: req.params.id },
    include: [{
        model: Tag,
        attributes: ["skillName"]
    }] })
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
    link: req.body.resource.link
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
    where: { id: req.params.id },
  })
    .then(() => res.status(200).send("Resource removed."))
    .catch((err) => res.status(500).json({ error: err }));
});

module.exports = router;