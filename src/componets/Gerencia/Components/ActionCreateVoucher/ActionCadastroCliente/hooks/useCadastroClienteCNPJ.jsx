import Swal from "sweetalert2";
import { get, post, put } from "../../../../../../api/funcRequest";
import { useEffect } from "react";
import { useQuery } from "react-query";
import { getDataAtual } from "../../../../../../utils/dataAtual";
import { useState } from "react";
import { removerMascaraCPF } from "../../../../../../utils/formatCPF";
import { validarCNPJ } from "../../../../../../utils/mascaraCNPJ";
import axios from "axios";
import { validarInscricaoEstadual } from "../../../../../../utils/validador-inscricao-estadual";
// import {getDadosEnderecoViaCep_API_externa, validaCEP, getDadosEnderecoViaCep_API_redundancia} from "./validationCNPJService"

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
    const [tipo, setTipo] = useState('JURIDICA');
    const [dataCadastro, setDataCadastro] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [nomeClienteRazao, setNomeClienteRazao] = useState('');
    const [sobrenome, setSobrenome] = useState('');
    const [dataCriacao, setDataCriacao] = useState('');
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
    const [clienteExistente, setClienteExistente] = useState([]);

    const URL_PUBLICAWS = 'https://publica.cnpj.ws/cnpj/{CNPJ}';
    const URL_MINHA_RECEITA = 'https://minhareceita.org/{CNPJ}';
    const URL_RECEITAWS = 'https://www.receitaws.com.br/v1/cnpj/{CNPJ}';


    useEffect(() => {
        const dataAtual = getDataAtual()
        setDataCadastro(dataAtual)

    }, []);

    useEffect(() => {

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
        console.log('🔥 CHAMADA API PUBLICA.WS - getDadosCNPJComIE_API_externa:', cnpj);
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
        console.log('🔥 CHAMADA API RECEITA FEDERAL - getDadosExistenciaCNPJ_API_externa:', cnpj);
        try {
            const response = await axios.get(URL_MINHA_RECEITA.replace('{CNPJ}', cnpj));
            response.data = "API-minhareceita";
         
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
                return await getDadosCNPJRedundancia_API_externa(cnpj);
            }
            return { status, message };
        }
    }

    async function busca_e_valida_dados_empresa_com_API_externa(cnpj, stUltimaInstancia = false) {
        cnpj = cnpj.replace(/\D/g, "");
        let objCliente = await getDadosExistenciaCNPJ_API_externa(cnpj);

        if(objCliente.status == 200) {
            const dadosComIE = await getDadosCNPJComIE_API_externa(cnpj); 

            if(dadosComIE.status == 200) {
                objCliente = dadosComIE;
            }
            
            const dados = objCliente.data;

            const dadosMapeados = {
                razao: dados.razao_social || '',
                fantasia: dados?.estabelecimento?.nome_fantasia || dados?.fantasia || dados?.nome_fantasia || dados?.razao_social || '',
                inscricaoEstadual: dados?.estabelecimento?.inscricoes_estaduais[0]?.inscricao_estadual || '',
                cnae: dados.estabelecimento?.atividade_principal?.id  || dados?.cnae_fiscal || '',
                dataCriacaoEmpresa: dados?.estabelecimento?.data_inicio_atividade || dados?.data_situacao ||  dados?.data_inicio_atividade || '',
              
                tel1: (dados?.estabelecimento?.ddd1 + dados?.estabelecimento?.telefone1) || dados?.telefone ||  (dados?.ddd_telefone || dados?.ddd_telefone_1.replace(/\D/g, "")) || '',
                tel2: (dados?.estabelecimento?.ddd2 + dados?.estabelecimento?.telefone2) || dados?.ddd_telefone_2 || '',
                email: dados?.estabelecimento?.email || dados?.email || '',
                cep: dados?.estabelecimento?.cep || dados?.cep || '',
                endereco: dados?.estabelecimento?.logradouro || dados?.logradouro || '',
                numeroEndereco: dados?.estabelecimento?.numero  || dados?.numero || '',
                complemento: dados?.estabelecimento?.complemento || dados?.complemento || '',

                bairro: dados?.estabelecimento?.bairro || dados?.bairro || '',
                cidade: dados?.estabelecimento?.cidade.nome || '',
                uf: dados?.estabelecimento?.estado?.sigla || '',
                codigoIbge: dados?.estabelecimento?.cidade?.ibge_id || ''
            };
            return dadosMapeados;

        } else {
            !stUltimaInstancia && Swal.fire({
                title: 'Erro!',
                text: objCliente?.message || 'Erro ao tentar preencher os dados do cliente, recarregue e tente novamente!',
                icon: 'error',
                customClass: {
                    container: 'custom-swal',
                },
            });
            return null;
        }
    }


    const { data: optionsCNPJ = [], error: errorCNPJ, isLoading: isLoadingCNPJ, refetch: refetchCNPJ } = useQuery(
        ['clientes', cnpj],
        async () => {
            const response = await get(`/clientes?cpfoucnpj=${removerMascaraCPF(cnpj)}`);
            setClienteExistente(response.data);
          
            return response.data;
        },
        { enabled: cnpj?.length >= 14, staleTime: 5 * 60 * 1000 }
    );

    // Removido useEffect desnecessário que causava refetch múltiplo

    useEffect(() => {
        console.log('DEBUG useEffect - CNPJ:', cnpj, 'Length:', cnpj?.length, 'optionsCNPJ:', optionsCNPJ?.length);
        
        if (cnpj?.length >= 14 && optionsCNPJ && optionsCNPJ.length === 0) {
            console.log('✅ Chamando API da Receita - Cliente NÃO encontrado no banco');
            preenche_dados_registrados([], cnpj);
        } else if (cnpj?.length >= 14 && optionsCNPJ && optionsCNPJ.length > 0) {
            console.log('❌ NÃO chamando API da Receita - Cliente JÁ existe no banco:', optionsCNPJ[0]);
        }

    }, [optionsCNPJ, cnpj]);

    async function preenche_cadastro_empresa_com_dados_de_API_externa(cnpj, stUltimaInstancia = false) {
        const dadosAPI = await busca_e_valida_dados_empresa_com_API_externa(cnpj, stUltimaInstancia);
 
        if(!dadosAPI) {
            return false;
        }

        const {
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
            bairro,
            cidade,
            uf,
            codigoIbge
        } = dadosAPI;

        if(razao) {
            setCNAE(cnae || '');
            setTelefoneCliente(tel1 || '');
            setTelefoneComercial(tel2 || '');
            setCep(cep || '');
            setIE(inscricaoEstadual || '');
            setDataCriacao(dataCriacaoEmpresa || ''); 
            setNomeClienteRazao(razao || '');
            setSobrenome(fantasia || '');
            setEndereco(endereco || '');
            setNumero(numeroEndereco || '');
            setComplemento(complemento || '');
            setEmail(email || '');
            setBairro(bairro || '');
            setCidade(cidade || '');
            setEstado(uf || '');
            setNuIBGE(codigoIbge || '');


            if(cep) {
                await valida_e_preenche_cep_empresa_com_API_externa(cep, stUltimaInstancia);
            }
            return true;
        }
        
        return false;
    }

    async function preenche_dados_registrados(response, cnpj, stUltimaInstancia = false) {
        let cnpjEmpresaVoucher = cnpj.replace(/\D/g, "");
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
  
        if (optionsCNPJ.length > 0) {
            setIdCliente(optionsCNPJ[0]?.IDCLIENTE);
            setEmpresa(optionsCNPJ[0]?.IDEMPRESA);
            setDataCadastro(optionsCNPJ[0]?.DTCADASTRO);
            setCnpj(optionsCNPJ[0]?.NUCPFCNPJ);
            setNomeClienteRazao(optionsCNPJ[0]?.DSNOMERAZAOSOCIAL);
            setSobrenome(optionsCNPJ[0]?.DSAPELIDONOMEFANTASIA);
            setDataCriacao(optionsCNPJ[0]?.DTNASCFUNDACAO);
            setTelefoneCliente(optionsCNPJ[0]?.NUTELCELULAR);
            setEmail(optionsCNPJ[0]?.EEMAIL);
            setCep(optionsCNPJ[0]?.NUCEP);
            setEndereco(optionsCNPJ[0]?.EENDERECO);
            setNumero(optionsCNPJ[0]?.NUENDERECO);
            setComplemento(optionsCNPJ[0]?.ECOMPLEMENTO);
            setBairro(optionsCNPJ[0]?.EBAIRRO);
            setNuIBGE(optionsCNPJ[0]?.NUIBGE);
            setCidade(optionsCNPJ[0]?.ECIDADE);
            setEstado(optionsCNPJ[0]?.SGUF);
        }

    }, [optionsCNPJ])



    useEffect(() => {
        if (optionsCNPJ && optionsCNPJ.length > 0) {
            Swal.fire({
                title: 'Cliente já cadastrado!',
                icon: 'warning',
                confirmButtonText: 'Ok',
                customClass: {
                    container: 'custom-swal',
                }
            });
        }
    }, [optionsCNPJ]);


    const optionsIndicacaoIE = [
        { value: 1, label: 'Contribuinte ICMS' },
        { value: 2, label: 'Contribuinte Isento de IE' },
        { value: 9, label: 'Não Contribuinte Com ou Sem IE' },
    ]


    const onSubmit = async () => {
        
        if(optionsModulos[0]?.CRIAR == 'False') {
            Swal.fire({
                title: 'Erro!',
                text: `${usuarioLogado?.NOFUNCIONARIO},\nVocê não tem permissão para criar um novo Cliente!`,
                icon: 'error',
                confirmButtonText: 'Ok',
                customClass: { container: 'custom-swal' },
            });
            return;
        }
        
        if(nomeClienteRazao.length < 3) {
            Swal.fire({
                title: 'Erro!',
                text: `O campo Nome/Razão Social deve conter no mínimo 3 caracteres.`,
                icon: 'error',
                confirmButtonText: 'Ok',
                customClass: { container: 'custom-swal' },
            });
            return;
        }
        if(sobrenome.length < 3) {
            Swal.fire({
                title: 'Erro!',
                text: `O campo Sobrenome/Nome Fantasia deve conter no mínimo 3 caracteres.`,
                icon: 'error',
                confirmButtonText: 'Ok',
                customClass: { container: 'custom-swal' },
            });
            return;
        }
        
        if(tipo == 'JURIDICA') {
            if(!tipoIndicacaoIE) {
                Swal.fire({
                    title: 'Atenção!',
                    text: `Inscrição Estadual Vazia ou Divergente do Tipo de Indicação, favor preencher e tentar novamente! 1`,
                    icon: 'warning',
                    confirmButtonText: 'Ok',
                    customClass: {
                        container: 'custom-swal',
                    }
                })
                return;
            }
    
            if(tipoIndicacaoIE == 1) {
                const ieNumeros = IE?.replace(/\D/g, "");
                
                if(!ieNumeros) {
                    Swal.fire({
                        title: 'Atenção!',
                        text: `Inscrição Estadual Vazia ou Divergente do Tipo de Indicação, favor preencher e tentar novamente! 2`,
                        icon: 'warning',
                        confirmButtonText: 'Ok',
                        customClass: {
                            container: 'custom-swal',
                        }
                    })
                    return;
                }

                if(!validarInscricaoEstadual(ieNumeros, estado)) {
                    Swal.fire({
                        title: 'Atenção!',
                        text: `Inscrição Estadual Incorreta, verifique e tente novamente! 3`,
                        icon: 'warning',
                        confirmButtonText: 'Ok',
                        customClass: {
                            container: 'custom-swal',
                        }
                    })
                    return;
                }
            } else if(tipoIndicacaoIE == 2) {
                if(IE && IE != 'ISENTO') {
                    Swal.fire({
                        title: 'Atenção!',
                        text: `Inscrição Estadual Divergente do Tipo de Indicação, verifique e tente novamente! 4`,
                        icon: 'warning',
                        confirmButtonText: 'Ok',
                        customClass: {
                            container: 'custom-swal',
                        }
                    })
                    return;
                }
            } else {
                
                if(IE) {
                    const ieNumeros = IE?.replace(/\D/g, "");
                    if(!ieNumeros) {
                        if(!validarInscricaoEstadual(ieNumeros, estado)) {
                            Swal.fire({
                                title: 'Atenção!',
                                text: `Inscrição Estadual Incorreta, verifique e tente novamente! 5`,
                                icon: 'warning',
                                confirmButtonText: 'Ok',
                                customClass: {
                                    container: 'custom-swal',
                                }
                            })
                            return;
                        }

                    }
                }
            }
        }

        try {

            let IEFinal = tipoIndicacaoIE?.value == 2 ? 'ISENTO' : (IE || 'ISENTO');
            
            const isUpdate = clienteExistente.length > 0 && idCliente;
   
            const postData = {
                ...(isUpdate && { IDCLIENTE: idCliente }),
                NUCPFCNPJ: cnpj.replace(/\D/g, ""),
                IDEMPRESA: parseInt(usuarioLogado?.IDEMPRESA),
                DSNOMERAZAOSOCIAL: `${nomeClienteRazao.toUpperCase()} - ${sobrenome.toUpperCase()}`,
                DSAPELIDONOMEFANTASIA: sobrenome.toUpperCase(),
                TPCLIENTE: tipo.toUpperCase(),
                NUCPFCNPJ: cnpj.replace(/\D/g, ""),
                NURGINSCESTADUAL: IEFinal,
                NUINSCMUNICIPAL: IM,
                NUCEP: cep.replace(/\D/g, "") || '',
                NUIBGE: parseInt(nuIBGE) || 0,
                EENDERECO: endereco.toUpperCase(),
                NUENDERECO: numero || 'SN',
                ECOMPLEMENTO: complemento.toUpperCase(),
                EBAIRRO: bairro.toUpperCase() || 'NI',
                ECIDADE: cidade.toUpperCase(),
                SGUF: estado.toUpperCase(),
                EEMAIL: email.toUpperCase() || '',
                NUTELCOMERCIAL: numeroComercial || telefoneCliente,
                NUTELCELULAR: telefoneCliente || '',
                DTNASCFUNDACAO: dataCriacao,
                IDINDICACAOIE: Number(tipoIndicacaoIE?.value),
                DSINDICACAOIE: tipoIndicacaoIE?.label.toUpperCase(),
                IDFUNCIONARIO: parseInt(usuarioLogado?.id)
            }

            const response = isUpdate ? await put(`/todos-cliente/${idCliente}`, postData) : await post('/criar-cliente', postData)

            const textDados = JSON.stringify(postData)
            let textoFuncao = isUpdate ? 'GERENCIA/ATUALIZACAO DE CLIENTE' : 'GERENCIA/CADASTRO DE CLIENTE';

            await getIPUsuario();
            const postDataLog = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textoFuncao,
                DADOS: textDados,
                IP: ipUsuario
            }

            const responsePost = await post('/log-web', postDataLog)


            Swal.fire({
                title: isUpdate ? 'Atualização' : 'Cadastrado!',
                text: isUpdate
                    ? `Cliente ${nomeClienteRazao} atualizado com sucesso!`
                    : `Cliente ${nomeClienteRazao} cadastrado com sucesso!`,
                icon: 'success',
                customClass: {
                    container: 'custom-swal',
                }
            })

            handleClose();
            return responsePost.data;
        } catch (error) {
            console.error('Erro ao cadastrar cliente:', error);
            const isUpdate = optionsCNPJ.length > 0 && idCliente;
            let textoFuncao = isUpdate 
                ? 'GERENCIA/ATUALIZACAO DE CLIENTE' 
                : 'GERENCIA/CADASTRO DE CLIENTE';
            const createLog = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textoFuncao,
                DADOS: `Erro ao tentar ${isUpdate ? 'atualizar' : 'cadastrar'} o cliente ${nomeClienteRazao}`,
                IP: ipUsuario
            }
            const responseLog = await post('/log-web', createLog)
            

            Swal.fire({
                title: 'Erro',
                text: 'Não foi possível cadastrar o cliente. Tente novamente.',
                icon: 'error',
                customClass: {
                    container: 'custom-swal',
                }
            });
            return responseLog.data;

        }
    }

    return {
        idCliente,
        tipo,
        dataCadastro,
        cnpj,
        nomeClienteRazao,
        sobrenome,
        dataCriacao,
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
        clienteExistente,

        setClienteExistente,
        setIdCliente,
        setTipo,
        setDataCadastro,
        setCnpj,
        setNomeClienteRazao,
        setSobrenome,
        setDataCriacao,
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
        optionsIndicacaoIE,
        onSubmit
    }
}