import Swal from "sweetalert2";
import { get, post, put } from "../../../../../api/funcRequest";
import { removerMascaraCPF } from "../../../../../utils/formatCPF";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import { getDataAtual } from "../../../../../utils/dataAtual";
import { useNavigate } from "react-router-dom";

export const useCadastrarClienteCPF = ({ usuarioLogado, optionsModulos, handleClose, onCpf }) => {
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
    const [ipUsuario, setIpUsuario] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const dataAtual = getDataAtual()
        setDataCadastro(dataAtual)

    }, [usuarioLogado]);

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
        ['cliente-todos', cpf],
        async () => {
            const response = await get(`/cliente-todos?numeroCpfCnpj=${removerMascaraCPF(cpf)}`);
            console.log(response.data, 'response.data')
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


    const optionsIndicacaoIE = [
        { value: 9, label: 'Não Contribuinte Com ou Sem IE' },
        { value: 1, label: 'Contribuinte ICMS' },
        { value: 2, label: 'Contribuinte Isento de IE' },
    ]

    const readOnlyCpf = optionsCPF && optionsCPF.length > 0;

    console.log(tipoIndicacaoIE.value, 'tipoIndicacaoIE.value')
    const onSubmit = async () => {
        try {
            if (nomeClienteRazao == '') {
                Swal.fire({
                    title: 'Atenção',
                    text: 'O campo Nome é obrigatório.',
                    icon: 'warning',
                    customClass: {
                        container: 'custom-swal',
                    }
                });
                return;
            }

            if (sobrenome == '') {
                Swal.fire({
                    title: 'Atenção',
                    text: 'O campo Sobrenome é obrigatório.',
                    icon: 'warning',
                    customClass: {
                        container: 'custom-swal',
                    }
                });
                return;
            }

            if (cpf == '') {
                Swal.fire({
                    title: 'Atenção',
                    text: 'O campo CPF é obrigatório.',
                    icon: 'warning',
                    customClass: {
                        container: 'custom-swal',
                    }
                });
                return;
            }

            const cpfSemMascara = removerMascaraCPF(cpf);
            let IE = tipoIndicacaoIE == 2 ? 'ISENTO' : (tipoIndicacaoIE || 'ISENTO');
            let IM = '';

            const isUpdate = optionsCPF.length > 0 && idCliente;

            const putData = {
                ...(isUpdate && { IDCLIENTE: idCliente }),
                IDEMPRESA: parseInt(usuarioLogado?.IDEMPRESA),
                DSNOMERAZAOSOCIAL: nomeClienteRazao.toUpperCase(),
                DSAPELIDONOMEFANTASIA: sobrenome.toUpperCase(),
                TPCLIENTE: tipo.toUpperCase(),
                NUCPFCNPJ: cpfSemMascara,
                NURGINSCESTADUAL: IE,
                NUINSCMUNICIPAL: IM,
                NUCEP: cep.replace(/\D/g, ""),
                NUIBGE: parseInt(nuIBGE),
                EENDERECO: endereco.toUpperCase(),
                NUENDERECO: numero,
                ECOMPLEMENTO: complemento.toUpperCase(),
                EBAIRRO: bairro.toUpperCase(),
                ECIDADE: cidade.toUpperCase(),
                SGUF: estado.toUpperCase(),
                EEMAIL: email.toUpperCase(),
                NUTELCOMERCIAL: numeroComercial,
                NUTELCELULAR: telefoneCliente.replace(/\D/g, ""),
                DTNASCFUNDACAO: dataNascimento,
                IDINDICACAOIE: Number(tipoIndicacaoIE.value) || 0,
                DSINDICACAOIE: tipoIndicacaoIE?.label,
                IDFUNCIONARIO: Number(usuarioLogado.id),
            }

            const response = isUpdate ? await put('/todos-cliente/:id', putData) : await post('/criar-cliente', putData);
            const textDados = JSON.stringify(putData)
            let textoFuncao = isUpdate ? 'VOUCHER /ATUALIZAÇÃO DE CLIENTE' : 'VOUCHER /CRIAÇÃO DE CLIENTE'


            const postData = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textoFuncao,
                DADOS: textDados,
                IP: ipUsuario
            }

            const responsePost = await post('/log-web', postData)


            Swal.fire({
                title: isUpdate ? 'Atualização' : 'Cadastro',
                text: isUpdate
                    ? 'Cliente atualizado com sucesso'
                    : 'Cliente cadastrado com sucesso',
                icon: 'success',
                customClass: {
                    container: 'custom-swal',
                }
            });

            handleClose();
            setCpf('');
            setCep('');
            onCpf()
            return responsePost.data;

        } catch (error) {
            console.error("Erro ao processar cliente:", error);

            const isUpdate = optionsCPF.length > 0 && idCliente;
            let textoFuncao = isUpdate
                ? 'VOUCHER /ERRO AO ATUALIZAR CLIENTE'
                : 'VOUCHER /ERRO AO CADASTRAR CLIENTE';

            const postData = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textoFuncao,
                DADOS: '',
                IP: ipUsuario
            }
            await post('/log-web', postData);

            Swal.fire({
                title: 'Erro',
                text: `Ocorreu um erro ao ${isUpdate ? 'atualizar' : 'cadastrar'} o cliente: ${error.message}. Tente novamente.`,
                icon: 'error',
                customClass: {
                    container: 'custom-swal',
                }
            });
            return;
        }
    }


    return {
        idCliente,
        setIdCliente,
        tipo,
        setTipo,
        dataCadastro,
        setDataCadastro,
        cpf,
        setCpf,
        nomeClienteRazao,
        setNomeClienteRazao,
        sobrenome,
        setSobrenome,
        dataNascimento,
        setDataNascimento,
        telefoneCliente,
        setTelefoneCliente,
        numeroComercial,
        setNumeroComercial,
        email,
        setEmail,
        tipoIndicacaoIE,
        setTipoIndicacaoIE,
        cep,
        setCep,
        endereco,
        setEndereco,
        numero,
        setNumero,
        complemento,
        setComplemento,
        bairro,
        setBairro,
        nuIBGE,
        setNuIBGE,
        cidade,
        setCidade,
        estado,
        setEstado,
        cpfFuncionario,
        setCpfFuncionario,
        empresa,
        optionsIndicacaoIE,
        onSubmit,
        readOnlyCpf
    }
}