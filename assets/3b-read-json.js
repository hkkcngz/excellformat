document.getElementById("demo").onchange = evt => {
  // (A) NEW FILE READER
  var reader = new FileReader();

  // (B) ON FINISH LOADING
  reader.addEventListener("loadend", evt => {
    // (B1) GET THE FIRST WORKSHEET
    var workbook = XLSX.read(evt.target.result, {type: "binary"}),
        worksheet = workbook.Sheets[workbook.SheetNames[0]],
        range = XLSX.utils.decode_range(worksheet["!ref"]);

    // (B2) READ HEADER ROW
    var data = {}, keys = [];
    for (let col=range.s.c; col<=range.e.c; col++) {
      let cell = worksheet[XLSX.utils.encode_cell({r:0, c:col})];
      data[cell.v] = [];
      keys.push(cell.v);
    }

    // (B3) READ DATA ROWS
    for (let row=range.s.r + 1; row<=range.e.r; row++) {
      for (let col=range.s.c; col<=range.e.c; col++) {
        let cell = worksheet[XLSX.utils.encode_cell({r:row, c:col})];
        data[keys[col]].push(cell.v);
      }
    }

    // (B4) JSON ENCODE
    data = JSON.stringify(data);
    console.log(data);
  });

  // (C) START - READ SELECTED EXCEL FILE
  reader.readAsArrayBuffer(evt.target.files[0]);
};