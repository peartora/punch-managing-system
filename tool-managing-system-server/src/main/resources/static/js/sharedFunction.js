'use static';

export function loadPunchAndRender()
{
    const tBodyElement = document.getElementById("t-body");

    const query = new URLSearchParams();
    query.append('status', "사용중");

    getPunchIdList(query, tBodyElement).then(function(response)
    {
        for (let i = 0; i < response.length; i++)
        {
            appendPunchRow(response[i]);
        }
    });
}

export function updateAccurateNumber()
{
    const rows = document.querySelectorAll('tr.punch-row');
    const data = [];

    for (let i = 0; i < rows.length; i++)
    {
        const row = rows.item(i);

        console.log('row');
        console.log(row);

        const inputElement = row.querySelector('td input.usageButton');

        // console.log(inputElement);

        if (inputElement.value === '')
        {
            continue;
        }

        const id = row.dataset['id'];
        const count = row.dataset['count'];
        const numberCount = parseInt(count);

        const todayUsageNumber = inputElement.value;
        const numberTodayUsageNumber = parseInt(todayUsageNumber);
        const totalNumber = numberCount + numberTodayUsageNumber;

        const singleRowData = {};
        singleRowData["id"] = id;
        singleRowData["totalNumber"] = totalNumber;

        data.push(singleRowData);

        console.log(singleRowData);
    }

    updateUsageNumber(data).then(function()
    {
        loadPunchAndRender();
    });
}

function changeStatus(e)
{
    let data = {};

    const selectElement = e.target;
    const newStatus = selectElement.value;

    const rowElement = selectElement.parentNode.parentNode;
    const rowId = rowElement.dataset.id;

    data['id'] = rowId;
    data['newStatus'] = newStatus;

    return new Promise(resolve =>
    {
        const httpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange = function()
        {
            if (httpRequest.readyState === 4)
            {
                if (httpRequest.status === 200)
                {
                    resolve();
                }
            }
        }
        httpRequest.open("POST", `/tool-managing-system/updateStatus`, true);
        httpRequest.setRequestHeader('Content-Type', 'application/json')
        httpRequest.send(JSON.stringify(data));
    })
}

function changeStatusForScrap(e, reason)
{
    let data = {};

    const selectElement = e.target;

    const rowElement = selectElement.parentNode.parentNode;
    const rowId = rowElement.dataset.id;

    data['number'] = rowId;
    data['newStatus'] = "폐기";
    data['reason'] = reason;

    console.log(data);

    return new Promise(resolve =>
    {
        const httpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange = function()
        {
            if (httpRequest.readyState === 4)
            {
                if (httpRequest.status === 200)
                {
                    resolve(`삭제로 상태 변경 되었습니다.`);
                }
            }
        }
        httpRequest.open("POST", `/tool-managing-system/updateStatus/scrap`, true);
        httpRequest.setRequestHeader('Content-Type', 'application/json')
        httpRequest.send(JSON.stringify(data));
    })
}

export function updateNewStatus(e, status)
{
    const newStatus = e.target.value;
    let reason;

    if (newStatus === '폐기')
    {
        reason = prompt(`폐기 하는 이유를 입력 하세요`);

        if (reason)
        {
            changeStatusForScrap(e, reason).then(function(result)
            {
                alert(`${result}`);
                loadPunchAndRender();
            })
        }
        else
        {
            e.target.value = status;
        }
    }
    else
    {
        changeStatus(e).then(function()
        {
            loadPunchAndRender();
        });
    }
}

function updateUsageNumber(data)
{
    return new Promise(resolve =>
    {
        const httpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange = function()
        {
            if (httpRequest.readyState === 4)
            {
                if (httpRequest.status === 200)
                {
                    resolve();
                }
            }
        }
        httpRequest.open("POST", `/tool-managing-system/update`, true);
        httpRequest.setRequestHeader('Content-Type', 'application/json')
        httpRequest.send(JSON.stringify(data));
    });
}

