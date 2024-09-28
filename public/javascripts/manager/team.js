// Johnathan

let selectedUserId = null;
let selectedUserName = '';

document.addEventListener('DOMContentLoaded', function() {
    const teamMembersList = document.getElementById('team-members');
    const addUserBtn = document.getElementById("addUserBtn");
    const editUserBtn = document.getElementById("editUserBtn");
    const deleteUserBtn = document.getElementById("deleteUserBtn");
    const addSkillBtn = document.getElementById("addSkillBtn");
    const editSkillBtn = document.getElementById("editSkillBtn");
    const removeSkillBtn = document.getElementById("removeSkillBtn");
    const addUserModal = document.getElementById("addUserModal");
    const editUserModal = document.getElementById("editUserModal");
    const addSkillModal = document.getElementById("addSkillModal");
    const editSkillModal = document.getElementById("editSkillModal");
    const removeSkillModal = document.getElementById("removeSkillModal");

    const addUserForm = document.getElementById("addUserForm");
    const editUserForm = document.getElementById('editUserForm');
    const addSkillForm = document.getElementById("addSkillForm");
    const editSkillForm = document.getElementById("editSkillForm");
    const removeSkillForm = document.getElementById("removeSkillForm");

    const addUserCloseBtn = addUserModal.querySelector(".close");
    const editUserCloseBtn = editUserModal.querySelector('.close');
    const addSkillCloseBtn = addSkillModal.querySelector(".close");
    const editSkillCloseBtn = editSkillModal.querySelector(".close");
    const removeSkillCloseBtn = removeSkillModal.querySelector(".close");

    teamMembersList.addEventListener('click', async (e) => {
        if (e.target.tagName === 'LI') {
            handleTeamMemberSelection(e.target);
            addSkillBtn.style.display = "inline-block";
            editSkillBtn.style.display = "inline-block";
            removeSkillBtn.style.display = "inline-block";
            editUserBtn.style.display = "inline-block";
            deleteUserBtn.style.display = "inline-block";
        }
    });

    addUserBtn.onclick = () => showAddUserModal();
    editUserBtn.onclick = () => selectedUserId ? showEditUserModal() : alert("Please select a team member first.");
    deleteUserBtn.onclick = () => selectedUserId && confirm("Are you sure you want to delete this user?") ? deleteUser() : null;
    addSkillBtn.onclick = () => selectedUserId ? showAddSkillModal(selectedUserId, selectedUserName) : alert("Please select a team member first.");
    editSkillBtn.onclick = () => selectedUserId ? showEditSkillModal(selectedUserId, selectedUserName) : alert("Please select a team member first.");
    removeSkillBtn.onclick = () => selectedUserId ? showRemoveSkillModal(selectedUserId, selectedUserName) : alert("Please select a team member first.");

    addUserCloseBtn.onclick = () => addUserModal.style.display = "none";
    editUserCloseBtn.onclick = () => editUserModal.style.display = 'none';
    addSkillCloseBtn.onclick = () => addSkillModal.style.display = "none";
    editSkillCloseBtn.onclick = () => editSkillModal.style.display = "none";
    removeSkillCloseBtn.onclick = () => removeSkillModal.style.display = "none";

    window.onclick = (event) => {
        if (event.target === addUserModal) addUserModal.style.display = "none";
        if (event.target === editUserModal) editUserModal.style.display = "none";
        if (event.target === addSkillModal) addSkillModal.style.display = "none";
        if (event.target === editSkillModal) editSkillModal.style.display = "none";
        if (event.target === removeSkillModal) removeSkillModal.style.display = "none";
    };

    addUserForm.addEventListener("submit", handleAddUserForm);
    editUserForm.addEventListener("submit", handleEditUserForm);
    addSkillForm.addEventListener("submit", handleAddSkillForm);
    editSkillForm.addEventListener("submit", handleEditSkillForm);
    removeSkillForm.addEventListener("submit", handleRemoveSkillForm);

    setManagerDepartment();
});

