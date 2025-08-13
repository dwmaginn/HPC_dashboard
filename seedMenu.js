'use strict';

const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

function ensureDirectoryExists(dirPath) {
	if (!fs.existsSync(dirPath)) {
		fs.mkdirSync(dirPath, { recursive: true });
	}
}

function readExistingRows(filePath) {
	if (!fs.existsSync(filePath)) return [];
	try {
		const workbook = XLSX.readFile(filePath);
		const firstSheetName = workbook.SheetNames[0];
		if (!firstSheetName) return [];
		const worksheet = workbook.Sheets[firstSheetName];
		return XLSX.utils.sheet_to_json(worksheet, { defval: '' });
	} catch (_e) {
		return [];
	}
}

function writeSampleMenu(filePath) {
	const sample = [
		{ Product: 'Indica Flower 3.5g', Description: 'Relaxing indica strain', Price: 35, Category: 'Flower' },
		{ Product: 'Sativa Pre-Roll 1g', Description: 'Uplifting sativa pre-roll', Price: 12, Category: 'Pre-Roll' },
		{ Product: 'Hybrid Vape Cart 1g', Description: 'Balanced hybrid cartridge', Price: 45, Category: 'Vape' },
		{ Product: 'CBD Tincture 500mg', Description: 'Calming CBD tincture', Price: 40, Category: 'Tincture' }
	];

	const worksheet = XLSX.utils.json_to_sheet(sample);
	const workbook = XLSX.utils.book_new();
	XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
	XLSX.writeFile(workbook, filePath);
	return sample.length;
}

function main() {
	const dataDir = path.resolve(__dirname, 'data');
	const xlsxPath = path.join(dataDir, 'LiveMenu.xlsx');

	ensureDirectoryExists(dataDir);

	const rows = readExistingRows(xlsxPath);
	if (rows.length > 0) {
		console.log(`LiveMenu.xlsx already contains ${rows.length} row(s). No changes made.`);
		process.exit(0);
	}

	const written = writeSampleMenu(xlsxPath);
	console.log(`Seeded LiveMenu.xlsx with ${written} sample product(s).`);
}

if (require.main === module) {
	main();
}


