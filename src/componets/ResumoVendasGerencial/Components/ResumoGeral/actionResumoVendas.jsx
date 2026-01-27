// import { Fragment, useEffect, useState } from "react"
// import { ResultadoResumo } from "../../Components/ResumoCards/ResultadoResumo"
// import { formatMoeda } from "../../../../utils/formatMoeda"
// import { toFloat } from "../../../../utils/toFloat"
// import { FaCashRegister, FaRegLightbulb, FaRegMoneyBillAlt } from "react-icons/fa"
// import { MdOutlinePayment } from "react-icons/md"
// import { BsGem } from "react-icons/bs"
// import { getDataAtual, getDataAtualMesAnoAnterior, getDataDiaMesAnoAnterior, getDataPrimeiroDiaMes, getHoraAtual, mesAno, mesAnoAnterior } from "../../../../utils/dataAtual"
// import { ActionListaVendasTesoura } from "./actionListaVendasTesoura"
// import { ActionListaVendasFreecenter } from "./actionListaVendasFreecenter"
// import { ActionListaVendasMagazine } from "./actionListaVendasMagazine"
// import { useQuery } from "react-query"
// import { get } from "../../../../api/funcRequest"



// export const ActionResumoVendas = () => {
//   const [dataPesquisa, setDataPesquisa] = useState('')
//   const [dataPesquisaMagazine, setDataPesquisaMagazine] = useState('')
//   const [dataPesquisaFreecenter, setDataPesquisaFreecenter] = useState('')
//   const [dataAno, setDataAno] = useState('')
//   const [dataAnoAnterior, setDataAnoAnterior] = useState('')
//   const [dataPesquisaAnoAnterior, setDataPesquisaAnoAnterior] = useState('')
//   const [dataPesquisaInicio, setDataPesquisaInicio] = useState('')
//   const [dataPesquisaFim, setDataPesquisaFim] = useState('')
//   const [dataPrimeiroDia, setDataPrimeiroDia] = useState('')
//   const [dataAtualDoAnoPassado, setDataAtualDoAnoPassado] = useState('')
//   const [hora, setHora] = useState('');

//   useEffect(() => {
//     const dataAtual = getDataAtual();
//     const horaAtual = getHoraAtual();
//     const mesAtual = mesAno()
//     const anoAnterior = mesAnoAnterior()
//     const anoAnteriorPesquisa = getDataDiaMesAnoAnterior()
//     const primeiroDiaMes = getDataPrimeiroDiaMes();
//     const dataAtualAnoAnterior = getDataAtualMesAnoAnterior();
//     setDataAtualDoAnoPassado(dataAtualAnoAnterior)
//     setHora(horaAtual);
//     setDataPesquisa(dataAtual);
//     setDataPesquisaMagazine(dataAtual);
//     setDataPesquisaFreecenter(dataAtual);
//     setDataPesquisaInicio(dataAtual);
//     setDataPesquisaFim(dataAtual);
//     setDataAnoAnterior(anoAnterior);
//     setDataAno(mesAtual);
//     setDataPesquisaAnoAnterior(anoAnteriorPesquisa);
//     setDataPrimeiroDia(primeiroDiaMes);


//   }, []);


//   const { data: dadosTotalMes = [],
//     error: errorTotalMes,
//     isLoading: isLoadingTotalMes, refetch: refetchTotalMes } = useQuery(
//     'vendas-total-mes',
//     async () => {
//       const response = await get(`/vendas-total-mes?dataPesquisaInicio=${dataPrimeiroDia}&dataPesquisaFim=${dataPesquisaFim}&horaFinal=${hora}`);
     
//       return response.data;
//     },
//     {
//       enabled: Boolean(dataPrimeiroDia && dataPesquisaFim && hora), staleTime: 0, refetchInterval: 10000
//     }
//   );

//   const dadosTotalMesAtual = dadosTotalMes.map((item) => {
//     return {
//       VALORTOTALMES: item.VALORTOTALMES
//     }
//   })

