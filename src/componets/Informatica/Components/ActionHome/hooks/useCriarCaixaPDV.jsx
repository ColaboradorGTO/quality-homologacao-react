import Swal from "sweetalert2";
import { post, put } from "../../../../../api/funcRequest";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import { getDataAtual } from "../../../../../utils/dataAtual";

export const useCriarCaixaPDV = ({dadosListaCaixa}) => {
    const [empresa, setEmpresa] = useState('');
    const [dsCaixa, setDSCaixa] = useState('');
    const [tipoEmissao, setTipoEmissao] = useState('');
    const [modeloImpressora, setModeloImpressora] = useState('');
    const [portaComunicacao, setPortaComunicacao] = useState('');
    const [numeroSerieProducao, setNumeroSerieProducao] = useState('');
    const [numeroUltimaNFCeProducao, setNumeroUltimaNFCeProducao] = useState('');
    const [tef, setTef] = useState('');
    const [statusSelecionado, setStatusSelecionado] = useState('');
    const [statusLimpar, setStatusLimpar] = useState('');
    const [dataAlteracao, setDataAlteracao] = useState('');
    const [usuarioLogado, setUsuarioLogado] = useState(null);
    const [ipUsuario, setIpUsuario] = useState('');
    const navigate = useNavigate();
  
    useEffect(() => {
      const usuarioArmazenado = localStorage.getItem('usuario');
  
      if (usuarioArmazenado) {
        try {
          const parsedUsuario = JSON.parse(usuarioArmazenado);
          setUsuarioLogado(parsedUsuario);
        } catch (error) {
          console.error('Erro ao parsear o usuário do localStorage:', error);
        }
      } else {
        navigate('/');
      }
    }, [navigate]);
  
    useEffect(() => {
      getIPUsuario();
    }, [usuarioLogado]);
  
    const getIPUsuario = async () => {
      const response = await axios.get('http://ipwho.is/');
      if (response.data) {
        setIpUsuario(response.data.ip);
      }
      return response.data;
    };
    
  
    useEffect(() => {
      const dataAtual = getDataAtual();
      setDataAlteracao(dataAtual);
      if (dadosListaCaixa) {
        setEmpresa(dadosListaCaixa[0]?.NOFANTASIA);
        // setDSCaixa(dadosListaCaixa[0]?.DSCAIXA);
        // setTipoEmissao(dadosListaCaixa[0]?.TBEMISSAOFISCAL);
        // setModeloImpressora(dadosListaCaixa[0]?.NOIMPRESSORA);
        // setPortaComunicacao(dadosListaCaixa[0]?.DSPORTACOMUNICACAO);
        // setNumeroSerieProducao(dadosListaCaixa[0]?.NUSERIEPROD);
        // setNumeroUltimaNFCeProducao(dadosListaCaixa[0]?.NUNFCEPROD);
        // setTef(dadosListaCaixa[0]?.STTEF);
        // setStatusSelecionado(dadosListaCaixa[0]?.STATUALIZA);
        // setStatusLimpar(dadosListaCaixa[0]?.STLIMPA);
      }
    }, [dadosListaCaixa]);
  
    const onSubmit = async (data) => {
      const putData = {
        TBEMISSAOFISCAL: tipoEmissao,
        NOIMPRESSORA: modeloImpressora,
        DSPORTACOMUNICACAO: portaComunicacao,
        NUSERIEPROD: numeroSerieProducao,
        NUNFCEPROD: numeroUltimaNFCeProducao,
        DTULTALTERACAO: dataAlteracao,
        IDEMPRESA: dadosListaCaixa[0]?.IDEMPRESA,
        DSCAIXA: dsCaixa,
        DSCAIXAWEB: dsCaixa,
        NUULTNFCE: 0,
        NUSERIE: 0,
        NULINHAIMPRESSORA: 48,
        NUBAUD: '115200',
        NULINHAENTRECUPOM: 10,
        STIMPRIMIRUMITEMPORLINHA: 'False',
        STDANFCERESUMIDO: 'False',
        STIGNORARTAGFORMATACAO: 'False',
        STIMPRIMIRDESCACRESITEM: 'True',
        STVIACONSUMIDOR: 'True',
        STTEF: 'True',
        // STTEF: tef,
        STBALANCA: 'False',
        STGAVETEIRO: 'False',
        STSANGRIA: 'True',
        VRMAXSANGRIA: 0,
        STCONTROLAHORARIO: 'False',
        HRINICIOLOGIN: '00:00:00',
        HRFIMLOGIN: '23:59:59',
        STSTATUS: 'Livre',
        NUSERIEHOM: 0,
        NUNFCEHOM: 0,
        STATIVO: 'True',
        VSSISTEMA: '2.5.2.0',
        STATUALIZA: statusSelecionado,
        STLIMPA: statusLimpar
      };
  
      try {
        const response = await post('/criar-caixas', putData);
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Caixa Criado com sucesso!',
          customClass: {
            container: 'custom-swal',
          },
          showConfirmButton: false,
          timer: 1500,
        });
  
        const textDados = JSON.stringify(putData);
        let textoFuncao = 'INFORMATICA/CRIAÇÃO DE CAIXA PDV';
  
        const postData = {
          IDFUNCIONARIO: usuarioLogado.id,
          PATHFUNCAO: textoFuncao,
          DADOS: textDados,
          IP: ipUsuario,
        };
  
        const responsePost = await post('/log-web', postData);
  
        return responsePost.data;
      } catch (error) {
        let textoFuncao = 'INFORMATICA/CRIAÇÃO DE CAIXA PDV';
  
        const postData = {
          IDFUNCIONARIO: usuarioLogado.id,
          PATHFUNCAO: textoFuncao,
          DADOS: 'INFORMATICA/CRIAÇÃO DE CAIXA PDV',
          IP: ipUsuario,
        };
  
        const responsePost = await post('/log-web', postData);
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Erro ao Criar Caixa!',
          customClass: {
            container: 'custom-swal',
          },
          showConfirmButton: false,
          timer: 1500,
        });
        return responsePost.data;
      }
    };
  
    const atualizacaoDiario = [
      { value: "True", label: "SIM" },
      { value: "False", label: "NÃO" }
    ]
   
    const optionsNota = [
      { value: "NFCE", label: "NFCE" },
      { value: "NFE", label: "NFCE" }
    ]
  
    const optionsImpressoras = [
      { value: "ppEscPosEpson", label: "ppEscPosEpson", selected: false },
      { value: "ppEscBematech", label: "ppEscBematech", selected: false },
      { value: "ppEscDaruma", label: "ppEscDaruma", selected: false },
      { value: "ppEscDiebold", label: "ppEscDiebold", selected: false },
      { value: "ppEscElgin", label: "ppEscElgin", selected: false },
      { value: "ppTexto", label: "ppTexto", selected: false }
    ];

    return {
        empresa,
        setEmpresa,
        dsCaixa,
        setDSCaixa,
        tipoEmissao,
        setTipoEmissao,
        modeloImpressora,
        setModeloImpressora,
        portaComunicacao,
        setPortaComunicacao,
        numeroSerieProducao,
        setNumeroSerieProducao,
        numeroUltimaNFCeProducao,
        setNumeroUltimaNFCeProducao,
        tef,
        setTef,
        statusSelecionado,
        setStatusSelecionado,
        statusLimpar,
        setStatusLimpar,
        dataAlteracao,
        setDataAlteracao,
        usuarioLogado,
        atualizacaoDiario,
        optionsNota,
        optionsImpressoras,
        onSubmit
    }
}