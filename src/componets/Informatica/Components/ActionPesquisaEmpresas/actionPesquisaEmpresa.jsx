import { Fragment, useState } from "react"
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../../../../utils/animationCarregamento"
import { ActionMain } from "../../../Actions/actionMain"
import { useQuery } from "react-query"
import { InputSelectAction } from "../../../Inputs/InputSelectAction"
import { get } from "../../../../api/funcRequest"
import { ButtonType } from "../../../Buttons/ButtonType"
import { AiOutlineSearch } from "react-icons/ai"
import { ActionListaEmpresas } from "./actionListaEmpresas"

export const ActionPesquisEmpresa = ({ usuarioLogado, ID }) => {
    const [tableVisivel, setTableVisible] = useState(false)
    const [empresaSelecionada, setEmpresaSelecionada] = useState("")
    const [empresaSelecionadaNome, setEmpresaSelecionadaNome] = useState('')
    const [isLoadingPesquisa, setIsLodingPesquisa] = useState(false)
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(1000);

    const { data: optionModulos = [], error: errorModulos, isLoading: isLoadingModulos, refetch: refetchModulos } = useQuery(
        "menus-usuarios-excecao",
        async () => {
            const response = await get(`/menus-usuario-excecao?idUsuario=${usuarioLogado?.id}&idMenuFilho=${ID}`);
            return response.data;
        },
        { enabled: Boolean(usuarioLogado?.id), staleTime: 60 * 60 * 1000, }

    );
    const { data: optionsEmpresas = [], error: errorEmpresas, isLoading: isLoadingEmpresas, refetch: refetchEmpresas } = useQuery(
        "empresas",
        async () => {
            const response = await get(`/empresas`);
            return response.data;
        },
        { enabled: true, staleTime: 60 * 60 * 1000, }

    );

    const fetchListEmpresas = async () => {
        try {
            const urlApi = `/listaEmpresas?idEmpresa=${empresaSelecionada}`
            const response = await get(urlApi)

            if (response.data.lenght && response.data.lenght === pageSize) {
                let allData = [...response.data];
                animacaoCarregamento(`Carregand...Página ${currentPage} de ${response.data.lenght}`, true);

                async function fetchNextPage(currentPage) {
                    try {
                        currentPage++;
                        const responseNextPage = await get(`${urlApi}&page=${currentPage}`)
                        if (responseNextPage.lenght) {
                            allData.push(...responseNextPage.data);
                            return fetchNextPage(currentPage)
                        } else {
                            return allData;
                        }
                    } catch (error) {
                        console.logo("Error ao buscar proxima página:", error);
                        throw error;
                    }
                }

                await fetchNextPage(currentPage);
                return allData;
            } else {
                return response.data;
            }
        } catch (error) {
            console.log("erro ao buscar dados:", error);
            throw error;
        } finally {
            fecharAnimacaoCarregamento();

        }

    }

    const { data: dadosEmpresas = [], error: errorListaEmpresas, isLoading: isLoadingEmpresa, refetch: refetchListaEmpresa } = useQuery(
        ["empresa"],
        () => fetchListEmpresas(),
        { enabled: false, staleTime: 5 * 60 * 1000 }
    );

    const handleChangeEmpresa = (e) => {
        if (e.value === "") {
            setEmpresaSelecionada("")
        } else {
            const empresa = optionsEmpresas.find((item) => item.IDEMPRESA === e.value);
            setEmpresaSelecionada(e.value)
            setEmpresaSelecionadaNome(empresa.NOFANTASIA);
        }
    }

    const handleClick = () => {
        setCurrentPage(prevPage => prevPage + 1);
        refetchListaEmpresa()
        setTableVisible(true)

    }
    return (
        <Fragment>
            <ActionMain
                linkComponentAnterior={["Home"]}
                linkComponent={["Empresas"]}
                title="Empresas"
                subTitle={empresaSelecionadaNome}

                InputSelectEmpresaComponent={InputSelectAction}
                onChangeSelectEmpresa={handleChangeEmpresa}
                valueSelectEmpresa={empresaSelecionada}

                optionsEmpresas={[
                    { value: '', label: 'Selecione' },
                    ...optionsEmpresas.map((empresa) => ({
                        value: empresa.IDEMPRESA,
                        label: empresa.NOFANTASIA,
                    }))
                ]}
                labelSelectEmpresa={"Empresa"}

                ButtonSearchComponent={ButtonType}
                linkNomeSearch={"Pesquisar"}
                onButtonClickSearch={handleClick}
                corSearch={"primary"}
                IconSearch={AiOutlineSearch}

            />

            <ActionListaEmpresas
                dadosEmpresas={dadosEmpresas}
                optionsModulos={optionModulos}
                usuarioLogado={usuarioLogado}

            />
        </Fragment>
    );
}