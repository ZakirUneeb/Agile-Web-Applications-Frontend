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
        user_id,
        skill_id,
        skill_strength_id,
        expiry_date,
        notes
      });

      res.status(201).json(skillEnrolment);
  } catch (error) {
      utilities.formatErrorResponse(res, 400, error.message);
  }
}

getAll = async (req, res) => {
  try {
    const skillEnrolments = await SkillEnrolment.findAll({
      include: [
        { model: User, as: 'user', attributes: ['user_id'] },
        { model: Skill, as: 'skill', attributes: ['skill_id'] },
        { model: SkillStrength, as: 'skillStrength', attributes: ['skill_strength_id'] }
      ]
    });

    const allSkillEnrolments = skillEnrolments.map(skillEnrolment => ({
        skill_enrolment_id: skillEnrolment.skill_enrolment_id,
        user_id: user.user_id,
        skill_id: skill.skill_id,
        skill_strength_id: skillStrength.skill_strength_id,
        expiry_date: skillEnrolment.expiry_date,
        notes: skillEnrolment.notes
    }));

    res.status(200).json(allSkillEnrolments);
  } catch (error) {
    utilities.formatErrorResponse(res, 400, error.message);
  }
}

getById = async (req, res) => {
  const id = req.params.skill_enrolment_id;
  try {
    const skillEnrolments = await SkillEnrolment.findByPk(id, {
      include: [
        { model: User, as: 'user', attributes: ['user_id'] },
        { model: Skill, as: 'skill', attributes: ['skill_id'] },
        { model: SkillStrength, as: 'skillStrength', attributes: ['skill_strength_id'] }
      ]
    });

    const allSkillEnrolments = skillEnrolments.map(skillEnrolment => ({
        skill_enrolment_id: skillEnrolment.skill_enrolment_id,
        user_id: user.user_id,
        skill_id: skill.skill_id,
        skill_strength_id: skillStrength.skill_strength_id,
        expiry_date: skillEnrolment.expiry_date,
        notes: skillEnrolment.notes
    }));

    res.status(200).json(allSkillEnrolments);
  } catch (error) {
    utilities.formatErrorResponse(res, 400, error.message);
  }
}

getByUserId = async (req, res) => {
  const id = req.params.user_id;
  try {
    const skillEnrolments = await SkillEnrolment.findByPk(id, {
      include: [
        { model: User, as: 'user', attributes: ['user_id'] },
        { model: Skill, as: 'skill', attributes: ['skill_id'] },
        { model: SkillStrength, as: 'skillStrength', attributes: ['skill_strength_id'] }
      ]
    });

    const allSkillEnrolments = skillEnrolments.map(skillEnrolment => ({
        skill_enrolment_id: skillEnrolment.skill_enrolment_id,
        user_id: user.user_id,
        skill_id: skill.skill_id,
        skill_strength_id: skillStrength.skill_strength_id,
        expiry_date: skillEnrolment.expiry_date,
        notes: skillEnrolment.notes
    }));

    res.status(200).json(allSkillEnrolments);
  } catch (error) {
    utilities.formatErrorResponse(res, 400, error.message);
  }
}

getByStrengthId = async (req, res) => {
  const id = req.params.skill_strength_id;
  try {
    const skillEnrolments = await SkillEnrolment.findByPk(id, {
      include: [
        { model: User, as: 'user', attributes: ['user_id'] },
        { model: Skill, as: 'skill', attributes: ['skill_id'] },
        { model: SkillStrength, as: 'skillStrength', attributes: ['skill_strength_id'] }
      ]
    });

    const allSkillEnrolments = skillEnrolments.map(skillEnrolment => ({
        skill_enrolment_id: skillEnrolment.skill_enrolment_id,
        user_id: user.user_id,
        skill_id: skill.skill_id,
        skill_strength_id: skillStrength.skill_strength_id,
        expiry_date: skillEnrolment.expiry_date,
        notes: skillEnrolment.notes
    }));

    res.status(200).json(allSkillEnrolments);
  } catch (error) {
    utilities.formatErrorResponse(res, 400, error.message);
  }
}

update = async (req, res) => {
  const id = req.body.skill_enrolment_id;

  const skillEnrolmentUpdate = {
      user_id: user.user_id,
      skill_id: skill.skill_id,
      skill_strength_id: skillStrength.skill_strength_id,
      expiry_date: skillEnrolment.expiry_date,
      notes: skillEnrolment.notes
  };

  try {
    if (!user_id || !skill_id || !skill_strength_id) {
      throw new Error("Missing required fields");
    }

    await SkillEnrolment.update(skillEnrolmentUpdate, {
      where: { skill_enrolment_id: id }
    });

    res.status(200).json(userUpdates);
  } catch (error) {
      utilities.formatErrorResponse(res, 400, error.message);
  }
}

deleteEnrolment = async (req, res) => {
  const id = req.body.skill_enrolment_id;

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

    res.status(200).send("Skill Enrolment deleted successfully");
  } catch (error) {
      utilities.formatErrorResponse(res, 400, error.message);
  }
}

module.exports = { create, getAll, getById, getByUserId, getByStrengthId, update, deleteEnrolment };