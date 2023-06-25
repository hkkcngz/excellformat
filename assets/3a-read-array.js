var allData, isNCN;


document.getElementById("demo").onchange = evt => {

  let files = evt.target.files
  let fileName = files[0].name
  let extension = fileName.substr(fileName.lastIndexOf('.') + 1)
  isNCN = extension === "NCN" ? true : false;

  // (A) NEW FILE READER
  var reader = new FileReader();

  // (B) ON FINISH LOADING
  reader.addEventListener("loadend", evt => {
    // (B1) GET THE FIRST WORKSHEET
    var workbook = XLSX.read(evt.target.result, {type: "binary"}),
        worksheet = workbook.Sheets[workbook.SheetNames[0]],
        range = XLSX.utils.decode_range(worksheet["!ref"]);

    // (B2) READ CELLS IN ARRAY
    var data = [];
    for (let row=range.s.r; row<=range.e.r; row++) {
      let i = data.length;
      data.push([]);
      for (let col=range.s.c; col<=range.e.c; col++) {
        let cell = worksheet[XLSX.utils.encode_cell({r:row, c:col})];
        data[i].push(cell.v);
      }
    }
    console.log(data);
    allData = data;

    if(isNCN) {
      for (let i = 0; i < allData.length; i++) {
        allData[i] = allData[i][0].split(" ");
      }
    }

    for (let i = 0; i < allData[0].length; i++) {
      const element = allData[0][i];
      console.log(element)
      selectColumn.innerHTML += '<div class="custom-control custom-radio custom-control-inline"><input type="radio" class="custom-control-input" name="column" id="column-'+i+'" placeholder="'+ element +'" value="'+i+'" /> <label class="custom-control-label" for="column-'+i+'">'+element+'</label></div>'
    }

  });

  // (C) START - READ SELECTED EXCEL FILE
  reader.readAsArrayBuffer(evt.target.files[0]);
};

/*
<div class="custom-control custom-radio custom-control-inline">
  <input type="radio" id="customRadioInline1" name="customRadioInline" class="custom-control-input">
  <label class="custom-control-label" for="customRadioInline1">Toggle this custom radio</label>
</div>
*/
var convertedArrays;
function bringColumn(data, column) { // allData
  previewData.innerHTML = "";
  outputData.innerHTML = "";
  for (let i = 0; i < data.length; i++) {
    const element = data[i][column];
    previewData.innerHTML += element + '\n';

    data[i].push("\"" + convert(element) + "\"");
    convertedArrays = data;
    outputData.innerHTML += convert(element) + '\n';
  }
}

btnBringColumns.addEventListener("click", () => {
  let checkRadio = document.querySelector('input[name="column"]:checked');
  console.log(checkRadio.value);
  if(checkRadio != null) {
    bringColumn(allData, checkRadio.value)
  }
});

function convert(num) {
  let newNumb, lastThree, firstPart

  newNumb = num.replaceAll(".", "")
  if (newNumb.length < 9) {
      newNumb += "0".repeat(9 - newNumb.length)
  }

  lastThree = newNumb.slice(-3)
  firstPart = newNumb.slice(0, -3)
  return firstPart + "," + lastThree
}


$(document).on('change', '.file-input', function() {
        
  var filesCount = $(this)[0].files.length;
  var textbox = $(this).prev();

  if (filesCount === 1) {
    var fileName = $(this).val().split('\\').pop();
    textbox.text(fileName);
  } else {
    textbox.text(filesCount + ' files selected');
  }
});

function download(rows) {
  let csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
  console.log("CSV Content:");
  console.log(csvContent);
  var encodedUri = encodeURI(csvContent);
  window.open(encodedUri);

  /* dosyaya isim vermek için:
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "my_data.csv");
    document.body.appendChild(link); // Required for FF

    link.click();
  */
}

btnDownload.addEventListener("click", () => {
  console.log("indirme işlemi başlıyor...");
  console.log(convertedArrays);
  if(convertedArrays!=null) {
    download(convertedArrays);
  }
});