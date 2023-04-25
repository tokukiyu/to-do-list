import { sideBar } from "./sideBar.js";

let TASKLIST = JSON.parse(localStorage.getItem("TASKLIST")) || [];

//// resposiviness
const overLay = {
  overlay: document.getElementById("overlay"),
  overlayAdd: (element) => {
    overLay.overlay.classList.add("overlay");
    overLay.overlay.addEventListener("click", () =>
      overLay.overlayRemove(element)
    );
  },
  overlayRemove: (element) => {
    overLay.overlay.classList.remove("overlay");
    if (element.classList.contains("left-section")) {
      sideBar.removeVisibleClass();
    } else if (element.classList.contains("right-section")) {
      rightSideToggle.removeVisibleClass();
    }
  },
};

//nav bar visibility
const bar = document.querySelector(".fa-bars");
const sidebar = document.querySelector(".left-section");
bar.addEventListener("click", () => barClickHandle());

const barClickHandle = () => {
  let sidebarvisible = true;
  sidebar.style.display == "none"
    ? (sidebarvisible = false)
    : (sidebarvisible = true);
  sidebarvisible ? sideBar.removeVisibleClass() : sideBar.addVisibleClass();
};

if (window.innerWidth < 750) {
  sideBar.controlSidebarVisibility();
  bar.addEventListener("click", () => {
    overLay.overlayAdd(sidebar);
  });
}
const rightSideToggle = {
  right: document.querySelector(".right-section"),
  addVisibleClass: () => {
    //overlay.classList.remove("overlay");
    rightSideToggle.right.style.display = "block";
  },
  removeVisibleClass: () => {
    rightSideToggle.right.style.display = "none";
  },
};
// remove all task
const remove = document.querySelector(".fa-trash");
remove.addEventListener("click", () => {
  localStorage.clear();
  TASKLIST = [];
  displayTask();
  completedTaskList();
});

if (TASKLIST.length === 0) {
  const h = document.querySelector(".done");
  const bg = document.querySelector(".middle-section ");
  h.innerHTML = "";
  bg.style.backgroundImage = "url('images/todo1.jpg')";
}

///
function common(id) {
  const addRemove = document.createElement("div");
  addRemove.classList.add("add-Remove");
  addRemove.setAttribute("id", `task${id}-rem`);
  addRemove.textContent = "add remove";
  return addRemove;
}
const taskDetail = (id, pos) => {
  const task = TASKLIST.find((task) => task.id === id);

  if (task) {
    const div = document.createElement("div");
    const taskdetail = document.createElement("div");

    const taskdet = taskCard(task);
    taskdetail.appendChild(taskdet);
    div.appendChild(taskdetail);

    div.appendChild(common(id));
    //add common more info to the page;
    pos.replaceChild(div, pos.firstElementChild);
  } else {
    console.log(`Task with ID ${id} not found.`);
  }
};
// TASK LIST, INFO, DETAIL, COMPLETED
const middleSection = document.querySelector(".middle-section");
const handleTaskclick = (task, id) => {
  const taskCheckbox = document.getElementById(`task${id}-checkbox`);
  const taskStar = document.getElementById(`task${id}-star`);
  task.addEventListener("click", () => {
    if (event.target === taskCheckbox || event.target === taskStar) {
      task.removeEventListener("click", handleTaskclick);
      return;
    }
    const right = document.querySelector(".right-section");
    const middle = document.getElementsByClassName("middle-section")[0];
    if (right.style.display === "block") {
      task.removeEventListener("click", closeit);
      closeit();
      return;
    } else if (window.innerWidth < 750) {
      rightSideToggle.addVisibleClass();
      overLay.overlayAdd(right);
    } else {
      right.style.display = "block";
      const rightWidth = right.offsetWidth;
      middle.style.width = `calc(78% - ${rightWidth}px)`;
    }
    taskDetail(id, right);
  });
};
const handleChecked = (id) => {
  let completedTask = TASKLIST.filter((task) => task.id === id);
  completedTask[0].completed = "true";
  localStorage.setItem("TASKLIST", JSON.stringify(TASKLIST));
  const element = document.getElementById(`task${id}`);
  if (element) {
    element.remove();
    completedTaskList();
  }
};
function taskCard(task) {
  const taskCard = document.createElement("div");
  taskCard.classList.add("task-card");
  taskCard.setAttribute("id", `task${task.id}`);

  const checkbox = document.createElement("input");
  checkbox.setAttribute("type", "checkbox");
  checkbox.setAttribute("id", `task${task.id}-checkbox`);
  checkbox.addEventListener("change", () => handleChecked(task.id));
  const taskDetails = document.createElement("div");
  const taskTitle = document.createElement("span");
  taskTitle.setAttribute("class", "task-title");
  taskTitle.textContent = task.title;
  const dateTime = document.createElement("div");
  dateTime.setAttribute("class", "date-time");
  dateTime.setAttribute("id", `date-time${task.id}`);
  const taskDate = document.createElement("div");
  taskDate.classList.add("muted-text");
  taskDate.textContent = task.date;
  const taskTime = document.createElement("div");
  taskTime.classList.add("muted-text");
  taskTime.textContent = task.time;

  const starIcon = document.createElement("i");
  starIcon.classList.add(
    "fa-solid",
    "fa-star",
    "priority",
    `task${task.id}-star`
  );

  starIcon.setAttribute("id", `task${task.id}-star`);
  starIcon.addEventListener("click", () => handleStarClick(task.id));

  dateTime.appendChild(taskDate);
  dateTime.appendChild(taskTime);
  taskDetails.appendChild(taskTitle);
  taskDetails.appendChild(dateTime);

  taskCard.appendChild(checkbox);
  taskCard.appendChild(taskDetails);
  taskCard.appendChild(starIcon);
  return taskCard;
}

