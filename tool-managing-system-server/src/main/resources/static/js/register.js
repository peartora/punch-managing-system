'use static';

import {returnPromiseToGetProducts} from './sharedFunction.js'

window.addEventListener("load", function()
{
    returnPromiseToGetProducts().then(function (response)
    {
        const selectElementForProductForRegister = document.getElementById('product-register');

        response.forEach(value =>
        {
            const optionElementForRegister = document.createElement('option');

            optionElementForRegister.value = value;
            optionElementForRegister.textContent = value;
            selectElementForProductForRegister.appendChild(optionElementForRegister);
        });

        const defaultOption  = document.createElement('option');
        defaultOption.setAttribute('value', '');
        defaultOption.setAttribute('disabled', '');
        defaultOption.setAttribute('selected', '');
        defaultOption.textContent = 'Please select type';
        selectElementForProductForRegister.appendChild(defaultOption);
    });

    const registerForm = document.getElementById("register-form");

    registerForm.onsubmit = function(e)
    {
        e.preventDefault();

        const firstNumber = document.getElementById('first-number').value;
        const lastNumber = document.getElementById('last-number').value;
        const date = document.getElementById("date").value;
        const type = document.getElementById("type").value;
        const manufacturer = document.getElementById("manufacturer").value;
        const specification = document.getElementById("specification").value;
        const storageLocation = document.getElementById("storage-location").value;
        const product = document.getElementById("product-register").value;
        const productType = document.getElementById("product-type").value;

        let dataSet =
        {
            'date': date,
            'type': type,
            'manufacturer': manufacturer,
            'specification': specification,
            'location': storageLocation,
            'product': product,
            'productType': productType,
        }

        const numberOfPunchs = lastNumber - firstNumber;

        const confirmedResult = window.confirm(`입력하신 펀치 id 개수가 ${numberOfParsedIds}개 맞습니까?`);

        if (confirmedResult)
        {
            for (let i = 0; i < parsedIds.length; i++)
            {
                if (parsedIds[i] === '')
                {
                    continue;
                }

                let id = generatePunchId(parsedIds[i], dataSet);

                const newDataSet = {
                    ...dataSet,
                    'number': id
                }

                checkAndRegisterId(newDataSet);
            }
        }
        else
        {
            alert(`입력을 다시 확인 해 주세요`);
        }
    }
});

function generatePunchId(id, dataSet)
{
    const date = dataSet['date'];
    const dateArrayed = date.split('-');
    const basicDate = `${dateArrayed[0]}${dateArrayed[1]}${dateArrayed[2]}`

    return `${id}-${basicDate}-${dataSet['product']}`;
}

function isIdDuplicate(id)
{
    return new Promise(resolve => {
        let queryString = "?id=" + id;

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
        httpRequest.open("GET", `/tool-managing-system/duplicate${queryString}`, true);
        httpRequest.setRequestHeader('Content-Type', 'application/json')
        httpRequest.send();
    });
}

function checkAndRegisterId(dataSet)
{
    isIdDuplicate(dataSet['number'])
        .then(function (result) {
            let intCount;

            if (typeof result === 'string') {
                console.log("Yes it`s String type");
                intCount = parseInt(result);
            } else {
                alert("Unknown type");
            }

            if (intCount === 0)
            {
                return registerId(dataSet);
            }
        })
        .then(function (textValue)
        {
            alert(textValue);
        });
}

function registerId(dataSet)
{
    return new Promise((resolve, reject) =>
    {
        const httpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange = function()
        {
            if (httpRequest.readyState === 4) {
                if (httpRequest.status === 200) {
                    const textValue = httpRequest.responseText;
                    resolve(textValue);
                }
            }
        }
        httpRequest.open("POST", "/tool-managing-system/register", true);
        httpRequest.setRequestHeader('Content-Type', 'application/json')
        httpRequest.send(JSON.stringify(dataSet));
    })
}
