import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { post, put } from "../../../../../api/funcRequest";



export const useEditarPermissaoUsuario = ({selectedItems, copiarPermissao}) => {
  const [moduloSelecionado, setModuloSelecionado] = useState('');
  const [funcionarioSelecionado, setFuncionarioSelecionado] = useState('');
  const [menuPaiSelecionado, setMenuPaiSelecionado] = useState('');
  const [menuFilhoSelecionado, setMenuFilhoSelecionado] = useState([]);
  const [funcaoSelecionada, setFuncaoSelecionada] = useState('');
  const [alterar, setAlterar] = useState('False');
  const [criar, setCriar] = useState('False');
  const [nivel1, setNivel1] = useState('False');
  const [nivel2, setNivel2] = useState('False');
  const [nivel3, setNivel3] = useState('False');
  const [nivel4, setNivel4] = useState('False');
  const [administrador, setAdministrador] = useState('False');

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
    const response = await axios.get('http://ipwho.is/')
    if (response.data) {
      setIpUsuario(response.data.ip);
    }
    return response.data;
  }



  const handleSubmit = async () => {
    // e.preventDefault();

    const payload = {
      IDUSUARIO: copiarPermissao,
      IDMODULOADMINISTRATIVO: selectedItems[0].IDMODULOADMINISTRATIVO,
      IDMODULOGERENCIA: selectedItems[0].IDMODULOGERENCIA,
      IDMODULOINFORMATICA: selectedItems[0].IDMODULOINFORMATICA,
      IDMODULOFINANCEIRO: selectedItems[0].IDMODULOFINANCEIRO,
      IDMODULOCOMERCIAL: selectedItems[0].IDMODULOCOMERCIAL,
      IDMODULOCOMPRAS: selectedItems[0].IDMODULOCOMPRAS,
      IDMODULOCONTABILIDADE: selectedItems[0].IDMODULOCONTABILIDADE,
      IDMODULOMARKETING: selectedItems[0].IDMODULOMARKETING,
      IDMODULORH: selectedItems[0].IDMODULORH,
      IDMODULOCOMPRASADM: selectedItems[0].IDMODULOCOMPRASADM,
      IDMODULOEXPEDICAO: selectedItems[0].IDMODULOEXPEDICAO,
      IDMODULOCONFERENCIACEGA: selectedItems[0].IDMODULOCONFERENCIACEGA,
      IDMODULOCADASTRO: selectedItems[0].IDMODULOCADASTRO,
      IDMODULOETIQUETAGEM: selectedItems[0].IDMODULOETIQUETAGEM,
      IDMODULORESUMOVENDAS: selectedItems[0].IDMODULORESUMOVENDAS,
      IDMODULOVOUCHER: selectedItems[0].IDMODULOVOUCHER,
      IDMODULOMALOTE: selectedItems[0].IDMODULOMALOTE,
      IDPERMISSAO: selectedItems[0].IDPERMISSAO,
      IDMENU: selectedItems[0].IDMENU,
      IDMENUFILHO: selectedItems[0].IDMENUFILHO,
      CRIAR: selectedItems[0].CRIAR,
      ALTERAR: selectedItems[0].ALTERAR,
      ADMINISTRADOR: selectedItems[0].ADMINISTRADOR,
      N1: selectedItems[0].N1,
      N2: selectedItems[0].N2,
      N3: selectedItems[0].N3,
      N4: selectedItems[0].N4,
      IDUSERULTIMAALTERACAO: usuarioLogado.id,
    }

    const response = await put(`/perfil-usuario/:id `, payload);

    const textDados = JSON.stringify(payload);
    let textoFuncao = 'PERMISSÕES USUARIO / ALTERAÇÃO DE PERMISSÕES';

    const createData = {
      IDFUNCIONARIO: String(usuarioLogado.id),
      PATHFUNCAO: textoFuncao,
      DADOS: textDados,
      IP: ipUsuario,
    };

    await post('/log-web', createData);

    Swal.fire({
      icon: 'success',
      title: 'Sucesso',
      text: 'Permissão editada com sucesso!',
      showConfirmButton: false,
      timer: 1500
    })

    return response.data;
  }

  return {
    moduloSelecionado,
    setModuloSelecionado,
    funcionarioSelecionado,
    setFuncionarioSelecionado,
    menuPaiSelecionado,
    setMenuPaiSelecionado,
    menuFilhoSelecionado,
    setMenuFilhoSelecionado,
    funcaoSelecionada,
    setFuncaoSelecionada,
    alterar,
    setAlterar,
    criar,
    setCriar,
    nivel1,
    setNivel1,
    nivel2, 
    setNivel2,
    nivel3,
    setNivel3,
    nivel4,
    setNivel4,
    administrador,
    setAdministrador,
    usuarioLogado,
    handleSubmit
  }
}