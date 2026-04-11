$(function () {
  $("#navbarToggle").blur(function () {
    var screenWidth = window.innerWidth;
    if (screenWidth < 768) {
      $("#collapsable-nav").collapse('hide');
    }
  });
});

(function (global) {

var dc = {};

var homeHtmlUrl = "snippets/home-snippet.html";
var allCategoriesUrl =
  "https://coursera-jhu-default-rtdb.firebaseio.com/categories.json";
var categoriesTitleHtml = "snippets/categories-title-snippet.html";
var categoryHtml = "snippets/category-snippet.html";
var menuItemsUrl =
  "https://coursera-jhu-default-rtdb.firebaseio.com/menu_items/";
var menuItemsTitleHtml = "snippets/menu-items-title-snippet.html";
var menuItemHtml = "snippets/menu-item-snippet.html";

// Insert HTML
var insertHtml = function (selector, html) {
  document.querySelector(selector).innerHTML = html;
};

// Loading icon
var showLoading = function (selector) {
  var html = "<div class='text-center'>";
  html += "<img src='images/ajax-loader.gif'></div>";
  insertHtml(selector, html);
};

// Replace {{prop}}
var insertProperty = function (string, propName, propValue) {
  var propToReplace = "{{" + propName + "}}";
  return string.replace(new RegExp(propToReplace, "g"), propValue);
};

// Menu active switch
var switchMenuToActive = function () {
  var classes = document.querySelector("#navHomeButton").className;
  classes = classes.replace("active", "");
  document.querySelector("#navHomeButton").className = classes;

  classes = document.querySelector("#navMenuButton").className;
  if (classes.indexOf("active") === -1) {
    document.querySelector("#navMenuButton").className += " active";
  }
};

// Load home
document.addEventListener("DOMContentLoaded", function () {
  showLoading("#main-content");

  $ajaxUtils.sendGetRequest(
    allCategoriesUrl,
    buildAndShowHomeHTML,
    true);
});

// Home HTML
function buildAndShowHomeHTML (categories) {

  $ajaxUtils.sendGetRequest(
    homeHtmlUrl,
    function (homeHtml) {

      var chosenCategory = chooseRandomCategory(categories);

      var chosenCategoryShortName =
        "'" + chosenCategory.short_name + "'";

      var finalHtml =
        insertProperty(homeHtml,
                       "randomCategoryShortName",
                       chosenCategoryShortName);

      insertHtml("#main-content", finalHtml);
    },
    false);
}

// Random category
function chooseRandomCategory (categories) {
  return categories[Math.floor(Math.random() * categories.length)];
}

// Load categories
dc.loadMenuCategories = function () {
  showLoading("#main-content");

  $ajaxUtils.sendGetRequest(
    allCategoriesUrl,
    buildAndShowCategoriesHTML);
};

// Load menu items
dc.loadMenuItems = function (categoryShort) {
  showLoading("#main-content");

  $ajaxUtils.sendGetRequest(
    menuItemsUrl + categoryShort + ".json",
    buildAndShowMenuItemsHTML);
};

// Categories HTML
function buildAndShowCategoriesHTML (categories) {
  $ajaxUtils.sendGetRequest(
    categoriesTitleHtml,
    function (categoriesTitleHtml) {

      $ajaxUtils.sendGetRequest(
        categoryHtml,
        function (categoryHtml) {

          switchMenuToActive();

          var html =
            buildCategoriesViewHtml(categories,
                                   categoriesTitleHtml,
                                   categoryHtml);

          insertHtml("#main-content", html);
        },
        false);
    },
    false);
}

// Categories view
function buildCategoriesViewHtml(categories, titleHtml, itemHtml) {

  var finalHtml = titleHtml + "<section class='row'>";

  for (var i = 0; i < categories.length; i++) {
    var html = itemHtml;

    html = insertProperty(html, "name", categories[i].name);
    html = insertProperty(html, "short_name", categories[i].short_name);

    finalHtml += html;
  }

  return finalHtml + "</section>";
}

// Menu items HTML
function buildAndShowMenuItemsHTML (data) {
  $ajaxUtils.sendGetRequest(
    menuItemsTitleHtml,
    function (titleHtml) {

      $ajaxUtils.sendGetRequest(
        menuItemHtml,
        function (itemHtml) {

          switchMenuToActive();

          var html =
            buildMenuItemsViewHtml(data, titleHtml, itemHtml);

          insertHtml("#main-content", html);
        },
        false);
    },
    false);
}

// Menu items view
function buildMenuItemsViewHtml(data, titleHtml, itemHtml) {

  titleHtml = insertProperty(titleHtml, "name", data.category.name);
  titleHtml = insertProperty(titleHtml, "special_instructions",
                             data.category.special_instructions);

  var finalHtml = titleHtml + "<section class='row'>";

  var items = data.menu_items;
  var shortName = data.category.short_name;

  for (var i = 0; i < items.length; i++) {

    var html = itemHtml;

    html =
      insertProperty(html, "short_name", items[i].short_name);
    html =
      insertProperty(html, "catShortName", shortName);
    html =
      insertItemPrice(html, "price_small", items[i].price_small);
    html =
      insertItemPortionName(html, "small_portion_name", items[i].small_portion_name);
    html =
      insertItemPrice(html, "price_large", items[i].price_large);
    html =
      insertItemPortionName(html, "large_portion_name", items[i].large_portion_name);
    html =
      insertProperty(html, "name", items[i].name);
    html =
      insertProperty(html, "description", items[i].description);

    if (i % 2 !== 0) {
      html += "<div class='clearfix visible-lg-block visible-md-block'></div>";
    }

    finalHtml += html;
  }

  return finalHtml + "</section>";
}

// Price insert
function insertItemPrice(html, pricePropName, priceValue) {
  if (!priceValue) {
    return insertProperty(html, pricePropName, "");
  }

  priceValue = "$" + priceValue.toFixed(2);
  return insertProperty(html, pricePropName, priceValue);
}

// Portion insert
function insertItemPortionName(html, portionPropName, portionValue) {
  if (!portionValue) {
    return insertProperty(html, portionPropName, "");
  }

  portionValue = "(" + portionValue + ")";
  return insertProperty(html, portionPropName, portionValue);
}

global.$dc = dc;

})(window);
