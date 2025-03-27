const invModel = require("../models/inventory-model");
const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (currentUrl) {
  let data = await invModel.getClassifications();
  let nav = '<nav class="navbar">';
  nav += '<ul class="nav-links">';

  let homeClass = currentUrl === "/" ? 'class="active"' : "";
  nav += `<li><a href="/" ${homeClass} title="Home page">Home</a></li>`;

  data.rows.forEach((row) => {
    let link = `/inv/type/${row.classification_id}`;
    let isActive = currentUrl?.startsWith(link) ? 'class="active"' : "";
    nav += `<li><a href="${link}" ${isActive} title="See our inventory of ${row.classification_name} vehicles">${row.classification_name}</a></li>`;
  });

  nav += "</ul></nav>";
  return nav;
};

/* **************************************
 * Build the classification view HTML
 *************************************** */
Util.buildClassificationGrid = async function (data) {
  console.log('Data recibida para grid:', data);

  // Validamos que data sea un array y tenga contenido
  if (!Array.isArray(data) || data.length === 0) {
    return '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }

  let grid = '<div class="grid-container">';

  data.forEach(vehicle => {
    if (vehicle?.inv_id && vehicle?.inv_make && vehicle?.inv_model && vehicle?.inv_price && vehicle?.inv_thumbnail) {
      grid += '<div class="grid-item">';
      grid += `<a href="../../detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">`;
      grid += `<img src="${vehicle.inv_thumbnail}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors" class="vehicle-img"/></a>`;
      grid += '<div class="vehicle-info">';
      grid += `<h2><a href="../../detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">${vehicle.inv_make} ${vehicle.inv_model}</a></h2>`;
      grid += `<span class='price'>$${new Intl.NumberFormat("en-US").format(vehicle.inv_price)}</span>`;
      grid += "</div></div>";
    } else {
      console.warn("Datos incompletos para el vehículo:", vehicle);
    }
  });

  grid += "</div>";
  return grid;
};

/* **************************************
 * Build the vehicle detail page HTML
 *************************************** */
Util.buildDetailPage = async function (data) {

  console.log('data', data);

  if (!data) {
    return '<p class="notice">Sorry, no details available for this vehicle.</p>';
  }

  let detailPage = `<div class="vehicle-detail">
    <h1>${data.inv_make} ${data.inv_model} (${data.inv_year})</h1>
    <img src="${data.inv_image}" alt="Image of ${data.inv_make} ${data.inv_model}">
    <p class="price"><strong>Price:</strong> $${new Intl.NumberFormat("en-US").format(data.inv_price)}</p>
    <p><strong>Miles:</strong> ${new Intl.NumberFormat("en-US").format(data.inv_miles)}</p>
    <p><strong>Color:</strong> ${data.inv_color}</p>
    <p><strong>Description:</strong> ${data.inv_description}</p>
  </div>`;

  return detailPage;
};

/* ****************************************
 * Error Handling Middleware Wrapper
 **************************************** */
Util.handleErrors = function (controllerFunc) {
  return function (req, res, next) {
    controllerFunc(req, res).catch(next);
  };
};

module.exports = Util;