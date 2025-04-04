import { generateModels } from './connectionResolver';
import { sendMessageBroker } from './messageBroker';
import { ISchedule } from './models/definitions/schedules';

const toMoney = (value) => {
  if (!value) {
    return '-';
  }
  return new Intl.NumberFormat().format(value);
};

//document attribute fields
const fields = [
  { value: 'number', name: 'Contract Number' },
  { value: 'status', name: 'Status' },
  { value: 'description', name: 'Description' },
  { value: 'marginAmount', name: 'Margin Amount', isAmount: true },
  { value: 'leaseAmount', name: 'Lease Amount', isAmount: true },
  { value: 'feeAmount', name: 'Fee Amount', isAmount: true },
  { value: 'tenor', name: 'Tenor' },
  { value: 'interestRate', name: 'interestRate' },
  { value: 'lossPercent', name: 'lossPercent' },
  { value: 'repayment', name: 'repayment' },
  { value: 'startDate', name: 'startDate' },
  { value: 'scheduleDays', name: 'scheduleDays' },
  { value: 'insuranceAmount', name: 'insuranceAmount', isAmount: true },
  { value: 'debt', name: 'Status' },
  { value: 'debtTenor', name: 'debtTenor' },
  { value: 'customerName', name: 'Customer name' },
  { value: 'customerLastName', name: 'Customer last name' },
  { value: 'closeDate', name: 'closeDate' },
  { value: 'loanScheduleInfo', name: 'Loan Schedule Info' }
];

export default {
  types: [
    {
      type: 'loans',
      label: 'Loans'
    }
  ],

  editorAttributes: async () => {
    return fields;
  },

  replaceContent: async ({ subdomain, data: { contractId, content } }) => {
    const models = await generateModels(subdomain);
    const contractDocument = await models.Contracts.findOne({ _id: contractId }).lean();

    if (!contractDocument) return content;

    let contract = contractDocument as any;

    if (contract.customerType === 'customer') {
      const customer = await sendMessageBroker(
        {
          subdomain,
          action: 'customers.findOne',
          data: { _id: contract.customerId },
          isRPC: true
        },
        'core'
      );
      contract.customerName = customer.firstName;
      contract.customerLastName = customer.lastName;
    }

    if (contract.customerType === 'company') {
      const company = await sendMessageBroker(
        {
          subdomain,
          action: 'companies.findOne',
          data: { _id: contract.customerId },
          isRPC: true
        },
        'core'
      );

      contract.customerName = company.primaryName;
    }

    const firstSchedules = await models.FirstSchedules.find({
      contractId: contract._id
    })
      .sort({ payDate: 1 })
      .lean();
    contract.loanScheduleInfo = `
      <table>
        <tbody>
          <thead>
            <tr>
              <th>№</th>
              <th>DATE</th>
              <th>LOAN BALANCE</th>
              <th>LOAN PAYMENT</th>
              <th>INTEREST</th>
              <th>INSURANCE</th>
              <th>DEBT</th>
              <th>TOTAL</th>
            </tr>
          </thead>
          <tbody>
          ${firstSchedules
            .map(
              (row, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${row.payDate.getFullYear()}-${
                  row.payDate.getMonth() + 1
                }-${row.payDate.getDate()}</td>
                <td>${toMoney(row.balance)}</td>
                <td>${toMoney(row.payment)}</td>
                <td>${toMoney(
                  (row.interestEve || 0) + (row.interestNonce || 0)
                )}</td>
                <td>${toMoney(row.insurance)}</td>
                <td>${toMoney(row.debt)}</td>
                <td>${toMoney(row.total)}</td>
              </tr>
            `
            )
            .join('')}
          </tbody>
        </tbody>
      </table>
    `;

    var printContent = content;
    for await (const row of fields) {
      printContent = printContent.replace(
        RegExp(`{{ ${row.value} }}`, 'g'),
        row.isAmount
          ? toMoney(contract[row.value] || '')
          : contract[row.value] || ''
      );
    }

    return printContent;
  }
};
