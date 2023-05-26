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
    box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  .form-label {
    font-weight: bold;
    margin-bottom: 5px;
  }

  button {
    border: none;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
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
    margin: 10px;
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

/* CSS */
.stylish-button {
  background-image: linear-gradient(92.88deg, #455EB5 9.16%, #5643CC 43.89%, #673FD7 64.72%);
  border-radius: 8px;
  border-style: none;
  box-sizing: border-box;
  color: #FFFFFF;
  cursor: pointer;
  flex-shrink: 0;
  font-family: "Inter UI","SF Pro Display",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen,Ubuntu,Cantarell,"Open Sans","Helvetica Neue",sans-serif;
  font-size: 16px;
  font-weight: 500;
  height: 4rem;
  padding: 0 1.6rem;
  text-align: center;
  text-shadow: rgba(0, 0, 0, 0.25) 0 3px 8px;
  transition: all .5s;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
}

.stylish-button:hover {
  box-shadow: rgba(80, 63, 205, 0.5) 0 1px 30px;
  transition-duration: .1s;
}

@media (min-width: 768px) {
  .stylish-button {
    padding: 0 2.6rem;
  }
}

/* Hello */

  
  .btn-danger {
    background-color: #dc3545;
    color: #FFFFFF;
    font-weight: bold;
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
          this.errorMessage = 'You have used up 75% of your entire budget for the week!';
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
        this.updateBudget();
      },
    },
  };
  </script>