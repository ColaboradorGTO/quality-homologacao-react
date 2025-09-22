import { Fragment, useEffect, useRef, useState } from "react"
import { InputFieldModal } from "../../../../Buttons/InputFieldModal";;
import { ButtonType } from "../../../../Buttons/ButtonType";
import { get, post } from "../../../../../api/funcRequest";
import { useQuery } from "react-query";
import Swal from "sweetalert2";
import { getDataAtual } from "../../../../../utils/dataAtual";
import { useNavigate } from "react-router-dom";
import Select from 'react-select';


export const FormularioAlteracaoPagamento = ({dadosDetalheRecebimentos}) => {
  const [incluirCartao2, setIncluirCartao2] = useState(false);
  const [incluirCartao3, setIncluirCartao3] = useState(false);
  const [incluirPos2, setIncluirPos2] = useState(false);
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [valorDistribuir, setValorDistribuir] = useState('');
  const [valorDinheiro, setValorDinheiro] = useState('');
  const [valorPix, setValorPix] = useState('');
  const [nuChavePix, setNuChavePix] = useState('');
  const [dsTipoPagamentoTEF, setDsTipoPagamentoTEF] = useState('');
  const [nuOperacao, setNuOperacao] = useState('');
  const [nuAutorizacao, setNuAutorizacao] = useState('');
  const [vrCartao, setVrCartao] = useState('');
  const [dataParcela2, setDataParcela2] = useState('');
  const [dsTipoPagamentoTEF2, setDsTipoPagamentoTEF2] = useState('');
  const [nuOperacao2, setNuOperacao2] = useState('');
  const [nuAutorizacao2, setNuAutorizacao2] = useState('');
  const [vrCartao2, setVrCartao2] = useState('');
  const [qtdParcelas, setQtdParcelas] = useState('');
  const [qtdParcelas2, setQtdParcelas2] = useState('');
  const [dataParcela3, setDataParcela3] = useState('');
  const [dsTipoPagamentoTEF3, setDsTipoPagamentoTEF3] = useState('');
  const [nuOperacao3, setNuOperacao3] = useState('');
  const [nuAutorizacao3, setNuAutorizacao3] = useState('');
  const [vrCartao3, setVrCartao3] = useState('');
  const [qtdParcelas3, setQtdParcelas3] = useState('');
  const [dsTipoPagamentoPOS, setDsTipoPagamentoPOS] = useState('');
  const [nuOperacaoPOS, setNuOperacaoPOS] = useState('');
  const [nuAutorizacaoPOS, setNuAutorizacaoPOS] = useState('');
  const [vrPos, setVrPos] = useState('');
  const [qtdParcelasPOS, setQtdParcelasPOS] = useState('');
  const [dataParcelaPOS, setDataParcelaPOS] = useState('');
  const [dsTipoPagamentoPOS2, setDsTipoPagamentoPOS2] = useState('');
  const [nuOperacaoPOS2, setNuOperacaoPOS2] = useState('');
  const [nuAutorizacaoPOS2, setNuAutorizacaoPOS2] = useState('');
  const [vrPos2, setVrPos2] = useState('');
  const [qtdParcelasPOS2, setQtdParcelasPOS2] = useState('');
  const [dataParcelaPOS2, setDataParcelaPOS2] = useState('');
  const [vrVoucher, setVrVoucher] = useState('');
  const [nuVoucher, setNuVoucher] = useState('');
  const [motivoAlteracao, setMotivoAlteracao] = useState('');
  const [dataParcela1, setDataParcela1] = useState('');
  const [pagamentos, setPagamentos] = useState(false);

  useEffect(() => {
    const dataAtual = getDataAtual();
    setDataParcela1(dataAtual);
    setDataParcela2(dataAtual);
    setDataParcela3(dataAtual);
  }, [])

  const navigate = useNavigate();

  useEffect(() => {
    const dataAtual = getDataAtual();
    setDataParcela1(dataAtual);
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

  const { data: optionsPagamentosTef = [], error: errorPagamentosTef, isLoading: isLoadingPagamentosTef, refetch } = useQuery(
    'pagamento-tef',
    async () => {
      const response = await get(`/pagamento-tef`);
      return response.data;
    },
    { staleTime: 5 * 60 * 1000, cacheTime: 5 * 60 * 1000 }
  );
  const { data: optionsPagamentosPOS = [], error: errorPagamentosPOS, isLoading: isLoadingPagamentosPOS, refetch: refetchPagamentoPOS } = useQuery(
    'pagamento-pos',
    async () => {
      const response = await get(`/pagamento-pos`);
      return response.data;
    },
    { staleTime: 5 * 60 * 1000, cacheTime: 5 * 60 * 1000 }
  );

  useEffect(() => { 
    setValorDistribuir(dadosDetalheRecebimentos[0]?.venda.VRTOTALVENDA);
  }, [])

  
  useEffect(() => {
    const dinheiro = parseFloat(valorDinheiro) || 0;
    const pix = parseFloat(valorPix) || 0;
    const cartao1 = parseFloat(vrCartao) || 0;
    const cartao2 = parseFloat(vrCartao2) || 0;
    const cartao3 = parseFloat(vrCartao3) || 0;
    const pos = parseFloat(vrPos) || 0;
    const pos2 = parseFloat(vrPos2) || 0;
    const voucher = parseFloat(vrVoucher) || 0;
  
    const somaValores = dinheiro + pix + cartao1 + cartao2 + cartao3 + pos + pos2 + voucher;
  
    
    setValorDistribuir((dadosDetalheRecebimentos[0]?.venda.VRTOTALVENDA || 0) - somaValores);
  }, [valorDinheiro, valorPix, vrCartao, vrCartao2, vrCartao3, vrPos, vrPos2, vrVoucher, dadosDetalheRecebimentos]);
  

  const cancelarVendaPagamento = () => {


    if (valorDistribuir > 0) {

      alertaValorMenorVenda();
      return false;
    } else {
      const dados = [{
        "IDVENDA": dadosPagamentos[0].IDVENDA,
        "STCANCELADO": 'True',
        "DTULTIMAALTERACAO": new Date().toISOString(), // Use a data atual
        "IDFUNCIONARIOCANCELA": usuarioLogado.id,
        "TXTMOTIVOCANCELA": motivoAlteracao
      }];
      put('/alterar-venda-pagamento', dados)
        .then(() => {
          console.log("Venda cancelada com sucesso");
          // funcSucessUpdateVendaPagamento pode ser chamada aqui se existir
        })
        .catch((e) => {
          console.error(e);
          // funcError pode ser chamada aqui se existir
        });
    }
  };

  const onSubmit = async (IDVENDA) => {
    if (valorDistribuir > 0) {
      Swal.fire({
        position: 'top-center',
        icon: 'error',
        title: 'Valor a distribuir é menor que o valor da venda!',
        showConfirmButton: false,
        timer: 1500
      });
      return false;
    }
    if (valorDinheiro > 0) {
      const dadosDinheiro = {
        IDVENDAPAGAMENTO: dadosDetalheRecebimentos[0].IDVENDAPAGAMENTO,
        IDVENDA: dadosDetalheRecebimentos[0].venda.IDVENDA,
        NITEM: '',
        TPAG: '000',
        DSTIPOPAGAMENTO: 'DINHEIRO',
        VALORRECEBIDO: parseFloat(valorDinheiro),
        VALORDEDUZIDO: 0,
        VALORLIQUIDO: parseFloat(valorDinheiro),
        DTPROCESSAMENTO: getDataAtual(),
        STCANCELADO: 'False',
        IDFUNCIONARIO: usuarioLogado.id,

      }
      const response = await post('/alterar-venda-pagamento', dadosDinheiro)

      dadosDetalheRecebimentos[0].venda.VRDINHEIRO = parseFloat(valorDinheiro);
    } else {
      dadosDetalheRecebimentos[0].venda.VRDINHEIRO = 0;
    }

    if (valorPix > 0) {
      const dadosPix = {
        IDVENDAPAGAMENTO: dadosDetalheRecebimentos[0].IDVENDAPAGAMENTO,
        IDVENDA: dadosDetalheRecebimentos[0].venda.IDVENDA,
        NITEM: '',
        TPAG: '031',
        DSTIPOPAGAMENTO: 'PIX',
        VALORRECEBIDO: parseFloat(valorPix),
        VALORDEDUZIDO: 0,
        VALORLIQUIDO: parseFloat(valorPix),
        DTPROCESSAMENTO: getDataAtual(),
        NOTEF: 'PIX',
        NUAUTORIZACAO: nuAutorizacao,
        STCANCELADO: 'False',
        IDFUNCIONARIO: usuarioLogado.id,

      }
      const response = await post('/alterar-venda-pagamento', dadosPix)

      dadosDetalheRecebimentos[0].venda.VRRECPIX = parseFloat(valorPix);
    } else {
      dadosDetalheRecebimentos[0].venda.VRRECPIX = 0;
    }

    if (vrCartao > 0) {

      if(qtdParcelas == 0) {
        let nItemAtual = +1
        let idVendaPagamento = dadosDetalheRecebimentos[0]?.venda.IDVENDA;
        idVendaPagamento = idVendaPagamento + 1;
        const dadosTEF = {
          IDVENDAPAGAMENTO: idVendaPagamento,
          IDVENDA: dadosDetalheRecebimentos[0].venda.IDVENDA,
          NITEM: nItemAtual,
          TPAG: dsTipoPagamentoTEF.substring(0, 3),
          DSTIPOPAGAMENTO: dsTipoPagamentoTEF,
          VALORRECEBIDO: parseFloat(vrCartao),
          VALORDEDUZIDO: 0,
          VALORLIQUIDO: parseFloat(vrCartao),
          DTPROCESSAMENTO: getDataAtual(),
          NPARCELAS: 0,
          NOTEF: 'TEF',
          NUAUTORIZADOR: dsTipoPagamentoTEF,
          NOCARTAO: 'NÃO INFORMADO',
          NUOPERACAO: nuOperacao,
          NSUTEF: nuOperacao,
          NSUAUTORIZADORA: nuOperacao,
          NUAOTORIZACAO: nuAutorizacao,
          STCANCELADO: 'False',
          IDFUNCIONARIO: usuarioLogado.id,
  
        }
        const response = await post('/alterar-venda-pagamento', dadosCartao)
        dadosDetalheRecebimentos[0].venda.VRRECCARTAO = parseFloat(vrCartao);
      }

    }


    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Cadastrado com sucesso!',
      showConfirmButton: false,
      timer: 1500
    })

      .catch(error => {


        console.log(error)
      })

  }

  const handleClickCartão2 = () => {
    setIncluirCartao2(prev => !prev)
  }
  const handleClickCartão3 = () => {
    setIncluirCartao3(prev => !prev)
  }

  const handleClickPos2 = () => {
    setIncluirPos2(prev => !prev)
  }

  const alterarPagamentoVisivel = () => {
    setPagamentos(prev => !prev);
  }

  return (

    <Fragment>

      <div className="pt-5">
        <ButtonType
          cor={pagamentos ? 'success' : 'danger'}
          textButton={'Alterar Pagamentos'}

          onClickButtonType={alterarPagamentoVisivel}
        />
        <hr />
      </div>

      {pagamentos && (
        <>
          <form action="">
            <div class="form-group">
              <div class="row">

                <div class="col-sm-6 col-md-3 col-xl-4">
                  <InputFieldModal
                    className="form-control input"
                    readOnly={true}
                    id="vrDistribuir"
                    label="Restante a Distribuir (menos Voucher)"
                    value={valorDistribuir}
                    onChangeModal={(e) => setValorDistribuir(e.target.value)}
                  />
                </div>

              </div>
              <div class="row mt-4">

                <div class="col-sm-3 col-md-3 col-xl-4">

                  <InputFieldModal
                    className="form-control input"
                    id="vrDinheiro"
                    label="Valor Dinheiro"
                    value={valorDinheiro}
                    onChangeModal={(e) => setValorDinheiro(e.target.value)}
                  />
                </div>
              </div>
              <hr />

            </div>
            <div className="form-group">
              <div className="row">
                <div class="col-sm-6 col-md-2 col-xl-3">

                  <InputFieldModal
                    className="form-control input"
                    id="vrPix"
                    label="Valor PIX"
                    value={valorPix}
                    onChangeModal={(e) => setValorPix(e.target.value)}
                  />
                </div>
                <div class="col-sm-6 col-md-6 col-xl-9">

                  <InputFieldModal
                    className="form-control input"
                    id="nuChavePix"
                    label="Nº Chave PIX"
                    value={nuChavePix}
                    onChangeModal={(e) => setNuChavePix(e.target.value)}
                  />
                </div>
              </div>
              <hr />

            </div>

            <div className="form-group">
              <div className="row">
                <div class="col-sm-6 col-md-6 col-xl-6">
                  <label htmlFor="">Descrição Cartão TEF</label>
                  <Select
                    defaultValue={dsTipoPagamentoTEF}
                    options={optionsPagamentosTef.map((pagamento) => ({
                      value: pagamento.DSTIPOPAGAMENTOTEF,
                      label: pagamento.DSTIPOPAGAMENTOTEF,
                    }))}
                    onChange={(e) => setDsTipoPagamentoTEF(e.value)}
                  />
                </div>
                <div class="col-sm-6 col-md-6 col-xl-3">

                  <InputFieldModal
                    className="form-control input"
                    id="nuOperacao"
                    label="NSU_CTF"
                    value={nuOperacao}
                    onChangeModal={(e) => setNuOperacao(e.target.value)}
                  />
                </div>
                <div class="col-sm-6 col-md-6 col-xl-3">

                  <InputFieldModal
                    className="form-control input"
                    id="nuAutorizacao"
                    label="Nº Autorização"
                    value={nuAutorizacao}
                    onChangeModal={(e) => setNuAutorizacao(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <hr />
            <div className="form-group">
              <div className="row">
                <div class="col-sm-6 col-md-3 col-xl-3">

                  <InputFieldModal
                    className="form-control input"
                    id="vrCartao"
                    label="Valor Cartão"
                    value={vrCartao}
                    onChangeModal={(e) => setVrCartao(e.target.value)}
                  />
                </div>
                <div class="col-sm-6 col-md-6 col-xl-3">

                  <InputFieldModal
                    className="form-control input"
                    id="qtdParcelas"
                    label="Qtd Parcelas"
                    value={qtdParcelas}
                    onChangeModal={(e) => setQtdParcelas(e.target.value)}
                  />
                </div>
                <div class="col-sm-6 col-md-6 col-xl-3">

                  <InputFieldModal
                    className="form-control input"
                    type={'date'}
                    id="dataParcela1"
                    label="Data 1ª Parcela"
                    value={dataParcela1}
                    onChangeModal={(e) => setDataParcela1(e.target.value)}
                  />
                </div>
                <div class="col-sm-6 col-md-6 col-xl-3">

                  <ButtonType
                    cor={incluirCartao2 ? 'warning' : 'success'}
                    textButton={incluirCartao2 ? 'Retirar Cartão 2' : 'Incluir Cartão 2'}
                    onClickButtonType={handleClickCartão2}
                  />
                </div>
              </div>
            </div>

            <hr />

            {/* Início Cartão 2 */}
            {incluirCartao2 && (
              <>
                <div className="form-group">
                  <div className="row">
                    <div class="col-sm-6 col-md-6 col-xl-6">
                      <label htmlFor=""> Descrição Cartão TEF 2 </label>
                      <Select
                        defaultValue={dsTipoPagamentoTEF2}
                        options={optionsPagamentosTef.map((pagamento) => ({
                          value: pagamento.DSTIPOPAGAMENTOTEF,
                          label: pagamento.DSTIPOPAGAMENTOTEF,
                        }))}
                        onChange={(e) => setDsTipoPagamentoTEF2(e.value)}
                      />
                    </div>
                    <div class="col-sm-6 col-md-6 col-xl-3">
                      <InputFieldModal
                        className="form-control input"
                        type={'text'}
                        id="nuOperacao2"
                        label="NSU_CTF 2"
                        value={nuOperacao2}
                        onChangeModal={(e) => setNuOperacao2(e.target.value)}
                      />
                    </div>
                    <div class="col-sm-6 col-md-6 col-xl-3">

                      <InputFieldModal
                        className="form-control input"
                        type={'text'}
                        id="nuAutorizacao2"
                        label="Nº Autorização 2"
                        value={nuAutorizacao2}
                        onChangeModal={(e) => setNuAutorizacao2(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <hr />
                <div className="form-group">
                  <div className="row">
                    <div class="col-sm-6 col-md-3 col-xl-3">

                      <InputFieldModal
                        className="form-control input"
                        id="vrCartao2"
                        label="Valor Cartão 2"
                        value={vrCartao2}
                        onChangeModal={(e) => setVrCartao2(e.target.value)}
                      />
                    </div>
                    <div class="col-sm-6 col-md-6 col-xl-3">

                      <InputFieldModal
                        className="form-control input"
                        type={'number'}
                        id="qtdParcelas2"
                        label="Qtd Parcelas 2"
                        value={qtdParcelas2}
                        onChangeModal={(e) => setQtdParcelas2(e.target.value)}
                      />
                    </div>
                    <div class="col-sm-6 col-md-6 col-xl-3">

                      <InputFieldModal
                        className="form-control input"
                        type={'date'}
                        id="dataParcela2"
                        label="Data 1ª Parcela 2"
                        value={dataParcela2}
                        onChangeModal={(e) => setDataParcela2(e.target.value)}
                      />
                    </div>
                    <div class="col-sm-6 col-md-6 col-xl-3">

                      <ButtonType
                        cor={incluirCartao3 ? 'warning' : 'success'}
                        textButton={incluirCartao3 ? 'Retirar Cartão 3' : 'Incluir Cartão 3'}
                        onClickButtonType={handleClickCartão3}
                      />
                    </div>
                  </div>
                </div>
                <hr />
              </>
            )}

            {/* Fim Cartão 2 */}

            {/* Início Cartão 3 */}

            {incluirCartao3 && (
              <>
                <div className="form-group">
                  <div className="row">
                    <div class="col-sm-6 col-md-6 col-xl-6">
                      <label htmlFor=""> Descrição Cartão TEF 3 </label>
                      <Select
                        defaultValue={dsTipoPagamentoTEF3}
                        options={optionsPagamentosTef.map((pagamento) => ({
                          value: pagamento.DSTIPOPAGAMENTOTEF,
                          label: pagamento.DSTIPOPAGAMENTOTEF,
                        }))}
                        onChange={(e) => setDsTipoPagamentoTEF3(e.value)}
                      />

                    </div>
                    <div class="col-sm-6 col-md-6 col-xl-3">

                      <InputFieldModal
                        className="form-control input"
                        type={'text'}
                        id="nuOperacao3"
                        label="NSU_CTF 3"
                        value={nuOperacao3}
                        onChangeModal={(e) => setNuOperacao3(e.target.value)}
                      />
                    </div>
                    <div class="col-sm-6 col-md-6 col-xl-3">

                      <InputFieldModal
                        className="form-control input"
                        type={'text'}
                        id="nuAutorizacao3"
                        label="Nº Autorização 3"
                        value={nuAutorizacao3}
                        onChangeModal={(e) => setNuAutorizacao3(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <hr />
                <div className="form-group">
                  <div className="row">
                    <div class="col-sm-6 col-md-3 col-xl-3">

                      <InputFieldModal
                        className="form-control input"
                        type={'text'}
                        id="vrCartao3"
                        label="Valor Cartão 3"
                        value={vrCartao3}
                        onChangeModal={(e) => setVrCartao3(e.target.value)}
                      />
                    </div>
                    <div class="col-sm-6 col-md-6 col-xl-3">

                      <InputFieldModal
                        className="form-control input"
                        type={'number'}
                        id="qtdParcelas3"
                        label="Qtd Parcelas 3"
                        value={qtdParcelas3}
                        onChangeModal={(e) => setQtdParcelas3(e.target.value)}
                      />
                    </div>
                    <div class="col-sm-6 col-md-6 col-xl-3">

                      <InputFieldModal
                        className="form-control input"
                        type={'date'}
                        id="dataParcela3"
                        label="Data 1ª Parcela 3"
                        value={dataParcela3}
                        onChangeModal={(e) => setDataParcela3(e.target.value)}
                      />
                    </div>

                  </div>

                </div>
                <hr />
              </>
            )}

            {/* Fim Cartão 3 */}

            {/* Início POS  */}

            <div className="form-group">
              <div className="row">
                <div class="col-sm-6 col-md-6 col-xl-6">
                  <label htmlFor=""> Descrição POS </label>
                  <Select
                    defaultValue={dsTipoPagamentoPOS}
                    options={optionsPagamentosPOS.map((pagamento) => ({
                      value: pagamento.DSTIPOPAGAMENTOPOS,
                      label: pagamento.DSTIPOPAGAMENTOPOS,
                    }))}
                    onChange={(e) => setDsTipoPagamentoPOS(e.value)}
                  />
                </div>
                <div class="col-sm-6 col-md-6 col-xl-3">

                  <InputFieldModal
                    className="form-control input"
                    type={"text"}
                    id="nuOperacaoPOS"
                    label="NSU_CTF "
                    value={nuOperacaoPOS}
                    onChangeModal={(e) => setNuOperacaoPOS(e.target.value)}
                  />
                </div>
                <div class="col-sm-6 col-md-6 col-xl-3">

                  <InputFieldModal
                    className="form-control input"
                    type={"text"}
                    id="nuAutorizacaoPOS"
                    label="Nº Autorização "
                    value={nuAutorizacaoPOS}
                    onChangeModal={(e) => setNuAutorizacaoPOS(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <div className="row">
                <div class="col-sm-6 col-md-3 col-xl-3">

                  <InputFieldModal
                    className="form-control input"
                    id="vrPos"
                    type={"text"}
                    label="Valor POS"
                    value={vrPos}
                    onChangeModal={(e) => setVrPos(e.target.value)}
                  />
                </div>
                <div class="col-sm-6 col-md-6 col-xl-3">

                  <InputFieldModal
                    className="form-control input"
                    id="qtdParcelasPOS"
                    type={"number"}
                    label="Qtd Parcelas"
                    value={qtdParcelasPOS}
                    onChangeModal={(e) => setQtdParcelasPOS(e.target.value)}
                  />
                </div>
                <div class="col-sm-6 col-md-6 col-xl-3">

                  <InputFieldModal
                    className="form-control input"
                    type={'date'}
                    id="dataParcelaPOS"
                    label="Data 1ª Parcela"
                    value={dataParcelaPOS}
                    onChangeModal={(e) => setDataParcelaPOS(e.target.value)}
                  />
                </div>
                <div class="col-sm-6 col-md-6 col-xl-3">

                  <ButtonType
                    cor={incluirPos2 ? 'warning' : 'success'}
                    textButton={incluirPos2 ? 'Retirar POS 2' : 'Incluir POS 2'}
                    onClickButtonType={handleClickPos2}
                  />
                </div>
              </div>
            </div>

            {/* Fim POS  */}
            <hr />

            {/* Início POS  2*/}

            {incluirPos2 && (
              <>
                <div className="form-group">
                  <div className="row">
                    <div class="col-sm-6 col-md-6 col-xl-6">
                      <label htmlFor=""> Descrição POS 2</label>
                      <Select
                        defaultValue={dsTipoPagamentoPOS2}
                        options={optionsPagamentosPOS.map((pagamento) => ({
                          value: pagamento.DSTIPOPAGAMENTOPOS,
                          label: pagamento.DSTIPOPAGAMENTOPOS,
                        }))}
                        onChange={(e) => setDsTipoPagamentoPOS2(e.value)}
                      />

                    </div>
                    <div class="col-sm-6 col-md-6 col-xl-3">

                      <InputFieldModal
                        className="form-control input"
                        type={"text"}
                        id="nuOperacaoPOS2"
                        label="NSU_CTF 2"
                        value={nuOperacaoPOS2}
                        onChangeModal={(e) => setNuOperacaoPOS2(e.target.value)}
                      />
                    </div>
                    <div class="col-sm-6 col-md-6 col-xl-3">

                      <InputFieldModal
                        className="form-control input"
                        type={"text"}
                        id="nuAutorizacaoPOS2"
                        label="Nº Autorização 2"
                        value={nuAutorizacaoPOS2}
                        onChangeModal={(e) => setNuAutorizacaoPOS2(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <div className="row">
                    <div class="col-sm-6 col-md-3 col-xl-3">

                      <InputFieldModal
                        className="form-control input"
                        type={"text"}
                        id="vrPos2"
                        label="Valor POS 2"
                        value={vrPos2}
                        onChangeModal={(e) => setVrPos2(e.target.value)}
                      />
                    </div>
                    <div class="col-sm-6 col-md-6 col-xl-3">

                      <InputFieldModal
                        className="form-control input"
                        type={"number"}
                        id="qtdParcelasPOS2"
                        label="Qtd Parcelas 2"
                        value={qtdParcelasPOS2}
                        onChangeModal={(e) => setQtdParcelasPOS2(e.target.value)}
                      />
                    </div>
                    <div class="col-sm-6 col-md-6 col-xl-3">

                      <InputFieldModal
                        className="form-control input"
                        type={'date'}
                        id="dataParcelaPOS2"
                        label="Data 1ª Parcela 2"
                        value={dataParcelaPOS2}
                        onChangeModal={(e) => setDataParcelaPOS2(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Fim POS  2*/}

            <hr />
            <div className="form-group">
              <div className="row">
                <div class="col-sm-6 col-md-4 col-xl-4">
                  <InputFieldModal
                    className="form-control input"
                    readOnly={true}
                    label="Valor Voucher"
                    value={vrVoucher}
                    onChangeModal={(e) => setVrVoucher(e.target.value)}
                  />
                </div>
                <div class="col-sm-6 col-md-4 col-xl-4">
                  <InputFieldModal
                    className="form-control input"
                    readOnly={true}
                    label="Nº Voucher"
                    value={nuVoucher}
                    onChangeModal={(e) => setNuVoucher(e.target.value)}
                  />
                </div>
              </div>

            </div>
            <div className="form-group">
              <div className="row">
                <div class="col-sm-12">

                  <InputFieldModal
                    className="form-control input"
                    id={"motivoAlteracao"}
                    type={"text"}
                    label="Motivo da Alteração"
                    value={motivoAlteracao}
                    onChangeModal={(e) => setMotivoAlteracao(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </form>
        </>
      )}
    </Fragment>
  )
}