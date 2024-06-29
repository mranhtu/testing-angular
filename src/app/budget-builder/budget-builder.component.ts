import {Component} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {NgForOf, NgIf, NgStyle} from "@angular/common";
import {TYPE_SELECTED} from "./bugget-builder-const";

@Component({
  selector: 'app-budget-builder',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    NgForOf,
    NgStyle
  ],
  templateUrl: './budget-builder.component.html',
  styleUrl: './budget-builder.component.scss'
})

export class BudgetBuilderComponent {
  startMonth: Date = new Date();
  endMonth: Date | undefined;

  months: string[] = [];
  rows: any[] = [];

  incomes: any[] = [
    {label: 'Sales', value: 0},
    {label: 'Commission', value: 0},
    {label: 'Training', value: 0},
    {label: 'Consulting', value: 0},
  ];
  operationalExpenses: any[] = [
    {label: 'Management Fees', value: 0},
    {label: 'Cloud Hosting', value: 0},
  ];
  expenses: any[] = [
    {label: 'Sub Total', value: 0},
    {label: 'Full Time Dev Salaries', value: 0},
    {label: 'Part Time Dev Salaries', value: 0},
    {label: 'Remote Salaries', value: 0},
  ];
  overallTotalsIncome: any = {};
  overallTotalsExpenses: any = {};
  overallTotalsOperationalExpenses: any = {};
  overallTotal: any;

  showPopup: boolean = false;
  popupStyle: any = {};
  valueApplied: any;
  rowSelected: any;
  type: 'INCOME' | 'OPERATIONAL_EXPENSE' | 'EXPENSE' = 'INCOME';
  typeSelected = TYPE_SELECTED;


  ngOnInit() {
  }

  generateTable() {
    if (!this.startMonth || !this.endMonth) {
      alert('Please select start month and end month');
      return;
    }

    const start = new Date(this.startMonth);
    const end = new Date(this.endMonth);
    if (start > end) {
      alert('Start month must be before end month');
      return;
    }
    let currentDate = new Date(start);
    this.months = [];
    while (currentDate <= end) {
      this.months.push(new Intl.DateTimeFormat('en-US',
        {month: 'long', year: 'numeric'}).format(currentDate));
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
    // gen children for income
    this.incomes.forEach(income => {
      income.children = this.months.map(month => {
        return {month: month, value: 0};
      })
    });
    this.operationalExpenses.forEach(expense => {
      expense.children = this.months.map(month => {
        return {month: month, value: 0};
      })
    });
    this.expenses.forEach(expense => {
      expense.children = this.months.map(month => {
        return {month: month, value: 0};
      })
    });

    this.sumTotalIncome();
    this.sumTotalOperationalExpenses();
    this.sumTotalExpenses();
  }

  addIncomes() {
    this.incomes.push(
      {
        label: 'New Income',
        value: 0, children:
          this.months.map(month => {
            return {month: month, value: 0};
          })
      }
    );
  }

  addOperationalExpensesCategory() {
    this.operationalExpenses.push(
      {
        label: 'New Operational Expense',
        value: 0, children:
          this.months.map(month => {
            return {month: month, value: 0};
          })
      }
    );
  }

  addExpensesCategory() {
    this.expenses.push(
      {
        label: 'New Expense',
        value: 0, children:
          this.months.map(month => {
            return {month: month, value: 0};
          })
      }
    );
  }

  onChangeDate() {

  }

  updateTotals(type: any) {
    if (type === this.typeSelected.INCOME) {
      this.sumTotalIncome();
    } else if (type === this.typeSelected.OPERATIONAL_EXPENSE) {
      this.sumTotalOperationalExpenses();
    } else if (type === this.typeSelected.EXPENSE) {
      this.sumTotalExpenses();
    }
  }

  sumTotalIncome() {
    this.overallTotalsIncome = {};
    this.incomes.forEach(income => {
      income.children.forEach((item: any) => {
        this.overallTotalsIncome[item.month] = (this.overallTotalsIncome[item.month] || 0) + (parseFloat(item.value) || 0);
      });
    });
  }

  sumTotalOperationalExpenses() {
    this.overallTotalsOperationalExpenses = {};
    this.operationalExpenses.forEach(expense => {
      expense.children.forEach((item: any) => {
        this.overallTotalsOperationalExpenses[item.month] = (this.overallTotalsOperationalExpenses[item.month] || 0) + (parseFloat(item.value) || 0);
      });
    });
  }

  sumTotalExpenses() {
    this.overallTotalsExpenses = {};
    this.expenses.forEach(expense => {
      expense.children.forEach((item: any) => {
        this.overallTotalsExpenses[item.month] = (this.overallTotalsExpenses[item.month] || 0) + (parseFloat(item.value) || 0);
      });
    });
  }

  sumAllExpenses(month: any) {
    if (month) {
      return (this.overallTotalsExpenses[month] || 0) + (this.overallTotalsOperationalExpenses[month] || 0);
    }
  }

  onRightClick(event: any, row: any, month: any, typeSelected: any) {
    event.preventDefault();
    this.valueApplied = month.value;
    this.rowSelected = row;
    this.type = typeSelected;
    this.popupStyle = {
      top: `${event.clientY}px`,
      left: `${event.clientX}px`,
      display: 'flex'
    };
    this.showPopup = true;
  }

  applyToAll() {
    this.incomes.forEach(income => {
      income.children.forEach((item: any) => {
        item.value = this.valueApplied;
      });
    })
    this.expenses.forEach(expense => {
      expense.children.forEach((item: any) => {
        item.value = this.valueApplied;
      });
    });
    this.operationalExpenses.forEach(expense => {
      expense.children.forEach((item: any) => {
        item.value = this.valueApplied;
      });
    });
    this.sumTotalIncome();
    this.sumTotalOperationalExpenses();
    this.sumTotalExpenses();
    this.showPopup = false;
  }

  deleteCategory() {
    if (this.type === 'INCOME') {
      const index = this.incomes.indexOf(this.rowSelected);
      if (index > -1) {
        this.incomes.splice(index, 1);
      }
    } else if (this.type === 'OPERATIONAL_EXPENSE') {
      const index = this.operationalExpenses.indexOf(this.rowSelected);
      if (index > -1) {
        this.operationalExpenses.splice(index, 1);
      }
    } else if (this.type === 'EXPENSE') {
      const index = this.expenses.indexOf(this.rowSelected);
      if (index > -1) {
        this.expenses.splice(index, 1);
      }
    }
    this.sumTotalIncome();
    this.showPopup = false;
  }
}
