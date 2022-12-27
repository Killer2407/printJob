
let job = {}
async function getResponse() {
    const response = await fetch('http://demo1694197.mockable.io/getDocs');

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
    job = data;
    //mapping data
    let files = job.documents.filename;
    let DATA_SET = []
    files.map(_file => {
        let file = {};
        file.filename = _file;
        file.color = false;
        file.notes = "";
        file.print = false;
        file.disabled = _file.includes("zip")
        DATA_SET.push(file)
    })
    // console.log(DATA_SET);

    // -------- *appending html as loop* --------
    let tbodyElement = document.getElementById("tbody").value;
    let tbodyInnerHTML = ""
    for (let index = 0; index < DATA_SET.length; index++) {
        const element = DATA_SET[index];
        let innerHTML = ""
        if (element.disabled) {
            // ------ Disabling "newCode.zip" -------
            innerHTML = `<tr class="tr-disabled">
        <th scope="row" id='filename${index}'>${element.filename}*</th>
        <td><input type="checkbox" disabled id='print${index}'/></td>
        <td><input type="checkbox" disabled id='color${index}'/></td>
        <td><textarea class="form-control" disabled id="notes${index}" rows="1"   placeholder="Notes"></textarea></td>
      </tr>`;
        }
        else {
            innerHTML = `<tr>
        <th scope="row" id='filename${index}'>${element.filename}</th>
        <td><input type="checkbox" id='print${index}'/></td>
        <td><input type="checkbox"  id='color${index}'/></td>
        <td><textarea class="form-control" id="notes${index}" rows="1"   placeholder="Notes"></textarea></td>
      </tr>`;
        }
        tbodyInnerHTML = tbodyInnerHTML + innerHTML
    }
    tbodyElement.innerHTML = (tbodyInnerHTML)
}
getResponse();

document.getElementById("submit").addEventListener("click", function (event) {
    event.preventDefault();
    let DOCUMENTS = []
    let deliverTo = ""
    try {
        deliverTo = document.querySelector('input[name="deliver"]:checked').value;
    } catch (error) {
        deliverTo = "";
    }

    let instructions = document.getElementById("specialInstruction").value;
    for (let index = 0; index < DATA_SET.length; index++) {
        const element = DATA_SET[index];
        let printChecked = document.getElementById(`print${index}`).checked;

        if (printChecked) {
            let doc = {};
            doc.filename = element.filename;
            doc.color = document.getElementById(`color${index}`).checked.toString();
            if (document.getElementById(`notes${index}`).value) doc.notes = document.getElementById(`notes${index}`).value;
            DOCUMENTS.push(doc)
        }
    }
    console.log(deliverTo, instructions, DOCUMENTS)

    let finalOutput = {
        "printRequest": {
            "deliverTo": deliverTo,
            "instructions": instructions,
            "documents": {
                "document": DOCUMENTS
            }
        }
    };

    alert(JSON.stringify(finalOutput))
    console.log(finalOutput);
});