//   const { data: dadosTotalAnoMesAnterior = [],
//     error: errorTotalAnoMesAnterior,
//     isLoading: isLoadingTotalAnoMesAnterior, refetch: refetchTotalAnoMesAnterior } = useQuery(
//     'vendas-total-mes-ano-passado',
//     async () => {
//       const response = await get(`/vendas-total-mes-ano-passado?dataPesquisaInicio=${dataPesquisaAnoAnterior}&dataPesquisaFim=${dataAtualDoAnoPassado}&horaFinal=${hora}`);
//       return response.data;
//     },
//     {
//       enabled: Boolean(dataPesquisaAnoAnterior && dataAtualDoAnoPassado && hora), staleTime: 0, refetchInterval: 10000
//     }
//   );

//   const dadosTotalMesAtualAnoAnterior = dadosTotalAnoMesAnterior.map((item) => {
//     return {
//       VALORTOTALMESANOANTERIOR: item.VALORTOTALMES
//     }
//   })

//   const { data: dadosTotalLojaHora = [],
//     error: errorTotalLojaHora,
//     isLoading: isLoadingTotalLojaHora, refetch: refetchTotalLojaHora } = useQuery(
//       'vendas-total-loja-hora',
//       async () => {
//         const response = await get(`/vendas-total-loja-hora?dataPesquisa=${dataPesquisa}&horaFinal=23:59:59`);
//         return response.data;
//       },
//       {
//         enabled: Boolean(dataPesquisa && hora), staleTime: 0, refetchInterval: 10000
//       }
//     );

//   const dadosTotalLoja = dadosTotalLojaHora.map((item) => {
//     const totalVendaDiaAtual = toFloat(item.VALORTOTALDINHEIRO) + toFloat(item.VALORTOTALCARTAO) + toFloat(item.VALORTOTALCONVENIO) + toFloat(item.VALORTOTALPOS)

//     return {
//       VALORTOTAL: item.VALORTOTAL,
//       VALORTOTALPOS: item.VALORTOTALPOS,
//       VALORTOTALCARTAO: item.VALORTOTALCARTAO,
//       VALORTOTALDINHEIRO: item.VALORTOTALDINHEIRO,
//       VALORTOTALCONVENIO: item.VALORTOTALCONVENIO,
//       VALORTOTALFATURA: item.VALORTOTALFATURA,
//       VALORTOTALCREDSYSTEM: item.VALORTOTALCREDSYSTEM,
//       totalVendaDiaAtual
//     }
//   })

//   const { data: dadosTotalLojaHoraAnoAnterior = [],
//     error: errorTotalLojaHoraAnoAnterior,
//     isLoading: isLoadingTotalLojaHoraAnoAnterior, refetch: refetchTotalLojaHoraAnoAnterior } = useQuery(
//       'vendas-total-loja-hora-ano-passado',
//       async () => {
//         const response = await get(`/vendas-total-loja-hora-ano-passado?dataPesquisa=${dataAtualDoAnoPassado}&horaFinal=${hora}`);
//         return response.data;
//       },
//       {
//         enabled: Boolean(dataAtualDoAnoPassado && hora), staleTime: 0, refetchInterval: 10000
//       }
//     );

//   const dadosTotalLojaAnoAnterior = dadosTotalLojaHoraAnoAnterior.map((item) => {
//     const totalVendaDiaAtualAnoPassado = toFloat(item.VALORTOTALDINHEIRO) + toFloat(item.VALORTOTALCARTAO) + toFloat(item.VALORTOTALCONVENIO) + toFloat(item.VALORTOTALPOS)

//     return {
//       VALORTOTAL: item.VALORTOTAL,
//       VALORTOTALPOS: item.VALORTOTALPOS,
//       VALORTOTALCARTAO: item.VALORTOTALCARTAO,
//       VALORTOTALDINHEIRO: item.VALORTOTALDINHEIRO,
//       VALORTOTALCONVENIO: item.VALORTOTALCONVENIO,
//       VALORTOTALFATURA: item.VALORTOTALFATURA,
//       VALORTOTALCREDSYSTEM: item.VALORTOTALCREDSYSTEM,
//       totalVendaDiaAtualAnoPassado
//     }
//   })

