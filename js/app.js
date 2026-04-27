// Base de dados de salários (valores mensais em R$)
const baseSalaries = {
    desenvolvedor: { junior: 3500, pleno: 6500, senior: 12000, especialista: 20000 },
    engenheiro: { junior: 4500, pleno: 8500, senior: 15000, especialista: 25000 },
    cientista: { junior: 5000, pleno: 10000, senior: 18000, especialista: 30000 },
    analista: { junior: 3000, pleno: 5500, senior: 9500, especialista: 15000 },
    product: { junior: 4000, pleno: 8000, senior: 14000, especialista: 22000 },
    ux: { junior: 3000, pleno: 6000, senior: 11000, especialista: 18000 },
    devops: { junior: 4000, pleno: 9000, senior: 16000, especialista: 26000 },
    qa: { junior: 3000, pleno: 5500, senior: 10000, especialista: 16000 },
    mobile: { junior: 3500, pleno: 7000, senior: 13000, especialista: 21000 },
    frontend: { junior: 3500, pleno: 7000, senior: 13000, especialista: 21000 },
    backend: { junior: 4000, pleno: 8000, senior: 14500, especialista: 23000 },
    fullstack: { junior: 3800, pleno: 7500, senior: 14000, especialista: 22000 },
    security: { junior: 4500, pleno: 9500, senior: 17000, especialista: 28000 },
    cloud: { junior: 5000, pleno: 11000, senior: 19000, especialista: 32000 },
    gerente: { junior: 6000, pleno: 12000, senior: 20000, especialista: 35000 },
    cto: { junior: 15000, pleno: 25000, senior: 40000, especialista: 60000 }
};

const multipliers = {
    regiao: {
        sp: 1.15, rj: 1.10, mg: 0.95, rs: 1.00, pr: 1.02,
        sc: 0.98, df: 1.12, ba: 0.85, pe: 0.82, ce: 0.80, remoto: 1.20
    },
    formacao: {
        tecnico: 0.90, bacharel: 1.00, pos: 1.08, mestrado: 1.15, doutorado: 1.25
    },
    empresa: {
        startup: 0.95, pequena: 0.98, media: 1.00, grande: 1.10, enterprise: 1.20
    },
    idiomas: {
        0: 1.00, 1: 1.05, 2: 1.15, 3: 1.25
    }
};

const skillMultipliers = {
    python: 1.05, javascript: 1.03, react: 1.08, aws: 1.10,
    docker: 1.06, kubernetes: 1.12, sql: 1.04, machine: 1.15,
    typescript: 1.05, go: 1.10, rust: 1.12, blockchain: 1.08
};

/**
 * Formata um valor para moeda brasileira
 * @param {number} value - Valor a ser formatado
 * @returns {string} - Valor formatado como moeda
 */
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

/**
 * Obtém as habilidades selecionadas
 * @returns {array} - Array de habilidades selecionadas
 */
function getCheckedSkills() {
    const skills = [];
    document.querySelectorAll('.checkbox-item input:checked').forEach(cb => {
        skills.push(cb.value);
    });
    return skills;
}

/**
 * Calcula o salário estimado baseado nos parâmetros
 * @returns {object} - Objeto com salário calculado e detalhes
 */
