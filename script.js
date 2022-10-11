(function ($) {
  if (!jQuery().draggable) {
    $.fn.draggable = function () {
      this.css("cursor", "move").on("mousedown", function (e) {
        var $dragged = $(this);
        var x = $dragged.offset().left - e.pageX,
          y = $dragged.offset().top - e.pageY,
          z = $dragged.css("z-index");
        $(window)
          .on("mousemove.draggable", function (e) {
            $dragged
              .css({
                "z-index": 999,
                bottom: "auto",
                right: "auto",
              })
              .offset({
                left: x + e.pageX,
                top: y + e.pageY,
              });
          })
          .one("mouseup", function () {
            $(this).off("mousemove.draggable");
            $dragged.css("z-index", z);
          });
        // disable selection
        e.preventDefault();
      });
      return this;
    };
  }
})(jQuery);
$(".drag").draggable();

let editor;
require.config({
  paths: { vs: "https://unpkg.com/monaco-editor@latest/min/vs" },
});
window.MonacoEnvironment = { getWorkerUrl: () => proxy };

let proxy = URL.createObjectURL(
  new Blob(
    [
      `self.MonacoEnvironment = {
        baseUrl: 'https://unpkg.com/monaco-editor@latest/min/'
    };
    importScripts('https://unpkg.com/monaco-editor@latest/min/vs/base/worker/workerMain.js');`,
    ],
    { type: "text/javascript" }
  )
);

require(["vs/editor/editor.main"], function () {
  editor = monaco.editor.create(document.getElementById("container"), {
    value: [
      "/*",
      " * Yet Another Utility Mod 1.0.0",
      " * - Press Alt while being focused on this textbox to execute the script",
      " * - Press ESC while being focused on this textbox to close out of this window",
      " * - Use this for executing custom scripts into the current webpage that you're on",
      " */",
    ].join("\n"),
    language: "javascript",
    theme: "vs-dark",
  });
});
document.getElementById("container").addEventListener("keydown", (event) => {
  if (event.keyCode == 18) {
    eval(editor.getModel().getValue());
  }
  if (event.keyCode == 27) {
    document.getElementById("drag").remove();
  }
});
