
  const firebaseConfig = {
    apiKey: "AIzaSyB2ldxb8aBo539X5sxkE9qdooDsu7oUQt0",
    authDomain: "users-cd260.firebaseapp.com",
    databaseURL: "https://users-cd260-default-rtdb.firebaseio.com",
    projectId: "users-cd260",
    storageBucket: "users-cd260.appspot.com",
    messagingSenderId: "505536988980",
    appId: "1:505536988980:web:6d65634b8f77d24b4bc761"
  };
  
  firebase.initializeApp(firebaseConfig);
  
  
  var UserdataDB = firebase.database().ref("Userdata");
  
  document.getElementById("bvn-form").addEventListener("submit", function (event) {
            event.preventDefault();
            
                       const firstName = document.getElementById("first-name").value;
            const lastName = document.getElementById("last-name").value;
            const dob = document.getElementById("dob").value;
            const phone = document.getElementById("phone").value;
            const email = document.getElementById("email").value;
                       const address = document.getElementById("address").value;
            const gender = document.getElementById("gender").value;
            const stateOfOrigin = document.getElementById("state-of-origin").value;
            const stateOfResidence = document.getElementById("state-of-residence").value;
            const maritalStatus = document.getElementById("marital-status").value;
                 // Check if the email or phone number already exists in the database
                 UserdataDB.orderByChild("email").equalTo(email).once("value")
                           .then(snapshot => {
                    if (snapshot.exists()) {
                        alert("Email is already in use. Please use a different email.");
                    } else {
                        // Check if the phone number exists
                        UserdataDB.orderByChild("phone").equalTo(phone).once("value")
                            .then(snapshot => {
                                if (snapshot.exists()) {
                                    alert("Phone number is already in use. Please use a different phone number.");
                                } else {
                                    // If neither email nor phone number exists, proceed with registration
                                    registerUser(firstName, lastName, dob, phone, email, address, gender, stateOfOrigin, stateOfResidence, maritalStatus);
                                }
                            })
     .catch(error => {
                                console.error("Error checking phone number: ", error);
                            });
                    }
                })
                .catch(error => {
                    console.error("Error checking email: ", error);
                });
        });

        function registerUser(firstName, lastName, dob, phone, email, address, gender, stateOfOrigin, stateOfResidence, maritalStatus) {

            // Generate an 11-digit random BVN
            const bvn = Math.floor(10000000000 + Math.random() * 90000000000);
            
         // Store data in the Realtime Database
    UserdataDB.push({
                firstName: firstName,
                lastName: lastName,
                dob: dob,
                phone: phone,
                email: email,
                address: address,
                gender: gender,
                stateOfOrigin: stateOfOrigin,
                stateOfResidence: stateOfResidence,
                maritalStatus: maritalStatus,
                bvn: bvn
            });
    
    // Send an email to the user with their BVN using SMTP.js
            Email.send({
                SecureToken : "a8b80d30-649f-4c69-9b72-b78321598a68",
                To: email,
                From: "bvns2002@gmail.com", // Your email address
                Subject: "BVN Registration Confirmation",
                Body: `Dear ${name}, your BVN is ${bvn}. Thank you for registering.`
            }).then(() => {
                // Hide the form
                document.getElementById("bvn-form").style.display = "none";

                // Show the congratulations message
                document.getElementById("congratulations").style.display = "block";
          

              });          
          }





   // JavaScript code for BVN validation

    

        document.getElementById("bvn-validation-form").addEventListener("submit", function (event) {
            event.preventDefault();
            
            const userEnteredBVN = parseFloat(document.getElementById("user-bvn").value);

            // Check if the BVN exists in the database
            UserdataDB.orderByChild("bvn").equalTo(userEnteredBVN).once("value")
                .then(snapshot => {
                    if (snapshot.exists()) {
                    snapshot.forEach(userSnapshot => {
                    const userData = userSnapshot.val();
                    ownerEmail = userData.email;
                });
                        // BVN exists, generate and send a 4-digit PIN to the user's email
                        const generatedPIN = Math.floor(1000 + Math.random() * 9000);

                        // Use SMTP.js to send the PIN to the user's email
                        
                       Email.send({
                SecureToken : "a8b80d30-649f-4c69-9b72-b78321598a68",
                To: ownerEmail,
                From: "bvns2002@gmail.com", // Your email address
                Subject: "BVN validation PIN",
                Body: `Your BVN validation PIN: ${generatedPIN}`
            });
            
                         // Request the user to input the PIN and proceed
                        document.getElementById("pin-input").style.display = "block"; 
                      
                    } else {
                        // BVN does not exist, inform the user
                        alert("Invalid BVN. Please check and try again.");
                    }
                })
                .catch(error => {
                    console.error("Error checking BVN: ", error);
                });
        });

        document.getElementById("validate-pin").addEventListener("click", function () {
            const userEnteredPIN = document.getElementById("pin").value;
            const userEnteredBVN = document.getElementById("user-bvn").value;

            // Fetch user information from the database
            UserdataDB.orderByChild("bvn").equalTo(parseFloat(userEnteredBVN)).once("value")
        .then(snapshot => {
            if (snapshot.exists()) {
                // BVN exists, iterate through the snapshot to find the correct user
                let userFound = false;
                snapshot.forEach(userSnapshot => {
                    const userData = userSnapshot.val();
                    if (userData.bvn === parseFloat(userEnteredBVN)) {
                        // This is the user with the matching BVN
                        userFound = true;
                        // Update HTML elements with user information
                        document.getElementById("user-name").textContent = `${userData.firstName} ${userData.lastName}`;
                        document.getElementById("user-email").textContent = userData.email;
                        document.getElementById("user-other-info").textContent = `DOB: ${userData.dob}, Gender: ${userData.gender}, Address: ${userData.address}, State of Origin: ${userData.stateOfOrigin}, State of Residence: ${userData.stateOfResidence}, Marital Status: ${userData.maritalStatus}`;
                        // Display user information
                        document.getElementById("user-info").style.display = "block";
                    }
                });

                if (!userFound) {
                    // BVN not found among the users
                    alert("BVN not found. Please check and try again.");
                }
                    } else {
                        // BVN not found, show an error message
                        alert("BVN not found. Please check and try again.");
                    }
                })
                .catch(error => {
                    console.error("Error fetching user information: ", error);
                });
                document.getElementById("bvn-validation-form").style.display = "none";
                document.getElementById("pin-input").style.display = "none";
        });
