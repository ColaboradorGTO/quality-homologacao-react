import React, { useState, useEffect } from "react";
import { useQuery } from 'react-query';
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Funcoes }  from '../../../../../../tipoFuncao.json';
import { Parceiro } from '../../../../../../parceiro.json';
import { get, post, put } from "../../../../../api/funcRequest";

export const useEditarFuncionario = ({dadosAtualizarFuncionarios}) => {
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
    const [usuarioLogado, setUsuarioLogado] = useState(null)
    const [formularioVisivel, setFormularioVisivel] = useState(true);
    const [formularioVisivelLogin, setFormularioVisivelLogin] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
  
    useEffect(() => {
      const usuarioArmazenado = localStorage.getItem('usuario');
  
      if (usuarioArmazenado) {
        try {
          const parsedUsuario = JSON.parse(usuarioArmazenado);
          setUsuarioLogado(parsedUsuario);
        } catch (error) {
          console.error('Erro ao parsear o usuário do localStorage:', error);
        }
      } else {
        navigate('/');
      }
    }, [navigate]);
  
    useEffect(() => {
      getIPUsuario();
    }, [usuarioLogado]);
  
    const getIPUsuario = async () => {
      const response = await axios.get('http://ipwho.is/');
      if (response.data) {
        setIpUsuario(response.data.ip);
      }
      return response.data;
    };
  
    const { data: optionsEmpresas = [], error: errorEmpresas, isLoading: isLoadingEmpresas, refetch } = useQuery(
      'listaEmpresasIformatica',
      async () => {
        const response = await get(`/listaEmpresasIformatica`);
        return response.data;
      },
      {
        staleTime: 5 * 60 * 1000, cacheTime: 5 * 60 * 1000
      }
    );
  
  
    useEffect(() => {
      if (dadosAtualizarFuncionarios) {
        setEmpresaSelecionada(dadosAtualizarFuncionarios[0]?.IDEMPRESA);
        setFuncaoSelecionado(dadosAtualizarFuncionarios[0]?.DSFUNCAO);
        setTipoSelecionado(dadosAtualizarFuncionarios[0]?.DSTIPO);
        setCPF(dadosAtualizarFuncionarios[0]?.NUCPF);
        setNomeFuncionario(dadosAtualizarFuncionarios[0]?.NOFUNCIONARIO);
        setLocalizacaoSelecionada(dadosAtualizarFuncionarios[0]?.STLOJA);
        setValorSalario(dadosAtualizarFuncionarios[0]?.VALORSALARIO);
        setValorDesconto(dadosAtualizarFuncionarios[0]?.PERC);
        setSituacaoSelecionada(dadosAtualizarFuncionarios[0]?.STATIVO);
        setSenha(dadosAtualizarFuncionarios[0]?.PWSENHA);
        setRepitaSenha(dadosAtualizarFuncionarios[0]?.PWSENHA);

      }
  
    }, [dadosAtualizarFuncionarios]);
  
    const onSubmit = async (e) => {
      // e.preventDefault();
      const funcao = dadosAtualizarFuncionarios[0]?.DSFUNCAO;
  
      if(funcao !== 'TI') {
        Swal.fire({
          title: 'Acesso Negado',
          text: 'Usuário não tem permissão para desconto maior ou igual há 20%',
          icon: 'error',
          timer: 3000,
          customClass: {
            container: 'custom-swal',
          }
        })
        return;
      }
  
      if (parseFloat(valorDesconto) > 50) {
        Swal.fire({
          title: 'Acesso Negado',
          text: 'Valor Desconto maior que permitido',
          icon: 'error',
          timer: 3000,
          customClass: {
            container: 'custom-swal',
          }
        })
        return;
      }
  
  
      const putData = {
        NOLOGIN: dadosAtualizarFuncionarios[0]?.NOLOGIN,
        PWSENHA: dadosAtualizarFuncionarios[0]?.PWSENHA,
        IDEMPRESA: empresaSelecionada,
        IDSUBGRUPOEMPRESARIAL: dadosAtualizarFuncionarios[0]?.IDSUBGRUPOEMPRESARIAL,
        IDFUNCIONARIO: dadosAtualizarFuncionarios[0]?.IDFUNCIONARIO,
        IDFUNCALTERACAO: usuarioLogado?.id,
        ID: dadosAtualizarFuncionarios[0]?.ID,
        
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
  
  
        const createData = {
          IDFUNCIONARIO: usuarioLogado.id,
          PATHFUNCAO: textoFuncao,
          DADOS: textDados,
          IP: ipUsuario
        }
  
        const responsePost = await post('/log-web', createData)
  
  
        return responsePost.data;
      } catch (error) {
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
        usuarioLogado,
        setUsuarioLogado,
        formularioVisivel,
        setFormularioVisivel,
        formularioVisivelLogin,
        setFormularioVisivelLogin,
        isLoading,
        setIsLoading,
        navigate,
        optionsEmpresas,
        errorEmpresas,
        isLoadingEmpresas,
        refetch,
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