function getPunchIdList(query, tBodyElement)
{
    return new Promise(resolve =>
    {
        const httpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange = function()
        {
            if (httpRequest.readyState === 4)
            {
                if (httpRequest.status === 200)
                {
                    tBodyElement.innerHTML = '';
                    const response = JSON.parse(httpRequest.responseText);
                    resolve(response);
                }
            }
        }

        httpRequest.open("GET", `/tool-managing-system/display?${query}`);
        httpRequest.setRequestHeader('Content-Type', 'application/json')
        httpRequest.send();
    });
}

export function appendPunchRow(object)
{
    const tBodyElement = document.getElementById("t-body");

    const newTBodyRow = tBodyElement.insertRow();
    newTBodyRow.classList.add('punch-row')

    const [number, date, type, manufacturer, specification, latestInspectionDate, status, location, product, ptype, latestCleanDate, count, inspectionSize, canUse] = object;

    newTBodyRow.dataset['id'] = number;
    newTBodyRow.dataset['count'] = count;

    if (canUse === false)
    {
        newTBodyRow.classList.add("clean-punch");
    }

    const numberTdElement = newTBodyRow.insertCell();
    const dateTdElement = newTBodyRow.insertCell();
    const typeTdElement = newTBodyRow.insertCell();
    const manufacturerTdElement = newTBodyRow.insertCell();
    const specificationTdElement = newTBodyRow.insertCell();
    const verificationTdElement = newTBodyRow.insertCell();
    const statusTdElement = newTBodyRow.insertCell();
    const locationTdElement = newTBodyRow.insertCell();
    const productTdElement = newTBodyRow.insertCell();
    const productTypeTdElement = newTBodyRow.insertCell();
    const cleanedTdElement = newTBodyRow.insertCell();
    const countTdElement = newTBodyRow.insertCell();
    const countForTodayTdElement = newTBodyRow.insertCell();
    const inspectionSizeElement = newTBodyRow.insertCell();


    const numberTextNode = document.createTextNode(number);
    const dateTextNode = document.createTextNode(date);
    const typeTextNode = document.createTextNode(type);
    const manufacturerTextNode = document.createTextNode(manufacturer);
    const specificationTextNode = document.createTextNode(specification);

    const selectForStatus = document.createElement('select');
    selectForStatus.classList.add('status-select');
    const statusOptions = ['사용대기', '사용가능', '사용중', '사용불가', '폐기'];

    statusOptions.forEach((option) =>
    {
        const optionElement = document.createElement('option');

        if ((status === '사용대기') || (status === '폐기'))
        {
            optionElement.disabled = true
        }
        else if (status === '사용가능')
        {
            if ((option === '사용대기')||(option === '사용가능'))
            {
                optionElement.disabled = true
            }
        }
        else if (status === '사용중')
        {
            if ((option === '사용대기')||(option === '사용중'))
            {
                optionElement.disabled = true
            }
        }
        else if (status === '사용불가')
        {
            if ((option === '사용대기') || (option === '사용가능') || (option === '사용중') || (option === '사용불가'))
            {
                optionElement.disabled = true
            }
        }
        else
        {
            alert(`없는 ${status} 입니다.`);
        }

        optionElement.value = option; // Set the value of the <option> element to the status option
        optionElement.textContent = option; // Set the text content of the <option> element to the status option
        selectForStatus.appendChild(optionElement); // Add the <option> element to the <select> element
    });

    selectForStatus.value = status;

    selectForStatus.addEventListener('change', (e) => updateNewStatus(e, status));
    statusTdElement.appendChild(selectForStatus);

    const locationTextNode = document.createTextNode(location);
    const productionTextNode = document.createTextNode(product);
    const productionTypeTextNode = document.createTextNode(ptype);
    const cleanedTextNode = document.createTextNode(latestCleanDate);

    const countTextNode = document.createTextNode(count);
    const inspectionSizeTextNode = document.createTextNode(inspectionSize);

    numberTdElement.appendChild(numberTextNode);
    dateTdElement.appendChild(dateTextNode);
    typeTdElement.appendChild(typeTextNode);
    manufacturerTdElement.appendChild(manufacturerTextNode);
    specificationTdElement.appendChild(specificationTextNode);

    if ((status === '사용대기') || (status === '사용중') || (status === '사용불가'))
    {
        const inputElement = document.createElement('input');
        inputElement.classList.add("uploadInput");
        inputElement.type = 'file';
        inputElement.accept = 'application/pdf';

        inputElement.addEventListener('change', (e) => callPromiseToUploadPdf(e, number));

        verificationTdElement.appendChild(inputElement);
    }

    const inspectionTextNode = document.createTextNode(latestInspectionDate);

    const buttonElementForInspectionHistory = document.createElement('button');
    buttonElementForInspectionHistory.setAttribute('class', 'retrieve-inspection-history');
    buttonElementForInspectionHistory.textContent = '이력 확인';
    buttonElementForInspectionHistory.style.marginLeft = '10px';

    buttonElementForInspectionHistory.addEventListener('click', () => retrieveInspectionHistory(number));

    verificationTdElement.appendChild(inspectionTextNode);
    verificationTdElement.appendChild(buttonElementForInspectionHistory);

    locationTdElement.appendChild(locationTextNode);
    productTdElement.appendChild(productionTextNode);
    productTypeTdElement.appendChild(productionTypeTextNode);

    cleanedTdElement.appendChild(cleanedTextNode);

    if ((status === '사용대기') || (status === '사용가능') || (status === '사용중'))
    {
        const buttonElement = document.createElement('button');
        buttonElement.setAttribute('class', 'cleaning-history');
        buttonElement.textContent = '이력 추가';
        buttonElement.style.marginLeft = '10px';

        buttonElement.addEventListener('click', (e) => addCleanHistory(e, number));

        cleanedTdElement.appendChild(buttonElement);
    }

    const buttonElementForCheckHistory = document.createElement('button');
    buttonElementForCheckHistory.setAttribute('class', 'retrieve-clean-history');
    buttonElementForCheckHistory.textContent = '이력 확인';
    buttonElementForCheckHistory.style.marginLeft = '10px';

    buttonElementForCheckHistory.addEventListener('click', () => retrieveCleanHistory(number));
    cleanedTdElement.appendChild(buttonElementForCheckHistory);

    countTdElement.appendChild(countTextNode);

    if (status === "사용중")
    {
        const inputForTodayUsage = document.createElement('input');
        inputForTodayUsage.type = "number";
        inputForTodayUsage.classList.add('usageButton');
        countForTodayTdElement.appendChild(inputForTodayUsage);
    }
    else
    {
        const todayUsageTextNode = document.createTextNode(`사용중 상태에서만 입력 가능`);
        countForTodayTdElement.appendChild(todayUsageTextNode);
    }

    inspectionSizeElement.appendChild(inspectionSizeTextNode);
}

