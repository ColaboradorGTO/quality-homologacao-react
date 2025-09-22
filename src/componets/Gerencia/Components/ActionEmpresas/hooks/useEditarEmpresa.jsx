import Swal from "sweetalert2";
import { post, put } from "../../../../../api/funcRequest";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const useEditarEmpresa = ({dadosEmpresasDetalhe}) => {
    const [grupoEmpresa, setGrupoEmpresa] = useState('');
    const [situacao, setSituacao] = useState('');
    const [dataCriacao, setDataCriacao] = useState('');
    const [nomeFantasia, setNomeFantasia] = useState('');
    const [cep, setCep] = useState('');
    const [endereco, setEndereco] = useState('');
    const [complemento, setComplemento] = useState('');
    const [bairro, setBairro] = useState('');
    const [cidade, setCidade] = useState('');
    const [uf, setUF] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('')
    const [usuarioLogado, setUsuarioLogado] = useState(null);
    const [ipUsuario, setIpUsuario] = useState('');
    const navigate = useNavigate();

    const getIPUsuario = async () => {
    const response = await axios.get('http://ipwho.is/')
    if (response.data) {
        setIpUsuario(response.data.ip);
    }
    return response.data;
    }

    useEffect(() => {
        getIPUsuario()
    }, [usuarioLogado])

    useEffect(() => {
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
        if(dadosEmpresasDetalhe) {
            setGrupoEmpresa(dadosEmpresasDetalhe[0]?.IDGRUPOEMPRESARIAL == 1 ? "TO - TESOURA DE OURO" : dadosEmpresasDetalhe[0]?.IDGRUPOEMPRESARIAL == 2 ? "MG - MAGAZINE" : dadosEmpresasDetalhe[0]?.IDGRUPOEMPRESARIAL == 3 ? "YO - YORUS" : dadosEmpresasDetalhe[0]?.IDGRUPOEMPRESARIAL == 4 ? "FC - FREE CENTER" : "");
            setSituacao(dadosEmpresasDetalhe[0]?.STATIVO == "True" ? "ATIVO" : dadosEmpresasDetalhe[0]?.STATIVO == "False" ? "INATIVO" : "");
            setDataCriacao(dadosEmpresasDetalhe[0]?.DTULTATUALIZACAO);
            setNomeFantasia(dadosEmpresasDetalhe[0]?.NOFANTASIA);
            setCep(dadosEmpresasDetalhe[0]?.NUCEP)
            setEndereco(dadosEmpresasDetalhe[0]?.EENDERECO)
            setComplemento(dadosEmpresasDetalhe[0]?.ECOMPLEMENTO == '' ? "Atualizando" : "")
            setBairro(dadosEmpresasDetalhe[0]?.EBAIRRO)
            setCidade(dadosEmpresasDetalhe[0]?.ECIDADE)
            setUF(dadosEmpresasDetalhe[0]?.SGUF)
            setEmail(dadosEmpresasDetalhe[0]?.EEMAILPRINCIPAL)
            setTelefone(dadosEmpresasDetalhe[0]?.NUTELCOMERCIAL)
        }
    }, [])
    const onSubmit = async (data) => {

        const putData = {
            STGRUPOEMPRESARIAL: dadosEmpresasDetalhe[0]?.IDGRUPOEMPRESARIAL,
            IDGRUPOEMPRESARIAL: dadosEmpresasDetalhe[0]?.IDGRUPOEMPRESARIAL,
            IDSUBGRUPOEMPRESARIAL: dadosEmpresasDetalhe[0]?.IDSUBGRUPOEMPRESARIAL,
            NORAZAOSOCIAL: dadosEmpresasDetalhe[0]?.NORAZAOSOCIAL,
            NOFANTASIA: dadosEmpresasDetalhe[0]?.NOFANTASIA,
            NUCNPJ: dadosEmpresasDetalhe[0]?.NUCNPJ,
            NUINSCESTADUAL: dadosEmpresasDetalhe[0]?.NUINSCESTADUAL,
            NUINSCMUNICIPAL: dadosEmpresasDetalhe[0]?.NUINSCMUNICIPAL,
            CNAE: dadosEmpresasDetalhe[0]?.CNAE,
            EENDERECO: dadosEmpresasDetalhe[0]?.EENDERECO,
            ECOMPLEMENTO: dadosEmpresasDetalhe[0]?.ECOMPLEMENTO,
            EBAIRRO: dadosEmpresasDetalhe[0]?.EBAIRRO,
            ECIDADE: dadosEmpresasDetalhe[0]?.ECIDADE,
            SGUF: dadosEmpresasDetalhe[0]?.SGUF,
            NUUF: dadosEmpresasDetalhe[0]?.NUUF === 'DF' ? 53 : 52,
            NUCEP: dadosEmpresasDetalhe[0]?.NUCEP,
            NUIBGE: dadosEmpresasDetalhe[0]?.NUIBGE,
            EEMAILPRINCIPAL: email,
            EEMAILCOMERCIAL: dadosEmpresasDetalhe[0]?.EEMAILCOMERCIAL,
            EEMAILFINANCEIRO: dadosEmpresasDetalhe[0]?.EEMAILFINANCEIRO,
            EEMAILCONTABILIDADE: dadosEmpresasDetalhe[0]?.EEMAILCONTABILIDADE,
            NUTELPUBLICO: dadosEmpresasDetalhe[0]?.NUTELPUBLICO,
            NUTELCOMERCIAL: telefone,
            NUTELFINANCEIRO: dadosEmpresasDetalhe[0]?.NUTELFINANCEIRO,
            NUTELGERENCIA: dadosEmpresasDetalhe[0]?.NUTELGERENCIA,
            EURL: dadosEmpresasDetalhe[0]?.EURL,
            PATHIMG: dadosEmpresasDetalhe[0]?.PATHIMG,
            NUCNAE: dadosEmpresasDetalhe[0]?.NUCNAE,
            STECOMMERCE: dadosEmpresasDetalhe[0]?.STECOMMERCE,
            DTULTATUALIZACAO: dadosEmpresasDetalhe[0]?.DTULTATUALIZACAO,
            STATIVO: dadosEmpresasDetalhe[0]?.STATIVO,
            ALIQPIS: dadosEmpresasDetalhe[0]?.ALIQPIS,
            ALIQCOFINS: dadosEmpresasDetalhe[0]?.ALIQCOFINS,
            IDEMPRESA: dadosEmpresasDetalhe[0]?.IDEMPRESA,
        }

        try {

            const response = await put('/empresas/:id', putData)
           
            const textDados = JSON.stringify(putData);
            let textoFuncao = 'GERENCIA / EDIÇÃO DA EMPRESA';
        
            const createData = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textoFuncao,
                DADOS: textDados,
                IP: ipUsuario
            };
        
            const responsePost = await post('/log-web', createData)
         
            Swal.fire({
                title: 'Sucesso!',
                text: 'Empresa atualizada com sucesso!',
                icon: 'success',
                timer: 3000,
                customClass: {
                    container: 'custom-swal',
                }
            })

            return responsePost.data
        } catch (error) {
            let textoFuncao = 'GERENCIA /ERRO NA EDIÇÃO DA EMPRESA';
        
            const createData = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textoFuncao,
                DADOS: '',
                IP: ipUsuario
            };
        
            const responsePost = await post('/log-web', createData)
         

            Swal.fire({
                title: 'Erro!',
                text: 'Erro ao atualizar a empresa!',
                icon: 'error',
                timer: 3000,
                customClass: {
                    container: 'custom-swal',
                }
            })
            return responsePost.data
        }
    }

    return {
        grupoEmpresa,
        setGrupoEmpresa,
        situacao,
        setSituacao,
        dataCriacao,
        setDataCriacao,
        nomeFantasia,
        setNomeFantasia,
        cep,
        setCep,
        endereco,
        setEndereco,
        complemento,
        setComplemento,
        bairro,
        setBairro,
        cidade,
        setCidade,
        uf,
        setUF,
        email,
        setEmail,
        telefone,
        setTelefone,
        onSubmit

    }
}