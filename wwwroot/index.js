var $status = null;
var $watermark = null;
var $activeElement = null;
function updateNaveBar(status) {
  $status = status;
  $("nav button").attr("disabled", "");
  $(`nav button[data-status=${$status}]`).removeAttr("disabled");
}

$((_) => {
  updateNaveBar("start");
  $("fieldset").hide();
  initNavBar();

  initImageForm();
  initLogoForms();
  initAddEditTextDlg();
});

function initNavBar() {
  $("#new").on("click", (e) => {
    if (confirm("Start new Project?")) {
      $("fieldset").hide();
      $("[data-image-dlg]").show();
    }
  });

  $("#demo").on("click", (e) => {
    createDemoWaterMark();
    addDemoImage();
    addDemoText();
    updateNaveBar("in-project");

    function createDemoWaterMark() {
      initWatermark(wmDemoData.ImageInfo);
    }

    function addDemoImage() {
      $watermark.addImageElement(wmDemoData.LogoInfo);
    }

    function addDemoText() {
      const textOption = {
        FontFamily: "Arial",
        Text: "Sample",
        FontSize: 30,
        Color: "#ff0000",
        Rotate: 45,
        TileMode: "FLOWER",
        Span: 50,
      };
      $watermark.addTextElement(textOption);
    }
  });

  //preview
  $("#preview").on("click", async (_) => {
    const imageElement = document.getElementById("img");
    $watermark.preview(imageElement);
  });

  //download
  $("#download").on("click", async (_) => await $watermark.exportImage());

  $("#logo").on("click", (e) => {
    $activeElement = null;
    $("fieldset").hide();
    $("[data-logo-add-dlg]").show();
  });

  $("#text").on("click", (e) => {
    $activeElement = null;
    $("fieldset").hide();
    $("[data-text-dlg]").show();
  });

  $("#close").on("click", (e) => {
    if (confirm("Close Current Project?")) {
      $("fieldset").hide();
      $("svg").removeAttr("width").removeAttr("height").empty();
      $("img").attr("src", "");
      $watermark = null;
      $activeElement = null;
      updateNaveBar("start");
    }
  });
}

function initLogoForms() {
  initAddLogoForm();
  initEditLogoForm();
  function initAddLogoForm() {
    $("#logo-add-form").on("submit", async (e) => {
      e.preventDefault();
      const files = $("#logoFile")[0];
      const file = files.files[0];
      const imageOption = await watermark.Util.GetBase64Image(file);
      imageOption.Rotate = parseInt($("#logo-add-form #Rotate").val());
      imageOption.Scale = parseFloat($("#logo-add-form #Scale").val());
      imageOption.Opacity = parseFloat($("#logo-add-form #Opacity").val());
      imageOption.TileMode = $("#logo-add-form #TileMode").val();
      imageOption.Span = parseInt($("#logo-add-form #Span").val());
      $watermark.addImageElement(imageOption);
      $("fieldset").hide();
    });
  }
  function initEditLogoForm() {
    const form = $("#logo-edit-form");
    form.find("[data-remove]").on("click", (e) => {
      e.preventDefault();
      $activeElement?.remove();
    });
    //use of update real-time
    function updateFn() {
      if ($activeElement?.getElementInfo()?.Type == "LOGO") {
        const imageOption = {
          Rotate: parseInt($("#logo-edit-form #Rotate").val()),
          Scale: parseFloat($("#logo-edit-form #Scale").val()),
          Opacity: parseFloat($("#logo-edit-form #Opacity").val()),
          TileMode: $("#logo-edit-form #TileMode").val(),
          Span: parseFloat($("#logo-edit-form #Span").val()),
        };
        $activeElement.setElementInfo(imageOption);
      }
    }
    form.find(":input").on("change", (_) => updateFn());
    form.on("submit", async (e) => {
      e.preventDefault();
      updateFn();
      $("fieldset").hide();
    });
  }
}

function initWatermark(imageInfo) {
  const option = {
    SvgElement: $("#main-svg")[0],
    ImageInfo: imageInfo,
  };
  $watermark = new watermark.Watermark(option);
  $watermark.onElementSelect(showElementInfo);
  $activeElement = null;
}

function initImageForm() {
  $("#image-form").on("submit", async (e) => {
    e.preventDefault();
    const files = $("#imageFile")[0];
    const file = files.files[0];
    const imageOption = await watermark.Util.GetBase64Image(file);
    initWatermark(imageOption);
    updateNaveBar("in-project");
    $("fieldset").hide();
  });
}
function initAddEditTextDlg() {
  const form = $("#text-form");
  form.find("[data-remove]").on("click", (e) => {
    e.preventDefault();
    $activeElement?.remove();
  });
  //use of update real-time
  form.find(":input").on("change", (e) => {
    if ($activeElement && $activeElement.getElementInfo().Type == "TEXT") {
      const data = new FormData(form[0]);
      const textOption = Object.fromEntries(data.entries());
      textOption.Rotate = parseInt(textOption.Rotate);
      textOption.Span = parseInt(textOption.Span);
      $activeElement.setElementInfo(textOption);
    }
  });

  form.on("submit", (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const textOption = Object.fromEntries(data.entries());
    textOption.Rotate = parseInt(textOption.Rotate);
    textOption.Span = parseInt(textOption.Span);
    if ($activeElement && $activeElement.getElementInfo().Type == "TEXT") {
      $activeElement.setElementInfo(textOption);
    } else {
      $watermark.addTextElement(textOption);
      $("fieldset").hide();
    }
  });
}

function showElementInfo(element) {
  $activeElement = element;
  $("fieldset").hide();
  if (element) {
    const info = element.getElementInfo();
    switch (info.Type) {
      case "TEXT": {
        $("#text-form #Text").val(info.Text);
        $("#text-form #FontFamily").val(info.FontFamily);
        $("#text-form #FontSize").val(info.FontSize);
        $("#text-form #Color").val(info.Color);
        $("#text-form #Rotate").val(info.Rotate);
        $("#text-form #TileMode").val(info.TileMode),
          $("#text-form #Span").val(info.Span),
          $("[data-text-dlg]").show();
        break;
      }
      case "LOGO": {
        $("#logo-edit-form #Scale").val(info.Scale);
        $("#logo-edit-form #Rotate").val(info.Rotate);
        $("#logo-edit-form #TileMode").val(info.TileMode),
          $("#logo-edit-form #Span").val(info.Span),
          $("[data-logo-edit-dlg]").show();
        break;
      }
    }
  }
}