function calcularSalario() {
    const cargo = document.getElementById('cargo').value;
    const nivel = document.getElementById('nivel').value;
    const anos = parseFloat(document.getElementById('anos').value);
    const regiao = document.getElementById('regiao').value;
    const formacao = document.getElementById('formacao').value;
    const empresa = document.getElementById('empresa').value;
    const idiomas = document.getElementById('idiomas').value;
    const skills = getCheckedSkills();

    // Base
    let base = baseSalaries[cargo][nivel];

    // Ajuste por anos de experiência (interpolação entre níveis)
    const niveis = ['junior', 'pleno', 'senior', 'especialista'];
    const idx = niveis.indexOf(nivel);
    if (idx < 3) {
        const nextNivel = niveis[idx + 1];
        const nextBase = baseSalaries[cargo][nextNivel];
        const gap = nextBase - base;
        // Progressão dentro do nível (0-5 anos = 0-40% do gap)
        const progress = Math.min(anos / 5, 1) * 0.4;
        base += gap * progress;
    }

    // Aplicar multiplicadores
    const fatores = [
        { nome: 'Cargo Base', valor: base, ajuste: 1.0, impacto: 'Base' }
    ];

    // Região
    const multRegiao = multipliers.regiao[regiao];
    base *= multRegiao;
    fatores.push({ nome: 'Região', valor: base / multRegiao, ajuste: multRegiao, impacto: `${((multRegiao-1)*100).toFixed(0)}%` });

    // Formação
    const multForm = multipliers.formacao[formacao];
    base *= multForm;
    fatores.push({ nome: 'Formação', valor: base / multForm, ajuste: multForm, impacto: `${((multForm-1)*100).toFixed(0)}%` });

    // Empresa
    const multEmp = multipliers.empresa[empresa];
    base *= multEmp;
    fatores.push({ nome: 'Tamanho Empresa', valor: base / multEmp, ajuste: multEmp, impacto: `${((multEmp-1)*100).toFixed(0)}%` });

    // Idiomas
    const multIdi = multipliers.idiomas[idiomas];
    base *= multIdi;
    fatores.push({ nome: 'Idiomas', valor: base / multIdi, ajuste: multIdi, impacto: `${((multIdi-1)*100).toFixed(0)}%` });

    // Skills
    let skillMult = 1.0;
    skills.forEach(skill => {
        if (skillMultipliers[skill]) {
            skillMult += (skillMultipliers[skill] - 1);
        }
    });
    // Cap skill bonus
    skillMult = Math.min(skillMult, 1.5);
    base *= skillMult;
    fatores.push({ nome: 'Habilidades', valor: base / skillMult, ajuste: skillMult, impacto: `${((skillMult-1)*100).toFixed(0)}%` });

    // Ajuste de mercado 2026
    const inflacao = 1.08;
    base *= inflacao;
    fatores.push({ nome: 'Ajuste Mercado 2026', valor: base / inflacao, ajuste: inflacao, impacto: '+8%' });

    return {
        salario: Math.round(base),
        min: Math.round(base * 0.85),
        max: Math.round(base * 1.15),
        fatores: fatores,
        skills: skills,
        percentil: Math.min(50 + (skills.length * 5) + (anos * 2), 95),
        confianca: Math.max(70, 95 - (skills.length * 1.5))
    };
}

/**
 * Executa a previsão de salário e exibe os resultados
 */
function preverSalario() {
    const resultado = calcularSalario();

    // Hide empty state, show results
    document.getElementById('empty-state').style.display = 'none';
    document.getElementById('results-content').style.display = 'block';
    document.getElementById('fatores-panel').style.display = 'block';

    // Update salary card
    document.getElementById('salario-mensal').textContent = formatCurrency(resultado.salario);
    document.getElementById('salario-min').textContent = formatCurrency(resultado.min);
    document.getElementById('salario-max').textContent = formatCurrency(resultado.max);
    document.getElementById('salario-anual').textContent = formatCurrency(resultado.salario * 13);

    // Update stats
    document.getElementById('percentil').textContent = resultado.percentil + 'º';
    document.getElementById('confianca').textContent = Math.round(resultado.confianca) + '%';
    document.getElementById('clt-vs-pj').textContent = resultado.salario > 15000 ? 'PJ' : 'CLT';

    // Update factors
    renderFactors(resultado.fatores);

    // Update charts
    renderBarChart();
    renderEvolutionChart();
    renderDetailsTable(resultado.fatores);
    renderHeatmap();
}

/**
 * Renderiza os fatores de impacto
 * @param {array} fatores - Array de fatores
 */
function renderFactors(fatores) {
    const container = document.getElementById('factors-list');
    container.innerHTML = '';
    
    const colors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];
    
    fatores.slice(1).forEach((fator, i) => {
        const impact = ((fator.ajuste - 1) * 100);
        const color = impact >= 0 ? colors[i % colors.length] : '#ef4444';
        const width = Math.min(Math.abs(impact) * 3, 100);
        
        const div = document.createElement('div');
        div.className = 'factor-item';
        div.innerHTML = `
            <div class="factor-name">
                <span style="color:${color}">●</span>
                ${fator.nome}
            </div>
            <div class="factor-bar">
                <div class="factor-fill" style="width:${width}%; background:${color};"></div>
            </div>
            <div class="factor-percent" style="color:${color}">${impact > 0 ? '+' : ''}${impact.toFixed(0)}%</div>
        `;
        container.appendChild(div);
    });
}

/**
 * Renderiza o gráfico de barras comparativo por região
 */
function renderBarChart() {
    const regioes = [
        { nome: 'SP', key: 'sp' },
        { nome: 'RJ', key: 'rj' },
        { nome: 'MG', key: 'mg' },
        { nome: 'RS', key: 'rs' },
        { nome: 'PR', key: 'pr' },
        { nome: 'DF', key: 'df' },
        { nome: 'Remoto', key: 'remoto' }
    ];

    const cargo = document.getElementById('cargo').value;
    const nivel = document.getElementById('nivel').value;
    const base = baseSalaries[cargo][nivel];

    const container = document.getElementById('bar-chart');
    container.innerHTML = '';

    const valores = regioes.map(r => base * multipliers.regiao[r.key]);
    const maxVal = Math.max(...valores);

    regioes.forEach((reg, i) => {
        const val = valores[i];
        const height = (val / maxVal) * 100;
        const isSelected = reg.key === document.getElementById('regiao').value;
        
        const item = document.createElement('div');
        item.className = 'bar-item';
        item.innerHTML = `
            <div class="bar-value">${(val/1000).toFixed(1)}k</div>
            <div class="bar" style="height:${height}%; background:${isSelected ? 'var(--primary)' : 'var(--surface-light)'}"></div>
            <div class="bar-label">${reg.nome}</div>
        `;
        container.appendChild(item);
    });
}

