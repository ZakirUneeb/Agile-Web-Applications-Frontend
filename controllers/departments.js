const router = require('../routes/departments');
const utilities = require('../utilities/utility');
const db = require('../models');
const Department = db.department;

getAll = async (req, res) =>{
    const department = await Department.findAll();
    res.status(200).json(department);
}

getByName = async (req, res) =>{
    const name =req.params.value;
    try{
        const department = await Department.findAll(
            {where: {department_name: name}});
        if(department.length==0){
            throw new Error("Unable to find Department with description " + name);
        }
        res.status(200).json(department);
    }
    catch(error){
        utilities.formatErrorResponse(res,400,error.message);
    }
}

getById = async (req, res) =>{
    const id =req.params.department_id;
    try{
        const department = await Department.findByPk(id);
        if(department==null || department.length==0){
            throw new Error("Unable to find Department with id " + id);
        }
        res.status(200).json(department);
    }
    catch(error){
        utilities.formatErrorResponse(res,400,error.message);
    }
}

create = async (req, res) =>{
    var department = {
        department_name: req.body.department_name,
    };

    try{
        if (department.department_name==null ||
            department.department_name.length <1){
        throw new Error("Essential fields missing");
        }

        department = await Department.create(department);

        res.status(201).json(department);
    }
    catch (error){
        utilities.formatErrorResponse(res,400,error.message);
    }
}

deleting = async (req, res) => {
    const id = req.body.department_id;
    try {
        const deleted = await Department.destroy({
            where: { department_id: id }
        });
        if (deleted === 0) {
            throw new Error("Department not found or already deleted.");
        }
        res.status(200).send("Department deleted successfully.");
    } catch (error) {
        utilities.formatErrorResponse(res, 404, error.message);
    }
};


update = async (req, res) =>{

    const id =req.body.department_id;

    const department = {
        department_name: req.body.department_name
    };

    try{
        if (id==null ||
            department.department_name==null){
            throw new Error("Missing essential fields");
        }
    await Department.update(department,
                {where: { department_id: id }}
    );
    res.status(200).json(department);
    }
    
    catch (error){
        utilities.formatErrorResponse(res,400,error.message);
    }
}


module.exports = {getAll, getByName, getById, create, deleting, update};