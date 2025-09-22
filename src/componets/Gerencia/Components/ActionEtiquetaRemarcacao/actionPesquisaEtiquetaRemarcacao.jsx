import { Fragment, useEffect, useState } from "react";
import { InputField } from "../../../Buttons/Input";
import { ActionMain } from "../../../Actions/actionMain";
import { ButtonType } from "../../../Buttons/ButtonType";
import { useNavigate } from "react-router-dom";
import { ActionListaEtiquetaRemarcacao } from "./actionListaEtiquetaRemarcacao";
import { MdOutlineLocalPrintshop } from "react-icons/md";
import { BsTrash3 } from "react-icons/bs";
import { GoDownload } from "react-icons/go";
import Swal from "sweetalert2";
import { ActionImprimirEtiquetaModal } from "./actionImprimirEtiquetaModal";
import { ActionImprimirAcumuladorEtiquetaModal } from "./actionImprimirAcumuladorEtiquetaModal";
import { formatToDecimal, maskValorEmDecimal } from "../../../../utils/mascaraValor";

export const ActionPesquisaEtiquetaRemarcacao = ({ID, optionsEmpresas, usuarioLogado}) => {
  const [modalDetalhar, setModalDetalhar] = useState(false);
  const [modalAcumulador, setModalAcumulador] = useState(false);
  const [preco, setPreco] = useState(0);
  const [quantidadeEtiquetas, setQuantidadeEtiquetas] = useState(0);
  const [idEtiqueta, setIdEtiqueta] = useState(0);
  const [dadosEtiquetas, setDadosEtiquetas] = useState([]);
  const [dadosAcumuladorEtiquetas, setDadosAcumuladorEtiquetas] = useState([]);
  const [copias, setCopias] = useState(1);

  const navigate = useNavigate();



  const multiplicarObjetos = (dados, copias) => {
    const objetosMultiplicados = [];
    for (let i = 0; i < copias; i++) {
      objetosMultiplicados.push(...dados);
    }
    return objetosMultiplicados;
  };
  
  const handleImprimir = async () => {
    if (dadosAcumuladorEtiquetas.length > 0) {
      const objetosMultiplicados = multiplicarObjetos(dadosAcumuladorEtiquetas, copias);

      setDadosAcumuladorEtiquetas(objetosMultiplicados);
      setDadosEtiquetas([]);
      setModalAcumulador(true);
    } else if (preco > 0 || dadosEtiquetas.length > 0) {
      // setModalDetalhar(true);
      setDadosEtiquetas(dadosEtiquetas)
    
      const { value: formValues, isDismissed } = await Swal.fire({
        title: 'Digite a quantidade de Etiquetas.',
        input: 'number',
        inputValue: quantidadeEtiquetas,
        inputPlaceholder: 'Digite a quantidade de etiquetas',
        width: '25rem',
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Confirmar',
        confirmButtonColor: '#4AD4C5',
        cancelButtonText: 'Voltar',
        cancelButtonColor: '#FD61AA',
        inputValidator: (value) => {
          if (!value || value <= 0) {
            return 'Digite uma quantidade válida!';
          }
        },
      });
  
      if (isDismissed) {
        setModalAcumulador(true);
        setQuantidadeEtiquetas(0);
      } else if (formValues) {
        const qtdEtiqueta = parseInt(formValues, 10);
        setQuantidadeEtiquetas(qtdEtiqueta); 
  
        const novasEtiquetas = Array.from({ length: qtdEtiqueta }, (_, index) => ({
          idEtiqueta: idEtiqueta + index + 1,
          quantidade: 1,
          valor: preco,
        }));
  
       
        setDadosEtiquetas((prevEtiquetas) => [...prevEtiquetas, ...novasEtiquetas]);
        setIdEtiqueta((prevId) => prevId + 1);
        setModalDetalhar(true); 
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Valor Inválido',
        text: 'O valor deve ser maior que 0 para imprimir etiquetas!',
      });
    }
  };

  // const handleAcumuladorEtiquetas = async () => {
  //   if (preco > 0) {
  //     const { value: formValues, isDismissed } = await Swal.fire({
  //       title: 'Digite a quantidade de Etiquetas.',
  //       input: 'number',
  //       inputValue: quantidadeEtiquetas,
  //       inputPlaceholder: 'Digite a quantidade de etiquetas',
  //       width: '25rem',
  //       focusConfirm: false,
  //       showCancelButton: true,
  //       confirmButtonText: 'Confirmar',
  //       confirmButtonColor: '#4AD4C5',
  //       cancelButtonText: 'Voltar',
  //       cancelButtonColor: '#FD61AA',
  //       inputValidator: (value) => {
  //         if (!value || value <= 0) {
  //           return 'Digite uma quantidade válida!';
  //         }
  //       },
  //     });

  //     if (isDismissed) {
  //       setQuantidadeEtiquetas(0);
  //     } else if (formValues) {
  //       const qtdEtiqueta = parseInt(formValues, 10);
        
  //       setQuantidadeEtiquetas(qtdEtiqueta);

  //       const novasEtiquetas = Array.from({ length: quantidadeEtiquetas }, (_, index) => ({
  //         idEtiqueta: idEtiqueta + index + 1,
  //         quantidade: qtdEtiqueta, 
  //         valor: preco,
  //       }));
        
  //       setDadosEtiquetas((prevEtiquetas) => [...prevEtiquetas, ...novasEtiquetas]);
  //       setIdEtiqueta((prevId) => prevId + 1);
  //     }
  //   } else {
  //     Swal.fire({
  //       icon: 'error',
  //       title: 'Valor Inválido',
  //       text: 'O valor deve ser maior que 0 para imprimir etiquetas!',
  //     });
  //   }
  // };

  const handleAcumuladorEtiquetas = async () => {
    if (parseFloat(preco) > 0) {
      const { value: formValues, isDismissed } = await Swal.fire({
        title: 'Digite a quantidade de Etiquetas.',
        input: 'number',
        inputValue: quantidadeEtiquetas,
        inputPlaceholder: 'Digite a quantidade de etiquetas',
        width: '25rem',
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Confirmar',
        confirmButtonColor: '#4AD4C5',
        cancelButtonText: 'Voltar',
        cancelButtonColor: '#FD61AA',
        inputValidator: (value) => {
          if (!value || value <= 0) {
            return 'Digite uma quantidade válida!';
          }
        },
      });

      if (isDismissed) {
        setQuantidadeEtiquetas(0);
      } else if (formValues) {
        const qtdEtiqueta = parseInt(formValues, 10);

        const etiquetaExistente = dadosEtiquetas.find(
          (etiqueta) => etiqueta.valor === preco
        );

        if (etiquetaExistente) {
          const novasEtiquetas = dadosEtiquetas.map((etiqueta) =>
            etiqueta.valor === preco
              ? { ...etiqueta, quantidade: etiqueta.quantidade + qtdEtiqueta }
              : etiqueta
          );
          setDadosAcumuladorEtiquetas(novasEtiquetas);

        } else {
          const novasEtiquetas = Array.from({ length: 1 }, (_, index) => ({
            idEtiqueta: idEtiqueta + index + 1,
            quantidade: qtdEtiqueta,
            valor: preco,
          }));
          console.log(novasEtiquetas, 'else');
          setDadosAcumuladorEtiquetas((prevEtiquetas) => [...prevEtiquetas, ...novasEtiquetas]);
          setIdEtiqueta((prevId) => prevId + 1);
        }

        setQuantidadeEtiquetas(qtdEtiqueta);
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Valor Inválido',
        text: 'O valor deve ser maior que 0 para imprimir etiquetas!',
      });
    }
  };
  const handleCancelar = () => {
    setDadosAcumuladorEtiquetas([]);
    setQuantidadeEtiquetas(0);
    Swal.fire({
      icon: 'warning',
      title: 'Dados Removidos',
      text: 'Todos os dados foram removidos com sucesso!',
    });
  };

  const handleExcluirEtiqueta = (id) => {
    setDadosAcumuladorEtiquetas((prevEtiquetas) => prevEtiquetas.filter(etiqueta => etiqueta.idEtiqueta !== id));
    Swal.fire({
      icon: 'success',
      title: 'Etiqueta Removida',
      text: 'A etiqueta foi removida com sucesso!',
    });
  };

  const handleUpdateQuantidadeEtiqueta = (idEtiqueta, novaQuantidade) => {
    const updatedEtiquetas = dadosEtiquetas.map((etiqueta) =>
      etiqueta.idEtiqueta === idEtiqueta ? { ...etiqueta, quantidade: novaQuantidade } : etiqueta
    );
    setDadosEtiquetas(updatedEtiquetas);
  };


  const handlePrecoChange = (e) => {
    const formattedValue = formatToDecimal(e.target.value, 2);
    setPreco(formattedValue);
  };

  return (
    <Fragment>
      <ActionMain
        linkComponentAnterior={["Home"]}
        linkComponent={[""]}
        title="Etiquetas de Remarcação"
        subTitle="Nome da Loja"
        InputFieldComponent={InputField}
        labelInputField={"Valor(R$)"}
        valueInputField={maskValorEmDecimal(preco)}
        onChangeInputField={handlePrecoChange}
        placeHolderInputFieldComponent={"Digite o valor da etiqueta"}
      />

      {parseFloat(preco) > 0 && (

        <div className="row mb-4 panel-tag ">
          <ButtonType
            Icon={MdOutlineLocalPrintshop}
            iconSize="16px"
            textButton="Imprimir"
            cor="primary"
            tipo="button"
            onClickButtonType={handleImprimir}
          />
 
          <ButtonType
            Icon={GoDownload}
            iconSize="16px"
            textButton="Guardar"
            cor="success"
            tipo="button"
            onClickButtonType={handleAcumuladorEtiquetas}
          />
          <ButtonType
            Icon={BsTrash3}
            iconSize="16px"
            textButton="Cancelar"
            cor="danger"
            tipo="button"
            onClickButtonType={handleCancelar}
          
          />

          <div style={{ marginRight: "10px", marginLeft: "10px", marginTop: "5px" }}>
            <div>
              <label>QTD CÓPIAS:</label>
            </div>
            <input
              type="number"
              value={copias}
              onChange={(e) => setCopias(e.target.value)}
              style={{ width: "50px", marginRight: "1rem" }}
            />
          </div>
        </div>
      )}

      <ActionListaEtiquetaRemarcacao
        dadosAcumuladorEtiquetas={dadosAcumuladorEtiquetas}
        setDadosAcumuladorEtiquetas={setDadosAcumuladorEtiquetas}
        handleExcluirEtiqueta={handleExcluirEtiqueta}
        handleUpdateQuantidadeEtiqueta={handleUpdateQuantidadeEtiqueta}
      />

      <ActionImprimirEtiquetaModal 
        show={modalDetalhar}
        handleClose={() => setModalDetalhar(false)}
        dadosEtiquetas={dadosEtiquetas}
        quantidadeEtiquetas={quantidadeEtiquetas}
        copias={copias}
      />
      <ActionImprimirAcumuladorEtiquetaModal 
        show={modalAcumulador}
        handleClose={() => setModalAcumulador(false)}
        dadosAcumuladorEtiquetas={dadosAcumuladorEtiquetas}
        quantidadeEtiquetas={quantidadeEtiquetas}
        copias={copias}
      />
    </Fragment>
  );
};