//   const {data: dadosTotalTesoura = [], 
//       error: errorTotalTesoura, 
//       isLoading: isLoadingTotalTesoura,   refetch: refetchTesoura } = useQuery(
//       'venda-total',
//       async () => {
//         const response = await get(`/vendas-total-to?dataPesquisa=${dataPesquisa}&idGrupo=1`);   
        
//         return response.data;
//       },
//       {
//         enabled: true, staleTime: 0, refetchInterval: 10000, refetchIntervalInBackground: true
//       }
//   );

//   const { data: dadosTotalFreecenter = [], 
//       error: errorTotalFreecenter, 
//       isLoading: isLoadingTotalFreecenter,  refetch: refetchFreecenter } = useQuery(
//       'vendas-total-freecenter',
//       async () => {
//         const response = await get(`/vendas-total-freecenter?dataPesquisaFreecenter=${dataPesquisaFreecenter}`);   
       
//         return response.data;
//       },
//       {
//         enabled: true, staleTime: 0, refetchInterval: 10000, refetchIntervalInBackground: true
//       }
//   );

//   const { data: dadosTotalMagazine = [],    error: errorTotalMagazine, 
//       isLoading: isLoadingTotalMagazine,  refetch: refetchMagazine } = useQuery(
//       'vendas-total-magazine',
//       async () => {
//         const response = await get(`/vendas-total-magazine?dataPesquisaMagazine=${dataPesquisaMagazine}`);  
  
//         return response.data;
//       },
//       {
//         enabled: true, staleTime: 0, refetchInterval: 10000, refetchIntervalInBackground: true
//       }
//   );

//   const { data: dadosTotalOutleet = [], error: errorTotalOutleet, 
//       isLoading: isLoadingTotalOutleet, refetch: refetchOutleet } = useQuery(
//       'venda-total',
//       async () => {
//         const response = await get(`/vendas-total-to?dataPesquisa=${dataPesquisa}&idGrupo=4`);   
//         return response.data;
//       },
//       {
//         enabled: Boolean(dataPesquisa), staleTime: 5 * 60 * 1000, refetchInterval: 15000
//       }
//   );

//   function devolverDiaSemana(diaSemana) {
//     var dias = ['Domingo', 'Segunda-Feira', 'Terca-Feira', 'Quarta-Feira', 'Quinta-Feira', 'Sexta-Feira', 'Sabado'];
//     return dias[new Date().getDay()];
//   }

//   useEffect(() => {
//     const interval = setInterval(() => {
//       refetchFreecenter();  // 🎯 Força o refetch manualmente a cada 15s
//       refetchMagazine();
//       refetchTesoura();
//       refetchTotalMes();
//       refetchTotalAnoMesAnterior();
//       refetchTotalLojaHora();
//       refetchTotalLojaHoraAnoAnterior();
//     }, 10000);

//     return () => clearInterval(interval); // Limpa ao desmontar
//   }, [refetchFreecenter, refetchMagazine, refetchTesoura, refetchTotalMes, refetchTotalAnoMesAnterior, refetchTotalLojaHora, refetchTotalLojaHoraAnoAnterior]);
//   return (
//     <Fragment>
//       <header>
//         <h1 className="h3 mb-3"> {`GTO Dashboard Vendas do Dia ${devolverDiaSemana()} ${dataPesquisa}`}</h1>
//       </header>
//       <ResultadoResumo
//         cardVendas={true}
//         textoMesVendas={`Venda Total Mês - ${dataAno}`}
//         porcentoVendas={'1%'}
//         valorVendas={formatMoeda(toFloat(dadosTotalMesAtual[0]?.VALORTOTALMES))}
//         valorVendasAnterior={`${formatMoeda(toFloat(dadosTotalMesAtualAnoAnterior[0]?.VALORTOTALMESANOANTERIOR))} Venda Total Mês - ${dataAnoAnterior}`}
//         IconVendas={FaRegMoneyBillAlt}

//         cardTotal={true}
//         textoMesTotal={`Dinheiro Cartão - POS - Convênio `}
//         porcentoTotal={'1%'}
//         valorTotal={formatMoeda(toFloat(dadosTotalLoja[0]?.totalVendaDiaAtual))}
//         valorTotalAnterior={`${formatMoeda(toFloat(dadosTotalLojaAnoAnterior[0]?.totalVendaDiaAtualAnoPassado))} Dinheiro Cartão - POS - Convênio - ${dataAnoAnterior}`}

