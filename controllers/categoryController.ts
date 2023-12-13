import * as fs from 'fs';

const dataPath: string = './model/category.json';

export function saveCategoryData(data: JSON) {
    const stringifyData = JSON.stringify(data);
    fs.writeFileSync(dataPath, stringifyData);
}

export function getCategoryData(): string {
    const jsonData = fs.readFileSync(dataPath);
    return jsonData.toString();
}
