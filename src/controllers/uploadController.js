import { read, utils } from 'xlsx';
import  {inserirPedidosAny, truncateAny}  from './queryController.js'

async function processarPlanilhaAny(buffer) {
    const workbook = read(buffer, { type: 'buffer' });
    //const sheetName = workbook.SheetNames[0];
    const pedidos = utils.sheet_to_json(workbook.Sheets['Dados'], { raw: false });
    truncateAny();
    for (const pedido of pedidos) {
      console.log('PEDIDOS:' , pedido);
      //processo de insercao de pedidos
      inserirPedidosAny(pedido)
    }
  
    return (pedidos);
  }

  export { processarPlanilhaAny };
