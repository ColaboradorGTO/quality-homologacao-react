import Modal from 'react-bootstrap/Modal';
import { HeaderModal } from '../../../Modais/HeaderModal/HeaderModal';
import { InputFieldModal } from '../../../Buttons/InputFieldModal';
import { FooterModal } from '../../../Modais/FooterModal/footerModal';
import { ButtonTypeModal } from '../../../Buttons/ButtonTypeModal';
import Swal from 'sweetalert2';
import { useForm } from "react-hook-form";
import Select from 'react-select';
import { Fragment, useEffect, useState } from 'react';
import { get, post, put } from '../../../../api/funcRequest';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useQuery } from 'react-query';

export const ActionEditarRelatorioBIModal = ({ show, handleClose, dadosLinkRelatorioBI, empresaSelecionada }) => {
  const { register, handleSubmit, errors } = useForm();
  const [statusSelecionado, setStatusSelecionado] = useState('');
  const [linkRelatorioBI, setLinkRelatorioBI] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [relatorioSelecionado, setRelatorioSelecionado] = useState(null);
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

  const { data: dadosListaBI = [], error: errorListaBI, isLoading: isLoadingBI, refetch } = useQuery(
    'relatorioInformaticaBI?status=True',
    async () => {
      const response = await get(`/relatorioInformaticaBI?status=True`);
      return response.data;
    },
    {
      staleTime: 5 * 60 * 1000, cacheTime: 5 * 60 * 1000
    }
  );

  useEffect(() => {
    if (dadosLinkRelatorioBI && empresaSelecionada) {
      setLinkRelatorioBI(dadosLinkRelatorioBI[0]?.LINK);
      setStatusSelecionado(dadosLinkRelatorioBI[0]?.STATIVO);
      setEmpresa(empresaSelecionada?.NOFANTASIA);
      setRelatorioSelecionado(dadosLinkRelatorioBI[0]?.IDRELATORIOBI); 
    }
  }, [dadosLinkRelatorioBI, empresaSelecionada]);


 
  const onSubmit = async (data) => {
    const putData = {
      IDRELATORIOBI: relatorioSelecionado,
      IDEMPRESA: dadosLinkRelatorioBI[0]?.IDEMPRESA,
      LINK: linkRelatorioBI,
      STATIVO: statusSelecionado,
      IDRELATORIOBIANTIGO: dadosLinkRelatorioBI[0]?.IDRELATORIOBI,
    };

    try {
      const response = await put('/linkRelatorioBI/:id', putData);
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Relatório atualizado com sucesso!',
        customClass: {
          container: 'custom-swal',
        },
        showConfirmButton: false,
        timer: 1500,
      });

      const textDados = JSON.stringify(putData);
      let textoFuncao = 'INFORMATICA/ATUALIZAR LINK RELATORIO BI';

      const postData = {
        IDFUNCIONARIO: usuarioLogado.id,
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario,
      };

      const responsePost = await post('/log-web', postData);

      return responsePost.data;
    } catch (error) {
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Erro ao atualizar Relatório!',
        customClass: {
          container: 'custom-swal',
        },
        showConfirmButton: false,
        timer: 1500,
      });
      console.log(error);
    }
  };

  const optionsStatus = [
    { value: "True", label: "Ativo" },
    { value: "False", label: "Inativo" },
  ];

  return (
    <Fragment>
      <Modal
        show={show}
        onHide={handleClose}
        size="xl"
        className="modal fade"
        tabIndex={-1}
        role="dialog"
        aria-hidden="true"
      >
        <HeaderModal
          title={"Link Relatório BI"}
          subTitle={"Cadastrar / Alterar"}
          handleClose={handleClose}
        />

        <Modal.Body>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <div className="row">
                <div className="col-sm-6 col-xl-6">
                  <InputFieldModal
                    label={"Filial "}
                    type="text"
                    id={"linkrelatoriobi"}
                    readOnly={true}
                    value={empresa}
                    onChangeModal={(e) => setEmpresa(e.target.value)}
                  />
                </div>
                <div className="col-sm-6 col-xl-6">
                  <label className="form-label" htmlFor={""}>Relatório</label>
                  <Select
                    closeMenuOnSelect={false}
                    options={dadosListaBI.map((item) => {

                      return {
                        value: item.IDRELATORIOBI, 
                        label: item.DSRELATORIOBI
                      };
                    })}
                    value={dadosListaBI.find(option => option.value === relatorioSelecionado)}
                    onChange={(selectedOption) => setRelatorioSelecionado(selectedOption?.value)}
                  />
                </div>
              </div>
              <div className="row mt-4">
                <div className="col-sm-6 col-xl-3">
                  <label className="form-label" htmlFor={""}>Status</label>
                  <Select
                    closeMenuOnSelect={false}
                    options={optionsStatus}
                    value={optionsStatus.find(option => option.value === statusSelecionado)}
                    onChange={(e) => setStatusSelecionado(e.value)}
                  />
                </div>
                <div className="col-sm-6 col-xl-12">
                  <InputFieldModal
                    label={"Link "}
                    type="text"
                    id={"linkrelatoriobi"}
                    value={linkRelatorioBI}
                    onChangeModal={(e) => setLinkRelatorioBI(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </form>
        </Modal.Body>

        <FooterModal
          ButtonTypeConfirmar={ButtonTypeModal}
          textButtonConfirmar={"Atualizar"}
          onClickButtonConfirmar={handleSubmit(onSubmit)}
          corConfirmar={"success"}
          ButtonTypeFechar={ButtonTypeModal}
          textButtonFechar={"Fechar"}
          onClickButtonFechar={handleClose}
          corFechar="secondary"
        />
      </Modal>
    </Fragment>
  );
};