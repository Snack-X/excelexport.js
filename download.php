<?php
/**
 * excelexport.js v0.1.0
 * https://github.com/Snack-X/excelexport.js
 * Licensed under MIT License.
 */

if($_POST["type"] == "csv") {
	header("Content-Type: application/csv");
}
else if($_POST["type"] == "xls") {
	header("Content-Type: application/vnd.ms-excel");
}

header("Content-Disposition: attachment; filename=\"{$_POST["filename"]}\"");

echo $_POST["data"];