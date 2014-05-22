<?php
if($_POST["type"] == "csv") {
	header("Content-Type: application/csv");
}
else if($_POST["type"] == "xls") {
	header("Content-Type: application/vnd.ms-excel");
}

header("Content-Disposition: attachment; filename=\"{$_POST["filename"]}\"");

echo $_POST["data"];