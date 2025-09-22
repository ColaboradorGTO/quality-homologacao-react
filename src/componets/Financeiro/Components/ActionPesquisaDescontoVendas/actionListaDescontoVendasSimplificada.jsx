import { Fragment, useRef, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { toFloat } from "../../../../utils/toFloat"
import { formatMoeda } from "../../../../utils/formatMoeda"
import HeaderTable from "../../../Tables/headerTable";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

export const ActionListaDescontoVendasSimplificada = ({ dadosDescontoVendasSimplificado }) => {
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const dataTableRef = useRef();

  const onPageChange = (event) => {
    setFirst(event.first);
    setRows(event.rows);
  }  

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Desconto Vendas Simplificada',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Nº', 'Loja', 'Vl. Dinheiro', 'Vl. Cartão', 'Vl. Convênio', 'Vl. POS', 'Vl. Voucher', 'Vl. Bruto', 'Vl. Desconto Total', 'Vl. Desconto Funcionário', 'Vl. Desconto Cliente', 'Vl. Pago']],
      body: dadosListaDetalhada.map(item => [
        item.contador, 
        item.NOFANTASIA, 
        formatMoeda(item.VRRECDINHEIRO),
        formatMoeda(item.VRRECCARTAO),
        formatMoeda(item.VRRECCONVENIO),
        formatMoeda(item.VRRECPOS),
        formatMoeda(item.VRRECVOUCHER),
        formatMoeda(item.VALORTOTALPRODUTOBRUTO),
        formatMoeda(item.VLTOTALDESCONTOFUNCIONARIO),
        formatMoeda(item.VLTOTALDESCONTOCLIENTE),
        formatMoeda(item.VRDESCONTO),
        formatMoeda(item.TOTALLIQUIDO)
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('vendas_desconto_simplificada.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dadosExcel);
    const workbook = XLSX.utils.book_new();
    const header = ['Nº', 'Loja', 'Vl. Dinheiro', 'Vl. Cartão', 'Vl. Convênio', 'Vl. POS', 'Vl. Voucher', 'Vl. Bruto', 'Vl. Desconto Total', 'Vl. Desconto Funcionário', 'Vl. Desconto Cliente', 'Vl. Pago'];
    worksheet['!cols'] = [
      { wpx: 50, caption: 'Nº' }, 
      { wpx: 200, caption: 'Loja' }, 
      { wpx: 100, caption: 'Vl. Dinheiro' }, 
      { wpx: 100, caption: 'Vl. Cartão' }, 
      { wpx: 100, caption: 'Vl. Convênio' }, 
      { wpx: 100, caption: 'Vl. POS' }, 
      { wpx: 100, caption: 'Vl. Voucher' }, 
      { wpx: 100, caption: 'Vl. Bruto' }, 
      { wpx: 100, caption: 'Vl. Desconto Total' }, 
      { wpx: 100, caption: 'Vl. Desconto Funcionário' }, 
      { wpx: 100, caption: 'Vl. Desconto Cliente' }, 
      { wpx: 100, caption: 'Vl. Pago' }
      
    ]; 
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Desconto Vendas Simplificada');
    XLSX.writeFile(workbook, 'vendas_desconto_simplificada.xlsx');
  };
  
  const calcularTotalDinheiro = () => {
    let total = 0;
    for (let dado of dadosDescontoVendasSimplificado) {
      total += toFloat(dado.VRRECDINHEIRO)
    }
    return total;
  }

  const calcularTotalCartao = () => {
    let total = 0;
    for (let dado of dadosDescontoVendasSimplificado) {
      total += toFloat(dado.VRRECCARTAO)
    }
    return total;
  }

  const calcularTotalConvenio = () => {
    let total = 0;
    for (let dado of dadosDescontoVendasSimplificado) {
      total += toFloat(dado.VRRECCONVENIO)
    }
    return total;
  }

  const calcularTotalPos = () => {
    let total = 0;
    for (let dado of dadosDescontoVendasSimplificado) {
      total += toFloat(dado.VRRECPOS)
    }
    return total;
  }

  const calcularTotalVoucher = () => {
    let total = 0;
    for (let dado of dadosDescontoVendasSimplificado) {
      total += toFloat(dado.VRRECVOUCHER)
    }
    return total;
  }

  const calcularTotalBruto = () => {
    let total = 0;
    for (let dado of dadosDescontoVendasSimplificado) {
      total += toFloat(dado.VALORTOTALPRODUTOBRUTO)
    }
    return total;
  }

  const calcularTotalDesconto = () => {
    let total = 0;
    for (let dado of dadosDescontoVendasSimplificado) {
      total += toFloat(dado.VRDESCONTO)
    }
    return total;
  }

  const calcularTotalDescontoFuncionario = () => {
    let total = 0;
    for (let dado of dadosDescontoVendasSimplificado) {
      total += toFloat(dado.VLTOTALDESCONTOFUNCIONARIO)
    }
    return total;
  }

  const calcularTotalDescontoCliente = () => {
    let total = 0;
    for (let dado of dadosDescontoVendasSimplificado) {
      total += toFloat(dado.VLTOTALDESCONTOCLIENTE)
    }
    return total;
  }

  const calcularTotalLiquido = () => {
    let total = 0;
    for (let dado of dadosDescontoVendasSimplificado) {
      total += toFloat(dado.TOTALLIQUIDO)
    }
    return total;
  }

  // const calcularTotal = () => {
  //   let total = dadosDescontoVendasSimplificado[0]?.VLTOTALVENDIDO;
  //   return total;
  // }

  const dadosExcel = Array.isArray(dadosDescontoVendasSimplificado) ? dadosDescontoVendasSimplificado.map((item, index) => {
    let contador = index + 1;
    return {
      contador,
      NOFANTASIA: item.NOFANTASIA,
      VRRECDINHEIRO: formatMoeda(item.VRRECDINHEIRO),
      VRRECCARTAO: formatMoeda(item.VRRECCARTAO),
      VRRECCONVENIO: formatMoeda(item.VRRECCONVENIO),
      VRRECPOS: formatMoeda(item.VRRECPOS),
      VRRECVOUCHER: formatMoeda(item.VRRECVOUCHER),
      VALORTOTALPRODUTOBRUTO: formatMoeda(item.VALORTOTALPRODUTOBRUTO),
      VLTOTALDESCONTOFUNCIONARIO: formatMoeda(item.VLTOTALDESCONTOFUNCIONARIO),
      VLTOTALDESCONTOCLIENTE: formatMoeda(item.VLTOTALDESCONTOCLIENTE),
      VRDESCONTO: formatMoeda(item.VRDESCONTO),
      TOTALLIQUIDO: formatMoeda(item.TOTALLIQUIDO),

    }
  }) : [];

  const dadosListaDetalhada = dadosDescontoVendasSimplificado.map((item, index) => {
    let contador = index + 1;
    const percentualDinheiro = ((parseFloat(item.VRRECDINHEIRO) * 100) / (parseFloat(item.VLTOTALVENDIDO)));
    const percentualCartao = ((parseFloat(item.VRRECCARTAO) * 100) / (parseFloat(item.VLTOTALVENDIDO)));
    const percentualConvenio = ((parseFloat(item.VRRECCONVENIO) * 100) / (parseFloat(item.VLTOTALVENDIDO)));
    const percentualPos = ((parseFloat(item.VRRECPOS) * 100) / (parseFloat(item.VLTOTALVENDIDO)));
    const percentualVoucher = ((parseFloat(item.VRRECVOUCHER) * 100) / (parseFloat(item.VLTOTALVENDIDO)));
    const percentualBruto = ((parseFloat(item.VALORTOTALPRODUTOBRUTO) * 100) / (parseFloat(item.VLTOTALVENDIDO)));
    const percentualDesconto = ((parseFloat(item.VRDESCONTO) * 100) / (parseFloat(item.VLTOTALVENDIDO)));
    const percentualDescontoFuncionario = ((parseFloat(item.VLTOTALDESCONTOFUNCIONARIO) * 100) / (parseFloat(item.VLTOTALVENDIDO)));
    const percentualDescontoCliente = ((parseFloat(item.VLTOTALDESCONTOCLIENTE) * 100) / (parseFloat(item.VLTOTALVENDIDO)));
    const percentualLiquido = ((parseFloat(item.TOTALLIQUIDO) * 100) / (parseFloat(item.VLTOTALVENDIDO)));

    return {
      IDVENDA: item.IDVENDA,
      DTHORAFECHAMENTO: item.DTHORAFECHAMENTO,
      NOFANTASIA: item.NOFANTASIA,
      DSCAIXAFECHAMENTO: item.DSCAIXAFECHAMENTO,
      MATOPERADORFECHAMENTO: item.MATOPERADORFECHAMENTO,
      OPERADORFECHAMENTO: item.OPERADORFECHAMENTO,
      VRRECDINHEIRO: item.VRRECDINHEIRO,
      VRRECCARTAO: item.VRRECCARTAO,
      VRRECCONVENIO: item.VRRECCONVENIO,
      VRRECPOS: item.VRRECPOS,
      VRRECVOUCHER: item.VRRECVOUCHER,
      VALORTOTALPRODUTOBRUTO: item.VALORTOTALPRODUTOBRUTO,
      VRDESCONTO: item.VRDESCONTO,
      VLTOTALDESCONTOFUNCIONARIO: item.VLTOTALDESCONTOFUNCIONARIO,
      VLTOTALDESCONTOCLIENTE: item.VLTOTALDESCONTOCLIENTE,
      TOTALLIQUIDO: item.TOTALLIQUIDO,
      VLTOTALVENDIDO: item.VLTOTALVENDIDO,
      percentualDinheiro: percentualDinheiro,
      percentualCartao: percentualCartao,
      percentualConvenio: percentualConvenio,
      percentualPos: percentualPos,
      percentualVoucher: percentualVoucher,
      percentualBruto: percentualBruto,
      percentualDesconto: percentualDesconto,
      percentualDescontoFuncionario: percentualDescontoFuncionario,
      percentualDescontoCliente: percentualDescontoCliente,
      percentualLiquido: percentualLiquido,

      contador
    }
  })
  
  const calcularTotal = (field) => {
    const firstIndex = first * rows;
    const lastIndex = firstIndex + rows;
    const dataPaginada = dadosListaDetalhada.slice(firstIndex, lastIndex); 
    return dataPaginada.reduce((total, item) => total + parseFloat(item[field]), 0);
  };

  const calcularTotalDinheiroPercentual = () => {
    const totalDinheiro = calcularTotal('VRRECDINHEIRO');
    const totalVendas = calcularTotal('VLTOTALVENDIDO');
    const percentualDinheiroVenda = (totalDinheiro * 100) / totalVendas;
    return `${formatMoeda(totalDinheiro)} (${percentualDinheiroVenda.toFixed(4)}%) do total bruto da venda`;
  };


  const calcularPercentualDinheiro = () => {
    let total = 0;
    for (let vendas of dadosListaDetalhada) {
      total += parseFloat(vendas.VLTOTALVENDIDO);
    }
    console.log(total, 'total')
    return total;
  }

  const calcularPercentualCartao = (item) => {
    let total = 0;
    for (let vendas of dadosListaDetalhada) {
      total += parseFloat(vendas.percentualCartao);
    }
    return total;
  }

  const calcularPercentualConvenio = (item) => {
    let total = 0;
    for (let vendas of dadosListaDetalhada) {
      total += parseFloat(vendas.percentualConvenio);
    }
    return total;
  }

  const calcularPercentualPos = (item) => {
    let total = 0;
    for (let vendas of dadosListaDetalhada) {
      total += parseFloat(vendas.percentualPos);
    }
    return total;
  }

  const calcularPercentualVoucher = (item) => {
    let total = 0;
    for (let vendas of dadosListaDetalhada) {
      total += parseFloat(vendas.percentualVoucher);
    }
    return total;
  }

  const calcularPercentualBruto = (item) => {
    let total = 0;
    for (let vendas of dadosListaDetalhada) {
      total += parseFloat(vendas.percentualBruto);
    }
    return total;
  }

  const calcularPercentualDesconto = (item) => {
    let total = 0;
    for (let vendas of dadosListaDetalhada) {
      total += parseFloat(vendas.percentualDesconto);
    }
    return total;
  }

  const calcularPercentualDescontoFuncionario = (item) => {
    let total = 0;
    for (let vendas of dadosListaDetalhada) {
      total += parseFloat(vendas.percentualDescontoFuncionario);
    }
    return total;
  }

  const calcularPercentualDescontoCliente = (item) => {
    let total = 0;
    for (let vendas of dadosListaDetalhada) {
      total += parseFloat(vendas.percentualDescontoCliente);
    }
    return total;
  }

  const calcularPercentualLiquido = (item) => {
    let total = 0;
    for (let vendas of dadosListaDetalhada) {
      total += parseFloat(vendas.percentualLiquido);
    }
    return total;
  }
  const colunasDetalhada = [
    {
      field: 'contador',
      header: 'Nº',
      body: row => row.contador,
      sortable: true,
    },
    {
      field: 'NOFANTASIA',
      header: 'Loja',
      body: row => {return <th style={{width: 150, margin: 0}}>{row.NOFANTASIA}</th>},
      footer: (row) => {
        return (
          <div>
            <th style={{ fontWeight: 600 }}>Total Venda Bruta do Período</th>
            <hr />
            <th style={{ fontWeight: 600 }}>{formatMoeda(calcularPercentualDinheiro())}</th>
          </div>
        )
      },
      sortable: true,
    },
    {
      field: 'VRRECDINHEIRO',
      header: 'Vl. Dinheiro',
      body: row => {return <th style={{width: 150, margin: 0}}>{formatMoeda(row.VRRECDINHEIRO)}</th>},
      footer: (row) => {
        return (
          <div>
            <p style={{ fontWeight: 600 }}>{calcularTotalDinheiroPercentual()}</p>
            {/* <p style={{ fontWeight: 600 }}>{formatMoeda(calcularTotalDinheiro())}</p> */}
            <hr />
            {/* <p style={{ fontWeight: 600 }}>{parseFloat(calcularPercentualDinheiro().toFixed(6))} % do total bruto da venda</p> */}
          </div>
        )
      },
      sortable: true,
    },
    {
      field: 'VRRECCARTAO',
      header: 'Vl. Cartão',
      body: row => {return <th style={{width: 150, margin: 0}}>{formatMoeda(row.VRRECCARTAO)}</th>},
      footer: (row) => {
        return (
          <div>
            <p style={{ fontWeight: 600 }}>{formatMoeda(calcularTotalCartao())}</p>
            <hr style={{ color: 'black', fontSize: "5px" }} />
            <p style={{ fontWeight: 600 }}>{parseFloat(calcularPercentualCartao().toFixed(6))} % do total bruto da venda</p>
          </div>
        )
      },
      sortable: true,
    },
    {
      field: 'VRRECCONVENIO',
      header: 'Vl. Convênio',
      body: row => {return <th style={{width: 150, margin: 0}}>{formatMoeda(row.VRRECCONVENIO)}</th>},
      footer: (row) => {
        return (
          <div>
            <p style={{ fontWeight: 600 }}>{formatMoeda(calcularTotalConvenio())}</p>
            <hr />
            <p style={{ fontWeight: 600 }}>{parseFloat(calcularPercentualConvenio().toFixed(6))} % do total bruto da venda</p>
          </div>
        )
      },
      sortable: true,
    },
    {
      field: 'VRRECPOS',
      header: 'Vl. POS',
      body: row => {return <th style={{width: 150, margin: 0}}>{formatMoeda(row.VRRECPOS)}</th>},
      footer: (row) => {
        return (
          <div>
            <p style={{ fontWeight: 600 }}>{formatMoeda(calcularTotalPos())}</p>
            <hr />
            <p style={{ fontWeight: 600 }}>{parseFloat(calcularPercentualPos().toFixed(6))} % do total bruto da venda</p>
          </div>
        )
      },
      sortable: true,
    },
    {
      field: 'VRRECVOUCHER',
      header: 'Vl. Voucher',
      body: row => {return <th style={{width: 150, margin: 0}}>{formatMoeda(row.VRRECVOUCHER)}</th>},
      footer: (row) => {
        return (
          <div>
            <p style={{ fontWeight: 600 }}>{formatMoeda(calcularTotalVoucher())}</p>
            <hr />
            <p style={{ fontWeight: 600 }}>{parseFloat(calcularPercentualVoucher().toFixed(6))} % do total bruto da venda</p>
          </div>
        )
      },
      sortable: true,
    },
    {
      field: 'VALORTOTALPRODUTOBRUTO',
      header: 'Vl. Bruto',
      body: row => {return <th style={{width: 150, margin: 0}}>{formatMoeda(row.VALORTOTALPRODUTOBRUTO)}</th>},
      footer: (row) => {
        return (
          <div>
            <p style={{ fontWeight: 600 }}>{formatMoeda(calcularTotalBruto())}</p>
            <hr />
            <p style={{ fontWeight: 600 }}>{parseFloat(calcularPercentualBruto().toFixed(6))} % do total bruto da venda</p>
          </div>
        )
      },
      sortable: true,
    },
    {
      field: 'VLTOTALDESCONTOFUNCIONARIO',
      header: 'Vl. Desc. Func.',
      body: row => {return <th style={{width: 150, margin: 0}}>{formatMoeda(row.VLTOTALDESCONTOFUNCIONARIO)}</th>},
      footer: (row) => {
        return (
          <div>
            <p style={{ fontWeight: 600 }}>{formatMoeda(calcularTotalDescontoFuncionario())}</p>
            <hr />
            <p style={{ fontWeight: 600 }}>{parseFloat(calcularPercentualDescontoFuncionario().toFixed(6))} % do total bruto da venda</p>
          </div>
        )
      },
      sortable: true,
    },
    {
      field: 'VLTOTALDESCONTOCLIENTE',
      header: 'Vl. Desc. Cliente',
      body: row => {return <th style={{width: 150, margin: 0}}>{formatMoeda(row.VLTOTALDESCONTOCLIENTE)}</th>},
      footer: (row) => {
        return (
          <div>
            <p style={{ fontWeight: 600 }}>{formatMoeda(calcularTotalDescontoCliente())}</p>
            <hr />
            <p style={{ fontWeight: 600 }}>{parseFloat(calcularPercentualDescontoCliente().toFixed(6))} % do total bruto da venda</p>
          </div>
        )
      },
      sortable: true,
    },
    {
      field: 'VRDESCONTO',
      header: 'Vl. Desconto Total',
      body: row => {return <th style={{width: 150, margin: 0}}>{formatMoeda(row.VRDESCONTO)}</th>},
      footer: (row) => {
        return (
          <div>
            <p style={{ fontWeight: 600 }}>{formatMoeda(calcularTotalDesconto())}</p>
            <hr />
            <p style={{ fontWeight: 600 }}>{parseFloat(calcularPercentualDesconto().toFixed(6))} % do total bruto da venda</p>
          </div>
        )
      },
      sortable: true,
    },
    {
      field: 'TOTALLIQUIDO',
      header: 'Vl. Pago',
      body: row => {return <th style={{width: 150, margin: 0}}>{formatMoeda(row.TOTALLIQUIDO)}</th>},
      footer: (row) => {
        return (
          <div>
            <p style={{ fontWeight: 600 }}>{formatMoeda(calcularTotalLiquido())}</p>
            <hr />
            <p style={{ fontWeight: 600 }}>{parseFloat(calcularPercentualLiquido().toFixed(6))} % do total bruto da venda</p>
          </div>
        )
      },
      sortable: true,
    }
  ]

  return (

    <Fragment>
      <div className="panel">
        <div className="panel-hdr">
          <h2>
            Lista de Pesquisa Simplificada
          </h2>
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
        <div className="card">
          <DataTable
            title="Lista Simplificada"
            value={dadosListaDetalhada}
            globalFilter={globalFilterValue}
            size={"small"}
            sortOrder={-1}
            paginator={true}
            first={first}
            rows={rows}
            onPage={onPageChange}
            rowsPerPageOptions={[5, 10, 20, 50, 100, dadosListaDetalhada.length]}
            showGridlines
            stripedRows
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado </div>}
          >
            {colunasDetalhada.map(coluna => (
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

