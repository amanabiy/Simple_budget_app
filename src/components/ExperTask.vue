<template>
    <div class="container">
      <h1>Budget Tracker</h1>
      <div class="form-group">
        <label for="enter-budget" class="form-label">Enter Budget:</label>
        <input id="enter-budget" v-model="budget" type="number" class="form-control stylish-input" placeholder="Enter Budget" />
        <div v-if="budgetError" class="text-danger">{{ budgetError }}</div>
      </div>
      <form v-if="showForm" @submit.prevent="addExpense">
        <div class="form-group">
          <label for="expense-name" class="form-label">Expense Name:</label>
          <input id="expense-name" v-model="expenseName" type="text" class="form-control stylish-input" placeholder="Enter Expense Name" />
          <div v-if="expenseNameError" class="text-danger">{{ expenseNameError }}</div>
        </div>
        <div class="form-group">
          <label for="expense-amount" class="form-label">Expense Amount:</label>
          <input id="expense-amount" v-model="expenseAmount" type="number" class="form-control stylish-input" placeholder="Enter Expense Amount" />
          <div v-if="expenseAmountError" class="text-danger">{{ expenseAmountError }}</div>
        </div>
        <button type="submit" class="btn btn-primary btn-lg btn-block stylish-button">Add Expense</button>
      </form>
      <div class="budget-info">
        <p class="budget-label">Budget:</p>
        <p class="budget-amount">${{ budget }}</p>
        <p class="amount-left-label">Amount Left:</p>
        <p class="amount-left-amount">${{ amountLeft }}</p>
      </div>
      <ul class="list-group">
        <li v-for="(item, index) in expenseList" :key="index" class="list-group-item">
          {{ item.name }}
          <span class="badge badge-primary">${{ item.amount }}</span>
          <button class="btn btn-danger btn-sm float-right" @click="deleteExpense(index)">Delete</button>
        </li>
      </ul>
      <div v-if="errorMessage" class="text-danger">{{ errorMessage }}</div>
    </div>
  </template>
  
  <style>
  .container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  .form-label {
    font-weight: bold;
    margin-bottom: 5px;
  }
  
  .budget-label,
  .amount-left-label {
    font-weight: bold;
    display: inline-block;
    margin-right: 10px;
  }
  
  .budget-amount,
  .amount-left-amount {
    display: inline-block;
    margin-right: 20px;
  }
  
  .budget-info {
    margin-top: 20px;
    margin-bottom: 20px;
  }
  
  .list-group-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .stylish-input {
    border: none;
    border-bottom: 2px solid #007bff;
    border-radius: 0;
    box-shadow: none;
    padding: 10px 0;
    font-size: 1.2rem;
    color: #007bff;
  }
  
  .stylish-input:focus {
    outline: none;
    border-color: #0069d9;
  }
  
  .stylish-button {
    background-color: #007bff;
    border-color: #007bff;
    border-radius: 50px;
    font-size: 1.2rem;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 2px;
  }
  
  .stylish-button:hover {
    background-color: #0069d9;
    border-color: #0062cc;
  }
  
  .btn-danger {
    background-color: #dc3545;
    border-color: #dc3545;
  }
  
  .btn-danger:hover {
    background-color: #c82333;
    border-color: #bd2130;
  }
  
  .text-danger {
    color: red;
  }
  </style>
  
  
  <script>
  export default {
    data() {
      return {
        budget: '',
        expenseName: '',
        expenseAmount: '',
        showForm: false,
        expenseList: [],
        budgetError: '',
        expenseNameError: '',
        expenseAmountError: '',
        errorMessage: '',
      };
    },
    computed: {
      amountLeft() {
        return this.budget - this.getTotalExpenseAmount();
      },
    },
    methods: {
      addExpense() {
        if (this.validateForm()) {
          const expense = {
            name: this.expenseName,
            amount: this.expenseAmount,
          };
          this.expenseList.push(expense);
          this.updateBudget();
          this.expenseName = '';
          this.expenseAmount = '';
        }
      },
      deleteExpense(index) {
        this.expenseList.splice(index, 1);
        this.updateBudget();
      },
      validateForm() {
        let isValid = true;
        if (this.budget === '') {
          this.budgetError = 'Budget is required';
          isValid = false;
        } else if (isNaN(this.budget)) {
          this.budgetError = 'Budget must be a number';
          isValid = false;
        } else {
          this.budgetError = '';
        }
        if (this.expenseName === '') {
          this.expenseNameError = 'Expense Name is required';
          isValid = false;
        } else {
          this.expenseNameError = '';
        }
        if (this.expenseAmount === '') {
          this.expenseAmountError = 'Expense Amount is required';
          isValid = false;
        } else if (isNaN(this.expenseAmount)) {
          this.expenseAmountError = 'Expense Amount must be a number';
          isValid = false;
        } else {
          this.expenseAmountError = '';
        }
        return isValid;
      },
      updateBudget() {
        const remaining = this.budget - this.getTotalExpenseAmount();
        this.checkBudget(remaining);
      },
      checkBudget(budget) {
        const initialBudget = Number(this.budget);
        if (budget <= 0) {
          this.errorMessage = 'You have used up your entire budget for the week!';
        }
        else if (budget <= 0.25 * initialBudget) {
          this.errorMessage = 'You have used up 25% of your entire budget for the week!';
        }
        else if (budget <= 0.5 * initialBudget) {
          this.errorMessage = 'You have used up 50% of your entire budget for the week!';
        }
        else {
            this.errorMessage = '';
        }


      },
      getTotalExpenseAmount() {
        return this.expenseList.reduce((total, item) => total + Number(item.amount), 0);
      },
    },
    watch: {
      budget() {
        this.showForm = true;
      },
    },
  };
  </script>