//all task list

const listAll = document.querySelector(".listAll");
listAll.addEventListener("click", () => {
  const new_taskList = document.querySelector(".new-taskList");
  displayTask();
});
displayTask();
function displayTask() {
  const taskList = document.querySelector(".new-taskList");
  taskList.innerHTML = "";
  let tasklist = TASKLIST.filter((task) => task.completed === "false");
  tasklist.forEach((task) => {
    // Add event listener to task card
    const taskcard = taskCard(task);
    taskList.insertBefore(taskcard, taskList.firstChild);
    taskcard.addEventListener("click", handleTaskclick(taskcard, task.id));
  });
  middleSection.insertBefore(taskList, middleSection.firstChild);
}

// important or prioritiezed task
const importantClick = document.querySelector(".important");
importantClick.addEventListener("click", () => {
  importantTask();
});
function importantTask() {
  let important = TASKLIST.filter((task) => task.priority === "true");
  const task_list = document.querySelector(".new-taskList");
  task_list.innerHTML = "";
  const important_Task = document.createElement("div");
  important_Task.innerHTML = "";
  important.forEach((task) => {
    const taskcard = taskCard(task);
    important_Task.insertBefore(taskcard, important_Task.firstChild);
    taskcard.addEventListener("click", handleTaskclick(taskcard, task.id));
  });
  task_list.appendChild(important_Task);
  middleSection.insertBefore(task_list, middleSection.firstChild);
}
completedTaskList();
// completed task
function completedTaskList() {
  let completedTask = TASKLIST.filter((task) => task.completed === "true");
  const completed = document.querySelector("#completed");
  completed.textContent = "";
  completedTask.forEach((task) => {
    const taskcard = taskCard(task);
    completed.insertBefore(taskcard, completed.firstChild);
    taskcard.addEventListener("click", handleTaskclick(taskcard, task.id));
  });
  middleSection.appendChild(completed);
}
//

///
function handleStarClick(id) {
  const stars = document.querySelectorAll(`.task${id}-star`);
  stars.forEach((star) => {
    if (star.style.color == "yellow") {
      star.style.color = "gray";
    } else {
      star.style.color = "yellow";
    }
  });
  let stared = TASKLIST.find((task) => task.id === id);
  stared.priority = "true";
  localStorage.setItem("TASKLIST", JSON.stringify(TASKLIST));
}
//
const task = document.getElementById("taskA");

