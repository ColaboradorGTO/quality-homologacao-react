import React, { Fragment, useRef, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { toFloat } from "../../../../utils/toFloat";
import { formatMoeda } from "../../../../utils/formatMoeda";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { useReactToPrint } from "react-to-print";
import HeaderTable from "../../../Tables/headerTable";
import { formatarPorcentagem } from "../../../../utils/formatarPorcentagem";

export const ActionListaPorVendasEstrutura = ({ dadosVendasEstrutura }) => {
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [size, setSize] = useState('small');
  const dataTableRef = useRef();
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
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
      head: [['Nº', 'Loja', 'Grupo', 'Sub Grupo', 'Marca', 'Cód. Barras', 'Produto', 'Total Quantidade', 'Venda Bruta(R$)', 'Desconto(R$)', 'Desconto(%)', 'Venda Bruta (Desc)', 'Voucher(R$)', 'Venda Líquida(R$)']],
      body: dadosEstruturaVendas.map(item => [
        item.contador,
        item.NOFANTASIA,
        item.GRUPO,
        item.SUBGRUPO,
        item.MARCA,
        item.NUCODBARRAS,
        item.DSNOME,
        item.QTD,
        formatMoeda(item.TOTALBRUTO),
        formatMoeda(item.TOTALDESCONTO),
        item.percentualDescontoProduto,
        formatMoeda(item.VRTOTALLIQUIDO),
        formatMoeda(item.VLVOUCHER),
        formatMoeda(item.valorTotalLiquido),
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('vendas-por-estrutura.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dadosExcell);
    const workbook = XLSX.utils.book_new();
    const header = ['Nº', 'Loja', 'Grupo', 'Sub Grupo', 'Marca', 'Cód. Barras', 'Produto', 'Total Quantidade', 'Venda Bruta(R$)', 'Desconto(R$)', 'Desconto(%)', 'Venda Bruta (Desc)', 'Voucher(R$)', 'Venda Líquida(R$)']
    worksheet['!cols'] = [
      { wpx: 100, caption: 'Nº' },
      { wpx: 200, caption: 'Loja' },
      { wpx: 100, caption: 'Grupo' },
      { wpx: 100, caption: 'Sub Grupo' },
      { wpx: 100, caption: 'Marca' },
      { wpx: 100, caption: 'Cód. Barras' },
      { wpx: 100, caption: 'Produto' },
      { wpx: 100, caption: 'Total Quantidade' },
      { wpx: 100, caption: 'Venda Bruta(R$)' },
      { wpx: 100, caption: 'Desconto(R$)' },
      { wpx: 100, caption: 'Desconto(%)' },
      { wpx: 100, caption: 'Venda Bruta (Desc)' },
      { wpx: 100, caption: 'Voucher(R$)' },
      { wpx: 100, caption: 'Venda Líquida(R$)' }
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Vendas por Estrutura');
    XLSX.writeFile(workbook, 'vendas-por-estrutura.xlsx');
  };

  const calcularMarckup = (item) => {  
    return ((toFloat(item.vendaMarca.VRTOTALLIQUIDO) / toFloat(item.vendaMarca.TOTALCUSTO)) - 1) * 100;
  }

  const calcularValorTotalLiquidoProduto = (item) => {
    return toFloat(item.vendaMarca?.VRTOTALLIQUIDO) - toFloat(item.vendaMarca?.VLVOUCHER)
  }

  const calcularIndicadorVendaProduto = (item) => {   
    return toFloat(item.vendaMarca?.VRTOTALLIQUIDO) / toFloat(item.vendaMarca?.TOTALCUSTO)
  }

  const calcularMargemProduto = (item) => {  
    return toFloat(item.vendaMarca?.VRTOTALLIQUIDO) - toFloat(item.vendaMarca?.TOTALCUSTO)
  }

  const calcularCustoPercentualProduto = (item) => { 
    return ((toFloat(item.vendaMarca?.TOTALCUSTO) * 100) / toFloat(item.vendaMarca?.VRTOTALLIQUIDO))
  }

  const calcularMargemPercentualProduto = (item) => {
    return 100 - ((toFloat(item.vendaMarca?.TOTALCUSTO) * 100) / toFloat(item.vendaMarca?.VRTOTALLIQUIDO))
  }

  const calcularPercentualDescontoProduto = (item) => { 
    return ((toFloat(item.vendaMarca?.TOTALDESCONTO) / (toFloat(item.vendaMarca?.TOTALBRUTO) + toFloat(item.vendaMarca?.TOTALDESCONTO))) * 100)
  }

  const calcularTotalQuantidadeVendasEstrutura = () => {
    return dadosEstruturaVendas.reduce((total, dados) => total + parseFloat(dados.QTD), 0);
  }

  const calcularTotalQuantidadeVendasEstruturaPorPagina = () => {
    let total = 0;
    const firstIndex = first * rows;
    const lastIndex = firstIndex + rows;
    for (let i = firstIndex; i < lastIndex && i < dadosVendasEstrutura.length; i++) {
      if (dadosVendasEstrutura[i]) {
        total += parseFloat(dadosVendasEstrutura[i].vendaMarca.QTD);
      }
    }
    return total;
  }

  const calcularTotalVendaBrutaVendasEstrutura = () => {
    return dadosEstruturaVendas.reduce((total, dados) => total + parseFloat(dados.TOTALBRUTO), 0);
  }

  const calcularTotalVendaBrutaVendasEstruturaPorPagina = () => {
    let total = 0;
    const firstIndex = first * rows;
    const lastIndex = firstIndex + rows;
    for (let i = firstIndex; i < lastIndex && i < dadosVendasEstrutura.length; i++) {
      if (dadosVendasEstrutura[i]) {
        total += parseFloat(dadosVendasEstrutura[i].vendaMarca.TOTALBRUTO);
      }
    }
    return total;
  }

  const calcularTotalDescontoVendasEstrutura = () => {
    return dadosEstruturaVendas.reduce((total, dados) => total + parseFloat(dados.TOTALDESCONTO), 0);
  }

  const calcularTotalDescontoVendasEstruturaPorPagina = () => {
    let total = 0;
    const firstIndex = first * rows;
    const lastIndex = firstIndex + rows;
    for (let i = firstIndex; i < lastIndex && i < dadosVendasEstrutura.length; i++) {
      if (dadosVendasEstrutura[i]) {
        total += parseFloat(dadosVendasEstrutura[i].vendaMarca.TOTALDESCONTO);
      }
    }
    return total;
  }

  const calcularTotalVoucherVendasEstrutura = () => {
    return dadosEstruturaVendas.reduce((total, dados) => total + parseFloat(dados.VLVOUCHER), 0);
  }

  const calcularTotalVoucherVendasEstruturaPorPagina = () => {
    let total = 0;
    const firstIndex = first * rows;
    const lastIndex = firstIndex + rows;
    for (let i = firstIndex; i < lastIndex && i < dadosVendasEstrutura.length; i++) {
      if (dadosVendasEstrutura[i]) {
        total += parseFloat(dadosVendasEstrutura[i].vendaMarca.VLVOUCHER);
      }
    }
    return total;
  }


  const calcularTotalVendaBrutaDescontoPorPagina = () => {
    let total = 0;
    const firstIndex = first * rows;
    const lastIndex = firstIndex + rows;
    
    for (let i = firstIndex; i < lastIndex && i < dadosVendasEstrutura.length; i++) {
      if (dadosVendasEstrutura[i]) {
        total += parseFloat(dadosVendasEstrutura[i].vendaMarca.VRTOTALLIQUIDO);
      }
    }
    
    return total;
  };
  
  const calcularTotalVendaLiquidaEstrutura = () => {
    return dadosEstruturaVendas.reduce((total, dados) => total + parseFloat(dados.valorTotalLiquido), 0);
  }  

  const calcularTotalVendaLiquidaEstruturaPorPagina = () => {
    let total = 0;
    const firstIndex = first * rows;
    const lastIndex = firstIndex + rows;
    for (let i = firstIndex; i < lastIndex && i < dadosEstruturaVendas.length; i++) {
      if (dadosEstruturaVendas[i]) {
        total += parseFloat(dadosEstruturaVendas[i].valorTotalLiquido);
      }
    }
    return total;
  }

  const calcularTotalVendaBrutaDesconto = () => {
    return dadosEstruturaVendas.reduce((total, dados) => total + parseFloat(dados.VRTOTALLIQUIDO), 0);
  }

  const dadosExcell = dadosVendasEstrutura.map((item, index) => {
    let contador = index + 1;
    const valorTotalLiquido = calcularValorTotalLiquidoProduto(item);
    const percentualDescontoProduto = calcularPercentualDescontoProduto(item);

    return {
      contador,
      NOFANTASIA: item.vendaMarca.NOFANTASIA,
      GRUPO: item.vendaMarca.GRUPO,
      SUBGRUPO: item.vendaMarca.SUBGRUPO,
      MARCA: item.vendaMarca.MARCA,
      NUCODBARRAS: item.vendaMarca.NUCODBARRAS,
      DSNOME: item.vendaMarca.DSNOME,
      QTD: item.vendaMarca.QTD,
      TOTALBRUTO: item.vendaMarca.TOTALBRUTO,
      TOTALDESCONTO: item.vendaMarca.TOTALDESCONTO,
      percentualDescontoProduto: percentualDescontoProduto,
      VRTOTALLIQUIDO: item.vendaMarca.VRTOTALLIQUIDO,
      VLVOUCHER: item.vendaMarca.VLVOUCHER,
      valorTotalLiquido: valorTotalLiquido,
    }
  });

  const dadosEstruturaVendas = dadosVendasEstrutura.map((item, index) => {
    let contador = index + 1;
    const valorTotalLiquido = calcularValorTotalLiquidoProduto(item);
    const marckupProduto = calcularMarckup(item);
    const indicadorMarkupProduto = parseFloat(marckupProduto / 100);
    const indicadorVendaProduto = calcularIndicadorVendaProduto(item)
    const margemProduto = calcularMargemProduto(item);
    const custoPercentualProduto = calcularCustoPercentualProduto(item);
    const margemPercentualProduto = calcularMargemPercentualProduto(item);
    const percentualDescontoProduto = calcularPercentualDescontoProduto(item);
  


    return {
      contador,
      NOFANTASIA: item.vendaMarca.NOFANTASIA,
      GRUPO: item.vendaMarca.GRUPO,
      SUBGRUPO: item.vendaMarca.SUBGRUPO,
      MARCA: item.vendaMarca.MARCA,
      NUCODBARRAS: item.vendaMarca.NUCODBARRAS,
      DSNOME: item.vendaMarca.DSNOME,
      QTD: item.vendaMarca.QTD,
      TOTALBRUTO: item.vendaMarca.TOTALBRUTO,
      TOTALDESCONTO: item.vendaMarca.TOTALDESCONTO,
      percentualDescontoProduto: percentualDescontoProduto,
      VRTOTALLIQUIDO: item.vendaMarca.VRTOTALLIQUIDO,
      VLVOUCHER: item.vendaMarca.VLVOUCHER,
      valorTotalLiquido: valorTotalLiquido,

      // SUBGRUPO: item.vendaMarca.ESTRUTURA,
      TOTALCUSTO: item.vendaMarca.TOTALCUSTO,
      marckupProduto: marckupProduto,
      indicadorVendaProduto: indicadorVendaProduto,
      indicadorMarkupProduto: indicadorMarkupProduto,
      margemProduto: margemProduto,
      custoPercentualProduto: custoPercentualProduto,
      margemPercentualProduto: margemPercentualProduto,

    }
  });

  const colunasVendasEstutura = [
    {
      field: 'contador',
      header: 'Nº',
      body: row => <th>{row.contador}</th>,
      sortable: true,
    },
    {
      field: 'NOFANTASIA',
      header: 'Loja',
      body: row => <p style={{width: '150px', fontWeight: 600}}>{row.NOFANTASIA}</p>,
      sortable: true
    },
    {
      field: 'GRUPO',
      header: 'Grupo',
      body: row => <th>{row.GRUPO}</th>,
      sortable: true,
    },
    {
      field: 'SUBGRUPO',
      header: 'Sub Grupo',
      body: row => <th>{row.SUBGRUPO}</th>,
      sortable: true,
    },
    {
      field: 'MARCA',
      header: 'Marca',
      body: row => <th>{row.MARCA}</th>,
      sortable: true,
    },
    {
      field: 'NUCODBARRAS',
      header: 'Cód. Barras',
      body: row => <th>{row.NUCODBARRAS}</th>,
      sortable: true,
    },
    {
      field: 'DSNOME',
      header: 'Produto',
      body: row => <p style={{width: '150px', fontWeight: 600}}>{row.DSNOME}</p>,
      sortable: true,
    },
    {
      field: 'QTD',
      header: 'Total Quantidade',
      body: row => parseFloat(row.QTD),
      footer: () => {
        return (
          <div>
            <th style={{ fontWeight: 600, }}> {parseFloat(calcularTotalQuantidadeVendasEstruturaPorPagina())}</th>
            <hr />
            <th style={{ fontWeight: 600, }}>Total: {parseFloat(calcularTotalQuantidadeVendasEstrutura())}</th>
          </div>
        )
        
      },
    
      sortable: true,
    },
    {
      field: 'TOTALBRUTO',
      header: 'Venda Bruta(R$)',
      body: row => formatMoeda(row.TOTALBRUTO),
      footer: () => {
        return (
          <div>
            <th style={{ fontWeight: 600, }}>{formatMoeda(calcularTotalVendaBrutaVendasEstruturaPorPagina())}</th>
            <hr />
            <th style={{ fontWeight: 600, }}>Total: {formatMoeda(calcularTotalVendaBrutaVendasEstrutura())}</th>
          </div>
        )
      },
      sortable: true,
    },
    {
      field: 'TOTALDESCONTO',
      header: 'Desconto(R$)',
      body: row => formatMoeda(row.TOTALDESCONTO),
      footer: () => {
        return (
          <div>
            <th style={{ fontWeight: 600, }}> {formatMoeda(calcularTotalDescontoVendasEstruturaPorPagina())}</th>
            <hr />
            <th style={{ fontWeight: 600, }}>Total: {formatMoeda(calcularTotalDescontoVendasEstrutura())}</th>
          </div>
        )
      },

      sortable: true,
    },
    {
      field: 'percentualDescontoProduto',
      header: 'Desconto(%)',
      body: row => formatarPorcentagem(row.percentualDescontoProduto),
      sortable: true,
    },
    {
      field: 'VRTOTALLIQUIDO',
      header: 'Venda Bruta (Desc)',
      body: row => formatMoeda(row.VRTOTALLIQUIDO),
      footer: () => {
        return (
          <div>
            <th style={{ fontWeight: 600, }}>{formatMoeda(calcularTotalVendaBrutaDescontoPorPagina())}</th>
            <hr />
            <th style={{ fontWeight: 600, }}>Total: {formatMoeda(calcularTotalVendaBrutaDesconto())}</th>
          </div>
        )
      },
      sortable: true,
    },
    {
      field: 'VLVOUCHER',
      header: 'Voucher(R$)',
      body: row => formatMoeda(row.VLVOUCHER),
      footer: () => {
        return (
          <div>
            <th style={{ fontWeight: 600, }}> {formatMoeda(calcularTotalVoucherVendasEstruturaPorPagina())}</th>
            <hr />
            <th style={{ fontWeight: 600, }}>Total: {formatMoeda(calcularTotalVoucherVendasEstrutura())}</th>
          </div>
        )
      },
      sortable: true,
    },
    {
      field: 'valorTotalLiquido',
      header: 'Venda Líquida(R$)',
      body: row => formatMoeda(row.valorTotalLiquido),
      footer: () => {
        return (
          <div>
            <th style={{ fontWeight: 600, }}>{formatMoeda(calcularTotalVendaLiquidaEstruturaPorPagina())}</th>
            <hr />
            <th style={{ fontWeight: 600, }}>Total: {formatMoeda(calcularTotalVendaLiquidaEstrutura())} </th>
          </div>
        )
      },
      sortable: true,
    },

  ]

  return (

    <Fragment>
      <div className="panel">
        <div className="panel-hdr">
          <h2>Vendas por Estrutura</h2>
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
            title="Vendas por Estrutura"
            value={dadosEstruturaVendas}
            globalFilter={globalFilterValue}
            size={size}
            sortOrder={-1}
            paginator={true}
            onPage={onPageChange}
            first={first}
            rows={rows}
            selectionMode="single"
            selection={rowSelection}
            onSelectionChange={(e) => setRowSelection(e.value)}
            rowsPerPageOptions={[10, 20, 50, 100, dadosEstruturaVendas.length]}
            totalRecords={dadosEstruturaVendas.length}
            showGridlines
            stripedRows
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
          >
            {colunasVendasEstutura.map(coluna => (
              <Column
                key={coluna.field}
                field={coluna.field}
                header={coluna.header}

                body={coluna.body}
                footer={coluna.footer}
                sortable={coluna.sortable}
                headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
                footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem' }}
                bodyStyle={{ fontSize: '0.8rem' }}

              />
            ))}
          </DataTable>
        </div>
      
      </div>

    </Fragment>
  )

}