async function handleTeamMemberSelection(memberElement) {
    document.querySelectorAll('#team-members li').forEach(li => li.classList.remove('active', 'selected'));
    memberElement.classList.add('active', 'selected');
    selectedUserId = memberElement.dataset.id;
    selectedUserName = memberElement.textContent.trim().split(' - ')[0];

    try {
        const response = await fetch(`/manager/team/member/${selectedUserId}`, { headers: { 'Content-Type': 'application/json' } });
        const skills = await response.json();
        displayMemberSkills(skills);
    } catch (error) {
        document.getElementById('skills-list').innerHTML = '<p>Error loading skills. Please try again.</p>';
    }
}

function displayMemberSkills(skills) {
    const skillsList = document.getElementById('skills-list');
    skillsList.innerHTML = skills.length === 0 
        ? '<p>No skills recorded for this team member.</p>'
        : skills.map(skill => `
            <div class="skill-item">
                <div class="skill-header">
                    <span class="skill-name">${skill.skill.skill_name}</span>
                    <span class="skill-expiry">${skill.expiry_date ? 'Expires: ' + new Date(skill.expiry_date).toLocaleDateString() : 'No expiry date'}</span>
                </div>
                <div class="skill-strength">${skill.skillStrength.skill_strength_name}</div>
                ${skill.notes ? `<div class="skill-notes">Notes: ${skill.notes}</div>` : ''}
            </div>`).join('');
}

function setManagerDepartment() {
    const userDataDiv = document.getElementById('user-data');
    const departmentIdInput = document.getElementById('department_id');
    const departmentNameInput = document.getElementById('department_name');
    
    if (userDataDiv && departmentIdInput && departmentNameInput) {
        const departmentId = userDataDiv.getAttribute('data-department-id');
        const departmentName = userDataDiv.getAttribute('data-department-name');
        
        departmentIdInput.value = departmentId;
        departmentNameInput.value = decodeHTMLEntities(departmentName);
    }
}

function decodeHTMLEntities(text) {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = text;
    return textArea.value;
}

async function fetchAndPopulateDropdown(url, selectElement) {
    try {
        const response = await fetch(url, { headers: { 'Content-Type': 'application/json' } });
        const data = await response.json();
        selectElement.innerHTML = `<option value="">Select a ${selectElement.id.replace('_id', '').replace('edit_', '')}</option>`;
        data.forEach(item => {
            const option = document.createElement('option');
            const idField = selectElement.id.includes('skill_strength') ? 'skill_strength_id' : 
                            (selectElement.id.includes('job_role_id') ? 'job_role_id' : 
                            (selectElement.id.includes('skill_id') ? 'skill_id' : 
                            (selectElement.id === 'remove_skill_id' ? 'skill_enrolment_id' : 'system_role_id')));
            const nameField = selectElement.id.includes('skill_strength') ? 'skill_strength_name' : 
                              (selectElement.id.includes('job_role_id') ? 'job_role_name' : 
                              (selectElement.id.includes('skill_id') ? 'skill_name' : 
                              (selectElement.id === 'remove_skill_id' ? 'skill.skill_name' : 'system_role_name')));
            option.value = item[idField];
            option.textContent = selectElement.id === 'remove_skill_id' ? 
                                 `${item.skill.skill_name} - ${item.skillStrength.skill_strength_name}` : 
                                 item[nameField];
            selectElement.appendChild(option);
        });
    } catch {
        alert('Failed to load options. Please try again.');
    }
}

function populateDropdowns() {
    fetchAndPopulateDropdown('/api/job_roles', document.getElementById('job_role_id'));
    fetchAndPopulateDropdown('/api/system_roles', document.getElementById('system_role_id'));
}

