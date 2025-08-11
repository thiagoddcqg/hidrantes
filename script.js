document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("hydrantForm");
    const tableBody = document.querySelector("#hydrantTable tbody");

    carregarHidrantes();

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const location = document.getElementById("location").value;
        const idNumber = document.getElementById("idNumber").value;
        const status = document.getElementById("status").value;
        const date = new Date().toLocaleString("pt-BR");

        try {
            const res = await fetch('/salvar', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ idNumber, location, status, date })
            });

            if (!res.ok) throw new Error(await res.text());
            carregarHidrantes();
        } catch (err) {
            console.error("Erro:", err);
        }

        form.reset();
    });

    async function carregarHidrantes() {
        tableBody.innerHTML = "";
        try {
            const res = await fetch('/listar');
            const hidrantes = await res.json();

            hidrantes.forEach((h, index) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${h.idNumber}</td>
                    <td>${h.location}</td>
                    <td class="status-${h.status}">${h.status}</td>
                    <td>${h.date}</td>
                    <td><button class="delete-btn" data-index="${index}">Excluir</button></td>
                `;
                tableBody.appendChild(row);
            });

            // Eventos de exclusão
            document.querySelectorAll(".delete-btn").forEach(btn => {
                btn.addEventListener("click", async (e) => {
                    const index = e.target.getAttribute("data-index");
                    if (confirm("Tem certeza que deseja excluir este hidrante?")) {
                        try {
                            const res = await fetch(`/excluir/${index}`, { method: 'DELETE' });
                            if (!res.ok) throw new Error(await res.text());
                            carregarHidrantes();
                        } catch (err) {
                            console.error("Erro ao excluir:", err);
                        }
                    }
                });
            });

        } catch (err) {
            console.error("Erro ao carregar hidrantes:", err);
        }
    }
});