function closeit() {
  const right = document.getElementsByClassName("right-section")[0];
  const middle = document.getElementsByClassName("middle-section")[0];
  const rightWidth = right.offsetWidth;
  const middleWidth = middle.offsetWidth;
  middle.style.width = `${middleWidth + rightWidth}px`;
  right.style.display = "none";
}

//ADD TASK
function generetID() {
  for (var i = 0; i <= 100; i++) {
    if (!TASKLIST.find((task) => task.id === i)) {
      return i;
    } else {
      if (i == 100) {
        const alert = document.createElement("div");
        const inputInfo = document.querySelector(".inputInfo");
        alert.setAttribute("class", "alert");
        alert.textContent = "has no more space for new task";
        inputInfo.innerHTML = "";
        inputInfo.insertBefore(alert, inputInfo.firstChild);
      }
    }
  }
}
const searchIn = document.querySelector(".search");
const search = document.querySelector("#search");

searchIn.addEventListener("submit", (event) => {
  event.preventDefault();
  Search(search.value);
});

function Search(name) {
  const result = TASKLIST.filter((item) =>
    Object.values(item).some((value) =>
      value.toString().toLowerCase().includes(name.toLowerCase())
    )
  );

  displaySearchSort(result);
}
function displaySearchSort(result) {
  const task_list = document.querySelector(".new-taskList");
  task_list.innerHTML = "";
  const important_Task = document.createElement("div");
  important_Task.innerHTML = "";
  result.forEach((task) => {
    const taskcard = taskCard(task);
    important_Task.insertBefore(taskcard, important_Task.firstChild);
    taskcard.addEventListener("click", handleTaskclick(taskcard, task.id));
  });
  task_list.appendChild(important_Task);
  middleSection.insertBefore(task_list, middleSection.firstChild);
}

const form = document.querySelector(".form");
const title = document.querySelector(".title");
const date = document.querySelector(".date");
const time = document.querySelector(".time");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  let id = generetID();
  if (title.value != "") {
    TASKLIST.push({
      id: id,
      title: title.value,
      date: date.value,
      time: time.value,
      completed: "false",
      priority: "false",
    });
    ///inter
    localStorage.setItem("TASKLIST", JSON.stringify(TASKLIST));
    displayTask();
    title.value = "";
  }
});

const addtask = document.querySelector("#addNewTask");
const addinput = document.getElementById("addNewInput");
addtask.addEventListener("click", () => {
  addtask.remove();
  addinput.style.display = "block";
  document.querySelector(".time").style.display = "block";
  document.querySelector(".date").style.display = "block";

  // addinput.style.width = "100vw";
});
function updateTime() {
  // Get the current date
  const currentDate = new Date();
  // Check if any tasks have the same date as the current date
  TASKLIST.forEach((task) => {
    const taskDate = new Date(task.date);

    // If the task date is the same as the current date and the task has not been completed
    if (taskDate.toDateString() === currentDate.toDateString()) {
      // Display a notification
      if (!("Notification" in window)) {
        alert("This browser does not support desktop notifications");
      } else if (Notification.permission === "granted") {
        new Notification(`Task due today: ${task.title}`);
      } else {
        Notification.requestPermission().then(function (permission) {
          if (permission === "granted") {
            var not = new Notification(`Task due today: ${task.title}`);
          }
        });
      }
    }
  });
}

setInterval(notify,1000)
setInterval(updateTime, 360000);
function notify() {
  const currentDate = new Date();
  TASKLIST.forEach((task) => {
    const taskDate = new Date(task.date);
    if (taskDate <= currentDate) {
      const makered = document.getElementById(`date-time${task.id}`);
      makered.style.color = "red";
    }
  });
}

//call
//
let stared = TASKLIST.filter((task) => task.priority === "true");
stared.forEach((stared) => {
  handleStarClick(stared.id);
});