async function handleAddUserForm(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const userData = Object.fromEntries(formData.entries());
    ['department_id', 'job_role_id', 'system_role_id'].forEach(field => userData[field] = parseInt(userData[field], 10));

    try {
        const response = await fetch('/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });

        if (response.ok) {
            alert('User added successfully!');
            closeModal();
            refreshTeamList();
        } else {
            const errorData = await response.json();
            alert(`Failed to add user: ${errorData.error?.message || errorData.message || 'Unknown error'}`);
        }
    } catch {
        alert('An error occurred. Please try again.');
    }
}

async function handleEditUserForm(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const userData = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('/api/users', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });

        if (response.ok) {
            alert('User updated successfully!');
            closeModal();
            refreshTeamList();
        } else {
            alert('Failed to update user.');
        }
    } catch {
        alert('An error occurred. Please try again.');
    }
}

function closeModal() {
    ['addUserModal', 'editUserModal', 'addSkillModal', 'editSkillModal', 'removeSkillModal'].forEach(id => {
        document.getElementById(id).style.display = "none";
        document.getElementById(`${id.replace('Modal', 'Form')}`).reset();
    });
}

async function refreshTeamList() {
    location.reload();
}

async function showAddUserModal() {
    populateDropdowns();
    document.getElementById('addUserModal').style.display = "block";
}

async function showEditUserModal() {
    try {
        const response = await fetch(`/api/users/${selectedUserId}`, { headers: { 'Content-Type': 'application/json' } });
        const userData = await response.json();
        document.getElementById('edit_user_id').value = userData.user_id;
        document.getElementById('edit_first_name').value = userData.first_name;
        document.getElementById('edit_last_name').value = userData.last_name;
        document.getElementById('edit_email').value = userData.email;
        document.getElementById('edit_department_id').value = userData.department_id;
        document.getElementById('edit_department_name').value = userData.department_name;
        populateEditUserDropdowns(userData);
        document.getElementById('editUserModal').style.display = "block";
    } catch {
        alert('Failed to fetch user data.');
    }
}

async function populateEditUserDropdowns(userData) {
    await fetchAndPopulateDropdown('/api/job_roles', document.getElementById('edit_job_role_id'));
    await fetchAndPopulateDropdown('/api/system_roles', document.getElementById('edit_system_role_id'));
    document.getElementById('edit_job_role_id').value = userData.job_role_id;
    document.getElementById('edit_system_role_id').value = userData.system_role_id;
}

async function deleteUser() {
    try {
        const response = await fetch('/api/users/', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: selectedUserId }),
        });

        if (response.ok) {
            alert("User deleted successfully.");
            refreshTeamList();
        } else {
            alert("Failed to delete user.");
        }
    } catch {
        alert("An error occurred while deleting the user.");
    }
}

async function showAddSkillModal(userId, userName) {
    const modal = document.getElementById('addSkillModal');
    document.getElementById('skillUserId').value = userId;
    document.getElementById('skillUserName').textContent = userName;

    await fetchAndPopulateDropdown('/api/skills', document.getElementById('skill_id'));
    await fetchAndPopulateDropdown('/api/skill_strengths', document.getElementById('skill_strength_id'));

    try {
        const skills = await fetchUserSkills(userId);
        document.getElementById('addSkillForm').dataset.userSkills = JSON.stringify(skills);
    } catch {
        document.getElementById('addSkillForm').dataset.userSkills = '[]';
    }

    modal.style.display = "block";
}

async function fetchUserSkills(userId) {
    const response = await fetch(`/api/skill_enrolments/user/${userId}`, { headers: { 'Content-Type': 'application/json' } });
    return await response.json();
}

async function handleAddSkillForm(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const skillData = Object.fromEntries(formData.entries());

    const userSkills = JSON.parse(e.target.dataset.userSkills || '[]');
    const skillExists = userSkills.some(skill => skill.skill_id === parseInt(skillData.skill_id));

    if (skillExists) {
        alert('This user already has this skill.');
        return;
    }

    try {
        const response = await fetch('/api/skill_enrolments/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(skillData),
        });

        if (response.ok) {
            alert('Skill added successfully!');
            closeModal();
            handleTeamMemberSelection(document.querySelector(`#team-members li[data-id="${skillData.user_id}"]`));
        } else {
            alert('Failed to add skill.');
        }
    } catch {
        alert('An error occurred. Please try again.');
    }
}

