document.addEventListener("DOMContentLoaded", () => {
        const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRC7AUh6YhiNZL3voXtVm_DvlOm8CLdggqieudGn5ixzADFp5vTftHlwop9C1WFy7bXV9tDh7fZUOK5/pub?gid=160486505&single=true&output=csv";
        let eventos = [];

        const normalize = k => k ? k.replace(/\s+/g, " ").trim().toUpperCase() : "";
        const nameKeys = ["NOME DO EVENTO", "NOME", "EVENTO"];
        const localKeys = ["LOCAL", "LOCALIDADE", "ENDEREÇO"];
        const dataInicioKeys = ["DATA DO INICIO", "DATA DE INICIO", "DATA", "DATA_INICIO"];
        const dataFimKeys = ["DATA DO ENCERRAMENTO", "DATA DO FIM", "DATA_FIM"];

        function getField(row, candidates, headerMap) {
            for (let k of candidates) {
                const nk = normalize(k);
                const originalKey = headerMap[nk];
                if (originalKey && row[originalKey] !== undefined && String(row[originalKey]).trim() !== "") {
                    return String(row[originalKey]).trim();
                }
            }
            return "";
        }

        function renderEventos(lista) {
            const container = document.getElementById("lista-eventos");
            container.innerHTML = "";

            if (!lista.length) {
                container.innerHTML = "<p>Nenhum evento encontrado.</p>";
                return;
            }

            lista.forEach(e => {
                let dataDisplay = "A definir";
                if (e.dataInicio && e.dataFim) dataDisplay = `${e.dataInicio} — ${e.dataFim}`;
                else if (e.dataInicio) dataDisplay = e.dataInicio;
                else if (e.dataFim) dataDisplay = e.dataFim;

                const rotaUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(e.local)}`;

                const card = `
                <article class="evento">
                    <h3>${e.nome}</h3>
                    <div class="meta">
                        <p><strong>📍 Local:</strong> ${e.local}</p>
                        <p><strong>📅 Data:</strong> ${dataDisplay}</p>
                    </div>
                    <a href="${rotaUrl}" target="_blank" class="btnAbrirRota">
                        <i class="ri-road-map-line"></i> Traçar rota
                    </a>
                </article>
            `;
                container.insertAdjacentHTML("beforeend", card);
            });
        }

        Papa.parse(csvUrl, {
            download: true,
            header: true,
            skipEmptyLines: true,
            complete: results => {
                const rows = results.data;
                const headerMap = {};
                (results.meta.fields || []).forEach(originalKey => {
                    headerMap[normalize(originalKey)] = originalKey;
                });

                eventos = rows.map(row => ({
                    nome: getField(row, nameKeys, headerMap) || "Sem título",
                    local: getField(row, localKeys, headerMap) || "Não informado",
                    dataInicio: getField(row, dataInicioKeys, headerMap),
                    dataFim: getField(row, dataFimKeys, headerMap)
                }));

                const hoje = new Date();
                eventos = eventos.filter(e => {
                    if (!e.dataInicio) return false;
                    const inicio = new Date(e.dataInicio.split("/").reverse().join("-"));
                    const fim = e.dataFim ? new Date(e.dataFim.split("/").reverse().join("-")) : inicio;
                    return fim >= hoje;
                });

                renderEventos(eventos);
            }
        });

        // ===== Filtro por data =====
        document.getElementById("filtroData").addEventListener("change", function () {
            const dataSelecionada = this.value;
            if (!dataSelecionada) {
                renderEventos(eventos);
                return;
            }

            const filtrados = eventos.filter(e => {
                if (!e.dataInicio) return false;
                const dataPlanilha = new Date(e.dataInicio.split("/").reverse().join("-"));
                const dataInput = new Date(dataSelecionada);
                return (
                    dataPlanilha.getFullYear() === dataInput.getFullYear() &&
                    dataPlanilha.getMonth() === dataInput.getMonth() &&
                    dataPlanilha.getDate() === dataInput.getDate()
                );
            });

            renderEventos(filtrados);
        });
    });