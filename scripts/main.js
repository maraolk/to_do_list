var goals = [];
var isEditing = false;
var editingId = null;


window.onload = function() {
    loadFromStorage();
    renderGoals();
    setupEventListeners();
};


function setupEventListeners() {
    var addButton = document.getElementById('addButton');
    var goalInput = document.getElementById('goalInput');

    addButton.addEventListener('click', addGoal);
    goalInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            addGoal();
        }
    });
}


function addGoal() {
    var input = document.getElementById('goalInput');
    var text = input.value.trim();
    if (text === '') {
        return;
    }

    if (isEditing) {
        for (var i = 0; i < goals.length; i++) {
            if (goals[i].id === editingId) {
                goals[i].text = text;
                break;
            }
        }
        isEditing = false;
        editingId = null;
        document.getElementById('addButton').textContent = 'Добавить ➕';
    } else {
        var newGoal = {
            id: Date.now(),
            text: text,
            completed: false
        };
        goals.push(newGoal);
    }

    input.value = '';
    saveToStorage();
    renderGoals();
}


function deleteGoal(id) {
    for (var i = 0; i < goals.length; i++) {
        if (goals[i].id === id) {
            goals.splice(i, 1);
            break;
        }
    }
    saveToStorage();
    renderGoals();
}


function toggleComplete(id) {
    for (var i = 0; i < goals.length; i++) {
        if (goals[i].id === id) {
            goals[i].completed = !goals[i].completed;
            break;
        }
    }
    saveToStorage();
    renderGoals();
}


function startEdit(id) {
    for (var i = 0; i < goals.length; i++) {
        if (goals[i].id === id) {
            document.getElementById('goalInput').value = goals[i].text;
            isEditing = true;
            editingId = id;
            document.getElementById('addButton').textContent = 'Сохранить ✅';
            document.getElementById('goalInput').focus();
            break;
        }
    }
}


function renderGoals() {
    var container = document.getElementById('goalsContainer');
    var emptyMessage = document.getElementById('emptyMessage');

    if (goals.length === 0) {
        container.innerHTML = '';
        emptyMessage.style.display = 'block';
        return;
    }

    emptyMessage.style.display = 'none';

    var goalsHTML = '';
    for (var i = 0; i < goals.length; i++) {
        var goal = goals[i];
        var textClass = goal.completed ? 'goal-text goal-completed' : 'goal-text';
        var statusIcon = goal.completed ? '✅' : '⏳';

        goalsHTML += '<div class="goal-item">';
        goalsHTML += '<span class="' + textClass + '">' + statusIcon + ' ' + goal.text + '</span>';
        goalsHTML += '<div class="goal-actions">';
        goalsHTML += '<button class="action-button complete-button" onclick="toggleComplete(' + goal.id + ')">';
        goalsHTML += goal.completed ? '❌ Отменить' : '✅ Выполнено';
        goalsHTML += '</button>';
        goalsHTML += '<button class="action-button edit-button" onclick="startEdit(' + goal.id + ')">✏️ Изменить</button>';
        goalsHTML += '<button class="action-button delete-button" onclick="deleteGoal(' + goal.id + ')">🗑️ Удалить</button>';
        goalsHTML += '</div>';
        goalsHTML += '</div>';
    }

    container.innerHTML = goalsHTML;
}


function saveToStorage() {
    localStorage.setItem('goalsData', JSON.stringify(goals));
}


function loadFromStorage() {
    var saved = localStorage.getItem('goalsData');
    if (saved) {
        goals = JSON.parse(saved);
    }
}