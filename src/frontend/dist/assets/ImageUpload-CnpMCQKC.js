import { r as reactExports, j as jsxRuntimeExports, B as Button, ag as LoadingSpinner, am as ExternalBlob } from "./index-Ccb6n9uY.js";
function ImageUpload({
  value,
  onChange,
  label = "Upload image",
  aspect = "square",
  "data-ocid": ocid
}) {
  const inputRef = reactExports.useRef(null);
  const [progress, setProgress] = reactExports.useState(null);
  const handleFile = async (file) => {
    const bytes = new Uint8Array(await file.arrayBuffer());
    const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((pct) => {
      setProgress(pct);
    });
    onChange(blob);
    setProgress(null);
  };
  const handleInput = (e) => {
    var _a;
    const file = (_a = e.target.files) == null ? void 0 : _a[0];
    if (file) handleFile(file);
  };
  const aspectClass = aspect === "square" ? "aspect-square" : "aspect-video";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-ocid": ocid, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        ref: inputRef,
        type: "file",
        accept: "image/*",
        className: "hidden",
        onChange: handleInput,
        "data-ocid": ocid ? `${ocid}_input` : void 0
      }
    ),
    value ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: `relative ${aspectClass} w-full rounded-xl overflow-hidden bg-muted`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: value.getDirectURL(),
              alt: "Uploaded",
              className: "w-full h-full object-cover"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 bg-foreground/20 opacity-0 hover:opacity-100 transition-smooth flex items-center justify-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                size: "sm",
                onClick: () => {
                  var _a;
                  return (_a = inputRef.current) == null ? void 0 : _a.click();
                },
                "data-ocid": ocid ? `${ocid}_change_button` : void 0,
                children: "Change"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                size: "sm",
                variant: "destructive",
                onClick: () => onChange(void 0),
                "data-ocid": ocid ? `${ocid}_remove_button` : void 0,
                children: "Remove"
              }
            )
          ] })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: () => {
          var _a;
          return (_a = inputRef.current) == null ? void 0 : _a.click();
        },
        className: `${aspectClass} w-full rounded-xl border-2 border-dashed border-border hover:border-primary transition-smooth flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-primary cursor-pointer bg-muted/30`,
        "data-ocid": ocid ? `${ocid}_upload_button` : void 0,
        children: progress !== null ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { size: "sm" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs", children: [
            progress,
            "%"
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "svg",
            {
              className: "w-8 h-8",
              fill: "none",
              stroke: "currentColor",
              viewBox: "0 0 24 24",
              role: "img",
              "aria-label": "Upload image",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  strokeWidth: 1.5,
                  d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                }
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", children: label })
        ] })
      }
    )
  ] });
}
export {
  ImageUpload as I
};
