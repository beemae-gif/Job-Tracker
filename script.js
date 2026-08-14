/* ==========================================
   MEDICAL JOB TRACKER
   Application Manager
========================================== */


// ---------- LOAD SAVED APPLICATIONS ----------

let applications =
    JSON.parse(localStorage.getItem("applications")) || [];

let editingApplicationId = null;


// ---------- HTML ELEMENTS ----------

const companyInput =
    document.getElementById("companyInput");

const positionInput =
    document.getElementById("positionInput");

const dateInput =
    document.getElementById("dateInput");

const statusInput =
    document.getElementById("statusInput");

const followUpInput =
    document.getElementById("followUpInput");

const notesInput =
    document.getElementById("notesInput");

const saveButton =
    document.getElementById("saveButton");

const cancelEditButton =
    document.getElementById("cancelEditButton");

const applicationList =
    document.getElementById("applicationList");

const applicationCount =
    document.getElementById("applicationCount");

const interviewCount =
    document.getElementById("interviewCount");

const offerCount =
    document.getElementById("offerCount");

const saveMessage =
    document.getElementById("saveMessage");

const formTitle =
    document.getElementById("formTitle");

const searchInput =
    document.getElementById("searchInput");

const filterStatus =
    document.getElementById("filterStatus");

const filterResults =
    document.getElementById("filterResults");


// ---------- SEARCH ----------

searchInput.addEventListener("input", function () {

    displayApplications();

});


// ---------- STATUS FILTER ----------

filterStatus.addEventListener("change", function () {

    displayApplications();

});


// ---------- SAVE APPLICATION ----------

saveButton.addEventListener("click", function () {

    const company =
        companyInput.value.trim();

    const position =
        positionInput.value.trim();

    const date =
        dateInput.value;

    const status =
        statusInput.value;

    const followUp =
        followUpInput.value;

    const notes =
        notesInput.value.trim();


    // Required fields

    if (company === "" || position === "") {

        saveMessage.textContent =
            "Please enter a company and position.";

        return;

    }


    // ---------- EDIT EXISTING APPLICATION ----------

    if (editingApplicationId !== null) {

        const application =
            applications.find(function (item) {

                return item.id === editingApplicationId;

            });


        if (application) {

            application.company =
                company;

            application.position =
                position;

            application.date =
                date;

            application.status =
                status;

            application.followUp =
                followUp;

            application.notes =
                notes;

        }


        saveApplications();

        displayApplications();

        resetForm();

        showMessage(
            "Application updated ✦"
        );

        return;

    }


    // ---------- CREATE NEW APPLICATION ----------

    const newApplication = {

        id: Date.now(),

        company:
            company,

        position:
            position,

        date:
            date,

        status:
            status,

        followUp:
            followUp,

        notes:
            notes

    };


    applications.push(
        newApplication
    );


    saveApplications();

    displayApplications();

    resetForm();

    showMessage(
        "Application saved ✦"
    );

});


// ---------- SAVE TO LOCAL STORAGE ----------

function saveApplications() {

    localStorage.setItem(
        "applications",
        JSON.stringify(applications)
    );

}


// ---------- DISPLAY APPLICATIONS ----------

function displayApplications() {

    applicationList.innerHTML = "";


    // ---------- SEARCH VALUE ----------

    const searchTerm =
        searchInput.value
            .trim()
            .toLowerCase();


    // ---------- STATUS VALUE ----------

    const selectedStatus =
        filterStatus.value;


    // ---------- FILTER APPLICATIONS ----------

    const filteredApplications =
        applications.filter(function (application) {


            const company =
                (application.company || "")
                    .toLowerCase();


            const position =
                (application.position || "")
                    .toLowerCase();


            const matchesSearch =
                company.includes(searchTerm) ||
                position.includes(searchTerm);


            const matchesStatus =
                selectedStatus === "All" ||
                application.status === selectedStatus;


            return (
                matchesSearch &&
                matchesStatus
            );

        });


    // ---------- FILTER RESULTS ----------

    if (
        searchTerm !== "" ||
        selectedStatus !== "All"
    ) {

        filterResults.textContent =
            `${filteredApplications.length} application${
                filteredApplications.length === 1
                    ? ""
                    : "s"
            } found`;

    } else {

        filterResults.textContent = "";

    }


    // ---------- NOTHING FOUND ----------

    if (
        filteredApplications.length === 0
    ) {

        applicationList.innerHTML = `

            <div class="empty-message">

                ✦ No applications found. ✦

                <br><br>

                Try a different search
                or status filter.

            </div>

        `;

        updateStats();

        return;

    }


    // ---------- NEWEST FIRST ----------

    const newestFirst =
        [...filteredApplications]
            .reverse();


    // ---------- CREATE APPLICATION CARDS ----------

    newestFirst.forEach(function (application) {


        const card =
            document.createElement("div");


        card.className =
            "application-card";


        const statusClass =
            application.status
                .toLowerCase()
                .replace(/\s+/g, "-");


        card.innerHTML = `

            <div class="application-header">

                <div>

                    <h3>
                        ✦ ${escapeHTML(
                            application.company
                        )}
                    </h3>

                    <p class="position">
                        ${escapeHTML(
                            application.position
                        )}
                    </p>

                </div>


                <span
                    class="status-badge ${statusClass}"
                >
                    ${escapeHTML(
                        application.status
                    )}
                </span>

            </div>


            <div class="application-details">


                <p>

                    <strong>
                        Applied:
                    </strong>

                    ${formatDate(
                        application.date
                    )}

                </p>


                <p>

                    <strong>
                        Follow-Up:
                    </strong>

                    ${
                        application.followUp
                        ? formatDate(
                            application.followUp
                        )
                        : "Not scheduled"
                    }

                </p>


                <div class="notes-box">

                    <strong>
                        Notes
                    </strong>

                    <p>

                        ${
                            application.notes
                            ? escapeHTML(
                                application.notes
                            )
                            : "No notes added."
                        }

                    </p>

                </div>


            </div>


            <div class="application-actions">


                <button
                    type="button"
                    class="edit-button"
                    data-id="${application.id}"
                >
                    ✎ Edit
                </button>


                <button
                    type="button"
                    class="delete-button"
                    data-id="${application.id}"
                >
                    ✕ Delete
                </button>


            </div>

        `;


        applicationList.appendChild(
            card
        );

    });


    connectButtons();

    updateStats();

}