//         cardPos={true}
//         textoMesPos={`POS Hoje - ${dataAno}`}
//         porcentoPos={'1%'}
//         valorPos={formatMoeda(toFloat(dadosTotalLojaHora[0]?.VALORTOTALPOS))}
//         valorPosAnterior={`${formatMoeda(toFloat(dadosTotalLojaAnoAnterior[0]?.VALORTOTALPOS))} POS - ${dataAnoAnterior}`}
//         IconPos={MdOutlinePayment}

//         cardCartao={true}
//         textoMesCartao={`Cartão Hoje `}
//         porcentoCartao={'1%'}
//         valorCartao={formatMoeda(toFloat(dadosTotalLojaHora[0]?.VALORTOTALCARTAO))}
//         valorCartaoAnterior={`${formatMoeda(toFloat(dadosTotalLojaHoraAnoAnterior[0]?.VALORTOTALCARTAO))} Cartão - ${dataAnoAnterior}`}
//         IconCartao={BsGem}

//         cardDinheiro={true}
//         textoMesDinheiro={`Dinheiro Hoje - ${dataAno}`}
//         porcentoDinheiro={'1%'}
//         valorDinheiro={formatMoeda(toFloat(dadosTotalLojaHora[0]?.VALORTOTALDINHEIRO))}
//         valorDinheiroAnterior={`${formatMoeda(toFloat(dadosTotalLojaHoraAnoAnterior[0]?.VALORTOTALDINHEIRO))} Dinheiro - ${dataAnoAnterior}`}
//         IconDinheiro={FaCashRegister}

//         cardConvenio={true}
//         textoMesConvenio={`Convênio Hoje `}
//         porcentoConvenio={'1%'}
//         valorConvenio={formatMoeda(toFloat(dadosTotalLojaHora[0]?.VALORTOTALCONVENIO))}
//         valorConvenioAnterior={`${formatMoeda(toFloat(dadosTotalLojaHoraAnoAnterior[0]?.VALORTOTALCONVENIO))} Convênio - ${dataAnoAnterior}`}
//         IconConvenio={FaRegLightbulb}

//         cardFatura={true}
//         textoMesFatura={`Fatura Hoje `}
//         porcentoFatura={'1%'}
//         valorFatura={formatMoeda(toFloat(dadosTotalLojaHora[0]?.VALORTOTALFATURA))}
//         valorFaturaAnterior={`${formatMoeda(toFloat(dadosTotalLojaHoraAnoAnterior[0]?.VALORTOTALFATURA))} Fatura - ${dataAnoAnterior}`}
//         IconFatura={FaRegLightbulb}

//         cardCredsystem={true}
//         textoMesCredsystem={`Credsystem - Hoje `}
//         porcentoCredsystem={'1%'}
//         valorCredsystem={formatMoeda(toFloat(dadosTotalLojaHora[0]?.VALORTOTALCREDSYSTEM))}
//         valorCredsystemAnterior={`${formatMoeda(toFloat(dadosTotalLojaHoraAnoAnterior[0]?.VALORTOTALCREDSYSTEM))} Credsystem - ${dataAnoAnterior}`}
//         IconCredsystem={FaRegLightbulb}

//         iconSize={100}
//         iconColor="white"
//       />

//       <div className="row">
//         <div className="col-sm-6 col-md-6 col-lg-4 col-xl-4">

//           <ActionListaVendasTesoura dadosTotalTesoura={dadosTotalTesoura} />
//         </div>

//         <div className="col-sm-6 col-md-6 col-lg-4 col-xl-4">

//           <ActionListaVendasMagazine dadosTotalMagazine={dadosTotalMagazine} />
//         </div>

//         <div className="col-sm-6 col-md-6 col-lg-4 col-xl-4">

//           <ActionListaVendasFreecenter dadosTotalFreecenter={dadosTotalFreecenter} />
//         </div>
//       </div>
//     </Fragment>
//   )
// }