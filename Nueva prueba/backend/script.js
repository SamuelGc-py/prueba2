// =====================
// Referencias al DOM
// =====================
const toursContainer = document.getElementById("toursContainer");
const crudForm = document.getElementById("crudForm");
const tourForm = document.getElementById("tourForm");
const addTourBtn = document.getElementById("addTourBtn");
const cancelBtn = document.getElementById("cancelBtn");

// Campos del formulario
const tourIdInput = document.getElementById("tourId");
const titleInput = document.getElementById("title");
const locationInput = document.getElementById("location");
const priceInput = document.getElementById("price");
const durationInput = document.getElementById("duration");
const descriptionInput = document.getElementById("description");
const tourTypeSelect = document.getElementById("tourType");
const imageUrlInput = document.getElementById("imageUrl");

// Autenticación y overlays
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const addTourMobileBtn = document.getElementById("addTourMobileBtn");
const loginMobileBtn = document.getElementById("loginMobileBtn");
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const mobileMenu = document.getElementById("mobileMenu");
const userProfileBtn = document.getElementById("user-profile-btn");
const userDropdownMenu = document.getElementById("user-dropdown-menu");
const authOverlay = document.getElementById("auth-overlay");
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const showRegisterLink = document.getElementById("show-register");
const showLoginLink = document.getElementById("show-login");
const interesOverlay = document.getElementById("interes-overlay");
const interesForm = document.getElementById("interes-form");

// =====================
// Estado de la aplicación
// =====================
let currentMode = "add"; // "add" o "edit"
let currentUser = null; // "admin", "user" o null

// =====================
// Funciones de UI
// =====================
function clearTours() {
    toursContainer.innerHTML = "";
}

function createTourCard(tour) {
    const template = document.getElementById("tour-card-template");
    const card = template.content.cloneNode(true).querySelector(".tour-card");

    card.id = `tour-${tour.id}`;
    card.querySelector("img").src = tour.imageUrl;
    card.querySelector("img").alt = tour.title;
    card.querySelector("h3").textContent = tour.title;
    card.querySelector("p").textContent = tour.description;
    card.querySelector(".tour-info span:nth-of-type(1)").textContent = tour.location;
    card.querySelector(".tour-info span:nth-of-type(2)").textContent = tour.duration;
    card.querySelector(".tour-info span:nth-of-type(3)").textContent = `$${tour.price.toLocaleString('es-CO')}`;

    const btnInteres = card.querySelector(".btn-interes");
    btnInteres.addEventListener("click", () => handleInterestClick(tour.title));

    // Admin controls - solo visibles para el admin
    const adminControls = card.querySelector(".admin-controls");
    if (currentUser === "admin") {
        adminControls.style.display = "flex";
        const editBtn = card.querySelector(".btn-edit");
        const deleteBtn = card.querySelector(".btn-delete");

        editBtn.addEventListener("click", () => editTour(tour.id));
        deleteBtn.addEventListener("click", () => deleteTour(tour.id));
    } else {
        adminControls.style.display = "none";
    }

    return card;
}

function renderTours(filterType = "all") {
    clearTours();

    const filteredTours = filterType === "all" ?
        tours :
        tours.filter(t => t.type === filterType);

    filteredTours.forEach(tour => {
        const card = createTourCard(tour);
        toursContainer.appendChild(card);
    });
}

function showForm() {
    crudForm.style.display = "flex";
    if (currentMode === "add") resetForm();
}

function hideForm() {
    crudForm.style.display = "none";
}

function resetForm() {
    tourIdInput.value = "";
    titleInput.value = "";
    locationInput.value = "";
    priceInput.value = "";
    durationInput.value = "";
    descriptionInput.value = "";
    imageUrlInput.value = "";
    tourTypeSelect.value = "cultural";
}

// =====================
// Funciones de negocio (CRUD)
// =====================
function saveTour() {
    const newTour = {
        id: currentMode === "add" ? getNextTourId() : Number(tourIdInput.value),
        title: titleInput.value,
        location: locationInput.value,
        price: Number(priceInput.value),
        duration: Number(durationInput.value),
        description: descriptionInput.value,
        imageUrl: imageUrlInput.value || "https://placehold.co/600x400?text=Tour",
        type: tourTypeSelect.value
    };

    if (currentMode === "add") {
        tours.push(newTour);
    } else {
        const index = tours.findIndex(t => t.id === newTour.id);
        if (index !== -1) {
            tours[index] = newTour;
        }
    }

    renderTours();
    hideForm();
}

function editTour(id) {
    const tourToEdit = tours.find(t => t.id === id);
    if (!tourToEdit) return;

    currentMode = "edit";
    showForm();

    tourIdInput.value = tourToEdit.id;
    titleInput.value = tourToEdit.title;
    locationInput.value = tourToEdit.location;
    priceInput.value = tourToEdit.price;
    durationInput.value = tourToEdit.duration;
    descriptionInput.value = tourToEdit.description;
    imageUrlInput.value = tourToEdit.imageUrl;
    tourTypeSelect.value = tourToEdit.type;
}

