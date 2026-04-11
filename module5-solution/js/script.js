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
var menuItemsTitleHtml = "snippets/menu-items-title.html";
var menuItemHtml = "snippets/menu-item.html";

var insertHtml = function (selector, html) {
  document.querySelector(selector).innerHTML = html;
};

var showLoading = function (selector) {
  var html = "<div class='text-center'>";
  html += "<img src='images/ajax-loader.gif'></div>";
  insertHtml(selector, html);
};

var insertProperty = function (string, propName, propValue) {
  var propToReplace = "{{" + propName + "}}";
  return string.replace(new RegExp(propToReplace, "g"), propValue);
};

var switchMenuToActive = function () {
  var classes = document.querySelector("#navHomeButton").className;
  classes = classes.replace("active", "");
  document.querySelector("#navHomeButton").className = classes;

  classes = document.querySelector("#navMenuButton").className;
  if (classes.indexOf("active") === -1) {
    document.querySelector("#navMenuButton").className += " active";
  }
};

// ⭐ FIXED PART
document.addEventListener("DOMContentLoaded", function () {
  showLoading("#main-content");

  $ajaxUtils.sendGetRequest(
    allCategoriesUrl,
    buildAndShowHomeHTML,
    true);
});

function buildAndShowHomeHTML (categories) {

  $ajaxUtils.sendGetRequest(
    homeHtmlUrl,
    function (homeHtml) {

      var chosenCategory = chooseRandomCategory(categories);

      // ⭐ IMPORTANT
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

function chooseRandomCategory (categories) {
  return categories[Math.floor(Math.random() * categories.length)];
}

dc.loadMenuCategories = function () {
  showLoading("#main-content");

  $ajaxUtils.sendGetRequest(
    allCategoriesUrl,
    buildAndShowCategoriesHTML);
};

dc.loadMenuItems = function (categoryShort) {
  showLoading("#main-content");

  $ajaxUtils.sendGetRequest(
    menuItemsUrl + categoryShort + ".json",
    buildAndShowMenuItemsHTML);
};

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

function buildMenuItemsViewHtml(data, titleHtml, itemHtml) {

  titleHtml = insertProperty(titleHtml, "name", data.category.name);
  titleHtml = insertProperty(titleHtml, "special_instructions",
                             data.category.special_instructions);

  var finalHtml = titleHtml + "<section class='row'>";

  var items = data.menu_items;
  var shortName = data.category.short_name;

  for (var i = 0; i < items.length; i++) {

    var html = itemHtml;

    html = insertProperty(html, "short_name", items[i].short_name);
    html = insertProperty(html, "catShortName", shortName);
    html = insertProperty(html, "name", items[i].name);
    html = insertProperty(html, "description", items[i].description);

    finalHtml += html;
  }

  return finalHtml + "</section>";
}

global.$dc = dc;

})(window);
