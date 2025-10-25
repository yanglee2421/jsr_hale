import JSZip from "jszip";
import * as fs from "node:fs";
import * as FXP from "fast-xml-parser";

const createXML = (data: unknown) => {
  const builder = new FXP.XMLBuilder({
    ignoreAttributes: false,
    format: true,
  });
  const output = builder.build(data);
  return output;
};

const createContent_Types = () => {
  const demoData = {
    Types: {
      "@_xmlns": "http://schemas.openxmlformats.org/package/2006/content-types",
      Default: [
        {
          "@_Extension": "rels",
          "@_ContentType":
            "application/vnd.openxmlformats-package.relationships+xml",
        },
        { "@_Extension": "xml", "@_ContentType": "application/xml" },
      ],
      Override: [
        {
          "@_PartName": "/xl/workbook.xml",
          "@_ContentType":
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml",
        },
        {
          "@_PartName": "/xl/worksheets/sheet1.xml",
          "@_ContentType":
            "application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml",
        },
      ],
    },
  };

  return createXML(demoData);
};

const createRelsRels = () => {};

export const generateXLSX = async () => {
  const zip = new JSZip();
  const content_Types = createContent_Types();
  zip.file("[Content_Types].xml", content_Types);
  zip.folder("_rels")?.file(".rels");
  zip.folder("xl")?.file("workbook.xml");
  zip.folder("xl")?.folder("_rels")?.file("workbook.xml.rels");
  zip.folder("xl")?.folder("worksheets")?.file("sheet1.xml");
  const buf = await zip.generateAsync({ type: "nodebuffer" });
  await fs.promises.writeFile("./deno.xlsx", buf);
};
