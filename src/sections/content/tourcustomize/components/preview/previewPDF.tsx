import { useGetHTMLTourCustomizedProgForExport } from "@/hooks/actions/useMail";
import { Download, FileText } from "lucide-react";
import { useMemo } from "react";

type PreviewPDFProps = {
  strTourCustomizedGUID?: string;
};

type HtmlItem = {
  strHTML?: string;
};

type FileExportInfo = {
  strFileExportName?: string;
  strTourName?: string;
  strTourCode?: string;
  strFileName?: string;
  strFilePath?: string;
};

const PreviewPDF = ({ strTourCustomizedGUID }: PreviewPDFProps) => {
  const { exportHtmlData, exportHtmlLoading, exportHtmlError } =
    useGetHTMLTourCustomizedProgForExport(strTourCustomizedGUID);

  const htmlContent = useMemo(() => {
    const htmlList: HtmlItem[] = Array.isArray(exportHtmlData?.[0])
      ? exportHtmlData[0]
      : [];

    return htmlList.map((item) => item?.strHTML ?? "").join("");
  }, [exportHtmlData]);

  const fileInfo: FileExportInfo | undefined = Array.isArray(
    exportHtmlData?.[1],
  )
    ? exportHtmlData[1][0]
    : undefined;

  const handleExportWord = () => {
    if (!htmlContent) {
      console.error("Khong co noi dung de export Word");
      return;
    }

    const fullHtml = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office"
            xmlns:w="urn:schemas-microsoft-com:office:word"
            xmlns="http://www.w3.org/TR/REC-html40">
        <head>
          <meta charset="utf-8" />
          <title>${fileInfo?.strTourCode || "tour-preview"}</title>
          <style>
            body {
              font-family: Arial, Helvetica, sans-serif;
              font-size: 12px;
              color: #333;
            }

            table {
              width: 100%;
              border-collapse: collapse;
            }

            td,
            th {
              vertical-align: top;
            }

            img {
              max-width: 100%;
              height: auto;
            }

            a {
              color: #0066cc;
            }
          </style>
        </head>
        <body>
          ${htmlContent}
        </body>
      </html>
    `;

    const blob = new Blob(["\ufeff", fullHtml], {
      type: "application/msword",
    });

    const fileName =
      fileInfo?.strFileExportName || fileInfo?.strTourCode || "tour-preview";
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${fileName}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

//   const iframeHtml = useMemo(() => {
//     return `
//       <!DOCTYPE html>
//       <html>
//         <head>
//           <meta charset="UTF-8" />
//           <style>
//             html,
//             body {
//               margin: 0;
//               padding: 0;
//               background: #f3f4f6;
//               font-family: Arial, Helvetica, sans-serif;
//               font-size: 12px;
//               color: #333;
//               overflow: hidden;
//             }

//             .page-wrapper {
//               width: 100%;
//               min-height: 100vh;
//               margin: 0 auto;
//               background: #fff;
//               padding: 32px 40px;
//               box-sizing: border-box;
//             }

//             table {
//               width: 100%;
//               border-collapse: collapse;
//             }

//             td,
//             th {
//               vertical-align: top;
//             }

//             img {
//               max-width: 100%;
//             }

//             a {
//               color: #0066cc;
//             }
//           </style>
//         </head>

//         <body>
//           <div class="page-wrapper">
//             ${htmlContent}
//           </div>
//         </body>
//       </html>
//     `;
//   }, [htmlContent]);


  return (
    <div className="flex h-full min-h-0 flex-col bg-white">
      {/* TOOLBAR */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-3 py-2">
        <div className="flex items-center gap-2">
          {/* <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-gray-100 text-gray-700 transition hover:bg-gray-200"
            title="Download"
          >
            
          </button> */}

          <button
            type="button"
            onClick={handleExportWord}
            disabled={!htmlContent}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-gray-100transition hover:bg-gray-200"
            title="Export Word"
          ><Download size={16} 
           className="text-gray-700"
          />
            <FileText size={15}
           className="text-blue-700"

            />
          </button>
        </div>

        {/* {fileInfo?.strTourCode && (
          <div className="text-xs text-gray-500">{fileInfo.strTourCode}</div>
        )} */}
      </div>

      {/* CONTENT */}
      <div className="max-w-full flex-1 bg-white overflow-auto">
        {exportHtmlLoading && (
          <div className="py-10 text-center text-sm text-gray-500">
            Đang tải nội dung preview...
          </div>
        )}

        {exportHtmlError && (
          <div className="py-10 text-center text-sm text-red-500">
            Không tải được nội dung preview.
          </div>
        )}

        {!exportHtmlLoading && !exportHtmlError && !htmlContent && (
          <div className="py-10 text-center text-sm text-gray-500">
            Không có nội dung preview.
          </div>
        )}

        {!exportHtmlLoading && !exportHtmlError && htmlContent && (
          <div className="bg-gray-50 px-4 pb-6 pt-4">
            <div
              className="preview-export-html mx-auto max-w-[850px] bg-white px-10 py-8 text-[12px] text-[#333] shadow-sm"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewPDF;
