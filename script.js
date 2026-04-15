// Apnar folder-e thaka image-er name gulo ekhane likhun
const images = [
    "nur1.jpg",  // Prothom image
    "nur2.jpg", // Ditiyo image (Ei name file thakte hobe)
    "nur3.jpg", // Tritiyo image
    "nur4.jpg",
    "nur5.jpg",
    "nur6.jpg",
    "nur7.jpg"
];

let currentIndex = 0;
const imgElement = document.getElementById("slider-img");

function changeImage() {
    if (imgElement) {
        // 1. Prothome image-tike invisible kora (Fade out)
        imgElement.classList.add("fade-out");

        setTimeout(() => {
            // 2. Index update kora
            currentIndex = (currentIndex + 1) % images.length;
            
            // 3. Notun image-er path set kora
            imgElement.src = images[currentIndex];

            // 4. Notun image ashar por abar drishshoman kora (Fade in)
            imgElement.classList.remove("fade-out");
        }, 1000); // 1 second lagbe fade hote
    }
}

// Protich 5 second por por change hobe
setInterval(changeImage, 5000);



// users array from localStorage
let users = JSON.parse(localStorage.getItem("users")) || [];

// Automatically fill Name when account number typed
document.getElementById("transAccNumber").addEventListener("input", function(){
    let acc = this.value;
    let user = users.find(u => u.accNumber === acc);
    if(user){
        document.getElementById("transName").value = user.name;
    } else {
        document.getElementById("transName").value = "";
    }
});

// Create Account
function createAccount(){
    let name = document.getElementById("accName").value;
    let accNumber = document.getElementById("accNumber").value;
    let pass = document.getElementById("accPass").value;

    if(!name || !accNumber || !pass){
        document.getElementById("signupMsg").innerText = "Fill all fields";
        return;
    }

    if(users.find(u => u.accNumber === accNumber)){
        document.getElementById("signupMsg").innerText = "Account already exists";
        return;
    }

    // Add new account at the beginning (newest on top)
    users.unshift({
        name,
        accNumber,
        pass,
        balance: 0,
        transactions: [],
        lastTime: "-"
    });

    localStorage.setItem("users", JSON.stringify(users));
    document.getElementById("signupMsg").innerText = "Account Created";

    showAccountSummary();

    // Clear inputs after creating
    document.getElementById("accName").value = "";
    document.getElementById("accNumber").value = "";
    document.getElementById("accPass").value = "";
}

// Add Transaction Function
function addTransaction() {
    let acc = document.getElementById("transAccNumber").value;
    let amount = document.getElementById("transAmount").value;
    let type = document.getElementById("transType").value;
    
    // global 'users' array theke user khunje ber kora
    let user = users.find(u => u.accNumber === acc);  

    // validation checks
    if (!user) {  
        alert("Account not found");  
        return;  
    }  
    if (!amount || amount <= 0 || !type) {  
        alert("Please enter a valid amount and select type");  
        return;  
    }  

    let numAmount = Number(amount);

    // Withdraw-er somoy balance check (Extra Security)
    if (type === "withdraw" && user.balance < numAmount) {
        alert("Insufficient balance!");
        return;
    }

    let time = new Date().toLocaleString();  

    // Transaction object
    let t = {  
        accNumber: acc,  
        name: user.name,  
        amount: numAmount,  
        type: type,  
        time: time  
    };  

    // User-er transaction history-te add kora
    user.transactions.unshift(t);  

    // Balance update
    if (type === "deposit") {  
        user.balance += numAmount;  
    } else {  
        user.balance -= numAmount;  
    }  

    user.lastTime = time;  

    // LocalStorage update
    localStorage.setItem("users", JSON.stringify(users));  

    // UI Refresh
    showTransactions();  
    showAccountSummary();
    

    // --- AUTO CLEAR FIELDS ---
    // Transaction add hoye jaoar por nichei field gulo khali hobe
    document.getElementById("transAccNumber").value = "";  
    document.getElementById("transName").value = "";  
    document.getElementById("transAmount").value = "";  
    document.getElementById("transType").value = "";  

    alert("Transaction Successful!");
}

