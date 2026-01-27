import React, { Fragment, useEffect, useState } from "react"
import { ActionListaAlvaras } from "./actionListaAlvaraEmpresa";
import { ActionMain } from "../../../Actions/actionMain";
import { ButtonType } from "../../../Buttons/ButtonType";
import { AiOutlineSearch } from "react-icons/ai";
import { InputField } from "../../../Buttons/Input";
import { get } from "../../../../api/funcRequest";
import { useQuery } from "react-query";
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../../../../utils/animationCarregamento";
import Swal from "sweetalert2";
import { InputSelectAction } from "../../../Inputs/InputSelectAction";
import { useFetchData, useFetchEmpresasContabilidade } from "../../../../hooks/useFetchData";

export const ActionPesquisaAlvaraEmpresa = () => {
    const [tabelaVisivel, setTabelaVisivel] = useState(false);
    const [produto, setProduto] = useState('')
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(1000);
    const [marcaSelecionada, setMarcaSelecionada] = useState('');

    const { data: marcas = [], error: errorMarcas, isLoading: isLoadingMarcas } = useFetchData('marcasLista', '/marcasLista');
    const { data: empresas = [], } = useFetchEmpresasContabilidade(marcaSelecionada);

    console.log(marcas, 'marcaSelecionada')

    const fetchListaProdutos = async () => {
        try {

            const urlApi = `/buscar-produtos?descProd=${produto}`;
            const response = await get(urlApi);

            if (response.data.length && response.data.length === pageSize) {
                let allData = [...response.data];
                animacaoCarregamento(`Carregando... Página ${currentPage} de ${response.data.length}`, true);

                async function fetchNextPage(currentPage) {
                    try {
                        currentPage++;
                        const responseNextPage = await get(`${urlApi}&page=${currentPage}`);
                        if (responseNextPage.length) {
                            allData.push(...responseNextPage.data);
                            return fetchNextPage(currentPage);
                        } else {
                            return allData;
                        }
                    } catch (error) {
                        console.error('Erro ao buscar próxima página:', error);
                        throw error;
                    }
                }

                await fetchNextPage(currentPage);
                return allData;
            } else {

                return response.data;
            }
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
            throw error;
        } finally {
            fecharAnimacaoCarregamento();
        }
    };


    const { data: dadosProdutos = [], error: errorProdutos, isLoading: isLoadingProdutos, refetch: refetchListaProdutos } = useQuery(
        ['buscar-produtos', produto, currentPage, pageSize],
        fetchListaProdutos,
        { enabled: Boolean(produto.length > 5), staleTime: 5 * 60 * 1000 },
    );


    const handleClick = () => {
        //setCurrentPage(prevPage => prevPage + 1)
        refetchListaProdutos()
        setTabelaVisivel(true);
    }

    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === 'Enter') {
                handleClick();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, []);

    return (

        <Fragment>
            <ActionMain
                linkComponentAnterior={["Home"]}
                linkComponent={["Alvarás Empresas"]}
                title="Alvarás Empresas"
                subTitle

                InputSelectUFComponent={InputSelectAction}
                labelSelectUF={'UF'}
                optionsSelectUF={[
                    { value: "", label: "Todos" },
                    ...empresas.map((marca) => ({
                        value: marca.IDEMPRESA,
                        label: marca.NOFANTASIA
                    }))
                ]}
                valueSelectUF={produto}
                onChangeSelectUF={(e) => setProduto(e.target.value)}

                InputSelectMarcaComponentAync={InputSelectAction}
                labelSelectMarcaAsync={'Marca'}
                optionsMarcas={[
                    { value: "", label: "Todos" },
                    ...empresas.map((marca) => ({
                        value: marca.IDEMPRESA,
                        label: marca.NOFANTASIA
                    }))
                ]}
                valueSelectMarcaAsync={produto}
                onChangeSelectMarcaAsync={(e) => setProduto(e.target.value)}

                InputSelectFilialComponent={InputSelectAction}
                labelSelectFilial={'Filiais'}
                optionsFilial={[
                    { value: "", label: "Todos" },
                    ...empresas.map((marca) => ({
                        value: marca.IDEMPRESA,
                        label: marca.NOFANTASIA
                    }))
                ]}
                //valueSelectMarcaAsync={produto}
                //onChangeSelectMarcaAsync={(e) => setProduto(e.target.value)}

                InputSelectStatusFiliaisComponent={InputSelectAction}
                LabelSelectStatusFiliais={'Status Filiais'}
                optionStatusFiliais={[
                    { value: "", label: "Todos" },
                    ...empresas.map((marca) => ({
                        value: marca.IDEMPRESA,
                        label: marca.NOFANTASIA
                    }))
                ]}
                valueSelectStatusFiliais={produto}
                onChangeStatusFiliais={(e) => setProduto(e.target.value)}

                InputSelectAlvarasComponent={InputSelectAction}
                LabelSelectAlvaras={'Alvarás'}
                optionAlvaras={[
                    { value: "", label: "Todos" },
                    ...empresas.map((marca) => ({
                        value: marca.IDEMPRESA,
                        label: marca.NOFANTASIA
                    }))
                ]}
                valueSelectAlvaras={produto}
                onChangeAlvaras={(e) => setProduto(e.target.value)}

                ButtonSearchComponent={ButtonType}
                linkNomeSearch={"Pesquisar"}
                onButtonClickSearch={handleClick}
                corSearch={"primary"}
                IconSearch={AiOutlineSearch}

            />


            {tabelaVisivel && (
                <ActionListaAlvaras
                    dadosProdutos={dadosProdutos}
                />
            )}

        </Fragment>
    )
}

