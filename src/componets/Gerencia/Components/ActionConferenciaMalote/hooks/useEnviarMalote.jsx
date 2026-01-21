import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { post, put } from "../../../../../api/funcRequest";
import { formataStringComEspaco } from "../../../../../utils/formataStringComEspaco";


export const useEnviarMalote = ({ salvarDadosMalotes, dadosDetalhesMalote, handleClick, handleClose, optionsModulos, usuarioLogado }) => {
  const [ipUsuario, setIpUsuario] = useState('');
  const [observacaoLoja, setObservacaoLoja] = useState('');

  const formatarDataParaISO = (data) => {
    if (!data) return '';
    const [dia, mes, ano] = data.split('/');
    return `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
  };

  const dataFormatadaISO = formatarDataParaISO(salvarDadosMalotes?.DTHORAFECHAMENTOFORMATADA);

  useEffect(() => {
    getIPUsuario();
  }, [usuarioLogado]);

  const getIPUsuario = async () => {
    let usuarioIP = null;

    try {
      const { data: ipWhoisData } = await axios.get("http://ipwho.is/");
      usuarioIP = ipWhoisData?.ip;
    } catch (error) {
      console.error("Erro ao buscar IP via ipwho.is:", error);
    }

    if (!usuarioIP) {
      try {
        const { data: ipifyData } = await axios.get("https://api.ipify.org?format=json");
        usuarioIP = ipifyData?.ip;
      } catch (error) {
        console.error("Erro ao buscar IP via ipify.org:", error);
      }
    }
    setIpUsuario(usuarioIP);
    return usuarioIP;
  };


  const criarPostData = () => ({

    IDEMPRESA: usuarioLogado?.IDEMPRESA,
    DATAMOVIMENTOCAIXA: String(dataFormatadaISO) || "",
    VRDINHEIRO: Number(salvarDadosMalotes?.VALORTOTALDINHEIRO || 0),
    VRCARTAO: Number(salvarDadosMalotes?.VALORTOTALCARTAO || 0),
    VRPOS: Number(salvarDadosMalotes?.VALORTOTALPOS || 0),
    VRPIX: Number(salvarDadosMalotes?.VALORTOTALPIX || 0),
    VRCONVENIO: Number(salvarDadosMalotes?.VALORTOTALCONVENIO || 0),
    VRVOUCHER: Number(salvarDadosMalotes?.VALORTOTALVOUCHER || 0),
    VRFATURA: Number(salvarDadosMalotes?.VALORTOTALFATURA || 0),
    VRFATURAPIX: Number(salvarDadosMalotes?.VALORTOTALFATURAPIX || 0),
    VRDESPESA: Number(salvarDadosMalotes?.vrTotalDespesa || 0),
    VRTOTALRECEBIDO: Number(salvarDadosMalotes?.vrTotalVendido || 0),
    VRDISPONIVEL: Number(salvarDadosMalotes?.vrDisponivel || 0),
    OBSERVACAOLOJA: '',
    IDUSERCRIACAO: usuarioLogado?.id,
    IDUSERULTIMAALTERACAO: usuarioLogado?.id,
    IDUSERENVIO: usuarioLogado?.id,
  });

  const exibirModalConfirmacao = async () => {
    return await Swal.fire({
      icon: 'question',
      text: `Deseja realmente enviar o Malote?`,
      showCloseButton: true,
      showCancelButton: true,
      cancelButtonColor: '#FD1381',
      confirmButtonColor: '#7352A5',
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
      customClass: {
        container: 'custom-swal',
      },
    });
  };

  const exibirModalObservacao = async () => {
    return await Swal.fire({
      icon: 'info',
      text: 'Caso deseje adicionar uma observação, \n Digite e clique em "Enviar"!',
      input: 'textarea',
      inputPlaceholder: 'Digite sua observação aqui...',
      inputAttributes: {
        'aria-label': 'Digite sua observação aqui',
        style: 'text-transform: uppercase;',
      },
      showCancelButton: true,
      cancelButtonColor: '#FD1381',
      confirmButtonColor: '#1dc9b7',
      confirmButtonText: 'Enviar',
      cancelButtonText: 'Cancelar Envio',
      didOpen: () => {
        const textarea = Swal.getInput();
        if (textarea) {
          textarea.addEventListener('input', function (e) {
            e.target.value = e.target.value.toUpperCase();
          });
        }
      },
    });
  };

  const enviarMalote = async (postData) => {
    if (optionsModulos[0]?.CRIAR == 'False') {
      Swal.fire({
        icon: 'error',
        title: 'Erro!',
        text: 'Usuário sem permissão para enviar malote!',
        customClass: {
          container: 'custom-swal',
        },
        timer: 3000,
      });
      return;
    }
    const response = await post('/criar-malotes-por-loja', postData);
    const textDados = JSON.stringify(postData);
    const createData = {
      IDFUNCIONARIO: String(usuarioLogado.id),
      PATHFUNCAO: 'GERENCIA / ENVIO DE MALOTE',
      DADOS: textDados,
      IP: ipUsuario,
    };
    await post('/log-web', createData);

    Swal.fire({
      title: 'Sucesso!',
      text: 'Malote Enviado com Sucesso!',
      icon: 'success',
      customClass: {
        container: 'custom-swal',
      },
    });

    return response.data;
  };

  const reenviarMalote = async (observacao) => {
    if (optionsModulos[0]?.ALTERAR == 'False') {
      Swal.fire({
        icon: 'error',
        title: 'Erro!',
        text: 'Usuário sem permissão para reenviar malote!',
        customClass: {
          container: 'custom-swal',
        },
        timer: 3000,
      });
      return;
    }
    const putData = [
      {
        IDMALOTE: dadosDetalhesMalote[0]?.IDMALOTE,
        STATUS: 'Reenviado',
        OBSERVACAOLOJA: formataStringComEspaco(observacaoLoja).trim()?.toUpperCase(),
        IDUSERULTIMAALTERACAO: usuarioLogado?.id,
      },
    ];

    const response = await put('/malotes-por-loja/:id', putData);
    const textDados = JSON.stringify(putData);
    const createData = {
      IDFUNCIONARIO: String(usuarioLogado.id),
      PATHFUNCAO: 'GERENCIA / REENVIO DE MALOTE',
      DADOS: textDados,
      IP: ipUsuario,
    };
    await post('/log-web', createData);

    Swal.fire({
      title: 'Sucesso!',
      text: 'Malote Reenviado com Sucesso!',
      icon: 'success',
      customClass: {
        container: 'custom-swal',
      },
    });

    handleClick();
    handleClose();
    return response.data;
  };

  const onSalvarMalote = async () => {
    if (!usuarioLogado?.id || !usuarioLogado?.IDEMPRESA) {
      Swal.fire({
        icon: 'error',
        title: 'Erro!',
        text: 'Erro ao tentar recuperar os dados da Sessão do Usuário, faça o logoff e entre novamente no sistema!',
        customClass: {
          container: 'custom-swal',
        },
        timer: 3000,
      });
      return;
    }

    const postData = criarPostData();
    const result = await exibirModalConfirmacao();

    if (result.isConfirmed) {
      const { value: observacao } = await exibirModalObservacao();

      if (!salvarDadosMalotes?.IDMALOTE) {
        postData.OBSERVACAOLOJA = formataStringComEspaco(observacao).trim()?.toUpperCase();
        await enviarMalote(postData);
        handleClick();
      } else {
        await reenviarMalote(observacao);
        handleClick();
      }
    }
  };


  return {
    observacaoLoja,
    setObservacaoLoja,
    onSalvarMalote,
    reenviarMalote
  };
};