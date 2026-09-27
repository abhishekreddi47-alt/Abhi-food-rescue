// ==========================================
// FOOD RESCUE & DONATION
// COMPLETE JAVASCRIPT
// ==========================================


// ==========================================
// DATA
// ==========================================

let donations =
    JSON.parse(localStorage.getItem("donations")) || [];

let requests =
    JSON.parse(localStorage.getItem("requests")) || [];

let deliveries =
    JSON.parse(localStorage.getItem("deliveries")) || [];


// ==========================================
// SAVE DATA
// ==========================================

function saveData() {

    localStorage.setItem(
        "donations",
        JSON.stringify(donations)
    );

    localStorage.setItem(
        "requests",
        JSON.stringify(requests)
    );

    localStorage.setItem(
        "deliveries",
        JSON.stringify(deliveries)
    );
}


// ==========================================
// SCROLL
// ==========================================

function goToSection(id) {

    document.getElementById(id)
        .scrollIntoView({
            behavior: "smooth"
        });
}


// ==========================================
// ROLE SELECTION
// ==========================================

function selectRole(role) {

    localStorage.setItem(
        "selectedRole",
        role
    );

    document.getElementById(
        "selectedRole"
    ).innerText =
        "You are using Food Rescue as: " +
        role;

    alert(
        "Welcome! 👋\n\n" +
        "Selected Role: " +
        role
    );
}


// ==========================================
// DONATE FOOD
// ==========================================

document
    .getElementById("donationForm")
    .addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            let foodName =
                document.getElementById(
                    "foodName"
                ).value.trim();


            let quantity =
                Number(
                    document.getElementById(
                        "quantity"
                    ).value
                );


            let foodType =
                document.getElementById(
                    "foodType"
                ).value;


            let location =
                document.getElementById(
                    "location"
                ).value.trim();


            let safeTime =
                document.getElementById(
                    "safeTime"
                ).value;


            // Create donation

            let donation = {

                id: Date.now(),

                foodName: foodName,

                quantity: quantity,

                foodType: foodType,

                location: location,

                safeTime: safeTime,

                status: "Available"

            };


            donations.push(donation);

            saveData();


            // Show message

            document.getElementById(
                "donationMessage"
            ).innerText =
                "✅ Food added successfully!";


            // Reset form

            document
                .getElementById(
                    "donationForm"
                )
                .reset();


            // Update website

            displayFood();

            updateDashboard();

            updateTracking(
                "donated"
            );

        }
    );


// ==========================================
// DISPLAY FOOD
// ==========================================

function displayFood() {

    let foodList =
        document.getElementById(
            "foodList"
        );

    let noFood =
        document.getElementById(
            "noFood"
        );


    foodList.innerHTML = "";


    if (donations.length === 0) {

        noFood.style.display =
            "block";

        return;

    }


    noFood.style.display =
        "none";


    donations.forEach(
        function(food) {

            let card =
                document.createElement(
                    "div"
                );

            card.className =
                "food-card";


            let requestButton = "";


            if (
                food.status ===
                "Available"
            ) {

                requestButton = `
                    <button
                        onclick="requestFood(${food.id})">
                        Request Food
                    </button>
                `;

            }


            card.innerHTML = `

                <h3>
                    🍱 ${food.foodName}
                </h3>

                <p>
                    <b>Quantity:</b>
                    ${food.quantity} meals
                </p>

                <p>
                    <b>Type:</b>
                    ${food.foodType}
                </p>

                <p>
                    <b>Location:</b>
                    ${food.location}
                </p>

                <p>
                    <b>Safe Until:</b>
                    ${formatDate(food.safeTime)}
                </p>

                <span class="food-status">
                    ${food.status}
                </span>

                <br>

                ${requestButton}

            `;


            foodList.appendChild(
                card
            );

        }
    );

}


// ==========================================
// SEARCH FOOD
// ==========================================

function searchFood() {

    let search =
        document.getElementById(
            "searchFood"
        ).value.toLowerCase();


    let cards =
        document.querySelectorAll(
            ".food-card"
        );


    cards.forEach(
        function(card) {

            let text =
                card.innerText
                    .toLowerCase();


            if (
                text.includes(search)
            ) {

                card.style.display =
                    "block";

            } else {

                card.style.display =
                    "none";

            }

        }
    );
}


// ==========================================
// REQUEST FOOD
// ==========================================

function requestFood(id) {

    let food =
        donations.find(
            function(item) {

                return item.id === id;

            }
        );


    if (!food) {

        return;

    }


    food.status =
        "Requested";


    requests.push({

        id: Date.now(),

        foodId: id,

        foodName: food.foodName,

        status: "Requested"

    });


    saveData();


    alert(
        "🤝 Food requested successfully!\n\n" +
        food.foodName
    );


    displayFood();

    updateDashboard();

    updateVolunteerList();

    updateTracking(
        "requested"
    );
}


