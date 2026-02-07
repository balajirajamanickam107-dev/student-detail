// Student Details App

const form = document.getElementById("student-form");
const formMessage = document.getElementById("form-message");
const tableBody = document.getElementById("studentTableBody");
const searchInput = document.getElementById("searchInput");
const yearSpan = document.getElementById("year");

// Simple in-memory storage for this page
let students = [];

// Utility to show a short message next to the form
function showFormMessage(message, type = "info") {
  formMessage.textContent = message;
  formMessage.classList.remove("error", "success");
  if (type === "error") {
    formMessage.classList.add("error");
  } else if (type === "success") {
    formMessage.classList.add("success");
  }
}

function clearForm() {
  form.reset();
}

function gradeClass(grade) {
  switch (grade) {
    case "A":
      return "grade-a";
    case "B":
      return "grade-b";
    case "C":
      return "grade-c";
    case "D":
      return "grade-d";
    default:
      return "grade-f";
  }
}

function renderTable(filteredList = null) {
  const list = filteredList || students;

  tableBody.innerHTML = "";

  if (list.length === 0) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 6;
    cell.textContent = "No students added yet.";
    cell.style.textAlign = "center";
    cell.style.color = "var(--text-muted)";
    row.appendChild(cell);
    tableBody.appendChild(row);
    return;
  }

  list.forEach((student, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${student.id}</td>
      <td>${student.name}</td>
      <td>${student.course}</td>
      <td>${student.email}</td>
      <td><span class="badge ${gradeClass(student.grade)}">${student.grade}</span></td>
      <td>
        <div class="actions">
          <button class="btn small ghost danger" data-index="${index}" data-action="delete">Delete</button>
        </div>
      </td>
    `;

    tableBody.appendChild(row);
  });
}

function handleAddStudent(event) {
  event.preventDefault();

  const id = document.getElementById("studentId").value.trim();
  const name = document.getElementById("studentName").value.trim();
  const course = document.getElementById("studentCourse").value.trim();
  const email = document.getElementById("studentEmail").value.trim();
  const grade = document.getElementById("studentGrade").value;

  if (!id || !name || !course || !email || !grade) {
    showFormMessage("Please fill in all fields.", "error");
    return;
  }

  const existing = students.find((s) => s.id.toLowerCase() === id.toLowerCase());
  if (existing) {
    showFormMessage("A student with this ID already exists.", "error");
    return;
  }

  const student = { id, name, course, email, grade };
  students.push(student);
  renderTable();
  clearForm();
  showFormMessage("Student added successfully.", "success");
}

function handleSearch() {
  const query = searchInput.value.trim().toLowerCase();
  if (!query) {
    renderTable();
    return;
  }

  const filtered = students.filter((student) => {
    return (
      student.id.toLowerCase().includes(query) ||
      student.name.toLowerCase().includes(query) ||
      student.course.toLowerCase().includes(query)
    );
  });

  renderTable(filtered);
}

function handleTableClick(event) {
  const target = event.target;
  if (target.matches("button[data-action='delete']")) {
    const index = parseInt(target.getAttribute("data-index"), 10);
    if (!Number.isNaN(index)) {
      students.splice(index, 1);
      renderTable();
      showFormMessage("Student deleted.", "success");
    }
  }
}

function initYear() {
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
}

// Event listeners
form.addEventListener("submit", handleAddStudent);
searchInput.addEventListener("input", handleSearch);
tableBody.addEventListener("click", handleTableClick);

// Initial setup
initYear();
renderTable();

