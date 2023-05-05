'use static';

import {returnPromiseToGetProducts} from './sharedFunction.js'

window.addEventListener("DOMContentLoaded", function()
{
    const addForm = document.getElementById('add-form');
    addForm.addEventListener('submit', function(e)
    {
        e.preventDefault();

        const dataSet = {};
        const product = document.getElementById('product-add').value;
        const batchSize = document.getElementById('batch-size').value;
        const inspectionSize = document.getElementById('inspection-size').value;

        dataSet['product'] = product;
        dataSet['batchSize'] = batchSize;
        dataSet['inspectionSize'] = inspectionSize;

        returnPromiseToCheckDuplicateProduct(dataSet).then(function()
        {
            returnPromiseToAddProduct(dataSet).then(function(response)
            {
                alert(`${response}`);
            });
        })
    })
});

function returnPromiseToCheckDuplicateProduct(dataSet)
{
    return new Promise(resolve =>
    {
        const query = `?product=${dataSet['product']}`;

        const httpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange = function ()
        {
            if (httpRequest.readyState === 4)
            {
                if (httpRequest.status === 200)
                {
                    const response = httpRequest.responseText;

                    if (response === '0')
                    {
                        resolve(response);
                    }
                }
            }
        }
        httpRequest.open("GET", `/tool-managing-system/duplicateProduct${query}`, true);
        httpRequest.setRequestHeader('Content-Type', 'application/json')
        httpRequest.send();
    });
}

function returnPromiseToAddProduct(dataSet)
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
        httpRequest.open("POST", `/tool-managing-system/addProduct`, true);
        httpRequest.setRequestHeader('Content-Type', 'application/json')
        httpRequest.send(JSON.stringify(dataSet));
    });
}

