import { mount } from '@vue/test-utils';
import BudgetTracker from '@/components/ExperTask.vue';

describe('BudgetTracker', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(BudgetTracker);
  });

//   afterEach(() => {
//     wrapper.destroy();
//   });

  it('renders the component', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('initializes with empty data', () => {
    expect(wrapper.vm.budget).toBe('');
    expect(wrapper.vm.expenseName).toBe('');
    expect(wrapper.vm.expenseAmount).toBe('');
    expect(wrapper.vm.showForm).toBe(false);
    expect(wrapper.vm.expenseList).toEqual([]);
    expect(wrapper.vm.budgetError).toBe('');
    expect(wrapper.vm.expenseNameError).toBe('');
    expect(wrapper.vm.expenseAmountError).toBe('');
    expect(wrapper.vm.errorMessage).toBe('');
  });

  it('updates the budget when an expense is added', async () => {
    wrapper.setData({ budget: 100 });
    await wrapper.vm.$nextTick();
    wrapper.find('#expense-name').setValue('Groceries');
    wrapper.find('#expense-amount').setValue(50);
    wrapper.find('form').trigger('submit');
    expect(wrapper.vm.amountLeft).toBe(50);
    expect(wrapper.vm.expenseList).toEqual([{ name: 'Groceries', amount: 50 }]);
  });

  it('deletes an expense from the list', async () => {
    wrapper.setData({
      expenseList: [{ name: 'Groceries', amount: '50' }, { name: 'Gas', amount: '30' }],
    });
    await wrapper.vm.$nextTick();
    wrapper.find('.list-group-item button').trigger('click');
    expect(wrapper.vm.expenseList).toEqual([{ name: 'Gas', amount: '30' }]);
  });

  it('validates the budget input', async () => {
    wrapper.find('#enter-budget').setValue('abc');
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.budgetError).toBe('');
  });

  it('validates the expense name input', async () => {
    wrapper.setData({ budget: 100 });
    await wrapper.vm.$nextTick();
    wrapper.find('form').trigger('submit');
    expect(wrapper.vm.expenseNameError).toBe('Expense Name is required');
  });
  

  it('validates the expense amount input', async () => {
    wrapper.setData({ budget: 100 });
    await wrapper.vm.$nextTick();
    wrapper.find('#expense-name').setValue('Groceries');
    wrapper.find('#expense-amount').setValue('');
    wrapper.find('form').trigger('submit');
    expect(wrapper.vm.expenseAmountError).toBe('Expense Amount is required');
  });

  it('displays budget exceeded error message when budget is exceeded', async () => {
    wrapper.setData({ budget: 100 });
    await wrapper.vm.$nextTick();
    wrapper.find('#expense-name').setValue('Groceries');
    wrapper.find('#expense-amount').setValue(50);
    wrapper.find('form').trigger('submit');
    wrapper.find('#expense-name').setValue('G');
    wrapper.find('#expense-amount').setValue(60);
    wrapper.find('form').trigger('submit');
    expect(wrapper.vm.errorMessage).toBe('You have used up your entire budget for the week!');
  });

  it('displays 50% budget used error message when 50% of the budget is used', async () => {
    wrapper.setData({ budget: 100 });
    await wrapper.vm.$nextTick();
    wrapper.find('#expense-name').setValue('Expense 1');
    wrapper.find('#expense-amount').setValue(50);
    wrapper.find('form').trigger('submit');
    expect(wrapper.vm.errorMessage).toBe('You have used up 50% of your entire budget for the week!');
  });
  
  it('displays 25% budget used error message when 25% of the budget is used', async () => {
    wrapper.setData({ budget: 100 });
    await wrapper.vm.$nextTick();
    wrapper.find('#expense-name').setValue('Expense 1');
    wrapper.find('#expense-amount').setValue(75);
    wrapper.find('form').trigger('submit');
    expect(wrapper.vm.errorMessage).toBe('You have used up 25% of your entire budget for the week!');
  });
  
  it('validates the form and returns true if all inputs are valid', () => {
    wrapper.setData({ budget: 100, expenseName: 'Groceries', expenseAmount: 50 });
    const isValid = wrapper.vm.validateForm();
    expect(isValid).toBe(true);
    expect(wrapper.vm.budgetError).toBe('');
    expect(wrapper.vm.expenseNameError).toBe('');
    expect(wrapper.vm.expenseAmountError).toBe('');
  });

  it('validates the form and returns false if budget input is empty', () => {
    wrapper.setData({ budget: '', expenseName: 'Groceries', expenseAmount: 50 });
    const isValid = wrapper.vm.validateForm();
    expect(isValid).toBe(false);
    expect(wrapper.vm.budgetError).toBe('Budget is required');
    expect(wrapper.vm.expenseNameError).toBe('');
    expect(wrapper.vm.expenseAmountError).toBe('');
  });
  
  it('validates the form and returns false if budget input is not a number', () => {
    wrapper.setData({ budget: 'abc', expenseName: 'Groceries', expenseAmount: 50 });
    const isValid = wrapper.vm.validateForm();
    expect(isValid).toBe(false);
    expect(wrapper.vm.budgetError).toBe('Budget must be a number');
    expect(wrapper.vm.expenseNameError).toBe('');
    expect(wrapper.vm.expenseAmountError).toBe('');
  });

  it('validates the form and returns false if expense name input is empty', () => {
    wrapper.setData({ budget: 100, expenseName: '', expenseAmount: 50 });
    const isValid = wrapper.vm.validateForm();
    expect(isValid).toBe(false);
    expect(wrapper.vm.budgetError).toBe('');
    expect(wrapper.vm.expenseNameError).toBe('Expense Name is required');
    expect(wrapper.vm.expenseAmountError).toBe('');
  });

  it('validates the form and returns false if expense amount input is empty', () => {
    wrapper.setData({ budget: 100, expenseName: 'Groceries', expenseAmount: '' });
    const isValid = wrapper.vm.validateForm();
    expect(isValid).toBe(false);
    expect(wrapper.vm.budgetError).toBe('');
    expect(wrapper.vm.expenseNameError).toBe('');
    expect(wrapper.vm.expenseAmountError).toBe('Expense Amount is required');
  });

  it('validates the form and returns false if expense amount input is not a number', () => {
    wrapper.setData({ budget: 100, expenseName: 'Groceries', expenseAmount: 'abc' });
    const isValid = wrapper.vm.validateForm();
    expect(isValid).toBe(false);
    expect(wrapper.vm.budgetError).toBe('');
    expect(wrapper.vm.expenseNameError).toBe('');
    expect(wrapper.vm.expenseAmountError).toBe('Expense Amount must be a number');
  });

  it('updates the budget and sets the error message when budget is exceeded (100% used)', () => {
    wrapper.setData({ budget: 100, expenseList: [{ name: 'Groceries', amount: 100 }] });
    wrapper.vm.updateBudget();
    expect(wrapper.vm.errorMessage).toBe('You have used up your entire budget for the week!');
  });

  it('updates the budget and sets the error message when budget is exceeded (50% used)', () => {
    wrapper.setData({ budget: 100, expenseList: [{ name: 'Groceries', amount: 50 }] });
    wrapper.vm.updateBudget();
    expect(wrapper.vm.errorMessage).toBe('You have used up 50% of your entire budget for the week!');
  });

  it('updates the budget and sets the error message when budget is exceeded (25% used)', () => {
    wrapper.setData({ budget: 100, expenseList: [{ name: 'Groceries', amount: 75 }] });
    wrapper.vm.updateBudget();
    expect(wrapper.vm.errorMessage).toBe('You have used up 25% of your entire budget for the week!');
  });

  it('updates the budget and clears the error message when budget is not exceeded', () => {
    wrapper.setData({ budget: 100, expenseList: [{ name: 'Groceries', amount: 10 }] });
    wrapper.vm.updateBudget();
    expect(wrapper.vm.errorMessage).toBe('');
  });

  it('calculates the total expense amount', () => {
    wrapper.setData({
      expenseList: [
        { name: 'Groceries', amount: 50 },
        { name: 'Dining', amount: 30 },
        { name: 'Transportation', amount: 20 },
      ],
    });
    const totalExpense = wrapper.vm.getTotalExpenseAmount();
    expect(totalExpense).toBe(100);
  });

  it('does not delete any expense if the index is out of bounds', () => {
    wrapper.setData({
      expenseList: [
        { name: 'Groceries', amount: 50 },
        { name: 'Dining', amount: 30 },
      ],
    });
    wrapper.vm.deleteExpense(5); // Index out of bounds
    expect(wrapper.vm.expenseList).toEqual([
      { name: 'Groceries', amount: 50 },
      { name: 'Dining', amount: 30 },
    ]);
  });

  it('does not delete any expense if the expense list is empty', () => {
    wrapper.setData({ expenseList: [] });
    wrapper.vm.deleteExpense(0);
    expect(wrapper.vm.expenseList).toEqual([]);
  });

  it('deletes the only expense from the expense list and updates the budget', () => {
    wrapper.setData({ budget: 100, expenseList: [{ name: 'Groceries', amount: 50 }] });
    wrapper.vm.deleteExpense(0);
    expect(wrapper.vm.expenseList).toEqual([]);
    expect(wrapper.vm.budget).toBe(100);
  });

  it('updates the remaining amount when an expense is deleted', () => {
    wrapper.setData({
      budget: 100,
      expenseList: [
        { name: 'Groceries', amount: 50 },
        { name: 'Dining', amount: 30 },
        { name: 'Transportation', amount: 20 },
      ],
    });
    wrapper.vm.deleteExpense(1); // Delete "Dining" expense (30)
    expect(wrapper.vm.getTotalExpenseAmount()).toBe(70);
  });
});
