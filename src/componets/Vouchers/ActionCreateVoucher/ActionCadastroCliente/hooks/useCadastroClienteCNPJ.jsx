import Swal from "sweetalert2";
import { get, post } from "../../../../../api/funcRequest";
import { useEffect } from "react";
import { useQuery } from "react-query";
import { getDataAtual } from "../../../../../utils/dataAtual";
import { useState } from "react";
import { removerMascaraCPF } from "../../../../../utils/formatCPF";


export const useCadastrarClienteCNPJ = ({ usuarioLogado, optionsModulos, handleClose }) => {
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
    const [telefoneComercial, setTelefoneComercial] = useState('');
    const [ipUsuario, setIpUsuario] = useState('');


    useEffect(() => {
        const dataAtual = getDataAtual()
        setDataCadastro(dataAtual)

    }, []);

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
        if (optionsCPF.length > 0) {
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
        try {

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

            const textDados = JSON.stringify(putData)
            let textoFuncao = 'GERENCIA/CADASTRO DE CLIENTE';


            const postData = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textoFuncao,
                DADOS: textDados,
                IP: ipUsuario
            }

            const responsePost = await post('/log-web', postData)


            Swal.fire({
                title: 'Cadastro',
                text: 'Depósito cadastrado com Sucesso',
                icon: 'success'
            })

            handleClose();
            return responsePost.data;
        } catch (error) {
            console.error('Erro ao cadastrar cliente:', error);
            Swal.fire({
                title: 'Erro',
                text: 'Não foi possível cadastrar o cliente. Tente novamente.',
                icon: 'error'
            });
        }
    }

    return {
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
        cpfFuncionario,
        empresa,
        IE,
        IM,
        cnae,
        telefoneComercial,
        ipUsuario,

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
        setTelefoneComercial,
        onSubmit
    }
}