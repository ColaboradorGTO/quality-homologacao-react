import { Fragment, useRef } from "react";
import './styles.css';
import { formatMoeda } from "../../../../utils/formatMoeda";
import { ReactBarcode } from 'react-jsbarcode';
import { ButtonTypeModal } from "../../../Buttons/ButtonTypeModal";
import { MdOutlineLocalPrintshop } from "react-icons/md";
import { isValidEAN13 } from "../../../../utils/isValidEAN13";
import Swal from "sweetalert2";

const chunkArray = (array, size) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

export const ActionImprimirEtiquetaModal = ({ copias, produtosSelecionados, dadosAcumuladorEtiquetas }) => {
  const dataTableRef = useRef();

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return; 

    printWindow.document.write(`
      <html>
        <head>
          <title>Lista de Etiquetas</title>
          <style>
              body {       
                  font-family: 'Roboto', sans-serif !important;
                  font-size: 13px;
                  letter-spacing: -0.05px !important;
                  margin: 1px !important;
                  transform: rotate(0deg);
                  transform-origin: center;
                }

                @media print{
                
                    @page {
                            size: 11.5cm 8.5cm; 
                            margin: -3cm;
                            orientation: portrait;
                        }
                        
                      #codBarrasEtiqueta{
                          width: 100% !important;
                          height: 100px !important;
                      }

                    .etiqueta-page {
                        display: flex;
                        flex-wrap: wrap;
                        align-content: flex-start;
                        margin: 2px;
                        width: 100%;
                        height: 95%;
                        padding: 0;
                    }

                    .etiqueta-card {
                        width: 26.3% ;
                        height: 100%;
                        margin-right: 7%;
                        margin-bottom: 0;
                        padding: 29% 0 0 0 !important;
                        box-sizing: border-box;
                        display: flex;
                        flex-direction: column;
                        justify-content: left;
                        align-items: left;
                        page-break-after: always;
                    }

                    .dsProd{
                        width: 103% !important;
                        height: 35% !important;
                        margin: 0 0 2px 4px  !important;
                    }

                    .dsProd p{
                        font-size: 1.3em !important;
                        letter-spacing: -0.5px !important;
                        margin: 0 0 0 3px !important;
                    }

                    .divTamanho{
                        display: flex;
                        margin: 0 2px -0.9375em 2px;
                    }
                      
                      .tamanhoDesc{
                          font-weight: bold;
                      }
                      
                    .tamanho{
                        border: 1px solid black;
                        text-align: center;
                        padding: 2px !important;
                    }


                    .preco{
                        font-size: 1.8em !important;
                        font-weight: bold;
                        letter-spacing: -2px !important;
                        display: flex !important;
                        justify-content: flex-end !important;
                        align-items: flex-end !important;
                        width: 100% !important;
                        margin-right: -12% !important;
                        margin-bottom: -6px !important;
                    }

                    .svgEtiqueta{ 
                        width: 110%
                    }

                    h2{
                        font-size: 1.31em !important;
                        margin: 0% !important;
                    }
                }
          </style>
        </head>
        <body>
          <div>${dataTableRef.current.innerHTML}</div>
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() { window.close(); };
            };
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
  };


  const etiquetas = Array.isArray(dadosAcumuladorEtiquetas) ? dadosAcumuladorEtiquetas.map((item, index) => {
    let contador = index + 1;
    return {
      contador,
      NUCODBARRAS: item.NUCODBARRAS,
      DSNOME: item.DSNOME,
      TAMANHO: item.TAMANHO,
      PRECOVENDA: item.PRECOVENDA,
      DSESTILO: item.DSESTILO,
      DSLISTAPRECO: item.DSLISTAPRECO, 
      IDPRODUTO: item.IDPRODUTO,
      MARCA: item.MARCA,
      DSLOCALEXPOSICAO: item.DSLOCALEXPOSICAO
    }
  }) : [];

  const etiquetasPorPagina = chunkArray(etiquetas, 3);
  const totalPaginas = etiquetasPorPagina.length;

  const Toast = Swal.mixin({
    toast: true,
    position: "center",
    showConfirmButton: false,
    timer: 5000,
    timerProgressBar: true,
    customClass: {container: 'custom-swal'},
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });

  if (!isValidEAN13(`${etiquetas?.NUCODBARRAS}`)) {
    Toast.fire({
      icon: "error",
      title: `O código de barras (${etiquetas[0]?.NUCODBARRAS}) do produto (${etiquetas[0]?.DSNOME}) da linha: ${1} está em formato inválido, entre em contato com o departamento de cadastro de produtos`
    });
  }

  return (
    <Fragment>
      <header className="row" style={{ justifyContent: "space-between" }}>
        <div className="ml-3">
          <p style={{margin: '0px'}}>Qtd: Páginas <b>{totalPaginas + ' ' + 'Páginas'}</b></p>
          <p >Qtd Etiquetas: <b>{dadosAcumuladorEtiquetas.length + ' ' + 'unidades'} </b></p>
        </div>

        <ButtonTypeModal
          textButton={"Imprimir"}
          onClickButtonType={handlePrint}
          cor={"primary"}
          Icon={MdOutlineLocalPrintshop}
          iconSize={20}

        />
      </header>

      <div ref={dataTableRef}>
        {etiquetasPorPagina.map((pagina, pageIndex) => (
          <div key={pageIndex} className="etiqueta-page" style={{ }}>
            {pagina.map((etiqueta, etiquetaIndex) => (
              <div className="etiqueta-card" key={etiquetaIndex} style={{ padding: "15px 0 0",  }}>
                <div className="dsProd" style={{ justifyContent: 'center', maxWidth: '100%' }}>
                  <h2 
                    style={{ lineHeight: '1.3em', fontWeight: 400, fontSize: '1.375rem' }}
                  >
                    {etiqueta?.DSNOME}
                  </h2>
                  <p>{etiqueta?.DSESTILO}</p>
                  <p>{etiqueta?.DSLOCALEXPOSICAO}</p>
                </div>

                <div className="divTamanho" style={{ display: "flex", justifyContent: "space-between" }}>
                  <div className="tamanhoDesc">
                    <label>TAM</label>
                    <div className="tamanho">
                      <h2>{etiqueta?.TAMANHO}</h2>
                    </div>
                  </div>

                  <div className="preco">
                    <h2
                      style={{ lineHeight: '1.3em', fontWeight: 400, fontSize: '1.375rem' }}
                    >
                      {formatMoeda(etiqueta?.PRECOVENDA)}
                    </h2>
                  </div>
                </div>
                <div id="codBarrasEtiqueta">
                  {isValidEAN13(`${etiqueta?.NUCODBARRAS}`) ? (
                  <ReactBarcode
                    value={etiqueta?.NUCODBARRAS}
                    options={{ 
                      format: "EAN13", 
                      textAlign: "center", 
                      margin: 0, 
                    }}
                    renderer="svg"
                    className="svgEtiqueta"
                    format="EAN13"
                    width={3}
                    height={80}
                
                  />
                  ) : (
                    <p style={{ color: 'red', fontWeight: 'bold' }}>
                      Código de barras inválido: {etiqueta?.NUCODBARRAS}
                    </p>
                  )}
                  {console.log(etiqueta?.NUCODBARRAS, 'etiqueta?.NUCODBARRAS')}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </Fragment>
  );
};