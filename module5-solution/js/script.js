$(function () {
  $("#navbarToggle").blur(function (event) {
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
  "https://davids-restaurant.herokuapp.com/categories.json";
var categoriesTitleHtml = "snippets/categories-title-snippet.html";
var categoryHtml = "snippets/category-snippet.html";
var menuItemsUrl =
  "https://davids-restaurant.herokuapp.com/menu_items/";
var menuItemsTitleHtml = "snippets/menu-items-title.html";
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

// Replace {{}} properties
var insertProperty = function (string, propName, propValue) {
  var propToReplace = "{{" + propName + "}}";
  return string.replace(new RegExp(propToReplace, "g"), propValue);
};

// Switch active menu
var switchMenuToActive = function () {
  var classes = document.querySelector("#navHomeButton").className;
  classes = classes.replace("active", "");
  document.querySelector("#navHomeButton").className = classes;

  classes = document.querySelector("#navMenuButton").className;
  if (classes.indexOf("active") === -1) {
    classes += " active";
    document.querySelector("#navMenuButton").className = classes;
  }
};

// On page load
document.addEventListener("DOMContentLoaded", function () {
  showLoading("#main-content");

  $ajaxUtils.sendGetRequest(
    allCategoriesUrl,
    buildAndShowHomeHTML,
    true
  );
});

// Build home page
function buildAndShowHomeHTML (categories) {
  $ajaxUtils.sendGetRequest(
    homeHtmlUrl,
    function (homeHtml) {

      var chosenCategoryShortName =
        chooseRandomCategory(categories).short_name;

      var homeHtmlToInsertIntoMainPage =
        insertProperty(
          homeHtml,
          "randomCategoryShortName",
          "'" + chosenCategoryShortName + "'"
        );

      insertHtml("#main-content", homeHtmlToInsertIntoMainPage);
    },
    false
  );
}

// Random category
function chooseRandomCategory (categories) {
  var randomIndex = Math.floor(Math.random() * categories.length);
  return categories[randomIndex];
}

// Load categories
dc.loadMenuCategories = function () {
  showLoading("#main-content");
  $ajaxUtils.sendGetRequest(
    allCategoriesUrl,
    buildAndShowCategoriesHTML
  );
};

// Load menu items
dc.loadMenuItems = function (categoryShort) {
  showLoading("#main-content");
  $ajaxUtils.sendGetRequest(
    menuItemsUrl + categoryShort + ".json",
    buildAndShowMenuItemsHTML
  );
};

// Build categories HTML
function buildAndShowCategoriesHTML (categories) {
  $ajaxUtils.sendGetRequest(
    categoriesTitleHtml,
    function (categoriesTitleHtml) {
      $ajaxUtils.sendGetRequest(
        categoryHtml,
        function (categoryHtml) {

          switchMenuToActive();

          var finalHtml = categoriesTitleHtml + "<section class='row'>";

          for (var i = 0; i < categories.length; i++) {
            var html = categoryHtml;
            html = insertProperty(html, "name", categories[i].name);
            html = insertProperty(html, "short_name", categories[i].short_name);
            finalHtml += html;
          }

          finalHtml += "</section>";
          insertHtml("#main-content", finalHtml);
        },
        false
      );
    },
    false
  );
}

// Build menu items
function buildAndShowMenuItemsHTML (categoryMenuItems) {
  $ajaxUtils.sendGetRequest(
    menuItemsTitleHtml,
    function (menuItemsTitleHtml) {
      $ajaxUtils.sendGetRequest(
        menuItemHtml,
        function (menuItemHtml) {

          switchMenuToActive();

          var finalHtml =
            insertProperty(menuItemsTitleHtml, "name",
              categoryMenuItems.category.name);

          finalHtml =
            insertProperty(finalHtml, "special_instructions",
              categoryMenuItems.category.special_instructions);

          finalHtml += "<section class='row'>";

          var items = categoryMenuItems.menu_items;
          var catShortName = categoryMenuItems.category.short_name;

          for (var i = 0; i < items.length; i++) {
            var html = menuItemHtml;

            html = insertProperty(html, "short_name", items[i].short_name);
            html = insertProperty(html, "catShortName", catShortName);
            html = insertProperty(html, "name", items[i].name);
            html = insertProperty(html, "description", items[i].description);

            if (i % 2 !== 0) {
              html += "<div class='clearfix visible-lg-block visible-md-block'></div>";
            }

            finalHtml += html;
          }

          finalHtml += "</section>";
          insertHtml("#main-content", finalHtml);
        },
        false
      );
    },
    false
  );
}

global.$dc = dc;

})(window);
