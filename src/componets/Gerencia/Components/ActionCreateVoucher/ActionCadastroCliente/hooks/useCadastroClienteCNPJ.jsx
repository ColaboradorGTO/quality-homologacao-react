import Swal from "sweetalert2";
import { get, post } from "../../../../../../api/funcRequest";
import { useEffect } from "react";
import { useQuery } from "react-query";
import { getDataAtual } from "../../../../../../utils/dataAtual";
import { useState } from "react";
import { removerMascaraCPF } from "../../../../../../utils/formatCPF";
import { validarCNPJ } from "../../../../../../utils/mascaraCNPJ";
import axios from "axios";
    const URL_PUBLICAWS = 'https://publica.cnpj.ws/cnpj/{CNPJ}';

    const API_URLS = {
        PUBLICAWS: 'https://publica.cnpj.ws/cnpj/{CNPJ}',
        URL_MINHA_RECEITA: 'https://minhareceita.org/{CNPJ}',
        URL_RECEITAWS: 'https://www.receitaws.com.br/v1/cnpj/{CNPJ}',
        URL_VIA_CEP: 'https://viacep.com.br/ws/{CEP}/json/',
        URL_VIA_CEP_REDUNDANCIA: 'https://opencep.com/v1/{CEP}.json'
    
}
async function getDadosEnderecoViaCep_API_externa(cep) {
    const URL_VIA_CEP = 'https://viacep.com.br/ws/{CEP}/json/';
    cep = cep.replace(/\D/g, "");

    try {
        const response = await axios.get(URL_VIA_CEP.replace('{CEP}', cep));
        const data = response.data;
        let { erro } = data || {};

        // Se não houver erro, status é 200
        let status = erro ? 429 : 200;

        if (status !== 200) {
            return { status: 429, message: 'CEP INVÁLIDO OU NÃO ENCONTRADO, verifique e tente novamente!' };
        }

        return { status, data };
    } catch (respError) {
        let status = respError?.response?.status || 500;
        let message = respError?.response?.statusText || respError?.message || 'Erro ao consultar o CEP';
        return { status, message };
    }
}

async function validaCEP(cep, verificarNaApi = false) {
    const regex = /^[0-9]{5}-?[0-9]{3}$/;
    
    if (!regex.test(cep)){
        return false;
    }

    if(verificarNaApi){
        let respCep = await getDadosEnderecoViaCep_API_externa(cep);

        return !(respCep?.erro == 'true'); 
    }

    return true;
}

async function getDadosEnderecoViaCep_API_redundancia(cep) {
    const URL_VIA_CEP = 'https://opencep.com/v1/{CEP}.json';
    cep = cep.replace(/\D/g, "");

    try {
        const response = await axios.get(URL_VIA_CEP.replace('{CEP}', cep));
        const data = response.data;
        let { erro } = data || {};

        // Se não houver erro, status é 200
        let status = erro ? 429 : 200;

        if (status !== 200) {
            return { status: 429, message: 'CEP INVÁLIDO OU NÃO ENCONTRADO, verifique e tente novamente!' };
        }

        return { status, data };
    } catch (respError) {
        let status = respError?.response?.status || 500;
        let message = respError?.response?.statusText || respError?.message || 'Erro ao consultar o CEP';
        return { status, message };
    }
}

