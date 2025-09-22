import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useQuery } from "react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getDataAtual } from "../../../utils/dataAtual";
import { get, post } from "../../../api/funcRequest";
import { InscricaoEstadual } from "../../../../parceiro.json";

export const useCadastroClienteVoucherCNPJ = () => {
  const [idCliente, setIdCliente] = useState('');
  const [tipo, setTipo] = useState('');
  const [dataCadastro, setDataCadastro] = useState('');
  const [cpf, setCpf] = useState('');
  const [nomeClienteRazao, setNomeClienteRazao] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [telefoneCliente, setTelefoneCliente] = useState('');
  const [numeroComercial, setNumeroComercial] = useState('');
  const [email, setEmail] = useState('');
  const [tipoIndicacaoIE, setTipoIndicacaoIE] = useState('');
  const [cep, setCep] = useState('');
  const [endereco, setEndereco] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [bairro, setBairro] = useState(''); 
  const [nuIBGE, setNuIBGE] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [cpfFuncionario, setCpfFuncionario] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [IE, setIE] = useState('');
  const [IM, setIM] = useState('');
  const [cnae, setCNAE] = useState('');
  const [telefoneComercial, setTelefoneCormercial] = useState('');
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const dataAtual = getDataAtual()
    setDataCadastro(dataAtual)
   
    const usuarioArmazenado = localStorage.getItem('usuario');

    if (usuarioArmazenado) {
      try {
        const parsedUsuario = JSON.parse(usuarioArmazenado);
        setUsuarioLogado(parsedUsuario);;
      } catch (error) {
        console.error('Erro ao parsear o usuário do localStorage:', error);
      }
    } else {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
  
  }, [usuarioLogado]);

  useEffect(() => {
    if (cep.length === 8) {
      getCEP();
    }

  }, [cep]);

  const getCEP = async () => {
    const response = await axios.get(`https://viacep.com.br/ws/${cep}/json`);
    if (response.data) {
      setCep(response.data.cep);
      setEndereco(response.data.logradouro);
      setComplemento(response.data.complemento);
      setBairro(response.data.bairro);
      setCidade(response.data.localidade);
      setEstado(response.data.uf);
      setNuIBGE(response.data.ibge);
   
    }
    return response.data;
  };

  const { data: optionsCPF = [], error: errorCPF, isLoading: isLoadingCPF } = useQuery(
    ['clientes', cpf],
    async () => {
      const response = await get(`/clientes?cpfoucnpj=${removerMascaraCPF(cpf)}`);
      console.log(response.data, 'response.data');
      return response.data;
    },
    { enabled: cpf?.length >= 8, staleTime: 5 * 60 * 1000 }
  );
  useEffect(() => {
    if(optionsCPF.length > 0) {
      setIdCliente(optionsCPF[0]?.IDCLIENTE);
      setEmpresa(optionsCPF[0]?.IDEMPRESA);
      setDataCadastro(optionsCPF[0]?.DTCADASTRO);
      setCpf(optionsCPF[0]?.NUCPFCNPJ);
      setNomeClienteRazao(optionsCPF[0]?.DSNOMERAZAOSOCIAL);
      setSobrenome(optionsCPF[0]?.DSAPELIDONOMEFANTASIA);
      setDataNascimento(optionsCPF[0]?.DTNASCFUNDACAO);
      setTelefoneCliente(optionsCPF[0]?.NUTELCELULAR);
      setEmail(optionsCPF[0]?.EEMAIL);
      setCep(optionsCPF[0]?.NUCEP);
      setEndereco(optionsCPF[0]?.EENDERECO);
      setNumero(optionsCPF[0]?.NUENDERECO);
      setComplemento(optionsCPF[0]?.ECOMPLEMENTO);
      setBairro(optionsCPF[0]?.EBAIRRO);
      setNuIBGE(optionsCPF[0]?.NUIBGE);
      setCidade(optionsCPF[0]?.ECIDADE);
      setEstado(optionsCPF[0]?.SGUF);
    }
  }, [optionsCPF])

 

  useEffect(() => {
    if (optionsCPF && optionsCPF.length > 0) {
      Swal.fire({
        title: 'Cliente já cadastrado!',
        icon: 'warning',
        confirmButtonText: 'Ok',
        customClass: {
          container: 'custom-swal',
        }
      });
    }
  }, [optionsCPF]);


  const onSubmit = async () => {
    const cpfSemMascara = removerMascaraCPF(cpfFuncionario);

    const putData = {
      IDCLIENTE: parseInt(idCliente),
      IDEMPRESA: parseInt(usuarioLogado?.IDEMPRESA),
      DSNOMERAZAOSOCIAL: cpf - nomeClienteRazao - sobrenome - nomeClienteRazao,
      DSAPELIDONOMEFANTASIA: cpf - sobrenome,
      TPCLIENTE: tipo,
      NUCPFCNPJ: cpfSemMascara.substring(0, 5),
      NURGINSCESTADUAL: IE,
      NUINSCMUNICIPAL: IM,
      NUINSCRICAOSUFRAMA: '',
      TPINDICADORINSCESTADUAL: '',
      STOPTANTESIMPLES: '',
      NUCEP: cep.replace(/\D/g, ""),
      NUIBGE: parseInt(nuIBGE),
      EENDERECO: endereco,
      NUENDERECO: numero,
      ECOMPLEMENTO: complemento,
      EBAIRRO: bairro,
      ECIDADE: cidade,
      SGUF: estado,
      EEMAIL: email,
      NUTELCOMERCIAL: numeroComercial,
      NUTELCELULAR: telefoneCliente.replace(/\D/g, ""),
      DTNASCFUNDACAO: dataNascimento,
      DSOBSERVACAO: '',
      NOCONTATOCLIENTE01: '',
      EEMAILCONTATOCLIENTE01: '',
      FONECONTATOCLIENTE01: '',
      DSCARGOCONTATOCLIENTE01: '',
      NOCONTATOCLIENTE02: '',
      EEMAILCONTATOCLIENTE02: '',
      FONECONTATOCLIENTE02: '',
      DSCARGOCONTATOCLIENTE02: '',
      STATIVO: 'True',
      DTULTALTERACAO: dataCadastro,
    }
    const response = await post('/cadastrar-deposito-loja', putData)
      .then(response => {
    
      })

    const textDados = JSON.stringify(putData)
    let textoFuncao = 'GERENCIA/CADASTRO DE CLIENTE';


    const postData = {
      IDFUNCIONARIO: usuarioLogado.id,
      PATHFUNCAO: textoFuncao,
      DADOS: textDados,
      IP: ipUsuario
    }

    const responsePost = await post('/log-web', postData)

      .catch(error => {
        Swal.fire({
          title: 'Cadastro',
          text: 'Depósito cadastrado com Sucesso',
          icon: 'success'
        })
        console.error('Erro ao Tentar Cadastrar Depósito: ', error);
      })
      handleClose();
      return responsePost.data;
  }

  return  {
    idCliente,
    tipo,
    dataCadastro,
    cpf,
    nomeClienteRazao,
    sobrenome,
    dataNascimento,
    telefoneCliente,
    numeroComercial,
    email,
    tipoIndicacaoIE,
    cep,
    endereco,
    numero,
    complemento,
    bairro,
    nuIBGE,
    cidade,
    estado,
    IE,
    IM,
    empresa,
    cnae,
    telefoneComercial,
    setIdCliente,
    setTipo,
    setDataCadastro,
    setCpf,
    setNomeClienteRazao,
    setSobrenome,
    setDataNascimento,
    setTelefoneCliente,
    setNumeroComercial,
    setEmail,
    setTipoIndicacaoIE,
    setCep,
    setEndereco,
    setNumero,
    setComplemento,
    setBairro,
    setNuIBGE,
    setCidade,
    setEstado,
    setIE,
    setIM,
    setCNAE,
    setTelefoneCormercial,
    InscricaoEstadual,
    onSubmit,
  }
}