function deleteTour(id) {
    if (confirm("¿Estás seguro de que quieres eliminar este tour?")) {
        const index = tours.findIndex(t => t.id === id);
        if (index !== -1) {
            tours.splice(index, 1);
            renderTours();
        }
    }
}

function getNextTourId() {
    return tours.length > 0 ? Math.max(...tours.map(t => t.id)) + 1 : 1;
}

// =====================
// Autenticación y gestión de usuarios
// =====================
function login(userType) {
    currentUser = userType;
    alert(`¡Bienvenido, ${currentUser}!`);
    authOverlay.style.display = 'none';
    updateUIForUserRole();
}

function logout() {
    currentUser = null;
    alert("Sesión cerrada.");
    updateUIForUserRole();
}

function updateUIForUserRole() {
    // Esconder todos los elementos de admin por defecto
    document.querySelectorAll(".admin-only").forEach(el => el.style.display = "none");

    // Esconder el botón de login y mostrar el de perfil por defecto
    loginBtn.style.display = "block";
    loginMobileBtn.style.display = "block";
    userProfileBtn.style.display = "none";

    if (currentUser === "admin") {
        // Mostrar elementos de admin si el usuario es un admin
        document.querySelectorAll(".admin-only").forEach(el => el.style.display = "block");

        // Esconder el botón de login y mostrar el de perfil
        loginBtn.style.display = "none";
        loginMobileBtn.style.display = "none";
        userProfileBtn.style.display = "block";

    } else if (currentUser === "user") {
        // Solo esconder el botón de login y mostrar el de perfil para usuarios
        loginBtn.style.display = "none";
        loginMobileBtn.style.display = "none";
        userProfileBtn.style.display = "block";
    }

    renderTours(); // Volver a renderizar los tours para mostrar/ocultar los botones de CRUD
}

function handleInterestClick(tourTitle) {
    if (currentUser) {
        interesOverlay.style.display = 'flex';
        // Aquí podrías pre-llenar el formulario de interés si tuvieras los datos del usuario logueado
    } else {
        alert("Debes iniciar sesión primero para expresar interés en un tour.");
        authOverlay.style.display = 'flex';
    }
}

// =====================
// Eventos
// =====================
if (addTourBtn) {
    addTourBtn.addEventListener("click", () => {
        currentMode = "add";
        showForm();
    });
}
if (addTourMobileBtn) {
    addTourMobileBtn.addEventListener("click", () => {
        currentMode = "add";
        showForm();
        mobileMenu.style.display = 'none'; // Cierra el menú móvil
    });
}
if (cancelBtn) {
    cancelBtn.addEventListener("click", hideForm);
}
if (tourForm) {
    tourForm.addEventListener("submit", e => {
        e.preventDefault();
        saveTour();
    });
}
if (loginBtn) {
    loginBtn.addEventListener('click', () => {
        authOverlay.style.display = 'flex';
        loginForm.style.display = 'flex';
        registerForm.style.display = 'none';
    });
}
if (loginMobileBtn) {
    loginMobileBtn.addEventListener('click', () => {
        authOverlay.style.display = 'flex';
        loginForm.style.display = 'flex';
        registerForm.style.display = 'none';
        mobileMenu.style.display = 'none';
    });
}
if (userProfileBtn) {
    userProfileBtn.addEventListener('click', () => {
        userDropdownMenu.classList.toggle('show');
    });
}
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        logout();
    });
}
if (showRegisterLink) {
    showRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.style.display = 'none';
        registerForm.style.display = 'flex';
    });
}
if (showLoginLink) {
    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        registerForm.style.display = 'none';
        loginForm.style.display = 'flex';
    });
}
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById("login-username").value;
        const password = document.getElementById("login-password").value;
        // Lógica de validación
        if (username === "admin" && password === "admin123") {
            login("admin");
        } else if (username === "user" && password === "user123") {
            login("user");
        } else {
            alert("Usuario o contraseña incorrectos.");
        }
    });
}
if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const userType = document.querySelector('input[name="user-type"]:checked').value;
        // Aquí podrías agregar lógica para guardar el usuario
        alert(`Usuario registrado como ${userType}.`);
        login(userType);
    });
}
if (interesForm) {
    interesForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert("Formulario de interés enviado.");
        interesOverlay.style.display = 'none';
    });
}
if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.style.display = mobileMenu.style.display === 'flex' ? 'none' : 'flex';
    });
}

// Cierra los menús al hacer clic fuera
document.addEventListener('click', (e) => {
    if (userDropdownMenu && !userProfileBtn.contains(e.target) && !userDropdownMenu.contains(e.target)) {
        userDropdownMenu.classList.remove('show');
    }
});

// =====================
// Inicialización
// =====================
updateUIForUserRole();