import Swal from "sweetalert2";
import { post } from "../../../../../api/funcRequest";
import { useEffect, useState } from "react";
import axios from "axios"
import { useFetchData } from "../../../../../hooks/useFetchData";

export const useCadastrarBonificaoca = ({ handleClose, usuarioLogado, optionsModulos }) => {
  const [ipUsuario, setIpUsuario] = useState('');
  const [funcionario, setFuncionario] = useState('');
  const [tipoSelecionado, setTipoSelecionado] = useState('');
  const [valorBonificao, setValorBonificacao] = useState('');
  const [txtHistorico, setTxtHistorico] = useState('');


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


  const onSubmit = async () => {
    if (optionsModulos[0]?.CRIAR == 'False') {
      Swal.fire({
        icon: 'error',
        title: 'Erro!',
        text: 'Você não tem permissão para cadastrar!',
        timer: 3000,
        customClass: {
          confirmButton: "btn btn-primary btn-lg",
          cancelButton: "btn btn-danger btn-lg",
          container: 'custom-swal',
        },
      })
      return;
    }

    try {
      if (tipoSelecionado == '') {
        Swal.fire({
          icon: 'error',
          title: 'Erro!',
          text: 'Informe o tipo de movimento!',
          timer: 3000,
          customClass: {
            confirmButton: "btn btn-primary btn-lg",
            cancelButton: "btn btn-danger btn-lg",
            container: 'custom-swal',
          },
        })
        return;
      }

      if (funcionario == '') {
        Swal.fire({
          icon: 'error',
          title: 'Erro!',
          text: 'Informe o funcionário!',
          timer: 3000,
          customClass: {
            confirmButton: "btn btn-primary btn-lg",
            cancelButton: "btn btn-danger btn-lg",
            container: 'custom-swal',
          },
        })
        return;
      }

      if (valorBonificao == '' || valorBonificao == '0') {
        Swal.fire({
          icon: 'error',
          title: 'Erro!',
          text: 'Informe o valor da bonificação!',
          timer: 3000,
          customClass: {
            confirmButton: "btn btn-primary btn-lg",
            cancelButton: "btn btn-danger btn-lg",
            container: 'custom-swal',
          },
        })
        return;
      }

      if (txtHistorico == '') {
        Swal.fire({
          icon: 'error',
          title: 'Erro!',
          text: 'Informe o histórico!',
          timer: 3000,
          customClass: {
            confirmButton: "btn btn-primary btn-lg",
            cancelButton: "btn btn-danger btn-lg",
            container: 'custom-swal',
          },
        })
        return;
      }

      const data = {
        IDFUNCIONARIO: funcionario,
        TIPOMOVIMENTO: tipoSelecionado,
        VRMOVIMENTO: valorBonificao,
        OBSERVACAO: txtHistorico,
        IDFUNCIONARIORESP: usuarioLogado.id
      }

      const response = await post('/criar-movimento-saldo-bonificacao', data)

      const textDados = JSON.stringify(data)
      let textoFuncao = 'FINANCEIRO/CADASTRO DE BONIFICACAO';

      const postData = {
        IDFUNCIONARIO: String(usuarioLogado.id),
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario
      }


      const responsePost = await post('/log-web', postData)
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Cadastrado com sucesso!',
        customClass:{
          container: 'custom-swal',
        },
        showConfirmButton: false,
        timer: 1500
      })

      handleClose();
      return responsePost;
    } catch (error) {
      let textoFuncao = 'FINANCEIRO/ERRO NO CADASTRO DE BONIFICACAO';

      const postData = {
        IDFUNCIONARIO: String(usuarioLogado.id),
        PATHFUNCAO: textoFuncao,
        DADOS: 'ERRRO AO CADASTRAR BONIFICACAO',
        IP: ipUsuario
      }

      const responsePost = await post('/log-web', postData)

      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Ocorreu um erro ao enviar o formulário. Por favor, tente novamente.',
        customClass: {
          container: 'custom-swal',
        },
        showConfirmButton: false,
        timer: 1500
      });

      return responsePost.data;
    }
  }

  const OptionsStatus = [

    { id: 0, value: "Credito", label: "Crédito" },
    { id: 1, value: "Debito", label: "Débito" },
  ]

  return {
    funcionario,
    setFuncionario,
    valorBonificao,
    setValorBonificacao,
    tipoSelecionado,
    txtHistorico,
    OptionsStatus,
    setTipoSelecionado,
    setTxtHistorico,
    onSubmit,

  }
}