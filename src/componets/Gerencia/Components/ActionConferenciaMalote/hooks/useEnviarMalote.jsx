import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { post, put } from "../../../../../api/funcRequest";
import { formataStringComEspaco } from "../../../../../utils/formataStringComEspaco";


export const useEnviarMalote = ({salvarDadosMalotes, dadosDetalhesMalote, handleClick, handleClose, optionsModulos,usuarioLogado}) => {
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
    const response = await axios.get('http://ipwho.is/')
    if (response.data) {
      setIpUsuario(response.data.ip);
    }
    return response.data;
  }


  const criarPostData = () => ({

    IDEMPRESA: usuarioLogado?.IDEMPRESA,
    DATAMOVIMENTOCAIXA: dataFormatadaISO,
    VRDINHEIRO: Number(salvarDadosMalotes?.VALORTOTALDINHEIRO),
    VRCARTAO: Number(salvarDadosMalotes?.VALORTOTALCARTAO),
    VRPOS: Number(salvarDadosMalotes?.VALORTOTALPOS),
    VRPIX: Number(salvarDadosMalotes?.VALORTOTALPIX),
    VRCONVENIO: Number(salvarDadosMalotes?.VALORTOTALCONVENIO),
    VRVOUCHER: Number(salvarDadosMalotes?.VALORTOTALVOUCHER),
    VRFATURA: Number(salvarDadosMalotes?.VALORTOTALFATURA),
    VRFATURAPIX: Number(salvarDadosMalotes?.VALORTOTALFATURAPIX),
    VRDESPESA: Number(salvarDadosMalotes?.vrTotalDespesa),
    VRTOTALRECEBIDO: Number(salvarDadosMalotes?.vrTotalVendido),
    VRDISPONIVEL: Number(salvarDadosMalotes?.vrDisponivel),
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
    if(optionsModulos[0]?.CRIAR == 'False') {
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
    if(optionsModulos[0]?.ALTERAR == 'False') {
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