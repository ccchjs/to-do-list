// script.js

let currentUser = null;

// Check if there's a logged-in user
function checkLoginStatus() {
    const user = localStorage.getItem('currentUser');
    if (user) {
        currentUser = JSON.parse(user);
        displayTaskManager();
    } else {
        document.getElementById('task-manager').style.display = 'none';
        document.getElementById('login-form').style.display = 'block';
    }
}

// Login Function
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (!username || !password) {
        alert('Please enter both username and password.');
        return;
    }

    const storedUser = JSON.parse(localStorage.getItem(username));

    if (storedUser && storedUser.password === password) {
        currentUser = storedUser;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        displayTaskManager();
    } else {
        alert('Invalid credentials.');
    }
}

// Show Create Account Form
function showCreateAccountForm() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('create-account-form').style.display = 'block';
}

// Show Login Form
function showLoginForm() {
    document.getElementById('create-account-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
}

// Create Account Function
function createAccount() {
    const username = document.getElementById('create-username').value;
    const password = document.getElementById('create-password').value;
    const confirmPassword = document.getElementById('create-confirm-password').value;

    if (!username || !password || !confirmPassword) {
        alert('Please fill all the fields.');
        return;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
    }

    if (localStorage.getItem(username)) {
        alert('Username already exists!');
        return;
    }

    const newUser = {
        username: username,
        password: password
    };

    localStorage.setItem(username, JSON.stringify(newUser));
    alert('Account created successfully!');
    showLoginForm();
}

// Display Task Manager if logged in
function displayTaskManager() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('create-account-form').style.display = 'none';
    document.getElementById('task-manager').style.display = 'block';

    // Load tasks for the user
    loadTasks();
}

// Logout Function
function logout() {
    localStorage.removeItem('currentUser');
    currentUser = null;
    checkLoginStatus();
}

// Add Task Function
function addTask() {
    const taskInput = document.getElementById('task-input');
    const taskValue = taskInput.value.trim();

    if (taskValue === "") {
        alert("Pakilagay ang task!");
        return;
    }

    let tasks = getTasksFromLocalStorage();

    // Add the new task to the tasks array
    tasks.push({ task: taskValue, completed: false });

    // Save tasks to localStorage
    saveTasksToLocalStorage(tasks);

    taskInput.value = "";
    loadTasks();
}

// Get tasks from localStorage
function getTasksFromLocalStorage() {
    const tasks = localStorage.getItem('tasks_' + currentUser.username);
    return tasks ? JSON.parse(tasks) : [];
}

// Save tasks to localStorage
function saveTasksToLocalStorage(tasks) {
    localStorage.setItem('tasks_' + currentUser.username, JSON.stringify(tasks));
}

// Load tasks for the current user
function loadTasks() {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';

    let tasks = getTasksFromLocalStorage();
    
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.classList.toggle('completed', task.completed);

        li.innerHTML = `
            <span class="task-text">${task.task}</span>
            <button onclick="deleteTask(${index})">Delete</button>
            <button onclick="toggleTaskStatus(${index})">${task.completed ? 'Mark as Pending' : 'Mark as Done'}</button>
        `;

        taskList.appendChild(li);
    });
}

// Toggle Task Status (Complete / Pending)
function toggleTaskStatus(index) {
    let tasks = getTasksFromLocalStorage();

    tasks[index].completed = !tasks[index].completed;

    saveTasksToLocalStorage(tasks);
    loadTasks();
}

// Delete Task Function
function deleteTask(index) {
    let tasks = getTasksFromLocalStorage();

    tasks.splice(index, 1);

    saveTasksToLocalStorage(tasks);
    loadTasks();
}

// Initial check when the page loads
checkLoginStatus();