/**
 * Renderiza o gráfico de evolução salarial
 */
function renderEvolutionChart() {
    const cargo = document.getElementById('cargo').value;
    const anos = parseFloat(document.getElementById('anos').value);
    const container = document.getElementById('evolution-chart');
    container.innerHTML = '';

    const niveis = ['Junior', 'Pleno', 'Senior', 'Especialista'];
    const valores = niveis.map((n, i) => {
        const key = ['junior', 'pleno', 'senior', 'especialista'][i];
        return baseSalaries[cargo][key];
    });

    const maxVal = Math.max(...valores);

    niveis.forEach((nivel, i) => {
        const val = valores[i];
        const height = (val / maxVal) * 100;
        const isCurrent = i === niveis.indexOf(document.getElementById('nivel').value.charAt(0).toUpperCase() + document.getElementById('nivel').value.slice(1).toLowerCase());
        
        const item = document.createElement('div');
        item.className = 'bar-item';
        item.innerHTML = `
            <div class="bar-value">${(val/1000).toFixed(1)}k</div>
            <div class="bar" style="height:${height}%; background:${isCurrent ? 'var(--secondary)' : 'var(--surface-light)'}"></div>
            <div class="bar-label">${nivel}</div>
        `;
        container.appendChild(item);
    });
}

/**
 * Renderiza a tabela de detalhes do cálculo
 * @param {array} fatores - Array de fatores
 */
function renderDetailsTable(fatores) {
    const tbody = document.getElementById('details-table');
    tbody.innerHTML = '';

    fatores.forEach(fator => {
        const impact = ((fator.ajuste - 1) * 100);
        const tagClass = impact > 0 ? 'tag-green' : impact < 0 ? 'tag-red' : 'tag-yellow';
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${fator.nome}</td>
            <td>${formatCurrency(fator.valor)}</td>
            <td>${fator.ajuste.toFixed(2)}x</td>
            <td><span class="tag ${tagClass}">${impact > 0 ? '+' : ''}${impact.toFixed(0)}%</span></td>
        `;
        tbody.appendChild(tr);
    });
}

/**
 * Renderiza o heatmap de demanda sazonal
 */
function renderHeatmap() {
    const container = document.getElementById('heatmap');
    container.innerHTML = '';
    
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const cargo = document.getElementById('cargo').value;
    
    // Simular dados sazonais baseados no cargo
    const baseDemanda = {
        desenvolvedor: [7,6,8,9,8,7,6,8,9,10,9,8],
        cientista: [6,5,7,8,9,8,7,8,9,10,9,8],
        devops: [8,7,8,9,9,8,7,9,10,10,9,8],
        default: [6,6,7,8,8,7,6,7,8,9,8,7]
    };
    
    const demanda = baseDemanda[cargo] || baseDemanda.default;
    
    demanda.forEach((d, i) => {
        const cell = document.createElement('div');
        cell.className = 'heatmap-cell tooltip';
        cell.setAttribute('data-tip', `${meses[i]}: ${d}/10`);
        const opacity = d / 10;
        cell.style.background = `rgba(99, 102, 241, ${opacity})`;
        container.appendChild(cell);
    });
}

/**
 * Alterna entre abas de conteúdo
 * @param {string} tabName - Nome da aba
 */
function switchTab(tabName) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    
    event.target.classList.add('active');
    document.getElementById(`tab-${tabName}`).classList.add('active');
}

/**
 * Limpa o formulário e volta ao estado inicial
 */
function limparForm() {
    document.getElementById('cargo').selectedIndex = 0;
    document.getElementById('nivel').selectedIndex = 1;
    document.getElementById('anos').value = 3;
    document.getElementById('anos-val').textContent = '3';
    document.getElementById('regiao').selectedIndex = 0;
    document.getElementById('formacao').selectedIndex = 1;
    document.getElementById('empresa').selectedIndex = 2;
    document.getElementById('idiomas').selectedIndex = 1;
    
    document.querySelectorAll('.checkbox-item input').forEach(cb => cb.checked = false);
    document.querySelectorAll('.checkbox-item input')[0].checked = true;
    
    document.getElementById('empty-state').style.display = 'block';
    document.getElementById('results-content').style.display = 'none';
    document.getElementById('fatores-panel').style.display = 'none';
}

// Range slider update
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('anos').addEventListener('input', function() {
        document.getElementById('anos-val').textContent = this.value;
    });
});
