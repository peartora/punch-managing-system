'use static';

import {returnPromiseToGetProducts} from './sharedFunction.js'

window.addEventListener("DOMContentLoaded", function()
{
    getProducts();

    const modifyForm = document.getElementById('modify-form');
    modifyForm.addEventListener('submit', function(e)
    {
        e.preventDefault();

        const dataObject = {};
        const product = document.getElementById('product-modify').value;
        const newBatchSize = document.getElementById('new-batch-size').value;
        const newInspectionSize = document.getElementById('new-inspection-size').value;

        dataObject['product'] = product;
        dataObject['newBatchSize'] = newBatchSize;
        dataObject['newInspectionSize'] = newInspectionSize;

        console.log(dataObject);

        returnPromiseToUpdateSizeInfor(dataObject).then(function(response)
        {
            alert(response);
        })
    });
});

function getProducts()
{
    returnPromiseToGetProducts().then(function(response)
    {
        const selectElementForProduct = document.getElementById('product-modify');

        response.forEach(value =>
        {
            const optionElement = document.createElement('option');

            optionElement.value = value;
            optionElement.textContent = value;
            selectElementForProduct.appendChild(optionElement);
        });

        const defaultOption  = document.createElement('option');
        defaultOption.setAttribute('value', '');
        defaultOption.setAttribute('disabled', '');
        defaultOption.setAttribute('selected', '');
        defaultOption.textContent = 'Please select type';
        selectElementForProduct.appendChild(defaultOption);
    });
}

function returnPromiseToUpdateSizeInfor(dataObject)
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
                    const response = httpRequest.responseText;
                    resolve(response);
                }
            }
        }
        httpRequest.open("POST", `/tool-managing-system/updateBatchInfor`, true);
        httpRequest.setRequestHeader('Content-Type', 'application/json')
        httpRequest.send(JSON.stringify(dataObject));
    });
}