// ---------- CONNECT EDIT / DELETE BUTTONS ----------

function connectButtons() {


    const editButtons =
        document.querySelectorAll(
            ".edit-button"
        );


    editButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const id =
                        Number(
                            button.dataset.id
                        );

                    editApplication(id);

                }
            );

        }
    );


    const deleteButtons =
        document.querySelectorAll(
            ".delete-button"
        );


    deleteButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const id =
                        Number(
                            button.dataset.id
                        );

                    deleteApplication(id);

                }
            );

        }
    );

}


// ---------- EDIT APPLICATION ----------

function editApplication(id) {


    const application =
        applications.find(
            function (item) {

                return item.id === id;

            }
        );


    if (!application) {

        return;

    }


    editingApplicationId =
        id;


    companyInput.value =
        application.company || "";


    positionInput.value =
        application.position || "";


    dateInput.value =
        application.date || "";


    statusInput.value =
        application.status || "Applied";


    followUpInput.value =
        application.followUp || "";


    notesInput.value =
        application.notes || "";


    formTitle.textContent =
        "✎ Edit Application";


    saveButton.textContent =
        "✦ Update Application ✦";


    cancelEditButton.hidden =
        false;


    document
        .querySelector(
            ".application-box"
        )
        .scrollIntoView({

            behavior: "smooth",

            block: "start"

        });

}


// ---------- CANCEL EDIT ----------

cancelEditButton.addEventListener(
    "click",
    function () {

        resetForm();

        showMessage(
            "Edit cancelled."
        );

    }
);


// ---------- RESET FORM ----------

function resetForm() {


    companyInput.value =
        "";

    positionInput.value =
        "";

    dateInput.value =
        "";

    followUpInput.value =
        "";

    notesInput.value =
        "";

    statusInput.value =
        "Applied";


    editingApplicationId =
        null;


    formTitle.textContent =
        "✦ Add New Application";


    saveButton.textContent =
        "✦ Save Application ✦";


    cancelEditButton.hidden =
        true;

}


// ---------- DELETE APPLICATION ----------

function deleteApplication(id) {


    const application =
        applications.find(
            function (item) {

                return item.id === id;

            }
        );


    if (!application) {

        return;

    }


    const confirmed =
        confirm(
            `Delete ${application.company}?`
        );


    if (!confirmed) {

        return;

    }


    applications =
        applications.filter(
            function (item) {

                return item.id !== id;

            }
        );


    saveApplications();

    displayApplications();

    showMessage(
        "Application deleted."
    );

}


// ---------- DASHBOARD ----------

function updateStats() {


    applicationCount.textContent =
        applications.length;


    interviewCount.textContent =
        applications.filter(
            function (application) {

                return (
                    application.status ===
                    "Interview"
                );

            }
        ).length;


    offerCount.textContent =
        applications.filter(
            function (application) {

                return (
                    application.status ===
                    "Offer"
                );

            }
        ).length;

}


// ---------- DATE FORMAT ----------

function formatDate(dateString) {


    if (!dateString) {

        return "Not provided";

    }


    const date =
        new Date(
            dateString +
            "T00:00:00"
        );


    return date.toLocaleDateString(
        "en-US",
        {

            month: "long",

            day: "numeric",

            year: "numeric"

        }
    );

}


// ---------- MESSAGE ----------

function showMessage(message) {


    saveMessage.textContent =
        message;


    setTimeout(
        function () {

            saveMessage.textContent =
                "";

        },
        3000
    );

}


// ---------- SAFETY ----------

function escapeHTML(text) {


    const element =
        document.createElement(
            "div"
        );


    element.textContent =
        text || "";


    return element.innerHTML;

}


// ---------- START APPLICATION ----------

displayApplications();
