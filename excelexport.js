/**
 * excelexport.js v0.1.1
 * https://github.com/Snack-X/excelexport.js
 * Licensed under MIT License.
 */

// base64 encode fallback
if(!window.btoa) {
	window.btoa = function(string) {
		var a, b, b1, b2, b3, b4, c, i = 0, len = string.length, max = Math.max, result = "", charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
		while(i < len) {
			a = string.charCodeAt(i++) || 0;
			b = string.charCodeAt(i++) || 0;
			c = string.charCodeAt(i++) || 0;
			if(max(a, b, c) > 0xFF) return;
			b1 = (a >> 2) & 0x3F;
			b2 = ((a & 0x3) << 4) | ((b >> 4) & 0xF);
			b3 = ((b & 0xF) << 2) | ((c >> 6) & 0x3);
			b4 = c & 0x3F;
			if (!b) b3 = b4 = 64;
			else if (!c) b4 = 64;
			result += charset.charAt(b1) + charset.charAt(b2) + charset.charAt(b3) + charset.charAt(b4);
		}
		return result;
	};
}

/**
 * excelexport constructor
 * @constructor
 * @param   {string}  element_id  id of <table> element
 * @return  {Object}              excelExport object itself
 */
excelExport = (function(element_id) {
	var table = document.getElementById(element_id);
	var data_csv, data_xls;

	var data_uri_prefix = {
		csv: "data:application/csv;base64,",
		xls: "data:application/vnd.ms-excel;base64,"
	};

	/**
	 * create <form> element to send POST request
	 * @param   {string}           action  URL of external script
	 * @return  {HTMLFormElement}          <form> element
	 */
	var create_form_dom = function(action) {
		var el = document.createElement("form");
		el.method = "POST";
		el.action = action;

		return el;
	};

	/**
	 * create hidden <input> element
	 * @param   {string}            data  value of <input> element
	 * @param   {string}            name  name of <input> element
	 * @return  {HTMLInputElement}        <input> element
	 */
	var create_input_dom = function(data, name) {
		var el = document.createElement("input");
		el.type = "hidden";
		el.name = name;
		el.value = data;

		return el;
	};

	/**
	 * download file using external script
	 * @param  {string}  server    URL of external script
	 * @param  {string}  type      file type of data (csv or xls)
	 * @param  {string}  data      data of file
	 * @param  {string}  filename  name of file
	 */
	var download_file = function(server, type, data, filename) {
		var el_form = create_form_dom(server);
		var el_type = create_input_dom(type, "type");
		var el_data = create_input_dom(data, "data");
		var el_file = create_input_dom(filename, "filename");

		el_form.appendChild(el_type);
		el_form.appendChild(el_data);
		el_form.appendChild(el_file);

		document.body.appendChild(el_form);

		el_form.submit();
	};

	/**
	 * get full data URI
	 * @param  {string}  type  type of data (csv or xls)
	 * @param  {string}  data  data
	 * @return {string}        full data URI
	 */
	var get_data_uri = function(type, data) {
		return data_uri_prefix[type] + window.btoa(unescape(encodeURIComponent(data)));
	};

	var exports = {

		/**
		 * parse table to csv data
		 * @return  {object}  excelExport object itself
		 */
		parseToCSV: function() {
			var data = [];

			for(var row = 0 ; row < table.rows.length ; row++) {
				var data_row = [];

				for(var cell = 0 ; cell < table.rows[row].cells.length ; cell++) {
					var el = table.rows[row].cells[cell];
					var content = el.innerHTML;

					content = content.replace("<br>", "\r\n");
					if(content.match(/[,\r\n]/)) {
						content = '"'+content.replace('"', '""')+'"';
					}

					data_row.push(content);

					if(el.getAttribute("colspan")) {
						var cs = el.getAttribute("colspan");
						cs = parseInt(cs, 10);
						if(cs >= 2) {
							for(var i = 0 ; i < cs-1 ; i++) {
								data_row.push("");
							}
						}
					}
				}

				data.push(data_row.join(","));
			}

			data_csv = data.join("\n");
			return this;
		},

		/**
		 * get raw csv data
		 * @return  {string}  raw csv data
		 */
		getRawCSV: function() {
			if(!data_csv) return false;

			return data_csv;
		},

		/**
		 * get data URI of csv data
		 * @return  {string}  data URI
		 */
		getCSVDataURI: function() {
			if(!data_csv) return false;

			return get_data_uri("csv", data_csv);
		},

		/**
		 * download csv file using external script
		 * @param   {string}  server    URL of external script
		 * @param   {string}  filename  name of csv file (extension's not included)
		 */
		downloadCSV: function(server, filename) {
			if(!data_csv) return false;

			download_file(server, "csv", data_csv, filename);
		},

		/**
		 * parse table to xls data
		 * @param   {string}  name of sheet which contains data
		 * @return  {object}  excelExport object itself
		 */
		parseToXLS: function(sheet_name) {
			if(!sheet_name) sheet_name = "Sheet";

			data_xls = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:excel' xmlns='http://www.w3.org/TR/REC-html40'><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>";
			data_xls += sheet_name + "</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>";
			data_xls += table.innerHTML + "</table></body></html>";

			return this;
		},

		/**
		 * get raw xls data
		 * @return  {string}  raw xls data
		 */
		getRawXLS: function() {
			if(!data_xls) return false;

			return data_xls;
		},

		/**
		 * get data URI of xls data
		 * @return  {string}  data URI
		 */
		getXLSDataURI: function() {
			if(!data_xls) return false;

			return get_data_uri("xls", data_xls);
		},

		/**
		 * download xls file using external script
		 * @param   {string}  server    URL of external script
		 * @param   {string}  filename  name of xls file (extension's not included)
		 */
		downloadXLS: function(server, filename) {
			if(!data_xls) return false;

			download_file(server, "xls", data_xls, filename);
		}

	};

	return exports;
});