export const useCadastrarClienteCNPJ = ({ usuarioLogado, optionsModulos, handleClose }) => {
    const [idCliente, setIdCliente] = useState('');
    const [tipo, setTipo] = useState('');
    const [dataCadastro, setDataCadastro] = useState('');
    const [cnpj, setCnpj] = useState('');
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

    const URL_PUBLICAWS = 'https://publica.cnpj.ws/cnpj/{CNPJ}';
    const URL_MINHA_RECEITA = 'https://minhareceita.org/{CNPJ}';
    const URL_RECEITAWS = 'https://www.receitaws.com.br/v1/cnpj/{CNPJ}';
    const URL_VIA_CEP = 'https://viacep.com.br/ws/{CEP}/json/';
    const URL_VIA_CEP_REDUNDANCIA = 'https://opencep.com/v1/{CEP}.json';

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

    async function getDadosCNPJRedundancia_API_externa(cnpj) {
        try {
            const response = await axios.get(URL_RECEITAWS.replace('{CNPJ}', cnpj));
            let { status, message } = response.data || {};

            if (status === 'OK') status = 200;
            if (status !== 200) throw { status, message };

            response.data.descApi = "API-receitaws";
            return { status, data: response.data };
        } catch (error) {
            let status = error?.response?.data?.status || error?.status || 400;
            let message = error?.response?.data?.message || error?.message;
            return { status, message };
        }
    }

    async function getDadosCNPJComIE_API_externa(cnpj) {
        try {
            const response = await axios.get(URL_PUBLICAWS.replace('{CNPJ}', cnpj));
            let status = response.data?.status || 200;
            if (status === 'OK') status = 200;

            response.data.descApi = "API-publicaws";
            return { status, data: response.data };
        } catch (error) {
            let status = error?.response?.data?.status || error?.status || 400;
            let message = error?.response?.data?.detalhes || error?.response?.data?.message || error?.message;
            return { status, message };
        }
    }

    async function getDadosExistenciaCNPJ_API_externa(cnpj) {
        try {
            const response = await axios.get(URL_MINHA_RECEITA.replace('{CNPJ}', cnpj));
            response.data.descApi = "API-minhareceita";
            return { status: 200, data: response.data };
        } catch (error) {
            let status = error?.response?.data?.status || error?.status || 400;
            let message = error?.response?.data?.message;
            if (!message && error?.response?.data?.responseText) {
            try {
                message = JSON.parse(error.response.data.responseText)?.message;
            } catch {}
            }
            if (status !== 200 && status !== 400) {
            // fallback para redundância
            return await getDadosCNPJRedundancia_API_externa(cnpj);
            }
            return { status, message };
        }
    }

    async function busca_e_valida_dados_empresa_com_API_externa(cnpj, stUltimaInstancia = false) {
        cnpj = cnpj.replace(/\D/g, "");
        console.log('Buscando dados para CNPJ:', cnpj);
        let objCliente = await getDadosExistenciaCNPJ_API_externa(cnpj);

        if(objCliente.status == 200) {
            const dadosComIE = await getDadosCNPJComIE_API_externa(cnpj); 

            if(dadosComIE.status == 200) {
                objCliente = dadosComIE;
            }
        } else {
            !stUltimaInstancia && (objCliente?.message || 'Erro ao tentar preencher os dados do cliente, recarregue e tente novamente!')
            return Swal.fire({
                title: 'Erro!',
                text: objCliente?.message || 'Erro ao tentar preencher os dados do cliente, recarregue e tente novamente!',
                icon: 'error',
                customClass: {
                    container: 'custom-swal',
                },
            });
        }
    }

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
        ['clientes', cnpj],
        async () => {
            const response = await get(`/clientes?cpfoucnpj=${removerMascaraCPF(cnpj)}`);

            return response.data;
        },
        { enabled: cnpj?.length >= 8, staleTime: 5 * 60 * 1000 }
    );

    useEffect(() => {
    if (cnpj?.length >= 13 && optionsCPF && optionsCPF.length === 0) {
        preenche_dados_registrados([], cnpj);
    }
    // Se quiser preencher os states quando encontrar cliente:
    if (optionsCPF && optionsCPF.length > 0) {
        // preenche os states normalmente
    }
}, [optionsCPF, cnpj]);

    async function preenche_cadastro_empresa_com_dados_de_API_externa(cnpj, stUltimaInstancia = false) {
        let {
            razao,
            fantasia,
            inscricaoEstadual,
            cnae,
            dataCriacaoEmpresa,
            tel1,
            tel2,
            email,
            cep,
            endereco,
            numeroEndereco,
            complemento,
        } = await busca_e_valida_dados_empresa_com_API_externa(cnpj, stUltimaInstancia) || "";
        console.log(cnpj,' - Dados retornados da API externa:', )
        if(razao) {
            setCNAE(cnae || '');
            setTelefoneCliente(tel1 || '');
            setTelefoneComercial(tel2 || '');
            setCep(cep || '');
            setIE(inscricaoEstadual || '');
            setDataCadastro(dataCriacaoEmpresa || '');
            setNomeClienteRazao(razao || '');
            setSobrenome(fantasia || '');
            setEndereco(endereco || '');
            setNumero(numeroEndereco || '');
            setComplemento(complemento || '');
            setEmail(email || '');

            if(cep) {
                await valida_e_preenche_cep_empresa_com_API_externa(cep, stUltimaInstancia)
            }
            return true;
        }
        return false;
    }

    async function preenche_dados_registrados(response, cnpj, stUltimaInstancia = false) {
        let cnpjEmpresaVoucher = cnpj.replace(/\D/g, "");
        console.log('CNPJ para consulta:', cnpjEmpresaVoucher);
        if(validarCNPJ(cnpj)) {
            await Swal.fire({
                title: 'Deseja Autocompletar ou Atualizar as Informações deste Cliente Automaticamente de Acordo Com o Cadastro na Receita Federal?',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sim',
                cancelButtonText: 'Não',
                customClass: { container: 'custom-swal' }
            }).then(async (result) => {
                if (result.isConfirmed) {
                    // animationLoadingStart("Carregando os dados do CNPJ... Por favor aguarde!");
    
    
                    let status = await preenche_cadastro_empresa_com_dados_de_API_externa(cnpjEmpresaVoucher);
    
                    if (status) {
                        await Swal.fire({
                            title: 'Sucesso!',
                            text: `Dados do CNPJ ${cnpj} carregados com sucesso!`,
                            icon: 'success',
                            customClass: {
                                container: 'custom-swal',
                            },
                        });
                    }
                }
                
            });

        }

        await preenche_cadastro_empresa_com_dados_de_API_externa(cnpjEmpresaVoucher, stUltimaInstancia);
    }

    async function valida_e_preenche_cep_empresa_com_API_externa(cepSemFormato, stUltimaInstancia = false) {
        let cep = cepSemFormato.replace(/\D/g, "");

        try {

            if(cep) {

                if(await validaCEP(cep)) {
                    let dadosCep = await getDadosEnderecoViaCep_API_externa(cep).then(async (response) => {
                        if(response.status !== 200) {
                            return await getDadosEnderecoViaCep_API_redundancia(cep).then(response => response.data)
                        }
                        return response.data;
                    })

                    setEndereco(dadosCep.logradouro || '');
                    setBairro(dadosCep.bairro || '');
                    setCidade(dadosCep.localidade || '');
                    setEstado(dadosCep.uf || '');
                    setNuIBGE(dadosCep.ibge || '');
                    
                } else {
                    !stUltimaInstancia && Swal.fire({
                        title: 'CEP inválido',
                        text: 'Por favor, verifique o CEP informado.',
                        icon: 'error',
                        confirmButtonText: 'Ok'
                    });
                    return false;
                }
            }
        } catch (e) {
            console.log("Erro ao retornar o autocomplete pelo CEP, ERROR: " + (e?.message || e));

            !stUltimaInstancia && Swal.fire({
                title: 'Erro',
                text: 'Erro ao tentar preencher os dados do cliente, recarregue e tente novamente!',
                icon: 'error',
                confirmButtonText: 'Ok'
            });
        }
    }

    useEffect(() => {
        if (optionsCPF.length > 0) {
            setIdCliente(optionsCPF[0]?.IDCLIENTE);
            setEmpresa(optionsCPF[0]?.IDEMPRESA);
            setDataCadastro(optionsCPF[0]?.DTCADASTRO);
            setCnpj(optionsCPF[0]?.NUCPFCNPJ);
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
        cnpj,
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
        setCnpj,
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