function createPromiseToAddCleanHistory(number)
{
    return new Promise(resolve =>
    {
        const httpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange = function ()
        {
            if (httpRequest.readyState === 4)
            {
                if (httpRequest.status === 200)
                {
                    const result = httpRequest.responseText;
                    resolve(result);
                }
            }
        }
        httpRequest.open("POST", `/tool-managing-system/addCleanHistory`, true);
        httpRequest.setRequestHeader('Content-Type', 'application/json')
        httpRequest.send(number);
    });
}

function addCleanHistory(e, number)
{
    const button = e.target;

    const textNode = button.previousSibling;

    createPromiseToAddCleanHistory(number).then(function(result)
    {
        const replaced = result.replace("T", " ");
        const resultDateAndTime = replaced.substring(0, replaced.indexOf(".") || replaced.length);

        textNode.nodeValue = `최신 청소 이력: ${resultDateAndTime}`;
    })
}

function uploadPdfFile(file, number)
{
    return new Promise(resolve =>
    {
        const formData = new FormData();

        console.log(file); // I confirmed that `file` variable holds correct file.
        console.log(number); // I confirmed that `number` variable holds correct number.

        formData.append('file', file);
        formData.append('number', number)

        console.log(formData.get('file'));
        console.log(formData.get('number'));

        const httpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange = function ()
        {
            if (httpRequest.readyState === 4)
            {
                if (httpRequest.status === 200)
                {
                    const result = httpRequest.responseText;
                    console.log(result);
                    resolve(result);
                }
            }
        }
        httpRequest.open("POST", `/tool-managing-system/uploadFile`, true);
        httpRequest.setRequestHeader('enctype', 'multipart/form-data')
        httpRequest.send(formData);
    });
}

