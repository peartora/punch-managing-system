'use static';

import {appendPunchRow} from './sharedFunction.js'


window.addEventListener("load", function()
{
    const searchFormElement = document.getElementById("search-form");

    searchFormElement.addEventListener("submit", function(e)
    {
        e.preventDefault();

        const number = document.getElementById("number").value;
        const date = document.getElementById("date").value;
        const type = document.getElementById("type").value;
        const manufacturer = document.getElementById("manufacturer").value;
        const status = document.getElementById("status").value;
        const storageLocation = document.getElementById("storage-location").value;
        const productForSearch = document.getElementById("search-product").value;

        const params = new URLSearchParams();

        if (productForSearch === '모든 제품')
        {
            params.append('`p`.`number`', number);
            params.append('`p`.`date`', date);
            params.append('`p`.`type`', type);
            params.append('`p`.`manufacturer`', manufacturer);
            params.append('`p`.`status`', status);
            params.append('`p`.`location`', storageLocation);
        }
        else
        {
            params.append('`p`.`number`', number);
            params.append('`p`.`date`', date);
            params.append('`p`.`type`', type);
            params.append('`p`.`manufacturer`', manufacturer);
            params.append('`p`.`status`', status);
            params.append('`p`.`location`', storageLocation);
            params.append('`p`.`product`', productForSearch);
        }

        getIds(params)
            .then(function(response)
            {
                for(let i = 0; i < response.length; i++)
                {
                    appendPunchRow(response[i]);
                }
            });
    });
});

function getIds(params)
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
                    clearTBody();

                    const response = JSON.parse(httpRequest.responseText);
                    resolve(response);
                }
            }
        }
        httpRequest.open("GET", `/tool-managing-system/display?${params.toString()}`, true);
        httpRequest.setRequestHeader('Content-Type', 'application/json')
        httpRequest.send();
    })
}

function clearTBody()
{
    const tBodyElement = document.getElementById("t-body");

    while (tBodyElement.firstChild)
    {
        tBodyElement.removeChild(tBodyElement.firstChild);
    }
}
