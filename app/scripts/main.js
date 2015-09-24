// jshint devel:true
"use strict";

var formBox = $("#googleFormUrl");
var SELECTOR = ".ss-item";

formBox.change(function() {
  createBootstrap(formBox.val());
});

function createBootstrap(googleFormHTML) {
  var $form = $(googleFormHTML);

  var targetUrl = extractFormTarget($form);

  var formInputs = [];

  $form.find(SELECTOR).each(function(idx, formEntry) {
    formInputs.push(extractFormInput($(formEntry)));
  });

  var formString = '<form action="' + targetUrl + '">\n';
  formInputs.forEach(function(x) {
    console.log(x);
    formString += renderBootstrapForm(x);
  });
  formString += '</form>';

  $("#jsonified-form").val(formString);
  $("#created-form").html(formString);
}

function extractFormTarget($form) {
  return $form.find("form").attr("action");
}

function extractFormInput($formEntry) {
  return {
    "name": getName($formEntry),
    "inputType": getType($formEntry),
    "title": getTitle($formEntry),
    "help": getHelpText($formEntry),
    "opts": getOpts($formEntry),
  };
}

function getName($formEntry) {
  if ($formEntry.hasClass("ss-select")) {
    return $formEntry.find("select").attr("name");
  }
  return $formEntry.find("input").attr("name");
}

function getType($formEntry) {
  if ($formEntry.hasClass("ss-select")) {
    return "select";
  }
  return $formEntry.find("input").attr("type");
}

function getTitle($formEntry) {
  return $formEntry.find(".ss-q-title").text().trim();
}

function getHelpText($formEntry) {
  return $formEntry.find(".ss-q-help").text();
}

function getOpts($formEntry) {
  var opts = [];
  var list;
  if ($formEntry.hasClass("ss-select")) {
    list = $formEntry.find("option");
  } else {
    list = $formEntry.find("input");
  }
  list.each(function(idx, el) {
    opts.push($(el).attr("value"));
  });
  return opts;
}

function renderBootstrapForm(f) {
  var bootstrap = "";
  // console.log(f);

  bootstrap += '\t<div class="form-group">\n'
  if (f.inputType !== "submit") {
    bootstrap += '\t\t<label for="' + f.name + '">' + f.title + '</label>\n';
  }
  if (f.help) {
    bootstrap += '\t\t<p class="help-block">' + f.help + '</p>\n';
  }
  if (f.inputType === "text") {
    bootstrap += '\t\t<input type="text" class="form-control" name="' + f.name + '" id="' + f.name + '">\n';
  } else if (f.inputType === "select") {
    bootstrap += '\t\t<select name="' + f.name + '" id="' + f.name + '">\n';
    f.opts.forEach(function(opt){
      bootstrap += '\t\t\t<option class="form-control" name="' + opt + '">' + opt + '</option>\n';
    });
    bootstrap += '\t\t</select>\n';
  } else if (f.inputType === "checkbox") {
    f.opts.forEach(function(opt){
      bootstrap += '\t\t<div class="checkbox">\n'
      bootstrap += '\t\t\t<label>\n'
      bootstrap += '\t\t\t<input type="checkbox" name="' + f.name + '" value="' + opt + '">\n'
      bootstrap += '\t\t\t\t' + opt + '\n'
      bootstrap += '\t\t\t</label>\n'
      bootstrap += '\t\t</div>\n'
    });
  } else if (f.inputType === "submit") {
    bootstrap += '\t\t<button type="submit" class="btn btn-default">Submit</button>\n'
  } else {
    bootstrap += '\t\t<input type="'+ f.inputType +'" class="form-control" name="' + f.name + '" id="' + f.name + '">\n\t</div>\n';
    f.opts.forEach(function(opt){
      bootstrap += '\t\t\t<input type="'+ f.inputType +'" class="form-control" name="' + opt + '" >' + opt + '</input>\n';
    });
  }
  bootstrap += '\t</div>\n';
  return bootstrap;
}
