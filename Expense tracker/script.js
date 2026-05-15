// DOM elements
const balanceElement = document.getElementById("balance");
const incomeAmountElement = document.getElementById("income-amount");
const expenseAmountElement = document.getElementById("expense-amount");
const transactionListElement = document.getElementById("transaction-list");
const transactionFormElement = document.getElementById("transaction-form");
const descriptionElement = document.getElementById("description");
const amountElement = document.getElementById("amount");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

transactionFormElement.addEventListener("submit", addTransaction);

function addTransaction(e) {
  // stops browser from refreshing page
  e.preventDefault();

  // Getting the form values entered
  const description = descriptionElement.value.trim();
  const amount = parseFloat(amountElement.value);

  transactions.push({
    id: Date.now(),
    description: description,
    amount: amount,
  });

  localStorage.setItem("transactions", JSON.stringify(transactions));

  updateTransactionList();
  updateSummary();

  transactionFormElement.reset();
}

function updateTransactionList() {
  transactionListElement.innerHTML = "";

  const sortedTransactions = [...transactions].reverse();

  sortedTransactions.forEach((transaction) => {
    const transactionEl = createTransactionElement(transaction);
    transactionListElement.appendChild(transactionEl);
  });
}

function createTransactionElement(transaction) {
  const li = document.createElement("li");
  li.classList.add("transaction");
  li.classList.add(
    transaction.amount > 0 ? "transaction-income" : "transaction-expense",
  );

  li.innerHTML = `
    <span>${transaction.description}</span>
    <span>${formatCurrency(transaction.amount)}
    <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
    </span>
    `;
  return li;
}

function updateSummary() {
    const balance = transactions.reduce(
        (acc, transaction) => acc + transaction.amount, 0);

    const income = transactions.filter(transaction => transaction.amount > 0)
    .reduce((acc, transaction) => acc + transaction.amount, 0);

    const expenses = transactions.filter(transaction => transaction.amount < 0)
    .reduce((acc, transaction) => acc + transaction.amount, 0);

    // update the user interface
    balanceElement.textContent = formatCurrency(balance);
    incomeAmountElement.textContent = formatCurrency(income);
    expenseAmountElement.textContent = formatCurrency(expenses);
}

function formatCurrency(number) {
    return new Intl.NumberFormat("en-UK", {
        style: "currency",
        currency: "GBP"
    }).format(number);
}

function removeTransaction(id) {
    // select transaction we want to delete
    transactions = transactions.filter(transaction => transaction.id !== id)

    localStorage.setItem("transactions", JSON.stringify(transactions));

    updateTransactionList();
    updateSummary();
}

// gets the latest transaction and summary when page is opened
updateTransactionList();
updateSummary();
