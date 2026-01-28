import Swal from "sweetalert2";
import { get, post, put } from "../../../../../api/funcRequest";
import { useQuery } from "react-query";
import { useEffect, useState } from "react";
import axios from 'axios';
import { Funcoes } from '../../../../../../tipoFuncao.json';
import { Parceiro, situacao, localizacao } from '../../../../../../parceiro.json';
import { removerMascaraCPF } from "../../../../../utils/formatCPF";


export const useEditarDescontoFuncionario = ({ 
  handleClose, 
  dadosAtualizarFuncionarios, 
  handleClick, 
  refetch,
  usuarioLogado, 
  optionsModulos,
}) => {
    const [empresa, setEmpresa] = useState('');
    const [cpf, setCpf] = useState('');
    const [funcionario, setFuncionario] = useState('');
    const [motivoDesconto, setMotivoDesconto] = useState('');
    const [percentualDesconto, setPercentualDesconto] = useState('');
    const [dataInicioDesconto, setDataInicioDesconto] = useState('');
    const [dataFimDesconto, setDataFimDesconto] = useState('');
    const [usuarioLogado, setUsuarioLogado] = useState(null)
    const [ipUsuario, setIpUsuario] = useState('')

  const getIPUsuario = async () => {
    try {
      const { data: ipWhoisData } = await axios.get("http://ipwho.is/");
      let usuarioIP = ipWhoisData?.ip;

      if (!usuarioIP) {
          const { data: ipifyData } = await axios.get("https://api.ipify.org?format=json");
          usuarioIP = ipifyData?.ip;
      }

      setIpUsuario(usuarioIP);
      return usuarioIP;
    } catch (error) {
      console.error("Erro ao buscar IP:", error);
      return null;
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

 

  const onSubmit = async (e) => {

    if (optionsModulos[0]?.ALTERAR == 'False') {
      Swal.fire({
        title: 'Acesso Negado',
        text: 'Usuário não tem permissão para Atualizar Funcionários',
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
      refetch();
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

    onSubmit,
   

  }
}
