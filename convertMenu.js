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
	const sheetNames = workbook.SheetNames || [];
	if (sheetNames.length === 0) {
		throw new Error('No sheets found in the Excel workbook.');
	}

	// Aggregate rows from all sheets to avoid missing products split across sheets
	const aggregated = [];
	for (const sheetName of sheetNames) {
		const worksheet = workbook.Sheets[sheetName];
		if (!worksheet) continue;
		const rows = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
		for (const row of rows) {
			// Filter out rows that are entirely empty strings
			const values = Object.values(row || {});
			const isAllEmpty = values.length === 0 || values.every(v => String(v).trim() === '');
			if (!isAllEmpty) aggregated.push(row);
		}
	}

	ensureDirectoryExists(outputJsonPath);
	fs.writeFileSync(outputJsonPath, JSON.stringify(aggregated, null, 2), 'utf8');

	return { count: aggregated.length, sheet: sheetNames.join(', ') };
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


