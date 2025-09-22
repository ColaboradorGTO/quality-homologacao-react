import Swal from "sweetalert2";
import { get, post, put } from "../../../../../api/funcRequest";
import { useQuery } from "react-query";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDataAtual } from "../../../../../utils/dataAtual";
import axios from 'axios';
import { Funcoes } from '../../../../../../tipoFuncao.json';
import { Parceiro, situacao, localizacao } from '../../../../../../parceiro.json';
import { removerMascaraCPF } from "../../../../../utils/formatCPF";

export const useCriarFuncionario = ({ handleClose }) => {
  const [empresaSelecionada, setEmpresaSelecionada] = useState('');
  const [subGrupoEmpresarialSelecionado, setSubGrupoEmpresarialSelecionado] = useState('');
  const [funcaoSelecionada, setFuncaoSelecionada] = useState('');
  const [cpfFuncionario, setCPFFuncionario] = useState('');
  const [nomeFuncionario, setNomeFuncionario] = useState('');
  const [localizacaoSelcionada, setLocalizacaoSelecionada] = useState('');
  const [categoriaContratacao, setCategoriaContratacao] = useState('');
  const [dataAdmissao, setDataAdmissao] = useState('');
  const [valorSalario, setValorSalario] = useState('');
  const [valorDesconto, setValorDesconto] = useState(0);
  const [situacaoSelecionada, setSituacaoSelecionada] = useState('');
  const [tipoSelecionado, setTipoSelecionado] = useState('');
  const [isChecked, setIsChecked] = useState(false);;
  const [cpf, setCPF] = useState('');
  const [ipUsuario, setIpUsuario] = useState('');
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [funcionarioExistente, setFuncionarioExistente] = useState([]);
  const [excecao, setExcecao] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [usuarioAutorizado, setUsuarioAutorizado] = useState(null);
  const [formularioVisivelLogin, setFormularioVisivelLogin] = useState(false);
  const [formularioVisivel, setFormularioVisivel] = useState(true);
  const [usuario, setUsuario] = useState('')
  const [senha, setSenha] = useState('')
  const [repitaSenha, setRepitaSenha] = useState('')
  const storedModule = localStorage.getItem('moduloselecionado');
  const selectedModule = JSON.parse(storedModule);

  const navigate = useNavigate();

  useEffect(() => {
    const dataAtual = getDataAtual()
    setDataAdmissao(dataAtual)
  }, [])

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
  }, []);

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


  const { data: optionsEmpresas = [], error: errorEmpresas, isLoading: isLoadingEmpresas } = useQuery(
    'listaEmpresasIformatica',
    async () => {
      const response = await get(`/listaEmpresasIformatica`);
      return response.data;
    },
    { staleTime: 5 * 60 * 1000, cacheTime: 5 * 60 * 1000 }
  );


  const { data: optionsCPF = [], error: errorCPF, isLoading: isLoadingCPF } = useQuery(
    ['funcionarios-loja', cpfFuncionario],
    async () => {
      const response = await get(`/funcionarios-loja?cpf=${removerMascaraCPF(cpfFuncionario)}`);
      console.log(response.data, 'response.data');
      if (response.data.length > 0) {
        setFuncionarioExistente(response.data[0])
      }
      return response.data;
    },
    { enabled: cpfFuncionario.length > 9, staleTime: 5 * 60 * 1000, cacheTime: 5 * 60 * 1000 }
  );

  useEffect(() => {
    if (funcionarioExistente) {
      setEmpresaSelecionada({ value: funcionarioExistente?.IDEMPRESA, label: funcionarioExistente?.NOFANTASIA });
      setSubGrupoEmpresarialSelecionado(funcionarioExistente?.IDSUBGRUPOEMPRESARIAL);
      setFuncaoSelecionada({ value: funcionarioExistente?.DSFUNCAO, label: funcionarioExistente?.DSFUNCAO });
      setNomeFuncionario(funcionarioExistente?.NOFUNCIONARIO);
      setLocalizacaoSelecionada({ value: funcionarioExistente?.STLOJA == 'True' ? 'Loja' : 'Escritório', label: funcionarioExistente?.STLOJA == 'True' ? 'Loja' : 'Escritório' });
      setCategoriaContratacao(funcionarioExistente.DSTIPO);
      setDataAdmissao(funcionarioExistente.DATA_ADMISSAO);
      setValorSalario(funcionarioExistente.VALORSALARIO);
      setValorDesconto(funcionarioExistente.PERC);
      setSituacaoSelecionada({ value: funcionarioExistente?.STLOJA == 'True' ? 'Ativo' : 'Inativo', label: funcionarioExistente?.STLOJA == 'True' ? 'Ativo' : 'Inativo' });
      setTipoSelecionado({ value: funcionarioExistente?.DSTIPO, label: funcionarioExistente?.DSTIPO });
      if (funcionarioExistente.STCONVENIO == 'True' && funcionarioExistente.STDESCONTOFOLHA == 'True') {
        setIsChecked(true);
        setCategoriaContratacao('CLT');
      } else if (funcionarioExistente.STCONVENIO == 'False' && funcionarioExistente.STDESCONTOFOLHA == 'False') {
        setIsChecked(false);
        setCategoriaContratacao('PJ');
      }
      setSenha(funcionarioExistente.PWSENHA);
      setCPF(funcionarioExistente.NUCPF);
    }


  }, [funcionarioExistente]);
  useEffect(() => {
    if (optionsCPF && optionsCPF.length > 0) {
      Swal.fire({
        title: 'Funcionário já cadastrado!',
        icon: 'warning',
        confirmButtonText: 'Ok',
        customClass: {
          container: 'custom-swal',
        }
      });
    }
  }, [optionsCPF]);


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

  const onSubmit = async (e) => {
    let maximoDesconto = 0;
    let dataBase = new Date('2024-08-01')
    let diferencaDias = Math.ceil((dataBase - new Date()) / (1000 * 60 * 60 * 24));

    if(diferencaDias < 90) {
      maximoDesconto = 10;
    } else if(diferencaDias >= 90 && diferencaDias < 365) {
      maximoDesconto = 15;
    } else if(diferencaDias >= 365 && diferencaDias < 730) {
      maximoDesconto = 20;
    }

    const cpfSemMascara = removerMascaraCPF(cpfFuncionario);

    const funcao = usuarioLogado?.DSFUNCAO;
    if (funcao !== 'TI') {
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
        title: 'Desconto maior que permitido',
        text: 'Valor Desconto maior que permitido',
        icon: 'error',
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      })
      return;
    }

    if (cpfSemMascara.length !== 11) {
      Swal.fire({
        title: 'Erro ao Cadastrar',
        text: 'CPF Inválido ou Incompleto',
        icon: 'error',
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      })
      return;
    }

    const postData = {
      IDSUBGRUPOEMPRESARIAL: subGrupoEmpresarialSelecionado,
      IDEMPRESA: empresaSelecionada.value,
      NOFUNCIONARIO: nomeFuncionario,
      NUCPF: cpfSemMascara,
      PWSENHA: cpfSemMascara.substring(0, 5),
      DSFUNCAO: funcaoSelecionada.value,
      VALORSALARIO: valorSalario,
      PERC: valorDesconto,
      STATIVO: 'True',
      DSTIPO: tipoSelecionado.value,
      VALORDISPONIVEL: 0,
      STCONVENIO: isChecked,
      STDESCONTOFOLHA: isChecked,
      STLOJA: localizacaoSelcionada.value,
      DATA_ADMISSAO: dataAdmissao,

    }

    const putData = {
      IDFUNCIONARIO: funcionarioExistente.IDFUNCIONARIO,
      IDSUBGRUPOEMPRESARIAL: subGrupoEmpresarialSelecionado,
      IDEMPRESA: empresaSelecionada.value,
      NOFUNCIONARIO: nomeFuncionario,
      IDPERFIL: funcionarioExistente.IDPERFIL,
      NUCPF: cpfSemMascara,
      NOLOGIN: funcionarioExistente.NULOGIN,
      PWSENHA: cpfSemMascara.substring(0, 5),
      DSFUNCAO: funcaoSelecionada.value,
      VALORSALARIO: valorSalario,
      PERC: valorDesconto,
      STATIVO: situacaoSelecionada.value,
      DSTIPO: tipoSelecionado.value,
      VALORDISPONIVEL: 0,
      STCONVENIO: isChecked,
      STDESCONTOFOLHA: isChecked,
      STLOJA: localizacaoSelcionada.value,
    }

    try {
      let response;
      if (funcionarioExistente) {
        response = await put('/funcionarios-loja/:id', putData); // Fazer PUT se o funcionário já existir
      } else {
        response = await post('/criar-funcionarios-loja', postData); // Fazer POST se o funcionário não existir
      }


      // const response = await post('/criar-funcionarios-loja', putData)

      setEmpresaSelecionada('');
      setNomeFuncionario('');
      setCPFFuncionario('');
      setValorSalario('');
      setValorDesconto(0);
      setTipoSelecionado('');
      setLocalizacaoSelecionada('');

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
      const textoFuncao = 'RH/UPDATE DE FUNCIONARIOS';


      const createData = {
        IDFUNCIONARIO: usuarioLogado.id,
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario
      }

      const responsePost = await post('/log-web', createData)

      handleClose();
      return responsePost.data;
    } catch (error) {
      const textDados = JSON.stringify(putData)
      const textoFuncao = 'RH/ERRO AO CRIAR OU ATUALIZAR FUNCIONARIO';


      const createData = {
        IDFUNCIONARIO: usuarioLogado.id,
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario
      }

      const responsePost = await post('/log-web', createData)

      Swal.fire({
        title: 'Erro ao Atualizar',
        text: 'Erro ao Tentar Atualizar',
        icon: 'error',
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      })
      return responsePost.data;
    }
  }

  const handleChangeEmpresa = (e) => {
    setEmpresaSelecionada(e.value);
    const empresa = optionsEmpresas.find((item) => item.IDEMPRESA === e.value);
    setSubGrupoEmpresarialSelecionado(empresa.IDSUBGRUPOEMPRESARIAL);
  }



  return {
    empresaSelecionada,
    setEmpresaSelecionada,
    subGrupoEmpresarialSelecionado,
    setSubGrupoEmpresarialSelecionado,
    funcaoSelecionada,
    setFuncaoSelecionada,
    cpfFuncionario,
    setCPFFuncionario,
    nomeFuncionario,
    setNomeFuncionario,
    localizacaoSelcionada,
    setLocalizacaoSelecionada,
    categoriaContratacao,
    setCategoriaContratacao,
    dataAdmissao,
    setDataAdmissao,
    valorSalario,
    setValorSalario,
    valorDesconto,
    setValorDesconto,
    situacaoSelecionada,
    setSituacaoSelecionada,
    tipoSelecionado,
    setTipoSelecionado,
    isChecked,
    setIsChecked,
    senha,
    setSenha,
    repitaSenha,
    setRepitaSenha,
    cpf,
    setCPF,
    ipUsuario,
    setIpUsuario,
    usuarioLogado,
    setUsuarioLogado,
    excecao,
    setExcecao,
    formularioVisivelLogin,
    setFormularioVisivelLogin,
    formularioVisivel,
    setFormularioVisivel,
    usuario,
    setUsuario,
    optionsEmpresas,
    optionsCPF,
    handleRadioChange,
    handleChangeEmpresa,
    Funcoes,
    localizacao,
    situacao,
    Parceiro,
    onSubmit,
    loginConfirmacao  
  
  }
}

// NOLOGIN: "32264"
// PWSENHA: "36943"