$(function() {
	var ee = excelExport("content-table").parseToCSV().parseToXLS("excelexport sheet");

	$(".dl-csv").click(function() {
		location.href = ee.getCSVDataURI();
	});
	$(".dl-csv-ext").click(function() {
		ee.downloadCSV("http://korsnack.kr/excelexport/download.php", "excelexport.csv");
	});
	$(".dl-xls").click(function() {
		location.href = ee.getXLSDataURI();
	});
	$(".dl-xls-ext").click(function() {
		ee.downloadXLS("http://korsnack.kr/excelexport/download.php", "excelexport.xls");
	});
});