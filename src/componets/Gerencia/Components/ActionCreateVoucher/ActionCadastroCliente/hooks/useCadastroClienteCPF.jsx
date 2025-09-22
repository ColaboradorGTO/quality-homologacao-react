import Swal from "sweetalert2";
import { get, post, put } from "../../../../../../api/funcRequest";
import { removerMascaraCPF } from "../../../../../../utils/formatCPF";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import { getDataAtual } from "../../../../../../utils/dataAtual";
import { useNavigate } from "react-router-dom";

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

/* 
  Amanhã fazer a validação do cliente fisico e juridico para,
  finalizar o cadastro do cliente. 
  e dos vouchers na gerência.
*/

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

    const URL_PUBLICAWS = 'https://publica.cnpj.ws/cnpj/{CNPJ}';
    const URL_MINHA_RECEITA = 'https://minhareceita.org/{CNPJ}';
    const URL_RECEITAWS = 'https://www.receitaws.com.br/v1/cnpj/{CNPJ}';
    const URL_VIA_CEP = 'https://viacep.com.br/ws/{CEP}/json/';
    const URL_VIA_CEP_REDUNDANCIA = 'https://opencep.com/v1/{CEP}.json';

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

    // este useEfect faz a mesma coisa que a function preenche_dados_registrados do quality em JS
    useEffect(() => {
        if (optionsCPF.length > 0) {
            const cliente = optionsCPF[0];
            setIdCliente(cliente?.IDCLIENTE || "");
            setEmpresa(cliente?.IDEMPRESA || "");
            setDataCadastro(cliente?.DTCADASTRO || cliente?.DTULTALTERACAO?.split(" ")[0] || "");
            setCpf(cliente?.NUCPFCNPJ || "");
            setTipo(cliente?.TPCLIENTE || "");
            setDataNascimento(cliente?.DTNASCFUNDACAO ? cliente.DTNASCFUNDACAO.split(" ")[0] : "");
            setTelefoneCliente(cliente?.NUTELCELULAR || "");
            setEmail(cliente?.EEMAIL || "");
            setCep(cliente?.NUCEP || "");
            setEndereco(cliente?.EENDERECO || "");
            setNumero(cliente?.NUENDERECO || "");
            setComplemento(cliente?.ECOMPLEMENTO || "");
            setBairro(cliente?.EBAIRRO || "");
            setNuIBGE(cliente?.NUIBGE || "");
            setCidade(cliente?.ECIDADE || "");
            setEstado(cliente?.SGUF || "");
            setNumeroComercial(cliente?.NUTELCOMERCIAL || "");
            setTipoIndicacaoIE(cliente?.IDINDICACAOIE || (cliente?.SGUF == "DF" ? 2 : 9));

            // Separar nome e sobrenome para CPF
            if (cliente?.NUCPFCNPJ?.length <= 11) {
                let nome = cliente?.DSNOMERAZAOSOCIAL || "";
                let sobrenome = "";
                const partes = nome.split(" ");
                if (partes.length > 1) {
                    sobrenome = partes.pop();
                    nome = partes.join(" ");
                }
                setNomeClienteRazao(nome);
                setSobrenome(sobrenome);
            } else {
                setNomeClienteRazao(cliente?.DSNOMERAZAOSOCIAL || "");
                setSobrenome(cliente?.DSNOMERAZAOSOCIAL || "");
            }
        }
    }, [optionsCPF]);

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

    async function valida_e_preenche_cep_empresa_com_API_externa(cepSemFormato, stUltimaInstancia = false) {
        let cep = cepSemFormato?.replace(/\D/g, "");

        try {
            if (cep) {
                // Exemplo: exibir loading (pode ser um setState ou SweetAlert2)
                Swal.fire({
                    title: 'Carregando dados do CEP, Aguarde...',
                    allowOutsideClick: false,
                    didOpen: () => Swal.showLoading()
                });

                // Função de validação de CEP (implemente se necessário)
                const isValid = cep.length === 8; // ou use uma função validaCEP(cep)
                if (isValid) {
                    let resp = await getDadosEnderecoViaCep_API_externa(cep);
                    let dadosCep = resp.status !== 200
                        ? (await getDadosEnderecoViaCep_API_redundancia(cep)).data
                        : resp.data;

                    setEndereco(dadosCep?.logradouro || "");
                    setBairro(dadosCep?.bairro || "");
                    setCidade(dadosCep?.localidade || "");
                    setEstado(dadosCep?.uf || "");
                    setNuIBGE(dadosCep?.ibge || "");

                    Swal.close();
                } else {
                    setBairro('');
                    setNuIBGE('');
                    setCidade('');
                    setEstado('');
                    // Notificação de erro
                    Swal.close();
                    if (!stUltimaInstancia) {
                        Swal.fire('CEP Inválido', 'CEP Inválido, verifique e tente novamente!', 'error');
                    }
                }
            }
        } catch (e) {
            setBairro('');
            setNuIBGE('');
            setCidade('');
            setEstado('');
            Swal.close();
            if (!stUltimaInstancia) {
                Swal.fire('Erro', e?.message || 'Erro ao tentar preencher os dados do cliente, recarregue e tente novamente!', 'error');
            }
        }
    }

    const optionsIndicacaoIE = [
        { value: 9, label: 'Não Contribuinte Com ou Sem IE' },
    ]
    // { value: 1, label: 'Contribuinte ICMS' },
    // { value: 2, label: 'Contribuinte Isento de IE' },

    const readOnlyCpf = optionsCPF && optionsCPF.length > 0;


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