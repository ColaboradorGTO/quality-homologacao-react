import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { adicionarMeses, getDataAtual } from "../utils/dataAtual";
import { post, put } from "../api/funcRequest";
import { useNavigate } from "react-router-dom";
import { toFloat } from "../utils/toFloat";


export const usePagamento = (dadosDetalheRecebimentos) => {
  const [incluirCartao2, setIncluirCartao2] = useState(false);
  const [incluirCartao3, setIncluirCartao3] = useState(false);
  const [incluirPos2, setIncluirPos2] = useState(false);
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
  const [itemAtual, setItemAtual] = useState(0);

  const [usuarioLogado, setUsuarioLogado] = useState(null)

  const navigate = useNavigate();
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
    const dataAtual = getDataAtual();
    setDataParcela1(dataAtual);
    setDataParcela2(dataAtual);
    setDataParcela3(dataAtual);
  }, [])

  useEffect(() => {
    setValorDistribuir(parseFloat(dadosDetalheRecebimentos[0]?.venda.VRTOTALVENDA));
    setItemAtual(dadosDetalheRecebimentos[0]?.vendaPagamento[0]?.pag.NITEM);
    // console.log('itemAtual', dadosDetalheRecebimentos[0]);
  }, [dadosDetalheRecebimentos]);
  useEffect(() => {
    const dinheiro = toFloat(valorDinheiro);
    const pix = toFloat(valorPix);
    const cartao1 = toFloat(vrCartao);
    const cartao2 = toFloat(vrCartao2);
    const cartao3 = toFloat(vrCartao3);
    const pos = toFloat(vrPos);
    const pos2 = toFloat(vrPos2);
    const voucher = toFloat(vrVoucher);
    const somaValores = toFloat(dinheiro )+ toFloat(pix) + toFloat(cartao1) + toFloat(cartao2) + toFloat(cartao3) + toFloat(pos) + toFloat(pos2) + toFloat(voucher);
    const somaDiferenca = toFloat(dadosDetalheRecebimentos[0]?.venda.VRTOTALVENDA) - toFloat(somaValores);
    
    setValorDistribuir(toFloat(somaDiferenca).toFixed(2));
  }, [valorDinheiro, valorPix, vrCartao, vrCartao2, vrCartao3, vrPos, vrPos2, vrVoucher, dadosDetalheRecebimentos]);
  
  // console.log('itemAtual fora da function', itemAtual);

  const enviarPagamento = async (itemAtual) => {
    let valorDinheiroPagamento = 0;
    let valorPixPagamento = 0;
    let valorCartaoPagamento = 0;
    let valorCartaoPagamento2 = 0;
    let valorCartaoPagamento3 = 0;
    let valorPosPagamento = 0;
    let valorPosPagamento2 = 0;
    let valorVoucherPagamento = 0;
    console.log(itemAtual, 'itemAtual eviarPagamento');

 
    if (valorDistribuir > 0) {
      Swal.fire({
        position: 'top-center',
        icon: 'error',
        title: 'Valor a distribuir é menor que o valor da venda!',
        showConfirmButton: false,
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      });
      return false;
    }
    if (valorDinheiro > 0) {
      let nItemAtual = itemAtual + 1
      let idVendaPagamento = dadosDetalheRecebimentos[0]?.venda.IDVENDA + '-';
      idVendaPagamento = idVendaPagamento + nItemAtual;
      console.log(idVendaPagamento, 'idVendaPagamento');
      const dadosDinheiro = [{
        IDVENDAPAGAMENTO: idVendaPagamento,
        IDVENDA: dadosDetalheRecebimentos[0].venda.IDVENDA,
        NITEM: nItemAtual,
        TPAG: '000',
        DSTIPOPAGAMENTO: 'DINHEIRO',
        VALORRECEBIDO: parseFloat(valorDinheiro),
        VALORDEDUZIDO: 0,
        VALORLIQUIDO: parseFloat(valorDinheiro),
        DTPROCESSAMENTO: dataParcela1,
        STCANCELADO: 'False',
        IDFUNCIONARIO: usuarioLogado.id,
        
      }]
      console.log('dadosDinheiro', dadosDinheiro);
      const responseDinheiro = await post('/alterar-venda-pagamento', dadosDinheiro)

      valorDinheiroPagamento = parseFloat(valorDinheiro);

      return responseDinheiro.data;
    } else {
      valorDinheiroPagamento  = 0;
    }

    if (valorPix > 0) {
      if (nuAutorizacao == '') {
        Swal.fire({
          position: 'top-center',
          icon: 'error',
          title: 'Informe a chave PIX!',
          showConfirmButton: false,
          timer: 3000,
          customClass: {
            container: 'custom-swal',
          }
        });
        return false;
      }
        let nItemAtual = itemAtual + 1
        let idVendaPagamento = dadosDetalheRecebimentos[0]?.venda.IDVENDA + '-';
        idVendaPagamento = idVendaPagamento + nItemAtual;

      const dadosPix = [{
        IDVENDAPAGAMENTO: idVendaPagamento,
        IDVENDA: dadosDetalheRecebimentos[0].venda.IDVENDA,
        NITEM: nItemAtual,
        TPAG: '031',
        DSTIPOPAGAMENTO: 'PIX',
        VALORRECEBIDO: parseFloat(valorPix),
        VALORDEDUZIDO: 0,
        VALORLIQUIDO: parseFloat(valorPix),
        DTPROCESSAMENTO: dataParcela1,
        NOTEF: 'PIX',
        NUAUTORIZACAO: nuAutorizacao,
        STCANCELADO: 'False',
        IDFUNCIONARIO: usuarioLogado.id,

      }]
      console.log('dadosPix', dadosPix);
      const responsePix = await post('/alterar-venda-pagamento', dadosPix)

      valorPixPagamento = parseFloat(valorPix);
      
      return responsePix.data;
    } else {
      valorPixPagamento = 0;
    }

    let vrTotalCartao = valorCartaoPagamento + valorCartaoPagamento2 + valorCartaoPagamento3;
    let vrTotalPos = valorPosPagamento + valorPosPagamento2 + valorPixPagamento;
    let vrConvenioPagamento = dadosDetalheRecebimentos[0].venda.VRRECCONVENIO
    const atualizarVenda = [{
      IDVENDA: dadosDetalheRecebimentos[0].venda.IDVENDA,
      VRRECDINHEIRO: parseFloat(valorDinheiroPagamento),
      VRRECCONVENIO: parseFloat(vrConvenioPagamento),
      VRRECCHEQUE: 0,
      VRRECCARTAO: vrTotalCartao,
      VRRECPOS: vrTotalPos,
      VRRECVOUCHER: valorVoucherPagamento,
    }]
    console.log('atualizarVenda', atualizarVenda);
    const response = await put('/atualiza-recebimento-venda/:id', atualizarVenda)

    return response.data;
  }

  const cancelarVendaPagamento = () => {


    if (valorDistribuir > 0) {

      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Distribua o valor restante.',
        showConfirmButton: false,
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      })
      return false;
    } else {
      const dados = [{
        IDVENDA: dadosDetalheRecebimentos[0].venda.IDVENDA,
        STCANCELADO: 'True',
        DTULTIMAALTERACAO: getDataAtual(),
        IDFUNCIONARIOCANCELA: usuarioLogado.id,
        TXTMOTIVOCANCELA: motivoAlteracao
      }];
      const response = put('/alterar-venda-pagamento/:id', dados)
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Venda Alterada com sucesso!',
        showConfirmButton: false,
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      })
      enviarPagamento();
      return response.data;
    }
  };

  return {
    valorDistribuir,
    setValorDistribuir,
    valorDinheiro,
    setValorDinheiro,
    valorPix,
    setValorPix,
    nuChavePix,
    setNuChavePix,
    dsTipoPagamentoTEF,
    setDsTipoPagamentoTEF,
    nuOperacao,
    setNuOperacao,
    nuAutorizacao,
    setNuAutorizacao,
    vrCartao,
    setVrCartao,
    dataParcela2,
    setDataParcela2,
    dsTipoPagamentoTEF2,
    setDsTipoPagamentoTEF2,
    nuOperacao2,
    setNuOperacao2,
    nuAutorizacao2,
    setNuAutorizacao2,
    vrCartao2,
    setVrCartao2,
    qtdParcelas,
    setQtdParcelas,
    qtdParcelas2,
    setQtdParcelas2,
    dataParcela3,
    setDataParcela3,
    dsTipoPagamentoTEF3,
    setDsTipoPagamentoTEF3,
    nuOperacao3,
    setNuOperacao3,
    nuAutorizacao3,
    setNuAutorizacao3,
    vrCartao3,
    setVrCartao3,
    qtdParcelas3,
    setQtdParcelas3,
    dsTipoPagamentoPOS,
    setDsTipoPagamentoPOS,
    nuOperacaoPOS,
    setNuOperacaoPOS,
    nuAutorizacaoPOS,
    setNuAutorizacaoPOS,
    vrPos,
    setVrPos,
    qtdParcelasPOS,
    setQtdParcelasPOS,
    dataParcelaPOS,
    setDataParcelaPOS,
    dsTipoPagamentoPOS2,
    setDsTipoPagamentoPOS2,
    nuOperacaoPOS2,
    setNuOperacaoPOS2,
    nuAutorizacaoPOS2,
    setNuAutorizacaoPOS2,
    vrPos2,
    setVrPos2,
    qtdParcelasPOS2,
    setQtdParcelasPOS2,
    dataParcelaPOS2,
    setDataParcelaPOS2,
    vrVoucher,
    setVrVoucher,
    nuVoucher,
    setNuVoucher,
    motivoAlteracao,
    setMotivoAlteracao,
    dataParcela1,
    setDataParcela1,
    pagamentos,
    setPagamentos,
    incluirCartao2,
    setIncluirCartao2,
    incluirCartao3,
    setIncluirCartao3,
    incluirPos2,
    setIncluirPos2,
    enviarPagamento,
    cancelarVendaPagamento
  };
};