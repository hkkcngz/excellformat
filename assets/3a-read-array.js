var allData;


document.getElementById("demo").onchange = evt => {
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

function bringColumn(data, column) { // allData
  previewData.innerHTML = "";
  outputData.innerHTML = "";
  for (let i = 0; i < data.length; i++) {
    const element = data[i][column];
    previewData.innerHTML += element + '\n';

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