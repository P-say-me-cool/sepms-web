import XLSX from 'xlsx'
// import Spreadsheet from 'x-data-spreadsheet';
// import zhCN from 'x-data-spreadsheet/src/locale/zh-cn';
// //设置中文
// Spreadsheet.locale('zh-cn', zhCN);
x_spreadsheet.locale('zh-cn');

export default {
  init(mode,row,col,id) {
    return new x_spreadsheet("#"+id, {
      showToolbar: true, showGrid: true,mode:mode,
      row: {
        len: row,
        height: 28,
      },
      col: {
        len: col,
        width: 100,
        indexWidth: 60,
        minWidth: 60,
      },
      view: {
        height: () => document.documentElement.clientHeight,
        width: () => document.documentElement.clientWidth*(9/10),
      },
      style: {
        textwrap: true,
      }
    })
      .loadData([]).change((cdata) => {
        // console.log('cdata', cdata);
        // console.log('>>>', this.xs.getData());
      });

    this.xs.on('cell-selected', (cell, ri, ci) => {
      // console.log('cell:', cell, ', ri:', ri, ', ci:', ci);
    }).on('cell-edited', (text, ri, ci) => {
      // console.log('text:', text, ', ri: ', ri, ', ci:', ci);
    });

    setTimeout(() => {
      // xs.loadData([{ rows }]);
      // xs.cellText(14, 3, 'cell-text').reRender();
      // console.log('cell(8, 8):', this.xs.cell(8, 8));
      // console.log('cellStyle(8, 8):', this.xs.cellStyle(8, 8));
    }, 5000);
  },
}
