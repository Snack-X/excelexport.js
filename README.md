# excelexport.js

Export your `<table>` to CSV or XLS, within your browser (or another external script).

## Usage

```html
<table id="table">
  <tr><th>Column 1</th><th>Column 2</th></tr>
  <tr><td>100</td><td>200</td></tr>
  <tr><td>1000</td><td>2000</td></tr>
</table>
```

### `excelExport(table_id)`

- `table_id` : id of table element (e.g. "table")

Constructs `excelExport` object.

### `.parseToCSV()`

Parses table for CSV. `colspan` is supported. `rowspan` is not supported.

### `.getRawCSV()`

Returns raw CSV data as string.

### `.getCSVDataURI()`

Returns data URI for CSV.

### `.downloadCSV(server, filename)`

- `server` : URL of external script
- `filename` : Filename of downloaded file

Downloads CSV file via external script. It will send POST request to `server`. Sample script is included (`download.php`).

### `.parseToXLS(sheet_name)`

- `sheet_name` : Name of excel sheet

Parses table for XLS.

### `.getRawXLS()`

Returns raw XLS data as string.

### `.getXLSDataURI()`

Returns data URI for XLS.

### `.downloadXLS(server, filename)`

- `server` : URL of external script
- `filename` : Downloaded file's name

Downloads XLS file via external script.