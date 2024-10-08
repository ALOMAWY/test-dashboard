import { setItemToDb, getItemFromDb, deleteDocument, getAllDocuments, deleteAllDocuments, updateDocument, } from "./database.js";
import { uploadImageAsInputFileRespownse, deleteImageFromDb, getImageByName, } from "./storage.js";
const form = document.getElementById("product-form");
const productId = document.getElementById("productId");
let productsArrayLength;
const productType = document.getElementById("product-type");
const productModel = document.getElementById("product-model");
const productDescription = document.getElementById("product-discrioption");
const productImage = document.getElementById("product-choose-image");
const productCount = document.getElementById("products-length");
const deleteAll = document.getElementById("delete-all");
const productsList = document.getElementById("products-list");
const errorMessages = document.getElementById("error-messages");
let isUpdateNow = false;
let updatingProductId;
export const submitFormButton = document.getElementById("submit-form");
// Initialize The Inputs
// Get The Products From Product.json
// Display The Products In The Page
function displayProducts(products) {
    if (productsList) {
        productsList.innerHTML = ``;
        products.forEach((prod) => {
            let productItem = document.createElement("li");
            productItem.classList.add("d-flex", "align-items-center", "justify-content-between", "fs-3", "fw-bold", "text-capitalize");
            productItem.classList.add("product-item", "list-group-item");
            productItem.setAttribute("product-id", prod.id);
            let productTypeLable = document.createElement("h3");
            productTypeLable.classList.add("fs-2");
            productTypeLable.innerText = prod.type;
            productItem.appendChild(productTypeLable);
            let productText = document.createElement("div");
            productText.classList.add("w-25");
            let productModelLabel = document.createElement("h2");
            productModelLabel.innerText = prod.model;
            productText.appendChild(productModelLabel);
            let productDescriptionLabel = document.createElement("p");
            productDescriptionLabel.classList.add("fs-4");
            productDescriptionLabel.innerText = prod.description;
            productText.appendChild(productDescriptionLabel);
            productItem.appendChild(productText);
            let productOptions = document.createElement("div");
            productOptions.classList.add("d-flex", "gap-3");
            productItem.appendChild(productOptions);
            let productEdit = document.createElement("div");
            productEdit.classList.add("product-update", "btn", "btn-warning");
            productEdit.innerHTML = `<i class="fa-solid fa-pen"></i>`;
            let productRemove = document.createElement("div");
            productRemove.classList.add("btn", "btn-danger");
            productRemove.innerHTML = `<i class="fa-solid fa-trash"></i>`;
            productOptions.appendChild(productEdit);
            productOptions.appendChild(productRemove);
            let prodcutImageLabel = document.createElement("img");
            prodcutImageLabel.src = prod.imagePath;
            prodcutImageLabel.classList.add("w-25");
            productItem.appendChild(prodcutImageLabel);
            productsList.appendChild(productItem);
            productRemove.addEventListener("click", async () => {
                await deleteDocument(prod.id);
                deleteImageFromDb(prod.imageName);
                productItem.remove();
            });
        });
        if (productCount)
            productCount.innerText = `${products.length}`;
    }
}
function clickToEdit() {
    document.querySelectorAll(".product-update").forEach((updateProd) => {
        updateProd.addEventListener("click", async (event) => {
            var _a;
            let productsItem = (_a = updateProd.parentNode) === null || _a === void 0 ? void 0 : _a.parentNode;
            let currentUpdatingProductId = productsItem.getAttribute("product-id") || "";
            try {
                let product = await getItemFromDb(currentUpdatingProductId);
                productId.value = product.id;
                productModel.value = product.model;
                productDescription.value = product.description;
                productType.value = product.type;
                // Set Updateing Date
                updatingProductId = currentUpdatingProductId;
                isUpdateNow = true;
                if (submitFormButton)
                    submitFormButton.innerText = `Update Product`;
            }
            catch (error) {
                console.log("error", error);
            }
        });
    });
}
// Add Product To The Products Array
async function addProduct() {
    try {
        if (productImage && productImage.files && productImage.files.length > 0) {
            let imageFile = productImage.files[0];
            let uploadTheImageToServer = (await uploadImageAsInputFileRespownse(imageFile));
            let imageURL = await getImageByName(uploadTheImageToServer);
            let currentDate = crypto.randomUUID();
            productId.value = currentDate;
            let product = {
                id: currentDate,
                type: productType.value,
                imagePath: imageURL,
                imageName: imageFile.name,
                description: productDescription.value,
                model: productModel.value,
            };
            let uploadTheProduct = (await setItemToDb(currentDate, product));
            form.reset();
            displayProducts(uploadTheProduct);
            productsArrayLength = uploadTheProduct.length;
            console.log("products Number Is :", productsArrayLength);
        }
    }
    catch (error) {
        console.error("Error Adding Product:", error);
    }
}
// Delete The Product From File
// Form Submition
async function addProductOnSubmit() {
    if (validateForm()) {
        if (submitFormButton) {
            submitFormButton.innerText = "...adding";
            submitFormButton.disabled = true;
        }
        try {
            await addProduct();
            form.reset();
            if (submitFormButton)
                submitFormButton.innerText = "Add Product"; // Reset button text after submission
            submitFormButton.disabled = false;
            clickToEdit();
        }
        catch (error) {
            console.error("Error adding product:", error);
            if (submitFormButton)
                submitFormButton.innerText = "Error!";
        }
    }
}
async function updateProductOnSubmit(docId) {
    if (validateForm()) {
        if (submitFormButton)
            submitFormButton.innerHTML = "...updating";
        try {
            if (productImage && productImage.files && productImage.files.length > 0) {
                let imageFile = productImage.files[0];
                let uploadImageResponse = await uploadImageAsInputFileRespownse(imageFile);
                let imageURL = await getImageByName(uploadImageResponse);
                let updatedProduct = {
                    id: updatingProductId,
                    type: productType.value,
                    model: productModel.value,
                    description: productDescription.value,
                    imagePath: imageURL,
                    imageName: imageFile.name,
                };
                await updateDocument(docId, updatedProduct);
                getProdcutsAndDisplayIt();
                if (submitFormButton)
                    submitFormButton.innerText = "Product Updated";
                form.reset();
            }
        }
        catch (error) {
            console.error("Error updating product:", error);
            if (submitFormButton)
                submitFormButton.innerText = "Error!";
        }
    }
}
form === null || form === void 0 ? void 0 : form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!isUpdateNow) {
        addProductOnSubmit();
    }
    else {
        if (updatingProductId)
            updateProductOnSubmit(updatingProductId);
        isUpdateNow = false;
        updatingProductId = "";
    }
});
// Load The Product When The Page Loaded
window.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded, calling getProdcutsAndDisplayIt...");
    getProdcutsAndDisplayIt();
});
deleteAll === null || deleteAll === void 0 ? void 0 : deleteAll.addEventListener("click", async () => {
    try {
        if (productsArrayLength) {
            let deleted = await deleteAllDocuments();
            displayProducts(deleted);
            productsArrayLength = 0;
            console.log("Deleted All Products");
        }
        else {
            console.error("No Prodcuts To Delete");
        }
    }
    catch (error) {
        console.error("Can't To Delete Products", error);
    }
});
async function getProdcutsAndDisplayIt() {
    console.log("fetching date...");
    try {
        let productsArray = (await getAllDocuments()) || [];
        productsArrayLength = productsArray.length;
        console.log("products Number Is :", productsArrayLength);
        if (productsArray.length)
            displayProducts(productsArray);
        clickToEdit();
    }
    catch (error) {
        console.log("No Products In Data Base To Show 😊");
    }
}
// getProdcutsAndDisplayIt()
function displayError(message) {
    const errorDiv = document.createElement("div");
    if (errorMessages)
        errorMessages.innerHTML = "";
    errorDiv.textContent = message;
    errorMessages === null || errorMessages === void 0 ? void 0 : errorMessages.appendChild(errorDiv);
}
function validateForm() {
    var _a;
    let isValid = true;
    errorMessages.innerHTML = ""; // Clear previous error messages
    // Validate product image
    if (!((_a = productImage.files) === null || _a === void 0 ? void 0 : _a.length)) {
        displayError("Please select a product image.");
        productImage.classList.add("border-danger");
        isValid = false;
    }
    else if (!/\.(jpg|jpeg|png)$/i.test(productImage.files[0].name)) {
        displayError("Please select a valid image file (jpg, jpeg, png).");
        productImage.classList.add("border-danger");
        isValid = false;
    }
    else {
        productImage.classList.remove("border-danger");
    }
    // Validate product type
    if (!productType.value) {
        displayError("Please select a product type.");
        productType.classList.add("border-danger");
        isValid = false;
    }
    else {
        productType.classList.remove("border-danger");
    }
    // Validate product model
    if (!productModel.value.trim()) {
        displayError("Product model cannot be empty.");
        productModel.classList.add("border-danger");
        isValid = false;
    }
    else {
        productModel.classList.remove("border-danger");
    }
    // Validate product description
    if (!productDescription.value.trim()) {
        displayError("Product description cannot be empty.");
        productDescription.classList.add("border-danger");
        isValid = false;
    }
    else {
        productDescription.classList.remove("border-danger");
    }
    return isValid;
}
