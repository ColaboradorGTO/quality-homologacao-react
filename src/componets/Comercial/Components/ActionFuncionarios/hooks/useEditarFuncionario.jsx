import React, { useState, useEffect } from "react";
import Swal from 'sweetalert2';
import axios from "axios";
import { Funcoes } from '../../../../../../tipoFuncao.json';
import { Parceiro } from '../../../../../../parceiro.json';
import { post, put } from "../../../../../api/funcRequest";

export const useEditarFuncionario = ({ dadosAtualizarFuncionarios, dadosEmpresas, refetchListaFuncionarios, usuarioLogado, optionsModulos }) => {
  const [empresaSelecionada, setEmpresaSelecionada] = useState(0);
  const [funcaoSelecionado, setFuncaoSelecionado] = useState('')
  const [tipoSelecionado, setTipoSelecionado] = useState('')
  const [dataAdmissao, setDataAdmissao] = useState('')
  const [cpf, setCPF] = useState('')
  const [nomeFuncionario, setNomeFuncionario] = useState('')
  const [localizacaoSelecionada, setLocalizacaoSelecionada] = useState('')
  const [categoriaContratacao, setCategoriaContratacao] = useState('')
  const [valorDesconto, setValorDesconto] = useState('');
  const [valorSalario, setValorSalario] = useState('');
  const [usuario, setUsuario] = useState('')
  const [senha, setSenha] = useState('')
  const [repitaSenha, setRepitaSenha] = useState('')
  const [situacaoSelecionada, setSituacaoSelecionada] = useState('')
  const [isChecked, setIsChecked] = useState(false);
  const [ipUsuario, setIpUsuario] = useState('')
  const [formularioVisivel, setFormularioVisivel] = useState(true);
  const [formularioVisivelLogin, setFormularioVisivelLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);



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


  useEffect(() => {
    if (dadosAtualizarFuncionarios) {
      setEmpresaSelecionada({ value: dadosAtualizarFuncionarios[0]?.IDEMPRESA, label: dadosAtualizarFuncionarios[0]?.NOFANTASIA });
      setFuncaoSelecionado({ value: dadosAtualizarFuncionarios[0]?.DSFUNCAO, label: dadosAtualizarFuncionarios[0]?.DSFUNCAO });
      setTipoSelecionado({ value: dadosAtualizarFuncionarios[0]?.DSTIPO, label: dadosAtualizarFuncionarios[0]?.DSTIPO });
      setCPF(dadosAtualizarFuncionarios[0]?.NUCPF);
      setNomeFuncionario(dadosAtualizarFuncionarios[0]?.NOFUNCIONARIO);
      setLocalizacaoSelecionada(dadosAtualizarFuncionarios[0]?.STLOJA);
      setValorSalario(dadosAtualizarFuncionarios[0]?.VALORSALARIO);
      setValorDesconto(dadosAtualizarFuncionarios[0]?.PERC);
      setSituacaoSelecionada({ value: dadosAtualizarFuncionarios[0]?.STATIVO == 'True' ? 'Ativo' : 'Inativo', label: dadosAtualizarFuncionarios[0]?.STATIVO == 'True' ? 'Ativo' : 'Inativo' });
      setSenha(dadosAtualizarFuncionarios[0]?.PWSENHA);
      setRepitaSenha(dadosAtualizarFuncionarios[0]?.PWSENHA);

    }

  }, [dadosAtualizarFuncionarios]);

  const onSubmit = async (e) => {

    if (optionsModulos[0]?.ALTERAR == 'True') {
      Swal.fire({
        title: 'Acesso Negado',
        html: `${usuarioLogado?.NOFUNCIONARIO} <br/> não tem permissão para alterar`,
        icon: 'error',
        confirmButtonText: 'Ok',
        timer: 6000,
        customClass: {
          container: 'custom-swal',
        }
      })
      return;
    }

    const putData = {

      IDFUNCIONARIO: dadosAtualizarFuncionarios[0]?.IDFUNCIONARIO,
      IDSUBGRUPOEMPRESARIAL: dadosAtualizarFuncionarios[0]?.IDSUBGRUPOEMPRESARIAL,
      IDEMPRESA: empresaSelecionada,
      NUCPF: dadosAtualizarFuncionarios[0]?.NUCPF,
      NOLOGIN: dadosAtualizarFuncionarios[0]?.NOLOGIN,
      PWSENHA: dadosAtualizarFuncionarios[0]?.PWSENHA,
      IDFUNCIONARIOULTALTERACAO: usuarioLogado.id,
    }

    try {
      const response = await put('/funcionario-loja-comercial/:id', putData)

      Swal.fire({
        title: 'Atualização',
        text: 'Atualizção Realizada com Sucesso',
        icon: 'success',
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      })

      const textDados = JSON.stringify(putData)
      const textoFuncao = 'COMERCIAL/ ALTUALIZAÇÃO DE FUNCIONARIOS';
      const ipUsuario = await getIPUsuario();

      const createData = {
        IDFUNCIONARIO: String(usuarioLogado.id),
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario
      }

      await post('/log-web', createData)


      return response.data;
    } catch (error) {
        const textDados = JSON.stringify(putData)
      const textoFuncao = 'COMERCIAL/ ALTUALIZAÇÃO DE FUNCIONARIOS';
      const ipUsuario = await getIPUsuario();

      const createData = {
        IDFUNCIONARIO: String(usuarioLogado.id),
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario
      }

      const response = await post('/log-web', createData)
      Swal.fire({
        title: 'Erro ao Atualizar',
        text: 'Erro ao Tentar Atualizar',
        icon: 'error',
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      })
      console.error('Erro ao parsear o usuário do localStorage:', error);
      return response.data;
    }
  }


  const handleRadioChange = (event) => {
    const { id } = event.target;
    if (id === 'radioCLT') {
      setCategoriaContratacao('CLT');
    } else if (id === 'radioPJ') {
      setCategoriaContratacao('PJ');
    }
  };


  const loginConfirmacao = async () => {
    setFormularioVisivelLogin(true);
    setFormularioVisivel(false);

    const postData = {
      usuario: usuario,
      senha: senha,
      modulo: selectedModule?.nome
    }
    try {
      const response = await post('/login', postData);

      const textDados = JSON.stringify(postData)
      const textoFuncao = 'RH/AUTORIZAÇÃO DESCONTO FOLHA FUNCIONARIO';

      const createLog = {
        IDFUNCIONARIO: usuarioLogado.id,
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario
      }

      const responsePost = await post('/log-web', createLog)

      setFormularioVisivelLogin(false);
      setFormularioVisivel(true);
      setIsLoading(true);
      return responsePost.data;
    } catch (error) {
      Swal.showValidationMessage(`Erro ao autenticar: ${error.message}`);
    }

  };




  const localizacao = [
    {
      id: 1,
      label: "Loja",
      value: "True"
    },
    {
      id: 2,
      label: "Escritório",
      value: "False"
    }
  ]

  const situacao = [
    {
      id: 1,
      label: "Ativo",
      value: "True"
    },
    {
      id: 2,
      label: "Inativo",
      value: "False"
    }
  ]

  const tipo = [
    {
      id: 1,
      label: "Selecione...",
      value: "0"
    },
    {
      id: 2,
      label: "Funcionário",
      value: "FUNCIONARIO"
    },
    {
      id: 3,
      label: "Parceiro de Negócios Apoio",
      value: "PN"
    },
    {
      id: 4,
      label: "Parceiro de Negócios PJ",
      value: "PN"
    }
  ]

  return {
    empresaSelecionada,
    setEmpresaSelecionada,
    funcaoSelecionado,
    setFuncaoSelecionado,
    tipoSelecionado,
    setTipoSelecionado,
    dataAdmissao,
    setDataAdmissao,
    cpf,
    setCPF,
    nomeFuncionario,
    setNomeFuncionario,
    localizacaoSelecionada,
    setLocalizacaoSelecionada,
    categoriaContratacao,
    setCategoriaContratacao,
    valorDesconto,
    setValorDesconto,
    valorSalario,
    setValorSalario,
    usuario,
    setUsuario,
    senha,
    setSenha,
    repitaSenha,
    setRepitaSenha,
    situacaoSelecionada,
    setSituacaoSelecionada,
    isChecked,
    setIsChecked,
    ipUsuario,
    setIpUsuario,
    formularioVisivel,
    setFormularioVisivel,
    formularioVisivelLogin,
    setFormularioVisivelLogin,
    isLoading,
    setIsLoading,
    onSubmit,
    handleRadioChange,
    localizacao,
    situacao,
    Parceiro,
    Funcoes,
    tipo,
    loginConfirmacao
  }
}