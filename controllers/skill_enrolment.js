// Created by Zakir Uneeb
const router = require('../routes/skill_enrolment');
const utilities = require('../utilities/utility');
const db = require('../models');
const SkillEnrolment = db.skillEnrolment;
const User = db.user;
const Skill = db.skill;
const SkillStrength = db.skillStrength;

create = async (req, res) => {
  const { user_id, skill_id, skill_strength_id, expiry_date, notes } = req.body;

  if (!user_id || !skill_id || !skill_strength_id) {
    return utilities.formatErrorResponse(res, 400, "Missing fields required");
  }

  try {
    const skillEnrolment = await SkillEnrolment.create({
      user_id: parseInt(user_id, 10),
      skill_id: parseInt(skill_id, 10),
      skill_strength_id: parseInt(skill_strength_id, 10),
      expiry_date,
      notes
    });

      res.status(201).json(skillEnrolment);
  } catch (error) {
      utilities.formatErrorResponse(res, 400, error.message);
  }
}


getAll = async (req, res) => {    //Edited by Jack Lythgoe, Renders the Employee Report of Skill Enrolments.
  try {
    const skillEnrolments = await SkillEnrolment.findAll({
      include: [
        { model: User, as: 'user', attributes: ['first_name', 'last_name'] },
        { model: Skill, as: 'skill', attributes: ['skill_id', 'skill_name'] },
        { model: SkillStrength, as: 'skillStrength', attributes: ['skill_strength_id', 'skill_strength_name'] }
      ]
    });
    res.render('employee_report', { skillEnrolments: skillEnrolments });
  } catch (error) {
    console.log('Error retrieving skill enrollments:', error);
    res.status(500).send('Error retrieving skill enrollments');
  }
}




getById = async (req, res) => {
  const id = req.params.skill_enrolment_id;
  try {
    const skillEnrolment = await SkillEnrolment.findByPk(id, {
      include: [
        { model: User, as: 'user', attributes: ['user_id'] },
        { model: Skill, as: 'skill', attributes: ['skill_id'] },
        { model: SkillStrength, as: 'skillStrength', attributes: ['skill_strength_id'] }
      ]
    });

    if (skillEnrolment == null) {
      throw new Error("Unable to find skill enrolment with id " + id);
  }

    const allSkillEnrolments = {
        skill_enrolment_id: skillEnrolment.skill_enrolment_id,
        user_id: skillEnrolment.user.user_id,
        skill_id: skillEnrolment.skill.skill_id,
        skill_strength_id: skillEnrolment.skillStrength.skill_strength_id,
        expiry_date: skillEnrolment.expiry_date,
        notes: skillEnrolment.notes
    };

    res.status(200).json(allSkillEnrolments);
  } catch (error) {
    utilities.formatErrorResponse(res, 400, error.message);
  }
}

getByUserId = async (req, res) => {
  const userId = req.params.user_id;
  try {
    const skillEnrolments = await SkillEnrolment.findAll({
      where: { user_id: userId },
      include: [
        { model: User, as: 'user', attributes: ['user_id'] },
        { model: Skill, as: 'skill', attributes: ['skill_id'] },
        { model: SkillStrength, as: 'skillStrength', attributes: ['skill_strength_id'] }
      ]
    });

    if (!skillEnrolments.length) {
      throw new Error("No skill enrolments found for user id " + userId);
    }

    const allSkillEnrolments = skillEnrolments.map(skillEnrolment => ({
        skill_enrolment_id: skillEnrolment.skill_enrolment_id,
        user_id: skillEnrolment.user.user_id,
        skill_id: skillEnrolment.skill.skill_id,
        skill_strength_id: skillEnrolment.skillStrength.skill_strength_id,
        expiry_date: skillEnrolment.expiry_date,
        notes: skillEnrolment.notes
    }));

    res.status(200).json(allSkillEnrolments);
  } catch (error) {
    utilities.formatErrorResponse(res, 400, error.message);
  }
}

getByStrengthId = async (req, res) => {
  const skillStrengthId = req.params.skill_strength_id;
  try {
    const skillEnrolments = await SkillEnrolment.findAll({
      where: { skill_strength_id: skillStrengthId },
      include: [
        { model: User, as: 'user', attributes: ['user_id'] },
        { model: Skill, as: 'skill', attributes: ['skill_id'] },
        { model: SkillStrength, as: 'skillStrength', attributes: ['skill_strength_id'] }
      ]
    });

    if (!skillEnrolments.length) {
      throw new Error("No skill enrolments found for skill strength id " + skillStrengthId);
    }

    const allSkillEnrolments = skillEnrolments.map(skillEnrolment => ({
        skill_enrolment_id: skillEnrolment.skill_enrolment_id,
        user_id: skillEnrolment.user.user_id,
        skill_id: skillEnrolment.skill.skill_id,
        skill_strength_id: skillEnrolment.skillStrength.skill_strength_id,
        expiry_date: skillEnrolment.expiry_date,
        notes: skillEnrolment.notes
    }));

    res.status(200).json(allSkillEnrolments);
  } catch (error) {
    utilities.formatErrorResponse(res, 400, error.message);
  }
}

update = async (req, res) => {
  const id = parseInt(req.body.skill_enrolment_id, 10);

  if (isNaN(id)) {
    return utilities.formatErrorResponse(res, 400, "Invalid skill_enrolment_id");
  }

  const skillEnrolmentUpdate = {
    user_id: parseInt(req.body.user_id, 10),
    skill_id: parseInt(req.body.skill_id, 10),
    skill_strength_id: parseInt(req.body.skill_strength_id, 10),
    expiry_date: req.body.expiry_date,
    notes: req.body.notes
  };

  try {
    if (
      isNaN(skillEnrolmentUpdate.user_id) ||
      isNaN(skillEnrolmentUpdate.skill_id) || 
      isNaN(skillEnrolmentUpdate.skill_strength_id)
    ) {
      throw new Error("Missing required fields");
    }

    const [updated] = await SkillEnrolment.update(skillEnrolmentUpdate, {
      where: { skill_enrolment_id: id }
    });

    if (updated) {
      const updatedSkillEnrolment = await SkillEnrolment.findByPk(id);
      res.status(200).json(updatedSkillEnrolment);
    } else {
      throw new Error("Skill Enrolment not found");
    }
  } catch (error) {
      utilities.formatErrorResponse(res, 400, error.message);
  }
}

deleteEnrolment = async (req, res) => {
  const id = req.params.skill_enrolment_id;

  console.log(`Attempting to delete skill enrolment with id: ${id}`);

  try {
    if (!id) {
      throw new Error("Missing Skill Enrolment ID");
    }

    const deleted = await SkillEnrolment.destroy({
      where: { skill_enrolment_id: id }
    });

    if (deleted === 0) {
      throw new Error("Skill Enrolment not found");
    }

    res.status(200).json({ message: "Skill Enrolment deleted successfully" });
  } catch (error) {
    console.error(`Error deleting skill enrolment: ${error.message}`);
    utilities.formatErrorResponse(res, 400, error.message);
  }
}


module.exports = { create, getAll, getById, getByUserId, getByStrengthId, update, deleteEnrolment };