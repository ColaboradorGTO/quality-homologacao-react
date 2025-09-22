import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { post, put } from "../../../../../api/funcRequest";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getDataAtual } from "../../../../../utils/dataAtual";

export const useConfirmarBalancoAvulso = ({dadosBalancoAvulso, usuarioLogado, optionsModulos}) => {
  const [loading, setLoading] = useState(false);
  const [ipUsuario, setIpUsuario] = useState("");
  const [data, setData] = useState('');

  useEffect(() => {
    const dataAtual = getDataAtual();   
    setData(dataAtual);
  }, [])

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

  const enviarConfirmacao = async () => {
    if(optionsModulos[0]?.CRIAR === 'False')  {
      Swal.fire({
        icon: "error",
        title: "Atenção!",
        text: "Você não tem permissão para confirmar o Balanço Avulso!",
      });
      return;
    }

    try {
      Swal.fire({
        title: `Deseja confirmar o Coletor?`,
        text: "Caso confirme, a manutenção dessa listagem será no Balanço!",
        icon: "info",
        buttonsStyling: false,
        showCancelButton: true,
        confirmButtonText: "Sim",
        cancelButtonText: "Não",
        customClass: {
          confirmButton: "btn btn-primary btn-lg",
          cancelButton: "btn btn-danger btn-lg",
          loader: 'custom-loader'
        },
        loaderHtml: '<div class="spinner-border text-primary"></div>',
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const det = dadosBalancoAvulso.map((item) => ({
              NUMEROCOLETOR: usuarioLogado?.id,
              IDPRODUTO: item.IDPRODUTO,
              CODIGODEBARRAS: item.NUCODBARRAS,
              DSPRODUTO: item.DSNOME,
              TOTALCONTAGEMATUAL: 0,
              TOTALCONTAGEMGERAL: Number(item.TOTALCONTAGEMGERAL),
              PRECOCUSTO: Number(item.PRECOCUSTO),
              PRECOVENDA: Number(item.PRECOVENDA),
              STCANCELADO: 'False',
              DSCOLETOR: item.DSCOLETOR,
            }));

            const putData = {
              IDEMPRESA: Number(dadosBalancoAvulso[0].IDEMPRESA),
              DSRESUMOBALANCO: 'LOJA BALANCO',
              DTABERTURA: data,
              DTFECHAMENTO: '',
              QTDTOTALITENS: 0,
              QTDTOTALSOBRA: 0,
              QTDTOTALFALTA: 0,
              TXTOBSERVACAO: '',
              STATIVO: 'True',
              det,
              INSBALANCO: 1
            }

            const response = await post(`/criar-detalhe-balanco-avulso`, putData);

            const textDados = JSON.stringify(putData)
            let textoFuncao = 'ADMINISTARTIVO / CONFIMAR BALANÇO AVULSO';

            const postData = {
              IDFUNCIONARIO: String(usuarioLogado.id),
              PATHFUNCAO: textoFuncao,
              DADOS: textDados,
              IP: ipUsuario
            }

            const responsePost = await post('/log-web', postData)

            Swal.fire({
              title: 'Sucesso',
              text: 'Confirmação Balanço Avulso realizada com sucesso',
              icon: 'success'
            })

            return responsePost.data;
          } catch (error) {
            let textoFuncao = 'ADMINISTARTIVO / ERRO AO CONFIMAR BALANÇO AVULSO';

            const postData = {
              IDFUNCIONARIO: String(usuarioLogado.id),
              PATHFUNCAO: textoFuncao,
              DADOS: 'ERRO AO CONFIMAR BALANÇO AVULSO',
              IP: ipUsuario
            }

            const responsePost = await post('/log-web', postData)

            return responsePost.data;
          }

        }
      })


    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Erro ao Enviar Pedido para o SAP!",
        text: "Erro ao subir o pedido para o SAP, tente novamente!",
      });
    }

  }

  return { enviarConfirmacao, loading };
};
