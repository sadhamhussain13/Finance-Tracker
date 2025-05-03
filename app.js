// let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// function addTransaction() {
//   const desc = document.getElementById("description").value;
//   const amount = parseFloat(document.getElementById("amount").value);
//   const type = document.getElementById("type").value;

//   if (!desc || !amount || amount <= 0) {
//     alert("Please enter valid data");
//     return;
//   }

//   const transaction = {
//     id: Date.now(),
//     description: desc,
//     amount,
//     type,
//   };

//   transactions.push(transaction);
//   localStorage.setItem("transactions", JSON.stringify(transactions));
//   updateUI();
//   clearForm();
// }

// function deleteTransaction(id) {
//   transactions = transactions.filter(tx => tx.id !== id);
//   localStorage.setItem("transactions", JSON.stringify(transactions));
//   updateUI();
// }

// function clearForm() {
//   document.getElementById("description").value = "";
//   document.getElementById("amount").value = "";
//   document.getElementById("type").value = "income";
// }

// function updateUI() {
//   const tbody = document.querySelector("#transactionTable tbody");
//   tbody.innerHTML = "";

//   let income = 0, expense = 0;
//   let categoryMap = {};

//   transactions.forEach(tx => {
//     const row = document.createElement("tr");
//     row.innerHTML = `
//       <td>${tx.description}</td>
//       <td>₹${tx.amount.toFixed(2)}</td>
//       <td>${tx.type}</td>
//       <td><button onclick="deleteTransaction(${tx.id})">❌</button></td>
//     `;
//     tbody.appendChild(row);

//     if (tx.type === "income") income += tx.amount;
//     else {
//       expense += tx.amount;
//       // group by description as a category
//       categoryMap[tx.description] = (categoryMap[tx.description] || 0) + tx.amount;
//     }
//   });

//   document.getElementById("totalIncome").innerText = income.toFixed(2);
//   document.getElementById("totalExpense").innerText = expense.toFixed(2);
//   document.getElementById("balance").innerText = (income - expense).toFixed(2);

//   drawChart(categoryMap);
// }

// let chart;
// function drawChart(dataObj) {
//   const labels = Object.keys(dataObj);
//   const data = Object.values(dataObj);

//   const ctx = document.getElementById("expenseChart").getContext("2d");
//   if (chart) chart.destroy();

//   chart = new Chart(ctx, {
//     type: "pie",
//     data: {
//       labels: labels,
//       datasets: [{
//         label: "Expense by Category",
//         data: data,
//         backgroundColor: [
//           "#f44336", "#2196f3", "#4caf50", "#ff9800", "#9c27b0", "#00bcd4"
//         ],
//         borderColor: "#fff",
//         borderWidth: 1,
//       }]
//     },
//     options: {
//       responsive: true,
//       plugins: {
//         legend: { position: "top" },
//         title: { display: true, text: "Your Expenses Breakdown" }
//       }
//     }
//   });
// }

// // Initial render
// updateUI();
// document.getElementById("addTransaction").addEventListener("click", addTransaction);
// document.getElementById("clearForm").addEventListener("click", clearForm);
// document.getElementById("type").add
// EventListener("change", function() {
//   const type = this.value;
//   document.getElementById("amount").placeholder = type === "income" ? "Enter Income Amount" : "Enter Expense Amount";
// });
// document.getElementById("description").addEventListener("input", function() {
//   this.value = this.value.replace(/[^a-zA-Z0-9 ]/g, "");
// });
// document.getElementById("amount").addEventListener("input", function() {
//   this.value = this.value.replace(/[^0-9.]/g, "");
// });




let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

function addTransaction() {
  const desc = document.getElementById("description").value;
  const amount = parseFloat(document.getElementById("amount").value);
  const type = document.getElementById("type").value;

  if (!desc || !amount || amount <= 0) {
    alert("Please enter valid data");
    return;
  }

  const transaction = {
    id: Date.now(),
    description: desc,
    amount,
    type,
  };

  transactions.push(transaction);
  localStorage.setItem("transactions", JSON.stringify(transactions));
  updateUI();
  clearForm();

  // 🔗 Send to Google Sheets
  fetch("https://script.google.com/macros/s/AKfycby8Fiz5446hUMoCXYVhKdy7u_GA_aHFYD73zQrdYuap8yX6aX7UNVRFWlObOkrlpDb0/exec", {
    method: "POST",
    body: JSON.stringify(transaction),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(res => console.log("Saved to Google Sheets"))
    .catch(err => console.error("Error saving to Google Sheets:", err));
}

function deleteTransaction(id) {
  transactions = transactions.filter(tx => tx.id !== id);
  localStorage.setItem("transactions", JSON.stringify(transactions));
  updateUI();
}

function clearForm() {
  document.getElementById("description").value = "";
  document.getElementById("amount").value = "";
  document.getElementById("type").value = "income";
}

function updateUI() {
  const tbody = document.querySelector("#transactionTable tbody");
  tbody.innerHTML = "";

  let income = 0, expense = 0;
  let categoryMap = {};

  transactions.forEach(tx => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${tx.description}</td>
      <td>₹${tx.amount.toFixed(2)}</td>
      <td>${tx.type}</td>
      <td><button onclick="deleteTransaction(${tx.id})">❌</button></td>
    `;
    tbody.appendChild(row);

    if (tx.type === "income") income += tx.amount;
    else {
      expense += tx.amount;
      categoryMap[tx.description] = (categoryMap[tx.description] || 0) + tx.amount;
    }
  });

  document.getElementById("totalIncome").innerText = income.toFixed(2);
  document.getElementById("totalExpense").innerText = expense.toFixed(2);
  document.getElementById("balance").innerText = (income - expense).toFixed(2);

  drawChart(categoryMap);
}

let chart;
function drawChart(dataObj) {
  const labels = Object.keys(dataObj);
  const data = Object.values(dataObj);

  const ctx = document.getElementById("expenseChart").getContext("2d");
  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: labels,
      datasets: [{
        label: "Expense by Category",
        data: data,
        backgroundColor: [
          "#f44336", "#2196f3", "#4caf50", "#ff9800", "#9c27b0", "#00bcd4"
        ],
        borderColor: "#fff",
        borderWidth: 1,
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "top" },
        title: { display: true, text: "Your Expenses Breakdown" }
      }
    }
  });
}

// 📦 Download Report
function downloadReport() {
  let csv = "Description,Amount,Type\n";
  transactions.forEach(tx => {
    csv += `${tx.description},${tx.amount},${tx.type}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "finance_report.csv";
  a.click();
}



// Initial render
updateUI();

// Optional: Enhanced user experience listeners
document.getElementById("description").addEventListener("input", function () {
  this.value = this.value.replace(/[^a-zA-Z0-9 ]/g, "");
});

document.getElementById("amount").addEventListener("input", function () {
  this.value = this.value.replace(/[^0-9.]/g, "");
});

document.getElementById("type").addEventListener("change", function () {
  const type = this.value;
  document.getElementById("amount").placeholder = type === "income"
    ? "Enter Income Amount"
    : "Enter Expense Amount";
});
