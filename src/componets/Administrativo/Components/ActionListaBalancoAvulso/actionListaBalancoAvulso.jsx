import { Fragment, useEffect, useRef, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ButtonTable } from "../../../ButtonsTabela/ButtonTable";
import { formatMoeda } from "../../../../utils/formatMoeda";
import { FaMinus } from "react-icons/fa";
import { BsTrash3 } from "react-icons/bs";
import { post, put } from "../../../../api/funcRequest";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import HeaderTable from "../../../Tables/headerTable";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import 'jspdf-autotable';

export const ActionListaBalancoAvulso = ({ dadosBalancoAvulso, usuarioLogado, optionsModulos,   refetch }) => {
  const [ipUsuario, setIpUsuario] = useState('')
  const [quantidade, setQuantidade] = useState(0)

  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const navigate = useNavigate();
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
    documentTitle: 'Produtos Balanço',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Produto', 'Cod. Barra', 'Descrição', 'R$ Custo', 'R$ Venda', 'Qtd']],
      body: dados.map(item => [
        item.IDPRODUTO,
        item.NUCODBARRAS,
        item.DSNOME,
        formatMoeda(item.PRECOCUSTO),
        formatMoeda(item.PRECOVENDA),
        item.TOTALCONTAGEMGERAL,

      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('lista_produtos_balanco.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    const header = ['Produto', 'Cod. Barra', 'Descrição', 'R$ Custo', 'R$ Venda', 'Qtd'];
    worksheet['!cols'] = [
      { wpx: 100, caption: 'Produto' },
      { wpx: 100, caption: 'Cod. Barras' },
      { wpx: 250, caption: 'Descrição' },
      { wpx: 100, caption: 'R$ Venda' },
      { wpx: 100, caption: 'R$ Custo' },
      { wpx: 100, caption: 'Qtd' }
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Produtos Balanço');
    XLSX.writeFile(workbook, 'lista_produtos_balanco.xlsx');
  };


  useEffect(() => {
    getIPUsuario();
  }, [usuarioLogado]);

  const getIPUsuario = async () => {
    const response = await axios.get('http://ipwho.is/')
    if (response.data) {
      setIpUsuario(response.data.ip);
    }
    return response.data;
  }

  const calcularTotalCusto = () => {
    let total = 0;
    for (let dados of dadosBalancoAvulso) {
      total += parseFloat(dados.PRECOCUSTO);
    }
    return total;
  }

  const calcularTotalVenda = () => {
    let total = 0;
    for (let dados of dadosBalancoAvulso) {
      total += parseFloat(dados.PRECOVENDA);
    }
    return total;
  }

  const calcularTotalQtd = () => {
    let total = 0;
    for (let dados of dadosBalancoAvulso) {
      total += parseFloat(dados.TOTALCONTAGEMGERAL);
    }
    return total;
  }

  const dados = dadosBalancoAvulso.map((item) => {
    let listarDetalheBalanco = 1;
    return {
      IDPRODUTO: item.IDPRODUTO,
      NUCODBARRAS: item.NUCODBARRAS,
      DSNOME: item.DSNOME,
      PRECOCUSTO: parseFloat(item.PRECOCUSTO),
      PRECOVENDA: item.PRECOVENDA,
      TOTALCONTAGEMGERAL: item.TOTALCONTAGEMGERAL,
      listarDetalheBalanco: listarDetalheBalanco,
    }
  });

  const colunasVendas = [

    {
      field: 'IDPRODUTO',
      header: 'Produto',
      body: row => <th> {row.IDPRODUTO}</th>,
      sortable: true,
    },
    {
      field: 'NUCODBARRAS',
      header: 'Cód. Barras',
      body: row => <th> {row.NUCODBARRAS}</th>,
      sortable: true,
    },
    {
      field: 'DSNOME',
      header: 'Descrição',
      body: row => <th> {row.DSNOME}</th>,
      footer: 'Total',
      sortable: true,
    },
    {
      field: 'PRECOCUSTO',
      header: 'R$ Custo',
      body: row => <th> {formatMoeda(row.PRECOCUSTO)}</th>,
      footer: formatMoeda(calcularTotalCusto()),
      sortable: true,
    },
    {
      field: 'PRECOVENDA',
      header: 'R$ Venda',
      body: row => <th> {formatMoeda(row.PRECOVENDA)}</th>,
      footer: formatMoeda(calcularTotalVenda()),
      sortable: true,
    },
    {
      field: 'TOTALCONTAGEMGERAL',
      header: 'Qtd',
      body: row => <th> {row.TOTALCONTAGEMGERAL}</th>,
      footer: calcularTotalQtd(),
      sortable: true,
    },
    {
      header: 'Opções',
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      body: (row) => {
        return (
          <div className="d-flex "
            style={{ justifyContent: "space-between" }}
          >
            <div>
              <ButtonTable
                titleButton={"Diminuir Quantidade"}
                Icon={FaMinus}
                cor={"dark"}
                iconSize={20}
                width="30px"
                height="30px"
                onClickButton={() => {
                  onSubmit(row.IDPRODUTO, -1);
                }}
                onChange={(e) => setQuantidade(e.target.value)}
              />
            </div>
            <div className="ml-2">
              <ButtonTable
                titleButton={"Excluir Produto"}
                Icon={BsTrash3}
                cor={"danger"}
                iconSize={20}
                width="30px"
                height="30px"
                onClickButton={() => {
                  onSubmit(row.IDPRODUTO, 0);

                }}
              />
            </div>

          </div>
        )
      },
    },
  ]

  const onSubmit = async (idProduto, quantidadeAlterada) => {
    const produto = dadosBalancoAvulso.find(item => item.IDPRODUTO === idProduto);

    let novaQuantidade = produto.TOTALCONTAGEMGERAL + quantidadeAlterada;

    if (quantidadeAlterada === 0) {
      novaQuantidade = 0;
    }

    const putData = {
      "IDEMPRESA": Number(dadosBalancoAvulso[0].IDEMPRESA),
      "NUMEROCOLETOR": Number(usuarioLogado.id),
      "DSCOLETOR": usuarioLogado.nome,
      "IDPRODUTO": produto.IDPRODUTO,
      "TOTALCONTAGEMGERAL": Number(novaQuantidade),

    }

    try {
      const response = await put('/detalhe-balanco-avulso/:id', putData)

      const textDados = JSON.stringify(putData)
      let textoFuncao = 'ADMINISTRATIVO/ALTERANDO QUANTIDADE DE PRODUTO NO BALANÇO AVULSO';


      const postData = {
        IDFUNCIONARIO: String(usuarioLogado.id),
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario
      }

      const responsePost = await post('/log-web', postData)

      Swal.fire({
        title: 'Atualização',
        text: 'Quantidade do produto atualizada com sucesso',
        icon: 'success'
      })


      refetch()
      return responsePost.data;

    } catch (error) {
      const textDados = JSON.stringify(putData)
      let textoFuncao = 'ADMINISTRATIVO/ALTERANDO QUANTIDADE DE PRODUTO NO BALANÇO AVULSO';

      const postData = {
        IDFUNCIONARIO: String(usuarioLogado.id),
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario
      }

      const responsePost = await post('/log-web', postData)

      Swal.fire({
        title: 'Atualização',
        text: 'Erro ao atualizar o quantidade do produto',
        icon: 'error'
      })
      return responsePost.data;

    }

  }


  return (

    <Fragment>
      <div className="panel">
        <div className="panel-hdr">
          <h2> Lista de Produtos Balanço</h2>
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
            sortField="VRTOTALPAGO"
            sortOrder={-1}
            paginator={true}
            rows={10}
            rowsPerPageOptions={[10, 20, 50, 100, dados.length]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
            filterDisplay="menu"
            showGridlines
            stripedRows
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
          >
            {colunasVendas.map(coluna => (
              <Column
                key={coluna.field}
                field={coluna.field}
                header={coluna.header}

                body={coluna.body}
                footer={coluna.footer}
                sortable={coluna.sortable}
                headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '1rem' }}
                footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem' }}
                bodyStyle={{ fontSize: '1rem' }}

              />
            ))}
          </DataTable>
        </div>
      </div>
    </Fragment>
  )
}
