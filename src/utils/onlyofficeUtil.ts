export function handleDocType(fileType: string){
  
  let docType = '';

  // word 文档类型扩展名
  const fileTypesWord: string[] = [
    'doc', 'docm', 'docx', 'dot', 'dotm', 'dotx', 'epub', 'fb2', 'fodt', 'htm', 'html', 'mht', 'mhtml',
    'odt', 'ott', 'rtf', 'stw', 'sxw', 'txt', 'wps', 'wpt', 'xml'
  ];

  // cell 表格类型扩展名
  const fileTypesCell: string[] = [
    'csv', 'et', 'ett', 'fods', 'ods', 'ots', 'sxc', 'xls', 'xlsb', 'xlsm', 'xlsx', 'xlt', 'xltm', 'xltx', 'xml'
  ];

  // slide 演示文档类型扩展名
  const fileTypesSlide: string[] = [
    'dps', 'dpt', 'fodp', 'odp', 'otp', 'pot', 'potm', 'potx', 'pps', 'ppsm', 'ppsx', 'ppt', 'pptm', 'pptx', 'sxi'
  ];

  // pdf 文档类型扩展名
  const fileTypesPdf: string[] = [
    'djvu', 'docxf', 'oform', 'oxps', 'pdf', 'xps'
  ];

  // 判断文件类型所属类别
  if (fileTypesWord.includes(fileType)) {
    docType = 'word';
  } else if (fileTypesCell.includes(fileType)) {
    docType = 'cell';
  } else if (fileTypesSlide.includes(fileType)) {
    docType = 'slide';
  } else if (fileTypesPdf.includes(fileType)) {
    docType = 'pdf';
  }

  return docType;
}