async function showEditSkillModal(userId, userName) {
    const modal = document.getElementById('editSkillModal');
    document.getElementById('editSkillUserId').value = userId;
    document.getElementById('editSkillUserName').textContent = userName;

    try {
        const response = await fetch(`/api/skill_enrolments/user/${userId}`, { headers: { 'Content-Type': 'application/json' } });
        const skills = await response.json();
        
        if (skills.length === 0) {
            alert('User has no skills to edit');
            return;
        }

        const skillSelect = document.getElementById('edit_skill_id');
        skillSelect.innerHTML = '<option value="">Select a skill to edit</option>';
        skills.forEach(skill => {
            const option = document.createElement('option');
            option.value = skill.skill_enrolment_id;
            option.textContent = `${skill.skill.skill_name} - ${skill.skillStrength.skill_strength_name}`;
            option.dataset.skill = JSON.stringify(skill);
            skillSelect.appendChild(option);
        });

        skillSelect.onchange = function() {
            const selectedSkill = JSON.parse(this.options[this.selectedIndex].dataset.skill);
            populateEditSkillForm(selectedSkill);
        };

        await fetchAndPopulateDropdown('/api/skill_strengths', document.getElementById('edit_skill_strength_id'));
        modal.style.display = "block";
    } catch {
        alert('Failed to load user skills.');
    }
}

function populateEditSkillForm(skill) {
    document.getElementById('editSkillEnrolmentId').value = skill.skill_enrolment_id;
    document.getElementById('edit_skill_strength_id').value = skill.skill_strength_id;
    document.getElementById('edit_expiry_date').value = skill.expiry_date ? new Date(skill.expiry_date).toISOString().split('T')[0] : '';
    document.getElementById('edit_notes').value = skill.notes || '';
}

async function handleEditSkillForm(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const skillData = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('/api/skill_enrolments', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(skillData),
        });

        if (response.ok) {
            alert('Skill updated successfully!');
            closeModal();
            handleTeamMemberSelection(document.querySelector(`#team-members li[data-id="${selectedUserId}"]`));
        } else {
            alert('Failed to update skill.');
        }
    } catch {
        alert('An error occurred. Please try again.');
    }
}

async function showRemoveSkillModal(userId, userName) {
    const modal = document.getElementById('removeSkillModal');
    document.getElementById('removeSkillUserId').value = userId;
    document.getElementById('removeSkillUserName').textContent = userName;

    try {
        const response = await fetch(`/api/skill_enrolments/user/${userId}`, { headers: { 'Content-Type': 'application/json' } });
        const skills = await response.json();

        if (skills.length === 0) {
            alert('User has no skills to remove');
            return;
        }

        const skillSelect = document.getElementById('remove_skill_id');
        skillSelect.innerHTML = '<option value="">Select a skill to remove</option>';
        skills.forEach(skill => {
            const option = document.createElement('option');
            option.value = skill.skill_enrolment_id;
            option.textContent = `${skill.skill.skill_name} - ${skill.skillStrength.skill_strength_name}`;
            skillSelect.appendChild(option);
        });

        modal.style.display = "block";
    } catch {
        alert('Failed to load user skills.');
    }
}

async function handleRemoveSkillForm(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const skillEnrolmentId = formData.get('skill_enrolment_id');

    try {
        const response = await fetch(`/api/skill_enrolments/${skillEnrolmentId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            alert('Skill removed successfully!');
            closeModal();
            handleTeamMemberSelection(document.querySelector(`#team-members li[data-id="${selectedUserId}"]`));
        } else {
            alert('Failed to remove skill.');
        }
    } catch {
        alert('An error occurred. Please try again.');
    }
}
