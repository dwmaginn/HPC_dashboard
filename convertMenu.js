'use strict';

const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

function ensureDirectoryExists(filePath) {
	const dir = path.dirname(filePath);
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true });
	}
}

function convertExcelToJson({ inputXlsxPath, outputJsonPath }) {
	if (!fs.existsSync(inputXlsxPath)) {
		throw new Error(`Input Excel file not found: ${inputXlsxPath}`);
	}

	const workbook = XLSX.readFile(inputXlsxPath);
	const firstSheetName = workbook.SheetNames[0];
	if (!firstSheetName) {
		throw new Error('No sheets found in the Excel workbook.');
	}

	const worksheet = workbook.Sheets[firstSheetName];
	const rows = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

	ensureDirectoryExists(outputJsonPath);
	fs.writeFileSync(outputJsonPath, JSON.stringify(rows, null, 2), 'utf8');

	return { count: rows.length, sheet: firstSheetName };
}

function main() {
	const inputXlsxPath = path.resolve(__dirname, 'data', 'LiveMenu.xlsx');
	const outputJsonPath = path.resolve(__dirname, 'data', 'menu.json');

	try {
		const { count, sheet } = convertExcelToJson({ inputXlsxPath, outputJsonPath });
		console.log(`Converted sheet "${sheet}" to JSON with ${count} rows → ${path.relative(process.cwd(), outputJsonPath)}`);
		process.exit(0);
	} catch (error) {
		console.error('[convertMenu] Failed:', error.message);
		process.exit(1);
	}
}

if (require.main === module) {
	main();
}


