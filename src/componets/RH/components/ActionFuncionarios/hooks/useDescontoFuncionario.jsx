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
    dadosDescontoFuncionarios,
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

     useEffect(() => {
        if (dadosDescontoFuncionarios) {
            setEmpresa(dadosDescontoFuncionarios[0]?.NOFANTASIA);
            setCpf(dadosDescontoFuncionarios[0]?.NUCPF);
            setFuncionario(dadosDescontoFuncionarios[0]?.NOFUNCIONARIO);
            setPercentualDesconto(dadosDescontoFuncionarios[0]?.PERCDESCUSUAUTORIZADO || "0" );   
        }
    }, [dadosDescontoFuncionarios]);

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
            DTINICIODESC: String(dataInicioDesconto),
            DTFIMDESC: String(dataFimDesconto),
            PERCDESCUSUAUTORIZADO: percentualDesconto ? Number(percentualDesconto) : 0,
            TXTMOTIVODESCONTO: String(motivoDesconto),
            IDFUNCALTERACAO: Number(usuarioLogado?.id),
            ID: Number(dadosDescontoFuncionarios[0]?.ID),

        }
        try {

            const response = await put('/funcionarios-desconto/:id', putData)
            const textDados = JSON.stringify(putData)
            const textoFuncao = 'RH/ATUALIZAR DESCONTO FUNCIONARIO AUTORIZADO';

            const ipUsuario = await getIPUsuario();
            const createData = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textoFuncao,
                DADOS: textDados,
                IP: ipUsuario
            }

            await post('/log-web', createData)

            Swal.fire({
                title: 'Atualização',
                text: 'Atualização Realizada com Sucesso',
                icon: 'success',
                timer: 3000,
                customClass: {
                    container: 'custom-swal',
                }
            })
            refetch();
            handleClose();
            return response.data;
        } catch (error) {
            const textoFuncao = 'RH/ERRO AO ATUALIZAR DESCONTO FUNCIONARIO';
            const textDados = JSON.stringify(putData)
            const ipUsuario = await getIPUsuario();
            const createData = {
                IDFUNCIONARIO: String(usuarioLogado.id),
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
            handleClick()
            return responsePost.data;

        }
    }

    return {
        empresa,
        setEmpresa,
        cpf,
        setCpf,
        funcionario,
        setFuncionario,
        motivoDesconto,
        setMotivoDesconto,
        percentualDesconto,
        setPercentualDesconto,
        dataInicioDesconto,
        setDataInicioDesconto,
        dataFimDesconto,
        setDataFimDesconto,
        onSubmit,
    }
}