// ==========================================
// VOLUNTEER LIST
// ==========================================

function updateVolunteerList() {

    let list =
        document.getElementById(
            "volunteerList"
        );


    let requested =
        donations.filter(
            function(food) {

                return (
                    food.status ===
                    "Requested"
                );

            }
        );


    if (
        requested.length === 0
    ) {

        list.innerHTML =
            "<p>No pickup tasks available.</p>";

        return;

    }


    list.innerHTML = "";


    requested.forEach(
        function(food) {

            let card =
                document.createElement(
                    "div"
                );


            card.className =
                "volunteer-card";


            card.innerHTML = `

                <h3>
                    🍱 ${food.foodName}
                </h3>

                <p>
                    <b>Quantity:</b>
                    ${food.quantity} meals
                </p>

                <p>
                    <b>Pickup:</b>
                    ${food.location}
                </p>

                <p>
                    <b>Delivery:</b>
                    NGO / Organization
                </p>

                <p>
                    <b>Status:</b>
                    <span class="volunteer-status">
                        ${food.status}
                    </span>
                </p>

                <button
                    onclick="acceptPickup(${food.id})">
                    🛵 Accept Pickup
                </button>

            `;


            list.appendChild(
                card
            );

        }
    );

}


// ==========================================
// ACCEPT PICKUP
// ==========================================

function acceptPickup(id) {

    let food =
        donations.find(
            function(item) {

                return item.id === id;

            }
        );


    if (!food) {

        return;

    }


    food.status =
        "Picked Up";


    saveData();


    updateVolunteerList();

    displayFood();

    updateTracking(
        "picked"
    );


    // Automatically show next step

    setTimeout(
        function() {

            if (
                confirm(
                    "📦 Food picked up!\n\n" +
                    "Click OK when the food is delivered."
                )
            ) {

                deliverFood(id);

            }

        },
        300
    );

}


// ==========================================
// DELIVER FOOD
// ==========================================

function deliverFood(id) {

    let food =
        donations.find(
            function(item) {

                return item.id === id;

            }
        );


    if (!food) {

        return;

    }


    food.status =
        "Delivered";


    deliveries.push({

        id: Date.now(),

        foodId: id,

        foodName: food.foodName,

        quantity: food.quantity,

        status: "Delivered"

    });


    saveData();


    updateVolunteerList();

    displayFood();

    updateDashboard();

    updateTracking(
        "delivered"
    );


    alert(
        "✅ Food delivered successfully!"
    );

}


// ==========================================
// TRACKING
// ==========================================

function updateTracking(status) {

    let steps = [

        document.getElementById(
            "track1"
        ),

        document.getElementById(
            "track2"
        ),

        document.getElementById(
            "track3"
        ),

        document.getElementById(
            "track4"
        )

    ];


    steps.forEach(
        function(step) {

            step.classList.remove(
                "active"
            );

        }
    );


    let message =
        document.getElementById(
            "trackingMessage"
        );


    if (
        status === "donated"
    ) {

        steps[0]
            .classList.add("active");

        message.innerText =
            "🍱 Food has been donated.";

    }


    else if (
        status === "requested"
    ) {

        steps[0]
            .classList.add("active");

        steps[1]
            .classList.add("active");

        message.innerText =
            "🤝 NGO has requested the food.";

    }


    else if (
        status === "picked"
    ) {

        steps[0]
            .classList.add("active");

        steps[1]
            .classList.add("active");

        steps[2]
            .classList.add("active");

        message.innerText =
            "📦 Volunteer has picked up the food.";

    }


    else if (
        status === "delivered"
    ) {

        steps.forEach(
            function(step) {

                step.classList.add(
                    "active"
                );

            }
        );

        message.innerText =
            "✅ Food delivered successfully!";

    }

}


// ==========================================
// DASHBOARD
// ==========================================

function updateDashboard() {

    document.getElementById(
        "totalDonations"
    ).innerText =
        donations.length;


    document.getElementById(
        "totalRequests"
    ).innerText =
        requests.length;


    document.getElementById(
        "totalDeliveries"
    ).innerText =
        deliveries.length;


    let meals = 0;


    donations.forEach(
        function(food) {

            if (
                food.status ===
                "Delivered"
            ) {

                meals +=
                    food.quantity;

            }

        }
    );


    document.getElementById(
        "totalMeals"
    ).innerText =
        meals;

}


// ==========================================
// FORMAT DATE
// ==========================================

function formatDate(date) {

    if (!date) {

        return "Not specified";

    }


    let d =
        new Date(date);


    return d.toLocaleString();

}


// ==========================================
// LOAD DATA WHEN PAGE OPENS
// ==========================================

displayFood();

updateDashboard();

updateVolunteerList();


// Show selected role

let savedRole =
    localStorage.getItem(
        "selectedRole"
    );


if (savedRole) {

    document.getElementById(
        "selectedRole"
    ).innerText =
        "Current role: " +
        savedRole;

}