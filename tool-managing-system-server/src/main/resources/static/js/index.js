'use static';

import {loadPunchAndRender, updateAccurateNumber, returnPromiseToGetProducts} from './sharedFunction.js'

window.addEventListener("DOMContentLoaded", function()
{
    loadPunchAndRender();

    const buttonElement = document.getElementById('accumulate-usage-number');
    buttonElement.addEventListener('click', updateAccurateNumber);

    returnPromiseToGetProducts().then(function (response)
    {

        const selectElementForProduct = document.getElementById('search-product');

        response.forEach(value =>
        {
            const optionElement = document.createElement('option');

            optionElement.value = value;
            optionElement.textContent = value;
            selectElementForProduct.appendChild(optionElement);
        });

        const optionElement = document.createElement('option');
        optionElement.value = `모든 제품`;
        optionElement.textContent = `모든 제품`;
        selectElementForProduct.appendChild(optionElement);
    });
});



