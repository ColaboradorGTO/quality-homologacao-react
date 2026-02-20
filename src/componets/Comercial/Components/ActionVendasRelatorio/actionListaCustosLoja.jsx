import { Fragment, useRef, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { formatMoeda } from "../../../../utils/formatMoeda";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { useReactToPrint } from "react-to-print";
import HeaderTable from "../../../Tables/headerTable";


export const ActionListaCustosLoja  = ({dadosCustosLojas}) => {
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(10);
    const dataTableRef = useRef();
    const [rowSelection, setRowSelection] = useState(null); 
    
    const onPageChange = (event) => {
        setFirst(event.first);
        setRows(event.rows);
    };
  
    const onGlobalFilterChange = (e) => {
      setGlobalFilterValue(e.target.value);
    };
  
    const handlePrint = useReactToPrint({
      content: () => dataTableRef.current,
      documentTitle: 'Vendas por Vendedor',
    });
  
    const exportToPDF = () => {
      const doc = new jsPDF();
      doc.autoTable({
        head: [['Nº', 'Empresa', 'QTD Clientes', 'QTD Produtos', 'Venda Bruto (- Desc)', 'Venda Liq (- Voucher)', 'Projeção Mês', 'Custo Total', 'Lucro Total', 'Markup']],
        body: dados.map(item => [
          item.contador,
          item.NOFANTASIA,
          item.VENDEDOR_MATRICULA,
          item.VENDEDOR_NOME,
          item.QTD_VENDAS,
          item.QTD_PRODUTOS,
  
        ]),
        horizontalPageBreak: true,
        horizontalPageBreakBehaviour: 'immediately'
      });
      doc.save('vendas_vendedor.pdf');
    };
  
    const exportToExcel = () => {
      const worksheet = XLSX.utils.json_to_sheet(dados);
      const workbook = XLSX.utils.book_new();
      const header = ['Nº', 'Empresa', 'QTD Clientes', 'QTD Produtos', 'Venda Bruto (- Desc)', 'Venda Liq (- Voucher)', 'Projeção Mês', 'Custo Total', 'Lucro Total', 'Markup' ]
      worksheet['!cols'] = [
        { wpx: 100, caption: 'Nº' },
        { wpx: 200, caption: 'Empresa' },
        { wpx: 100, caption: 'QTD Clientes' },
        { wpx: 100, caption: 'QTD Produtos' },
        { wpx: 100, caption: 'Venda Bruto (- Desc)' },
        { wpx: 100, caption: 'Venda Liq (- Voucher)' },
        { wpx: 100, caption: 'Projeção Mês' },
        { wpx: 100, caption: 'Custo Total' },
        { wpx: 100, caption: 'Lucro Total' },
        { wpx: 100, caption: 'Markup' }
      ];
      XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Vendas por Vendedor');
      XLSX.writeFile(workbook, 'vendas_vendedor.xlsx');
    };

  const calcularTotalVlLiquido = (item) => {
    const toFloat = (value) => (isNaN(parseFloat(value)) || value === null || value === undefined) ? 0 : parseFloat(value);
    return toFloat(item.VRTOTALVENDA) - toFloat(item.VRRECVOUCHER)
  }

  const calcularTotalMackup = (item) => {
    const toFloat = (value) => (isNaN(parseFloat(value)) || value === null || value === undefined) ? 0 : parseFloat(value);
    return toFloat(item.VRTOTALVENDA) / toFloat(item.VRCUSTOTOTAL)
  }

  const calcularSomaTotalLucro = (item) => {
    const toFloat = (value) => (isNaN(parseFloat(value)) || value === null || value === undefined) ? 0 : parseFloat(value);
    return toFloat(item.VRTOTALVENDA) - toFloat(item.VRCUSTOTOTAL)
  }

  const calcularTotalQtdClientes = () => {
    let total = 0;
    for (let data of dados) {
      total += parseFloat(data.QTD_CLIENTE);
    }
    return total;
  }

  // const calcularTotalQtdClientesPorPagina = () => {
  //   let total = 0;
  //   const firstIndex = page * rowsPerPage; 
  //   const lastIndex = firstIndex + rowsPerPage;
  //   const dataPaginada = dados.slice(firstIndex, lastIndex)

  //   for (let item of dataPaginada) {
  //     total += parseFloat(item.QTD_CLIENTE);
  //   }
  //   return total;
  // }


  // const calcularTotalQtdClientesPorPagina = (paginaAtual, linhasPorPagina) => {
  //   const indiceInicial = paginaAtual * linhasPorPagina;
  //   const indiceFinal = Math.min(indiceInicial + linhasPorPagina, dados.length);
  //   let total = 0;
  
  //   for (let i = indiceInicial; i < indiceFinal; i++) {
  //     total += dados[i].QTD_CLIENTE;
  //   }
  
  //   setTotalClientesPorPagina(total);
  // };

  
  const calcularTotalQtdProdutos = () => {
    let total = 0;
    for(let data of dados) {
      total += parseFloat(data.QTD_PRODUTO);
    }
    return total;
  }

  // const calcularTotalQtdProdutosPorPagina = () => {
  //   let total = 0;
  //   const firstIndex = page * rowsPerPage;
  //   const lastIndex = firstIndex + rowsPerPage;
  //   const dataPaginada = dados.slice(firstIndex, lastIndex)
  //   for(let item of dataPaginada) {
  //     total += parseFloat(item.QTD_PRODUTO);
  //   }
  //   return total;
  // }

  const calcularTotalVendaBruta = () => {
    let total = 0;
    for(let data of dados) {
      total += parseFloat(data.VRTOTALVENDA)
    }
    return total;
  }

  // const calcularTotalVendaBrutaPorPagina = () => {
  //   let total = 0;
  //   const firstIndex = page * rowsPerPage;
  //   const lastIndex = firstIndex + rowsPerPage;
  //   const dataPaginada = dados.slice(firstIndex, lastIndex)
  //   for(let item of dataPaginada) {
  //     total += parseFloat(item.VRTOTALVENDA);
  //   }
  //   return total;
  // }

  const calcularTotalLucro = () => {
    let total = 0;
    for (let data of dados) {
      total += parseFloat(data.valorTotalLucro)
    }
    return total;
  }

  // const calcularTotalLucroPorPagina = () => {
  //   let total = 0;
  //   const firstIndex = page * rowsPerPage;
  //   const lastIndex = firstIndex + rowsPerPage;
  //   const dataPaginada = dados.slice(firstIndex, lastIndex)
  //   for(let item of dataPaginada) {
  //     total += parseFloat(item.valorTotalLucro);
  //   }
  //   return total;
  // }

  const calcularTotalVendaLiquida = () => {
    let total = 0;
    for (let data of dados) {
      total += parseFloat(data.valorTotalLiquido)
    }
    return total;
  }

  // const calcularTotalVendaLiquidaPorPagina = () => {
  //   let total = 0;
  //   const firstIndex = page * rowsPerPage;
  //   const lastIndex = firstIndex + rowsPerPage;
  //   const dataPaginada = dados.slice(firstIndex, lastIndex)
  //   for(let item of dataPaginada) {
  //     total += parseFloat(item.valorTotalLiquido);
  //   }
  //   return total;
  // }

  const calcularTotalProjecaoMes = () => {
    let total = 0;
    for (let data of dados) {
      total += parseFloat(data.VRTOTALVENDA)
    }
    return total;
  }

  // const calcularTotalProjecaoMesPorPagina = () => {
  //   let total = 0;
  //   const firstIndex = page * rowsPerPage;
  //   const lastIndex = firstIndex + rowsPerPage;
  //   const dataPaginada = dados.slice(firstIndex, lastIndex)
  //   for(let item of dataPaginada) {
  //     total += parseFloat(item.VRTOTALVENDA);
  //   }
  //   return total;
  // }

  const calcularTotalCustoTotal = () => {
    let total = 0;
    for(let data of dados) {
      total += parseFloat(data.VRCUSTOTOTAL);
    }
    return total;
  }

  // const calcularTotalCustoTotalPorPagina = () => {
  //   let total = 0;
  //   const firstIndex = page * rowsPerPage;
  //   const lastIndex = firstIndex + rowsPerPage;
  //   const dataPaginada = dados.slice(firstIndex, lastIndex)
  //   for(let item of dataPaginada) {
  //     total += parseFloat(item.VRCUSTOTOTAL);
  //   }
  //   return total;
  // }

  const dados = dadosCustosLojas.map((item, index) => {
    let contador = index + 1;
    const valorTotalLiquido = calcularTotalVlLiquido(item);
    const valorTotalMackup = calcularTotalMackup(item);
    const valorTotalLucro = calcularSomaTotalLucro(item);
    return {
      contador,
      NOFANTASIA: item.NOFANTASIA,
      QTD_CLIENTE: item.QTD_CLIENTE,
      QTD_PRODUTO: item.QTD_PRODUTO,
      valorTotalLiquido: valorTotalLiquido,
      VRRECVOUCHER: item.VRRECVOUCHER,
      VALORDESCONTO: item.VALORDESCONTO,
      VRTOTALVENDA: item.VRTOTALVENDA,
      VRCUSTOTOTAL: item.VRCUSTOTOTAL,

      valorTotalLucro: valorTotalLucro,
      valorTotalMackup: valorTotalMackup,
    }
  })
 
  const colunasVendasCustosLojas = [
    {field: 'contador', header: 'Nº', body: row => <th>{row.contador}</th>, sortable: true},
    {
      field: 'NOFANTASIA', 
      header: 'Loja', 
      body: row => <th>{row.NOFANTASIA}</th>,
      sortable: true },
    { 
      field: 'QTD_CLIENTE',
      header: 'Qtd. Clientes',
      body: row => row.QTD_CLIENTE,
      footer: () => {
        return(
          <div>          
            {dados.length > 0 && (
             <th> 
                {parseFloat(dados.reduce((acc, item) => acc + parseFloat(item.QTD_CLIENTE), 0))}
              </th>
            )}
            {/* <p style={{ fontWeight: 600, }}>Total: {calcularTotalQtdClientesPorPagina()}</p> */}
            {/* <p style={{ fontWeight: 600, }}>Total: {parseFloat(dados.reduce((acc, item) => acc + parseFloat(item.QTD_CLIENTE), 0))}</p> */}
            <hr/>
            <th style={{ fontWeight: 600, }}>Total: {calcularTotalQtdClientes()}</th>
          </div>
        )
      }, 
      sortable: true 
    },
    { field: 'QTD_PRODUTO',
      header: 'Qtd. Produtos',
      body: row => row.QTD_PRODUTO,
      footer: () => {
        return (
          <div>
            {/* <p style={{ fontWeight: 600, }}>Total: {calcularTotalQtdProdutosPorPagina()}</p> */}
            <hr/>
            <th style={{ fontWeight: 600, }}>Total: {calcularTotalQtdProdutos()}</th>
          </div>
        )
      },
      sortable: true 
    },
    { field: 'VRTOTALVENDA',
      header: 'Venda Bruta (- Desc)',
      body: row => formatMoeda(row.VRTOTALVENDA),
      footer: () => {
        return (
          <div>
            {/* <p style={{ fontWeight: 600, }}>Total: {formatMoeda(calcularTotalVendaBrutaPorPagina())}</p> */}
            <hr/>
            <th style={{ fontWeight: 600, }}>Total: {formatMoeda(calcularTotalVendaBruta())}</th>
          </div>
        )
      },
      sortable: true 
    },
    { field: 'valorTotalLiquido', 
      header: 'Venda Líq (- Voucher)', 
      body: row => formatMoeda(row.valorTotalLiquido),
      footer: () => {
        return (
          <div>
            {/* <p style={{ fontWeight: 600, }}>Total: {formatMoeda(calcularTotalVendaLiquidaPorPagina())}</p> */}
            <hr/>
            <th style={{ fontWeight: 600, }}>Total: {formatMoeda(calcularTotalVendaLiquida())}</th>
          </div>
        )
      },
      sortable: true 
    },
    { field: 'VRTOTALVENDA',
      header: 'Projeção Mês',
      body: row => formatMoeda(row.VRTOTALVENDA),
      footer: () => {
        return (
          <div>
            {/* <p style={{ fontWeight: 600, }}>Total: {formatMoeda(calcularTotalProjecaoMesPorPagina())}</p> */}
            <hr/>
            <th style={{ fontWeight: 600, }}>Total: {formatMoeda(calcularTotalProjecaoMes())}</th>
          </div>
        )
      },
      sortable: true 
    },
    { field: 'VRCUSTOTOTAL',
      header: 'Custo Total',
      body: row => formatMoeda(row.VRCUSTOTOTAL),
      footer: () => {
        return (
          <div>
            {/* <p style={{ fontWeight: 600, }}>Total: {formatMoeda(calcularTotalCustoTotalPorPagina())}</p> */}
            <hr/>
            <th style={{ fontWeight: 600, }}>Total: {formatMoeda(calcularTotalCustoTotal())}</th>
          </div>
        )
      },
      sortable: true 
    },
    { field: 'valorTotalLucro',
      header: 'Lucro Total',
      body: row => formatMoeda(row.valorTotalLucro),
      footer: () => {
        return (
          <div>
            {/* <p style={{ fontWeight: 600, }}>Total: { formatMoeda(calcularTotalLucroPorPagina())}</p> */}
            <hr/>
            <th style={{ fontWeight: 600, }}>Total: {formatMoeda(calcularTotalLucro())}</th>
          </div>
        )
      },
      sortable: true 
    },
    { field: 'valorTotalMackup', 
      header: 'Mackup', 
      body: row => <th >{parseFloat(row.valorTotalMackup).toFixed(2)}%</th>,
      sortable: true 
    },
  ]
  
  return (

    <Fragment>
        <div className="panel">
        <div className="panel-hdr">
          <h2>Vendas Custos Por Lojas</h2>
        </div>
        <div style={{ marginTop: "1rem", marginBottom: "1rem" }}>
          <HeaderTable
            globalFilterValue={globalFilterValue}
            onGlobalFilterChange={onGlobalFilterChange}
            handlePrint={handlePrint}
            exportToExcel={exportToExcel}
            exportToPDF={exportToPDF}
          />

        </div>
        <div className="card" ref={dataTableRef}>

          <DataTable
            title="Vendas por Loja"
            value={dados}
            size="small"
            sortOrder={-1}
            paginator
            rows={10}
            selectionMode="single"
            selection={rowSelection}
            onSelectionChange={(e) => setRowSelection(e.value)}
            rowsPerPageOptions={[10, 20, 30, 50, 100]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
            filterDisplay="menu"
            showGridlines
            stripedRows
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
          >
            {colunasVendasCustosLojas.map(coluna => (
              <Column
                key={coluna.field}
                field={coluna.field}
                header={coluna.header}
                body={coluna.body}
                footer={coluna.footer}
                sortable={coluna.sortable}                          
                headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem'}}
                footerStyle={{ color: '', backgroundColor: "", border: '1px solid #e9e9e9',fontSize: '0.8rem' }}
                bodyStyle={{ fontSize: '0.8rem' }}

              />
            ))}
          </DataTable>
        </div>
      </div>
      
    </Fragment>
  )
}