function callPromiseToUploadPdf(e, number)
{
    const file = e.target.files[0];

    if (file.type === 'application/pdf')
    {
        uploadPdfFile(file, number).then(function(result)
        {
            alert(`${result}`);

            postProcessToUpdateStatus(number).then(function()
            {
                alert(`${number}펀치의 상태가 "사용가능"으로 변경 되었습니다.`);

                postProcessToResetCount(number).then(function()
                {
                    alert(`${number}펀치의 count가 0으로 reset 되었습니다.`);

                    loadPunchAndRender();
                })

            });
        });
    }
    else
    {
        alert('PDF file 형식이 아닙니다.');
    }
}

function postProcessToUpdateStatus(number)
{
    console.log("I`m here");

    return new Promise(resolve =>
    {
        let data = {};

        data['id'] = number;
        data['newStatus'] = '사용가능';

        console.log('data', data);

        const httpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange = function ()
        {
            if (httpRequest.readyState === 4)
            {
                if (httpRequest.status === 200)
                {
                    resolve();
                }
            }
        }
        httpRequest.open("POST", `/tool-managing-system/updateStatus`, true);
        httpRequest.setRequestHeader('Content-Type', 'application/json')
        httpRequest.send(JSON.stringify(data));
    });
}

function postProcessToResetCount(number)
{
    return new Promise(resolve =>
    {
        const punchNumber = number

        const httpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange = function ()
        {
            if (httpRequest.readyState === 4)
            {
                if (httpRequest.status === 200)
                {
                    resolve();
                }
            }
        }
        httpRequest.open("POST", `/tool-managing-system/resetCount`, true);
        httpRequest.setRequestHeader('Content-Type', 'application/json')
        httpRequest.send(punchNumber);
    });
}

function callPromiseToRetrieveCleanHistory(number)
{
    return new Promise(resolve =>
    {
        const query = `number=${number}`;

        const httpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange = function ()
        {
            if (httpRequest.readyState === 4)
            {
                if (httpRequest.status === 200)
                {
                    const result = httpRequest.responseText;
                    resolve(result);
                }
            }
        }
        httpRequest.open("GET", `/tool-managing-system/getCleanHistory?${query}`, true);
        httpRequest.setRequestHeader('Content-Type', 'application/json')
        httpRequest.send(number);
    });
}

function retrieveCleanHistory(number)
{
    callPromiseToRetrieveCleanHistory(number).then(function(result)
    {
        console.log(result);
    });
}

function callPromiseToRetrieveInspectionHistory(number)
{
    return new Promise(resolve =>
    {
        const query = `number=${number}`;

        const httpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange = function ()
        {
            if (httpRequest.readyState === 4)
            {
                if (httpRequest.status === 200)
                {
                    const result = httpRequest.responseText;
                    resolve(result);
                }
            }
        }
        httpRequest.open("GET", `/tool-managing-system/getInspectionHistory?${query}`, true);
        httpRequest.setRequestHeader('Content-Type', 'application/json')
        httpRequest.send(number);
    });
}

function retrieveInspectionHistory(number)
{
    callPromiseToRetrieveInspectionHistory(number).then(function(result)
    {
        console.log(result);
    });
}

export function returnPromiseToGetProducts()
{
    return new Promise(resolve =>
    {
        const httpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange = function ()
        {
            if (httpRequest.readyState === 4)
            {
                if (httpRequest.status === 200)
                {
                    // clearTBody();

                    const response = JSON.parse(httpRequest.responseText);
                    resolve(response);
                }
            }
        }
        httpRequest.open("GET", `/tool-managing-system/getProducts`, true);
        httpRequest.setRequestHeader('Content-Type', 'application/json')
        httpRequest.send();
    })
}


