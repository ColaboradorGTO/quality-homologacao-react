import Swal from "sweetalert2";
import { get, post } from "../../../../api/funcRequest";
import { removerMascaraCPF } from "../../../../utils/formatCPF";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import { getDataAtual } from "../../../../utils/dataAtual";
import { useNavigate } from "react-router-dom";

export const useCriarCliente = ({ usuarioLogado, optionsModulos, handleClose }) => {
    const [ipUsuario, setIpUsuario] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const dataAtual = getDataAtual()
        setDataCadastro(dataAtual)

    }, [usuarioLogado]);



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

    // useEffect(() => {
    //     if (cep.length === 8) {
    //         getCEP();
    //     }

    // }, [cep]);

    // const getCEP = async () => {
    //     const response = await axios.get(`https://viacep.com.br/ws/${cep}/json`);
    //     if (response.data) {
    //         setCep(response.data.cep);
    //         setEndereco(response.data.logradouro);
    //         setComplemento(response.data.complemento);
    //         setBairro(response.data.bairro);
    //         setCidade(response.data.localidade);
    //         setEstado(response.data.uf);
    //         setNuIBGE(response.data.ibge);

    //     }
    //     return response.data;
    // };

    const { data: optionsCPF = [], error: errorCPF, isLoading: isLoadingCPF } = useQuery(
        ['clientes', cpf],
        async () => {
            const response = await get(`/clientes?cpfoucnpj=${removerMascaraCPF(cpf)}`);
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
        { value: 1, label: 'Contribuinte ICMS' },
        { value: 2, label: 'Contribuinte Isento de IE' },
        { value: 9, label: 'Não Contribuinte Com ou Sem IE' },
    ]

    const readOnlyCpf = optionsCPF && optionsCPF.length > 0;


    const onSubmit = async () => {
        try {
            if(nomeClienteRazao == '') {
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
    
            if(sobrenome == '') {
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
    
            if(cpf == '') {
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
    
            const putData = {
                IDEMPRESA: parseInt(usuarioLogado?.IDEMPRESA),
                DSNOMERAZAOSOCIAL: nomeClienteRazao,
                DSAPELIDONOMEFANTASIA: sobrenome,
                TPCLIENTE: tipo,
                NUCPFCNPJ: cpfSemMascara.substring(0, 5),
                NURGINSCESTADUAL: IE,
                NUINSCMUNICIPAL: IM,
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
                IDINDICACAOIE: tipoIndicacaoIE.value,
                DSINDICACAOIE: tipoIndicacaoIE?.label,
                IDFUNCIONARIO: usuarioLogado.id,
            }
        
            const response = await post('/criar-cliente', putData)
            const textDados = JSON.stringify(putData)
            let textoFuncao = 'VOUCHER /CADASTRO DE CLIENTE';
    
    
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
                icon: 'success',
                customClass: {
                    container: 'custom-swal',
                }
            })
                
            handleClose();
            setCpf('');
            setCep('');
            return responsePost.data;

        } catch (error) {
            console.error("Erro ao cadastrar cliente:", error);
             
            let textoFuncao = 'VOUCHER /ERRO AO CADASTRAR CLIENTE';
            const postData = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textoFuncao,
                DADOS: '',
                IP: ipUsuario
            }
            await post('/log-web', postData);
           
            Swal.fire({
                title: 'Erro',
                text: 'Ocorreu um erro ao cadastrar o cliente. Tente novamente.',
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