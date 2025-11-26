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

export const useEditarFuncionario = ({ handleClose, dadosAtualizarFuncionarios, handleClick }) => {
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
  const [excecao, setExcecao] = useState(false);
  const [formularioVisivelLogin, setFormularioVisivelLogin] = useState(false);
  const [formularioVisivel, setFormularioVisivel] = useState(true);
  const [usuario, setUsuario] = useState('')
  const [senha, setSenha] = useState('')
  const [repitaSenha, setRepitaSenha] = useState('')
  const storedModule = localStorage.getItem('moduloselecionado');
  const selectedModule = JSON.parse(storedModule);

  const navigate = useNavigate();

  /*   useEffect(() => {
      const dataAtual = getDataAtual()
      setDataAdmissao(dataAtual)
    }, []) */

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

  const getIPUsuario = async () => {
    try {
      const response = await axios.get('https://api.ipify.org?format=json9');
      if (response.data && response.data.ip) {
        return response.data.ip;
      }
      throw new Error("Resposta inválida do ipfy.org");
    } catch (error) {
      const responseIP2 = await axios.get('https://api.ipwho.org/me');
      return responseIP2.data?.data?.ip;

    }
  };

  const { data: optionsEmpresas = [], error: errorEmpresas, isLoading: isLoadingEmpresas } = useQuery(
    'listaEmpresasIformatica',
    async () => {
      const response = await get(`/listaEmpresasIformatica`);
      return response.data;
    },
    { staleTime: 5 * 60 * 1000, cacheTime: 5 * 60 * 1000 }
  );


  useEffect(() => {

    if (dadosAtualizarFuncionarios[0]) {
      setEmpresaSelecionada({ value: dadosAtualizarFuncionarios[0]?.IDEMPRESA, label: dadosAtualizarFuncionarios[0]?.NOFANTASIA });
      setSubGrupoEmpresarialSelecionado(dadosAtualizarFuncionarios[0]?.IDSUBGRUPOEMPRESARIAL);
      setFuncaoSelecionada({ value: dadosAtualizarFuncionarios[0]?.DSFUNCAO, label: dadosAtualizarFuncionarios[0]?.DSFUNCAO });
      setNomeFuncionario(dadosAtualizarFuncionarios[0]?.NOFUNCIONARIO);
      setLocalizacaoSelecionada({ value: dadosAtualizarFuncionarios[0]?.STLOJA == 'True' || "False", label: dadosAtualizarFuncionarios[0]?.STLOJA == 'True' ? 'Loja' : 'Escritório' });
      setCategoriaContratacao(dadosAtualizarFuncionarios[0].DSTIPO);
      if (dadosAtualizarFuncionarios[0]?.DATA_ADMISSAO) {
        const dataFormatada = dadosAtualizarFuncionarios[0]?.DATA_ADMISSAO.split('T')[0];
        setDataAdmissao(dataFormatada);
      }
      setValorSalario(dadosAtualizarFuncionarios[0].VALORSALARIO);
      setValorDesconto(dadosAtualizarFuncionarios[0].PERC);
      setSituacaoSelecionada({ value: dadosAtualizarFuncionarios[0]?.STLOJA == 'True' || 'False', label: dadosAtualizarFuncionarios[0]?.STLOJA == 'True' ? 'Ativo' : 'Inativo' });
      setTipoSelecionado({ value: dadosAtualizarFuncionarios[0]?.DSTIPO, label: dadosAtualizarFuncionarios[0]?.DSTIPO });
      if (dadosAtualizarFuncionarios[0].STCONVENIO == 'True' && dadosAtualizarFuncionarios[0].STDESCONTOFOLHA == 'True') {
        setIsChecked(true);
        setCategoriaContratacao('CLT');
      } else if (dadosAtualizarFuncionarios[0].STCONVENIO == 'False' && dadosAtualizarFuncionarios[0].STDESCONTOFOLHA == 'False') {
        setIsChecked(false);
        setCategoriaContratacao('PJ');
      }
      setSenha(dadosAtualizarFuncionarios[0].PWSENHA);
      setRepitaSenha(dadosAtualizarFuncionarios[0].PWSENHA);
      setCPF(dadosAtualizarFuncionarios[0].NUCPF);
    }


  }, [dadosAtualizarFuncionarios]);



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
      const ipUsuario = await getIPUsuario();
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

    if (diferencaDias < 90) {
      maximoDesconto = 10;
    } else if (diferencaDias >= 90 && diferencaDias < 365) {
      maximoDesconto = 15;
    } else if (diferencaDias >= 365 && diferencaDias < 730) {
      maximoDesconto = 20;
    }

    const cpfSemMascara = removerMascaraCPF(cpf);


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

    if (!empresaSelecionada || !empresaSelecionada.value) {
      Swal.fire({
        title: 'Erro ao Cadastrar',
        text: 'Empresa não selecionada',
        icon: 'error',
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      })
      return;

    }

    if (!funcaoSelecionada || !funcaoSelecionada.value) {
      Swal.fire({
        title: 'Erro ao Cadastrar',
        text: 'Função nao selecionada',
        icon: 'error',
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      })
      return;
    }


    if (!tipoSelecionado || !tipoSelecionado.value) {
      Swal.fire({
        title: 'Erro ao Cadastrar',
        text: 'Tipo nao selecionado',
        icon: 'error',
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      })
      return;
    }

    if (!dataAdmissao || !dataAdmissao === '') {
      Swal.fire({
        title: 'Erro ao Cadastrar',
        text: 'Data Admissão nao selecionada',
        icon: 'error',
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      })
      return;
    }

    if (!localizacaoSelcionada || !localizacaoSelcionada.value) {
      Swal.fire({
        title: 'Erro ao Cadastrar',
        text: 'Localização nao selecionada',
        icon: 'error',
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      })
      return;
    }

    if (!['CLT', 'PJ'].includes(categoriaContratacao)) {
      Swal.fire({
        title: 'Erro ao Cadastrar',
        text: 'Categoria de Contratação nao selecionada',
        icon: 'error',
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      })
      return;
    }

    if (valorSalario === '') {
      Swal.fire({
        title: 'Erro ao Cadastrar',
        text: 'Valor Salário não pode ser vazio',
        icon: 'error',
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      })
      return;
    }

    if (!situacaoSelecionada || !situacaoSelecionada.value) {
      Swal.fire({
        title: 'Erro ao Cadastrar',
        text: 'Situação nao selecionada',
        icon: 'error',
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      })
      return;
    }

    if (!nomeFuncionario || nomeFuncionario.trim() === '') {
      Swal.fire({
        title: 'Erro ao Cadastrar',
        text: 'Nome não pode ser vazio',
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


    const putData = {
      DATA_ADMISSAO: String(dataAdmissao),
      NOFUNCIONARIO: String(nomeFuncionario),
      NUCPF: String(cpfSemMascara),
      NOLOGIN: String(dadosAtualizarFuncionarios[0]?.NOLOGIN),
      PWSENHA: String(senha),
      IDEMPRESA: Number(empresaSelecionada.value),
      IDSUBGRUPOEMPRESARIAL: Number(subGrupoEmpresarialSelecionado),
      IDFUNCIONARIO: Number(dadosAtualizarFuncionarios[0]?.IDFUNCIONARIO),
      DSTIPO: tipoSelecionado.value,
      PERC: parseFloat(valorDesconto),
      VALORSALARIO: parseFloat(valorSalario),
      VALORDISPONIVEL: parseFloat(0),
      IDPERFIL: Number(dadosAtualizarFuncionarios[0]?.IDPERFIL),
      DSFUNCAO: String(funcaoSelecionada.value),
      STCONVENIO: String(categoriaContratacao) === 'CLT' ? 'True' : 'False',
      STDESCONTOFOLHA: String(categoriaContratacao) === 'CLT' ? 'True' : 'False',
      STLOJA: String(localizacaoSelcionada.value),
      STATIVO: String(situacaoSelecionada.value),
      IDFUNCALTERACAO: Number(usuarioLogado.id),
      MOTIVODESC: '',
      ID: Number(dadosAtualizarFuncionarios[0]?.ID)
    }

    try {

      const response = await put('/funcionarios-loja/:id', putData);



      const textDados = JSON.stringify(putData)
      const textoFuncao = 'RH/ATUALIZAÇÃO DE FUNCIONARIO';

      const ipUsuario = await getIPUsuario();
      const createData = {
        IDFUNCIONARIO: String(usuarioLogado.id),
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario
      }

      const responsePost = await post('/log-web', createData)

      Swal.fire({
        title: 'Atualização',
        text: 'Atualizção Realizada com Sucesso',
        icon: 'success',
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      })

      handleClose();
      return responsePost.data;
    } catch (error) {
      const textoFuncao = 'RH/ERRO AO ATUALIZAR FUNCIONARIO';

      const ipUsuario = await getIPUsuario();
      const createData = {
        IDFUNCIONARIO: String(usuarioLogado.id),
        PATHFUNCAO: textoFuncao,
        DADOS: '',
        IP: ipUsuario
      }
      handleClick()
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
    handleRadioChange,
    Funcoes,
    localizacao,
    situacao,
    Parceiro,
    onSubmit,
    loginConfirmacao

  }
}