// Show Transactions (newest first)
function showTransactions(){
    let table = document.getElementById("transactionList");
    table.innerHTML = "";
    users.forEach(u => {
        u.transactions.forEach(t => {
            let sign = t.type === "deposit" ? "+" : "-";
            table.innerHTML += `
            <tr>
                <td>${t.accNumber}</td>
                <td>${t.name}</td>
                <td>${sign}${t.amount}</td>
                <td>${t.type}</td>
                <td>${t.time}</td>
            </tr>
            `;
        });
    });
}

// Show Account Summary (newest first) + Delete
function showAccountSummary(){
    let table = document.getElementById("accountSummary");
    table.innerHTML = "";
    users.forEach(u => {
        table.innerHTML += `
        <tr>
            <td>${u.accNumber}</td>
            <td>${u.name}</td>
            <td>${u.balance}</td>
            <td>${u.lastTime}</td>
            <td><button onclick="deleteAccount('${u.accNumber}')">Delete</button></td>
        </tr>
        `;
    });
}

// Delete Account
function deleteAccount(accNumber){
    if(confirm("Are you sure you want to delete this account?")){
        users = users.filter(u => u.accNumber !== accNumber);
        localStorage.setItem("users", JSON.stringify(users));
        showAccountSummary();
        showTransactions();
    }
}

// Toggle Account Summary
function toggleAccounts(){
    let table = document.getElementById("accountTable");
    if(table.style.display === "none"){
        table.style.display = "table";
        showAccountSummary();
    } else {
        table.style.display = "none";
    }
}

// Toggle Transactions
function toggleTransactions(){
    let table = document.getElementById("tableArea");
    if(table.style.display === "none"){
        table.style.display = "block";
        showTransactions();
    } else {
        table.style.display = "none";
    }
}

// Search Transactions
function searchTransaction(){
    let search = document.getElementById("search").value.toLowerCase();
    let table = document.getElementById("transactionList");
    table.innerHTML = "";
    users.forEach(u => {
        u.transactions.forEach(t => {
            if(t.name.toLowerCase().includes(search) || t.accNumber.includes(search)){
                let sign = t.type === "deposit" ? "+" : "-";
                table.innerHTML += `
                <tr>
                    <td>${t.accNumber}</td>
                    <td>${t.name}</td>
                    <td>${sign}${t.amount}</td>
                    <td>${t.type}</td>
                    <td>${t.time}</td>
                </tr>
                `;
            }
        });
    });
}

// Search Account
function searchAccount() {
    let search = document.getElementById("search").value.toLowerCase();
    let table = document.getElementById("AccountList");

    table.innerHTML = "";

    users.forEach(u => {
        u.Account.forEach(t => {

            if (
                t.name.toLowerCase().includes(search) ||
                t.accNumber.toString().includes(search)
            ) {

                let sign = t.type === "deposit" ? "+" : "-";

                table.innerHTML += `
                <tr>
                    <td>${t.accNumber}</td>
                    <td>${t.name}</td>
                    <td>${sign}${t.balance}</td>
                    <td>${t.lastTime}</td>
                    <td>${t.action}</td>
                </tr>
                `;
            }
        });
    });
}

// Download JPG
function downloadJPG(){
    let table = document.getElementById("tableArea");
    html2canvas(table).then(function(canvas){
        let link = document.createElement("a");
        link.download = "bank_report.jpg";
        link.href = canvas.toDataURL("image/jpeg");
        link.click();
    });
}

// Print Accounts
function printAccounts(){
    let content = document.getElementById("tableArea").innerHTML;
    let win = window.open("");
    win.document.write(content);
    win.print();
    win.close();
}



// Initial load
showTransactions();
showAccountSummary();