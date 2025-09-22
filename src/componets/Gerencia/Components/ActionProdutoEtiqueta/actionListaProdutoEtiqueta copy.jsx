import { Fragment, useEffect, useRef, useState } from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { formatMoeda } from "../../../../utils/formatMoeda";
import HeaderTable from "../../../Tables/headerTable";
import { ActionDetalharProdutosEtiquetaModal } from "./actionDetalharProdutosEtiquetaModal";
import { BsTrash3 } from "react-icons/bs";
import { ButtonType } from "../../../Buttons/ButtonType";
import { GoDownload } from "react-icons/go";
import { MdOutlineLocalPrintshop } from "react-icons/md";
import Swal from "sweetalert2";
import { useReactToPrint } from "react-to-print";
import jsPDF from "jspdf";
import * as XLSX from 'xlsx';


export const ActionListaProdutoEtiqueta = ({ dadosListaPrecosSap }) => {
  const [quantidades, setQuantidades] = useState({});
  const [produtosSelecionados, setProdutosSelecionados] = useState([]);
  const [dadosAcumuladorEiquetas,  setDadosAcumuladorEtiquetas] = useState([]);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [selectAll, setSelectAll] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [modalImprimir, setModalImprimir] = useState(null)
  const dataTableRef = useRef();

  const setQtdProduto = (idProduto, novaQuantidade) => {
    setProdutosSelecionados((prevProdutos) => {
      const produtoExiste = prevProdutos.some((produto) => produto.IDPRODUTO === idProduto);

      if (!produtoExiste) {
        return [...prevProdutos, { IDPRODUTO: idProduto, quantidade: Number(novaQuantidade) }];
      }

      return prevProdutos.map((produto) =>
        produto.IDPRODUTO === idProduto
          ? { ...produto, quantidade: Number(novaQuantidade) }
          : produto
      );
    });
  };

  useEffect(() => {
    setProdutosSelecionados(prevProdutos =>
      prevProdutos.map(prod => ({
        ...prod,
        quantidade: quantidades[prod.IDPRODUTO] || prod.quantidade
      }))
    );
  }, [quantidades]);


  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Lista de Produtos',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Nº', 'Cod Barras', 'Produto', 'Tamanho', 'Quantidade', 'PR. Venda', 'Grupo', 'Estilo', 'Marca']],
      body: dadosFiltrados.map(item => [
        item.contador,
        item.NUCODBARRAS,
        item.DSNOME,
        item.TAMANHO,
        item.quantidade,
        formatMoeda(item.PRECOVENDA),
        item.DSLISTAPRECO,
        item.DSESTILO,
        item.MARCA
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('lista_produtos.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dadosFiltrados);
    const workbook = XLSX.utils.book_new();
    const header = ['Nº', 'Cod Barras', 'Produto', 'Tamanho', 'Quantidade', 'PR. Venda', 'Grupo', 'Estilo', 'Marca'];
    worksheet['!cols'] = [
      { wpx: 70, caption: 'Nº' },
      { wpx: 100, caption: 'Cod Barras'},
      { wpx: 200, caption: 'Produto' },
      { wpx: 70, caption: 'Tamanho' },
      { wpx: 50, caption: 'Quantidade' },
      { wpx: 100, caption: 'PR. Venda' },
      { wpx: 200, caption: 'Grupo' },
      { wpx: 200, caption: 'Estilo' },
      { wpx: 100, caption: 'Marca' },
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Lista de Produtos');
    XLSX.writeFile(workbook, 'lista_produtos.xlsx');
  };

  const filtrarDados = (dados) => {
    return dados.filter(item => {
      if (!item.STCANCELADO) {
        return true;
      } else if (item.STTRANSFORMADO) {
        return true;
      }
      return false;
    }).map((item, index) => {
      let contador = index + 1;
      let quantidade = 1;
      if (!item.STCANCELADO) {
        return {
          contador,
          NUCODBARRAS: item.NUCODBARRAS,
          DSNOME: item.DSNOME,
          TAMANHO: item.TAMANHO,
          quantidade,
          PRECOVENDA: item.PRECOVENDA,
          DSLISTAPRECO: item.DSLISTAPRECO,
          DSESTILO: item.DSESTILO || '',
          MARCA: item.MARCA || '',
          IDPRODUTO: item.IDPRODUTO,
          // TAMANHO: (item.TAMANHO.split(' ').pop()).toUpperCase().replace(/[^\w\s]/gi, ''),
          STCANCELADO: item.STCANCELADO,
          STATIVO: item.STATIVO === 'True' ? 'Ativo' : 'Inativo'
        };
      } else if (item.STTRANSFORMADO) {
        return {
          contador,
          NUCODBARRAS: item.CODBARRAS,
          DSNOME: item.DSPRODUTO,
          TAMANHO: item.DSTAMANHO.toUpperCase(),
          quantidade,
          PRECOVENDA: item.VRUNITLIQDETALHEPEDIDO,
          DSLISTAPRECO: item.IDSUBGRUPOEMPRESARIAL == 1 ? 'Tesoura' : item.IDSUBGRUPOEMPRESARIAL == 2 ? 'Magazine' : item.IDSUBGRUPOEMPRESARIAL == 3 ? 'Yorus' : 'Free Center',
          DSESTILO: item.DSESTILO ? item.DSESTILO : item.SUBGRUPO,
          MARCA: item.MARCA || '',
          IDPRODUTO: item.IDPRODUTO,
          STRANSFRMADO: item.STTRANSFORMADO,
          STATIVO: item.STATIVO === 'True' ? 'Ativo' : 'Inativo'
        };
      }
      return null;
    });
  };

  const dadosFiltrados = filtrarDados(dadosListaPrecosSap);

  const colunasListaProdEtiquetas = [
    {
      field: 'IDPRODUTO',
      header: (
        <div>
          <label>{selectAll ? 'Desmarcar Todos' : 'Marcar Todos'}</label>
          <input
            type="checkbox"
            checked={selectAll}
            onChange={(e) => handleSelectAll(e.target.checked)}
          />
        </div>
      ),
      body: (rowData) => {
        return (
          <div>
            <input
              type="checkbox"
              checked={selectedIds.includes(rowData.IDPRODUTO)}
              onChange={(e) => {
                const isChecked = e.target.checked
                const updatedSelectedIds = e.target.checked
                  ? [...selectedIds, rowData.IDPRODUTO]
                  : selectedIds.filter(id => id !== rowData.IDPRODUTO);
                setSelectedIds(updatedSelectedIds);
                setQtdProduto(rowData.IDPRODUTO, isChecked)
                setSelectAll(updatedSelectedIds.length === dadosFiltrados.length);
                setProdutosSelecionados(isChecked ? [...produtosSelecionados, rowData] : produtosSelecionados.filter(item => item.IDPRODUTO !== rowData.IDPRODUTO));
              }}

            />
          </div>
        );
      }
    },
    {
      field: 'contador',
      header: 'Nº',
      body: (row) => <th>{row.contador}</th>,
      sortable: true
    },
    {
      field: 'NUCODBARRAS',
      header: 'Cód Barras',
      body: row => <th>{row.NUCODBARRAS}</th>,
      sortable: true
    },
    {
      field: 'DSNOME',
      header: 'Produto',
      body: row => <th>{row.DSNOME}</th>,
      sortable: true
    },
    {
      field: 'TAMANHO',
      header: 'Tamanho',
      body: row => <th>{row.TAMANHO}</th>,
      sortable: true
    },
    {
      field: 'quantidade',
      header: 'Quantidade',
      body: (row) => {
        return (
          <div style={{ background: '', width: '50%' }}>
            <input
              type="number"
              value={quantidades[row.IDPRODUTO] || row.quantidade}
              onChange={(e) => {
                const novaQuantidade = parseInt(e.target.value, 10) || 1;
                setQuantidades(prev => ({ ...prev, [row.IDPRODUTO]: novaQuantidade }));

                setProdutosSelecionados(prevProdutos =>
                  prevProdutos.map(prod =>
                    prod.IDPRODUTO === row.IDPRODUTO
                      ? { ...prod, quantidade: novaQuantidade }
                      : prod
                  )
                );
              }}
              style={{ width: '100%' }}
            />
          </div>
        );
      }
    },
    {
      field: 'PRECOVENDA',
      header: 'PR. Venda',
      body: row => <th>{formatMoeda(row.PRECOVENDA)}</th>,
      sortable: true
    },
    {
      field: 'DSLISTAPRECO',
      header: 'Grupo',
      body: row => <th>{row.DSLISTAPRECO}</th>,
      sortable: true
    },
    {
      field: 'DSESTILO',
      header: 'Estilo',
      body: row => <th>{row.DSESTILO}</th>,
      sortable: true
    },
    {
      field: 'MARCA',
      header: 'Marca',
      body: row => <th>{row.MARCA}</th>,
      sortable: true
    },
    {
      field: 'STATIVO',
      header: 'Status',
      body: row => <th style={{ color: row.STATIVO === 'Ativo' ? 'blue' : 'red' }}>{row.STATIVO}</th>,
      sortable: true
    },
  ];

  const handleSelectAll = (isChecked) => {
    setSelectAll(isChecked);
    const updatedSelectedIds = isChecked ? dadosFiltrados.map(item => item.IDPRODUTO) : [];
    setSelectedIds(updatedSelectedIds);
    setProdutosSelecionados(isChecked ? dadosFiltrados.map(item => ({ ...item, quantidade: qtdProduto })) : []);
  };

  const handleCancelar = (isChecked) => {
    setSelectAll(isChecked);
    const updatedSelectedIds = isChecked ? [] : [];
    setSelectedIds(updatedSelectedIds);
    setProdutosSelecionados([]);
    Swal.fire({
      icon: 'success',
      title: 'Cancelado com sucesso',
      showConfirmButton: false,
      timer: 1500
    })
  }


  // salvar o produto selecionado no dadosAcumuladorEtiquetas envia para a imprimir
  const handleAcumuladorEtiquetas = async () => {
    if (parseFloat(produtosSelecionados.length) > 0) {
      try {
        setDadosAcumuladorEtiquetas(produtosSelecionados);
        Swal.fire({
          icon: "success",
          title: "Dados Salvos",
          text: "Os dados foram salvos com sucesso!",
        })
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Valor Inválido",
          text: "O valor deve ser maior que 0 para imprimir etiquetas!",
        });
      }
    }
  };
  const handleImprimir = () => {
    setModalImprimir(true);
  }

  return (
    <Fragment>
      <div className="row mb-4">
        <ButtonType
          Icon={MdOutlineLocalPrintshop}
          iconSize="16px"
          textButton="Imprimir"
          cor="primary"
          tipo="button"
          onClickButtonType={() => handleImprimir()}
        />
        <ButtonType
          Icon={GoDownload}
          iconSize="16px"
          textButton="Guardar"
          cor="success"
          tipo="button"
          onClickButtonType={() => handleAcumuladorEtiquetas()}
        />
        <ButtonType
          Icon={BsTrash3}
          iconSize="16px"
          textButton="Cancelar"
          cor="danger"
          tipo="button"
          onClickButtonType={() => handleCancelar()}
        />
      </div>

      <div className="panel">

        <div className="panel-hdr">
          <h2>Lista de Produtos </h2>
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
        <div className="card" ref={dataTableRef} style={{ marginTop: "1rem" }}>
          <DataTable
            value={dadosFiltrados}
            globalFilter={globalFilterValue}
            size="small"
            selectionMode={'single'}
            sortOrder={-1}
            paginator={true}
            rows={10}
            rowsPerPageOptions={[10, 20, 50, 100, dadosFiltrados.length]}
            showGridlines
            stripedRows
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado </div>}
          >
            {colunasListaProdEtiquetas.map(coluna => (
              <Column
                key={coluna.field}
                field={coluna.field}
                header={coluna.header}
                body={coluna.body}
                sortable={coluna.sortable}
                headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '1rem' }}
                bodyStyle={{ fontSize: '1rem' }}
              />
            ))}
          </DataTable>
        </div>
      </div>

      <ActionDetalharProdutosEtiquetaModal
        show={modalImprimir}
        handleClose={() => setModalImprimir(false)}
        produtosSelecionados={produtosSelecionados}
      />
    
    </Fragment>
  );
};