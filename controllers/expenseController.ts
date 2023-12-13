import * as fs from 'fs';

const dataPath: string = './model/expense.json';

export function saveExpenseData(data: JSON) {
    const stringifyData = JSON.stringify(data);
    fs.writeFileSync(dataPath, stringifyData);
}

export function getExpenseData(): string {
    const jsonData = fs.readFileSync(dataPath);
    return jsonData.toString();
}
